var canvas, gl, defaultShader, quad, gradient, updateScheduled=false, mouseX =0, mouseY=0;
var dpr = (window.devicePixelRatio > 1) ? 1.3 : 1;

var assets = {
  vertex: "../../../work/flubber/shaders/vertex.shader",
  fragment: "../../../work/flubber/shaders/fragment.shader"
};


var particleCount = 100;

var positions = new Float32Array(particleCount * 2);
var motions = new Float32Array(particleCount * 2);
var displaced = new Float32Array(particleCount * 2);

for (var i = 0; i < particleCount * 2; i++) {
  positions[i] = Math.random() * 2.0 - 1.0;
}



function init() {
  canvas = document.getElementById("mycanvas");
  loadAssets(assets, function() {
    initWebGL(canvas, function() {
      //fill window
      setupResolution();
      //mouse move functions
      setupControls();
      //initial draw call
      scheduleUpdate();
    });
  });

}



function update() {
  updateScheduled = false;
  draw();
}

function scheduleUpdate() {
  if (updateScheduled) {
    return;
  }
  updateScheduled = true;
  window.requestAnimFrame(update);
}



function setupResolution() {
  twgl.resizeCanvasToDisplaySize(canvas, dpr);
  gl.viewport(0, 0, window.innerWidth * dpr, window.innerHeight * dpr);
};

document.addEventListener('DOMContentLoaded', init, false);

function initWebGL(canvas, callback) {
  gl = twgl.getWebGLContext(canvas, {
    alpha: false,
    premultipliedAlpha: false
  });
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(230/255, 230/255, 230/255, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.BLEND);

  //shader
  defaultShader = twgl.createProgramInfo(gl, [assets.vertex, assets.fragment]);
  gl.useProgram(defaultShader.program);

  //quad buffer
  quad = twgl.primitives.createXYQuadBufferInfo(gl);
  twgl.setBuffersAndAttributes(gl, defaultShader, quad);

  //texture
  gradient = twgl.createTexture(gl,{
    src: "../../../work/flubber/img/gradient.png"
  },callback);
}


function draw() {

  for (var i = 0; i < positions.length; i += 2) {

    //mouse motion
    var d = Math.sqrt(Math.pow(positions[i] - mouseX, 2.0) + Math.pow(positions[i + 1] - mouseY, 2.0));
    d = (d < 0.1) ? 0.1 : d;
    motions[i] = (positions[i] - mouseX) / (d * d * gl.canvas.width);
    motions[i + 1] = (positions[i + 1] - mouseY) / (d * d * gl.canvas.width);

    //move
    displaced[i] = positions[i] + motions[i]*10.0;
    displaced[i+1] = positions[i + 1] + motions[i + 1]*10.0;
  }

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  twgl.setUniforms(defaultShader, {
    p: displaced,
    dimensions: [gl.canvas.width, gl.canvas.height],
    gradient: gradient
  });
  twgl.drawBufferInfo(gl, gl.TRIANGLES, quad);

}
