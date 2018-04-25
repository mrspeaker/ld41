import Shader from "./Shader.js";

const vs = `#version 300 es
  uniform mat4 view;
  uniform mat4 proj;
  uniform mat4 camera;
  uniform vec4 colour;
  uniform vec2 sprite;
  layout(location=0) in vec3 pos;
  layout(location=2) in vec2 uv;

  const float size = 1.0/ 6.0;// (512.0 / 6.0);


  out lowp vec4 vcol;
  out vec2 vuv;
  void main() {
    vcol = colour;

    float u = sprite.x * size + uv.x * size;
    float v = sprite.y * size + uv.y * size * 3.0;
    vuv = vec2(u,v);

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
      col = vec4(1.0, 0.2, 0.2, 1.0);
      //discard;

    float near = 10.0;
    float far = 40.0;
    float dist = gl_FragCoord.z / gl_FragCoord.w;
    float fog = 1.0 - (clamp((far - dist) / (far - near), 0.0, 1.0));
    //vec4 tx = useTex == 1.0 ? texture(tex, vuv) : vcol;
    vec4 fogmix = mix(tx, vec4(0, 0, 0, 1.0), fog);//vec4(65.0/255.0, 95.0/255.0, 0.8, 1.0), fog);
    col = vec4(fogmix.rgb, 1.0);

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
