'use strict';

class DragManagerBPoints {
  constructor(svgBSplines) {
    this.svgBSplines_ = svgBSplines;

    this.bListX_ = null;
    this.bListY_ = null;
    this.targetIndex_ = -1;
    this.mousemoveHandlerBound_ = event => this.mousemoveHandler_(event);
    this.mouseupHandlerBound_ = event => this.mouseupHandler_(event);
  }


  startDrag(event, point) {
    event.stopPropagation();
    event.preventDefault();
    this.targetIndex_ = Number.parseInt(point.getAttribute('data-index'));
    [this.bListX_, this.bListY_] = this.svgBSplines_.getBLists();
    document.addEventListener('mousemove', this.mousemoveHandlerBound_);
    document.addEventListener('mouseup', this.mouseupHandlerBound_);
  };

  mousemoveHandler_(event) {
    requestAnimationFrame(() => this.updateView_(event));
  }

  updateView_(event) {
    if (this.bListX_) {
      this.bListX_[this.targetIndex_] = event.clientX;
      this.bListY_[this.targetIndex_] = event.clientY;
      this.svgBSplines_.updateSList(
          BSplines.bListToSList(this.bListX_),
          BSplines.bListToSList(this.bListY_));
      this.svgBSplines_.updatePath(this.targetIndex_);
    }
  }

  mouseupHandler_(event) {
    document.removeEventListener('mousemove', this.mousemoveHandlerBound_);
    document.removeEventListener('mouseup', this.mouseupHandlerBound_);
    this.targetIndex_ = -1;
    requestAnimationFrame(() => {
      this.updateView_(event);
      this.bListX_ = null;
      this.bListY_ = null;
    });
  }
}