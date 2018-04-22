import pop from "../../../pop/index.js";
const { Texture, Sprite, State, math } = pop;

const playerTex = new Texture("res/images/greona.png");

class Zomb extends Sprite {
  constructor(map) {
    super(playerTex);
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
  }
  update(dt, t) {
    const { state } = this;
    state.update(dt);
    switch (state.get()) {
      case "INIT":
        state.set("BIRTH");
        break;
      case "BIRTH":
        this.visible = ((t * 5) % 2) | 0;
        if (state.time > 2) {
          this.visible = true;
          state.set("SWARM");
        }
        break;
      case "SWARM":
        this.updateSwarm(dt, t);
        break;
    }
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
  }
}
export default Zomb;
