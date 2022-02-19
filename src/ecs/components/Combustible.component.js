import { Component } from "geotic";
import Fire from "./Fire.component";

export default class Combustible extends Component {
  get isOnFire() {
    return !!this.entity.fire;
  }

  onTryIgnite(evt) {
    this.entity.add(Fire);
  }

  onGetBumpInteractions(evt) {
    if (!this.isOnFire) {
      evt.data.interactions.push({
        name: "Ignite",
        evt: "try-ignite",
      });
    }
  }
}
