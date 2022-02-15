import { Engine } from "geotic";

import Appearance from "./components/Appearance.component";
import Blocking from "./components/Blocking.component";
import InFov from "./components/InFov.component";
import LightSource from "./components/LightSource.component";
import Lux from "./components/Lux.component";
import MoveTo from "./components/MoveTo.component";
import PC from "./components/PC.component";
import Position from "./components/Position.component";
import Revealed from "./components/Revealed.component";
import Shadowcaster from "./components/Shadowcaster.component";
import ZIndex from "./components/ZIndex.component";

import { Being } from "./prefabs/Being.prefab";
import { Floor } from "./prefabs/Floor.prefab";
import { Goblin } from "./prefabs/Goblin.prefab";
import { Player } from "./prefabs/Player.prefab";
import { Tile } from "./prefabs/Tile.prefab";
import { Wall } from "./prefabs/Wall.prefab";

export const engine = new Engine();

// register components
engine.registerComponent(Appearance);
engine.registerComponent(Blocking);
engine.registerComponent(InFov);
engine.registerComponent(LightSource);
engine.registerComponent(Lux);
engine.registerComponent(MoveTo);
engine.registerComponent(PC);
engine.registerComponent(Position);
engine.registerComponent(Revealed);
engine.registerComponent(Shadowcaster);
engine.registerComponent(ZIndex);

// register prefabs
engine.registerPrefab(Being);
engine.registerPrefab(Tile);

engine.registerPrefab(Floor);
engine.registerPrefab(Goblin);
engine.registerPrefab(Player);
engine.registerPrefab(Wall);

// create world
export const world = engine.createWorld();
