import { Component } from "geotic";
import { log } from "../../lib/logger";

export default class Lock extends Component {
  static properties = {
    isLocked: false,
    // @todo: support keys with matching eids
    // keyId: 'eid'
  };

  lock() {
    if (this.isLocked) {
      return false;
    }

    this.isLocked = true;
  }

  unlock() {
    if (!this.isLocked) {
      return false;
    }

    this.isLocked = false;
  }

  onTryLock(evt) {
    if (this.lock()) {
      console.log("this lock is locked");
    } else {
      log({ evt, source: this.entity });
    }
  }

  onTryUnlock(evt) {
    if (this.unlock()) {
      console.log("the lock is unlocked");
    } else {
      log({ evt, source: this.entity });
    }
  }

  onGetInteractions(evt) {
    if (!this.isLocked) {
      evt.data.interactions.push({
        name: "Lock",
        evt: "try-lock",
      });
    }
  }
}
