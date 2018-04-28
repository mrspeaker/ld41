import pop from "../pop/index.js";
const { Game, KeyControls } = pop;

import Game3D from "./minecraft/Game3D.js";
import GameScreen from "./pitfall/GameScreen.js";
import TitleScreen from "./TitleScreen.js";

import fullscreen from "./fullscreen.js";

const w = 900;
const h = 500;

const game3D = new Game3D(w, h);
const game2D = new Game(w, h, "#pitfall");

const controls = new KeyControls();
fullscreen("#games", "#fs");

function newGame(reset3D) {
  if (reset3D) {
    game3D.reset();
  }
  game2D.scene = new GameScreen(w, h, controls, title);
}

function title() {
  game3D.clear();
  game2D.scene = new TitleScreen(w, h, controls, () => newGame(true));
}

// MAIN
preload()
  .then(res => game3D.init(res))
  .then(title);

function preload() {
  const loadImg = src =>
    new Promise(res => {
      const img = new Image();
      img.src = src;
      img.addEventListener("load", () => res(img), false);
    });

  return Promise.all(
    [
      { name: "blocks", src: "res/images/mine.png", type: "tex" },
      { name: "cube0", src: "res/images/mc_rt.png", type: "img" },
      { name: "cube1", src: "res/images/mc_lf.png", type: "img" },
      { name: "cube2", src: "res/images/mc_up.png", type: "img" },
      { name: "cube3", src: "res/images/mc_dn.png", type: "img" },
      { name: "cube4", src: "res/images/mc_bk.png", type: "img" },
      { name: "cube5", src: "res/images/mc_ft.png", type: "img" },
      { name: "ringu", src: "res/images/ringu.png", type: "tex" }
    ].map(
      ({ name, src, type }) =>
        new Promise(res => {
          switch (type) {
            case "tex":
            case "img":
              loadImg(src).then(img => res({ name, src, type, img }));
              break;
          }
        })
    )
  );
}

function interdimensionalLogic() {
  const { scene } = game2D;
  if (scene.state.is("DIE")) {
    game3D.isDead = true;
  }
  if (scene.state.is("WIN")) {
    game3D.isWin = true;
  }
  if (game3D.world.col.length && scene.state.is("PLAY")) {
    scene.addBaddie();
  }
}

game2D.run((dt, t) => {
  if (game2D.scene.name === "game2d") {
    game3D.update(dt, t);
    interdimensionalLogic();
    game3D.render(dt, t);
  }
});
