import SkyboxShader from "./minecraft/shaders/SkyboxShader.js";
import VoxelShader from "./minecraft/shaders/VoxelShader.js";
import DebugShader from "./minecraft/shaders/DebugShader.js";
import CameraController from "./minecraft/controls/CameraController.js";
import KeyboardControls from "./minecraft/controls/KeyboardControls.js";

import Camera from "./minecraft/Camera.js";
import World from "./minecraft/World.js";
import Player from "./minecraft/Player.js";
import Cube from "./minecraft/models/Cube.js";
import Ray from "./minecraft/math/Ray.js";
import glUtils from "./minecraft/glUtils.js";
import digAndBuild from "./minecraft/digAndBuild.js";

import pop from "../pop/index.js";
const { Game, Camera: TileCamera, KeyControls, math, Texture, Sprite } = pop;

import Level from "./pitfall/Level.js";
import Player2D from "./pitfall/Player2D.js";

const pxWidth = 900;
const pxHeight = 500;

const gl = document.querySelector("#minecraft").getContext("webgl2");
if (!gl) {
  document.querySelector("#nosupport").style.display = "block";
  document.querySelector("#nowebgl2").style.display = "inline";
}
glUtils.setSize(gl, pxWidth, pxHeight);
document.onclick = () => gl.canvas.requestPointerLock();
const deb1 = document.querySelector("#deb1");
const ad1 = document.querySelector("#ad");

const camera = new Camera(gl);
camera.mode = Camera.MODE_FREE;
const controls = {
  keys: new KeyboardControls(gl.canvas),
  mouse: new CameraController(gl, camera)
};

const game = new Game(pxWidth, pxHeight, "#pitfall");
const { scene, w, h } = game;

const controls2D = new KeyControls();
const map = Level();
const player2D = new Player2D(controls2D, map);
const camera2D = new TileCamera(player2D, { w, h }, { w: map.w, h: map.h });

scene.add(camera2D);
camera2D.add(map);
camera2D.add(player2D);

const { pos } = player2D;
pos.set(map.w / 2, map.h - map.tileH * 9);

// Shaders
const voxelShader = new VoxelShader(gl, camera.projectionMatrix);
const skybox = Cube.create(gl, "Skybox", 300, 300, 300);
const skyboxShader = new SkyboxShader(gl, camera.projectionMatrix);
const debugShader = new DebugShader(gl, camera.projectionMatrix);

const world = new World(gl);
const player = new Player(controls, camera, world);
player.pos.set(3, 19, 0.3);
const ray = new Ray(camera);
const cursor = Cube.create(gl);
cursor.scale.set(1.001, 1.001, 1.001);
cursor.mesh.doBlending = true;
cursor.mesh.noCulling = false;

const state = {
  lastGen: Date.now(),
  webGLReady: false
};

// MAIN
preload()
  .then(initialize)
  .then(() => (state.webGLReady = true));

function preload() {
  const loadImg = src =>
    new Promise(res => {
      const img = new Image();
      img.src = src;
      img.addEventListener("load", () => res(img), false);
    });

  return Promise.all(
    [
      { name: "blocks", src: "res/images/mine.png", type: "tex" },
      { name: "cube0", src: "res/images/mc_rt.png", type: "img" },
      { name: "cube1", src: "res/images/mc_lf.png", type: "img" },
      { name: "cube2", src: "res/images/mc_up.png", type: "img" },
      { name: "cube3", src: "res/images/mc_dn.png", type: "img" },
      { name: "cube4", src: "res/images/mc_bk.png", type: "img" },
      { name: "cube5", src: "res/images/mc_ft.png", type: "img" },
      { name: "ad", src: "res/html5games.png", type: "tex" }
    ].map(
      ({ name, src, type }) =>
        new Promise(res => {
          switch (type) {
            case "tex":
            case "img":
              loadImg(src).then(img => res({ name, src, type, img }));
              break;
          }
        })
    )
  );
}

function initialize(res) {
  // Textures
  const texs = res.filter(i => i.type == "tex");
  const imgs = res.filter(i => i.type == "img");

  texs.forEach(i => glUtils.loadTexture(gl, i.name, i.img));

  const cubeImg = imgs.filter(i => i.name.startsWith("cube")).map(i => i.img);
  glUtils.loadCubeMap(gl, "skybox", cubeImg);
  skyboxShader.setCube(glUtils.textures.skybox);
  voxelShader.setTexture(glUtils.textures.blocks);
  debugShader.setTexture(glUtils.textures.ad);

  // Initialize webgl
  gl.clearColor(1, 1, 1, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.depthFunc(gl.LEQUAL);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  // Set up initial chunks with density 10
  world.gen(10);
}

game.run((dt, t) => {
  state.webGLReady && renderWebGL(dt, t);
});

function renderWebGL(dt, t) {
  player.update(dt);
  world.update(dt);

  const { pos } = player;

  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

  // Sync camera to player
  camera.transform.position.setv(pos).add(0, player.h / 2, 0);
  camera.updateViewMatrix();

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

  // Get block player is looking at
  const r = ray.fromScreen(
    gl.canvas.width / 2,
    gl.canvas.height / 2,
    gl.canvas.width,
    gl.canvas.height
  );

  const block = world.getCellFromRay(camera.transform.position, r.ray);
  if (block) {
    digAndBuild(block, controls, world, player);
    cursor.position.set(block.x, block.y, block.z);
    cursor.position.add(0.5, 0.5, 0.5);
  }

  if (world.didTriggerAd(player.pos)) {
    ad1.style.display = "block";
  } else {
    ad1.style.display = "none";
  }

  // Render
  skyboxShader
    .activate()
    .preRender("camera", camera.view, "t", t / 80)
    .render(skybox);

  voxelShader
    .activate()
    .preRender("camera", camera.view)
    .render(world.chunks);

  debugShader
    .activate()
    .preRender(
      "camera",
      camera.view,
      "colour",
      [1.0, 1.0, 0.0, 0.1],
      "useTex",
      0.0
    )
    .render(cursor)
    .setUniforms("colour", [1, 1, 1, 0.1], "tex", 0, "useTex", 1.0)
    .render(world.ad.renderable);

  world.ad.renderable.rotation.x += dt * 30.0;
  world.ad.renderable.rotation.y += dt * 27.0;
  world.ad.renderable.rotation.z += dt * 21.0;
  world.ad.renderable.position.y += Math.sin(t / 300) * 0.01;

  // Debug
  const chunk = world.getChunk(pos.x, pos.y, pos.z);
  const p = `${pos.x.toFixed(2)}:${pos.y.toFixed(2)}:${pos.z.toFixed(2)}`;
  deb1.innerHTML = `${p}<br/>${
    !chunk ? "-" : `${chunk.chunk.chX}:${chunk.chunk.chY}:${chunk.chunk.chZ}`
  }<br/>`;
}
