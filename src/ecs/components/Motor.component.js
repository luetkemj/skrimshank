import { Component } from "geotic";
import { setState } from "../../index";
import { getEntitiesAtPos } from "../../lib/ecsHelpers";
import { log } from "../../lib/logger";
import { getNeighbors, grid } from "../../lib/grid";

export default class Motor extends Component {
  onTryMove(evt) {
    let canMove = false;

    const { position } = evt.data;
    const entsAtPos = getEntitiesAtPos(position);

    const { x, y, z } = position;

    // check if location is within bounds
    if (x >= 0 && x < grid.map.width && y >= 0 && y < grid.map.height) {
      canMove = true;
    }

    let bumpableEnt = null;

    entsAtPos.find((ent) => {
      if (ent.bumpable) {
        bumpableEnt = ent;
      }
      return ent.bumpable;
    });

    // check if location is bumpable
    if (bumpableEnt) {
      const evt = bumpableEnt.fireEvent("get-bump-interactions", {
        interactor: this.entity,
        interactions: [],
      });

      evt.data.interactions.forEach((e) =>
        bumpableEnt.fireEvent(e.evt, { interactor: this.entity })
      );

      canMove = false;
    }

    if (canMove) {
      setState((state) => {
        const { x: ox, y: oy, z: oz } = this.entity.position;
        state.rerender.add({ x: ox, y: oy, z: oz });
        state.rerender.add({ x, y, z });
      });
      this.entity.fireEvent("update-position", { x, y, z });
    }

    evt.handle();
  }

  onTryWander(evt) {
    const { position } = this.entity;
    const neighborPosition = _.sample(getNeighbors(position));
    this.onTryMove({ data: { position: neighborPosition } });
  }

  onGetBoredGoals(evt) {
    evt.data.goals.push({
      name: "Wander",
      evt: "try-wander",
      source: this.entity,
    });
  }
}
