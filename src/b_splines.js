'use strict';

class BSplines {
  static get MAX_SIZE_141_MATRIX() { return 13; } 

  static bListToSList(bList) {
    const sList = bList.slice(0, 1);
    const n = bList.length - 1;
    let i = 1;
    for (; i < n; i++) {
      sList[i] = (bList[i - 1] + 4 * bList[i] + bList[i + 1]) / 6;
    }
    sList[i] = bList[n];
    return sList;
  }

  static sListToBList(sList) {
    if (!sList.length) {
      return [];
    }

    if (sList.length === 1) {
      return [sList[0]];
    }

    if (sList.length === 2) {
      return [sList[0],  sList[1]];
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

    const sColumn = this.createSColumn_(sList);
    const n = sColumn.length;
    const bList = sColumn.slice(0, 1);
    // It is enough to calculate a moving window of a max size of the input
    // list.
    const size141Matrix = Math.min(n - 2, BSplines.MAX_SIZE_141_MATRIX);
    const matrix = Matrix.invert(this.create141Matrix_(size141Matrix));
    const mLength = matrix.length;
    const mMiddle = mLength / 2 | 0;
    let i = 1;
    for (; i < n - 1; i++) {
      const isStartRange = i <= mMiddle;
      const isEndRange = i >= n - (mMiddle + 1);
      const row = isStartRange ? matrix[i - 1] : isEndRange ?
                                 matrix[mLength - (n - i - 1)] :
                                 matrix[mMiddle];
      // Start index of the moving window.                           
      const start =
          isStartRange ? 1 : isEndRange ? n - 1 - mLength : i - mMiddle;
      let b = 0;
      for (let j = 0; j < mLength; j++) {
        b += row[j] * sColumn[start + j];
      }
      bList[i] = b;
    }
    bList[i] = sColumn[n - 1];
    return bList
  }

  static getValueAt(sList, t, bList = this.sListToBList(sList)) {
    if (t <= 0) {
      return sList[0];
    }
    if (t >= sList.length - 1) {
      return sList[sList.length - 1];
    }
    const i = t | 0;
    const delta = t - i;
    const p1 = 2 / 3 * bList[i] + 1 / 3 * bList[i + 1];
    const p2 = 1 / 3 * bList[i] + 2 / 3 * bList[i + 1];
    const values = [sList[i], p1, p2, sList[i + 1]];
    values[0] += delta * (values[1] - values[0]);
    values[1] += delta * (values[2] - values[1]);
    values[2] += delta * (values[3] - values[2]);
    values[0] += delta * (values[1] - values[0]);
    values[1] += delta * (values[2] - values[1]);
    values[0] += delta * (values[1] - values[0]);
    return values[0];
  }

  static createSColumn_(sList) {
    const sColumn = sList.slice(0, 1);
    let i = 1;
    const n = sList.length - 1;
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

  static create141Matrix_(n) {
    const matrix = [];
    for (let i = 0; i < n; i++) {
      const row = [];
      for (let j = 0; j < n; j++) {
        row[j] = j === i ? 4 : j === i - 1 || j === i + 1 ? 1 : 0;
      }
      matrix[i] = row;
    }
    return matrix;
  }
}
