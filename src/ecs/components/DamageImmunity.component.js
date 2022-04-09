import { Component } from "geotic";

export default class DamageImmunity extends Component {
  static properties = {
    type: "",
  };

  static allowMultiple = true;

  onGetImmunities(evt) {
    evt.data.immunities.push(this.type);
  }
}
