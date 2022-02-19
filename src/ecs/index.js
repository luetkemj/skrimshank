import { Engine } from "geotic";

import Appearance from "./components/Appearance.component";
import Blocking from "./components/Blocking.component";
import Discoverable from "./components/Discoverable.component";
import Door from "./components/Door.component";
import InFov from "./components/InFov.component";
import LightSource from "./components/LightSource.component";
import Lux from "./components/Lux.component";
import MoveTo from "./components/MoveTo.component";
import PC from "./components/PC.component";
import Position from "./components/Position.component";
import Revealed from "./components/Revealed.component";
import Shadowcaster from "./components/Shadowcaster.component";
import ZIndex from "./components/ZIndex.component";

import { Being as BeingPrefab } from "./prefabs/Being.prefab";
import { Brazier as BrazierPrefab } from "./prefabs/Brazier.prefab";
import { Door as DoorPrefab } from "./prefabs/Door.prefab";
import { Floor as FloorPrefab } from "./prefabs/Floor.prefab";
import { Goblin as GoblinPrefab } from "./prefabs/Goblin.prefab";
import { Player as PlayerPrefab } from "./prefabs/Player.prefab";
import { Tile as TilePrefab } from "./prefabs/Tile.prefab";
import { Wall as WallPrefab } from "./prefabs/Wall.prefab";

export const engine = new Engine();
export const world = engine.createWorld();

// register components
engine.registerComponent(Appearance);
engine.registerComponent(Blocking);
engine.registerComponent(Discoverable);
engine.registerComponent(Door);
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
// INHERITABLE PREFABS
engine.registerPrefab(BeingPrefab);
engine.registerPrefab(TilePrefab);

engine.registerPrefab(BrazierPrefab);
engine.registerPrefab(DoorPrefab);
engine.registerPrefab(FloorPrefab);
engine.registerPrefab(GoblinPrefab);
engine.registerPrefab(PlayerPrefab);
engine.registerPrefab(WallPrefab);
