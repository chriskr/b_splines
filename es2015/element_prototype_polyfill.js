'use strict';

if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || function (selector) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.parentElement.querySelector(selector)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var candidate = _step.value;

        if (candidate === this) {
          return true;
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

    return false;
  };
};

if (!Element.prototype.closest) {
  Element.prototype.closest = function (selector) {
    var ele = this;
    while (ele) {
      if (ele.matches(selector)) {
        return ele;
      }
      ele = ele.parentElement;
    }
    return null;
  };
}