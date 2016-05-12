function getFile(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function(evt) {
    if (xhr.readyState === 4 && xhr.status == 200) {
      callback(xhr.responseText);
    } else if (xhr.readyState === 4) {
      console.log("Request status: " + xhr.status);
    }
  };
  xhr.send(null);
};



function loadAssets(assets, callback) {
  var totalAssets = Object.keys(assets).length;
  var totalAssetsLoaded = 0;
  for (var a in assets) {
    (function(i) {
      getFile(assets[i], function(string) {
        assets[i] = string;
        totalAssetsLoaded++;
        if (totalAssets == totalAssetsLoaded) callback();
      });
    })(a);
  }
}


// requestAnimationFrame polyfill
window.requestAnimFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(callback) {
    return window.setTimeout(callback, 1000 / 60);
  };
