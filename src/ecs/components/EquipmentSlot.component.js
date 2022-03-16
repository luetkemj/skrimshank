import { Component } from "geotic";

export default class EquipmentSlot extends Component {
  static allowMultiple = true;
  static keyProperty = "key";
  static properties = {
    name: "",
    key: "",
    isPrimary: false,
    contentId: "",
  };

  onTryEquip(evt) {
    if (evt.data.slot === this.key) {
      const { entity } = evt.data;
      if (!entity) {
        evt.handle();
        return false;
      }

      if (!entity.wieldable) {
        console.log("Cannot be wielded");
        evt.handle();
        return false;
      }

      entity.loot.take(this.entity);
      this.contentId = entity.id;
      evt.handle();
      return true;
    }

    return false;
  }

  onTryUnequip(evt) {
    if (evt.data.slot === this.key) {
      this.contentId = "";
      evt.handle();
      return true;
    }

    return false;
  }
}
