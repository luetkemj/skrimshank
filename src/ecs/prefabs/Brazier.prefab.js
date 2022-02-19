import { chars, colors } from "../../lib/graphics";

export const Brazier = {
  name: "Brazier",
  inherit: ["Tile"],
  components: [
    {
      type: "Appearance",
      properties: {
        char: chars.brazier,
        color: colors.fire,
        baseColor: colors.fire,
      },
    },
    { type: "Blocking" },
    { type: "Discoverable" },
    {
      type: "LightSource",
      properties: {
        lumens: 100,
        beam: 5,
        stationary: true,
      },
    },
    { type: "ZIndex", properties: { z: 200 } },
  ],
};
