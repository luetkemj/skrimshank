import _ from "lodash";

import { processUserInput } from "./lib/userInput";
import { render } from "./ecs/systems/render";

import { loadTextures, initUi, printRow } from "./lib/canvas";

const loader = loadTextures(initGame);

const state = {
  fps: 0,
  userInput: "",
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

    // stystems
    render();

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
