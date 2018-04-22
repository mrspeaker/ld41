import Billboard from "../models/Billboard.js";
import Vec3 from "../math/Vec3.js";

class Zomb {
  constructor(gl, target) {
    //super();
    const cube = Billboard.create(gl, "zomb", 3, 3, 1);
    this.cube = cube;
    this.target = target;
    this.off = Math.random() * 100;
  }

  update(dt, t) {
    const { cube, target } = this;

    const dir = Vec3.from(cube.position)
      .scale(-1)
      .addv(target)
      .normalize();
    //cube.position.x += v;//dir.x * v;
    let v = 1 * dt;
    cube.position.x += dir.x * v;
    cube.position.y += dir.y * v;
    cube.position.z += dir.z * v;

    v = 0.4 * dt;
    cube.position.y += Math.sin(t + this.off) * v;//dir.y * v;
    //cube.position.z += v;//dir.z * v;
  }
}

export default Zomb;
