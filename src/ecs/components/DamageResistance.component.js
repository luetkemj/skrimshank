import { Component } from "geotic";

export default class DamageResistance extends Component {
  static properties = {
    type: "",
  };

  static allowMultiple = true;

  onGetResistances(evt) {
    evt.data.resistances.push(this.type);
  }
}
