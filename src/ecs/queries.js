import { world } from "./index";
import Appearance from "./components/Appearance.component";
import Discoverable from "./components/Discoverable.component";
import InFov from "./components/InFov.component";
import LightSource from "./components/LightSource.component";
import Lux from "./components/Lux.component";
import Shadowcaster from "./components/Shadowcaster.component";
import PC from "./components/PC.component";
import Position from "./components/Position.component";
import Revealed from "./components/Revealed.component";

export const appearanceQuery = world.createQuery({
  all: [Appearance],
});

export const fovQuery = world.createQuery({ all: [InFov] });

export const lightSourceQuery = world.createQuery({ all: [LightSource] });

export const luxQuery = world.createQuery({ all: [Lux] });

export const pcQuery = world.createQuery({ all: [PC] });

export const revealedQuery = world.createQuery({
  all: [Revealed],
  none: [InFov],
});

export const shadowcasterQuery = world.createQuery({
  all: [Discoverable, Shadowcaster],
});

export const visibleQuery = world.createQuery({
  all: [Appearance, InFov, Position],
});
