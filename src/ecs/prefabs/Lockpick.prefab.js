import { chars, colors } from "../../lib/graphics";
import { dmgTypes } from "../components/Damage.component";

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
    { type: "Damage", properties: { type: dmgTypes.SLASHING, value: 10 } },
    { type: "Damage", properties: { type: dmgTypes.PIERCING, value: 5 } },
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
