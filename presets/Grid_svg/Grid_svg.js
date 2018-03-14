/*jslint es5:true, white:false */
/*globals d3 */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
var gap = 50,
  height = 333,
  width = 666,
  ground, group;

/*
// density = 10, // number of lines
// scale = 4; //
    factor n lines x and y
    or
    factor approx n distance between lines
    tell me i have a boundary of 80 and 60
    and a density of 15
    how many 15s in 80?
    5.33333 rounded 5
    80 / 5 = 16
    mcrib of (+1) 16
*/

ground = d3.select('#playground') //
  .append('svg').attr({
    'width': width,
    'height': height,
  });

function nugroup(x, y) {
  x = x || 10;
  y = y || 10;
  group = ground.append('svg:g').attr('transform', 'translate(' + x + ', ' + y + ')');
}

function line(x1, y1, x2, y2, clas) {
  group.append('svg:line').attr({
    x1: (x1 || 1),
    y1: (y1 || 1),
    x2: (x2 || 1),
    y2: (y2 || 1),
  }).attr('class', clas);
}

function makeGrid(inc, wi, hi) {
  var i;

  hi = (hi || wi); // go square?
  nugroup(44, 22);

  for (i = 0; i <= hi; i += inc) { // horizontal lines
    line(0, i, wi, i, 'horz');
  }
  for (i = 0; i <= wi; i += inc) { // vertical lines
    line(i, 0, i, hi, 'vert');
  }
}

makeGrid(50, 300, 200);


function makeData(tot, fac) {
  tot = (tot || 20) + 1;
  fac = fac || 10;
  var arr = [],
    i, m, tmp;

  for (i = 1; i < tot; i++) {
    m = i * fac;
    tmp = [0, tot * fac - m, m, 0];
    line.apply(this, tmp);
    arr.push(tmp);
  }
  return arr;
}

console.debug(makeData());

function makePlot(x, y) {
  if (!y && typeof x === 'object') {
    x.each(function(a) {
      makePlot(a[0], a[1]);
    });
  } else {
    line.apply(this, [x, y, x + 1, y + 1]);
  }
}
