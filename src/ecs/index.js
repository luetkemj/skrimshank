import { Engine } from "geotic";

import Appearance from "./components/Appearance.component";
import MoveTo from "./components/MoveTo.component";
import PC from "./components/PC.component";
import Position from "./components/Position.component";

import { Being } from "./prefabs/Being.prefab";
import { Floor } from "./prefabs/Floor.prefab";
import { Player } from "./prefabs/Player.prefab";
import { Tile } from "./prefabs/Tile.prefab";
import { Wall } from "./prefabs/Wall.prefab";

export const engine = new Engine();

// register components
engine.registerComponent(Appearance);
engine.registerComponent(MoveTo);
engine.registerComponent(PC);
engine.registerComponent(Position);

// register prefabs
engine.registerPrefab(Being);
engine.registerPrefab(Tile);

engine.registerPrefab(Floor);
engine.registerPrefab(Player);
engine.registerPrefab(Wall);

// create world
export const world = engine.createWorld();
