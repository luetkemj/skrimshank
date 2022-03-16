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
    this.current -= evt.data.value;
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
