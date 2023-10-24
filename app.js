window.onload = function () {
  console.log("This is working");
  var canvas = document.getElementById("game-surface");
  var gl = canvas.getContext("webgl");

  if (!gl) {
    console.log("WebGL not supported, falling back on experimental-webgl");
    gl = canvas.getContext("experimental-webgl");
  }

  if (!gl) {
    alert("Your browser does not support WebGL");
  }

  // draw background, 배경그리기
  gl.clearColor(0.6, 0.2, 0.3, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // bring glsl text source, glsl 텍스트 소스 가져오기
  var vertexShaderSource = document.getElementById("vertex-shader-2d").text;
  var fragmentShaderSource = document.getElementById("fragment-shader-2d").text;

  // create and compile shaders and check vaildations, 쉐이더 생성과 컴파일 검증까지
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );

  // make program, 프로그램 만들기
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("ERROR linking program", gl.getProgramInfoLog(program));
    return;
  }

  gl.validateProgram(program);
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.error("ERROR validating program", gl.getProgramInfoLog(program));
  }

  // triangle vertex positions, 삼각형 점의 위치
  var trianglePositions = [
    0.0, 0.5, 1.0, 1.0, 0.0, -0.5, -0.5, 0.0, 1.0, 1.0, 0.5, -0.5, 0.0, 1.0,
    0.0,
  ];

  // create and bind buffer, and add buffer data, 버퍼 생성 바인드 및 데이터 구성
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(trianglePositions),
    gl.STATIC_DRAW
  );

  // 정
  var positionAttributeLocation = gl.getAttribLocation(program, "vertPosition");
  var vertSize = 2;
  var type = gl.FLOAT;
  var normalize = gl.FALSE;
  var stride = 5 * Float32Array.BYTES_PER_ELEMENT;
  var vertOffset = 0;
  gl.vertexAttribPointer(
    positionAttributeLocation,
    vertSize,
    type,
    normalize,
    stride,
    vertOffset
  );
  gl.enableVertexAttribArray(positionAttributeLocation);

  // 정
  var colorAttributeLocation = gl.getAttribLocation(program, "vertColor");
  var colorSize = 3;
  var colorOffset = 2 * Float32Array.BYTES_PER_ELEMENT;
  gl.vertexAttribPointer(
    colorAttributeLocation,
    colorSize,
    type,
    normalize,
    stride,
    colorOffset
  );
  gl.enableVertexAttribArray(colorAttributeLocation);

  gl.useProgram(program);
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 3;
  gl.drawArrays(primitiveType, offset, count);
};

function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}
