import Motor from "../ecs/components/Motor.component";
import { isNeighbor } from "../lib/grid";

export const isFinished = (goal) => {
  const { parent, data } = goal;
  // if is already at position
  if (parent.position.x === data.x && parent.position.y === data.y) {
    return true;
  }

  // if (!isNeighbor(parent.position, data)) {
  //   return true;
  // }

  return false;
};

export const takeAction = (goal) => {
  const { parent, data } = goal;
  if (parent.has(Motor)) {
    console.log("my goal is to move!", goal);
    parent.fireEvent("tryMove", { position: data });
  }
};
