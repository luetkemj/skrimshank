import { Component } from "geotic";
import { createGoal, getEntity } from "../../lib/ecsHelpers";
import * as BoredGoal from "../../ai/bored.goal";
import { world } from "../index";

export default class Brain extends Component {
  // goals are entities with a goal component
  // goal component is
  // { isFinished<boolean>, takeAction<func>, originalIntent<goalEntityId> }

  static properties = {
    goalIds: [],
  };

  onAttached() {
    this.goalIds = [];

    if (!this.goalIds.length) {
      const goal = createGoal({ goal: BoredGoal, name: "Bored Goal" });
      this.pushGoal(goal);
    }
  }

  onDestroyed() {
    this.goalIds.forEach((eid) => {
      getEntity(eid).destroy();
    });
  }

  removeFinishedGoals() {
    while (
      this.peekGoal() &&
      this.peekGoal().goal.isFinished(this.peekGoal())
    ) {
      const goal = this.popGoal();
      goal.destroy();
    }
  }

  fallBackToOriginalIntent(eId) {
    while (this.peekGoal() && this.peekGoal().goal.id !== eId) {
      if (this.peekGoal().goal.isBored) break;

      const goal = this.popGoal();
      goal.destroy();
    }

    return this.peekGoal();
  }

  onTakeAction(evt) {
    this.removeFinishedGoals();

    const currentGoal = this.peekGoal();

    if (currentGoal) {
      let currentValidGoal = currentGoal;
      // if INVALID, destroy all goals until we get to an original intent goal, or the base bored goal
      if (currentValidGoal.goal.isInvalid(currentValidGoal)) {
        currentValidGoal = this.fallBackToOriginalIntent(
          currentValidGoal.goal.originalIntent
        );
      }

      currentValidGoal.goal.takeAction(currentValidGoal);
    }

    evt.handle();
  }

  removeGoal(goal) {
    const goalsToDestroy = [];

    this.goalIds = this.goalIds.filter((gid) => {
      const gEnt = getEntity(gid);

      const isSelf = Boolean(gEnt.id === goal.id);
      const isSiblingGoal = Boolean(
        gEnt.goal.originalIntent &&
          gEnt.goal.originalIntent.id === goal.goal.originalIntent.id
      );

      if (isSelf || isSiblingGoal) {
        goalsToDestroy.push(gEnt.goal);
        return false;
      }

      return true;
    });

    goalsToDestroy.forEach((gEnt) => gEnt.destroy());
  }

  pushGoal(goal) {
    goal.parent = this.entity;
    return this.goalIds.push(goal.id);
  }

  popGoal() {
    const eid = this.goalIds.pop();
    return getEntity(eid);
  }

  peekGoal() {
    // if we always have a bored goal, we don't need to check for eid...
    const eid = this.goalIds[this.goalIds.length - 1];
    if (eid) {
      return getEntity(eid);
    }
  }
}
