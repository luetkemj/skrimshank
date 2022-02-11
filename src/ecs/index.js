import { Engine } from "geotic";

import Appearance from "./components/Appearance";
import Position from "./components/Position";

export const engine = new Engine();

// register components
engine.registerComponent(Appearance);
engine.registerComponent(Position);

// create world
export const world = engine.createWorld();

const entity = world.createEntity();
console.log(entity);

entity.add(Position, { x: 4, y: 10 });
entity.add(Appearance);
