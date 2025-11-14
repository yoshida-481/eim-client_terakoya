import {
  __commonJS
} from "./chunk-F52B2RLG.js";

// node_modules/core-js/internals/same-value.js
var require_same_value = __commonJS({
  "node_modules/core-js/internals/same-value.js"(exports, module) {
    "use strict";
    module.exports = Object.is || function is(x, y) {
      return x === y ? x !== 0 || 1 / x === 1 / y : x !== x && y !== y;
    };
  }
});

export {
  require_same_value
};
//# sourceMappingURL=chunk-IXACK6AY.js.map
