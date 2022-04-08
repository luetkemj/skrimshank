import { Component } from "geotic";
import { log } from "../../lib/logger";

export default class LockPick extends Component {
  onTryPickLock(evt) {
    const { interactee } = evt.data;
    interactee.fireEvent("try-unlock");
    log({ evt, source: this.entity });
  }

  onGetApplications(evt) {
    const { interactee, interactor } = evt.data;
    if (interactee.lock && interactee.lock.isLocked) {
      evt.data.interactions.push({
        name: "Pick",
        evt: "try-pick-lock",
        interactee,
        interactor,
        interactant: this.entity,
        caller: "interactant",
      });
    }
  }

  onTryStab(evt) {
    const { interactee, interactor } = evt.data;
    const damageBucket = this.entity.fireEvent("get-damage-types", {
      damageTypes: [],
    });

    interactee.fireEvent("ApplyDamage", {
      interactor,
      interactee,
      interactant: this.entity,
      damageTypes: damageBucket.data.damageTypes,
      verb: "stabs",
    });
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
