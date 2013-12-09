/*jslint es5:true, white:false */
/*globals Util, $data, d3 */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
var C = console, W = window;

W.svg = Util.createSVG('0 0 200 200');
function midpoint(ele) {
    var w, h;
    w = parseInt(ele.style('width')) / 2;
    h = parseInt(ele.style('height')) / 2;
    return [w, h];
}

function reCalc(arr) {
    return [arr[0] - W.mid[0], arr[1] - W.mid[1]];
}

function draw() {
    W.path = svg.append('path') //
    .attr('class', 't2') //
    .attr('d', W.calc($data));
}

// LINE 1
W.svg.append('path').attr('class', 't1') //
.attr('d', 'M0,60 L50,110 L90,70 L140,100');

// LINE 2
W.calc = d3.svg.line();
W.mid = midpoint(W.svg);
W.arr = [0,0];
W.foo = '';


W.add = function (arr) {
    if (arr) {
        $data.push(arr);
        W.arr = arr;
    }
    draw();
}

W.app = function (arr) {
    W.foo = W.foo || W.path.attr('d');
    if (arr) {
        arr = reCalc(arr);
        W.foo = W.foo + 'L' + arr;
        W.path.attr('d', W.foo + 'z');
    }
}

W.svg.call(d3.behavior.drag() //
    .on('dragstart', function () {
        var c = d3.event.sourceEvent;
        W.app([c.x, c.y]);
        console.log(c);
    })
    .on('drag', function () {
        var c = d3.event;
        W.app([c.x, c.y]);
    })
);

function drawAxes() {
    W.add([   0,-100]);
    W.add([   0, 100]);
    W.add([-100,   0]);
    W.add([ 100,   0]);
}

drawAxes();

//
//
//
// line = d3.svg.line().x(x).y(y);
//
// path = svg //
// .selectAll('path') //
// .data($data) //
// .enter() //
// .append('path') //
// .attr('d', line);
//
// take any coordinate and move/draw to the point
