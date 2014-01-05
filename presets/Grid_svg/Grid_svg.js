/*jslint es5:true, white:false */
/*globals d3 */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
var gap = 50,
    height = 333,
    width = 666,
    ground, group;


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
