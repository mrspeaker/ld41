import Vec3 from "./math/Vec3.js";

class Player {
  constructor(controls, camera, world) {
    this.controls = controls;
    this.world = world;
    this.camera = camera;
    this.pos = new Vec3(0.5, 20, 0.5);
    this.acc = new Vec3();
    this.vel = new Vec3();

    this.w = 0.6;
    this.h = 1.7;
    this.speed = 6;

    camera.transform.rotation.y = 0;
  }

  // See if you are standing in a cell.
  testCell(cx, cy, cz) {
    const { pos } = this;
    const w = this.w / 2;
    const h = this.h / 2;
    return [
      { x: pos.x - w, y: pos.y - h, z: pos.z - w },
      { x: pos.x + w, y: pos.y - h, z: pos.z - w },
      { x: pos.x - w, y: pos.y - h, z: pos.z + w },
      { x: pos.x + w, y: pos.y - h, z: pos.z + w },
      { x: pos.x - w, y: pos.y + 0, z: pos.z - w },
      { x: pos.x + w, y: pos.y + 0, z: pos.z - w },
      { x: pos.x - w, y: pos.y + 0, z: pos.z + w },
      { x: pos.x + w, y: pos.y + 0, z: pos.z + w },
      { x: pos.x - w, y: pos.y + h, z: pos.z - w, top: true },
      { x: pos.x + w, y: pos.y + h, z: pos.z - w, top: true },
      { x: pos.x - w, y: pos.y + h, z: pos.z + w, top: true },
      { x: pos.x + w, y: pos.y + h, z: pos.z + w, top: true }
    ].some(({ x, y, z }) => {
      return Math.floor(x) == cx && Math.floor(y) == cy && Math.floor(z) == cz;
    });
  }

  update(dt) {
    const { camera, world, pos, controls, vel, acc, speed } = this;
    const { transform } = camera;
    const { keys } = controls;

    let xo = 0;
    let yo = 0;
    let zo = 0;

    // TODO: sqrt 2
    if (keys.isDown(87 /*w*/) || keys.isDown(90 /*q*/) || keys.isDown(83)) {
      const dir = keys.isDown(83) ? 1 : -1;
      const v = dt * speed * dir;
      // Get 2D direction
      const angle = Math.atan2(transform.forward[2], transform.forward[0]);
      xo += Math.cos(angle) * v;
      zo += Math.sin(angle) * v;
    }
    if (
      keys.isDown(65 /*a*/) ||
      keys.isDown(81 /*q*/) ||
      keys.isDown(68 /*d*/)
    ) {
      const dir = keys.isDown(68) ? 1 : -1;
      const v = dt * speed * dir;
      xo += transform.right[0] * v;
      zo += transform.right[2] * v;
    }

    // Jump everybody
    if (keys.isDown(32) && this.onGround) {
      acc.y = 0.25; // jump force
      this.onGround = false;
    }
    vel.y += acc.y;
    vel.y -= dt * 0.75; // gravity;
    yo = vel.y;

    /*
      Collisions with voxels is the same as "wallsliding collision detction"
      from 2D games. Because it's a regular grid, it works the same way - only
      with an extra dimension.

      First figure out how much you WANT to move by for the current frame.
      For example:
      const xo = 0.1;
      const yo = -0.1;
      const zo = 0;

      The player wants to move to the right (from a keypress), and down (probably
      becaues of gravity).

      Now we need to determine how much they are ALLOWED to move along each axis.

      First check the x dimension. If the current position PLUS the amount the
      player wants to move along the X axis is a solid block, then disallow that
      moement and reset xo to 0.
      if (!getWorldCell(x + xo, y, z)) xo = 0;

      Then do the same again on the Z axis. Notice this time we use the `xo` amount
      too, as it has either been allowed, or reset to 0 in the previous step:
      if (!getWorldCell(x + xo, y, z + zo)) zo = 0;

      Finally, do the same with Y:
      if (!getWorldCell(x + xo, y + yo, z + zo)) yo = 0;

      That's the idea: but that assumes the player is a POINT withouth width or height!
      You need to check all the corners of the player at least - but probably also
      the center if they are taller than one cube (otherwise they could jump *through*
      a solitary floating cube if their head doesn't hit AND their feet don't hit.)

      The way I've done it below is horrible, a lot of redundant checks. I will clean
      it up and refactor it after I figure out some better lighting... priorities!

    */
    const w = this.w / 2;
    const h = this.h / 2;
    [
      { x: pos.x - w, y: pos.y - h, z: pos.z - w, feet: true },
      { x: pos.x + w, y: pos.y - h, z: pos.z - w, feet: true },
      { x: pos.x - w, y: pos.y - h, z: pos.z + w, feet: true },
      { x: pos.x + w, y: pos.y - h, z: pos.z + w, feet: true },
      { x: pos.x - w, y: pos.y + 0, z: pos.z - w },
      { x: pos.x + w, y: pos.y + 0, z: pos.z - w },
      { x: pos.x - w, y: pos.y + 0, z: pos.z + w },
      { x: pos.x + w, y: pos.y + 0, z: pos.z + w },
      { x: pos.x - w, y: pos.y + h, z: pos.z - w, top: true },
      { x: pos.x + w, y: pos.y + h, z: pos.z - w, top: true },
      { x: pos.x - w, y: pos.y + h, z: pos.z + w, top: true },
      { x: pos.x + w, y: pos.y + h, z: pos.z + w, top: true }
    ].forEach(({ x, y, z, top, feet }) => {
      if (xo != 0 && world.getCell(x + xo, y, z)) xo = 0;
      if (zo != 0 && world.getCell(x + xo, y, z + zo)) zo = 0;
      if (yo != 0 && world.getCell(x + xo, y + yo, z + zo)) {
        // TODO: NOPe, need to check under feet "isOnGround"...
        // Issue is hits and falling: won't slide. Ray cast it.
        if (top || vel.y <= 0) {
          yo = 0;
          vel.y = 0;
        }

        if (feet) {
          this.onGround = true;
        }
      }
    });

    pos.add(xo, yo, zo);

    // Bedrock
    if (pos.y + yo < 1.7 / 2) {
      yo = 0;
      pos.y = 1.7 / 2;
      vel.set(0, 0, 0);
    }

    acc.set(0, 0, 0);
  }
}

export default Player;
