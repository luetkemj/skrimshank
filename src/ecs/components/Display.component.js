import { Component } from "geotic";

export default class Display extends Component {
  static properties = {
    name: "Unknown",
    description: "You can't even know!",
  };

  get simple() {
    return this.name;
  }

  get detailed() {
    const hasDoor = this.entity.door;
    if (hasDoor) {
      const isOpen = this.entity.door.isOpen;

      if (isOpen) return `an open ${this.name}`;

      return `a closed ${this.name}`;
    }

    const isOnFire = this.entity.fire;
    if (isOnFire) return `a burning ${this.name}`;

    return this.simple;
  }
}
