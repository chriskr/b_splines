'use strict';

class Shapes {
  static get SHAPE_KEYS() {
    return 'shape-keys';
  }

  static getStorageKey(key) {
    return `shape-${key}`;
  }

  static extractKey(key) {
    return Number.parseInt(key.split('-')[1]);
  }

  static get shapes() {
    return [
      {
        'with-construction': false,
        'fill': true,
        'width': 1178,
        'height': 726,
        'points': [
          [164, 486], [227, 546], [258, 567], [595, 374], [676, 457],
          [719, 439], [755, 481], [783, 441], [879, 494], [1069, 236],
          [815, 193], [644, 216], [642, 181], [587, 179], [618, 251],
          [554, 254], [545, 215], [264, 213], [208, 360], [882, 261],
          [896, 322], [163, 385], [163, 485]
        ]
      },
      {
        'with-construction': false,
        'fill': true,
        'width': 1236,
        'height': 765,
        'points': [
          [819, 588],  [477, 577], [432, 458],  [589, 452],  [571, 399],
          [620, 367],  [666, 401], [592, 494],  [652, 528],  [702, 492],
          [659, 444],  [883, 435], [1057, 340], [954, 165],  [727, 155],
          [711, 329],  [540, 236], [221, 307],  [140, 417],  [246, 423],
          [201, 391],  [232, 345], [286, 371],  [265, 417],  [340, 389],
          [504, 280],  [656, 323], [790, 345],  [840, 224],  [963, 263],
          [890, 390],  [537, 332], [302, 464],  [449, 591],  [815, 615],
          [918, 633],  [839, 655], [938, 687],  [1032, 654], [956, 626],
          [1017, 597], [953, 570], [1037, 536], [942, 509],  [958, 545],
          [884, 539],  [917, 509], [823, 530],  [890, 568],  [821, 586]
        ]
      },
      {
        'with-construction': false,
        'fill': true,
        'width': 1178,
        'height': 685,
        'points': [
          [348, 501], [527, 560], [626, 569], [487, 512], [395, 429],
          [534, 507], [640, 511], [594, 482], [555, 415], [609, 457],
          [680, 397], [713, 181], [561, 360], [389, 321], [353, 181],
          [465, 222], [560, 215], [573, 163], [509, 194], [553, 138],
          [597, 217], [401, 299], [559, 321], [620, 219], [697, 129],
          [830, 419], [793, 427], [739, 367], [796, 507], [849, 466],
          [910, 490], [962, 587], [857, 509], [835, 590], [612, 612],
          [325, 522], [83, 404],  [351, 501]
        ]
      },
      {
        'with-construction': false,
        'fill': true,
        'width': 1236,
        'height': 684,
        'points': [
          [135, 392], [190, 213], [322, 297],  [356, 363],  [379, 354],
          [354, 323], [428, 312], [495, 382],  [617, 310],  [823, 111],
          [788, 250], [874, 310], [1040, 222], [1102, 431], [948, 482],
          [892, 447], [957, 426], [889, 398],  [851, 430],  [864, 455],
          [825, 479], [737, 487], [692, 434],  [638, 426],  [702, 323],
          [724, 257], [594, 423], [478, 435],  [384, 482],  [281, 483],
          [239, 474], [260, 303], [210, 264],  [221, 479],  [176, 471],
          [110, 503], [124, 449], [135, 392]
        ]
      },
      {
        'with-construction': false,
        'fill': true,
        'width': 1236,
        'height': 684,
        'points': [
          [404, 584], [328, 585], [343, 559],  [316, 533],  [294, 561],
          [308, 582], [273, 583], [260, 574],  [273, 530],  [275, 488],
          [217, 435], [139, 269], [290, 242],  [336, 250],  [346, 302],
          [323, 318], [231, 379], [401, 505],  [491, 326],  [395, 284],
          [377, 266], [366, 187], [365, 154],  [445, 151],  [568, 192],
          [524, 363], [553, 411], [619, 406],  [629, 327],  [618, 258],
          [662, 244], [806, 284], [812, 398],  [799, 443],  [780, 442],
          [763, 440], [766, 406], [779, 309],  [757, 298],  [707, 317],
          [712, 338], [738, 363], [752, 385],  [706, 411],  [636, 434],
          [586, 440], [556, 443], [554, 465],  [611, 481],  [850, 480],
          [962, 358], [955, 203], [1016, 277], [1067, 396], [1040, 565],
          [740, 547], [541, 489], [499, 480],  [487, 560],  [477, 584],
          [435, 584]
        ]
      },
    ];
  }

  constructor(svgBSplines) {
    this.svgBSplines_ = svgBSplines;
    this.shapeList_ =
        document.body.appendTemplate(Shapes.Templates.shapeList());
    this.shapeList_.addEventListener(
        'click', event => this.handleClick_(event));
    this.shapes_ = this.updateShapeList_();
    Contextmenu.getInstance().addEntry({
      label: 'Delete shape',
      showIf: event => this.getStorageKeyFromEvent_(event) !== '',
      callback: event => this.deleteStorageKey_(event),
    });
  }

  toggleShowShapeList() {
    document.body.classList.toggle('show-shapes');
  }

  storeShape() {
    const data = this.svgBSplines_.export();
    const keys = this.getShapeKeys_();
    let newKey = 1;
    while (keys.includes(newKey)) {
      newKey++;
    }
    keys.push(newKey);
    data.storageKey = Shapes.getStorageKey(newKey);
    this.storeShapeKeys_(keys);
    this.storeShape_(data);
    this.shapes_ = this.updateShapeList_();
  }

  getShapeKeys_() {
    return window.localStorage.getJSONItem(Shapes.SHAPE_KEYS, []);
  }

  storeShapeKeys_(keys) {
    window.localStorage.setJSONItem(Shapes.SHAPE_KEYS, keys);
  }

  getShape_(key) {
    return window.localStorage.getJSONItem(Shapes.getStorageKey(key));
  }

  storeShape_(data) {
    window.localStorage.setJSONItem(data.storageKey, data);
  }

  updateShapeList_() {
    const list = Shapes.shapes.slice();
    list.push(...this.getShapeKeys_().map(key => this.getShape_(key)));
    this.shapeList_.cleanAppendTemplate(list.map(
        shape => Shapes.Templates.shapeItem(
            this.svgBSplines_.getSvgTemplate(shape), shape.storageKey)));
    return list;
  }

  getStorageKeyFromEvent_(event) {
    const target = event.target.closest('[data-storage-key]');
    return target !== null ? target.dataset.storageKey : '';
  }

  deleteStorageKey_(event) {
    const key = this.getStorageKeyFromEvent_(event);
    if (key !== '') {
      window.localStorage.removeItem(key);
      const keys = this.getShapeKeys_();
      const index = keys.indexOf(Shapes.extractKey(key))
      keys.splice(index, 1);
      this.storeShapeKeys_(keys);
      this.shapes_ = this.updateShapeList_();
    }
  }

  handleClick_(event) {
    const li = event.target.closest('li');
    if (li) {
      const index = Array.from(li.parentNode.children).indexOf(li);
      this.svgBSplines_.load(this.shapes_[index]);
    }
  }
}

Shapes.Templates = class {
  static shapeList() {
    return ['ul', {'id': 'shapes'}];
  }

  static shapeItem(svgTemplate, storageKey) {
    return ['li', {'data-storage-key': storageKey}, svgTemplate];
  }
}
