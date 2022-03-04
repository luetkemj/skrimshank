export const isFinished = (goal) => {
  const { parent } = goal;

  if (parent.appearance.color === 0x827) {
    return true;
  }

  return false;
};

export const takeAction = (goal) => {
  const { parent } = goal;

  parent.appearance.color = 0xff9988;
};
