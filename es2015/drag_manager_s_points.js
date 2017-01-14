'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DragManagerSPoints = function () {
  function DragManagerSPoints(svgBSplines) {
    var _this = this;

    _classCallCheck(this, DragManagerSPoints);

    this.svgBSplines_ = svgBSplines;

    this.dragPoints_ = [];
    this.mousemoveHandlerBound_ = function (event) {
      return _this.mousemoveHandler_(event);
    };
    this.mouseupHandlerBound_ = function (event) {
      return _this.mouseupHandler_(event);
    };
  }

  _createClass(DragManagerSPoints, [{
    key: 'startDrag',
    value: function startDrag(event, point) {
      event.stopPropagation();
      event.preventDefault();
      var dragPoints = this.svgBSplines_.selectedPoints;
      this.dragPoints_.length = 0;
      if (dragPoints.length) {
        var _dragPoints_;

        (_dragPoints_ = this.dragPoints_).push.apply(_dragPoints_, _toConsumableArray(dragPoints));
      } else {
        this.dragPoints_.push(this.svgBSplines_.getPointWithId(point.id));
      }
      var x = event.clientX;
      var y = event.clientY;
      this.dragPoints_.forEach(function (point) {
        return point.setStartDelta(x, y);
      });
      document.addEventListener('mousemove', this.mousemoveHandlerBound_);
      document.addEventListener('mouseup', this.mouseupHandlerBound_);
    }
  }, {
    key: 'mousemoveHandler_',
    value: function mousemoveHandler_(event) {
      var _this2 = this;

      requestAnimationFrame(function () {
        return _this2.updateView_(event);
      });
    }
  }, {
    key: 'updateView_',
    value: function updateView_(event) {
      var _this3 = this;

      if (this.dragPoints_.length) {
        (function () {
          var x = event.clientX;
          var y = event.clientY;
          _this3.dragPoints_.forEach(function (point) {
            return point.updateDelta(x, y);
          });
          _this3.svgBSplines_.updatePath();
        })();
      }
    }
  }, {
    key: 'mouseupHandler_',
    value: function mouseupHandler_(event) {
      document.removeEventListener('mousemove', this.mousemoveHandlerBound_);
      document.removeEventListener('mouseup', this.mouseupHandler_);
      this.dragPoints_.length = 0;
    }
  }]);

  return DragManagerSPoints;
}();