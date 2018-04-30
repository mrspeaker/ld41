import Model from "./Model.js";
import glUtils from "../glUtils.js";

class Billboard {
  static create(gl, name = "Billboard", w, h, x, y, z) {
    return new Model(Billboard.createMesh(gl, name, w, h, x, y, z));
  }
  static createMesh(
    gl,
    name,
    width = 1,
    height = 1,
    x = 0,
    y = 0,
    z = 0
  ) {
    const w = width / 2;
    const h = height / 2;

    const x0 = x - w;
    const x1 = x + w;
    const y0 = y - h;
    const y1 = y + h;
    const z0 = z - w;
    // prettier-ignore
    const verts = [
      x0, y1, z0,  x0, y0, z0,  x1, y0, z0,  x1, y1, z0,
    ];

    // prettier-ignore
    const indices = [
      0, 1, 2, 0, 2, 3,
    ];

    const uvs = [];
    for (let i = 0; i < 6; i++) {
      uvs.push(0, 0, 0, 1, 1, 1, 1, 0);
    }

    // prettier-ignore
    const normals = [
      0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
    ];

    const mesh = glUtils.createMeshVAO(gl, name, indices, verts, normals, uvs);
    mesh.noCulling = false;
    return mesh;
  }
}

export default Billboard;
