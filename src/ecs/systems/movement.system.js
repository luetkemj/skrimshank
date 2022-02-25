import MoveTo from "../components/MoveTo.component";
import Position from "../components/Position.component";
import { world } from "../index";
import { grid } from "../../lib/grid";
import { getEAtPos } from "../../lib/ecsHelpers";

const movableQuery = world.createQuery({
  all: [Position, MoveTo],
});

export const movementSystem = () => {
  movableQuery.get().forEach((entity) => {
    let canMove = false;
    const { x, y, z } = entity.moveTo;
    const eAtPos = getEAtPos({ x, y, z });

    // check if location is within bounds
    if (x >= 0 && x < grid.map.width && y >= 0 && y < grid.map.height) {
      canMove = true;
    }

    let blockingEnt = null;

    eAtPos.find((eid) => {
      const ent = world.getEntity(eid);
      if (ent.blocking) {
        blockingEnt = ent;
      }

      return ent.blocking;
    });

    // check if location is blocking
    if (blockingEnt) {
      blockingEnt.fireEvent("bump");

      const evt = blockingEnt.fireEvent("get-bump-interactions", {
        interactor: entity,
        interactions: [],
      });

      evt.data.interactions.forEach((e) => blockingEnt.fireEvent(e.evt));

      canMove = false;
    }

    if (canMove) {
      entity.fireEvent("update-position", { x, y, z });
    }

    entity.remove(entity.moveTo);
  });
};
