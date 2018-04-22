import pop from "../../../pop/index.js";
const { Texture, TileSprite } = pop;

const playerTex = new Texture("res/images/ld41-tiles.png");

class Grail extends TileSprite {
  constructor() {
    super(playerTex, 32, 32);
    this.frame.y = 6;
  }
}
export default Grail;
