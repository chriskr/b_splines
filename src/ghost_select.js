class GhostSelect {
  constructor(svgBSplines) {
    this.svgBSplines_ = svgBSplines;

    this.startLeft_ = 0;
    this.startTop_ = 0;
    this.ghostElement_ = Bragi.createTemplate(GhostSelect.Templates.ghost());
    this.mousemoveHandlerBound_ = event => this.mousemoveHandler_(event);
    this.mouseupHandlerBound_ = event => this.mouseupHandler_(event);
  }

  startSelection(event) {
    event.stopPropagation();
    event.preventDefault();
    document.addEventListener('mousemove', this.mousemoveHandlerBound_);
    document.addEventListener('mouseup', this.mouseupHandlerBound_);
    document.body.appendChild(this.ghostElement_);
    this.startLeft_ = event.clientX;
    this.startTop_ = event.clientY;
    this.updateStyle_(
        {left: this.startLeft_, top: this.startTop_, width: 0, height: 0});
  }

  mousemoveHandler_(event) {
    requestAnimationFrame(() => this.updateView_(event));
  }

  updateView_(event) {
    const deltaX = event.clientX - this.startLeft_;
    const deltaY = event.clientY - this.startTop_;
    const left = deltaX < 0 ? this.startLeft_ + deltaX : this.startLeft_;
    const top = deltaY < 0 ? this.startTop_ + deltaY : this.startTop_;
    const width = Math.abs(deltaX);
    const height = Math.abs(deltaY);
    const right = left + width;
    const bottom = top + height;
    const rect = {bottom, height, left, right, top, width};
    this.updateStyle_(rect);
    this.svgBSplines_.selectPoints(rect);
  }

  updateStyle_(rect) {
    this.ghostElement_.style.cssText =
        ['top', 'left', 'width', 'height']
            .map(prop => `${prop}: ${rect[prop]}px;`)
            .join(' ');
  }

  mouseupHandler_(event) {
    document.removeEventListener('mousemove', this.mousemoveHandlerBound_);
    document.removeEventListener('mouseup', this.mouseupHandler_);
    this.ghostElement_.remove();
  }
}


GhostSelect.Templates = class {
  static ghost() { return ['div', {id: 'ghost-select'}]; }
}