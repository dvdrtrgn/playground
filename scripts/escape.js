/*jslint es5:true, white:false */
/*globals window */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
var Escape = (function (W) { // IIFE
  var name = 'Escape',
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

  var escapeHash = {
    _: function (input) {
      var ret = escapeHash[input],
        code;

      if (!ret) {
        if (input.length - 1) {
          ret = String.fromCharCode(input.substring(input.length - 3 ? 2 : 1));
        } else {
          code = input.charCodeAt(0);
          ret = code < 256 //
          ? "%" + (0 + code.toString(16)).slice(-2).toUpperCase() //
          : "%u" + ("000" + code.toString(16)).slice(-4).toUpperCase();
        }
        escapeHash[ret] = input;
        escapeHash[input] = ret;
      }
      return ret;
    }
  };

  W.escape = (W.escape ||
  function (str) {
    return str.replace(/[^\w @\*\-\+\.\/]/g, function (aChar) {
      return escapeHash._(aChar);
    });
  });
  W.unescape = (W.unescape ||
  function (str) {
    return str.replace(/%(u[\da-f]{4}|[\da-f]{2})/gi, function (seq) {
      return escapeHash._(seq);
    });
  });

  self.test = function () {
    var rows, tests, all = [];

    rows = "\"@*/+~!#$&()=:,;?'".split(/(?=.)/);
    tests = [
      'encodeURIComponent',
      'escape',
      'encodeURI',
      ];
    all.push('changes? ' + tests.join('...'));

    all = all.concat(rows.map(function (e, i) {
      var arr = ['\n', e];
      arr.push(W[tests[0]](e) === e ? ' ' : e);
      arr.push(W[tests[1]](e) === e ? ' ' : e);
      arr.push(W[tests[2]](e) === e ? ' ' : e);
      return arr.join(' ');
    }));

    return all;
  };

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  function _init() {
    if (self.inited(true)) {
      return null;
    }
    Df.inits();
    return self;
  }

  self.init = _init;

  return self.init();

}(window));
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
