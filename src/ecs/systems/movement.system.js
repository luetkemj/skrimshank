import MoveTo from "../components/MoveTo.component";
import Position from "../components/Position.component";
import { world } from "../index";
import { grid } from "../../lib/grid";

const movableQuery = world.createQuery({
  all: [Position, MoveTo],
});

export const movementSystem = () => {
  movableQuery.get().forEach((entity) => {
    let canMove = false;
    const { x, y, z } = entity.moveTo;

    // check if location is within bounds
    if (x >= 0 && x < grid.map.width && y >= 0 && y < grid.map.height) {
      canMove = true;
    }

    if (canMove) {
      entity.position = { x, y, z };
    }
  });
};
