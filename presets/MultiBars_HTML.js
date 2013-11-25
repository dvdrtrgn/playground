var a = d3.select('#playground').selectAll('article').data($data);
a.enter().append('article').append('h2').text(ƒ('title'));

var bars = a.selectAll('div.bar').data(ƒ('values'));
bars.enter().append('div').attr('class','bar');
bars.exit().remove();
bars.style('height',pxScale(2));

function pxScale(factor){
  return function(d){ return d*factor+'px' }
}