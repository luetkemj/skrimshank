// todo: can I iterate over imports somehow? Sucks to have to keep repeating myself here

import { Engine } from "geotic";

import AppearanceComponent from "./components/Appearance.component";
import AstarComponent from "./components/Astar.component";
import ImpassableComponent from "./components/Impassable.component";
import BrainComponent from "./components/Brain.component";
import BumpableComponent from "./components/Bumpable.component";
import CombustibleComponent from "./components/Combustible.component";
import DamageComponent from "./components/Damage.component";
import DamageImmunityComponent from "./components/DamageImmunity.component";
import DamageResistanceComponent from "./components/DamageResistance.component";
import DamageVulnerabilityComponent from "./components/DamageVulnerability.component";
import DiscoverableComponent from "./components/Discoverable.component";
import DisplayComponent from "./components/Display.component";
import DoorComponent from "./components/Door.component";
import EquipmentSlotComponent from "./components/EquipmentSlot.component";
import EquippedComponent from "./components/Equipped.component";
import EyesComponent from "./components/Eyes.component";
import FightableComponent from "./components/Fightable.component";
import FireComponent from "./components/Fire.component";
import GoalComponent from "./components/Goal.component";
import HealthComponent from "./components/Health.component";
import InFovComponent from "./components/InFov.component";
import InventoryComponent from "./components/Inventory.component";
import IsDeadComponent from "./components/IsDead.component";
import LegendComponent from "./components/Legend.component";
import LightSourceComponent from "./components/LightSource.component";
import LockComponent from "./components/Lock.component";
import LockPickComponent from "./components/LockPick.component";
import LootComponent from "./components/Loot.component";
import LuxComponent from "./components/Lux.component";
import MeleeBash from "./components/MeleeBash.component";
import MeleeSlash from "./components/MeleeSlash.component";
import MeleeStab from "./components/MeleeStab.component";
import MotorComponent from "./components/Motor.component";
import PCComponent from "./components/PC.component";
import PositionComponent from "./components/Position.component";
import RevealedComponent from "./components/Revealed.component";
import ShadowcasterComponent from "./components/Shadowcaster.component";
import ZIndexComponent from "./components/ZIndex.component";

import { Being as BeingPrefab } from "./prefabs/Being.prefab";
import { Brazier as BrazierPrefab } from "./prefabs/Brazier.prefab";
import { Door as DoorPrefab } from "./prefabs/Door.prefab";
import { Floor as FloorPrefab } from "./prefabs/Floor.prefab";
import { Goal } from "./prefabs/Goal.prefab";
import { Goblin as GoblinPrefab } from "./prefabs/Goblin.prefab";
import { Item as ItemPrefab } from "./prefabs/Item.prefab";
import { Lockpick as LockpickPrefab } from "./prefabs/Lockpick.prefab";
import { Player as PlayerPrefab } from "./prefabs/Player.prefab";
import { Tile as TilePrefab } from "./prefabs/Tile.prefab";
import { Wall as WallPrefab } from "./prefabs/Wall.prefab";

import { MeleeWeaponPrefabs } from "./prefabs/MeleeWeapon.prefabs";

export const engine = new Engine();
export const world = engine.createWorld();

// register components
engine.registerComponent(AppearanceComponent);
engine.registerComponent(AstarComponent);
engine.registerComponent(ImpassableComponent);
engine.registerComponent(BrainComponent);
engine.registerComponent(BumpableComponent);
engine.registerComponent(CombustibleComponent);
engine.registerComponent(DamageComponent);
engine.registerComponent(DamageImmunityComponent);
engine.registerComponent(DamageResistanceComponent);
engine.registerComponent(DamageVulnerabilityComponent);
engine.registerComponent(DiscoverableComponent);
engine.registerComponent(DisplayComponent);
engine.registerComponent(DoorComponent);
engine.registerComponent(EquipmentSlotComponent);
engine.registerComponent(EquippedComponent);
engine.registerComponent(EyesComponent);
engine.registerComponent(FightableComponent);
engine.registerComponent(FireComponent);
engine.registerComponent(GoalComponent);
engine.registerComponent(HealthComponent);
engine.registerComponent(InFovComponent);
engine.registerComponent(InventoryComponent);
engine.registerComponent(IsDeadComponent);
engine.registerComponent(LegendComponent);
engine.registerComponent(LightSourceComponent);
engine.registerComponent(LockComponent);
engine.registerComponent(LockPickComponent);
engine.registerComponent(LootComponent);
engine.registerComponent(LuxComponent);
engine.registerComponent(MeleeBash);
engine.registerComponent(MeleeSlash);
engine.registerComponent(MeleeStab);
engine.registerComponent(MotorComponent);
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

engine.registerPrefab(Goal);

// generatedPrefabs
MeleeWeaponPrefabs.forEach((prefab) => engine.registerPrefab(prefab));
