import { Component } from "geotic";

export default class Abilities extends Component {
  static properties = {
    max: 30,
    min: 0,
    strength: 10,
    dexterity: 10,
    // constitution: 10
    // intelligence: 10
    // wisdom: 10
    // charisma: 10
  };

  // onUpdateAbility(evt) {
  //   const { ability, value } = evt.data;
  //   this[ability].current = value;
  // }

  get strMod() {
    return Math.floor((this.strength - 10) / 2);
  }

  get dexMod() {
    return Math.floor((this.dexterity - 10) / 2);
  }

  // get dex() {
  //   return this.strength.current;
  // }

  // get con() {
  //   return this.strength.current;
  // }

  // get int() {
  //   return this.strength.current;
  // }

  // get wis() {
  //   return this.strength.current;
  // }

  // get cha() {
  //   return this.strength.current;
  // }
}
