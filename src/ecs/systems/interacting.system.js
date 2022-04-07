import _ from "lodash";
import { getState, setState } from "../../index";
import { getEntitiesAt } from "../../lib/ecsHelpers";
import { pcQuery } from "../queries";
import { world } from "../index";

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
    setState((state) => {
      state.interactee = null;
      state.interactor = null;
      state.interactions = {
        interact: [],
        melee: [],
        apply: [],
      };
    });
    return;
  }

  const playerEnt = pcQuery.get()[0];
  const cursorPos = getState().cursor;
  const eAtPos = getEntitiesAt(cursorPos);
  const stack = _.orderBy([...eAtPos], (entity) => entity.zIndex.z, "desc");
  const entity = stack[0];

  // get interactions
  const evtInteractions = entity.fireEvent("get-interactions", {
    interactor: playerEnt,
    interactions: [],
  });

  // get applications
  const applyEvts = [];
  if (playerEnt.inventory) {
    playerEnt.inventory.contentIds.forEach((eid) => {
      const ent = world.getEntity(eid);

      const evtApplications = ent.fireEvent("get-applications", {
        interactor: ent,
        interactions: [],
        interactee: entity,
      });
      if (evtApplications) {
        applyEvts.push(evtApplications);
      }
    });
  }

  setState((state) => {
    state.interactions.interact = evtInteractions.data.interactions;
    state.interactions.apply = _.flatMap(applyEvts, (e) => e.data.interactions);
    state.interactor = evtInteractions.data.interactor;
    state.interactee = entity;
  });
  setState(
    (state) => (state.interactions.interact = evtInteractions.data.interactions)
  );
  setState((state) => (state.interactor = evtInteractions.data.interactor));
  setState((state) => (state.interactee = entity));
};
