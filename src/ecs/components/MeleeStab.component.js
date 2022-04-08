import { Component } from "geotic";
import { log } from "../../lib/logger";

export default class MeleeStab extends Component {
  onTryStab(evt) {
    const { interactee, interactor } = evt.data;
    const damageBucket = this.entity.fireEvent("get-damage-types", {
      damageTypes: [],
    });

    // should have some sort of flag passed along that can be flipped on success. If successful log something. (or maybe that should happen in the listener? IDK)
    const event = interactee.fireEvent("ApplyDamage", {
      interactor,
      interactee,
      interactant: this.entity,
      damageTypes: damageBucket.data.damageTypes,
      verb: "stabs",
    });

    if (!event.handled) {
      log({
        log: [
          {
            str: `You stab impotently at the ${interactee.display.name} with the ${this.entity.display.name}!`,
          },
        ],
      });
    }
  }

  onGetMeleeInteractions(evt) {
    const { interactions, interactee, interactor } = evt.data;
    interactions.push({
      name: "Stab",
      evt: "try-stab",
      interactor,
      interactee,
      interactant: this.entity,
      caller: "interactant",
    });
  }
}
