import _ from "lodash";
import { Component } from "geotic";

import { getEntity } from "../../lib/ecsHelpers";

import { world } from "../../ecs/index";

export default class Brain extends Component {
  // todo: add basic instincts list as properties
  // a jelly should have fewer basic instincts/desires than a dwarf
  // for example, a dwarf may put a lot of weight to crafting things
  // whereas a jelly has not concept of creativity at all
  // the spirit could contain these desires
  // these desires could change weights/orders based on external stim
  // the spirit could possess something else - changing it's sense of self/behaviors

  onTakeAction() {
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

    // console.log({ evt, goal });

    if (goal) {
      goal.source.fireEvent(goal.evt);
    }
  }
}
