import { chars, colors } from "../../lib/graphics";

export const Wall = {
  name: "Wall",
  inherit: ["Tile"],
  components: [
    { type: "Astar", properties: { wt: 0 } },
    { type: "Blocking" },
    { type: "Bumpable" },
    { type: "Shadowcaster" },
    {
      type: "Appearance",
      properties: {
        char: chars.wall,
        color: colors.wall,
        baseColor: colors.wall,
      },
    },
    { type: "Display", properties: { name: "Wall" } },
  ],
};
