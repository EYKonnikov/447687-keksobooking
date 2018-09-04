'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;

  var lastTimout;
  window.debounce = function (set) {
    if (lastTimout) {
      window.clearTimeout(lastTimout);
    }
    lastTimout = window.setTimeout(set, DEBOUNCE_INTERVAL);
  };
})();
