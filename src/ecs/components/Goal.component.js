import { Component } from "geotic";

export default class Goal extends Component {
  static properties = {
    isFinished: () => true,
    takeAction: () => false,
    originalIntent: null,
  };

  onAttached() {
    this.originalIntent = this.entity;
  }
}
