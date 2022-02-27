import { Engine } from "geotic";

import AppearanceComponent from "./components/Appearance.component";
import BlockingComponent from "./components/Blocking.component";
import CombustibleComponent from "./components/Combustible.component";
import DiscoverableComponent from "./components/Discoverable.component";
import DisplayComponent from "./components/Display.component";
import DoorComponent from "./components/Door.component";
import FireComponent from "./components/Fire.component";
import InFovComponent from "./components/InFov.component";
import InventoryComponent from "./components/Inventory.component";
import LegendComponent from "./components/Legend.component";
import LightSourceComponent from "./components/LightSource.component";
import LockComponent from "./components/Lock.component";
import LockPickComponent from "./components/LockPick.component";
import LootComponent from "./components/Loot.component";
import LuxComponent from "./components/Lux.component";
import MoveToComponent from "./components/MoveTo.component";
import PCComponent from "./components/PC.component";
import PositionComponent from "./components/Position.component";
import RevealedComponent from "./components/Revealed.component";
import ShadowcasterComponent from "./components/Shadowcaster.component";
import ZIndexComponent from "./components/ZIndex.component";

import { Being as BeingPrefab } from "./prefabs/Being.prefab";
import { Brazier as BrazierPrefab } from "./prefabs/Brazier.prefab";
import { Door as DoorPrefab } from "./prefabs/Door.prefab";
import { Floor as FloorPrefab } from "./prefabs/Floor.prefab";
import { Goblin as GoblinPrefab } from "./prefabs/Goblin.prefab";
import { Item as ItemPrefab } from "./prefabs/Item.prefab";
import { Lockpick as LockpickPrefab } from "./prefabs/Lockpick.prefab";
import { Player as PlayerPrefab } from "./prefabs/Player.prefab";
import { Tile as TilePrefab } from "./prefabs/Tile.prefab";
import { Wall as WallPrefab } from "./prefabs/Wall.prefab";

export const engine = new Engine();
export const world = engine.createWorld();

// register components
engine.registerComponent(AppearanceComponent);
engine.registerComponent(BlockingComponent);
engine.registerComponent(CombustibleComponent);
engine.registerComponent(DiscoverableComponent);
engine.registerComponent(DisplayComponent);
engine.registerComponent(DoorComponent);
engine.registerComponent(FireComponent);
engine.registerComponent(InFovComponent);
engine.registerComponent(InventoryComponent);
engine.registerComponent(LegendComponent);
engine.registerComponent(LightSourceComponent);
engine.registerComponent(LockComponent);
engine.registerComponent(LockPickComponent);
engine.registerComponent(LootComponent);
engine.registerComponent(LuxComponent);
engine.registerComponent(MoveToComponent);
engine.registerComponent(PCComponent);
engine.registerComponent(PositionComponent);
engine.registerComponent(RevealedComponent);
engine.registerComponent(ShadowcasterComponent);
engine.registerComponent(ZIndexComponent);

// register prefabs
// INHERITABLE PREFABS
engine.registerPrefab(BeingPrefab);
engine.registerPrefab(ItemPrefab);
engine.registerPrefab(TilePrefab);

engine.registerPrefab(BrazierPrefab);
engine.registerPrefab(DoorPrefab);
engine.registerPrefab(FloorPrefab);
engine.registerPrefab(GoblinPrefab);
engine.registerPrefab(LockpickPrefab);
engine.registerPrefab(PlayerPrefab);
engine.registerPrefab(WallPrefab);
