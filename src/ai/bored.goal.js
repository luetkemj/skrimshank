// this goal should kick off other goals.
// If no other goal is interested in kicking off - then you can do idle actions
// This goal is never done.
// actionTypes: [IDLE]
import { sample } from "lodash";
import { world } from "../ecs/index";
import { aStar } from "../lib/pathfinding";
import { getState } from "../index";
import { createGoal } from "../lib/ecsHelpers";
import * as MoveToGoal from "../ai/moveTo.goal";

export const isFinished = () => {
  return false;
};

export const takeAction = (goal) => {
  const { parent } = goal;

  // detect hostiles
  parent.fireEvent("tryDetectHostiles");

  // this is just a test
  // find a door on the dungeon floor
  const doors = [...world.getEntities()].filter((entity) => entity.door);
  const door = sample(doors);
  const path = aStar(parent.position, door.position);

  path.reverse().forEach((step) => {
    const moveToGoal = createGoal(MoveToGoal, "Move To Goal");
    moveToGoal.data = { x: step[0], y: step[1], z: getState().z };
    parent.brain.pushGoal(moveToGoal);
  });

  parent.appearance.color =
    // https://stackoverflow.com/questions/1484506/random-color-generator
    "0x" + ((Math.random() * 0xffffff) << 0).toString(16);
};
