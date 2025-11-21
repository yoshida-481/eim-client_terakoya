import {
  require_array_species_create,
  require_create_property,
  require_is_array
} from "./chunk-XSK4SCEK.js";
import {
  require_environment_v8_version,
  require_export,
  require_fails,
  require_is_object,
  require_length_of_array_like,
  require_to_object,
  require_well_known_symbol
} from "./chunk-SYAKHIZ5.js";
import {
  __commonJS
} from "./chunk-F52B2RLG.js";

// node_modules/core-js/internals/does-not-exceed-safe-integer.js
var require_does_not_exceed_safe_integer = __commonJS({
  "node_modules/core-js/internals/does-not-exceed-safe-integer.js"(exports, module) {
    "use strict";
    var $TypeError = TypeError;
    var MAX_SAFE_INTEGER = 9007199254740991;
    module.exports = function(it) {
      if (it > MAX_SAFE_INTEGER) throw $TypeError("Maximum allowed index exceeded");
      return it;
    };
  }
});

// node_modules/core-js/internals/array-method-has-species-support.js
var require_array_method_has_species_support = __commonJS({
  "node_modules/core-js/internals/array-method-has-species-support.js"(exports, module) {
    "use strict";
    var fails = require_fails();
    var wellKnownSymbol = require_well_known_symbol();
    var V8_VERSION = require_environment_v8_version();
    var SPECIES = wellKnownSymbol("species");
    module.exports = function(METHOD_NAME) {
      return V8_VERSION >= 51 || !fails(function() {
        var array = [];
        var constructor = array.constructor = {};
        constructor[SPECIES] = function() {
          return {
            foo: 1
          };
        };
        return array[METHOD_NAME](Boolean).foo !== 1;
      });
    };
  }
});

// node_modules/core-js/modules/es.array.concat.js
var require_es_array_concat = __commonJS({
  "node_modules/core-js/modules/es.array.concat.js"() {
    "use strict";
    var $ = require_export();
    var fails = require_fails();
    var isArray = require_is_array();
    var isObject = require_is_object();
    var toObject = require_to_object();
    var lengthOfArrayLike = require_length_of_array_like();
    var doesNotExceedSafeInteger = require_does_not_exceed_safe_integer();
    var createProperty = require_create_property();
    var arraySpeciesCreate = require_array_species_create();
    var arrayMethodHasSpeciesSupport = require_array_method_has_species_support();
    var wellKnownSymbol = require_well_known_symbol();
    var V8_VERSION = require_environment_v8_version();
    var IS_CONCAT_SPREADABLE = wellKnownSymbol("isConcatSpreadable");
    var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION >= 51 || !fails(function() {
      var array = [];
      array[IS_CONCAT_SPREADABLE] = false;
      return array.concat()[0] !== array;
    });
    var isConcatSpreadable = function(O) {
      if (!isObject(O)) return false;
      var spreadable = O[IS_CONCAT_SPREADABLE];
      return spreadable !== void 0 ? !!spreadable : isArray(O);
    };
    var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !arrayMethodHasSpeciesSupport("concat");
    $({
      target: "Array",
      proto: true,
      arity: 1,
      forced: FORCED
    }, {
      // eslint-disable-next-line no-unused-vars -- required for `.length`
      concat: function concat(arg) {
        var O = toObject(this);
        var A = arraySpeciesCreate(O, 0);
        var n = 0;
        var i, k, length, len, E;
        for (i = -1, length = arguments.length; i < length; i++) {
          E = i === -1 ? O : arguments[i];
          if (isConcatSpreadable(E)) {
            len = lengthOfArrayLike(E);
            doesNotExceedSafeInteger(n + len);
            for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
          } else {
            doesNotExceedSafeInteger(n + 1);
            createProperty(A, n++, E);
          }
        }
        A.length = n;
        return A;
      }
    });
  }
});

export {
  require_does_not_exceed_safe_integer,
  require_array_method_has_species_support,
  require_es_array_concat
};
//# sourceMappingURL=chunk-5FNQ3CST.js.map
