import Transform from "../math/Transform.js";

class Bullet extends Transform {
  constructor () {
    super();
    this.life = 2;
  }

  update(dt) {
    this.life -= dt;
    if (this.life <= 0) {
      this.dead = true;
    }
  }
}

export default Bullet;
