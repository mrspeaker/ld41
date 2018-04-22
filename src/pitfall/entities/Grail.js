import pop from "../../../pop/index.js";
const { Texture, TileSprite } = pop;

const playerTex = new Texture("res/images/ld41-tiles.png");

class Grail extends TileSprite {
  constructor() {
    super(playerTex, 32, 32);
    this.frame.y = 6;
    this.offset = Math.random() * 100;
  }
  update(dt, t) {
    this.pos.x += Math.sin((t + this.offset) * 3) * 0.1;
  }
}
export default Grail;
