'use strict';

const CONTEXT_MENU_KEY = Symbol('context-menu-key');

class Contextmenu {
  static getInstance() {
    if (!this[CONTEXT_MENU_KEY]) {
      this[CONTEXT_MENU_KEY] = new Contextmenu();
    }
    return this[CONTEXT_MENU_KEY];
  }

  constructor() {
    this.event_ = null;
    this.entries_ = [];
    this.contextmenu_ = null;
    this.id_ = 1;
    document.addEventListener(
        'contextmenu', event => this.handleContextmenu_(event));
  }

  addEntry(entry) {
    const {label, showIf, callback} = entry;
    this.entries_.push(new MenuEntry(this.getId_(), label, showIf, callback));
  }

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
      this.contextmenu_ =
          document.body.appendTemplate(Contextmenu.Templates.contextmenu(
              event.clientX, event.clientY, entries));
      const menu = this.contextmenu_.firstElementChild;
      const box = menu.getBoundingClientRect();
      if (box.right >= window.innerWidth) {
        menu.style.left = `${event.clientX - box.width}px`;
      }
      if (box.bottom >= window.innerHeight) {
        menu.style.top = `${event.clientY - box.height}px`;
      }
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

  getId_() {
    return `menu-entry-${this.id_++}`;
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