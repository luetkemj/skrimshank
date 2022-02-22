import { Component } from "geotic";

export default class LockPick extends Component {
  onTryPickLock(evt) {
    const { interactee } = evt.data;
    interactee.fireEvent("try-unlock");
  }

  onGetInteractions(evt) {
    if (this.entity.lock && this.entity.lock.isLocked) {
      evt.data.interactions.push({
        name: "Pick Lock",
        evt: "try-pick-lock",
      });
    }
  }
}
