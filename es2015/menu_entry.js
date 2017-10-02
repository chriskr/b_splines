'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MenuEntry = function () {
  function MenuEntry(id, label, showIf, callback) {
    _classCallCheck(this, MenuEntry);

    this.id_ = id;
    this.label_ = label;
    this.showIf_ = showIf;
    this.callback_ = callback;
  }

  _createClass(MenuEntry, [{
    key: 'id',
    get: function get() {
      return this.id_;
    }
  }, {
    key: 'label',
    get: function get() {
      return this.label_;
    }
  }, {
    key: 'showIf',
    get: function get() {
      return this.showIf_;
    }
  }, {
    key: 'callback',
    get: function get() {
      return this.callback_;
    }
  }]);

  return MenuEntry;
}();