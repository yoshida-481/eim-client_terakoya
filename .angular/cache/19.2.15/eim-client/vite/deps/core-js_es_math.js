import {
  require_es_math_to_string_tag
} from "./chunk-DI6HPGHT.js";
import {
  require_math_log10
} from "./chunk-4WVC67J7.js";
import "./chunk-YD4VTJX4.js";
import {
  require_path
} from "./chunk-N7EDGOTA.js";
import {
  require_export,
  require_fails,
  require_math_trunc
} from "./chunk-SYAKHIZ5.js";
import {
  __commonJS
} from "./chunk-F52B2RLG.js";

// node_modules/core-js/internals/math-log1p.js
var require_math_log1p = __commonJS({
  "node_modules/core-js/internals/math-log1p.js"(exports, module) {
    "use strict";
    var log = Math.log;
    module.exports = Math.log1p || function log1p(x) {
      var n = +x;
      return n > -1e-8 && n < 1e-8 ? n - n * n / 2 : log(1 + n);
    };
  }
});

// node_modules/core-js/modules/es.math.acosh.js
var require_es_math_acosh = __commonJS({
  "node_modules/core-js/modules/es.math.acosh.js"() {
    "use strict";
    var $ = require_export();
    var log1p = require_math_log1p();
    var $acosh = Math.acosh;
    var log = Math.log;
    var sqrt = Math.sqrt;
    var LN2 = Math.LN2;
    var FORCED = !$acosh || Math.floor($acosh(Number.MAX_VALUE)) !== 710 || $acosh(Infinity) !== Infinity;
    $({
      target: "Math",
      stat: true,
      forced: FORCED
    }, {
      acosh: function acosh(x) {
        var n = +x;
        return n < 1 ? NaN : n > 9490626562425156e-8 ? log(n) + LN2 : log1p(n - 1 + sqrt(n - 1) * sqrt(n + 1));
      }
    });
  }
});

// node_modules/core-js/modules/es.math.asinh.js
var require_es_math_asinh = __commonJS({
  "node_modules/core-js/modules/es.math.asinh.js"() {
    "use strict";
    var $ = require_export();
    var $asinh = Math.asinh;
    var log = Math.log;
    var sqrt = Math.sqrt;
    function asinh(x) {
      var n = +x;
      return !isFinite(n) || n === 0 ? n : n < 0 ? -asinh(-n) : log(n + sqrt(n * n + 1));
    }
    var FORCED = !($asinh && 1 / $asinh(0) > 0);
    $({
      target: "Math",
      stat: true,
      forced: FORCED
    }, {
      asinh
    });
  }
});

// node_modules/core-js/modules/es.math.atanh.js
var require_es_math_atanh = __commonJS({
  "node_modules/core-js/modules/es.math.atanh.js"() {
    "use strict";
    var $ = require_export();
    var $atanh = Math.atanh;
    var log = Math.log;
    var FORCED = !($atanh && 1 / $atanh(-0) < 0);
    $({
      target: "Math",
      stat: true,
      forced: FORCED
    }, {
      atanh: function atanh(x) {
        var n = +x;
        return n === 0 ? n : log((1 + n) / (1 - n)) / 2;
      }
    });
  }
});

// node_modules/core-js/internals/math-sign.js
var require_math_sign = __commonJS({
  "node_modules/core-js/internals/math-sign.js"(exports, module) {
    "use strict";
    module.exports = Math.sign || function sign(x) {
      var n = +x;
      return n === 0 || n !== n ? n : n < 0 ? -1 : 1;
    };
  }
});

// node_modules/core-js/modules/es.math.cbrt.js
var require_es_math_cbrt = __commonJS({
  "node_modules/core-js/modules/es.math.cbrt.js"() {
    "use strict";
    var $ = require_export();
    var sign = require_math_sign();
    var abs = Math.abs;
    var pow = Math.pow;
    $({
      target: "Math",
      stat: true
    }, {
      cbrt: function cbrt(x) {
        var n = +x;
        return sign(n) * pow(abs(n), 1 / 3);
      }
    });
  }
});

// node_modules/core-js/modules/es.math.clz32.js
var require_es_math_clz32 = __commonJS({
  "node_modules/core-js/modules/es.math.clz32.js"() {
    "use strict";
    var $ = require_export();
    var floor = Math.floor;
    var log = Math.log;
    var LOG2E = Math.LOG2E;
    $({
      target: "Math",
      stat: true
    }, {
      clz32: function clz32(x) {
        var n = x >>> 0;
        return n ? 31 - floor(log(n + 0.5) * LOG2E) : 32;
      }
    });
  }
});

// node_modules/core-js/internals/math-expm1.js
var require_math_expm1 = __commonJS({
  "node_modules/core-js/internals/math-expm1.js"(exports, module) {
    "use strict";
    var $expm1 = Math.expm1;
    var exp = Math.exp;
    module.exports = !$expm1 || $expm1(10) > 22025.465794806718 || $expm1(10) < 22025.465794806718 || $expm1(-2e-17) !== -2e-17 ? function expm1(x) {
      var n = +x;
      return n === 0 ? n : n > -1e-6 && n < 1e-6 ? n + n * n / 2 : exp(n) - 1;
    } : $expm1;
  }
});

// node_modules/core-js/modules/es.math.cosh.js
var require_es_math_cosh = __commonJS({
  "node_modules/core-js/modules/es.math.cosh.js"() {
    "use strict";
    var $ = require_export();
    var expm1 = require_math_expm1();
    var $cosh = Math.cosh;
    var abs = Math.abs;
    var E = Math.E;
    var FORCED = !$cosh || $cosh(710) === Infinity;
    $({
      target: "Math",
      stat: true,
      forced: FORCED
    }, {
      cosh: function cosh(x) {
        var t = expm1(abs(x) - 1) + 1;
        return (t + 1 / (t * E * E)) * (E / 2);
      }
    });
  }
});

// node_modules/core-js/modules/es.math.expm1.js
var require_es_math_expm1 = __commonJS({
  "node_modules/core-js/modules/es.math.expm1.js"() {
    "use strict";
    var $ = require_export();
    var expm1 = require_math_expm1();
    $({
      target: "Math",
      stat: true,
      forced: expm1 !== Math.expm1
    }, {
      expm1
    });
  }
});

// node_modules/core-js/internals/math-round-ties-to-even.js
var require_math_round_ties_to_even = __commonJS({
  "node_modules/core-js/internals/math-round-ties-to-even.js"(exports, module) {
    "use strict";
    var EPSILON = 2220446049250313e-31;
    var INVERSE_EPSILON = 1 / EPSILON;
    module.exports = function(n) {
      return n + INVERSE_EPSILON - INVERSE_EPSILON;
    };
  }
});

// node_modules/core-js/internals/math-float-round.js
var require_math_float_round = __commonJS({
  "node_modules/core-js/internals/math-float-round.js"(exports, module) {
    "use strict";
    var sign = require_math_sign();
    var roundTiesToEven = require_math_round_ties_to_even();
    var abs = Math.abs;
    var EPSILON = 2220446049250313e-31;
    module.exports = function(x, FLOAT_EPSILON, FLOAT_MAX_VALUE, FLOAT_MIN_VALUE) {
      var n = +x;
      var absolute = abs(n);
      var s = sign(n);
      if (absolute < FLOAT_MIN_VALUE) return s * roundTiesToEven(absolute / FLOAT_MIN_VALUE / FLOAT_EPSILON) * FLOAT_MIN_VALUE * FLOAT_EPSILON;
      var a = (1 + FLOAT_EPSILON / EPSILON) * absolute;
      var result = a - (a - absolute);
      if (result > FLOAT_MAX_VALUE || result !== result) return s * Infinity;
      return s * result;
    };
  }
});

// node_modules/core-js/internals/math-fround.js
var require_math_fround = __commonJS({
  "node_modules/core-js/internals/math-fround.js"(exports, module) {
    "use strict";
    var floatRound = require_math_float_round();
    var FLOAT32_EPSILON = 11920928955078125e-23;
    var FLOAT32_MAX_VALUE = 34028234663852886e22;
    var FLOAT32_MIN_VALUE = 11754943508222875e-54;
    module.exports = Math.fround || function fround(x) {
      return floatRound(x, FLOAT32_EPSILON, FLOAT32_MAX_VALUE, FLOAT32_MIN_VALUE);
    };
  }
});

// node_modules/core-js/modules/es.math.fround.js
var require_es_math_fround = __commonJS({
  "node_modules/core-js/modules/es.math.fround.js"() {
    "use strict";
    var $ = require_export();
    var fround = require_math_fround();
    $({
      target: "Math",
      stat: true
    }, {
      fround
    });
  }
});

// node_modules/core-js/modules/es.math.f16round.js
var require_es_math_f16round = __commonJS({
  "node_modules/core-js/modules/es.math.f16round.js"() {
    "use strict";
    var $ = require_export();
    var floatRound = require_math_float_round();
    var FLOAT16_EPSILON = 9765625e-10;
    var FLOAT16_MAX_VALUE = 65504;
    var FLOAT16_MIN_VALUE = 6103515625e-14;
    $({
      target: "Math",
      stat: true
    }, {
      f16round: function f16round(x) {
        return floatRound(x, FLOAT16_EPSILON, FLOAT16_MAX_VALUE, FLOAT16_MIN_VALUE);
      }
    });
  }
});

// node_modules/core-js/modules/es.math.hypot.js
var require_es_math_hypot = __commonJS({
  "node_modules/core-js/modules/es.math.hypot.js"() {
    "use strict";
    var $ = require_export();
    var $hypot = Math.hypot;
    var abs = Math.abs;
    var sqrt = Math.sqrt;
    var FORCED = !!$hypot && $hypot(Infinity, NaN) !== Infinity;
    $({
      target: "Math",
      stat: true,
      arity: 2,
      forced: FORCED
    }, {
      // eslint-disable-next-line no-unused-vars -- required for `.length`
      hypot: function hypot(value1, value2) {
        var sum = 0;
        var i = 0;
        var aLen = arguments.length;
        var larg = 0;
        var arg, div;
        while (i < aLen) {
          arg = abs(arguments[i++]);
          if (larg < arg) {
            div = larg / arg;
            sum = sum * div * div + 1;
            larg = arg;
          } else if (arg > 0) {
            div = arg / larg;
            sum += div * div;
          } else sum += arg;
        }
        return larg === Infinity ? Infinity : larg * sqrt(sum);
      }
    });
  }
});

// node_modules/core-js/modules/es.math.imul.js
var require_es_math_imul = __commonJS({
  "node_modules/core-js/modules/es.math.imul.js"() {
    "use strict";
    var $ = require_export();
    var fails = require_fails();
    var $imul = Math.imul;
    var FORCED = fails(function() {
      return $imul(4294967295, 5) !== -5 || $imul.length !== 2;
    });
    $({
      target: "Math",
      stat: true,
      forced: FORCED
    }, {
      imul: function imul(x, y) {
        var UINT16 = 65535;
        var xn = +x;
        var yn = +y;
        var xl = UINT16 & xn;
        var yl = UINT16 & yn;
        return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
      }
    });
  }
});

// node_modules/core-js/modules/es.math.log10.js
var require_es_math_log10 = __commonJS({
  "node_modules/core-js/modules/es.math.log10.js"() {
    "use strict";
    var $ = require_export();
    var log10 = require_math_log10();
    $({
      target: "Math",
      stat: true
    }, {
      log10
    });
  }
});

// node_modules/core-js/modules/es.math.log1p.js
var require_es_math_log1p = __commonJS({
  "node_modules/core-js/modules/es.math.log1p.js"() {
    "use strict";
    var $ = require_export();
    var log1p = require_math_log1p();
    $({
      target: "Math",
      stat: true
    }, {
      log1p
    });
  }
});

// node_modules/core-js/internals/math-log2.js
var require_math_log2 = __commonJS({
  "node_modules/core-js/internals/math-log2.js"(exports, module) {
    "use strict";
    var log = Math.log;
    var LN2 = Math.LN2;
    module.exports = Math.log2 || function log2(x) {
      return log(x) / LN2;
    };
  }
});

// node_modules/core-js/modules/es.math.log2.js
var require_es_math_log2 = __commonJS({
  "node_modules/core-js/modules/es.math.log2.js"() {
    "use strict";
    var $ = require_export();
    var log2 = require_math_log2();
    $({
      target: "Math",
      stat: true
    }, {
      log2
    });
  }
});

// node_modules/core-js/modules/es.math.sign.js
var require_es_math_sign = __commonJS({
  "node_modules/core-js/modules/es.math.sign.js"() {
    "use strict";
    var $ = require_export();
    var sign = require_math_sign();
    $({
      target: "Math",
      stat: true
    }, {
      sign
    });
  }
});

// node_modules/core-js/modules/es.math.sinh.js
var require_es_math_sinh = __commonJS({
  "node_modules/core-js/modules/es.math.sinh.js"() {
    "use strict";
    var $ = require_export();
    var fails = require_fails();
    var expm1 = require_math_expm1();
    var abs = Math.abs;
    var exp = Math.exp;
    var E = Math.E;
    var FORCED = fails(function() {
      return Math.sinh(-2e-17) !== -2e-17;
    });
    $({
      target: "Math",
      stat: true,
      forced: FORCED
    }, {
      sinh: function sinh(x) {
        var n = +x;
        return abs(n) < 1 ? (expm1(n) - expm1(-n)) / 2 : (exp(n - 1) - exp(-n - 1)) * (E / 2);
      }
    });
  }
});

// node_modules/core-js/modules/es.math.tanh.js
var require_es_math_tanh = __commonJS({
  "node_modules/core-js/modules/es.math.tanh.js"() {
    "use strict";
    var $ = require_export();
    var expm1 = require_math_expm1();
    var exp = Math.exp;
    $({
      target: "Math",
      stat: true
    }, {
      tanh: function tanh(x) {
        var n = +x;
        var a = expm1(n);
        var b = expm1(-n);
        return a === Infinity ? 1 : b === Infinity ? -1 : (a - b) / (exp(n) + exp(-n));
      }
    });
  }
});

// node_modules/core-js/modules/es.math.trunc.js
var require_es_math_trunc = __commonJS({
  "node_modules/core-js/modules/es.math.trunc.js"() {
    "use strict";
    var $ = require_export();
    var trunc = require_math_trunc();
    $({
      target: "Math",
      stat: true
    }, {
      trunc
    });
  }
});

// node_modules/core-js/es/math/index.js
var require_math = __commonJS({
  "node_modules/core-js/es/math/index.js"(exports, module) {
    require_es_math_acosh();
    require_es_math_asinh();
    require_es_math_atanh();
    require_es_math_cbrt();
    require_es_math_clz32();
    require_es_math_cosh();
    require_es_math_expm1();
    require_es_math_fround();
    require_es_math_f16round();
    require_es_math_hypot();
    require_es_math_imul();
    require_es_math_log10();
    require_es_math_log1p();
    require_es_math_log2();
    require_es_math_sign();
    require_es_math_sinh();
    require_es_math_tanh();
    require_es_math_to_string_tag();
    require_es_math_trunc();
    var path = require_path();
    module.exports = path.Math;
  }
});
export default require_math();
//# sourceMappingURL=core-js_es_math.js.map
