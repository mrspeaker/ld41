import Shader from "./Shader.js";

const vss = `#version 300 es
  uniform mat4 view;
  uniform mat4 proj;
  uniform mat4 camera;

  layout(location=0) in vec3 pos;
  layout(location=1) in vec3 normal;
  layout(location=2) in vec2 uv;
  layout(location=3) in vec2 sprite;
  layout(location=4) in float ao;

  out vec2 texCoord;
  out float occ;
  out vec3 norm;
  const float size = 1.0 / 32.0;

  void main() {
    occ = ao;
    norm = normal;
    float u = sprite.x * size + uv.x * size;
    float v = sprite.y * size + uv.y * size;
    texCoord = vec2(u, v);
    gl_Position = proj * camera * view * vec4(pos, 1.0);
  }
`;

const fss = `#version 300 es
  precision highp float;
  uniform sampler2D tex0;
  in vec2 texCoord;
  in float occ;
  in vec3 norm;
  out vec4 col;
  void main() {
      float near = 10.0;
      float far = 40.0;
      float dist = gl_FragCoord.z / gl_FragCoord.w;
      float fog = 1.0 - (clamp((far - dist) / (far - near), 0.0, 1.0));
      //vec4 tx = vec4(0.8, 0.5, 0.0, 1.0) * texture(tex0, texCoord);
      vec4 tx = vec4(0.5, 0.5, 0.5, 1.0) * texture(tex0, texCoord);
      vec4 fogmix = mix(vec4(tx.x + (norm.z * -0.00), tx.yzw), vec4(0, 0, 0, 1.0), fog);// vec4(65.0/255.0, 95.0/255.0, 0.8, 1.0), fog);
      col= vec4(fogmix.rgb * occ, 1.0);
  }
`;

class VoxelShader extends Shader {
  constructor(gl, pMatrix) {
    super(gl, vss, fss);
    this.setUniforms("proj", pMatrix);
    gl.useProgram(null);
  }
}

export default VoxelShader;
