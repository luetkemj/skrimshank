import { Component } from "geotic";
import * as gfx from "../../lib/graphics";
import { setState } from "../../index";

export default class Appearance extends Component {
  static properties = {
    char: gfx.chars.default,
    color: gfx.colors.default,
    baseColor: gfx.colors.default,
    alpha: 0,
  };

  onChangeChar(evt) {
    this.char = evt.data.value;

    if (this.entity.position) {
      setState((state) => {
        state.rerender.add(this.entity.position);
      });
    }
  }
}
