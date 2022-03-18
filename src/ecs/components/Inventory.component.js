import { Component } from "geotic";
import { setState } from "../../index";
import Position from "./Position.component";

export default class Inventory extends Component {
  static properties = {
    contentIds: [],
  };

  // hack to get around geotic bug where the contentIds array is a shared reference across entities
  onAttached() {
    this.contentIds = [];
  }

  addLoot(loot) {
    if (this.contentIds.includes(loot.id)) {
      return;
    }

    if (loot.position) {
      loot.remove(loot.position);
    }

    if (loot.lightSource) {
      setState((state) => (state.recalcLighting = true));
    }

    this.contentIds.push(loot.id);
  }

  hasLoot(loot) {
    const idx = this.contentIds.indexOf(loot.id);
    return idx > -1;
  }

  removeLoot(loot) {
    const idx = this.contentIds.indexOf(loot.id);

    if (idx >= 0) {
      this.contentIds.splice(idx, 1);
    }

    return loot;
  }

  dropLoot(loot) {
    const ent = this.removeLoot(loot);
    const { position } = this.entity;

    ent.add(Position, position);

    if (loot.lightSource) {
      setState((state) => (state.recalcLighting = true));
    }

    ent.fireEvent("dropped", {
      dropper: this.entity,
    });

    return ent;
  }
}
