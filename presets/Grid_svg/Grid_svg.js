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

/*
    Lines use 4 attributes (x1, y1, x2, and y2)
    You also need to specify the stroke
*/
for (j = gap; j <= width - gap; j += gap) { // horizontal lines
    lineGraph.append('svg:line').attr({
        x1: gap,
        y1: j,
        x2: width - gap,
        y2: j,
    }).style({
        stroke: 'steelblue',
        'stroke-width': j / width * 10,
        opacity: 1- j / width,
    });
}

for (j = gap; j <= height - gap; j += gap) { // vertical lines
    lineGraph.append('svg:line').attr({
        x1: j,
        y1: gap,
        x2: j,
        y2: height - gap,
    }).style({
        stroke: 'steelblue',
        'stroke-width': j / height * 10,
        opacity: 1- j / height,
    });
}
