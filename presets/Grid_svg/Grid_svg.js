/*jslint es5:true, white:false */
/*globals d3 */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
var gap = 50,
    height = 400,
    width = 400,
    j = NaN,
    lineGraph;

lineGraph = d3.select('#playground') //
.append('svg').attr({
    'width': width,
    'height': height,
});

function line(x1, y1, x2, y2, clas) {
    return lineGraph.append('svg:line').attr({
        x1: (x1 || 1),
        y1: (y1 || 1),
        x2: (x2 || 1),
        y2: (y2 || 1),
    }).attr('class', clas);
}

for (j = gap; j <= width - gap; j += gap) { // horizontal lines
    line(gap, j, (width - gap), j, 'typeA');
}

for (j = gap; j <= height - gap; j += gap) { // vertical lines
    line(j, gap, j, (height - gap), 'typeB');
}
