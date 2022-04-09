import { Component } from "geotic";
import { log } from "../../lib/logger";
import { dmgTypes } from "./Damage.component";

export default class MeleeBash extends Component {
  onTryBash(evt) {
    const { interactee, interactor } = evt.data;
    const damageBucket = this.entity.fireEvent("get-damage-types", {
      damageTypes: [],
    });

    const event = interactee.fireEvent("ApplyDamage", {
      interactor,
      interactee,
      interactant: this.entity,
      damageTypes: damageBucket.data.damageTypes,
      verb: "bashes",
      dmgType: dmgTypes.BLUDGEONING,
    });

    if (!event.handled) {
      log({
        log: [
          {
            str: `You feel a bit foolish bashing the ${interactee.display.name} with a ${this.entity.display.name}!`,
          },
        ],
      });
    }
  }

  onGetMeleeInteractions(evt) {
    const { interactions, interactee, interactor } = evt.data;
    interactions.push({
      name: "Bash",
      evt: "try-bash",
      interactor,
      interactee,
      interactant: this.entity,
      caller: "interactant",
    });
  }
}
