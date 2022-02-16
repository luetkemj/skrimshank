import { Component } from "geotic";
import { setState } from "../../index";
import LightSource from "./LightSource.component";

export default class Position extends Component {
  static properties = {
    x: 0,
    y: 0,
    z: 0,
  };

  // geotic hook
  onAttached(entity) {
    setState((state) => {
      const { currentMapId } = state;
      const { x, y } = entity.position;
      if (!state.maps[currentMapId][y][x]) {
        state.maps[currentMapId][y][x] = new Set();
      }
      state.maps[currentMapId][y][x].add(entity.id);
    });
  }

  onUpdatePosition(evt) {
    // remove entity from old location in maps eAtLoc tracker
    setState((state) => {
      state.maps[state.currentMapId][this.y][this.x].delete(this.entity.id);
    });

    this.x = evt.data.x;
    this.y = evt.data.y;
    this.z = evt.data.z;

    // if entity is a lightsource, set flag to recalc
    if (this.entity.has(LightSource)) {
      this.entity.lightSource.recalc = true;
    }

    evt.handle();

    // add entity to new location in maps eAtLoc tracker
    setState((state) => {
      state.maps[state.currentMapId][this.y][this.x].add(this.entity.id);
    });
  }
}
