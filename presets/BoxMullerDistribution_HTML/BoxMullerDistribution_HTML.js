/*jslint es5:true, white:false */
/*globals $data, d3 */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
var divs = d3.select("#playground") //
.selectAll("div").data($data);

divs.enter().append("div") //
.attr("class", "bar");

divs.exit().remove();

divs.style("height", function (d) {
    return d.ct + "px";
}).attr('title', function (d) {
    return d.n + "×" + d.ct;
});
