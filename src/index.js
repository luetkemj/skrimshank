import _ from "lodash";

import { processUserInput } from "./lib/userInput";

import { loadSprites, initUi, printRow } from "./lib/canvas";

const loader = loadSprites(initGame);

const state = {
  ambientLog: [],
  debug: false,
  dijkstra: {
    player: {
      goals: [],
      map: {},
    },
  },
  eAtPos: {},
  floors: {},
  fps: 0,
  inventory: {
    columnIndex: 0,
    inventoryListIndex: 0,
    inReachListIndex: 0,
    selectedInventoryItemEid: "",
    selectedInReachItemEid: "",
    selectedApplierItemEid: "",
  },
  log: {
    log: [],
    rowIndex: 0,
  },
  looking: null,
  maps: {
    zoom: "local",
    mapId: "0,0,0",
    local: {},
  },
  mode: "GAME",
  debugMode: "",
  pcEnts: [],
  tick: 0,
  turn: "",
  userInput: "",
  withinReachPreview: [[], [], []],
  world: {},
  z: 0,
};

window.state = state;

export const setState = (callback) => {
  callback(state);
};

export const getState = () => state;

function initGame() {
  initUi(loader);

  // setup FPS
  let fps = 0;
  let now = null;
  let fpsSamples = [];

  function gameLoop() {
    requestAnimationFrame(gameLoop);

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
