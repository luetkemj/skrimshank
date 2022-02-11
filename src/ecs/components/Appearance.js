import { Component } from "geotic";
import * as gfx from "../../lib/graphics";

export default class Appearance extends Component {
  static properties = {
    char: gfx.chars.default,
    color: gfx.colors.default,
  };
}
