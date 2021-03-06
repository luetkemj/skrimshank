import { Component } from "geotic";
import { log } from "../../lib/logger";
import Fire from "./Fire.component";

export default class Combustible extends Component {
  get isOnFire() {
    return !!this.entity.fire;
  }

  onTryIgnite(evt) {
    this.entity.add(Fire);
    log({ evt, source: this.entity });
  }

  onGetInteractions(evt) {
    if (!this.isOnFire) {
      const { interactor, interactee, interactant } = evt.data;

      evt.data.interactions.push({
        name: "Ignite",
        evt: "try-ignite",
        interactor,
        interactee: this.entity,
        interactant,
        caller: "interactee",
      });
    }
  }
}
