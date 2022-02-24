import { Component } from "geotic";

export default class LockPick extends Component {
  onTryPickLock(evt) {
    const { interactee } = evt.data;
    interactee.fireEvent("try-unlock");
  }

  onGetApplications(evt) {
    const { interactee } = evt.data;
    if (interactee.lock && interactee.lock.isLocked) {
      evt.data.interactions.push({
        name: "Pick Lock",
        evt: "try-pick-lock",
        interactee: this.entity,
      });
    }
  }
}
