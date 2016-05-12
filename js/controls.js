
function setupControls() {
//  var element = document.getElementsByTagName('body')[0];
  var element = document.getElementById('container');
  element.onmousemove = function(e) {

    mouseX = e.clientX / window.innerWidth * 2.0 - 1.0;
    mouseY = -(e.clientY / window.innerHeight * 2.0 - 1.0);
console.log(e)
    // request new frame
    scheduleUpdate();
  }

  window.onresize = function() {
    setupResolution();
    scheduleUpdate();
  };

};
