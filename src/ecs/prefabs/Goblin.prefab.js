import { chars, colors } from "../../lib/graphics";

export const Goblin = {
  name: "Goblin",
  inherit: ["Being"],
  components: [
    {
      type: "Appearance",
      properties: { char: chars.goblin, color: colors.goblin },
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
