/*jslint es5:true, white:false */
/*globals window */
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

    function _createSVG (view) {
        view = view || '0 0 100 100';

        var svg = d3.select('#playground').selectAll('svg').data([0]);

        return svg.enter().append('svg').attr('viewBox', view);
    };

    function _createSVG2(where) {
        where = where || '#playground';

        var s = D.createElement('svg')
        D.body.appendChild(s);
        s.setAttribute('viewBox', '0 0 100 100');
        return [s];
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
    self.runLater = _runLater;
    self.createSVG = _createSVG;

    return self.init();

}(window));
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
