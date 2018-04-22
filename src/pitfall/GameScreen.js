import pop from "../../pop/index.js";
const { Container, Camera, KeyControls, entity } = pop;

import Player2D from "./Player2D.js";
import Level from "./Level.js";
import Zomb from "./entities/Zomb.js";
import Grail from "./entities/Grail.js";

class GameScreen extends Container {
  constructor(w, h) {
    super();
    const controls = new KeyControls();
    const map = new Level();
    const player = new Player2D(controls, map);
    const camera = new Camera(player, { w, h }, { w: map.w, h: map.h });

    this.add(camera);
    camera.add(map);
    this.baddies = camera.add(new Container());
    this.grail = camera.add(new Container());
    camera.add(player);

    const { pos } = player;
    pos.set(map.w / 2, map.h - map.tileH * 6);

    [...Array(100)].map(() => {
      const g = this.grail.add(new Grail());
      g.pos.copy(map.getPlatformSpot());
    });

    this.controls = controls;
    this.player = player;
    this.camera = camera;
    this.map = map;

  }

  addBaddie() {
    const { player, baddies, map } = this;
    const z = baddies.add(new Zomb(map));
    z.pos.copy(player.pos);
  }

  update (dt, t) {
    super.update(dt, t);
    const { baddies, player, grail } = this;

    entity.hits(player, grail, g => {
      grail.remove(g);
      console.log("get");
    });
  }
}

export default GameScreen;
