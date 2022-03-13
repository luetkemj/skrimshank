import { Component } from "geotic";
import { line } from "../../lib/grid";
import { getEntitiesAt } from "../../lib/ecsHelpers";
import Shadowcaster from "./Shadowcaster.component";
import { world } from "../index";

export default class Eyes extends Component {
  static properties = {
    range: 10,
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

  onTryDetectHostiles(evt) {
    if (!this.entity.position) {
      return;
    }

    // TODO: need a get entities in RANGE func! generate a circle from start
    // get all locations, and iterate over to get all entities at each
    // BOOM!
    // TEST: searching over everything is bananas and just for testing
    const player = [...world.getEntities()].find((x) => x.pc);

    const hostileDetected = this.canSee(player);
    if (hostileDetected) {
      console.log("I see you!");
    } else {
      console.log("marco...");
    }

    evt.handle();
  }
}
