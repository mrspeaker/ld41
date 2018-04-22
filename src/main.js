import pop from "../pop/index.js";
const { Game} = pop;

import Game3D from "./minecraft/Game3D.js";
import GameScreen from "./pitfall/GameScreen.js";

const pxWidth = 900;
const pxHeight = 500;

const mcGame = new Game3D(pxWidth, pxHeight);
const game = new Game(pxWidth, pxHeight, "#pitfall");
const { w, h } = game;

function newGame(reset3D) {
  if (reset3D) {
    mcGame.reset();
  }
  game.scene = new GameScreen(w, h, () => newGame(true));
}

// MAIN
preload()
  .then((res) => mcGame.init(res))
  .then(() => {
    newGame(false);
  });

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
      { name: "ad", src: "res/images/zombo1.png", type: "tex" },
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

game.run((dt, t) => {
  mcGame.update(dt, t);

  // Logic between worlds...
  if (mcGame.world.col.length) {
    game.scene.addBaddie();
  }


  mcGame.render(dt, t);
});
