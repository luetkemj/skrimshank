import { Component } from "geotic";

export const meleeDmgTypes = {
  BLUDGEONING: "BLUDGEONING",
  PIERCING: "PIERCING",
  SLASHING: "SLASHING",
};

export const magicDmgTypes = {
  ACID: "ACID",
  COLD: "COLD",
  FIRE: "FIRE",
  FORCE: "FORCE",
  ELECTRIC: "ELECTRIC",
  NECROTIC: "NECROTIC",
  POISON: "POISON",
  PSYCHIC: "PSYCHIC",
  RADIANT: "RADIANT",
  SONIC: "SONIC",
};

export const dmgTypes = {
  ...meleeDmgTypes,
  ...magicDmgTypes,
};

export default class Damage extends Component {
  static properties = {
    type: dmgTypes.BLUDGEONING,
    value: 1,
  };

  static allowMultiple = true;

  onGetDamageTypes(evt) {
    evt.data.damageTypes.push({
      type: this.type,
      value: this.value,
    });
  }
}
