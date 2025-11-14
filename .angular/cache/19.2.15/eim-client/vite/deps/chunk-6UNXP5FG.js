import {
  require_to_string
} from "./chunk-L2Q7U5JX.js";
import {
  require_require_object_coercible,
  require_to_integer_or_infinity
} from "./chunk-SYAKHIZ5.js";
import {
  __commonJS
} from "./chunk-F52B2RLG.js";

// node_modules/core-js/internals/string-repeat.js
var require_string_repeat = __commonJS({
  "node_modules/core-js/internals/string-repeat.js"(exports, module) {
    "use strict";
    var toIntegerOrInfinity = require_to_integer_or_infinity();
    var toString = require_to_string();
    var requireObjectCoercible = require_require_object_coercible();
    var $RangeError = RangeError;
    module.exports = function repeat(count) {
      var str = toString(requireObjectCoercible(this));
      var result = "";
      var n = toIntegerOrInfinity(count);
      if (n < 0 || n === Infinity) throw new $RangeError("Wrong number of repetitions");
      for (; n > 0; (n >>>= 1) && (str += str)) if (n & 1) result += str;
      return result;
    };
  }
});

export {
  require_string_repeat
};
//# sourceMappingURL=chunk-6UNXP5FG.js.map
