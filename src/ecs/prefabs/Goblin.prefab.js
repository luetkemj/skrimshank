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
    { type: "Brain" },
    { type: "Display", properties: { name: "Goblin" } },
    {
      type: "EquipmentSlot",
      properties: {
        name: "Left Hand",
        slotKey: "leftHand",
        isPrimary: true,
      },
    },
    { type: "Eyes" },
    { type: "Inventory" },
    { type: "Motor" },
  ],
};
