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

    const anims = new AnimManager(this);
    anims.add("idle", [{ x: 0, y: 0 }], 1000);
    anims.add("walk", [1, 2, 3, 4, 5].map(x => ({ x, y: 0 })), 0.1);
    anims.add("climb", [0, 1].map(x => ({ x, y: 1 })), 0.1);
    anims.play("walk");
    this.anims = anims;

    this.controls = controls;
    this.map = map;
    this.onGameOver = onGameOver;

    this.hp = 2;
    this.invincible = 0;
    this.dead = false;
    this.wins = false;
  }

  hitBy() {
    if (this.invincible > 0 || this.dead || this.wins) {
      return false;
    }
    if (--this.hp <= 0) {
      this.onGameOver();
      this.dead = true;
      return false;
    }
    this.invincible = 3;
    return true;
  }

  update(dt, t) {
    const { pos, controls, map, anims, anchor, scale } = this;
    const { x, y } = controls;
    const xo = 100 * dt * Math.sign(x);
    const yo = 100 * dt * Math.sign(y);
    const r = wallslideWithLadders(this, map, xo, yo);
    if (!this.onLadder) {
      pos.x += r.x;
      // TODO: LOLOLOLOL... last minute fix for ladder climb teleport bug!
      pos.x = Math.min(1540, pos.x);
    }
    pos.y += r.y;

    if (this.invincible) {
      this.visible = ((t * 10) % 2) | 0;
      if ((this.invincible -= dt) <= 0) {
        this.visible = true;
      }
    }

    if (!this.onLadder) {
      if (!x) {
        anims.play("idle");
      }
      else {
        anims.play("walk");
        anchor.x = x > 0 ? 0 : this.w;
        scale.x = x > 0 ? 1 : -1;
      }
    } else {
      if (!y) anims.stop();
      else anims.play("climb");
    }
    anims.update(dt);
  }
}
export default Player2D;
