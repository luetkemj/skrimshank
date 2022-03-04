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
  ],
};
