import pop from "../../pop/index.js";
const {
  Container,
  Camera,
  entity,
  Sound,
  State,
  Text,
  math,
  Texture,
  TileSprite,
  Timer
} = pop;

import Player2D from "./Player2D.js";
import Level from "./Level.js";
import Zomb from "./entities/Zomb.js";
import Grail from "./entities/Grail.js";
import OneUp from "./entities/OneUp.js";
import Overlay from "./Overlay.js";

const tiles = new Texture("res/images/ld41-tiles.png");

const laugh1 = new Sound("res/sounds/laugh.mp3", {});
const getSound = new Sound("res/sounds/get1.mp3", {});
const deadSound = new Sound("res/sounds/dead.mp3", {});
const theme = new Sound("res/sounds/theme.mp3", { volume: 0.1, loop: true });

class GameScreen extends Container {
  constructor(w, h, controls, onGameOver) {
    super();
    this.name = "game2d";
    this.onGameOver = onGameOver;
    this.alpha = 0;
    const map = new Level();
    const player = new Player2D(controls, map, () => {
      this.state.set("DIE");
      this.playerGotWacked();
    });
    const camera = new Camera(player, { w, h }, { w: map.w, h: map.h });
    this.add(camera);
    camera.add(map);
    this.grail = camera.add(new Container());
    this.baddies = camera.add(new Container());
    camera.add(player);

    const { pos } = player;
    pos.set(map.w / 2, map.h - map.tileH * 6);

    const placeGrail = (n, placed = []) => {
      if (n <= 0) return placed;
      const p = map.getPlatformSpot();
      if (placed.find(({ x, y }) => x == p.x && y == p.y)) {
        return placeGrail(n, placed);
      }
      return placeGrail(n - 1, [...placed, p]);
    };
    placeGrail(50).forEach(pos => {
      const g = this.grail.add(new Grail());
      g.pos.copy(pos);
    });

    this.controls = controls;
    this.player = player;
    this.camera = camera;
    this.map = map;

    this.remain = 25;
    this.isWin = false;
    this.state = new State("INIT");

    this.hearts = this.add(new Container());
    this.hearts.pos.x = 20;
    this.hearts.pos.y = 20;
    this.setHearts();

    this.msg = this.add(
      new Text("", {
        font: "bold 30pt 'Amatic SC', sans-serif",
        fill: "#fff",
        align: "center"
      })
    );
    this.msg.pos.set(w / 2, h / 2 - 80);

    this.overlay = null;
  }

  setHearts() {
    const { player, hearts } = this;
    const { hp } = player;
    hearts.map(h => (h.dead = true));
    [...Array(hp)].map((_, i) => {
      const t = new TileSprite(tiles, 32, 32);
      t.frame.x = 1;
      t.frame.y = 6;
      t.pos.x = i * 35;
      hearts.add(t);
    });
    const t = new TileSprite(tiles, 32, 32);
    t.frame.x = 0;
    t.frame.y = 6;
    t.pos.x = 75;
    t.pos.y = -18;
    t.scale.x = 2;
    t.scale.y = 2;
    t.alpha = 0.7;

    hearts.add(t);
    hearts
      .add(
        new Text(this.remain, {
          font: "bold 25pt 'Amatic SC', sans-serif",
          fill: "#fff",
          align: "center"
        })
      )
      .pos.set(107, 30);
  }

  addBaddie() {
    const { player, baddies, map, camera, lastLaugh } = this;

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
    if (Date.now() - (lastLaugh || 0) > 700) {
      laugh1.play();
      camera.flash();
      this.lastLaugh = Date.now();
    }
  }

  update(dt, t) {
    const { state, player } = this;
    super.update(dt, t);
    state.update(dt);
    switch (state.get()) {
      case "INIT":
        // Hack to get it to erase existing title screen on first frame.
        this.alpha = state.time < 0.1 ? 0.01 : 0;

        if (state.time > 5) {
          state.set("READY");
        }
        break;
      case "READY":
        // if (!this.overlay) {
        //   this.overlay = this.add(new Overlay());
        //   this.overlay.pos.set(300, 100);
        // }
        if (state.first) {
          this.add(new Timer(4, r => (this.alpha = r), () => (this.alpha = 1)));
        }
        this.msg.text = "Collect " + this.remain + " talismen. That's all.";
        if (state.time > 4) {
          this.msg.text = "";
          state.set("PLAY");
          theme.play();
          this.remove(this.overlay);
          //this.overlay = null;
        }
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
        this.msg.text = "You have died in 2D. The worst dimension.";
        if (state.time > 5) {
          this.msg.text = "";
          state.set("DEAD");
        }
        break;
      case "DEAD":
        theme.stop();
        this.onGameOver();
        break;
    }
  }

  playerGotWacked() {
    const { camera, player } = this;
    camera.shake(15);
    this.setHearts();
    deadSound.play();
    const ou = camera.add(
      new OneUp(
        new Text("OUCH!", {
          font: "bold 20pt 'Amatic SC', sans-serif",
          fill: "#fff"
        })
      )
    );
    ou.pos.copy(player.pos);
  }

  updatePlay() {
    const { baddies, player, grail, camera } = this;
    entity.hits(player, baddies, b => {
      if (!b.state.is("SWARM")) {
        return;
      }
      if (player.hitBy(b)) {
        this.playerGotWacked();
      }
      b.kill();
    });

    entity.hits(player, grail, g => {
      this.remain = Math.max(0, this.remain - 1);
      this.setHearts();
      getSound.play();
      const ou = camera.add(
        new OneUp(
          new Text(this.remain + "", {
            font: "bold 20pt 'Amatic SC', sans-serif",
            fill: "#fff"
          })
        )
      );
      ou.pos.copy(g.pos);
      g.dead = true;
      if (this.remain <= 0 && !this.isWin) {
        this.state.set("WIN");
        player.wins = true;
      }
    });
  }
}

export default GameScreen;
