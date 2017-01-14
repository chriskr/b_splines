'use strict';

class SPoint {
  constructor(x = 0, y = 0, id, template = SvgTemplates.inputPoint) {
    this.x_ = x;
    this.y_ = y;
    this.id_ = id;
    this.deltaX_ = 0;
    this.deltaY_ = 0;
    this.element_ = Bragi.createTemplate(template(this));
  }

  get x() { return this.x_; }

  get y() { return this.y_; }

  get id() { return this.id_; }

  get element() { return this.element_; }

  updatePosition(x, y) {
    this.x_ = x;
    this.y_ = y;
    this.updatePosition_();
  }

  scalePosition(scaleX, scaleY) {
    this.x_ *= scaleX;
    this.y_ *= scaleY;
    this.updatePosition_();
  }

  setSelected(isSelected) {
    this.element_.classList.toggle('selected', isSelected);
  }

  setStartDelta(startX, startY) {
    this.deltaX_ = startX - this.x_;
    this.deltaY_ = startY - this.y_;
  }

  updateDelta(x, y) {
    this.x_ = x - this.deltaX_;
    this.y_ = y - this.deltaY_;
    this.updatePosition_();
  }

  remove() { this.element_.remove(); }

  updatePosition_() {
    this.element_.setAttribute('transform', `translate(${this.x}, ${this.y})`);
  }
}
