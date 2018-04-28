import pop from "../../../pop/index.js";
const { AnimManager, Texture, TileSprite, State, math } = pop;

const playerTex = new Texture("res/images/ghostbuster.png");

class Zomb extends TileSprite {
  constructor(map) {
    super(playerTex, 32, 32);
    this.hitBox = {
      x: 4,
      y: 4,
      w: 10,
      h: 20
    };
    const speed = math.rand(40, 80);
    this.vel = {
      x: math.randOneIn(2) ? -speed : speed,
      y: 0
    };
    this.map = map;
    this.state = new State("INIT");
    this.frame.y = 2;
    this.frame.x = 0;

    this.anims = new AnimManager(this);
    this.anims.add("walk", [0, 1, 2, 1].map(x => ({ x, y: 2 })), 0.2);
    this.anims.add("splode", [0, 1, 2, 3, 4].map(x => ({ x, y: 3 })), 0.1);
    this.anims.play("walk");
  }
  update(dt, t) {
    const { state, anims } = this;
    state.update(dt);
    anims.update(dt);
    switch (state.get()) {
      case "INIT":
        state.set("BIRTH");
        this.spawnY = this.pos.y;
        this.pos.y -= 55;
        this.alpha = 0.1;
        break;
      case "BIRTH":
        this.visible = ((t * 5) % 2) | 0;
        this.pos.y += 25 * dt;
        this.alpha += 0.6 * dt;
        if (state.time > 2) {
          this.alpha = 1;
          this.visible = true;
          state.set("SWARM");
          this.pos.y = this.spawnY;
        }
        break;
      case "SWARM":
        this.updateSwarm(dt, t);
        break;
      case "SPLODE":
        if (state.time > 1) {
          state.set("DEAD");
        }
        this.pos.y -= 30 * dt;
        this.opacity -= 1 * dt;
        break;
      case "DEAD":
        this.dead = true;
        break;
    }
  }

  kill() {
    this.state.set("SPLODE");
    this.anims.play("splode");
  }

  updateSwarm(dt, t) {
    const { pos, vel, map, w, h } = this;
    pos.x += vel.x * dt;
    pos.y += vel.y * dt;

    // Face direction
    this.anchor.y += Math.sin(t * 10) * 0.1;
    this.anchor.x = vel.x > 0 ? w : 0;
    this.scale.x = vel.x > 0 ? -1 : 1;

    // Check for edge of platform
    const xo = vel.x < 0 ? 0 : w;
    const [nextTo, under] = [0, h].map(yo => {
      const p = map.pixelToMapPos({ x: pos.x + xo, y: pos.y + yo });
      const f = map.tileAtMapPos(p).frame;
      return f.walkable && !f.cloud;
    });
    // Hit edge of platform!
    if (!nextTo || under) {
      vel.x *= -1;
    }

    //this.frame.x = (t * 5) % 2 | 0;
  }
}
export default Zomb;
