/*jslint es5:true, white:false */
/*globals F, $data, d3 */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

function pxScale(factor) {
    return function (d) {
        return d * factor + 'px';
    };
}

var play = d3.select('#playground'),
    art, bars;

art = play.selectAll('article').data($data);

art.enter() //
.append('article').append('h2')
.text(F('title'));

bars = art.selectAll('div.bar').data(F('values'));

bars.enter()
.append('div')
.attr('class', 'bar')
.style('height', pxScale(3));

bars.exit().remove();

