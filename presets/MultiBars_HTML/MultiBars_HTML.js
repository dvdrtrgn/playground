/*jslint es5:true, white:false */
/*globals F, $data, d3 */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
var a = d3.select('#playground').selectAll('article').data($data);

function pxScale(factor) {
    return function (d) {
        return d * factor + 'px';
    };
}

a.enter().append('article').append('h2').text(F('title'));

var bars = a.selectAll('div.bar').data(F('values'));

bars.enter().append('div').attr('class', 'bar');
bars.exit().remove();
bars.style('height', pxScale(2));
