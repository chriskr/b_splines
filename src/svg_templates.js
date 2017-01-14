'use strict';

class SvgTemplates{
  static svg() {
    return [
      'svg:svg',
      ['svg:g', {id: 'construction'}],
    ];
  }

  static path() {
    return [
      'svg:path',
      {class: 'b-spline'},
    ];
  }

  static point(x, y, cssClass = 'point', r = 3, attrs = {}) {
    return [
      'svg:circle', Object.assign({
        cx: `${x}`,
        cy: `${y}`,
        r: `${r}`,
        class: cssClass,
      }, attrs),
    ];
  }

  static line(x1, y1, x2, y2) {
    return [
      'svg:line',
      {
        x1: `${x1}`,
        y1: `${y1}`,
        x2: `${x2}`,
        y2: `${y2}`,
        class: 'line',
      },
    ];
  }

  static inputPoint({x, y, id}) {
    return [
      'svg:g',
      {
        transform: `translate(${(x | 0) + 0.5}, ${(y | 0) + 0.5})`,
        id: id,
        class: 'input-point-group',
      },
      [
        'svg:circle',
        {
          cx: '0',
          cy: '0',
          r: '7',
          id: id,
          class: 'input-point',
        },
      ],
      [
        'svg:line',
        {
          x1: '-14',
          y1: '0',
          x2: '14',
          y2: '0',
          class: 'input-point-line',
        },
      ],
      [
        'svg:line',
        {
          x1: '0',
          y1: '-14',
          x2: '0',
          y2: '14',
          class: 'input-point-line',
        },
      ],
    ];
  }

  static thumbnail(width, height, path) {
    return [
      'svg:svg', {viewBox: `0 0 ${width} ${height}`, class: 'thumbnail'},
      [
        'svg:path',
        {d: path},
      ]
    ];
  }
}