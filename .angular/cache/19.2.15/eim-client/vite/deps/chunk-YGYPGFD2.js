import {
  require_freezing,
  require_object_is_extensible
} from "./chunk-GPYUX3T7.js";
import {
  require_object_get_own_property_names_external
} from "./chunk-GYN7VWKI.js";
import {
  require_export,
  require_function_uncurry_this,
  require_has_own_property,
  require_hidden_keys,
  require_is_object,
  require_object_define_property,
  require_object_get_own_property_names,
  require_uid
} from "./chunk-SYAKHIZ5.js";
import {
  __commonJS
} from "./chunk-F52B2RLG.js";

// node_modules/core-js/internals/internal-metadata.js
var require_internal_metadata = __commonJS({
  "node_modules/core-js/internals/internal-metadata.js"(exports, module) {
    "use strict";
    var $ = require_export();
    var uncurryThis = require_function_uncurry_this();
    var hiddenKeys = require_hidden_keys();
    var isObject = require_is_object();
    var hasOwn = require_has_own_property();
    var defineProperty = require_object_define_property().f;
    var getOwnPropertyNamesModule = require_object_get_own_property_names();
    var getOwnPropertyNamesExternalModule = require_object_get_own_property_names_external();
    var isExtensible = require_object_is_extensible();
    var uid = require_uid();
    var FREEZING = require_freezing();
    var REQUIRED = false;
    var METADATA = uid("meta");
    var id = 0;
    var setMetadata = function(it) {
      defineProperty(it, METADATA, {
        value: {
          objectID: "O" + id++,
          // object ID
          weakData: {}
          // weak collections IDs
        }
      });
    };
    var fastKey = function(it, create) {
      if (!isObject(it)) return typeof it == "symbol" ? it : (typeof it == "string" ? "S" : "P") + it;
      if (!hasOwn(it, METADATA)) {
        if (!isExtensible(it)) return "F";
        if (!create) return "E";
        setMetadata(it);
      }
      return it[METADATA].objectID;
    };
    var getWeakData = function(it, create) {
      if (!hasOwn(it, METADATA)) {
        if (!isExtensible(it)) return true;
        if (!create) return false;
        setMetadata(it);
      }
      return it[METADATA].weakData;
    };
    var onFreeze = function(it) {
      if (FREEZING && REQUIRED && isExtensible(it) && !hasOwn(it, METADATA)) setMetadata(it);
      return it;
    };
    var enable = function() {
      meta.enable = function() {
      };
      REQUIRED = true;
      var getOwnPropertyNames = getOwnPropertyNamesModule.f;
      var splice = uncurryThis([].splice);
      var test = {};
      test[METADATA] = 1;
      if (getOwnPropertyNames(test).length) {
        getOwnPropertyNamesModule.f = function(it) {
          var result = getOwnPropertyNames(it);
          for (var i = 0, length = result.length; i < length; i++) {
            if (result[i] === METADATA) {
              splice(result, i, 1);
              break;
            }
          }
          return result;
        };
        $({
          target: "Object",
          stat: true,
          forced: true
        }, {
          getOwnPropertyNames: getOwnPropertyNamesExternalModule.f
        });
      }
    };
    var meta = module.exports = {
      enable,
      fastKey,
      getWeakData,
      onFreeze
    };
    hiddenKeys[METADATA] = true;
  }
});

export {
  require_internal_metadata
};
//# sourceMappingURL=chunk-YGYPGFD2.js.map
