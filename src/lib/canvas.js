import _ from "lodash";
import * as PIXI from "pixi.js-legacy";
import { grid } from "./grid";
import { menloBoldAlphaMap } from "../../static/fonts/menlo-bold.map";
import { menloBoldHalfAlphaMap } from "../../static/fonts/menlo-bold-half.map";
import { getEntitiesAtPos } from "./ecsHelpers";

// add PIXI to the window so the devtools work
window.PIXI = PIXI;

const canvas = document.getElementById("pixi-canvas");

const cellW = window.innerWidth / grid.width;
const cellH = cellW;
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

// load textures
export const loadTextures = (onLoaded) => {
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

const initPixiContainerRow = ({ container, row }) => {
  const width = container.halfWidth ? container.width * 2 : container.width;
  const func = container.halfWidth ? getFontTexture : getAsciTexture;

  _.times(width, (i) => {
    const sprite = new PIXI.Sprite(func({ char: " " }));
    const spriteWidth = container.halfWidth ? cellHfW : cellW;
    const spriteHeight = cellH;

    sprite.width = spriteWidth;
    sprite.height = spriteHeight;
    sprite.x = i * spriteWidth;
    sprite.y = row * spriteHeight;
    sprite.debug = { container, x: i, y: row };

    sprite.interactive = true;
    sprite.on("click", () => {
      console.log({ sprite, ents: getEntitiesAtPos({ x: i, y: row }) });
    });

    container.sprites[row][i] = sprite;
    container.container.addChild(sprite);
  });
};

const initPixiContainerSprites = (container) => {
  _.times(container.height, (i) => {
    initPixiContainerRow({ container, row: i });
  });
};

const initPixiContainer = (container) => {
  const width = container.width * cellW;
  const height = container.height * cellW;
  const x = container.x * cellW;
  const y = container.y * cellW;

  container.container = new PIXI.Container();
  container.container.width = width;
  container.container.height = height;
  container.container.x = x;
  container.container.y = y;

  if (container.name === "float") {
    container.bg = new PIXI.Sprite(getTileTexture());
    container.bg.width = width;
    container.bg.height = height;
    container.bg.x = 0;
    container.bg.y = 0;
    container.bg.tint = 0x333333;
    container.bg.alpha = 1;
    container.container.addChild(container.bg);
  }

  app.stage.addChild(container.container);
};

let containers;
export const initUi = () => {
  containers = _.reduce(
    grid,
    (acc, val, key) => {
      if (["width", "height"].includes(key)) return acc;

      acc[key] = {
        container: {},
        sprites: Array.from(Array(val.height), () => []),
        ...val,
      };

      initPixiContainer(acc[key]);
      initPixiContainerSprites(acc[key]);

      return acc;
    },
    {}
  );

  printRow({
    container: "build",
    str: `TAG: ${process.env.GIT_REV}`,
  });
};

export const printCell = ({
  container,
  x = 0,
  y = 0,
  char,
  color = 0xcccccc,
  alpha = 1,
}) => {
  containers[container].sprites[y][x].tint = color;
  containers[container].sprites[y][x].alpha = alpha;
  const func = containers[container].halfWidth
    ? getFontTexture
    : getAsciTexture;
  containers[container].sprites[y][x].texture = func({ char });
};

export const printTile = ({
  container,
  x = 0,
  y = 0,
  color = 0xcccccc,
  alpha = 1,
}) => {
  containers[container].sprites[y][x].tint = color;
  containers[container].sprites[y][x].alpha = alpha;
  containers[container].sprites[y][x].texture = getTileTexture();
};

export const printRow = ({
  container,
  x = 0,
  y = 0,
  width = null,
  str,
  color = 0xcccccc,
  alpha = 1,
}) => {
  const len = width || containers[container].sprites[y].length;
  for (let i = 0; i < len; i++) {
    printCell({
      container,
      x: x + i,
      y,
      char: str[i],
      color,
      halfWidth: containers[container].halfWidth,
      alpha,
    });
  }
};

export const printTemplate = ({
  container,
  x = 0,
  y = 0,
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
      halfWidth: containers[container].halfWidth,
      width: t.str.length,
      alpha: t.alpha || t.alpha === 0 ? t.alpha : alpha,
    });
    curX += t.str.length;
  }
};

export const clearContainer = (container) => {
  const str = new Array(containers[container].width).join(" ");
  containers[container].sprites.forEach((row, i) => {
    printRow({ container, y: i, str });
  });
};

export const hideContainer = (container) => {
  containers[container].container.visible = false;
};

export const showContainer = (container) => {
  containers[container].container.visible = true;
};

export const hideFloat = (container) => {
  clearContainer(container);
  containers[container].container.visible = false;
};

export const showFloat = (container, position, templates) => {
  if (!templates.length) return hideFloat(container);

  // TODO: this position should be sorted later, need to get full width, height and then make sure it's visible and not covering player
  const offset = 1;
  containers[container].container.x =
    (position.x + offset + grid.map.x) * cellW;
  containers[container].container.y =
    (position.y + offset + grid.map.y) * cellW;

  const height = templates.length;
  // longest template.str / 2 round up
  console.log(templates);

  const width = _.maxBy(templates, (t) => t.str.length).str.length / 2;

  console.log(width);

  containers[container].bg.width = width * cellW;
  containers[container].bg.height = height * cellW;

  templates.forEach((t, i) => {
    printTemplate({
      container,
      x: 0,
      y: 0 + i,
      template: [t],
    });
  });

  containers[container].container.visible = true;
};
