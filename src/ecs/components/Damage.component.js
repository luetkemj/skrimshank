import { Component } from "geotic";

export const damageTypes = {
  ACID: "ACID",
  BLUDGEONING: "BLUDGEONING",
  COLD: "COLD",
  FIRE: "FIRE",
  FORCE: "FORCE",
  ELECTRIC: "ELECTRIC",
  NECROTIC: "NECROTIC",
  PIERCING: "PIERCING",
  POISON: "POISON",
  PSYCHIC: "PSYCHIC",
  RADIANT: "RADIANT",
  SONIC: "SONIC",
  SLASHING: "SLASHING",
};

export default class Damage extends Component {
  static properties = {
    type: damageTypes.PIERCING,
    value: 10,
  };

  onGetDamageTypes(evt) {
    evt.data.damageTypes.push({
      type: this.type,
      value: this.value,
    });
  }
}
