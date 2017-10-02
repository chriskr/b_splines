'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SvgBSplines = function () {
  _createClass(SvgBSplines, null, [{
    key: 'STANDARD_MOUSE_BUTTON',
    get: function get() {
      return 0;
    }
  }, {
    key: 'MAX_INSERTION_RADIUS',
    get: function get() {
      return 7;
    }
  }]);

  function SvgBSplines() {
    var _this = this;

    _classCallCheck(this, SvgBSplines);

    this.sList_ = [];
    this.id_ = 0;
    this.dragManagerSPoints_ = new DragManagerSPoints(this);
    this.dragManagerBPoints_ = new DragManagerBPoints(this);
    this.ghostSelect_ = new GhostSelect(this);
    this.svg_ = document.body.appendTemplate(SvgTemplates.svg());
    this.path_ = this.svg_.appendTemplate(SvgTemplates.path());
    this.width_ = window.innerWidth;
    this.height_ = window.innerHeight;
    this.isWithConstruction_ = true;
    this.resizeRequest_ = 0;
    this.selectedPoints_ = [];
    this.constructionGroup_ = this.svg_.querySelector('#construction');
    this.setSvgDimensions_();
    this.svg_.addEventListener('mousedown', function (event) {
      return _this.clickHandler_(event);
    });
    document.addEventListener('change', function (event) {
      return _this.changeHandler_(event);
    });
    window.addEventListener('resize', function (event) {
      if (!_this.resizeRequest_) {
        _this.resizeRequest_ = requestAnimationFrame(function () {
          return _this.resizeHandler_();
        });
      }
    });
    Contextmenu.getInstance().addEntry({
      label: 'Delete point',
      showIf: function showIf(event) {
        return Boolean(event.target.closest('.input-point-group'));
      },
      callback: function callback(event) {
        return _this.deletePoint_(event);
      }
    });
    Contextmenu.getInstance().addEntry({
      label: 'Insert point',
      showIf: function showIf(event) {
        return _this.getInsertionIndex_(event) > -1;
      },
      callback: function callback(event) {
        return _this.addPoint(event.clientX, event.clientY, _this.getInsertionIndex_(event));
      }
    });
    Array.from(document.querySelectorAll('input[type=checkbox]')).forEach(function (input) {
      return input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  _createClass(SvgBSplines, [{
    key: 'updatePath',
    value: function updatePath() {
      var indexTragetBPoint = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;

      var _createPath = this.createPath(),
          _createPath2 = _slicedToArray(_createPath, 2),
          newPath = _createPath2[0],
          construction = _createPath2[1];

      this.path_.setAttribute('d', newPath);
      while (this.constructionGroup_.firstChild) {
        this.constructionGroup_.firstChild.remove();
      }
      if (this.isWithConstruction_) {
        this.drawConstruction_(construction, indexTragetBPoint);
      }
    }
  }, {
    key: 'getBLists',
    value: function getBLists() {
      return [BSplines.sListToBList(this.sList_.map(function (point) {
        return point.x;
      })), BSplines.sListToBList(this.sList_.map(function (point) {
        return point.y;
      }))];
    }
  }, {
    key: 'updateSList',
    value: function updateSList(sListX, sListY) {
      this.sList_.forEach(function (point, index) {
        return point.updatePosition(sListX[index], sListY[index]);
      });
    }
  }, {
    key: 'getPointWithId',
    value: function getPointWithId(id) {
      return this.sList_.find(function (point) {
        return point.id === id;
      });
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.sList_.forEach(function (point) {
        return point.remove();
      });
      this.sList_.length = 0;
      this.updatePath();
    }
  }, {
    key: 'addPoint',
    value: function addPoint(x, y) {
      var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.sList_.length;

      var point = new SPoint(x, y, this.getId_());
      if (index < this.sList_.length) {
        this.sList_.splice(index, 0, point);
      } else {
        this.sList_.push(point);
      }
      this.svg_.appendChild(point.element);
      this.updatePath();
    }
  }, {
    key: 'test',
    value: function test() {
      var point = new SPoint(this.sList_[0].x, this.sList_[0].y, this.getId_(), function (point) {
        return SvgTemplates.point(0, 0, 'test-point', 5);
      });
      this.svg_.appendChild(point.element);
      point.updatePosition(point.x, point.y);

      var sListX = this.sList_.map(function (point) {
        return point.x;
      });
      var sListY = this.sList_.map(function (point) {
        return point.y;
      });
      var totalTime = this.sList_.length - 1;
      var t = 0;
      var update = function update() {
        t += 0.03;
        var x = BSplines.getValueAt(sListX, t);
        var y = BSplines.getValueAt(sListY, t);
        point.updatePosition(x, y);
        if (t < totalTime) {
          requestAnimationFrame(update);
        } else {
          point.remove();
        }
      };
      requestAnimationFrame(update);
    }
  }, {
    key: 'export',
    value: function _export() {
      return {
        'with-construction': document.querySelector('[name="with-construction"]').checked,
        'fill': document.querySelector('[name="fill"]').checked,
        'width': this.width_,
        'height': this.height_,
        'points': this.sList_.map(function (point) {
          return [Math.round(point.x), Math.round(point.y)];
        })
      };
    }
  }, {
    key: 'load',
    value: function load(data) {
      var _this2 = this;

      this.reset();
      var scaleX = window.innerWidth / data.width;
      var scaleY = window.innerHeight / data.height;
      data.points.forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            x = _ref2[0],
            y = _ref2[1];

        return _this2.addPoint(x * scaleX, y * scaleY);
      });
      ['with-construction', 'fill'].forEach(function (name) {
        var input = document.querySelector('[name="' + name + '"]');
        input.checked = data[name];
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    }
  }, {
    key: 'getSvgTemplate',
    value: function getSvgTemplate(data) {
      var width = data.width,
          height = data.height,
          points = data.points;

      var _createPath3 = this.createPath(points.map(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            x = _ref4[0],
            y = _ref4[1];

        return new SPoint(x, y, '');
      })),
          _createPath4 = _slicedToArray(_createPath3, 2),
          path = _createPath4[0],
          _ = _createPath4[1];

      return SvgTemplates.thumbnail(width, height, path);
    }
  }, {
    key: 'deletePoint_',
    value: function deletePoint_(event) {
      var pointElement = event.target.closest('.input-point-group');
      if (pointElement) {
        var index = this.sList_.findIndex(function (point) {
          return point.id === pointElement.id;
        });
        this.sList_.splice(index, 1);
        pointElement.remove();
        this.updatePath();
      }
    }
  }, {
    key: 'getInsertionIndex_',
    value: function getInsertionIndex_(event) {
      var x0 = event.clientX;
      var y0 = event.clientY;
      var maxRadius = SvgBSplines.MAX_INSERTION_RADIUS;
      var minDistance = Math.pow(maxRadius, 2);
      var sListX = this.sList_.map(function (point) {
        return point.x;
      });
      var sListY = this.sList_.map(function (point) {
        return point.y;
      });
      var bListX = BSplines.sListToBList(sListX);
      var bListY = BSplines.sListToBList(sListY);
      var totalTime = this.sList_.length - 1;
      var t = 0;
      while (t < totalTime) {
        var x = BSplines.getValueAt(sListX, t, bListX);
        var y = BSplines.getValueAt(sListY, t, bListY);
        var delatX = x - x0;
        var delatY = y - y0;
        var distance = Math.pow(delatX, 2) + Math.pow(delatY, 2);
        if (distance < minDistance) {
          return t + 1 | 0;
        }
        t += 0.01;
      };
      return -1;
    }
  }, {
    key: 'setSvgDimensions_',
    value: function setSvgDimensions_() {
      var _this3 = this;

      var width = this.width_;
      var height = this.height_;
      [['viewBox', '0 0 ' + width + ' ' + height], ['width', width + 'px'], ['height', height + 'px']].forEach(function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 2),
            key = _ref6[0],
            value = _ref6[1];

        return _this3.svg_.setAttribute(key, value);
      });
    }
  }, {
    key: 'createPath',
    value: function createPath() {
      var sList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.sList_;

      if (sList.length < 1) {
        return ['', []];
      }
      var construction = [];
      construction.push([sList[0].x, sList[0].y]);
      var d = 'M ' + this.point_(sList[0].x, sList[0].y) + ' ';
      if (sList.length < 2) {
        return [d, construction];
      }
      d += 'C ';
      var bListX = BSplines.sListToBList(sList.map(function (point) {
        return point.x;
      }));
      var bListY = BSplines.sListToBList(sList.map(function (point) {
        return point.y;
      }));
      for (var i = 0; i < sList.length - 1; i++) {
        var p1x = 2 / 3 * bListX[i] + 1 / 3 * bListX[i + 1];
        var p1y = 2 / 3 * bListY[i] + 1 / 3 * bListY[i + 1];
        var p2x = 1 / 3 * bListX[i] + 2 / 3 * bListX[i + 1];
        var p2y = 1 / 3 * bListY[i] + 2 / 3 * bListY[i + 1];
        construction.push([p1x, p1y], [p2x, p2y], [bListX[i + 1], bListY[i + 1]]);
        d += this.point_(p1x, p1y);
        d += this.point_(p2x, p2y);
        if (i === sList.length - 2) {
          d += this.point_(bListX[i + 1], bListY[i + 1]);
        } else {
          d += this.point_((bListX[i] + 4 * bListX[i + 1] + bListX[i + 2]) / 6, (bListY[i] + 4 * bListY[i + 1] + bListY[i + 2]) / 6);
        }
      }
      return [d, construction];
    }
  }, {
    key: 'drawConstruction_',
    value: function drawConstruction_(construction, indexTragetBPoint) {
      var _this4 = this;

      construction.forEach(function (_ref7, index) {
        var _ref8 = _slicedToArray(_ref7, 2),
            x = _ref8[0],
            y = _ref8[1];

        var isBPoint = index % 3 === 0;
        var cssClass = isBPoint ? 'b-point' : 'point';
        if (isBPoint && index / 3 === indexTragetBPoint) {
          cssClass += ' b-target';
        }
        _this4.constructionGroup_.appendTemplate(SvgTemplates.point(x, y, cssClass, isBPoint ? 7 : 3, isBPoint ? { 'data-index': String(index / 3) } : {}));
        if (index && index % 3 === 0) {
          var _construction = _slicedToArray(construction[index - 3], 2),
              x_ = _construction[0],
              y_ = _construction[1];

          _this4.constructionGroup_.appendTemplate(SvgTemplates.line(x_, y_, x, y));
        } else if (index > 1 && index % 3 === 1) {
          var _construction2 = _slicedToArray(construction[index - 2], 2),
              _x_ = _construction2[0],
              _y_ = _construction2[1];

          _this4.constructionGroup_.appendTemplate(SvgTemplates.line(_x_, _y_, x, y));
        }
      });
    }
  }, {
    key: 'point_',
    value: function point_(x, y) {
      return ' ' + x + ' ' + y;
    }
  }, {
    key: 'getId_',
    value: function getId_() {
      return 'point-' + this.id_++;
    }
  }, {
    key: 'clickHandler_',
    value: function clickHandler_(event) {
      if (event.button !== SvgBSplines.STANDARD_MOUSE_BUTTON) {
        return;
      }
      if (event.shiftKey) {
        this.ghostSelect_.startSelection(event);
      } else {
        var sPoint = event.target.closest('.input-point-group');
        var bPoint = event.target.closest('.b-point');
        if (sPoint) {
          this.dragManagerSPoints_.startDrag(event, sPoint);
        } else if (bPoint) {
          this.dragManagerBPoints_.startDrag(event, bPoint);
        } else if (this.selectedPoints_.length) {
          this.clearSelection();
        } else {
          this.addPoint(event.clientX, event.clientY);
        }
      }
    }
  }, {
    key: 'selectPoints',
    value: function selectPoints(rect) {
      this.selectedPoints_.length = 0;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.sList_[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var point = _step.value;

          if (rect.left <= point.x && point.x <= rect.right && rect.top <= point.y && point.y <= rect.bottom) {
            this.selectedPoints_.push(point);
            point.setSelected(true);
          } else {
            point.setSelected(false);
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: 'clearSelection',
    value: function clearSelection() {
      this.selectPoints({
        left: 0,
        top: 0,
        width: 0,
        heigh: 0,
        right: 0,
        bottom: 0
      });
    }
  }, {
    key: 'resizeHandler_',
    value: function resizeHandler_() {
      this.resizeRequest_ = 0;
      var newWidth = window.innerWidth;
      var newHeight = window.innerHeight;
      var scaleX = newWidth / this.width_;
      var scaleY = newHeight / this.height_;
      this.width_ = newWidth;
      this.height_ = newHeight;
      this.setSvgDimensions_();
      this.sList_.forEach(function (point) {
        return point.scalePosition(scaleX, scaleY);
      });
      this.updatePath();
    }
  }, {
    key: 'changeHandler_',
    value: function changeHandler_(event) {
      var target = event.target;
      switch (target.name) {
        case 'with-construction':
          this.isWithConstruction_ = target.checked;
          this.updatePath();
          break;
        case 'fill':
          document.body.classList.toggle('fill', target.checked);
          break;
      }
    }
  }, {
    key: 'selectedPoints',
    get: function get() {
      return this.selectedPoints_;
    }
  }]);

  return SvgBSplines;
}();