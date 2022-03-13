// can I have a single prefab goal?
// don't think I have to have a unique prefab for each goal type

import { isFinished, takeAction } from "../../ai/moveTo.goal";

export const GoalMoveTo = {
  name: "GoalMoveTo",
  components: [
    {
      type: "Goal",
      properties: { isFinished, takeAction },
    },
    { type: "Display", properties: { name: "Move Goal" } },
  ],
};
