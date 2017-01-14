'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SPoint = function () {
  function SPoint() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var id = arguments[2];
    var template = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : SvgTemplates.inputPoint;

    _classCallCheck(this, SPoint);

    this.x_ = x;
    this.y_ = y;
    this.id_ = id;
    this.deltaX_ = 0;
    this.deltaY_ = 0;
    this.element_ = Bragi.createTemplate(template(this));
  }

  _createClass(SPoint, [{
    key: 'updatePosition',
    value: function updatePosition(x, y) {
      this.x_ = x;
      this.y_ = y;
      this.updatePosition_();
    }
  }, {
    key: 'scalePosition',
    value: function scalePosition(scaleX, scaleY) {
      this.x_ *= scaleX;
      this.y_ *= scaleY;
      this.updatePosition_();
    }
  }, {
    key: 'setSelected',
    value: function setSelected(isSelected) {
      this.element_.classList.toggle('selected', isSelected);
    }
  }, {
    key: 'setStartDelta',
    value: function setStartDelta(startX, startY) {
      this.deltaX_ = startX - this.x_;
      this.deltaY_ = startY - this.y_;
    }
  }, {
    key: 'updateDelta',
    value: function updateDelta(x, y) {
      this.x_ = x - this.deltaX_;
      this.y_ = y - this.deltaY_;
      this.updatePosition_();
    }
  }, {
    key: 'remove',
    value: function remove() {
      this.element_.remove();
    }
  }, {
    key: 'updatePosition_',
    value: function updatePosition_() {
      this.element_.setAttribute('transform', 'translate(' + this.x + ', ' + this.y + ')');
    }
  }, {
    key: 'x',
    get: function get() {
      return this.x_;
    }
  }, {
    key: 'y',
    get: function get() {
      return this.y_;
    }
  }, {
    key: 'id',
    get: function get() {
      return this.id_;
    }
  }, {
    key: 'element',
    get: function get() {
      return this.element_;
    }
  }]);

  return SPoint;
}();