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

// node_modules/core-js/internals/number-parse-float.js
var require_number_parse_float = __commonJS({
  "node_modules/core-js/internals/number-parse-float.js"(exports, module) {
    "use strict";
    var globalThis = require_global_this();
    var fails = require_fails();
    var uncurryThis = require_function_uncurry_this();
    var toString = require_to_string();
    var trim = require_string_trim().trim;
    var whitespaces = require_whitespaces();
    var charAt = uncurryThis("".charAt);
    var $parseFloat = globalThis.parseFloat;
    var Symbol = globalThis.Symbol;
    var ITERATOR = Symbol && Symbol.iterator;
    var FORCED = 1 / $parseFloat(whitespaces + "-0") !== -Infinity || ITERATOR && !fails(function() {
      $parseFloat(Object(ITERATOR));
    });
    module.exports = FORCED ? function parseFloat(string) {
      var trimmedString = trim(toString(string));
      var result = $parseFloat(trimmedString);
      return result === 0 && charAt(trimmedString, 0) === "-" ? -0 : result;
    } : $parseFloat;
  }
});

export {
  require_number_parse_float
};
//# sourceMappingURL=chunk-VI3E2CLI.js.map
