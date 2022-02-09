import { addLog, getState, setState } from "../index";

const gameplayControls = [
  "ArrowUp",
  "ArrowRight",
  "ArrowDown",
  "ArrowLeft",
  "g",
  "<",
  ">",
];

const uiControls = ["Escape", "c", "i", "k", "l", "Shift"];

const logControls = ["ArrowUp", "ArrowDown"];

const lookingControls = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"];

const inventoryControls = [
  "ArrowUp",
  "ArrowRight",
  "ArrowDown",
  "ArrowLeft",
  "a", // apply
  "d", // drop
  "g", // get
  "q", // quaff
  "r", // remove
  "w", // wield
];

export const processUserInput = (world) => {
  const { userInput, mode, pcEnts } = getState();

  const { key, shiftKey } = userInput;

  // DEBUG VIZ DIJKSTRA
  // Might be nice to have a debug menu at some point for tweaking values in game...
  if (key === "D") {
    setState((state) => {
      if (getState().debugMode === "DIJKSTRA") {
        state.debugMode = "";
      } else {
        state.debugMode = "DIJKSTRA";
      }
    });
  }

  // Game modes must be used in the gameLoop() to processUserInput and call pipelines.
  // if you don't the game will hang and never process user input
  if (key === "Escape") {
    setState((state) => {
      state.inventory.selectedInReachItemEid = "";
      state.mode = "GAME";
    });
  }

  if (key === "c") {
    setState((state) => {
      state.mode = "CHARACTER_MENU";
    });
  }

  if (key === "i") {
    setState((state) => {
      state.mode = "INVENTORY";
    });
  }

  if (key === "k") {
    setState((state) => {
      state.mode = "LOOKING";
    });
  }

  if (key === "l") {
    setState((state) => {
      state.mode = "LOG";
    });
  }

  if (["LOOKING"].includes(mode)) {
    if (lookingControls.includes(key)) {
      setState((state) => {
        state.userInput = userInput;
      });
    }
  }

  if (["LOG"].includes(mode)) {
    if (logControls.includes(key)) {
      const increment = shiftKey ? 10 : 1;
      const { rowIndex } = getState().log;

      if (key === "ArrowUp") {
        setState((state) => (state.log.rowIndex = rowIndex - increment));
      }

      if (key === "ArrowDown") {
        setState((state) => (state.log.rowIndex = rowIndex + increment));
      }
    }
  }

  if (["GAME"].includes(mode)) {
    if (gameplayControls.includes(key)) {
      setState((state) => {
        state.userInput = userInput;
      });
    }
  }

  if (uiControls.includes(key)) {
    setState((state) => {
      state.turn = "PLAYER";
    });
  } else if (uiControls.includes(userInput)) {
    setState((state) => {
      state.turn = "UI";
    });
  } else {
    setState((state) => {
      state.turn = "WORLD";
    });
  }
};
