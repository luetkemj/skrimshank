import { world } from "./index";
import Appearance from "./components/Appearance.component";
import Brain from "./components/Brain.component";
import Discoverable from "./components/Discoverable.component";
import InFov from "./components/InFov.component";
import Legend from "./components/Legend.component";
import LightSource from "./components/LightSource.component";
import Lux from "./components/Lux.component";
import Shadowcaster from "./components/Shadowcaster.component";
import PC from "./components/PC.component";
import Position from "./components/Position.component";
import Revealed from "./components/Revealed.component";

export const aiQuery = world.createQuery({ all: [Brain] });

export const appearanceQuery = world.createQuery({
  all: [Appearance],
});

export const fovQuery = world.createQuery({ all: [InFov] });

export const legendableQuery = world.createQuery({ all: [InFov, Legend] });

export const lightSourceQuery = world.createQuery({
  all: [LightSource, Position],
});

export const luxQuery = world.createQuery({ all: [Lux] });

export const pcQuery = world.createQuery({ all: [PC] });

export const positionQuery = world.createQuery({ all: [Position] });

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
