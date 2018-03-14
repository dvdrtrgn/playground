/*jslint es5:true, white:false */
/*globals $data, d3 */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
var divs = d3.select('#playground').selectAll('div').data($data);

function dataAsPx(d) {
  return d + 'px';
}

divs.enter().append('div');

divs.transition().duration(2000) //
  .text(Math.round) //
  .style('width', dataAsPx) //
  .style('line-height', dataAsPx) //
  .each('start', function (d) {
    this.className = 'animating';
  }) //
  .each('end', function (d) {
    this.className = '';
  });
