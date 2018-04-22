import pop from "../../pop/index.js";
const { Container, Camera, entity, Sound, State, Text, math, Texture, TileSprite } = pop;

import Player2D from "./Player2D.js";
import Level from "./Level.js";
import Zomb from "./entities/Zomb.js";
import Grail from "./entities/Grail.js";
import OneUp from "./entities/OneUp.js";


const tiles = new Texture("res/images/ld41-tiles.png");

const laugh1 = new Sound("res/sounds/laugh2.mp3", {});

class GameScreen extends Container {
  constructor(w, h, controls, onGameOver) {
    super();
    this.name = "game2d";
    this.onGameOver = onGameOver;
    const map = new Level();
    const player = new Player2D(controls, map, () => {
      this.state.set("DIE");
      this.setHearts();
    });
    const camera = new Camera(player, { w, h }, { w: map.w, h: map.h });

    this.add(camera);
    camera.add(map);
    this.grail = camera.add(new Container());
    this.baddies = camera.add(new Container());
    camera.add(player);

    const { pos } = player;
    pos.set(map.w / 2, map.h - map.tileH * 6);

    [...Array(50)].map(() => {
      const g = this.grail.add(new Grail());
      g.pos.copy(map.getPlatformSpot());
    });

    this.controls = controls;
    this.player = player;
    this.camera = camera;
    this.map = map;

    this.remain = 20;
    this.isWin = false;
    this.state = new State("INIT");

    this.hearts = this.add(new Container());
    this.hearts.pos.x = 50;
    this.hearts.pos.y = 50;
    this.setHearts();
  }

  setHearts() {
    const { player, hearts } = this;
    const { hp } = player;
    hearts.map(h => h.dead = true);
    [...Array(hp)].map((_, i) => {
      const t = new TileSprite(tiles, 32, 32);
      t.frame.x = 1;
      t.frame.y = 6;
      t.pos.x = i * 35;
      hearts.add(t);
    });
  }

  addBaddie() {
    const { player, baddies, map, camera } = this;
    const z = baddies.add(new Zomb(map));
    if (player.onLadder) {
      const exit = map.getLadderExit(player.pos);
      if (exit) {
        z.pos.copy(exit);
      } else {
        // Stuck on ladder!
        z.pos.copy(player.pos);
      }
    } else {
      z.pos.copy(player.pos);
    }
    laugh1.play();
    camera.flash();
  }

  update(dt, t) {
    super.update(dt, t);

    const { state, player } = this;
    state.update(dt);
    switch (state.get()) {
      case "INIT":
        state.set("PLAY");
        break;
      case "PLAY":
        this.updatePlay(dt, t);
        break;
      case "WIN":
        this.isWin = true;
        if (state.time > 12) {
          state.set("DEAD");
        } else {
          const ou = this.camera.add(
            new OneUp(
              new Text("WIN!", {
                font: "bold 15pt 'Amatic SC', sans-serif",
                fill: "#fff"
              })
            )
          );
          ou.pos
            .copy(player.pos)
            .add({ x: math.rand(-120, 120), y: math.rand((-120, 120)) });
        }

        break;
      case "DIE":
        if (state.time > 5) {
          state.set("DEAD");
        }
        break;
      case "DEAD":
        this.onGameOver();
        break;
    }
  }

  updatePlay() {
    const { baddies, player, grail, camera } = this;
    entity.hits(player, baddies, b => {
      if (!b.state.is("SWARM")) {
        return;
      }
      if (player.hitBy(b)) {
        camera.shake(15);
        this.setHearts();
      }
      b.kill();
    });

    entity.hits(player, grail, g => {
      this.remain = Math.max(0, this.remain - 1);
      const ou = camera.add(
        new OneUp(
          new Text(this.remain + "", {
            font: "bold 20pt 'Amatic SC', sans-serif",
            fill: "#fff"
          })
        )
      );
      ou.pos.copy(g.pos);
      g.dead = true; //remove(g);
      if (this.remain <= 0 && !this.isWin) {
        this.state.set("WIN");
        player.wins = true;
      }
    });
  }
}

export default GameScreen;
