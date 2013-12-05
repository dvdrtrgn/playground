/*jslint es5:true, white:false */
/*globals Util, $data, d3 */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
var svg = Util.createSVG(),
    line, items, path;

function x(d) {
    return d.x;
}

function y(d) {
    return d.y;
}

line = d3.svg.line().x(x).y(y);

path = svg //
.selectAll('path') //
.data($data) //
.enter() //
.append('path') //
.attr('d', line);
