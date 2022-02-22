import { Component } from "geotic";
import Blocking from "./Blocking.component";
import Lock from "./Lock.component";
import Shadowcaster from "./Shadowcaster.component";
import { setState } from "../../index";

export default class Door extends Component {
  static properties = {
    isOpen: false,
    charOpen: "'",
    charClosed: "+",
  };

  get char() {
    return this.isOpen ? this.charOpen : this.charClosed;
  }

  openDoor() {
    if (this.isOpen) {
      return false;
    }

    // check if locked
    if (this.entity.has(Lock)) {
      if (this.entity.lock.isLocked) {
        console.log("the door is locked");
        return false;
      }
    }

    this.isOpen = true;
    this.entity.appearance.char = this.char;
    this.entity.blocking.destroy();
    this.entity.shadowcaster.destroy();
    return true;
  }

  closeDoor() {
    if (!this.isOpen) {
      return false;
    }

    this.isOpen = false;
    this.entity.appearance.char = this.char;
    this.entity.add(Blocking);
    this.entity.add(Shadowcaster);
    return true;
  }

  onTryCloseDoor(evt) {
    if (this.closeDoor()) {
      setState((state) => (state.recalcLighting = true));
    }
    evt.handle();
  }

  onTryOpenDoor(evt) {
    if (this.openDoor()) {
      setState((state) => (state.recalcLighting = true));
    }

    evt.handle();
  }

  onGetBumpInteractions(evt) {
    if (this.isOpen) {
      evt.data.interactions.push({
        name: "Close door",
        evt: "try-close-door",
      });
    } else {
      evt.data.interactions.push({
        name: "Open door",
        evt: "try-open-door",
      });
    }
  }

  onGetInteractions(evt) {
    if (this.isOpen) {
      evt.data.interactions.push({
        name: "Close door",
        evt: "try-close-door",
      });
    } else {
      evt.data.interactions.push({
        name: "Open door",
        evt: "try-open-door",
      });
    }
  }
}
