import {
  require_make_built_in,
  require_object_define_property
} from "./chunk-SYAKHIZ5.js";
import {
  __commonJS
} from "./chunk-F52B2RLG.js";

// node_modules/core-js/internals/define-built-in-accessor.js
var require_define_built_in_accessor = __commonJS({
  "node_modules/core-js/internals/define-built-in-accessor.js"(exports, module) {
    "use strict";
    var makeBuiltIn = require_make_built_in();
    var defineProperty = require_object_define_property();
    module.exports = function(target, name, descriptor) {
      if (descriptor.get) makeBuiltIn(descriptor.get, name, {
        getter: true
      });
      if (descriptor.set) makeBuiltIn(descriptor.set, name, {
        setter: true
      });
      return defineProperty.f(target, name, descriptor);
    };
  }
});

export {
  require_define_built_in_accessor
};
//# sourceMappingURL=chunk-XIS6K74X.js.map
