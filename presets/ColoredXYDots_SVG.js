var svg = createSVG();

// Associate each circle with a unique ID so that exit()
// and updates properly affect the correct element.
var circle = svg.selectAll("circle").data($data, ƒ ('id'));

circle.enter().append('circle') //
.attr('opacity', 0) //
.attr('class', ƒ ('sex')) //
.attr("cx", ƒ ('height')) //
.attr("cy", ƒ ('age'));

circle.transition().duration(300) //
.attr('opacity', 0.6) //
.attr('r', function (d) {
    return Math.pow(bmi(d), 3) / 15000
}) //
.attr("cx", ƒ ('height')) //
.attr("cy", ƒ ('age'));

circle.exit().transition().duration(300) //
.attr('opacity', 0) //
.remove();

// Only create the SVG once (changing $data causes all code to be re-run)

function createSVG() {
    var svg = d3.select('#playground').selectAll('svg').data([0]);
    svg.enter().append('svg').attr('viewBox', '150 10 30 35');
    return svg;
}

function bmi(datum) {
    return datum.weight / Math.pow(datum.height / 100, 2);
}
