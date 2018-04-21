import Shader from "./Shader.js";

const vs = `#version 300 es
  uniform mat4 view;
  uniform mat4 proj;
  uniform mat4 camera;
  uniform vec4 colour;

  layout(location=0) in vec3 pos;
  layout(location=2) in vec2 uv;

  out lowp vec4 vcol;
  out vec2 vuv;
  void main() {
    vcol = colour;
    vuv = uv;

    // vec3 right = vec3( camera[0][0], camera[1][0], camera[2][0] );
    // vec3 up = vec3( camera[0][1], camera[1][1], camera[2][1] );
    // vec4 p = pos + (right * pos.x) + (up * pos.y); //Rotate vertex toward camera
    gl_Position = proj * camera * view * vec4(pos, 1.0);
  }
`;

const fs = `#version 300 es
  precision highp float;
  uniform sampler2D tex;
  uniform float useTex;
  in vec4 vcol;
  in vec2 vuv;

  out vec4 col;
  void main() {
    vec4 tx = texture(tex, vuv);
    if (tx.a < 0.1)
      discard;
    else
      col = useTex == 1.0 ? texture(tex, vuv) : vcol;
  }
`;

class BillboardShader extends Shader {
  constructor(gl, pMatrix) {
    super(gl, vs, fs);
    this.setUniforms(
      "proj", pMatrix,
      "colour", [1.0, 1.0, 0.0, 0.1]
    );
  }
}

export default BillboardShader;
