import { Component } from "geotic";
import { addLog } from "../../lib/logger";
import Fire from "./Fire.component";

export default class Combustible extends Component {
  get isOnFire() {
    return !!this.entity.fire;
  }

  onTryIgnite(evt) {
    this.entity.add(Fire);
    if (this.entity.display) {
      addLog([{ str: `The ${this.entity.display.simple} in on fire` }]);
    }
  }

  onGetInteractions(evt) {
    if (!this.isOnFire) {
      evt.data.interactions.push({
        name: "Ignite",
        evt: "try-ignite",
      });
    }
  }
}
