'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SvgTemplates = function () {
  function SvgTemplates() {
    _classCallCheck(this, SvgTemplates);
  }

  _createClass(SvgTemplates, null, [{
    key: 'svg',
    value: function svg() {
      return ['svg:svg', ['svg:g', { id: 'construction' }]];
    }
  }, {
    key: 'path',
    value: function path() {
      return ['svg:path', { class: 'b-spline' }];
    }
  }, {
    key: 'point',
    value: function point(x, y) {
      var cssClass = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'point';
      var r = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 3;
      var attrs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

      return ['svg:circle', Object.assign({
        cx: '' + x,
        cy: '' + y,
        r: '' + r,
        class: cssClass
      }, attrs)];
    }
  }, {
    key: 'line',
    value: function line(x1, y1, x2, y2) {
      return ['svg:line', {
        x1: '' + x1,
        y1: '' + y1,
        x2: '' + x2,
        y2: '' + y2,
        class: 'line'
      }];
    }
  }, {
    key: 'inputPoint',
    value: function inputPoint(_ref) {
      var x = _ref.x,
          y = _ref.y,
          id = _ref.id;

      return ['svg:g', {
        transform: 'translate(' + ((x | 0) + 0.5) + ', ' + ((y | 0) + 0.5) + ')',
        id: id,
        class: 'input-point-group'
      }, ['svg:circle', {
        cx: '0',
        cy: '0',
        r: '7',
        id: id,
        class: 'input-point'
      }], ['svg:line', {
        x1: '-14',
        y1: '0',
        x2: '14',
        y2: '0',
        class: 'input-point-line'
      }], ['svg:line', {
        x1: '0',
        y1: '-14',
        x2: '0',
        y2: '14',
        class: 'input-point-line'
      }]];
    }
  }, {
    key: 'thumbnail',
    value: function thumbnail(width, height, path) {
      return ['svg:svg', { viewBox: '0 0 ' + width + ' ' + height, class: 'thumbnail' }, ['svg:path', { d: path }]];
    }
  }]);

  return SvgTemplates;
}();