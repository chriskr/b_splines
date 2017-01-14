'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BSplines = function () {
  function BSplines() {
    _classCallCheck(this, BSplines);
  }

  _createClass(BSplines, null, [{
    key: 'bListToSList',
    value: function bListToSList(bList) {
      var sList = bList.slice(0, 1);
      var n = bList.length - 1;
      var i = 1;
      for (; i < n; i++) {
        sList[i] = (bList[i - 1] + 4 * bList[i] + bList[i + 1]) / 6;
      }
      sList[i] = bList[n];
      return sList;
    }
  }, {
    key: 'sListToBList',
    value: function sListToBList(sList) {
      if (!sList.length) {
        return [];
      }

      if (sList.length === 1) {
        return [sList[0]];
      }

      if (sList.length === 2) {
        return [sList[0], sList[1]];
      }

      if (sList.length === 3) {
        return [sList[0], 1 / 4 * (6 * sList[1] - sList[0] - sList[2]), sList[2]];
      }

      /* 
        http://www.math.ucla.edu/~baker/149.1.02w/handouts/dd_splines.pdf
          In general: bi-1 + 4bi + bi+1 = 6si
          e.g for an input list of 7 points
          [4, 1, 0, 0, 0,     [b1,     [6s1 - s0,
         1, 4, 1, 0, 0,      b2,      6s2,
         0, 1, 4, 1, 0,  x   b3,  =   6s3,
         0, 0, 1, 4, 1,      b4,      6s4,
         0, 0, 0, 1, 4]      b5]      6s5 - s6]
      
      */

      var sColumn = this.createSColumn_(sList);
      var n = sColumn.length;
      var bList = sColumn.slice(0, 1);
      // It is enough to calculate a moving window of a max size of the input
      // list.
      var size141Matrix = Math.min(n - 2, BSplines.MAX_SIZE_141_MATRIX);
      var matrix = Matrix.invert(this.create141Matrix_(size141Matrix));
      var mLength = matrix.length;
      var mMiddle = mLength / 2 | 0;
      var i = 1;
      for (; i < n - 1; i++) {
        var isStartRange = i <= mMiddle;
        var isEndRange = i >= n - (mMiddle + 1);
        var row = isStartRange ? matrix[i - 1] : isEndRange ? matrix[mLength - (n - i - 1)] : matrix[mMiddle];
        // Start index of the moving window.                           
        var start = isStartRange ? 1 : isEndRange ? n - 1 - mLength : i - mMiddle;
        var b = 0;
        for (var j = 0; j < mLength; j++) {
          b += row[j] * sColumn[start + j];
        }
        bList[i] = b;
      }
      bList[i] = sColumn[n - 1];
      return bList;
    }
  }, {
    key: 'getValueAt',
    value: function getValueAt(sList, t) {
      var bList = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.sListToBList(sList);

      if (t <= 0) {
        return sList[0];
      }
      if (t >= sList.length - 1) {
        return sList[sList.length - 1];
      }
      var i = t | 0;
      var delta = t - i;
      var p1 = 2 / 3 * bList[i] + 1 / 3 * bList[i + 1];
      var p2 = 1 / 3 * bList[i] + 2 / 3 * bList[i + 1];
      var values = [sList[i], p1, p2, sList[i + 1]];
      values[0] += delta * (values[1] - values[0]);
      values[1] += delta * (values[2] - values[1]);
      values[2] += delta * (values[3] - values[2]);
      values[0] += delta * (values[1] - values[0]);
      values[1] += delta * (values[2] - values[1]);
      values[0] += delta * (values[1] - values[0]);
      return values[0];
    }
  }, {
    key: 'createSColumn_',
    value: function createSColumn_(sList) {
      var sColumn = sList.slice(0, 1);
      var i = 1;
      var n = sList.length - 1;
      for (; i < n; i++) {
        sColumn[i] = 6 * sList[i];
        if (i === 1) {
          sColumn[i] -= sList[i - 1];
        } else if (i === sList.length - 2) {
          sColumn[i] -= sList[i + 1];
        }
      }
      sColumn[i] = sList[n];
      return sColumn;
    }
  }, {
    key: 'create141Matrix_',
    value: function create141Matrix_(n) {
      var matrix = [];
      for (var i = 0; i < n; i++) {
        var row = [];
        for (var j = 0; j < n; j++) {
          row[j] = j === i ? 4 : j === i - 1 || j === i + 1 ? 1 : 0;
        }
        matrix[i] = row;
      }
      return matrix;
    }
  }, {
    key: 'MAX_SIZE_141_MATRIX',
    get: function get() {
      return 13;
    }
  }]);

  return BSplines;
}();