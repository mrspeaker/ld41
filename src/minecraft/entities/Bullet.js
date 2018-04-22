import Cube from "../models/Cube.js";

class Bullet {
  constructor (gl, ray) {
    //super();
    this.life = 1;
    const cube = Cube.create(gl, "bullet", 0.3, 0.3, 0.3);
    cube.mesh.doBlending = true;
    //cube.mesh.noCulling = false;
    cube.position.setv(ray.near);
    this.cube = cube;
    this.dir = {
      x: ray.ray.x * (180 / Math.PI),
      y: ray.ray.y * (180 / Math.PI),
      z: ray.ray.z * (180 / Math.PI)
    };
    cube.rotation.setv(ray.ray).scale(180 / Math.PI);
    cube.position.addv(ray.ray.scale(1));
  }

  update(dt) {
    const { cube, dir } = this;
    this.life -= dt;
    if (this.life <= 0) {
      this.dead = true;
    }
    const v = 0.4 * dt;
    cube.position.x += dir.x * v;
    cube.position.y += dir.y * v;
    cube.position.z += dir.z * v;
    cube.rotation.addv(this.dir).scale(0.9);
  }
}

export default Bullet;
