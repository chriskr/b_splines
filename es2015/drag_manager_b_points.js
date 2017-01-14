'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DragManagerBPoints = function () {
  function DragManagerBPoints(svgBSplines) {
    var _this = this;

    _classCallCheck(this, DragManagerBPoints);

    this.svgBSplines_ = svgBSplines;

    this.bListX_ = null;
    this.bListY_ = null;
    this.targetIndex_ = -1;
    this.mousemoveHandlerBound_ = function (event) {
      return _this.mousemoveHandler_(event);
    };
    this.mouseupHandlerBound_ = function (event) {
      return _this.mouseupHandler_(event);
    };
  }

  _createClass(DragManagerBPoints, [{
    key: 'startDrag',
    value: function startDrag(event, point) {
      event.stopPropagation();
      event.preventDefault();
      this.targetIndex_ = Number.parseInt(point.getAttribute('data-index'));

      var _svgBSplines_$getBLis = this.svgBSplines_.getBLists();

      var _svgBSplines_$getBLis2 = _slicedToArray(_svgBSplines_$getBLis, 2);

      this.bListX_ = _svgBSplines_$getBLis2[0];
      this.bListY_ = _svgBSplines_$getBLis2[1];

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
      if (this.bListX_) {
        this.bListX_[this.targetIndex_] = event.clientX;
        this.bListY_[this.targetIndex_] = event.clientY;
        this.svgBSplines_.updateSList(BSplines.bListToSList(this.bListX_), BSplines.bListToSList(this.bListY_));
        this.svgBSplines_.updatePath(this.targetIndex_);
      }
    }
  }, {
    key: 'mouseupHandler_',
    value: function mouseupHandler_(event) {
      var _this3 = this;

      document.removeEventListener('mousemove', this.mousemoveHandlerBound_);
      document.removeEventListener('mouseup', this.mouseupHandlerBound_);
      this.targetIndex_ = -1;
      requestAnimationFrame(function () {
        _this3.updateView_(event);
        _this3.bListX_ = null;
        _this3.bListY_ = null;
      });
    }
  }]);

  return DragManagerBPoints;
}();