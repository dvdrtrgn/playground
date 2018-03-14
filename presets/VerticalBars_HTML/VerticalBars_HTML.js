/*jslint es5:true, white:false */
/*globals F, $data, d3 */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
var transitionDurationMS = 200;
var divs = d3.select('#playground').selectAll('div').data($data);

divs.enter().append('div') //
  .attr('class', 'bar') //
  .style('opacity', 0);

divs.exit().transition().duration(transitionDurationMS) //
  .style('opacity', 0) //
  .remove();

divs.transition().duration(transitionDurationMS) //
  .style('opacity', 1) //
  .style('height', function (d) {
    return d * 2 + 'px';
  }) //
  .text(F('toFixed'));
