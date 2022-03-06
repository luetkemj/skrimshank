import { Component } from "geotic";

import { getEntity } from "../../lib/ecsHelpers";

import { world } from "../../ecs/index";

export default class Brain extends Component {
  // goals are entities with a goal component
  // goal component is
  // { isFinished<boolean>, takeAction<func>, originalIntent<goalEntityId> }

  static properties = {
    goalIds: [],
  };

  onDestroyed() {
    this.goalIds.forEach((eid) => {
      getEntity(eid).destroy();
    });
  }

  onTakeAction(evt) {
    while (
      this.peekGoal() &&
      this.peekGoal().goal.isFinished(this.peekGoal())
    ) {
      this.popGoal().entity.destroy();
    }

    const currentGoal = this.peekGoal();

    if (currentGoal) {
      currentGoal.goal.takeAction(currentGoal);
      this.removeGoal(currentGoal);
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
    const eid = this.goalIds.pop().goal;
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
