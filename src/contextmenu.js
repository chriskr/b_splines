'use strict';

class Contextmenu {
  constructor() {
    this.event_ = null;
    this.entries_ = [];
    this.contextmenu_ = null;
    document.addEventListener(
        'contextmenu', event => this.handleContextmenu_(event));
  }

  addEntry(entry) { this.entries_.push(entry); }

  handleContextmenu_(event) {
    this.event_ = event;
    if (this.showMenu_(event)) {
      event.preventDefault();
    }
  }

  showMenu_(event) {
    if (this.contextmenu_) {
      this.contextmenu_.remove();
    }
    const entries =
        this.entries_.filter(entry => !entry.showIf || entry.showIf(event));
    if (entries.length) {
      this.contextmenu_ = document.body.appendTemplate(
          Contextmenu.Templates.contextmenu(event.clientX, event.clientY, entries));
      this.contextmenu_.addEventListener(
          'click', event => this.clickHandler_(event));
      return true;
    }
    return false;
  }

  clickHandler_(event) {
    event.stopPropagation();
    event.preventDefault();
    const entryElement = event.target.closest('.menu-entry');
    if (entryElement) {
      const entry =
          this.entries_.find(entry => entry.id === entryElement.dataset.id);
      entry.callback(this.event_);
      this.event_ = null;
    }
    this.contextmenu_.remove();
    this.contextmenu_ = null;
  }
}

Contextmenu.Templates = class {
  static contextmenu(x, y, entries) {
    return [
      'div',
      {id: 'contextmenu-container'},
      [
        'ul', {
          id: 'contextmenu',
          style: `top: ${y}px; left: ${x}px`,
        },
        entries.map(entry => this.entry(entry))
      ],
    ];
  }

  static entry(entry) {
    return [
      'li', {
        class: 'menu-entry',
        'data-id': entry.id,
      },
      entry.label
    ];
  }
}