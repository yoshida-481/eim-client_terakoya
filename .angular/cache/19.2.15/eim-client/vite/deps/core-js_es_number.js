import {
  require_math_log10
} from "./chunk-4WVC67J7.js";
import {
  require_number_parse_float
} from "./chunk-VI3E2CLI.js";
import {
  require_number_parse_int
} from "./chunk-DX545QX2.js";
import {
  require_string_repeat
} from "./chunk-6UNXP5FG.js";
import {
  require_string_trim
} from "./chunk-LKNLMXKK.js";
import "./chunk-677LGTPM.js";
import {
  require_inherit_if_required
} from "./chunk-2GGPBGA4.js";
import "./chunk-LJACIHUK.js";
import "./chunk-L2Q7U5JX.js";
import "./chunk-OW7VFTLO.js";
import {
  require_path
} from "./chunk-N7EDGOTA.js";
import {
  require_descriptors,
  require_export,
  require_fails,
  require_function_uncurry_this,
  require_global_this,
  require_has_own_property,
  require_is_forced,
  require_is_object,
  require_is_pure,
  require_is_symbol,
  require_object_define_property,
  require_object_get_own_property_descriptor,
  require_object_get_own_property_names,
  require_object_is_prototype_of,
  require_to_integer_or_infinity,
  require_to_primitive
} from "./chunk-SYAKHIZ5.js";
import {
  __commonJS
} from "./chunk-F52B2RLG.js";

// node_modules/core-js/internals/this-number-value.js
var require_this_number_value = __commonJS({
  "node_modules/core-js/internals/this-number-value.js"(exports, module) {
    "use strict";
    var uncurryThis = require_function_uncurry_this();
    module.exports = uncurryThis(1.1.valueOf);
  }
});

// node_modules/core-js/modules/es.number.constructor.js
var require_es_number_constructor = __commonJS({
  "node_modules/core-js/modules/es.number.constructor.js"() {
    "use strict";
    var $ = require_export();
    var IS_PURE = require_is_pure();
    var DESCRIPTORS = require_descriptors();
    var globalThis = require_global_this();
    var path = require_path();
    var uncurryThis = require_function_uncurry_this();
    var isForced = require_is_forced();
    var hasOwn = require_has_own_property();
    var inheritIfRequired = require_inherit_if_required();
    var isPrototypeOf = require_object_is_prototype_of();
    var isSymbol = require_is_symbol();
    var toPrimitive = require_to_primitive();
    var fails = require_fails();
    var getOwnPropertyNames = require_object_get_own_property_names().f;
    var getOwnPropertyDescriptor = require_object_get_own_property_descriptor().f;
    var defineProperty = require_object_define_property().f;
    var thisNumberValue = require_this_number_value();
    var trim = require_string_trim().trim;
    var NUMBER = "Number";
    var NativeNumber = globalThis[NUMBER];
    var PureNumberNamespace = path[NUMBER];
    var NumberPrototype = NativeNumber.prototype;
    var TypeError = globalThis.TypeError;
    var stringSlice = uncurryThis("".slice);
    var charCodeAt = uncurryThis("".charCodeAt);
    var toNumeric = function(value) {
      var primValue = toPrimitive(value, "number");
      return typeof primValue == "bigint" ? primValue : toNumber(primValue);
    };
    var toNumber = function(argument) {
      var it = toPrimitive(argument, "number");
      var first, third, radix, maxCode, digits, length, index, code;
      if (isSymbol(it)) throw new TypeError("Cannot convert a Symbol value to a number");
      if (typeof it == "string" && it.length > 2) {
        it = trim(it);
        first = charCodeAt(it, 0);
        if (first === 43 || first === 45) {
          third = charCodeAt(it, 2);
          if (third === 88 || third === 120) return NaN;
        } else if (first === 48) {
          switch (charCodeAt(it, 1)) {
            // fast equal of /^0b[01]+$/i
            case 66:
            case 98:
              radix = 2;
              maxCode = 49;
              break;
            // fast equal of /^0o[0-7]+$/i
            case 79:
            case 111:
              radix = 8;
              maxCode = 55;
              break;
            default:
              return +it;
          }
          digits = stringSlice(it, 2);
          length = digits.length;
          for (index = 0; index < length; index++) {
            code = charCodeAt(digits, index);
            if (code < 48 || code > maxCode) return NaN;
          }
          return parseInt(digits, radix);
        }
      }
      return +it;
    };
    var FORCED = isForced(NUMBER, !NativeNumber(" 0o1") || !NativeNumber("0b1") || NativeNumber("+0x1"));
    var calledWithNew = function(dummy) {
      return isPrototypeOf(NumberPrototype, dummy) && fails(function() {
        thisNumberValue(dummy);
      });
    };
    var NumberWrapper = function Number2(value) {
      var n = arguments.length < 1 ? 0 : NativeNumber(toNumeric(value));
      return calledWithNew(this) ? inheritIfRequired(Object(n), this, NumberWrapper) : n;
    };
    NumberWrapper.prototype = NumberPrototype;
    if (FORCED && !IS_PURE) NumberPrototype.constructor = NumberWrapper;
    $({
      global: true,
      constructor: true,
      wrap: true,
      forced: FORCED
    }, {
      Number: NumberWrapper
    });
    var copyConstructorProperties = function(target, source) {
      for (var keys = DESCRIPTORS ? getOwnPropertyNames(source) : (
        // ES3:
        "MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,isFinite,isInteger,isNaN,isSafeInteger,parseFloat,parseInt,fromString,range".split(",")
      ), j = 0, key; keys.length > j; j++) {
        if (hasOwn(source, key = keys[j]) && !hasOwn(target, key)) {
          defineProperty(target, key, getOwnPropertyDescriptor(source, key));
        }
      }
    };
    if (IS_PURE && PureNumberNamespace) copyConstructorProperties(path[NUMBER], PureNumberNamespace);
    if (FORCED || IS_PURE) copyConstructorProperties(path[NUMBER], NativeNumber);
  }
});

// node_modules/core-js/modules/es.number.epsilon.js
var require_es_number_epsilon = __commonJS({
  "node_modules/core-js/modules/es.number.epsilon.js"() {
    "use strict";
    var $ = require_export();
    $({
      target: "Number",
      stat: true,
      nonConfigurable: true,
      nonWritable: true
    }, {
      EPSILON: Math.pow(2, -52)
    });
  }
});

// node_modules/core-js/internals/number-is-finite.js
var require_number_is_finite = __commonJS({
  "node_modules/core-js/internals/number-is-finite.js"(exports, module) {
    "use strict";
    var globalThis = require_global_this();
    var globalIsFinite = globalThis.isFinite;
    module.exports = Number.isFinite || function isFinite2(it) {
      return typeof it == "number" && globalIsFinite(it);
    };
  }
});

// node_modules/core-js/modules/es.number.is-finite.js
var require_es_number_is_finite = __commonJS({
  "node_modules/core-js/modules/es.number.is-finite.js"() {
    "use strict";
    var $ = require_export();
    var numberIsFinite = require_number_is_finite();
    $({
      target: "Number",
      stat: true
    }, {
      isFinite: numberIsFinite
    });
  }
});

// node_modules/core-js/internals/is-integral-number.js
var require_is_integral_number = __commonJS({
  "node_modules/core-js/internals/is-integral-number.js"(exports, module) {
    "use strict";
    var isObject = require_is_object();
    var floor = Math.floor;
    module.exports = Number.isInteger || function isInteger(it) {
      return !isObject(it) && isFinite(it) && floor(it) === it;
    };
  }
});

// node_modules/core-js/modules/es.number.is-integer.js
var require_es_number_is_integer = __commonJS({
  "node_modules/core-js/modules/es.number.is-integer.js"() {
    "use strict";
    var $ = require_export();
    var isIntegralNumber = require_is_integral_number();
    $({
      target: "Number",
      stat: true
    }, {
      isInteger: isIntegralNumber
    });
  }
});

// node_modules/core-js/modules/es.number.is-nan.js
var require_es_number_is_nan = __commonJS({
  "node_modules/core-js/modules/es.number.is-nan.js"() {
    "use strict";
    var $ = require_export();
    $({
      target: "Number",
      stat: true
    }, {
      isNaN: function isNaN(number) {
        return number !== number;
      }
    });
  }
});

// node_modules/core-js/modules/es.number.is-safe-integer.js
var require_es_number_is_safe_integer = __commonJS({
  "node_modules/core-js/modules/es.number.is-safe-integer.js"() {
    "use strict";
    var $ = require_export();
    var isIntegralNumber = require_is_integral_number();
    var abs = Math.abs;
    $({
      target: "Number",
      stat: true
    }, {
      isSafeInteger: function isSafeInteger(number) {
        return isIntegralNumber(number) && abs(number) <= 9007199254740991;
      }
    });
  }
});

// node_modules/core-js/modules/es.number.max-safe-integer.js
var require_es_number_max_safe_integer = __commonJS({
  "node_modules/core-js/modules/es.number.max-safe-integer.js"() {
    "use strict";
    var $ = require_export();
    $({
      target: "Number",
      stat: true,
      nonConfigurable: true,
      nonWritable: true
    }, {
      MAX_SAFE_INTEGER: 9007199254740991
    });
  }
});

// node_modules/core-js/modules/es.number.min-safe-integer.js
var require_es_number_min_safe_integer = __commonJS({
  "node_modules/core-js/modules/es.number.min-safe-integer.js"() {
    "use strict";
    var $ = require_export();
    $({
      target: "Number",
      stat: true,
      nonConfigurable: true,
      nonWritable: true
    }, {
      MIN_SAFE_INTEGER: -9007199254740991
    });
  }
});

// node_modules/core-js/modules/es.number.parse-float.js
var require_es_number_parse_float = __commonJS({
  "node_modules/core-js/modules/es.number.parse-float.js"() {
    "use strict";
    var $ = require_export();
    var parseFloat = require_number_parse_float();
    $({
      target: "Number",
      stat: true,
      forced: Number.parseFloat !== parseFloat
    }, {
      parseFloat
    });
  }
});

// node_modules/core-js/modules/es.number.parse-int.js
var require_es_number_parse_int = __commonJS({
  "node_modules/core-js/modules/es.number.parse-int.js"() {
    "use strict";
    var $ = require_export();
    var parseInt2 = require_number_parse_int();
    $({
      target: "Number",
      stat: true,
      forced: Number.parseInt !== parseInt2
    }, {
      parseInt: parseInt2
    });
  }
});

// node_modules/core-js/modules/es.number.to-exponential.js
var require_es_number_to_exponential = __commonJS({
  "node_modules/core-js/modules/es.number.to-exponential.js"() {
    "use strict";
    var $ = require_export();
    var uncurryThis = require_function_uncurry_this();
    var toIntegerOrInfinity = require_to_integer_or_infinity();
    var thisNumberValue = require_this_number_value();
    var $repeat = require_string_repeat();
    var log10 = require_math_log10();
    var fails = require_fails();
    var $RangeError = RangeError;
    var $String = String;
    var $isFinite = isFinite;
    var abs = Math.abs;
    var floor = Math.floor;
    var pow = Math.pow;
    var round = Math.round;
    var nativeToExponential = uncurryThis(1.1.toExponential);
    var repeat = uncurryThis($repeat);
    var stringSlice = uncurryThis("".slice);
    var ROUNDS_PROPERLY = nativeToExponential(-69e-12, 4) === "-6.9000e-11" && nativeToExponential(1.255, 2) === "1.25e+0" && nativeToExponential(12345, 3) === "1.235e+4" && nativeToExponential(25, 0) === "3e+1";
    var throwsOnInfinityFraction = function() {
      return fails(function() {
        nativeToExponential(1, Infinity);
      }) && fails(function() {
        nativeToExponential(1, -Infinity);
      });
    };
    var properNonFiniteThisCheck = function() {
      return !fails(function() {
        nativeToExponential(Infinity, Infinity);
        nativeToExponential(NaN, Infinity);
      });
    };
    var FORCED = !ROUNDS_PROPERLY || !throwsOnInfinityFraction() || !properNonFiniteThisCheck();
    $({
      target: "Number",
      proto: true,
      forced: FORCED
    }, {
      toExponential: function toExponential(fractionDigits) {
        var x = thisNumberValue(this);
        if (fractionDigits === void 0) return nativeToExponential(x);
        var f = toIntegerOrInfinity(fractionDigits);
        if (!$isFinite(x)) return String(x);
        if (f < 0 || f > 20) throw new $RangeError("Incorrect fraction digits");
        if (ROUNDS_PROPERLY) return nativeToExponential(x, f);
        var s = "";
        var m, e, c, d;
        if (x < 0) {
          s = "-";
          x = -x;
        }
        if (x === 0) {
          e = 0;
          m = repeat("0", f + 1);
        } else {
          var l = log10(x);
          e = floor(l);
          var w = pow(10, e - f);
          var n = round(x / w);
          if (2 * x >= (2 * n + 1) * w) {
            n += 1;
          }
          if (n >= pow(10, f + 1)) {
            n /= 10;
            e += 1;
          }
          m = $String(n);
        }
        if (f !== 0) {
          m = stringSlice(m, 0, 1) + "." + stringSlice(m, 1);
        }
        if (e === 0) {
          c = "+";
          d = "0";
        } else {
          c = e > 0 ? "+" : "-";
          d = $String(abs(e));
        }
        m += "e" + c + d;
        return s + m;
      }
    });
  }
});

// node_modules/core-js/modules/es.number.to-fixed.js
var require_es_number_to_fixed = __commonJS({
  "node_modules/core-js/modules/es.number.to-fixed.js"() {
    "use strict";
    var $ = require_export();
    var uncurryThis = require_function_uncurry_this();
    var toIntegerOrInfinity = require_to_integer_or_infinity();
    var thisNumberValue = require_this_number_value();
    var $repeat = require_string_repeat();
    var fails = require_fails();
    var $RangeError = RangeError;
    var $String = String;
    var floor = Math.floor;
    var repeat = uncurryThis($repeat);
    var stringSlice = uncurryThis("".slice);
    var nativeToFixed = uncurryThis(1.1.toFixed);
    var pow = function(x, n, acc) {
      return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
    };
    var log = function(x) {
      var n = 0;
      var x2 = x;
      while (x2 >= 4096) {
        n += 12;
        x2 /= 4096;
      }
      while (x2 >= 2) {
        n += 1;
        x2 /= 2;
      }
      return n;
    };
    var multiply = function(data, n, c) {
      var index = -1;
      var c2 = c;
      while (++index < 6) {
        c2 += n * data[index];
        data[index] = c2 % 1e7;
        c2 = floor(c2 / 1e7);
      }
    };
    var divide = function(data, n) {
      var index = 6;
      var c = 0;
      while (--index >= 0) {
        c += data[index];
        data[index] = floor(c / n);
        c = c % n * 1e7;
      }
    };
    var dataToString = function(data) {
      var index = 6;
      var s = "";
      while (--index >= 0) {
        if (s !== "" || index === 0 || data[index] !== 0) {
          var t = $String(data[index]);
          s = s === "" ? t : s + repeat("0", 7 - t.length) + t;
        }
      }
      return s;
    };
    var FORCED = fails(function() {
      return nativeToFixed(8e-5, 3) !== "0.000" || nativeToFixed(0.9, 0) !== "1" || nativeToFixed(1.255, 2) !== "1.25" || nativeToFixed(1000000000000000100, 0) !== "1000000000000000128";
    }) || !fails(function() {
      nativeToFixed({});
    });
    $({
      target: "Number",
      proto: true,
      forced: FORCED
    }, {
      toFixed: function toFixed(fractionDigits) {
        var number = thisNumberValue(this);
        var fractDigits = toIntegerOrInfinity(fractionDigits);
        var data = [0, 0, 0, 0, 0, 0];
        var sign = "";
        var result = "0";
        var e, z, j, k;
        if (fractDigits < 0 || fractDigits > 20) throw new $RangeError("Incorrect fraction digits");
        if (number !== number) return "NaN";
        if (number <= -1e21 || number >= 1e21) return $String(number);
        if (number < 0) {
          sign = "-";
          number = -number;
        }
        if (number > 1e-21) {
          e = log(number * pow(2, 69, 1)) - 69;
          z = e < 0 ? number * pow(2, -e, 1) : number / pow(2, e, 1);
          z *= 4503599627370496;
          e = 52 - e;
          if (e > 0) {
            multiply(data, 0, z);
            j = fractDigits;
            while (j >= 7) {
              multiply(data, 1e7, 0);
              j -= 7;
            }
            multiply(data, pow(10, j, 1), 0);
            j = e - 1;
            while (j >= 23) {
              divide(data, 1 << 23);
              j -= 23;
            }
            divide(data, 1 << j);
            multiply(data, 1, 1);
            divide(data, 2);
            result = dataToString(data);
          } else {
            multiply(data, 0, z);
            multiply(data, 1 << -e, 0);
            result = dataToString(data) + repeat("0", fractDigits);
          }
        }
        if (fractDigits > 0) {
          k = result.length;
          result = sign + (k <= fractDigits ? "0." + repeat("0", fractDigits - k) + result : stringSlice(result, 0, k - fractDigits) + "." + stringSlice(result, k - fractDigits));
        } else {
          result = sign + result;
        }
        return result;
      }
    });
  }
});

// node_modules/core-js/modules/es.number.to-precision.js
var require_es_number_to_precision = __commonJS({
  "node_modules/core-js/modules/es.number.to-precision.js"() {
    "use strict";
    var $ = require_export();
    var uncurryThis = require_function_uncurry_this();
    var fails = require_fails();
    var thisNumberValue = require_this_number_value();
    var nativeToPrecision = uncurryThis(1.1.toPrecision);
    var FORCED = fails(function() {
      return nativeToPrecision(1, void 0) !== "1";
    }) || !fails(function() {
      nativeToPrecision({});
    });
    $({
      target: "Number",
      proto: true,
      forced: FORCED
    }, {
      toPrecision: function toPrecision(precision) {
        return precision === void 0 ? nativeToPrecision(thisNumberValue(this)) : nativeToPrecision(thisNumberValue(this), precision);
      }
    });
  }
});

// node_modules/core-js/es/number/index.js
var require_number = __commonJS({
  "node_modules/core-js/es/number/index.js"(exports, module) {
    require_es_number_constructor();
    require_es_number_epsilon();
    require_es_number_is_finite();
    require_es_number_is_integer();
    require_es_number_is_nan();
    require_es_number_is_safe_integer();
    require_es_number_max_safe_integer();
    require_es_number_min_safe_integer();
    require_es_number_parse_float();
    require_es_number_parse_int();
    require_es_number_to_exponential();
    require_es_number_to_fixed();
    require_es_number_to_precision();
    var path = require_path();
    module.exports = path.Number;
  }
});
export default require_number();
//# sourceMappingURL=core-js_es_number.js.map
