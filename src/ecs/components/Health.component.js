import { Component } from "geotic";
import IsDead from "./IsDead.component";
import { setState } from "../../index";
import { log } from "../../lib/logger";

export default class Health extends Component {
  static properties = {
    max: 10,
    current: 10,
  };

  onApplyDamage(evt) {
    const { damageTypes, interactee, interactor, interactant, verb } = evt.data;
    let damageTotal = 0;

    // todo: user interactee and interactor stats and equipment mods to calc the final damageTotal
    damageTypes.forEach((dt) => (damageTotal += dt.value));

    if (damageTotal > 0) {
      this.current -= damageTotal;
      log({
        log: [
          {
            str: `The ${interactor.display.name} ${verb} the ${interactee.display.name} with the ${interactant.display.name} for ${damageTotal} damage!`,
          },
        ],
      });
    } else {
      console.log(
        `The ${interactor.display.name} deals a glancing blow for no damage. `
      );
    }

    if (this.current <= 0) {
      this.entity.add(IsDead);
      if (this.entity.pc) {
        setState((state) => (state.mode = "GAME_OVER"));
      }
    }

    evt.handle();
  }
}
