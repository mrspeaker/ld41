import SkyboxShader from "./shaders/SkyboxShader.js";
import VoxelShader from "./shaders/VoxelShader.js";
import DebugShader from "./shaders/DebugShader.js";
import BillboardShader from "./shaders/BillboardShader.js";
import CameraController from "./controls/CameraController.js";
import KeyboardControls from "./controls/KeyboardControls.js";

import Camera from "./Camera.js";
import World from "./World.js";
import Player from "./Player.js";
import Cube from "./models/Cube.js";
import Ray from "./math/Ray.js";
import glUtils from "./glUtils.js";
import Vec3 from "./math/Vec3.js";
//import digAndBuild from "./digAndBuild.js";

import pop from "../../pop/index.js";
const { Sound } = pop;
const shoot = new Sound("res/sounds/shoot.mp3", {});
const scream = new Sound("res/sounds/scream.mp3", {});

import Bullet from "./entities/Bullet.js";
import Zomb from "./entities/Zomb.js";

class Game3D {
  constructor(pxWidth, pxHeight) {
    const gl = document.querySelector("#minecraft").getContext("webgl2");
    if (!gl) {
      document.querySelector("#nosupport").style.display = "block";
      document.querySelector("#nowebgl2").style.display = "inline";
    }
    this.gl = gl;
    glUtils.setSize(gl, pxWidth, pxHeight);
    document.onclick = () => gl.canvas.requestPointerLock();

    const camera = new Camera(gl);
    camera.mode = Camera.MODE_FREE;
    const controls = {
      keys: new KeyboardControls(gl.canvas),
      mouse: new CameraController(gl, camera)
    };

    this.shaders = {
      voxel: new VoxelShader(gl, camera.projectionMatrix),
      skybox: new SkyboxShader(gl, camera.projectionMatrix),
      debug: new DebugShader(gl, camera.projectionMatrix),
      billboard: new BillboardShader(gl, camera.projectionMatrix)
    };
    this.skybox = Cube.create(gl, "Skybox", 300, 300, 300);

    this.ray = new Ray(camera);

    this.camera = camera;
    this.controls = controls;
    this.state = {};
    this.reset();
  }

  reset() {
    const { camera, controls, gl } = this;

    const world = new World(gl);
    world.gen(20);

    const player = new Player(controls, camera, world);
    player.pos.set(3, 19, 0.3);

    this.state.lastGen = Date.now();
    this.state.lastSpawn = 0;

    this.bullets = [];
    this.world = world;
    this.player = player;

    this.zomb = [];
    this.isDead = false;
    this.isWin = false;
    controls.mouse.enabled = true;
  }

  clear() {
    const { gl } = this;
    gl.clearColor(0, 0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  spawn() {
    const { player, world, gl, zomb } = this;
    const z = new Zomb(gl, player.pos, world);
    let spot;
    while (!spot) {
      const spotArray = world.getFreeSpot();
      spot = { x: spotArray[0], y: spotArray[1], z: spotArray[2] };
      const dist = Vec3.from(spot)
        .scale(-1)
        .addv(player.pos)
        .lengthSq();
      if (dist < 150) {
        spot = null;
      }
    }
    z.cube.position.setv(spot);
    zomb.push(z);
    return z;
  }

  init(res) {
    const { gl, shaders } = this;
    // Textures
    const texs = res.filter(i => i.type == "tex");
    const imgs = res.filter(i => i.type == "img");

    texs.forEach(i => glUtils.loadTexture(gl, i.name, i.img));

    const cubeImg = imgs.filter(i => i.name.startsWith("cube")).map(i => i.img);
    glUtils.loadCubeMap(gl, "skybox", cubeImg);
    shaders.skybox.setCube(glUtils.textures.skybox);
    shaders.voxel.setTexture(glUtils.textures.blocks);
    shaders.billboard.setTexture(glUtils.textures.ringu);

    // Initialize webgl
    gl.clearColor(0, 0, 0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.depthFunc(gl.LEQUAL);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  update(dt, t) {
    const {
      player,
      world,
      camera,
      state,
      controls,
      zomb,
      bullets,
      ray,
      gl,
      isDead,
      isWin
    } = this;

    if (!isDead) {
      player.update(dt);
    } else {
      controls.mouse.enabled = false;
    }
    world.update(dt);

    state.lastSpawn += dt;
    if (state.lastSpawn > 2) {
      if (!isWin) this.spawn();
      state.lastSpawn = 0;
    }

    if (controls.mouse.isDown && !isWin) {
      controls.mouse.isDown = false;
      const r = ray.fromScreen(
        gl.canvas.width / 2,
        gl.canvas.height / 2,
        gl.canvas.width,
        gl.canvas.height
      );
      shoot.play();
      const b = new Bullet(this.gl, r);
      bullets.push(b);
    }

    let v = new Vec3();
    this.closest = 100;
    world.col = [];
    this.zomb = zomb.filter(z => {
      if (isWin) {
        z.cube.position.y += 1 * dt;
        return true;
      }
      z.update(dt, t);

      // Face camera
      const dx = camera.transform.position.x - z.cube.position.x;
      const dz = camera.transform.position.z - z.cube.position.z;
      const a = Math.atan2(dx, dz);
      z.cube.rotation.y = a * (180 / Math.PI);

      const dist = v
        .setv(z.cube.position)
        .scale(-1)
        .addv(player.pos)
        .lengthSq();
      if (dist < 2) {
        world.col.push({ dist, z });
        z.dead = true;
      }
      if (dist < this.closest) {
        this.closest = dist;
      }
      return !z.dead;
    });

    this.bullets = bullets.filter(b => {
      b.update(dt);

      zomb.forEach(z => {
        if (b.dead) return;
        const dx = camera.transform.position.x - z.cube.position.x;
        const dz = camera.transform.position.z - z.cube.position.z;
        const a = Math.atan2(dx, dz);
        z.cube.rotation.y = a * (180 / Math.PI);

        const dist = v
          .setv(z.cube.position)
          .scale(-1)
          .addv(b.cube.position)
          .lengthSq();

        if (dist < 3) {
          z.dead = true;
          b.dead = true;
          scream.play();
        }
      });

      return !b.dead;
    });
  }

  render(dt, t) {
    const { player, world, gl, camera, shaders, skybox, zomb, bullets } = this;

    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    // Sync camera to player
    camera.transform.position.setv(player.pos).add(0, player.h / 2, 0);
    camera.updateViewMatrix();

    // Render
    shaders.skybox
      .activate()
      .preRender("camera", camera.view, "t", t / 80)
      .render(skybox);

    shaders.voxel
      .activate()
      .preRender(
        "camera",
        camera.view,
        "warn",
        this.closest < 20 ? 1 - this.closest / 40 : 0
      )
      .render(world.chunks);

    if (bullets.length) {
      shaders.debug
        .activate()
        .preRender(
          "camera",
          camera.view,
          "colour",
          [0.6, 0.6, 0.6, 0.3],
          "useTex",
          0.0
        )
        .render(bullets.map(b => b.cube));
    }

    if (zomb.length) {
      shaders.billboard
        .activate()
        .preRender(
          "camera",
          camera.view,
          "colour",
          [1, 1, 1, 0.1],
          "tex",
          0,
          "useTex",
          1.0,
          "sprite",
          [((t * 4) % 6) | 0, 0]
        )
        .render(zomb.map(z => z.cube));
    }
  }
}

export default Game3D;
