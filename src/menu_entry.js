'use strict';

class MenuEntry {
  constructor(id, label, showIf, callback) {
    this.id_ = id;
    this.label_ = label;
    this.showIf_ = showIf;
    this.callback_ = callback;
  }

  get id() {
    return this.id_;
  }

  get label() {
    return this.label_;
  }

  get showIf() {
    return this.showIf_;
  }

  get callback() {
    return this.callback_;
  }
}
