import { chars, colors } from "../../lib/graphics";

export const Wall = {
  name: "Wall",
  inherit: ["Tile"],
  components: [
    { type: "Blocking" },
    { type: "Shadowcaster" },
    {
      type: "Appearance",
      properties: { char: chars.wall, color: colors.wall },
    },
  ],
};
