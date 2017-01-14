'use strict';

if (!Element.prototype.matches) {
  Element.prototype.matches =
      Element.prototype.msMatchesSelector || function(selector) {
        for (const candidate of this.parentElement.querySelector(selector)) {
          if (candidate === this) {
            return true
          }
        }
        return false;
      }
};

if (!Element.prototype.closest) {
  Element.prototype.closest = function(selector) {
    let ele = this;
    while (ele) {
      if (ele.matches(selector)) {
        return ele;
      }
      ele = ele.parentElement;
    }
    return null;
  }
}