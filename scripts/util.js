/*jslint es5:true, white:false, evil:true */
/*globals d3, escape, unescape, window */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
var Util = (function (W) { // IIFE
    var name = 'Util',
        self, C, D, Df;

    self = {};
    C = W.console;
    D = W.document;

    Df = { // DEFAULTS
        abc: true,
        _false: function () {
            return false;
        },
        _true: function () {
            return true;
        },
        __: function () {
            return Df;
        },
        _: function () {
            return self;
        },
        inits: function () {
            this._().inited = this._true;
            // ...
            if (W.debug > 0) {
                W['_' + name] = this;
                C.debug(name, 'Df.inits\n', this);
            }
        }
    };
    self._ = Df.__;
    self.inited = Df._false;

    /// INTERNAL
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    // Runs the callback unless interrupted by another call within the delay

    function _runLater(callback, delay) {
        var timer;

        return function () {
            W.clearTimeout(timer);
            timer = W.setTimeout(callback, delay);
        };
    }
    function _div(sel) {
        if (sel || !Df.D) {
            Df.D = d3.select(sel || '#playground');
        }
        return Df.D;
    }
    function _mid(ele) {
        var w, h;
        w = parseFloat(ele.style('width')) / 2;
        h = parseFloat(ele.style('height')) / 2;
        return [w, h];
    }
    function _box(ele) {
        var str = ele.attr('viewBox'),
            arr = str.split(' ');

        C.log(arr.w = (arr[2] - arr[0]) * 2);
        C.log(arr.h = (arr[3] - arr[1]) *.7);

        ele.attr('width', arr.w / 1).attr('height', arr.h / 1);
        return ele;
    }
    function _createSVG(view, bounded) {
        view = view || '0 0 1000 1000';

        var svg = _div().selectAll('svg').data([0]);
        svg.enter().append('svg').attr('viewBox', view);
        if (bounded) {
            _box(svg);
        }
        return svg;
    }

    function _linear() {
        return d3.svg.line()
        .x(function(d){return d[0]})
        .y(function(d){return d[1]})
        .interpolate("linear");
    }

    function _rect() {
        return _div().selectAll('svg').append('rect') //
        .attr('width', 30).attr('height',30) //
        .attr('x',0).attr('y',0) //
        .style('fill','steelblue');
    }

    function _evl(str) {
        return eval(str);
    }

    function _esc(str) {
        return escape(str);
    }

    function _unesc(str) {
        return unescape(str);
    }

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    // d3.js helpers
    // Create a function that returns a particular property of its parameter.
    // If that property is a function, invoke it (and pass optional params).

    function _f(name) {
        var v, params;

        params = Array.prototype.slice.call(arguments, 1);

        return function (o) {
            return (typeof(v = o[name]) === 'function' ? v.apply(o, params) : v);
        };
    }

    function _i(d) {
        return d; // Return the first argument passed in
    }

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    function _init() {
        if (self.inited(true)) {
            return null;
        }
        Df.inits();
        return self;
    }

    self.init = _init;
    self.createSVG = _createSVG;
    self.esc = _esc;
    self.evl = _evl;
    self.line = _linear();
    self.midpoint = _mid;
    self.play = _div;
    self.rect = _rect;
    self.runLater = _runLater;
    self.unesc = _unesc;
    W.F = _f;
    W.I = _i;

    return self.init();

}(window));
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*

    function _createSVG2(where, attr) {
        where = where || '#playground';

        var s = D.createElement('svg');
        D.body.appendChild(s);
        s.setAttribute('viewBox', '0 0 100 100');
        return [s];
    }

*/
