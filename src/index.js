import _ from "lodash";
import { loadTextures, initUi, printRow } from "./lib/canvas";

import { world } from "./ecs/index";

import { aiSystem } from "./ecs/systems/ai.system";
import { ambianceSystem } from "./ecs/systems/ambiance.system";
import { applyingSystem } from "./ecs/systems/applying.system";
import { fovSystem } from "./ecs/systems/fov.system";
import { interactingSystem } from "./ecs/systems/interacting.system";
import { lightingSystem } from "./ecs/systems/lighting.system";
import { loggerSystem } from "./ecs/systems/logger.system";
import { renderSystem } from "./ecs/systems/render.system";
import { userInputSystem } from "./ecs/systems/userInput.system";

import { generateDungeonFloor } from "./generators/dungeonfloor";
import { grid, getNeighbors } from "./lib/grid";

import { positionQuery } from "./ecs/queries";
import { astarBuildGrid, aStar } from "./lib/pathfinding";

const loader = loadTextures(initGame);

const state = {
  adventureLog: [
    { log: [{ str: "Welcome to Skrimshank" }], tick: 0 },
    { log: [{ str: "*********************" }], tick: 0 },
    { log: [{ str: "Your adventure begins" }], tick: 0 },
  ],
  ambiance: [],
  astarGrids: {},
  currentMapId: "0,0,0",
  cursor: { x: 0, y: 0 },
  fps: 0,
  interactions: [],
  interactee: null,
  interactor: null,
  inventoryIndex: 0,
  legendPositions: [],
  legendPositionsIndex: 0,
  logsToProcess: [],
  maps: { "0,0,0": [] },
  mode: "GAME", // GAME || LOOKING || INTERACTING
  recalcLighting: false,
  rerender: new Set(),
  tick: 0,
  turn: "PLAYER",
  userInput: "",
  z: 0,
};

window.state = state;
window.world = world;

export const setState = (callback) => {
  callback(state);
};

export const getState = () => state;

function initGame() {
  initUi(loader);

  const initMap = (mapId) => {
    setState((state) => {
      state.maps[mapId] = _.times(grid.map.height, (i) => []);
    });
  };
  initMap("0,0,0");

  // testing:
  const hero = world.createPrefab("Player");
  const goblin = world.createPrefab("Goblin");
  const dungeon = generateDungeonFloor({ world });
  hero.fireEvent("update-position", dungeon.rooms[0].center);
  // get neighbor position
  const neighbors = getNeighbors(dungeon.rooms[0].center);
  goblin.fireEvent("update-position", neighbors[0]);

  // this shoudl go somewhere else eventually
  // likely when we get z-levels it will go there...
  astarBuildGrid(positionQuery.get());

  // run systems to render initial frame
  lightingSystem();
  fovSystem();
  ambianceSystem();
  renderSystem();

  // setup FPS
  let fps = 0;
  let now = null;
  let fpsSamples = [];

  function gameLoop() {
    requestAnimationFrame(gameLoop);

    // systems
    if (getState().userInput && getState().turn === "PLAYER") {
      setState((state) => {
        state.tick = state.tick + 1;
      });
      userInputSystem();
      lightingSystem();
      fovSystem();
      ambianceSystem();
      interactingSystem();
      applyingSystem();
      loggerSystem();
      renderSystem();
      setState((state) => (state.turn = "WORLD"));
    }

    if (getState().turn === "WORLD") {
      aiSystem();
      // lightingSystem();
      // fovSystem();
      // ambianceSystem();
      // interactingSystem();
      // applyingSystem();
      // loggerSystem();
      renderSystem();

      setState((state) => (state.turn = "PLAYER"));

      console.log(aStar(goblin.position, hero.position));
    }

    // calculate FPS
    {
      if (!now) {
        now = Date.now();
      }
      if (Date.now() - now > 1000) {
        fpsSamples.unshift(fps);
        if (fpsSamples.length > 3) {
          fpsSamples.pop();
        }

        if (!isNaN(getState().fps)) {
          printRow({
            container: "fps",
            str: `FPS: ${getState().fps}`,
          });
        }

        now = Date.now();
        fps = 0;
      }

      setState((state) => (state.fps = Math.round(_.mean(fpsSamples))));
      fps++;
    }
  }

  gameLoop();

  document.addEventListener("keydown", (ev) => {
    setState((state) => {
      state.userInput = ev;
    });
  });
}
