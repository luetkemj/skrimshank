import { Component } from "geotic";
import { setState } from "../../index";
import * as gfx from "../../lib/graphics";
import LightSource from "./LightSource.component";
import { addLog } from "../../lib/logger";

export default class Fire extends Component {
  onAttached() {
    this.entity.add(LightSource, { stationary: true });
    this.entity.appearance.color = gfx.colors.fire;
    setState((state) => (state.recalcLighting = true));
  }

  onDestroyed() {
    this.entity.remove(this.entity.lightSource);
    this.entity.appearance.color = this.entity.appearance.baseColor;
    setState((state) => (state.recalcLighting = true));

    if (this.entity.display) {
      addLog([
        { str: `The ${this.entity.display.simple} has been extinguished` },
      ]);
    }
  }

  onTryExtinguish(evt) {
    this.destroy();
  }

  onGetInteractions(evt) {
    evt.data.interactions.push({
      name: "Extinguish",
      evt: "try-extinguish",
    });
  }
}
