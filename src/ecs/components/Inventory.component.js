import { Component } from "geotic";
import Position from "./Position.component";

export default class Inventory extends Component {
  static properties = {
    contentIds: [],
  };

  addLoot(loot) {
    if (loot.position) {
      loot.remove(loot.position);
    }
    this.contentIds.push(loot.id);
  }

  hasLoot(loot) {
    const idx = this.contentIds.indexOf(loot);
    return idx > -1;
  }

  removeLoot(loot) {
    const idx = this.contentIds.indexOf(loot);

    if (idx >= 0) {
      this.contentIds.splice(idx, 1);
    }

    return loot;
  }

  dropLoot(loot) {
    const ent = this.removeLoot(loot);
    const { position } = this.entity;

    ent.add(Position, position);

    // for when we start to equip things...
    // ent.fireEvent("dropped", {
    //   dropper: this.entity,
    // });

    return ent;
  }
}
