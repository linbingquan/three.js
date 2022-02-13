class Scene {
  constructor() {
    this.meshList = [];
  }

  add(mesh) {
    this.meshList.push(mesh);
  }
}

class PerspectiveCamera {
  constructor(fov = 50, aspect = 1, near = 0.1, far = 2000) {
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;

    this.position = new Vector3();
  }
}

// 顶点着色器源码
var vs = `
attribute vec4 a_Position;
attribute float a_PointSize;
void main(){
    gl_Position = a_Position;

    // gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
    // gl_Position = vec4(1.0, 0.0, 0.0, 1.0);
    // gl_Position = vec4(-1.0, 0.0, 0.0, 1.0);
    // gl_Position = vec4(0.0, 1.0, 0.0, 1.0);
    // gl_Position = vec4(0.0, -1.0, 0.0, 1.0);
    // gl_Position = vec4(1.0, 1.0, 0.0, 1.0);
    // gl_Position = vec4(-1.0, 1.0, 0.0, 1.0);
    // gl_Position = vec4(1.0, -1.0, 0.0, 1.0);
    // gl_Position = vec4(-1.0, -1.0, 0.0, 1.0);

    gl_PointSize = a_PointSize;
}`;
// 片段着色器源码
var fs = `
void main(){
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}`;
// 初始化使用的shader
function initShader(gl) {
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vs);
  gl.compileShader(vertexShader);
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fs);
  gl.compileShader(fragmentShader);
  var shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  gl.useProgram(shaderProgram);

  var a_Position = gl.getAttribLocation(shaderProgram, "a_Position");
  gl.vertexAttrib4f(a_Position, 0.0, 0.0, 0.0, 1.0);
  var a_PointSize = gl.getAttribLocation(shaderProgram, "a_PointSize");
  gl.vertexAttrib1f(a_PointSize, 10.0);

  return shaderProgram;
}

var temp = 10;

class WebGLRenderer {
  constructor() {
    const canvas = document.createElement("canvas");
    canvas.id = "canvas";
    const gl = canvas.getContext("webgl2");
    this.gl = gl;
    this.domElement = canvas;

    this.shaderProgram = initShader(gl);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, 1);
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
  }

  render(scene, camera) {
    // console.log({ scene, camera });
  }
}

class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

class BoxGeometry {
  constructor() {
  }
}

class MeshBasicMaterial {
  constructor({ color }) {
    console.log({ color });
  }
}

class Mesh {
  constructor(geometry, material) {
    this.position = new Vector3();
    this.rotation = new Vector3();
    console.log({ geometry, material });
  }
}

const THREE = {
  Scene: Scene,
  PerspectiveCamera: PerspectiveCamera,
  WebGLRenderer: WebGLRenderer,
  BoxGeometry: BoxGeometry,
  MeshBasicMaterial: MeshBasicMaterial,
  Mesh: Mesh,
};
