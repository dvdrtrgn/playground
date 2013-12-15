/*jslint es5:true, white:false */
/*globals Util, $data, d3, window */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
var C = window.console,
    D = {
    data: null,
    factor: 1.25,
    margin: 1.5,
    offset: - 300,
    ratio: 3,
    size: null,
    svg: Util.createSVG('-150 -150 300 300'),
    lnfn: d3.svg.line(),
    arr: [0, 0],
    dstr: '',
    unit: 100,
    path: null,
    last: {
        path: null,
        point: null,
    },
},
    W = window;

D.mid = Util.midpoint(D.svg);
D.size = D.unit * D.ratio;


W.D = D;

function reCalc(arr) {
    return [arr[0] - D.mid[0], arr[1] - D.mid[1]];
}

function draw(pairs, cls) {
    cls = cls || 't2';
    D.path = D.svg.append('path') // new line
    .attr('class', cls) //
    .attr('d', D.lnfn(pairs));
}

function store(lines, point) {
    D.last.lines = lines;
    D.last.point = point;
}
// append a new line path
D.app = function (arr1, arr2, cls) {

    if (typeof arr2 !== 'object') {
        cls = arr2;
        arr2 = arr1;
        arr1 = D.last.point || [0, 0];
    }

    cls = cls || 't1';

    if (arr1 && arr2) {
        D.data = [arr1, arr2];
    }

    draw(D.data, cls);
    store(D.path, arr2);
};
// add points to last path
D.addstr = function (arr) {
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
    D.addstr([c.layerX - D.offset, c.layerY]);
    D.path.attr('class', 't2');
};
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

D.svg.call(d3.behavior.drag().on('dragstart', D.add_h));

D.svg = D.svg.append('g');
D.svg.attr('transform', 'scale(1.00) translate(' + D.offset + ', 0)');

function drawAxes() {
    var F = D.ratio,
        U = D.unit;
    // center
    D.app([0, - U], [0, U]);
    D.app([-U, 0], [U, 0]);
    // bounds
    D.app([-F * U, - U], [+F * U, - U]);
    D.app([+F * U, + U]);
    D.app([-F * U, + U]);
    D.app([-F * U, - U]);
}

drawAxes();

C.log(D);
// etc
D.app([9, 9], [33, 33]);
