/*jslint es5:true, white:false */
/*globals window */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

function convertToAbsolute(path) {
  var has, seg, segs = path.pathSegList,
    x, x0, x1, x2, y, y0, y1, y2, i, len, c;

  has = function (nom, obj) {
    return obj.hasOwnProperty(nom);
  };

  for (x = 0, y = 0, i = 0, len = segs.numberOfItems; i < len; ++i) {
    seg = segs.getItem(i);
    c = seg.pathSegTypeAsLetter;

    if (/[MLHVCSQTA]/.test(c)) {
      if (seg.has('x')) {
        x = seg.x;
      }
      if (seg.has('y')) {
        y = seg.y;
      }
    } else {
      if (seg.has('x1')) {
        x1 = x + seg.x1;
      }
      if (seg.has('x2')) {
        x2 = x + seg.x2;
      }
      if (seg.has('y1')) {
        y1 = y + seg.y1;
      }
      if (seg.has('y2')) {
        y2 = y + seg.y2;
      }
      if (seg.has('x')) {
        x += seg.x;
      }
      if (seg.has('y')) {
        y += seg.y;
      }
      switch (c) {
      case 'm':
        segs.replaceItem(path.createSVGPathSegMovetoAbs(x, y), i);
        break;
      case 'l':
        segs.replaceItem(path.createSVGPathSegLinetoAbs(x, y), i);
        break;
      case 'h':
        segs.replaceItem(path.createSVGPathSegLinetoHorizontalAbs(x), i);
        break;
      case 'v':
        segs.replaceItem(path.createSVGPathSegLinetoVerticalAbs(y), i);
        break;
      case 'c':
        segs.replaceItem(path.createSVGPathSegCurvetoCubicAbs(x, y, x1, y1, x2, y2), i);
        break;
      case 's':
        segs.replaceItem(path.createSVGPathSegCurvetoCubicSmoothAbs(x, y, x2, y2), i);
        break;
      case 'q':
        segs.replaceItem(path.createSVGPathSegCurvetoQuadraticAbs(x, y, x1, y1), i);
        break;
      case 't':
        segs.replaceItem(path.createSVGPathSegCurvetoQuadraticSmoothAbs(x, y), i);
        break;
      case 'a':
        segs.replaceItem(path.createSVGPathSegArcAbs(x, y, seg.r1, seg.r2, seg.angle, seg.largeArcFlag, seg.sweepFlag), i);
        break;
      case 'z':
      case 'Z':
        x = x0;
        y = y0;
        break;
      }
    }

    if (c === 'M' || c === 'm') {
      x0 = x;
      y0 = y;
    }
  }
}
