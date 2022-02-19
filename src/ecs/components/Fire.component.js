import { Component } from "geotic";
import { setState } from "../../index";
import LightSource from "./LightSource.component";

export default class Fire extends Component {
  onAttached() {
    this.entity.add(LightSource, { stationary: true });
    setState((state) => (state.recalcLighting = true));
  }

  onDestroyed() {
    this.entity.remove(this.entity.lightSource);
    setState((state) => (state.recalcLighting = true));
  }

  onTryExtinguish(evt) {
    this.destroy();
  }

  onGetBumpInteractions(evt) {
    evt.data.interactions.push({
      name: "Ignite",
      evt: "try-extinguish",
    });
  }
}
