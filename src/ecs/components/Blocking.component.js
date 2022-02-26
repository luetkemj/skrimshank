import { Component } from "geotic";
import { log } from "../../lib/logger";

export default class Blocking extends Component {
  onBump(data) {
    if (this.entity.display) {
      log({ data, source: this.entity });
    }
  }

  onGetBumpInteractions(evt) {
    evt.data.interactions.push({
      name: "Bump",
      evt: "bump",
    });
  }
}
