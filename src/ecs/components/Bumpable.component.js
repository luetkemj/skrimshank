import { Component } from "geotic";
import { log } from "../../lib/logger";
import { getEntity } from "../../lib/ecsHelpers";

export default class Bumpable extends Component {
  onBump(evt) {
    if (this.entity.fightable) {
      const { interactor } = evt.data;

      const primaryWeaponId =
        interactor?.equipmentSlot?.leftHand?.contentId || null;

      if (primaryWeaponId) {
        const weapon = getEntity(primaryWeaponId);

        // get damage types and apply damage
        if (weapon) {
          const evt = weapon.fireEvent("get-damage-types", { damageTypes: [] });
          this.entity.fireEvent("ApplyDamage", {
            attacker: interactor,
            defender: this.entity,
            weapon,
            damageTypes: evt.data.damageTypes,
          });
        }
      }
    }

    if (this.entity.display) {
      log({ data: evt, source: this.entity });
    }
  }

  onGetBumpInteractions(evt) {
    evt.data.interactions.push({
      name: "Bump",
      evt: "bump",
    });
  }
}
