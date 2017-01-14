class DragManagerSPoints {
  constructor(svgBSplines) {
    this.svgBSplines_ = svgBSplines;

    this.dragPoints_ = [];
    this.mousemoveHandlerBound_ = event => this.mousemoveHandler_(event);
    this.mouseupHandlerBound_ = event => this.mouseupHandler_(event);
  }

  startDrag(event, point) {
    event.stopPropagation();
    event.preventDefault();
    const dragPoints = this.svgBSplines_.selectedPoints;
    this.dragPoints_.length = 0;
    if (dragPoints.length) {
      this.dragPoints_.push(...dragPoints);
    } else {
      this.dragPoints_.push(this.svgBSplines_.getPointWithId(point.id));
    }
    const x = event.clientX;
    const y = event.clientY;
    this.dragPoints_.forEach(point => point.setStartDelta(x, y));
    document.addEventListener('mousemove', this.mousemoveHandlerBound_);
    document.addEventListener('mouseup', this.mouseupHandlerBound_);
  }

  mousemoveHandler_(event) {
    requestAnimationFrame(() => this.updateView_(event));
  }

  updateView_(event) {
    if (this.dragPoints_.length) {
      const x = event.clientX;
      const y = event.clientY;
      this.dragPoints_.forEach(point => point.updateDelta(x, y));
      this.svgBSplines_.updatePath();
    }
  }

  mouseupHandler_(event) {
    document.removeEventListener('mousemove', this.mousemoveHandlerBound_);
    document.removeEventListener('mouseup', this.mouseupHandler_);
    this.dragPoints_.length = 0;
  }
}
