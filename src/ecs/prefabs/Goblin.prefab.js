import { chars, colors } from "../../lib/graphics";

export const Goblin = {
  name: "Goblin",
  inherit: ["Being"],
  components: [
    {
      type: "Appearance",
      properties: {
        char: chars.goblin,
        color: colors.goblin,
        baseColor: colors.goblin,
      },
    },
    { type: "Display", properties: { name: "Goblin" } },
    { type: "Brain" },
    { type: "Inventory" },
    { type: "Motor" },
    { type: "Eyes" },
    {
      type: "EquipmentSlot",
      properties: {
        name: "Left Hand",
        slotKey: "leftHand",
        isPrimary: true,
      },
    },
  ],
};
