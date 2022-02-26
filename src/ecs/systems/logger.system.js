import { addLog } from "../../lib/logger";
import { getState, setState } from "../../index";

export const loggerSystem = () => {
  const { logsToProcess } = getState();

  console.log(logsToProcess);

  logsToProcess.forEach((log) => {
    console.log(log);

    const interactor = log.data.data.interactor;
    if (!interactor) return false;

    const interactee = log.data.data.interactee || log.source;
    const name = _.get(log, "data.data.interaction.name") || log.data.name;

    const subject = interactor.display.simple;
    const verb = name.toLowerCase();
    const object = interactee.display.simple.toLowerCase();

    if (subject === "Player") {
      addLog([{ str: `You ${verb} the ${object}` }]);
    } else {
      addLog([{ str: `${subject} ${verb}s the ${object}` }]);
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
