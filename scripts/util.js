/*jslint es5:true, white:false */
/*globals window */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
var Util = (function (W) { // IIFE
    var name = 'Util',
        self, C, Df;

    self = {};
    C = W.console;

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

    function _binder() {}


    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    function _init() {
        if (self.inited(true)) {
            return null;
        }
        Df.inits();
        _binder();
        return self;
    }

    self.init = _init;
    self.runLater = _runLater;

    return self.init();

}(window));
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
