import { Engine } from "geotic";

import Appearance from "./components/Appearance.component";
import MoveTo from "./components/MoveTo.component";
import PC from "./components/PC.component";
import Position from "./components/Position.component";

import { Being } from "./prefabs/Being.prefab";
import { Player } from "./prefabs/Player.prefab";

export const engine = new Engine();

// register components
engine.registerComponent(Appearance);
engine.registerComponent(MoveTo);
engine.registerComponent(PC);
engine.registerComponent(Position);

// register prefabs
engine.registerPrefab(Being);
engine.registerPrefab(Player);

// create world
export const world = engine.createWorld();

// testing:
const hero = world.createPrefab("Player");
