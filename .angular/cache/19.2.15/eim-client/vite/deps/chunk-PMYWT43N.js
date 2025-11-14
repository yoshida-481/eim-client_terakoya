import {
  require_string_repeat
} from "./chunk-6UNXP5FG.js";
import {
  require_to_string
} from "./chunk-L2Q7U5JX.js";
import {
  require_function_uncurry_this,
  require_require_object_coercible,
  require_to_length
} from "./chunk-SYAKHIZ5.js";
import {
  __commonJS
} from "./chunk-F52B2RLG.js";

// node_modules/core-js/internals/string-pad.js
var require_string_pad = __commonJS({
  "node_modules/core-js/internals/string-pad.js"(exports, module) {
    "use strict";
    var uncurryThis = require_function_uncurry_this();
    var toLength = require_to_length();
    var toString = require_to_string();
    var $repeat = require_string_repeat();
    var requireObjectCoercible = require_require_object_coercible();
    var repeat = uncurryThis($repeat);
    var stringSlice = uncurryThis("".slice);
    var ceil = Math.ceil;
    var createMethod = function(IS_END) {
      return function($this, maxLength, fillString) {
        var S = toString(requireObjectCoercible($this));
        var intMaxLength = toLength(maxLength);
        var stringLength = S.length;
        var fillStr = fillString === void 0 ? " " : toString(fillString);
        var fillLen, stringFiller;
        if (intMaxLength <= stringLength || fillStr === "") return S;
        fillLen = intMaxLength - stringLength;
        stringFiller = repeat(fillStr, ceil(fillLen / fillStr.length));
        if (stringFiller.length > fillLen) stringFiller = stringSlice(stringFiller, 0, fillLen);
        return IS_END ? S + stringFiller : stringFiller + S;
      };
    };
    module.exports = {
      // `String.prototype.padStart` method
      // https://tc39.es/ecma262/#sec-string.prototype.padstart
      start: createMethod(false),
      // `String.prototype.padEnd` method
      // https://tc39.es/ecma262/#sec-string.prototype.padend
      end: createMethod(true)
    };
  }
});

export {
  require_string_pad
};
//# sourceMappingURL=chunk-PMYWT43N.js.map
