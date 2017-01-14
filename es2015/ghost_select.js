'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GhostSelect = function () {
  function GhostSelect(svgBSplines) {
    var _this = this;

    _classCallCheck(this, GhostSelect);

    this.svgBSplines_ = svgBSplines;

    this.startLeft_ = 0;
    this.startTop_ = 0;
    this.ghostElement_ = Bragi.createTemplate(GhostSelect.Templates.ghost());
    this.mousemoveHandlerBound_ = function (event) {
      return _this.mousemoveHandler_(event);
    };
    this.mouseupHandlerBound_ = function (event) {
      return _this.mouseupHandler_(event);
    };
  }

  _createClass(GhostSelect, [{
    key: 'startSelection',
    value: function startSelection(event) {
      event.stopPropagation();
      event.preventDefault();
      document.addEventListener('mousemove', this.mousemoveHandlerBound_);
      document.addEventListener('mouseup', this.mouseupHandlerBound_);
      document.body.appendChild(this.ghostElement_);
      this.startLeft_ = event.clientX;
      this.startTop_ = event.clientY;
      this.updateStyle_({ left: this.startLeft_, top: this.startTop_, width: 0, height: 0 });
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
      var deltaX = event.clientX - this.startLeft_;
      var deltaY = event.clientY - this.startTop_;
      var left = deltaX < 0 ? this.startLeft_ + deltaX : this.startLeft_;
      var top = deltaY < 0 ? this.startTop_ + deltaY : this.startTop_;
      var width = Math.abs(deltaX);
      var height = Math.abs(deltaY);
      var right = left + width;
      var bottom = top + height;
      var rect = { bottom: bottom, height: height, left: left, right: right, top: top, width: width };
      this.updateStyle_(rect);
      this.svgBSplines_.selectPoints(rect);
    }
  }, {
    key: 'updateStyle_',
    value: function updateStyle_(rect) {
      this.ghostElement_.style.cssText = ['top', 'left', 'width', 'height'].map(function (prop) {
        return prop + ': ' + rect[prop] + 'px;';
      }).join(' ');
    }
  }, {
    key: 'mouseupHandler_',
    value: function mouseupHandler_(event) {
      document.removeEventListener('mousemove', this.mousemoveHandlerBound_);
      document.removeEventListener('mouseup', this.mouseupHandler_);
      this.ghostElement_.remove();
    }
  }]);

  return GhostSelect;
}();

GhostSelect.Templates = function () {
  function _class() {
    _classCallCheck(this, _class);
  }

  _createClass(_class, null, [{
    key: 'ghost',
    value: function ghost() {
      return ['div', { id: 'ghost-select' }];
    }
  }]);

  return _class;
}();