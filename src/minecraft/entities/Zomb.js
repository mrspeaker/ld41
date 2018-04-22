import Billboard from "../models/Billboard.js";
import Vec3 from "../math/Vec3.js";

class Zomb {
  constructor(gl, target, map) {
    //super();
    const cube = Billboard.create(gl, "zomb", 1, 2, 1);
    this.cube = cube;
    this.target = target;
    this.off = Math.random() * 100;
    this.frame = 0;
    this.map = map;
    this.speed = Math.random() * 2 + 0.5;
  }

  update(dt, t) {
    const { cube, target, map, speed } = this;
    //this.frame = (t % 100) | 0;
    const dir = Vec3.from(cube.position)
      .scale(-1)
      .addv(target)
      .normalize();
    let v = speed * dt;
    cube.position.x += dir.x * v;
    //cube.position.y += dir.y * v;
    cube.position.z += dir.z * v;
    if (map.getCell(cube.position.x, cube.position.y - 1, cube.position.z)) {
      cube.position.y += 1;
    } else if (!map.getCell(cube.position.x, cube.position.y - 1.5, cube.position.z)) {
      cube.position.y -= 1;
    }

  }
}

export default Zomb;
