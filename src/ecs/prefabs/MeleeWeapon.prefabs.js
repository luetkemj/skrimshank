import { chars, colors } from "../../lib/graphics";
import { dmgTypes } from "../components/Damage.component";

const BuildMeleeWeapon = ({ name, description, dmg = [], attacks = [] }) => {
  return {
    name,
    inherit: ["Item"],
    components: [
      {
        type: "Appearance",
        properties: {
          char: chars.weapon,
          color: colors.weapon,
          baseColor: colors.weapon,
        },
      },
      ...dmg.map(({ type, value }) => ({
        type: "Damage",
        properties: { type, value },
      })),
      { type: "Discoverable" },
      { type: "Display", properties: { name, description } },
      { type: "LockPick" },
      { type: "Wieldable" },

      ...attacks.map((attack) => ({ type: attack })),
    ],
  };
};

const specs = [
  {
    name: "Club",
    description:
      "A simple one-handed melee weapon good for bashing rats in the dark.",
    dmg: [{ type: dmgTypes.BLUDGEONING, value: "1d4" }],
    attacks: ["MeleeBash"],
  },

  {
    name: "Dagger",
    description:
      "A simple one-handed melee weapon good for stabbing backs and slitting throats.",
    dmg: [
      { type: dmgTypes.SLASHING, value: "1d4" },
      { type: dmgTypes.PIERCING, value: "1d4" },
      { type: dmgTypes.BLUDGEONING, value: "1d1" },
    ],
    attacks: ["MeleeSlash", "MeleeStab", "MeleeBash"],
  },

  {
    name: "Great Club",
    description: "Like a regular club but bigger.",
    dmg: [{ type: dmgTypes.BLUDGEONING, value: "1d8" }],
    attacks: ["MeleeBash"],
  },

  {
    name: "Handaxe",
    description:
      "An axe that fits in your hand. Perfect for hacking and slashing.",
    dmg: [{ type: dmgTypes.SLASHING, value: "1d6" }],
    attacks: ["MeleeSlash"],
  },

  {
    name: "Light Hammer",
    description: "Somehow, everything looks like a nail.",
    dmg: [{ type: dmgTypes.BLUDGEONING, value: "1d4" }],
    attacks: ["MeleeBash"],
  },

  {
    name: "Mace",
    description: "Like a hammer or club but different.",
    dmg: [{ type: dmgTypes.BLUDGEONING, value: "1d6" }],
    attacks: ["MeleeBash"],
  },

  {
    name: "Quarterstaff",
    description: "If a mace were a stick.",
    dmg: [{ type: dmgTypes.BLUDGEONING, value: "1d6" }],
    attacks: ["MeleeBash"],
  },

  {
    name: "Sickle",
    description: "That thing that death carries.",
    dmg: [{ type: dmgTypes.SLASHING, value: "1d4" }],
    attacks: ["MeleeSlash"],
  },
];

export const weaponNames = specs.map((spec) => spec.name);
export const MeleeWeaponPrefabs = specs.map((spec) => BuildMeleeWeapon(spec));
