// this goal should kick off other goals.
// If no other goal is interested in kicking off - then you can do idle actions
// This goal is never done.
// actionTypes: [IDLE]
import { sample } from "lodash";
import { world } from "../ecs/index";
import { aStar } from "../lib/pathfinding";
import { getState } from "../index";
import { createGoal } from "../lib/ecsHelpers";
import * as MoveToGoal from "./moveTo.goal";
import * as KillSomethingGoal from "./killSomething.goal";

export const isFinished = () => {
  return false;
};

export const takeAction = (goal) => {
  const { parent } = goal;

  // percieve nearby entities
  const perception = parent.fireEvent("tryPerception", { entities: [] });
  const entsInSight = perception.data.entities;

  let path = [];

  // do I want to kill something?
  const player = entsInSight.find((x) => x.pc);

  if (player) {
    const killSomethingGoal = createGoal(
      KillSomethingGoal,
      "Kill Something Goal"
    );
    killSomethingGoal.data = { target: player };
    parent.brain.pushGoal(killSomethingGoal);
  }

  // do idle actions if there is nothing to kill.
  // smoke a hookah, or draw a picture with your shit.

  parent.appearance.color =
    // https://stackoverflow.com/questions/1484506/random-color-generator
    "0x" + ((Math.random() * 0xffffff) << 0).toString(16);
};
