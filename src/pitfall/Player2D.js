import pop from "../../pop/index.js";
const { Texture, Sprite,  wallslideWithLadders } = pop;

const playerTex = new Texture("res/images/greona.png");

class Player2D extends Sprite {
  constructor (controls, map) {
    super(playerTex);
    this.hitBox = {
      x: 4,
      y: 4,
      w: 10,
      h: 20
    };
    this.controls = controls;
    this.map = map;
  }
  update(dt) {
    const { pos, controls, map } = this;
    const { x, y } = controls;
    const xo = 100 * dt * Math.sign(x);
    const yo = 100 * dt * Math.sign(y);
    const r = wallslideWithLadders(this, map, xo, yo);
    if (!this.onLadder) {
      pos.x += r.x;
    }
    pos.y += r.y;

  }
}
export default Player2D;
