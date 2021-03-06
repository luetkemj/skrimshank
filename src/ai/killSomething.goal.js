import { sample } from "lodash";
import { isAtSamePosition, isNeighbor } from "../lib/grid";
import { createGoal, getEntity } from "../lib/ecsHelpers";
import * as ApproachTargetGoal from "./approachTarget.goal";

export const isInvalid = (goal) => {
  const { parent, data } = goal;
  if (data.target.health && data.target.health.current <= 0) {
    return true;
  }
};

export const isFinished = (goal) => {
  const { parent, data } = goal;
  if (data.target.health && data.target.health.current <= 0) {
    return true;
  }
};

export const takeAction = (goal) => {
  const { parent, data } = goal;
  const { target } = data;

  if (
    !isAtSamePosition(parent.position, target.position) &&
    !isNeighbor(parent.position, target.position)
  ) {
    // approach Target
    const approachTargetGoal = createGoal({
      goal: ApproachTargetGoal,
      name: "Approach Target Goal",
      ogIntent: goal.originalIntent,
      // x,y because we want to cache the target position at time of create so we can test if it has moved
      data: { target, ...target.position },
    });

    parent.brain.pushGoal(approachTargetGoal);
    parent.fireEvent("take-action");

    return true;
  }

  // components should have the tryMelee event
  // then this should do the reach out
  // and then call try melee on one of the entities nearby

  // try melee
  if (isNeighbor(parent.position, target.position)) {
    // check if entity is wielding something
    // if no weapon, check if entity can wield something
    // if can wield something check if there is a weapon nearby
    // if nearby weapon, fire getLoot goal with weapon as target, once an item has been aquired, continue
    // if no weapon is nearby, user natural ability (punch, claw, bite, etc)

    // call this on parent AND on all items in inventory - also need to pass in interactor and interactee
    const interactions = [];

    parent.fireEvent("get-melee-interactions", {
      interactions,
      interactee: target,
      interactor: parent,
    });

    if (parent.inventory) {
      parent.inventory.contentIds.forEach((eId) => {
        getEntity(eId).fireEvent("get-melee-interactions", {
          interactions,
          interactee: target,
          interactor: parent,
        });
      });
    }

    const interaction = sample(interactions);
    const { interactant, interactee, interactor } = interaction;
    interactant.fireEvent(interaction.evt, {
      interactant,
      interactee,
      interactor,
    });

    return true;
  }
};
