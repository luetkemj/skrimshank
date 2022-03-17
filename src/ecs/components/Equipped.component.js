import { Component } from "geotic";
import { getEntity } from "../../lib/ecsHelpers";

export default class Equipped extends Component {
  static properties = {
    slotKey: "",
    ownerId: "",
  };

  get slot() {
    const owner = getEntity(this.ownerId);
    return owner.equipmentSlot[this.slotKey];
  }

  onDropped(evt) {
    this.slot.unequip();
    evt.handle();
  }
}
