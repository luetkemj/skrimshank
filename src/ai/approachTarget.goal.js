import { aStar } from "../lib/pathfinding";
import { isNeighbor } from "../lib/grid";
import { createGoal, getEntity } from "../lib/ecsHelpers";
import * as MoveToGoal from "./moveTo.goal";
import { getState } from "../index";

export const isInvalid = (goal) => {
  const { data, parent } = goal;
  // invalid if approach target has moved
  if (data.target.position.x !== data.x && data.target.position.y !== data.y) {
    return true;
  }

  // invalid if approach target is at the same position as parent
  if (
    parent.position.x === data.target.position.x &&
    parent.position.y === data.target.position.y
  ) {
    return true;
  }

  return false;
};

// finished when adjacent to approach target
export const isFinished = (goal) => {
  const { parent, data } = goal;
  const { target } = data;
  if (isNeighbor(parent.position, target.position)) {
    return true;
  } else {
    return false;
  }
};

export const takeAction = (goal) => {
  const { parent, data } = goal;
  const { target } = data;

  const path = aStar(parent.position, target.position);

  path.reverse().forEach((step) => {
    const moveToGoal = createGoal({
      goal: MoveToGoal,
      name: "Move To Goal",
      data: { x: step[0], y: step[1], z: getState().z },
    });
    parent.brain.pushGoal(moveToGoal);
  });

  parent.fireEvent("take-action");

  return;
};
