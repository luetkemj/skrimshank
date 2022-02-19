import { Component } from "geotic";
import Door from "../components/Door.component";

export default class Display extends Component {
  static properties = {
    name: "Unknown",
  };

  get simple() {
    return this.name;
  }

  get detailed() {
    const hasDoor = this.entity.has(Door);
    if (hasDoor) return `${this.name} ${this.entity.door.display}`;

    return this.simple;
  }
}
