window.onload = function () {
  console.log("This is working");
  var canvas = document.getElementById("game-surface");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var gl = canvas.getContext("webgl");

  if (!gl) {
    console.log("WebGL not supported, falling back on experimental-webgl");
    gl = canvas.getContext("experimental-webgl");
  }

  if (!gl) {
    alert("Your browser does not support WebGL");
  }

  // draw background, 배경그리기
  gl.clearColor(Math.random(), Math.random(), Math.random(), 1.0);
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
  var program = createProgram(gl, vertexShader, fragmentShader);

  // create and bind buffer, and add buffer data, 버퍼 생성 바인드 및 데이터 구성
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // triangle vertex positions, 삼각형 점의 위치

  // look up locations
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  var matrixLocation = gl.getUniformLocation(program, "u_matrix");
  var colorUniformLocation = gl.getUniformLocation(program, "u_color");

  // This method binds the buffer currently bound to gl.ARRAY_BUFFER
  // to a generic vertex attribute of the current vertex buffer object
  // and specifies its layout.
  // vertexAttribPointer 함수는 gl.ARRAY_BUFFER에 결속되어 있는
  // 버퍼를 쉐이더의 'a_position'과 묶고
  // 그 레이아웃(어떻게 묶을 것인지 데이터 타입, 한 덩어리의 데이터의 크기, 오프셋 등)을 정의한다.
  var vertSize = 2;
  var type = gl.FLOAT;
  var normalize = gl.FALSE;
  var stride = 0;
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

  // compute the matrix
  // 캔버스 크기를 투영한 행렬을 가지고
  // 위치 * 회전 * 크기 변환
  var matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
  matrix = m3.translate(
    matrix,
    gl.canvas.clientWidth / 2,
    gl.canvas.clientHeight / 2
  );
  matrix = m3.rotate(matrix, 0);
  matrix = m3.scale(matrix, 300, 300);

  gl.uniformMatrix3fv(matrixLocation, false, matrix);

  for (var i = 0; i < getRandomArbitrary(100, 200); i++) {
    // random color
    gl.uniform4f(
      colorUniformLocation,
      Math.random(),
      Math.random(),
      Math.random(),
      1
    );

    // random position 랜덤 좌표
    var x = getRandomArbitrary(-2, 2);
    var width = getRandomArbitrary(-2, 2);
    var y = getRandomArbitrary(-2, 2);
    var height = getRandomArbitrary(-2, 2);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        x,
        y,
        x,
        y + height,
        x + width,
        y,
        x + width,
        y + height,
        x + width,
        y,
        x,
        y + height,
      ]),
      gl.STATIC_DRAW
    );

    // draw
    draw(gl);
  }
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

function createProgram(gl, vertexShader, fragmentShader) {
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
    return;
  }

  gl.useProgram(program);
  return program;
}

function draw(gl) {
  // draw
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 6;
  gl.drawArrays(primitiveType, offset, count);
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
