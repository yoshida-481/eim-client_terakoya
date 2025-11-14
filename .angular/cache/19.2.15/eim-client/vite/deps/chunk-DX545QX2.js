import {
  require_string_trim
} from "./chunk-LKNLMXKK.js";
import {
  require_whitespaces
} from "./chunk-677LGTPM.js";
import {
  require_to_string
} from "./chunk-L2Q7U5JX.js";
import {
  require_fails,
  require_function_uncurry_this,
  require_global_this
} from "./chunk-SYAKHIZ5.js";
import {
  __commonJS
} from "./chunk-F52B2RLG.js";

// node_modules/core-js/internals/number-parse-int.js
var require_number_parse_int = __commonJS({
  "node_modules/core-js/internals/number-parse-int.js"(exports, module) {
    "use strict";
    var globalThis = require_global_this();
    var fails = require_fails();
    var uncurryThis = require_function_uncurry_this();
    var toString = require_to_string();
    var trim = require_string_trim().trim;
    var whitespaces = require_whitespaces();
    var $parseInt = globalThis.parseInt;
    var Symbol = globalThis.Symbol;
    var ITERATOR = Symbol && Symbol.iterator;
    var hex = /^[+-]?0x/i;
    var exec = uncurryThis(hex.exec);
    var FORCED = $parseInt(whitespaces + "08") !== 8 || $parseInt(whitespaces + "0x16") !== 22 || ITERATOR && !fails(function() {
      $parseInt(Object(ITERATOR));
    });
    module.exports = FORCED ? function parseInt(string, radix) {
      var S = trim(toString(string));
      return $parseInt(S, radix >>> 0 || (exec(hex, S) ? 16 : 10));
    } : $parseInt;
  }
});

export {
  require_number_parse_int
};
//# sourceMappingURL=chunk-DX545QX2.js.map
