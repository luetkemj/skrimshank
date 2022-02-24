import { Component } from "geotic";
import Inventory from "./Inventory.component";

export default class Loot extends Component {
  take(newOwner) {
    newOwner.inventory.addLoot(this.entity);
    return true;
  }

  onGetInteractions(evt) {
    const { interactor } = evt.data;

    if (!interactor.has(Inventory)) {
      return;
    }

    evt.data.interactions.push({
      name: "Pickup",
      evt: "try-pick-up",
    });
  }

  onTryPickUp(evt) {
    this.take(evt.data.interactor);
    evt.handle();
  }
}
