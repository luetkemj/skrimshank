import { sample } from "lodash";
import { Component } from "geotic";
import { log } from "../../lib/logger";
import { getEntity } from "../../lib/ecsHelpers";

export default class Bumpable extends Component {
  onBump(evt) {
    if (this.entity.fightable) {
      const { interactor } = evt.data;

      // This whole thing should be a in a floating window (baddies use their brains and don't bump)
      const primaryWeaponId =
        interactor?.equipmentSlot?.leftHand?.contentId || null;

      if (primaryWeaponId) {
        const interactant = getEntity(primaryWeaponId);
        // get melee interactions
        const interactions = [];
        interactant.fireEvent("get-melee-interactions", {
          interactions,
          interactee: this.entity,
          interactor,
        });

        // select melee interaction
        const interaction = sample(interactions);

        // melee
        interactant.fireEvent(interaction.evt, {
          interactant,
          interactee: this.entity,
          interactor,
        });
      }
    }

    if (this.entity.display) {
      log({ evt, source: this.entity });
    }
  }

  onGetBumpInteractions(evt) {
    evt.data.interactions.push({
      name: "Bump",
      evt: "bump",
    });
  }
}
