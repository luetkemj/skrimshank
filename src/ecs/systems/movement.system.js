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

    // check if location is blocking
    if (
      eAtPos.find((eid) => {
        return world.getEntity(eid).blocking;
      })
    ) {
      canMove = false;
    }

    if (canMove) {
      entity.fireEvent("update-position", { x, y, z });
    }
  });
};
