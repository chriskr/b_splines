'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Contextmenu = function () {
  function Contextmenu() {
    var _this = this;

    _classCallCheck(this, Contextmenu);

    this.event_ = null;
    this.entries_ = [];
    this.contextmenu_ = null;
    document.addEventListener('contextmenu', function (event) {
      return _this.handleContextmenu_(event);
    });
  }

  _createClass(Contextmenu, [{
    key: 'addEntry',
    value: function addEntry(entry) {
      this.entries_.push(entry);
    }
  }, {
    key: 'handleContextmenu_',
    value: function handleContextmenu_(event) {
      this.event_ = event;
      if (this.showMenu_(event)) {
        event.preventDefault();
      }
    }
  }, {
    key: 'showMenu_',
    value: function showMenu_(event) {
      var _this2 = this;

      if (this.contextmenu_) {
        this.contextmenu_.remove();
      }
      var entries = this.entries_.filter(function (entry) {
        return !entry.showIf || entry.showIf(event);
      });
      if (entries.length) {
        this.contextmenu_ = document.body.appendTemplate(Contextmenu.Templates.contextmenu(event.clientX, event.clientY, entries));
        this.contextmenu_.addEventListener('click', function (event) {
          return _this2.clickHandler_(event);
        });
        return true;
      }
      return false;
    }
  }, {
    key: 'clickHandler_',
    value: function clickHandler_(event) {
      event.stopPropagation();
      event.preventDefault();
      var entryElement = event.target.closest('.menu-entry');
      if (entryElement) {
        var entry = this.entries_.find(function (entry) {
          return entry.id === entryElement.dataset.id;
        });
        entry.callback(this.event_);
        this.event_ = null;
      }
      this.contextmenu_.remove();
      this.contextmenu_ = null;
    }
  }]);

  return Contextmenu;
}();

Contextmenu.Templates = function () {
  function _class() {
    _classCallCheck(this, _class);
  }

  _createClass(_class, null, [{
    key: 'contextmenu',
    value: function contextmenu(x, y, entries) {
      var _this3 = this;

      return ['div', { id: 'contextmenu-container' }, ['ul', {
        id: 'contextmenu',
        style: 'top: ' + y + 'px; left: ' + x + 'px'
      }, entries.map(function (entry) {
        return _this3.entry(entry);
      })]];
    }
  }, {
    key: 'entry',
    value: function entry(_entry) {
      return ['li', {
        class: 'menu-entry',
        'data-id': _entry.id
      }, _entry.label];
    }
  }]);

  return _class;
}();