// Select the DIV container "D3line" then
// add an SVG element to it

var width = 400;
var height = 400;

var lineGraph = d3.select("#playground")
    .append("svg:svg")
    .attr("width", width)
    .attr("height", height);

// To draw a line use the "svg:line" element.
// "svg:line" element requires 4 attributes (x1, y1, x2, and y2)
// (x1,y1) are coordinates of the starting point.
// (x2,y2) are coordinates of the end point.
// You also need to specify the stroke color.

// Using for loop to draw multiple horizontal lines
for (var j=25; j <= width-25; j=j+25) {
    lineGraph.append("svg:line")
        .attr("x1", 25)
        .attr("y1", j)
        .attr("x2", width-25)
        .attr("y2", j)
        .style("stroke", "rgb(6,120,155)")
        .style("stroke-width", 2);
};

// Using for loop to draw multiple vertical lines
for (var j=25; j <= height-25; j=j+25) {
    lineGraph.append("svg:line")
        .attr("x1", j)
        .attr("y1", 25)
        .attr("x2", j)
        .attr("y2", height-25)
        .style("stroke", "rgb(6,120,155)")
        .style("stroke-width", 2);
};
