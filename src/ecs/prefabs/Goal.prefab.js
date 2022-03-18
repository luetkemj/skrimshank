export const Goal = {
  name: "Goal",
  components: [
    {
      type: "Goal",
      properties: { isFinished: () => {}, takeAction: () => {} },
    },
    { type: "Display", properties: { name: "Goal" } },
  ],
};
