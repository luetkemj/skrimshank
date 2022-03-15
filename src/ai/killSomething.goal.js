import { aStar } from "../lib/pathfinding";
import Motor from "../ecs/components/Motor.component";
import { isNeighbor } from "../lib/grid";
import { createGoal } from "../lib/ecsHelpers";
import * as MoveToGoal from "./moveTo.goal";
import { getState } from "../index";

export const isFinished = (goal) => {
  const { parent, data } = goal;
  if (data.target.isDead) {
    return true;
  } else {
    return false;
  }
};

export const takeAction = (goal) => {
  const { parent, data } = goal;
  const { target } = data;

  if (!isNeighbor(parent.position, target.position)) {
    const path = aStar(parent.position, target.position);

    const step = path[0];
    const moveToGoal = createGoal(MoveToGoal, "Move To Goal");
    moveToGoal.data = { x: step[0], y: step[1], z: getState().z };
    parent.brain.pushGoal(moveToGoal);

    parent.fireEvent("take-action");

    // optionally add many steps - but this causes other issues...
    // a good choice for things that happen out of view or against NPC entities
    // path.reverse().forEach((step) => {
    //   const moveToGoal = createGoal(MoveToGoal, "Move To Goal");
    //   moveToGoal.data = { x: step[0], y: step[1], z: getState().z };
    //   parent.brain.pushGoal(moveToGoal);
    // });

    return;
  }

  // try melee
  if (isNeighbor(parent.position, target.position)) {
    // for now we just punch the target
    console.log(`${parent.display.name} is hitting ${target.display.name}`);
    target.fireEvent("ApplyDamage", { value: 1 });

    return;
  }
};
