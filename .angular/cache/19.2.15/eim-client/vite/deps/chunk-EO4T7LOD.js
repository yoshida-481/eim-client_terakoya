import {
  require_a_constructor
} from "./chunk-RWQHAGJX.js";
import {
  require_an_object,
  require_is_null_or_undefined,
  require_well_known_symbol
} from "./chunk-SYAKHIZ5.js";
import {
  __commonJS
} from "./chunk-F52B2RLG.js";

// node_modules/core-js/internals/species-constructor.js
var require_species_constructor = __commonJS({
  "node_modules/core-js/internals/species-constructor.js"(exports, module) {
    "use strict";
    var anObject = require_an_object();
    var aConstructor = require_a_constructor();
    var isNullOrUndefined = require_is_null_or_undefined();
    var wellKnownSymbol = require_well_known_symbol();
    var SPECIES = wellKnownSymbol("species");
    module.exports = function(O, defaultConstructor) {
      var C = anObject(O).constructor;
      var S;
      return C === void 0 || isNullOrUndefined(S = anObject(C)[SPECIES]) ? defaultConstructor : aConstructor(S);
    };
  }
});

export {
  require_species_constructor
};
//# sourceMappingURL=chunk-EO4T7LOD.js.map
