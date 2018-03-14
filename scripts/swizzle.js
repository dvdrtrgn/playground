/*jslint es5:true, white:false */
/*globals Math */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
var swizzle = (function (W) {
  var C;

  C = W.console;

  function self(x) {
    self.array(x);
  }

  self.array = function (a) {
    var i, v;

    for (i = a.length; i--;) {
      v = a[i];

      if (typeof v === 'number') {
        a[i] = self.number(v);
      } else if (v instanceof Array) {
        self.array(v);
      } else if (v instanceof Object) {
        self.object(v);
      }
    }
  };
  self.number = function (n) {
    return (n += (Math.random() - 0.5) * n / 5);
  };
  self.object = function (o) {
    var k, v;

    for (k in o) {
      if (o.hasOwnProperty(k)) {
        v = o[k];

        if (typeof v === 'number' && k !== 'id') {
          o[k] = self.number(v);
        } else if (v instanceof Array) {
          self.array(v);
        } else if (v instanceof Object) {
          self.object(v);
        }
      }
    }
  };
  return self;

}(window));

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
swizzle;
