import { Component } from "geotic";

export default class Lux extends Component {
  static properties = {
    current: 0,
    ambient: 0,
  };

  onRecalcLight() {
    this.ambient = 0;
  }
}
