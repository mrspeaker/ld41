import Cube from "../models/Cube.js";

class Particle {
  constructor (gl) {
    //super();
    this.life = 1;
    const cube = Cube.create(gl, "bullet", 0.3, 0.3, 0.3);
    cube.mesh.doBlending = true;
    //cube.position.setv(ray.near);
    this.cube = cube;
    //cube.rotation.setv(ray.ray).scale(180 / Math.PI);
    //cube.position.addv(ray.ray.scale(0.3));
  }

  update(dt) {
    const { cube, dir } = this;
    this.life -= dt;
    if (this.life <= 0) {
      this.dead = true;
    }
    const v = 0.4 * dt;
    // cube.position.x += dir.x * v;
    // cube.position.y += dir.y * v;
    // cube.position.z += dir.z * v;
    // cube.rotation.addv(this.dir);//.scale(0.9);
  }
}

export default Particle;
