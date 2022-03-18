import { Component } from "geotic";
import { getEntity } from "../../lib/ecsHelpers";
import Equipped from "./Equipped.component";

export default class EquipmentSlot extends Component {
  static allowMultiple = true;
  static keyProperty = "slotKey";
  static properties = {
    name: "",
    slotKey: "",
    isPrimary: false,
    contentId: "",
  };

  equip(entity) {
    entity.loot.take(this.entity);

    entity.add(Equipped);
    entity.equipped.slotKey = this.slotKey;
    entity.equipped.ownerId = this.entity.id;

    this.contentId = entity.id;
  }

  unequip() {
    const content = getEntity(this.contentId);
    this.contentId = null;
    content.equipped.destroy();
  }

  onTryEquip(evt) {
    if (evt.data.slot === this.slotKey) {
      const { entity } = evt.data;
      if (!entity) {
        console.log("Error: no entity");
        evt.handle();
        return false;
      }

      // probably don't want to check if wieldable...
      // maybe the item needs appropriate slots it's can be used...
      // if (!entity.wieldable) {
      //   console.log("Cannot be wielded");
      //   evt.handle();
      //   return false;
      // }

      if (this.contentId) {
        console.log("Cannot equip, slot is full");
        evt.handle();
        return false;
      }

      this.equip(entity);
      evt.handle();
      return true;
    }

    return false;
  }

  onTryUnequip(evt) {
    if (evt.data.slot === this.slotKey) {
      this.contentId = "";
      evt.handle();
      return true;
    }

    return false;
  }
}
