import { Component } from "geotic";

export default class Door extends Component {
  static properties = {
    isOpen: false,
    charOpen: "+",
    charClosed: "'",
  };

  get char() {
    return this.isOpen ? charOpen : charClosed;
  }

  openDoor() {
    if (this.isOpen) {
      return false;
    }

    this.isOpen = true;

    // todo: check for these components first?
    this.entity.appearance.char = this.char;
    this.entity.blocker.destroy();
    this.entity.shadowcaster.destroy();

    return true;
  }

  closeDoor() {
    if (!this.isOpen) {
      return false;
    }

    this.isOpen = false;

    // todo: check for these components first?
    this.entity.appearance.char = this.char;
    this.entity.add(Blocker);
    this.entity.add(Shadowcaster);

    return true;
  }
}
