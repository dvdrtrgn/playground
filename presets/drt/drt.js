/*jslint es5:true, white:false */
/*globals $data:true, Util, console, d3 */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

$data = $data.map(function (d) {
    return d | 0; // clean up swizzle
});

var svg = Util.createSVG(),
    items;

items = svg.selectAll("g").data($data) //
.enter().append("g") //
.attr("transform", function (d, i) {
    return ['translate(', 66 * (i - 1), ',', d / 3, ')'].join('');
});

items.append('circle') //
.attr("r", function (d) {
    return d / 9;
});

items.append('text').text(String);
