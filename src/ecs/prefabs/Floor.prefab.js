import { chars, colors } from "../../lib/graphics";

export const Floor = {
  name: "Floor",
  inherit: ["Tile"],
  components: [
    {
      type: "Appearance",
      properties: { char: chars.floor, color: colors.floor },
    },
    { type: "Discoverable" },
  ],
};
