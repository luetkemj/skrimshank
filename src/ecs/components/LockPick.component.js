import { Component } from "geotic";
import { log } from "../../lib/logger";

export default class LockPick extends Component {
  onTryPickLock(evt) {
    const { interactee } = evt.data;
    interactee.fireEvent("try-unlock");
    log({ evt, source: this.entity });
  }

  onGetApplications(evt) {
    const { interactee } = evt.data;
    if (interactee.lock && interactee.lock.isLocked) {
      evt.data.interactions.push({
        name: "Pick Lock",
        evt: "try-pick-lock",
        interactee: this.entity,
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

  onTrySlash(evt) {
    const { interactee, interactor } = evt.data;
    const damageBucket = this.entity.fireEvent("get-damage-types", {
      damageTypes: [],
    });

    interactee.fireEvent("ApplyDamage", {
      interactor,
      interactee,
      interactant: this.entity,
      damageTypes: damageBucket.data.damageTypes,
      verb: "slashes",
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
    });

    interactions.push({
      name: "Slash",
      evt: "try-slash",
      interactor,
      interactee,
      interactant: this.entity,
    });
  }
}
