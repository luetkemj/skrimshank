import { Component } from "geotic";
import IsDead from "./IsDead.component";
import { setState } from "../../index";
import { log } from "../../lib/logger";

import { meleeDmgTypes, magicDmgTypes } from "./Damage.component";

const getDamage = ({
  damage,
  vulnerabilities = [],
  resistances = [],
  immunities = [],
}) => {
  const { type, value } = damage;
  let finalValue = value;

  if (resistances.includes(type)) {
    finalValue /= 2;
  }

  if (vulnerabilities.includes(type)) {
    finalValue *= 2;
  }

  if (immunities.includes(type)) {
    finalValue = 0;
  }

  return finalValue;
};

export default class Health extends Component {
  static properties = {
    max: 10,
    current: 10,
  };

  onApplyDamage(evt) {
    const { damageTypes, interactee, interactor, interactant, verb, dmgType } =
      evt.data;

    const applicableMeleeDmgTypes = Object.keys(meleeDmgTypes).filter(
      (dt) => dt === dmgType
    );
    const applicableMagicDmgTypes = Object.keys(magicDmgTypes).filter((dt) =>
      damageTypes.map((damageType) => damageType.type).includes(dt)
    );
    const applicableDmgTypes = [
      ...applicableMeleeDmgTypes,
      ...applicableMagicDmgTypes,
    ];

    let damageTotal = 0;

    const {
      data: { resistances },
    } = interactee.fireEvent("get-resistances", {
      resistances: [],
    });

    const {
      data: { immunities },
    } = interactee.fireEvent("get-immunities", {
      immunities: [],
    });

    const {
      data: { vulnerabilities },
    } = interactee.fireEvent("get-vulnerabilities", {
      vulnerabilities: [],
    });

    // todo: user interactee and interactor stats and equipment mods to calc the final damageTotal
    damageTypes.forEach((dt) => {
      if (applicableDmgTypes.includes(dt.type)) {
        damageTotal += getDamage({
          damage: dt,
          resistances,
          vulnerabilities,
          immunities,
        });
      }
    });

    // logs should give insight into what damage was or wasn't done based on RVI
    if (damageTotal > 0) {
      this.current -= damageTotal;
      log({
        log: [
          {
            // include damage types in the description
            str: `The ${interactor.display.name} ${verb} the ${interactee.display.name} with the ${interactant.display.name} for ${damageTotal} damage!`,
          },
        ],
      });
    } else {
      log({
        log: [
          {
            str: `The ${interactor.display.name} deals a glancing blow for no damage. `,
          },
        ],
      });
    }

    if (this.current <= 0) {
      this.entity.add(IsDead);
      if (this.entity.pc) {
        setState((state) => (state.mode = "GAME_OVER"));
      }
    }

    evt.handle();
  }
}
