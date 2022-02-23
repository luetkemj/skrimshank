import { chars, colors } from "../../lib/graphics";

export const Brazier = {
  name: "Brazier",
  inherit: ["Item"],
  components: [
    {
      type: "Appearance",
      properties: {
        char: chars.brazier,
        color: colors.metal,
        baseColor: colors.metal,
      },
    },
    { type: "Blocking" },
    { type: "Combustible" },
    { type: "Discoverable" },
    { type: "Display", properties: { name: "Brazier" } },
    { type: "ZIndex", properties: { z: 200 } },
  ],
};
