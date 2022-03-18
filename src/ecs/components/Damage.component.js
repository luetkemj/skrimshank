import { Component } from "geotic";

export const PIERCING = "PIERCING";

export default class Damage extends Component {
  static properties = {
    type: PIERCING,
    value: 10,
  };

  onGetDamageTypes(evt) {
    evt.data.damageTypes.push({
      type: this.type,
      value: this.value,
    });
  }
}
