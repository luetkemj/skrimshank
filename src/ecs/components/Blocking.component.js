import { Component } from "geotic";
import { addLog } from "../../lib/logger";

export default class Blocking extends Component {
  onBump(evt) {
    if (this.entity.display) {
      addLog([{ str: `You bump into the ${this.entity.display.simple}` }]);
    }
  }
}
