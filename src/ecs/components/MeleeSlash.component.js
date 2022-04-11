import { Component } from "geotic";
import { log } from "../../lib/logger";
import { dmgTypes } from "./Damage.component";

export default class MeleeSlash extends Component {
  onTrySlash(evt) {
    const { interactee, interactor } = evt.data;
    const damageBucket = this.entity.fireEvent("get-damage-types", {
      damageTypes: [],
    });

    // should have some sort of flag passed along that can be flipped on success. If successful log something. (or maybe that should happen in the listener? IDK)
    const event = interactee.fireEvent("try-attack", {
      interactor,
      interactee,
      interactant: this.entity,
      damageTypes: damageBucket.data.damageTypes,
      verb: "slashes",
      dmgType: dmgTypes.SLASHING,
    });

    if (!event.handled) {
      log({
        log: [
          {
            str: `You slash pointlessly at the ${interactee.display.name} with the ${this.entity.display.name}!`,
          },
        ],
      });
    }
  }

  onGetMeleeInteractions(evt) {
    const { interactions, interactee, interactor } = evt.data;
    interactions.push({
      name: "Slash",
      evt: "try-slash",
      interactor,
      interactee,
      interactant: this.entity,
      caller: "interactant",
    });
  }
}
