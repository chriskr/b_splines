"use strict";

Storage.prototype.setJSONItem = function (key, value) {
  try {
    this.setItem(key, JSON.stringify(value));
  } catch (e) {}
};

Storage.prototype.getJSONItem = function (key) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  try {
    var object = JSON.parse(this.getItem(key));
    return object === null ? defaultValue : object;
  } catch (e) {
    return defaultValue;
  }
};