import { chars, colors } from "../../lib/graphics";

export const Lockpick = {
  name: "Lockpick",
  inherit: ["Item"],
  components: [
    {
      type: "Appearance",
      properties: {
        char: chars.tool,
        color: colors.tool,
        baseColor: colors.tool,
      },
    },
    { type: "Discoverable" },
    { type: "Display", properties: { name: "Lockpick" } },
    { type: "LockPick" },
  ],
};
