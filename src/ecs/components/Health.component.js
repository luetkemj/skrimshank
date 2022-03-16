import { Component } from "geotic";
import * as gfx from "../../lib/graphics";
import IsDead from "./IsDead.component";
import { setState } from "../../index";

export default class Health extends Component {
  static properties = {
    max: 10,
    current: 10,
  };

  onApplyDamage(evt) {
    const { damageTypes, defender, attacker, weapon } = evt.data;
    let damageTotal = 0;

    // todo: user defender and attacker stats and equipment mods to calc the final damageTotal
    damageTypes.forEach((dt) => (damageTotal += dt.value));

    if (damageTotal > 0) {
      this.current -= damageTotal;
      console.log(
        `The ${attacker.display.name} attacks the ${defender.display.name} with the ${weapon.display.name} for ${damageTotal} damage! `
      );
    } else {
      console.log(
        `The ${attacker.display.name} deals a glancing blow for no damage. `
      );
    }

    if (this.current <= 0) {
      this.entity.fireEvent("ChangeChar", { value: gfx.chars.corpse });
      this.entity.add(IsDead);
      if (this.entity.pc) {
        setState((state) => (state.mode = "GAME_OVER"));
      }
    }

    evt.handle();
  }
}
