import { Component } from "geotic";
import { addLog } from "../../lib/logger";

export default class Blocking extends Component {
  onBump(evt) {
    if (this.entity.display) {
      console.log("youu bumped in the wall");
      addLog([{ str: `You bump into the ${this.entity.display.simple}` }]);
    }
  }

  onGetBumpInteractions(evt) {
    evt.data.interactions.push({
      name: "Bump",
      evt: "bump",
    });
  }
}
