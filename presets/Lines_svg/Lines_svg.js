/*jslint es5:true, white:false */
/*globals Util, $data, d3 */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
var C = console,
    D = {},
    W = window;

W.D = D;

function midpoint(ele) {
    var w, h;
    w = parseInt(ele.style('width')) / 2;
    h = parseInt(ele.style('height')) / 2;
    return [w, h];
}
function reCalc(arr) {
    return [arr[0] - D.mid[0], arr[1] - D.mid[1]];
}
function draw(cls) {
    cls = cls || 't2';
    D.path = D.svg.append('path') //
    .attr('class', cls) //
    .attr('d', D.calc($data));
}
// append a new line path
D.app = function (arr1, arr2, cls) {
    cls = cls || 't1';
    if (arr1 && arr2) {
        $data = [arr1, arr2];
    }
    draw(cls);
};
// add points to last path
D.add = function (arr) {
    D.dstr = (D.dstr || D.path.attr('d'));
    if (arr) {
        arr = reCalc(arr);
        D.dstr += ('L' + arr);
        D.path.attr('d', D.dstr);
    }
};
D.adds = function () {
    var c = d3.event.sourceEvent;
    D.add([c.x, c.y]);
    D.path.attr('class', 't2') //
};
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

D.svg = Util.createSVG('-100 -100 200 200');

D.calc = d3.svg.line();
D.mid = midpoint(D.svg);
D.arr = [0,0];
D.dstr = '';

D.svg.call(d3.behavior.drag().on('dragstart', D.adds));

function drawAxes() {
    D.app([0,-100], [0,100]);
    D.app([-100,0], [100,0]);
    D.app([0,0], [0,0]);
}

drawAxes();

console.log(D);
