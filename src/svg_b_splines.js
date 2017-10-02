class SvgBSplines {
  static get STANDARD_MOUSE_BUTTON() { return 0; }
  static get MAX_INSERTION_RADIUS() { return 7; }

  constructor() {
    this.sList_ = [];
    this.id_ = 0;
    this.dragManagerSPoints_ = new DragManagerSPoints(this);
    this.dragManagerBPoints_ = new DragManagerBPoints(this);
    this.ghostSelect_ = new GhostSelect(this);
    this.svg_ = document.body.appendTemplate(SvgTemplates.svg());
    this.path_ = this.svg_.appendTemplate(SvgTemplates.path());
    this.width_ = window.innerWidth;
    this.height_ = window.innerHeight;
    this.isWithConstruction_ = true;
    this.resizeRequest_ = 0;
    this.selectedPoints_ = [];
    this.constructionGroup_ = this.svg_.querySelector('#construction');
    this.setSvgDimensions_();
    this.svg_.addEventListener('mousedown', event => this.clickHandler_(event));
    document.addEventListener('change', event => this.changeHandler_(event));
    window.addEventListener('resize', event => {
      if (!this.resizeRequest_) {
        this.resizeRequest_ =
            requestAnimationFrame(() => this.resizeHandler_());
      }
    });
    Contextmenu.getInstance().addEntry({
      label: 'Delete point',
      showIf: event => Boolean(event.target.closest('.input-point-group')),
      callback: event => this.deletePoint_(event),
    });
    Contextmenu.getInstance().addEntry({
      label: 'Insert point',
      showIf: event => this.getInsertionIndex_(event) > -1,
      callback:
          event => this.addPoint(
              event.clientX, event.clientY, this.getInsertionIndex_(event)),
    });
    Array.from(document.querySelectorAll('input[type=checkbox]'))
        .forEach(
            input => input.dispatchEvent(new Event('change', {bubbles: true})));
  }

  updatePath(indexTragetBPoint = -1) {
    const[newPath, construction] = this.createPath();
    this.path_.setAttribute('d', newPath);
    while (this.constructionGroup_.firstChild) {
      this.constructionGroup_.firstChild.remove();
    }
    if (this.isWithConstruction_) {
      this.drawConstruction_(construction, indexTragetBPoint);
    }
  }

  getBLists() {
    return [
      BSplines.sListToBList(this.sList_.map(point => point.x)),
      BSplines.sListToBList(this.sList_.map(point => point.y))
    ];
  }

  updateSList(sListX, sListY) {
    this.sList_.forEach(
        (point, index) => point.updatePosition(sListX[index], sListY[index]));
  }

  getPointWithId(id) { return this.sList_.find(point => point.id === id); }

  reset() {
    this.sList_.forEach(point => point.remove());
    this.sList_.length = 0;
    this.updatePath();
  }

  addPoint(x, y, index = this.sList_.length) {
    const point = new SPoint(x, y, this.getId_());
    if (index < this.sList_.length) {
      this.sList_.splice(index, 0, point);
    } else {
      this.sList_.push(point);
    }
    this.svg_.appendChild(point.element);
    this.updatePath();
  }

  test() {
    const point = new SPoint(
        this.sList_[0].x, this.sList_[0].y, this.getId_(),
        point => SvgTemplates.point(0, 0, 'test-point', 5));
    this.svg_.appendChild(point.element);
    point.updatePosition(point.x, point.y);

    const sListX = this.sList_.map(point => point.x);
    const sListY = this.sList_.map(point => point.y);
    const totalTime = this.sList_.length - 1;
    let t = 0;
    const update = () => {
      t += 0.03;
      const x = BSplines.getValueAt(sListX, t);
      const y = BSplines.getValueAt(sListY, t);
      point.updatePosition(x, y);
      if (t < totalTime) {
        requestAnimationFrame(update);
      } else {
        point.remove();
      }
    };
    requestAnimationFrame(update);
  }

  export() {
    return {
      'with-construction':
          document.querySelector('[name="with-construction"]').checked,
      'fill': document.querySelector('[name="fill"]').checked,
      'width': this.width_,
      'height': this.height_,
      'points':
          this.sList_.map(point => [Math.round(point.x), Math.round(point.y)]),
    };
  }

  load(data) {
    this.reset();
    const scaleX = window.innerWidth / data.width;
    const scaleY = window.innerHeight / data.height;
    data.points.forEach(([x, y]) => this.addPoint(x * scaleX, y * scaleY));
    ['with-construction', 'fill'].forEach(name => {
      const input = document.querySelector(`[name="${name}"]`);
      input.checked = data[name];
      input.dispatchEvent(new Event('change', {bubbles: true}));
    });
  }

  getSvgTemplate(data) {
    const {width, height, points} = data;
    const [path, _] =
        this.createPath(points.map(([x, y]) => new SPoint(x, y, '')));
    return SvgTemplates.thumbnail(width, height, path);
  }

  deletePoint_(event) {
    const pointElement = event.target.closest('.input-point-group');
    if (pointElement) {
      const index =
          this.sList_.findIndex(point => point.id === pointElement.id);
      this.sList_.splice(index, 1);
      pointElement.remove();
      this.updatePath();
    }
  }

  getInsertionIndex_(event) {
    const x0 = event.clientX;
    const y0 = event.clientY;
    const maxRadius = SvgBSplines.MAX_INSERTION_RADIUS;
    const minDistance = maxRadius ** 2;
    const sListX = this.sList_.map(point => point.x);
    const sListY = this.sList_.map(point => point.y);
    const bListX = BSplines.sListToBList(sListX);
    const bListY = BSplines.sListToBList(sListY);
    const totalTime = this.sList_.length - 1;
    let t = 0;
    while (t < totalTime) {
      const x = BSplines.getValueAt(sListX, t, bListX);
      const y = BSplines.getValueAt(sListY, t, bListY);
      const delatX = x - x0;
      const delatY = y - y0;
      const distance = delatX ** 2 + delatY ** 2;
      if (distance < minDistance) {
        return t + 1 | 0;
      }
      t += 0.01;
    };
    return -1;
  }

  setSvgDimensions_() {
    const width = this.width_;
    const height = this.height_;
    [['viewBox', `0 0 ${width} ${height}`], ['width', `${width}px`],
     ['height', `${height}px`],
    ].forEach(([key, value]) => this.svg_.setAttribute(key, value));
  }

  createPath(sList = this.sList_) {
    if (sList.length < 1) {
      return ['', []];
    }
    const construction = [];
    construction.push([sList[0].x, sList[0].y]);
    let d = `M ${this.point_(sList[0].x, sList[0].y)} `;
    if (sList.length < 2) {
      return [d, construction];
    }
    d += 'C ';
    const bListX = BSplines.sListToBList(sList.map(point => point.x));
    const bListY = BSplines.sListToBList(sList.map(point => point.y));
    for (let i = 0; i < sList.length - 1; i++) { 
      const p1x = 2 / 3 * bListX[i] + 1 / 3 * bListX[i + 1];
      const p1y = 2 / 3 * bListY[i] + 1 / 3 * bListY[i + 1];
      const p2x = 1 / 3 * bListX[i] + 2 / 3 * bListX[i + 1];
      const p2y = 1 / 3 * bListY[i] + 2 / 3 * bListY[i + 1];
      construction.push([p1x, p1y], [p2x, p2y], [bListX[i + 1], bListY[i + 1]]);
      d += this.point_(p1x, p1y);
      d += this.point_(p2x, p2y);
      if (i === sList.length - 2) {
        d += this.point_(bListX[i + 1], bListY[i + 1]);
      } else {
        d += this.point_(
            (bListX[i] + 4 * bListX[i + 1] + bListX[i + 2]) / 6,
            (bListY[i] + 4 * bListY[i + 1] + bListY[i + 2]) / 6);
      }
    }
    return [d, construction];
  }

  drawConstruction_(construction, indexTragetBPoint) {
    construction.forEach(([x, y], index) => {
      const isBPoint = index % 3 === 0;
      let cssClass = isBPoint ? 'b-point' : 'point';
      if (isBPoint && (index / 3) === indexTragetBPoint) {
        cssClass += ' b-target';
      }
      this.constructionGroup_.appendTemplate(
          SvgTemplates.point(
              x, y, cssClass, isBPoint ? 7 : 3,
              isBPoint ? {'data-index': String(index / 3)} : {}));
      if (index && index % 3 === 0) {
        const[x_, y_] = construction[index - 3];
        this.constructionGroup_.appendTemplate(SvgTemplates.line(x_, y_, x, y));
      } else if (index > 1 && index % 3 === 1) {
        const[x_, y_] = construction[index - 2];
        this.constructionGroup_.appendTemplate(SvgTemplates.line(x_, y_, x, y));
      }
    });
  }

  point_(x, y) { return ` ${x} ${y}`; }

  getId_() { return `point-${this.id_++}`; }

  clickHandler_(event) {
    if (event.button !== SvgBSplines.STANDARD_MOUSE_BUTTON) {
      return;
    }
    if (event.shiftKey) {
      this.ghostSelect_.startSelection(event);
    } else {
      const sPoint = event.target.closest('.input-point-group');
      const bPoint = event.target.closest('.b-point');
      if (sPoint) {
        this.dragManagerSPoints_.startDrag(event, sPoint);
      } else if (bPoint) {
        this.dragManagerBPoints_.startDrag(event, bPoint);
      } else if (this.selectedPoints_.length) {
        this.clearSelection();
      } else {
        this.addPoint(event.clientX, event.clientY);
      }
    }
  }

  selectPoints(rect) {
    this.selectedPoints_.length = 0;
    for (const point of this.sList_) {
      if (rect.left <= point.x && point.x <= rect.right &&
          rect.top <= point.y && point.y <= rect.bottom) {
        this.selectedPoints_.push(point);
        point.setSelected(true);
      } else {
        point.setSelected(false);
      }
    }
  }

  clearSelection() {
    this.selectPoints({
      left: 0,
      top: 0,
      width: 0,
      heigh: 0,
      right: 0,
      bottom: 0,
    });
  }

  get selectedPoints() { return this.selectedPoints_; }

  resizeHandler_() {
    this.resizeRequest_ = 0;
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;
    const scaleX = newWidth / this.width_;
    const scaleY = newHeight / this.height_;
    this.width_ = newWidth;
    this.height_ = newHeight;
    this.setSvgDimensions_();
    this.sList_.forEach(point => point.scalePosition(scaleX, scaleY));
    this.updatePath();
  }

  changeHandler_(event) {
    const target = event.target;
    switch (target.name) {
      case 'with-construction':
        this.isWithConstruction_ = target.checked;
        this.updatePath();
        break;
      case 'fill':
        document.body.classList.toggle('fill', target.checked);
        break;
    }
  }
}
