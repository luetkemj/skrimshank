import { chars, colors } from "../../lib/graphics";
import { dmgTypes } from "../components/Damage.component";

export const Player = {
  name: "Player",
  inherit: ["Being"],
  components: [
    { type: "PC" },
    {
      type: "Appearance",
      properties: {
        char: chars.player,
        color: colors.player,
        baseColor: colors.player,
      },
    },
    {
      type: "LightSource",
      properties: {
        lumens: 100,
        beam: 5,
        stationary: false,
      },
    },
    { type: "ZIndex", properties: { z: 310 } },
    { type: "Display", properties: { name: "Player" } },
    { type: "Motor" },

    {
      type: "EquipmentSlot",
      properties: {
        name: "Left Hand",
        slotKey: "leftHand",
        isPrimary: true,
      },
    },

    {
      type: "Health",
      properties: {
        max: 1000,
        current: 1000,
      },
    },
    // for testing purposes only
    // { type: "DamageResistance", properties: { type: dmgTypes.PIERCING } },
    // { type: "DamageVulnerability", properties: { type: dmgTypes.SLASHING } },
    // { type: "DamageImmunity", properties: { type: dmgTypes.SLASHING } },
  ],
};
