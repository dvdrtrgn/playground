/*jslint es5:true, white:false */
/*globals Util, $data, d3 */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
var svg = Util.createSVG('0 0 300 200'),
    path, C = console;

// LINE 1
svg.append('path').attr('class', 't1') //
.attr('d', 'M0,60 L50,110 L90,70 L140,100');

// LINE 2
path = d3.svg.line() //
.x(function (d) {
    return (parseFloat(d.split(' ')[0]) - 50);
}).y(function (d) {
    return (parseFloat(d.split(' ')[1]) + 50);
});

svg.append('path').attr('class', 't2') //
.attr('d', path($data));

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
// take any coordinate and move/draw to the point
