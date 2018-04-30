import Cube from "../models/Cube.js";

class Particle {
  constructor (gl) {
    //super();
    this.life = 4;
    const cube = Cube.create(gl, "bullet", 0.3, 0.3, 0.3);
    cube.mesh.doBlending = true;
    //cube.position.setv(ray.near);
    this.cube = cube;
    //cube.rotation.setv(ray.ray).scale(180 / Math.PI);
    //cube.position.addv(ray.ray.scale(0.3));
    this.dir = {
      x: Math.random() - 0.5,
      y: Math.random() * 4,
      z: Math.random() - 0.5
    };
  }

  update(dt) {
    const { cube, dir } = this;
    this.life -= dt;
    if (this.life <= 0) {
      this.dead = true;
    }
    const v = 1.5 * dt;
    cube.position.x += dir.x * v;
    cube.position.y += dir.y * v;
    cube.position.z += dir.z * v;
    cube.rotation.addv(this.dir);//.scale(0.9);
    dir.y += 1 * dt;
    cube.scale.scale(0.99);
  }
}

export default Particle;
