import pop from "../../pop/index.js";
const { Container, Camera, KeyControls, entity, Sound } = pop;

import Player2D from "./Player2D.js";
import Level from "./Level.js";
import Zomb from "./entities/Zomb.js";
import Grail from "./entities/Grail.js";

const laugh1 = new Sound("res/sounds/laugh2.mp3", {});

class GameScreen extends Container {
  constructor(w, h, onGameOver) {
    super();
    const controls = new KeyControls();
    const map = new Level();
    const player = new Player2D(controls, map, onGameOver);
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

  update (dt, t) {
    super.update(dt, t);
    const { baddies, player, grail, camera } = this;

    entity.hits(player, baddies, b => {
      if (!b.state.is("SWARM")) {
        return;
      }
      if (player.hitBy(b)) {
        camera.shake(15);
      }
      b.dead = true;
      baddies.remove(b);
    });

    entity.hits(player, grail, g => {
      // Should give ammo to player
      grail.remove(g);
    });
  }
}

export default GameScreen;
