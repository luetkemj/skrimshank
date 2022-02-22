import { chars, colors } from "../../lib/graphics";

export const Door = {
  name: "Door",
  inherit: ["Tile"],
  components: [
    {
      type: "Appearance",
      properties: {
        char: chars.doorClosed,
        color: colors.door,
        baseColor: colors.door,
      },
    },
    { type: "Discoverable" },
    { type: "Blocking" },
    { type: "Combustible" },
    { type: "Lock" },
    { type: "LockPick" },
    { type: "Shadowcaster" },
    { type: "ZIndex", properties: { z: 200 } },
    { type: "Door" },
    { type: "Display", properties: { name: "Door" } },
  ],
};
