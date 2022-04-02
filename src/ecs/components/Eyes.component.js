import { Component } from "geotic";
import { line } from "../../lib/grid";
import { getEntitiesAt, getEntitiesInRange } from "../../lib/ecsHelpers";
import Shadowcaster from "./Shadowcaster.component";
import { world } from "../index";

export default class Eyes extends Component {
  static properties = {
    range: 5,
  };

  canSee(entity) {
    const lineOfSight = line(this.entity.position, entity.position);

    if (lineOfSight.length > this.range) {
      return false;
    }

    return !lineOfSight.some((segment) => {
      return getEntitiesAt(segment).some((entity) => entity.has(Shadowcaster));
    });
  }

  onTryPerception(evt) {
    if (!this.entity.position) {
      return;
    }

    const entsInRange = getEntitiesInRange(this.entity.position, this.range);

    entsInRange.forEach((ent) => {
      if (this.canSee(ent)) {
        evt.data.entities.push(ent);
      }
    });

    evt.handle();
  }
}
