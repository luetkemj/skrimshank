import { Component } from "geotic";

export default class LightSource extends Component {
  static properties = {
    lumens: 100,
    beam: 5,
    stationary: true,
    recalc: true,
  };

  onRecalcLight() {
    this.recalc = true;
  }
}
