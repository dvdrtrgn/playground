/*jslint es5:true, white:false */
/*globals $data:true, F, Util, console, d3 */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

// Only create the SVG once (changing $data causes all code to be re-run)
var svg = Util.createSVG('150 10 30 35');

function bmi(datum) {
    return datum.weight / Math.pow(datum.height / 100, 2);
}

// Associate each circle with a unique ID so that exit()
// and updates properly affect the correct element.
var circle = svg.selectAll("circle").data($data, F('id'));

circle.enter().append('circle') //
.attr('class', F('sex')) //
.attr("cx", F('height')) //
.attr("cy", F('age'));

circle.transition().duration(300) //
.attr("cx", F('height')) //
.attr("cy", F('age')) //
.attr('r', function (d) {
    return Math.pow(bmi(d), 3) / 15000;
});

circle.exit().transition().duration(300) //
.attr('opacity', 0) //
.remove();
