import { getState, setState } from "../index";

export const addLog = (template) => {
  const { tick, adventureLog } = getState();
  adventureLog.unshift({ log: template, tick });
};

export const log = (data) => {
  const { tick, logsToProcess } = getState();
  logsToProcess.push({ tick, ...data });
};
