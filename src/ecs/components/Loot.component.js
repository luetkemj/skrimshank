import { Component } from "geotic";
import Inventory from "./Inventory.component";
import { log } from "../../lib/logger";

export default class Loot extends Component {
  drop(oldOwner) {
    if (!oldOwner.inventory.hasLoot(this.entity)) {
      return false;
    }

    oldOwner.inventory.dropLoot(this.entity);

    return true;
  }

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
      name: "Pick up",
      evt: "try-pick-up",
    });
  }

  onTryDrop(evt) {
    if (this.drop(evt.data.interactor)) {
      log({ evt, source: this.entity });
    } else {
      console.log("You can't drop that");
    }
  }

  onTryPickUp(evt) {
    this.take(evt.data.interactor);

    log({ evt, source: this.entity });

    evt.handle();
  }
}
