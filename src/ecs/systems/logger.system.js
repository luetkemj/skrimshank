import { addLog } from "../../lib/logger";
import { getState, setState } from "../../index";

// todo: improve the hell out of this
// not great coming back to this later. ugh!
export const loggerSystem = () => {
  const { logsToProcess } = getState();

  logsToProcess.forEach((log) => {
    if (log.evt) {
      const interactor = log.evt.data.interactor;
      if (!interactor) return false;

      const interactee = log.evt.data.interactee || log.source;
      const name = _.get(log, "evt.data.interaction.name") || log.evt.name;

      const subject = interactor.display.simple;
      const verb = name.toLowerCase();
      const object = interactee.display.simple.toLowerCase();

      if (subject === "Player") {
        addLog([{ str: `You ${verb} the ${object}` }]);
      } else {
        addLog([{ str: `${subject} ${verb}s the ${object}` }]);
      }
    } else {
      addLog(log.log);
    }
  });

  setState((state) => (state.logsToProcess = []));
};

// Logs need to be processed in batches.
// add all logs to a central logs list to be process every tick
// events need to included and who sent what to whom

// bump events:
//     Who bumped what - with what result
//     You bump into the door. The door creaks open.
//     You bump into the door. The door is locked and doesn't budge.

// order of events, interactor, interactee, interaction
// using the order and knowledge of interactor v interactee we should be able to put together a proper sentancee
// You unlock the door with a lockpick.
// I guess we'll see how it goes
