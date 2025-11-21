import {
  require_classof_raw,
  require_fails,
  require_is_object
} from "./chunk-SYAKHIZ5.js";
import {
  __commonJS
} from "./chunk-F52B2RLG.js";

// node_modules/core-js/internals/array-buffer-non-extensible.js
var require_array_buffer_non_extensible = __commonJS({
  "node_modules/core-js/internals/array-buffer-non-extensible.js"(exports, module) {
    "use strict";
    var fails = require_fails();
    module.exports = fails(function() {
      if (typeof ArrayBuffer == "function") {
        var buffer = new ArrayBuffer(8);
        if (Object.isExtensible(buffer)) Object.defineProperty(buffer, "a", {
          value: 8
        });
      }
    });
  }
});

// node_modules/core-js/internals/object-is-extensible.js
var require_object_is_extensible = __commonJS({
  "node_modules/core-js/internals/object-is-extensible.js"(exports, module) {
    "use strict";
    var fails = require_fails();
    var isObject = require_is_object();
    var classof = require_classof_raw();
    var ARRAY_BUFFER_NON_EXTENSIBLE = require_array_buffer_non_extensible();
    var $isExtensible = Object.isExtensible;
    var FAILS_ON_PRIMITIVES = fails(function() {
      $isExtensible(1);
    });
    module.exports = FAILS_ON_PRIMITIVES || ARRAY_BUFFER_NON_EXTENSIBLE ? function isExtensible(it) {
      if (!isObject(it)) return false;
      if (ARRAY_BUFFER_NON_EXTENSIBLE && classof(it) === "ArrayBuffer") return false;
      return $isExtensible ? $isExtensible(it) : true;
    } : $isExtensible;
  }
});

// node_modules/core-js/internals/freezing.js
var require_freezing = __commonJS({
  "node_modules/core-js/internals/freezing.js"(exports, module) {
    "use strict";
    var fails = require_fails();
    module.exports = !fails(function() {
      return Object.isExtensible(Object.preventExtensions({}));
    });
  }
});

export {
  require_array_buffer_non_extensible,
  require_object_is_extensible,
  require_freezing
};
//# sourceMappingURL=chunk-GPYUX3T7.js.map
