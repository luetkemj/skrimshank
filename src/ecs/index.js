import { Engine } from "geotic";

import Appearance from "./components/Appearance.component";
import Blocking from "./components/Blocking.component";
import MoveTo from "./components/MoveTo.component";
import InFov from "./components/InFov.component";
import Opaque from "./components/Opaque.component";
import PC from "./components/PC.component";
import Position from "./components/Position.component";
import Revealed from "./components/Revealed.component";
import ZIndex from "./components/ZIndex.component";

import { Being } from "./prefabs/Being.prefab";
import { Floor } from "./prefabs/Floor.prefab";
import { Player } from "./prefabs/Player.prefab";
import { Tile } from "./prefabs/Tile.prefab";
import { Wall } from "./prefabs/Wall.prefab";

export const engine = new Engine();

// register components
engine.registerComponent(Appearance);
engine.registerComponent(Blocking);
engine.registerComponent(InFov);
engine.registerComponent(MoveTo);
engine.registerComponent(Opaque);
engine.registerComponent(PC);
engine.registerComponent(Position);
engine.registerComponent(Revealed);
engine.registerComponent(ZIndex);

// register prefabs
engine.registerPrefab(Being);
engine.registerPrefab(Tile);

engine.registerPrefab(Floor);
engine.registerPrefab(Player);
engine.registerPrefab(Wall);

// create world
export const world = engine.createWorld();
