import _ from "lodash";
import { Component } from "geotic";

import { getEntity } from "../../lib/ecsHelpers";

import { world } from "../index";

export default class Brain extends Component {
  static properties = {
    motive: "KILL_SOMETHING",
    target: "",
  };

  // todo: add basic instincts list as properties
  // a jelly should have fewer basic instincts/desires than a dwarf
  // for example, a dwarf may put a lot of weight to crafting things
  // whereas a jelly has not concept of creativity at all
  // the spirit could contain these desires
  // these desires could change weights/orders based on external stim
  // the spirit could possess something else - changing it's sense of self/behaviors

  // motive (based on instincts)
  // target (somehow find target eyes, maybe nose, or tremor sense?)
  // if self needs to be next to target path closer to target.
  // if target is not found path towards last known location or bail
  // if next to target or target is self search for available actions if not already searched for
  // take action
  // is goal on target done?
  // check motives again. and start over.

  // onTakeInitiative() {
  //   // should check my surrounds and determine what I want to do
  //   return 'KILL_SOMETHING'
  // }

  onTakeAction() {
    if (this.motive === "KILL_SOMETHING") {
    }

    // determine what type of goals to get
    // const goalType = "BORED";

    const evt = this.entity.fireEvent("get-bored-goals", {
      interactor: this.entity,
      goals: [],
    });

    const evts = [];

    if (this.entity.inventory) {
      this.entity.inventory.contentIds.forEach((eid) => {
        const ent = world.getEntity(eid);

        const evt = ent.fireEvent("get-bored-goals", {
          interactor: this.entity,
          goals: [],
        });
        if (evt) {
          evts.push(evt);
        }
      });
    }

    const goals = [...evt.data.goals, ..._.flatMap(evts, (e) => e.data.goals)];

    const goal = _.sample(goals);

    if (goal) {
      goal.source.fireEvent(goal.evt);
    }
  }
}
