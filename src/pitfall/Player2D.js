import pop from "../../pop/index.js";
const { AnimManager, Texture, TileSprite, wallslideWithLadders } = pop;

const playerTex = new Texture("res/images/ghostbuster.png");

class Player2D extends TileSprite {
  constructor(controls, map, onGameOver) {
    super(playerTex, 32, 32);
    this.hitBox = {
      x: 4,
      y: 4,
      w: 10,
      h: 20
    };
    this.anims = new AnimManager(this);
    this.anims.add("idle", [{ x: 0, y: 0 }], 1000);
    this.anims.add("walk", [1, 2, 3, 4, 5].map(x => ({ x, y: 0 })), 0.1);
    this.anims.add("climb", [0, 1].map(x => ({ x, y: 1 })), 0.1);
    this.anims.play("walk");

    this.controls = controls;
    this.map = map;
    this.hp = 2;
    this.invincible = 0;
    this.onGameOver = onGameOver;
  }

  hitBy(b) {
    if (this.invincible > 0) {
      return;
    }
    if (--this.hp <= 0) {
      this.onGameOver();
      return;
    }
    this.invincible = 2;
  }

  update(dt, t) {
    const { pos, controls, map, anims } = this;
    const { x, y } = controls;
    const xo = 100 * dt * Math.sign(x);
    const yo = 100 * dt * Math.sign(y);
    const r = wallslideWithLadders(this, map, xo, yo);
    if (!this.onLadder) {
      pos.x += r.x;
    }
    pos.y += r.y;

    if (this.invincible) {
      this.visible = ((t * 10) % 2) | 0;
      this.invincible -= dt;
      if (this.invincible <= 0) {
        this.visible = true;
      }
    }

    if (!this.onLadder) {
      if (!x) anims.play("idle");
      else {
        anims.play("walk");
        if (x > 0) {
          this.anchor.x = 0;
          this.scale.x = 1;
        } else if (x < 0) {
          this.anchor.x = this.w;
          this.scale.x = -1;
        }
      }
    } else {
      if (!y) anims.stop();
      else anims.play("climb");
    }
    anims.update(dt);
  }
}
export default Player2D;
