import { aStar } from "../lib/pathfinding";
import { isNeighbor } from "../lib/grid";
import { createGoal, getEntity } from "../lib/ecsHelpers";
import * as ApproachTargetGoal from "./approachTarget.goal";
import { getState } from "../index";

export const isInvalid = (goal) => {
  return isFinished(goal);
};

export const isFinished = (goal) => {
  const { parent, data } = goal;
  if (data.target.health && data.target.health.current <= 0) {
    return true;
  } else {
    return false;
  }
};

export const takeAction = (goal) => {
  const { parent, data } = goal;
  const { target } = data;

  if (!isNeighbor(parent.position, target.position)) {
    // approach Target
    const approachTargetGoal = createGoal(
      ApproachTargetGoal,
      "Approach Target Goal"
    );

    console.log(approachTargetGoal);

    approachTargetGoal.data = {};
    approachTargetGoal.data.target = target;
    approachTargetGoal.data.x = target.position.x;
    approachTargetGoal.data.y = target.position.y;

    parent.brain.pushGoal(approachTargetGoal);
    parent.fireEvent("take-action");

    // const path = aStar(parent.position, target.position);

    // // const step = path[0];
    // // const moveToGoal = createGoal(MoveToGoal, "Move To Goal");
    // // moveToGoal.data = { x: step[0], y: step[1], z: getState().z };
    // // parent.brain.pushGoal(moveToGoal);

    // // parent.fireEvent("take-action");

    // // optionally add many steps - but this causes other issues...
    // // a good choice for things that happen out of view or against NPC entities
    // path.reverse().forEach((step) => {
    //   const moveToGoal = createGoal(MoveToGoal, "Move To Goal");
    //   moveToGoal.data = { x: step[0], y: step[1], z: getState().z };
    //   parent.brain.pushGoal(moveToGoal);
    // });

    parent.fireEvent("take-action");

    return;
  }

  // try melee
  if (isNeighbor(parent.position, target.position)) {
    // check if entity is wielding something
    // if no weapon, check if entity can wield something
    // if can wield something check if there is a weapon nearby
    // if nearby weapon, fire getLoot goal with weapon as target, once an item has been aquired, continue
    // if no weapon is nearby, user natural ability (punch, claw, bite, etc)

    const primaryWeaponId = parent?.equipmentSlot?.leftHand?.contentId || null;

    if (primaryWeaponId) {
      const weapon = getEntity(primaryWeaponId);

      // get damage types and apply damage
      if (weapon) {
        const evt = weapon.fireEvent("get-damage-types", { damageTypes: [] });
        target.fireEvent("ApplyDamage", {
          interactor: parent,
          interactee: target,
          weapon,
          damageTypes: evt.data.damageTypes,
        });
      }
    }

    return;
  }
};
