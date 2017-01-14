'use strict';

window.onload = () => {
  try {
    window.svgBSplines = new SvgBSplines();
    window.shapes = new Shapes(window.svgBSplines);
    window.svgBSplines.load({
      'with-construction': true,
      'fill': false,
      'width': 60,
      'height': 60,
      'points': [
        [7.5, 30],
        [17.5, 40],
        [25, 30],
        [20, 22.5],
        [30, 40],
        [40, 22.5],
        [35, 30],
        [42.5, 40],
        [52.5, 30],
      ]
    });
    document.querySelector('#use-modern-browser').remove();
  } catch (e) {
    if (location.pathname.indexOf('es2015') === -1) {
      location.href = '/b_splines/es2015/index.html';
    }
  }
};