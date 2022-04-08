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
    { type: "Damage" },
    { type: "Discoverable" },
    {
      type: "Display",
      properties: {
        name: "Lockpick",
        description:
          "A small peice of metal useful for open locks without a key.",
      },
    },
    { type: "LockPick" },
    { type: "Wieldable" },
    { type: "MeleeStab" },
    { type: "MeleeSlash" },
  ],
};
