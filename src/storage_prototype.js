Storage.prototype.setJSONItem = function(key, value) {
  try {
    this.setItem(key, JSON.stringify(value));
  } catch (e) {
  }
};

Storage.prototype.getJSONItem = function(key, defaultValue = null) {
  try {
    const object = JSON.parse(this.getItem(key));
    return object === null ? defaultValue : object;
  } catch (e) {
    return defaultValue;
  }
};
