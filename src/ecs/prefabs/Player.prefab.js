import { chars, colors } from "../../lib/graphics";

export const Player = {
  name: "Player",
  inherit: ["Being"],
  components: [
    { type: "PC" },
    {
      type: "Appearance",
      properties: { char: chars.player, color: colors.player },
    },
    {
      type: "LightSource",
      properties: {
        lumens: 100,
        beam: 5,
      },
    },
  ],
};
