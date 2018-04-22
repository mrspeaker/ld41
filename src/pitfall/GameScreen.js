import pop from "../../pop/index.js";
const { Container, Camera, KeyControls } = pop;

import Player2D from "./Player2D.js";
import Level from "./Level.js";

class GameScreen extends Container {
  constructor(w, h) {
    super();
    const controls = new KeyControls();
    const map = Level();
    const player = new Player2D(controls, map);
    const camera = new Camera(player, { w, h }, { w: map.w, h: map.h });

    this.add(camera);
    camera.add(map);
    camera.add(player);

    const { pos } = player;
    pos.set(map.w / 2, map.h - map.tileH * 6);

    this.controls = controls;
    this.player = player;
    this.camera = camera;
    this.map = map;

  }
}

export default GameScreen;
