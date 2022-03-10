export const Tile = {
  name: "Tile",
  components: [
    { type: "Appearance" },
    { type: "Position" },
    { type: "ZIndex", properties: { z: 100 } },
    { type: "Display" },
    { type: "Astar", properties: { wt: 1 } },
  ],
};
