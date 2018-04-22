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

import Bullet from "./entities/Bullet.js";
import Zomb from "./entities/Zomb.js";

const deb1 = document.querySelector("#deb1");

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

    const world = new World(gl);
    const player = new Player(controls, camera, world);
    player.pos.set(3, 19, 0.3);
    this.ray = new Ray(camera);
    // const cursor = Cube.create(gl);
    // cursor.scale.set(1.001, 1.001, 1.001);
    // cursor.mesh.doBlending = true;
    // cursor.mesh.noCulling = false;

    this.state = {
      lastGen: Date.now(),
      webGLReady: false
    };

    this.zomb = [...Array(100)].map(() => {
      return new Zomb(gl, player.pos);
      // const z = Billboard.create(gl);
      // z.scale.set(3, 3, 1);
      // return z;
    });
    this.bullets = [];

    this.world = world;
    this.player = player;
    this.camera = camera;
    this.controls = controls;
    //this.cursor = cursor;
  }

  init(res) {
    const { gl, shaders, world } = this;
    // Textures
    const texs = res.filter(i => i.type == "tex");
    const imgs = res.filter(i => i.type == "img");

    texs.forEach(i => glUtils.loadTexture(gl, i.name, i.img));

    const cubeImg = imgs.filter(i => i.name.startsWith("cube")).map(i => i.img);
    glUtils.loadCubeMap(gl, "skybox", cubeImg);
    shaders.skybox.setCube(glUtils.textures.skybox);
    shaders.voxel.setTexture(glUtils.textures.blocks);
    //debugShader.setTexture(glUtils.textures.ad);
    shaders.billboard.setTexture(glUtils.textures.ringu);

    // Initialize webgl
    gl.clearColor(1, 1, 1, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.depthFunc(gl.LEQUAL);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Set up initial chunks with density 10
    world.gen(20);

    this.zomb.forEach(z => {
      z.cube.position.set(...world.getFreeSpot());
    });
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
      gl
    } = this;

    player.update(dt);
    world.update(dt);

    const { pos } = player;

    const regenWorld = () => {
      controls.keys.keys[69] = false;
      player.pos.set(3, 19, 0.3);
      world.gen();
      state.lastGen = Date.now();
    };

    // E key to gen new chunk
    if (controls.keys.isDown(69)) {
      if (Date.now() - state.lastGen > 1000) {
        regenWorld();
      }
    }

    if (controls.mouse.isDown) {
      controls.mouse.isDown = false;
      const r = ray.fromScreen(
        gl.canvas.width / 2,
        gl.canvas.height / 2,
        gl.canvas.width,
        gl.canvas.height
      );
      const b = new Bullet(this.gl, r);
      bullets.push(b);
    }

    this.zomb = zomb.filter(z => {
      z.update(dt, t);

      // Face camera
      const dx = camera.transform.position.x - z.cube.position.x;
      const dz = camera.transform.position.z - z.cube.position.z;
      const a = Math.atan2(dx, dz);
      z.cube.rotation.y = a * (180 / Math.PI);
      return !z.dead;
    });

    this.bullets = bullets.filter(b => {
      b.update(dt);

      zomb.forEach(z => {
        const dx = camera.transform.position.x - z.cube.position.x;
        const dz = camera.transform.position.z - z.cube.position.z;
        const a = Math.atan2(dx, dz);
        z.cube.rotation.y = a * (180 / Math.PI);

        const dist = Vec3.from(z.cube.position)
          .scale(-1)
          .addv(b.cube.position)
          .lengthSq();

        if (dist < 3) {
          z.dead = true;
          b.dead = true;
        }
      });

      return !b.dead;
    });

    // Debug
    const chunk = world.getChunk(pos.x, pos.y, pos.z);
    const p = `${pos.x.toFixed(2)}:${pos.y.toFixed(2)}:${pos.z.toFixed(2)}`;
    deb1.innerHTML = `${p}<br/>${
      !chunk ? "-" : `${chunk.chunk.chX}:${chunk.chunk.chY}:${chunk.chunk.chZ}`
    }<br/>`;
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
      .preRender("camera", camera.view)
      .render(world.chunks);

    if (bullets.length) {
      shaders.debug
        .activate()
        .preRender(
          "camera",
          camera.view,
          "colour",
          [1.0, 1.0, 0.0, 0.3],
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
          [(t * 4) % 6 | 0, 0]
        )
        .render(zomb.map(z => z.cube));
    }
  }
}

export default Game3D;
