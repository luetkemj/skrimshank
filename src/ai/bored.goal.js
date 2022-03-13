// this goal should kick off other goals.
// If no other goal is interested in kicking off - then you can do idle actions
// This goal is never done.
// actionTypes: [IDLE]
import { world } from "../ecs/index";
import { aStar } from "../lib/pathfinding";
import { getState } from "../index";

export const isFinished = () => {
  return false;
};

export const takeAction = (goal) => {
  const { parent } = goal;

  // find a door on the dungeon floor
  const door = [...world.getEntities()].find((entity) => entity.pc);
  // get it's position

  // path to Door
  // add move goals for each step of path
  const path = aStar(parent.position, door.position);

  console.log({ path, parent, door });

  path.forEach((step) => {
    const moveGoal = world.createPrefab("GoalMoveTo");
    moveGoal.data = { x: step.y, y: step.x, z: getState().z };
    parent.brain.pushGoal(moveGoal);
  });

  // console.log(goal);

  parent.appearance.color =
    // https://stackoverflow.com/questions/1484506/random-color-generator
    "0x" + ((Math.random() * 0xffffff) << 0).toString(16);
};
