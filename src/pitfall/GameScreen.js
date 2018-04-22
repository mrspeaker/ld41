import pop from "../../pop/index.js";
const { Container, Camera, KeyControls } = pop;

import Player2D from "./Player2D.js";
import Level from "./Level.js";
import Zomb from "./entities/Zomb.js";

class GameScreen extends Container {
  constructor(w, h) {
    super();
    const controls = new KeyControls();
    const map = Level();
    const player = new Player2D(controls, map);
    const camera = new Camera(player, { w, h }, { w: map.w, h: map.h });

    this.add(camera);
    camera.add(map);
    this.baddies = camera.add(new Container());
    camera.add(player);

    const { pos } = player;
    pos.set(map.w / 2, map.h - map.tileH * 6);

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
}

export default GameScreen;
