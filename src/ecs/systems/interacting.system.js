import _ from "lodash";
import { getState, setState } from "../../index";
import { getEntitiesAtPos } from "../../lib/ecsHelpers";
import { pcQuery } from "../queries";

export const interactionKeys = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

export const interactingSystem = () => {
  const isInteractingMode = getState().mode === "INTERACTING";

  if (!isInteractingMode) {
    // reset state
    setState((state) => (state.interactee = null));
    setState((state) => (state.interactor = null));
    setState((state) => (state.interactions = []));
    return;
  }

  const playerEnt = pcQuery.get()[0];
  const cursorPos = getState().cursor;
  const eAtPos = getEntitiesAtPos(cursorPos);
  const stack = _.orderBy([...eAtPos], (entity) => entity.zIndex.z, "desc");
  const entity = stack[0];

  const evt = entity.fireEvent("get-interactions", {
    interactor: playerEnt,
    interactions: [],
  });

  setState((state) => (state.interactions = evt.data.interactions));
  setState((state) => (state.interactor = evt.data.interactor));
  setState((state) => (state.interactee = entity));
};
