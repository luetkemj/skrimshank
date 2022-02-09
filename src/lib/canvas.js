import _ from "lodash";
import * as PIXI from "pixi.js-legacy";
import { grid } from "./grid";
import * as gfx from "./graphics";
import { menloBoldAlphaMap } from "../../static/fonts/menlo-bold.map";
import { menloBoldHalfAlphaMap } from "../../static/fonts/menlo-bold-half.map";
import { getState } from "../index";

// add PIXI to the window so the devtools work
window.PIXI = PIXI;

const canvas = document.getElementById("pixi-canvas");

const cellW = window.innerWidth / grid.width;
const cellHfW = cellW / 2;
const app = new PIXI.Application({
  view: canvas,
  width: window.innerWidth,
  height: cellW * grid.height,
  autoDensity: true,
  autoResize: true,
  resolution: window.devicePixelRatio || 1,
});

const loader = PIXI.Loader.shared;

// load sprites
export const loadSprites = (onLoaded) => {
  loader
    .add("static/fonts/menlo-bold.json")
    .add("static/fonts/menlo-bold-half.json")
    .add("tile", "static/tile.png")
    .load(onLoaded);
  return loader;
};

// texture helpers
const getFontTexture = ({ char }) => {
  return loader.resources["static/fonts/menlo-bold-half.json"].textures[
    menloBoldHalfAlphaMap[char]
  ];
};

export const getAsciTexture = ({ char }) => {
  return loader.resources["static/fonts/menlo-bold.json"].textures[
    menloBoldAlphaMap[char]
  ];
};

const getTileTexture = () => {
  return loader.resources.tile.texture;
};

const containers = {};
const containerNames = [
  "legend",
  "build",
  "fps",
  "map",
  "withinReachBelow",
  "withinReach",
  "ambiance",
  "adventureLog",
  "menu",
  "overlay",
];

containerNames.forEach((name) => {
  const width = grid[name].width * cellW;
  const height = grid[name].height * cellW;
  const x = grid[name].x * cellW;
  const y = grid[name].y * cellW;

  let graphics;

  if (name === "menu") {
    graphics = new PIXI.Graphics();
    graphics.beginFill(0x000000);
    graphics.drawRect(0, 0, width, height);
    graphics.endFill();
  }

  containers[name] = new PIXI.Container();
  containers[name].width = width;
  containers[name].height = height;
  containers[name].x = x;
  containers[name].y = y;

  app.stage.addChild(containers[name]);
  graphics && containers[name].addChild(graphics);
});

const uiSprites = {};
const uiSpriteContainerNames = [
  "legend",
  "build",
  "fps",
  "ambiance",
  "adventureLog",
  "menu",
  "overlay",
  "withinReach",
  "withinReachBelow",
];
uiSpriteContainerNames.forEach((name) => {
  // create array structure for storing uiSprites for later use
  uiSprites[name] = Array.from(Array(grid[name].height), () => []);
});

export const addSprite = ({
  container = "map",
  texture = gfx.chars.default,
  tint = gfx.colors.default,
  options = {},
  world,
  eid,
}) => {
  const sprite = new PIXI.Sprite(getAsciTexture({ char: texture }));
  world.sprites[eid] = _.merge(
    sprite,
    {
      renderable: false,
      // interactive is DEBUG ONLY
      // big cause of slowdown in pixijs when ALL sprites are interactive
      interactive: true,
      tint,
    },
    options,
    { char: texture, color: options.tint || tint }
  );

  // world.sprites[eid].on("click", (ev) => {
  //   const x = Position.x[eid];
  //   const y = Position.y[eid];
  //   const z = Position.z[eid];
  //   const pos = `${x},${y},${z}`;
  //   getState().eAtPos[pos].forEach(
  //     (e) => {}
  //     // console.log({ entity: getEntityData(world, e), state: getState() })
  //   );
  // });

  containers[container].addChild(world.sprites[eid]);
};

export const printCell = ({
  container,
  x = 0,
  y = 0,
  char,
  color = 0xcccccc,
  halfWidth = true,
  alpha = 1,
}) => {
  uiSprites[container][y][x].tint = color;
  uiSprites[container][y][x].alpha = alpha;
  const func = halfWidth ? getFontTexture : getAsciTexture;
  uiSprites[container][y][x].texture = func({ char });
};

export const printTile = ({
  container,
  x = 0,
  y = 0,
  color = 0xcccccc,
  alpha = 1,
}) => {
  uiSprites[container][y][x].tint = color;
  uiSprites[container][y][x].alpha = alpha;
  uiSprites[container][y][x].texture = getTileTexture();
};

export const printRow = ({
  container,
  x = 0,
  y = 0,
  width = null,
  str,
  color = 0xcccccc,
  halfWidth = true,
  alpha = 1,
}) => {
  const len = width || uiSprites[container][y].length;

  for (let i = 0; i < len; i++) {
    printCell({
      container,
      x: x + i,
      y,
      char: str[i],
      color,
      halfWidth,
      alpha,
    });
  }
};

export const printTemplate = ({
  container,
  x = 0,
  y = 0,
  halfWidth = true,
  template = [],
  alpha = 1,
}) => {
  let curX = x;
  for (const [i, t] of template.entries()) {
    printRow({
      container,
      x: curX,
      y,
      str: t.str,
      color: t.color || 0xcccccc,
      halfWidth,
      width: t.str.length,
      alpha: t.alpha || t.alpha === 0 ? t.alpha : alpha,
    });
    curX += t.str.length;
  }
};

export const initUi = () => {
  const initUiRow = ({ container, row, halfWidth = true }) => {
    _.times(grid[container].width * 2, (i) => {
      const sprite = new PIXI.Sprite(getFontTexture({ char: "" }));
      const width = halfWidth ? cellHfW : cellW;

      sprite.width = width;
      sprite.height = cellW;
      sprite.x = i * width;
      sprite.y = row * cellW;

      uiSprites[container][row][i] = sprite;
      containers[container].addChild(sprite);
    });
  };

  uiSpriteContainerNames.forEach((name) => {
    _.times(grid[name].height, (i) => {
      if (["overlay", "withinReach", "withinReachBelow"].includes(name)) {
        initUiRow({ container: name, row: i, halfWidth: false });
      } else {
        initUiRow({ container: name, row: i });
      }
    });
  });

  printRow({
    container: "build",
    str: `TAG: ${process.env.GIT_REV}`,
  });
};

export const clearContainer = (container) => {
  const str = new Array(grid[container].width).join(" ");
  uiSprites[container].forEach((row, i) => {
    printRow({ container, y: i, str });
  });
};

export const hideContainer = (container) => {
  containers[container].visible = false;
};

export const showContainer = (container) => {
  containers[container].visible = true;
};
