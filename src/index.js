import _ from "lodash";
import { loadTextures, initUi, printRow } from "./lib/canvas";

import { world } from "./ecs/index";

import { fovSystem } from "./ecs/systems/fov.system";
import { lightingSystem } from "./ecs/systems/lighting.system";
import { movementSystem } from "./ecs/systems/movement.system";
import { renderSystem } from "./ecs/systems/render.system";
import { userInputSystem } from "./ecs/systems/userInput.system";

import { generateDungeonFloor } from "./generators/dungeonfloor";
import { grid } from "./lib/grid";

const loader = loadTextures(initGame);

const state = {
  fps: 0,
  mode: "GAME",
  tick: 0,
  turn: "PLAYER",
  userInput: "",
  currentMapId: "0,0,0",
  maps: { "0,0,0": [] },
  recalcLighting: false,
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
  goblin.fireEvent("update-position", dungeon.rooms[1].center);

  // run systems to render initial frame
  lightingSystem();
  fovSystem();
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
      movementSystem();
      lightingSystem();
      fovSystem();
      renderSystem();
      setState((state) => (state.turn = "WORLD"));
    }

    if (getState().turn === "WORLD") {
      setState((state) => (state.turn = "PLAYER"));
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
