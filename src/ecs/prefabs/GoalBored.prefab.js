import { isFinished, takeAction } from "../../ai/bored.goal";

export const GoalBored = {
  name: "GoalBored",
  components: [
    {
      type: "Goal",
      properties: { isFinished, takeAction },
    },
    { type: "Display", properties: { name: "Bored Goal" } },
  ],
};
