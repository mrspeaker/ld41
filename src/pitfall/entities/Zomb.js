import pop from "../../pop/index.js";
const { Texture, Sprite } = pop;

const playerTex = new Texture("res/images/greona.png");

class Zomb extends Sprite {
  constructor (map) {
    super(playerTex);
    this.hitBox = {
      x: 4,
      y: 4,
      w: 10,
      h: 20
    };
    this.map = map;
  }
  update(dt, t) {
    const { pos } = this;
    pos.y += Math.sin(t) * dt;
  }
}
export default Zomb;
