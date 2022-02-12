import _ from "lodash";
import { loadTextures, initUi, printRow } from "./lib/canvas";
import { renderSystem } from "./ecs/systems/render.system";
import { userInputSystem } from "./ecs/systems/userInput.system";
import { movementSystem } from "./ecs/systems/movement.system";

const loader = loadTextures(initGame);

const state = {
  fps: 0,
  mode: "GAME",
  tick: 0,
  turn: "WORLD",
  userInput: "",
};

window.state = state;

export const setState = (callback) => {
  callback(state);
};

export const getState = () => state;

function initGame() {
  initUi(loader);
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
      renderSystem();
      setState(state => state.turn = 'WORLD')
    }

    if (getState().turn === "WORLD") {
      setState(state => state.turn = 'PLAYER')
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
