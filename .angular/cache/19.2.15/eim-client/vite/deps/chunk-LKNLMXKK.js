import {
  require_whitespaces
} from "./chunk-677LGTPM.js";
import {
  require_to_string
} from "./chunk-L2Q7U5JX.js";
import {
  require_function_uncurry_this,
  require_require_object_coercible
} from "./chunk-SYAKHIZ5.js";
import {
  __commonJS
} from "./chunk-F52B2RLG.js";

// node_modules/core-js/internals/string-trim.js
var require_string_trim = __commonJS({
  "node_modules/core-js/internals/string-trim.js"(exports, module) {
    "use strict";
    var uncurryThis = require_function_uncurry_this();
    var requireObjectCoercible = require_require_object_coercible();
    var toString = require_to_string();
    var whitespaces = require_whitespaces();
    var replace = uncurryThis("".replace);
    var ltrim = RegExp("^[" + whitespaces + "]+");
    var rtrim = RegExp("(^|[^" + whitespaces + "])[" + whitespaces + "]+$");
    var createMethod = function(TYPE) {
      return function($this) {
        var string = toString(requireObjectCoercible($this));
        if (TYPE & 1) string = replace(string, ltrim, "");
        if (TYPE & 2) string = replace(string, rtrim, "$1");
        return string;
      };
    };
    module.exports = {
      // `String.prototype.{ trimLeft, trimStart }` methods
      // https://tc39.es/ecma262/#sec-string.prototype.trimstart
      start: createMethod(1),
      // `String.prototype.{ trimRight, trimEnd }` methods
      // https://tc39.es/ecma262/#sec-string.prototype.trimend
      end: createMethod(2),
      // `String.prototype.trim` method
      // https://tc39.es/ecma262/#sec-string.prototype.trim
      trim: createMethod(3)
    };
  }
});

export {
  require_string_trim
};
//# sourceMappingURL=chunk-LKNLMXKK.js.map
