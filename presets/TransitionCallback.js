var divs = d3.select("#playground").selectAll("div").data($data);

divs.enter().append('div');

divs.transition().duration(2000) //
.text(Math.round) //
.style('width', dataAsPx) //
.style('line-height', dataAsPx) //
.each('start', function (d) {
    this.className = 'animating'
}) //
.each('end', function (d) {
    this.className = ''
});

function dataAsPx(d) {
    return d + "px";
}
