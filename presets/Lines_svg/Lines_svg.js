/*jslint es5:true, white:false */
/*globals Util, $data, d3 */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
var svg = Util.createSVG('0 0 300 200'),
    line, items, path;

function x(d) {
    return d.x;
}

function y(d) {
    return d.y;
}

svg.append('path').attr('d','M 0 60 L 50 110 L 90 70 L 140 100 z');

line = d3.svg.line()
.x(function(d){return d.x + -50;})
.y(function(d){return d.y + 50;});

svg.append('path').attr('d', line($data) + 'z');

//
//
//
// line = d3.svg.line().x(x).y(y);
//
// path = svg //
// .selectAll('path') //
// .data($data) //
// .enter() //
// .append('path') //
// .attr('d', line);
//
