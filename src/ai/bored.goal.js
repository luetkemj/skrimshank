// this goal should kick off other goals.
// If no other goal is interested in kicking off - then you can do idle actions
// This goal is never done.
// actionTypes: [IDLE]
import { sample } from "lodash";
import { world } from "../ecs/index";
import { aStar } from "../lib/pathfinding";
import { getState } from "../index";

export const isFinished = () => {
  return false;
};

export const takeAction = (goal) => {
  const { parent } = goal;

  // this is just a test
  // find a door on the dungeon floor
  const doors = [...world.getEntities()].filter((entity) => entity.door);
  const door = sample(doors);
  const path = aStar(parent.position, door.position);

  path.reverse().forEach((step) => {
    const moveGoal = world.createPrefab("GoalMoveTo");
    moveGoal.data = { x: step[0], y: step[1], z: getState().z };
    parent.brain.pushGoal(moveGoal);
  });

  parent.appearance.color =
    // https://stackoverflow.com/questions/1484506/random-color-generator
    "0x" + ((Math.random() * 0xffffff) << 0).toString(16);
};
