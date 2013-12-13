/*jslint es5:true, white:false */
/*globals Util, $data, d3 */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
var C = console,
    D = {
        factor: 1.25,
        margin: 1.5,
        offset: -300,
        ratio: 3,
        size: null,
        unit: 100,
    },
    W = window;

W.D = D;
D.size = D.unit * D.ratio;

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
D.add_h = function () {
    var c = d3.event.sourceEvent;
    // C.debug(c);
    D.add([c.layerX - D.offset, c.layerY]);
    D.path.attr('class', 't2') //
};
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

D.svg = Util.createSVG('-150 -150 300 300');

D.calc = d3.svg.line();
D.mid = Util.midpoint(D.svg);
D.arr = [0,0];
D.dstr = '';

D.svg.call(d3.behavior.drag().on('dragstart', D.add_h));

D.svg = D.svg.append('g');
D.svg.attr('transform','scale(1.00) translate(' + D.offset + ', 0)');

function drawAxes() {
    var F = D.ratio,
        U = D.unit;
    D.app([   0 , -U],[   0 ,  U]);
    D.app([  -U ,  0],[   U ,  0]);
    D.app([-F*U , -U],[+F*U , -U]);
    D.app([+F*U , -U],[+F*U , +U]);
    D.app([+F*U , +U],[-F*U , +U]);
    D.app([-F*U , +U],[-F*U , -U]);
    D.app([   0 ,  0],[   0 ,  0]);
}

drawAxes();

console.log(D);
