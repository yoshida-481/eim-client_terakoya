import {
  require_es_json_to_string_tag,
  require_es_symbol,
  require_symbol_define_to_primitive,
  require_well_known_symbol_define
} from "./chunk-JOL3OR4M.js";
import {
  require_es_reflect_to_string_tag
} from "./chunk-KKS5COGJ.js";
import {
  require_es_math_to_string_tag
} from "./chunk-DI6HPGHT.js";
import {
  require_es_array_concat
} from "./chunk-BZL57W3L.js";
import "./chunk-45DNTKU3.js";
import "./chunk-MPAR7FPC.js";
import "./chunk-GYN7VWKI.js";
import "./chunk-V7V7HOLZ.js";
import "./chunk-ZMV7AIVQ.js";
import {
  require_define_built_in_accessor
} from "./chunk-XIS6K74X.js";
import "./chunk-IP7WRSH3.js";
import {
  require_es_object_to_string
} from "./chunk-W5WTIVVC.js";
import "./chunk-5J3DNA3C.js";
import {
  require_set_to_string_tag
} from "./chunk-YD4VTJX4.js";
import {
  require_to_string
} from "./chunk-L2Q7U5JX.js";
import "./chunk-OW7VFTLO.js";
import {
  require_path
} from "./chunk-N7EDGOTA.js";
import {
  require_copy_constructor_properties,
  require_descriptors,
  require_export,
  require_function_uncurry_this,
  require_get_built_in,
  require_global_this,
  require_has_own_property,
  require_is_callable,
  require_object_define_property,
  require_object_get_own_property_descriptor,
  require_object_is_prototype_of
} from "./chunk-SYAKHIZ5.js";
import {
  __commonJS
} from "./chunk-F52B2RLG.js";

// node_modules/core-js/modules/es.symbol.async-dispose.js
var require_es_symbol_async_dispose = __commonJS({
  "node_modules/core-js/modules/es.symbol.async-dispose.js"() {
    "use strict";
    var globalThis = require_global_this();
    var defineWellKnownSymbol = require_well_known_symbol_define();
    var defineProperty = require_object_define_property().f;
    var getOwnPropertyDescriptor = require_object_get_own_property_descriptor().f;
    var Symbol = globalThis.Symbol;
    defineWellKnownSymbol("asyncDispose");
    if (Symbol) {
      descriptor = getOwnPropertyDescriptor(Symbol, "asyncDispose");
      if (descriptor.enumerable && descriptor.configurable && descriptor.writable) {
        defineProperty(Symbol, "asyncDispose", {
          value: descriptor.value,
          enumerable: false,
          configurable: false,
          writable: false
        });
      }
    }
    var descriptor;
  }
});

// node_modules/core-js/modules/es.symbol.async-iterator.js
var require_es_symbol_async_iterator = __commonJS({
  "node_modules/core-js/modules/es.symbol.async-iterator.js"() {
    "use strict";
    var defineWellKnownSymbol = require_well_known_symbol_define();
    defineWellKnownSymbol("asyncIterator");
  }
});

// node_modules/core-js/modules/es.symbol.description.js
var require_es_symbol_description = __commonJS({
  "node_modules/core-js/modules/es.symbol.description.js"() {
    "use strict";
    var $ = require_export();
    var DESCRIPTORS = require_descriptors();
    var globalThis = require_global_this();
    var uncurryThis = require_function_uncurry_this();
    var hasOwn = require_has_own_property();
    var isCallable = require_is_callable();
    var isPrototypeOf = require_object_is_prototype_of();
    var toString = require_to_string();
    var defineBuiltInAccessor = require_define_built_in_accessor();
    var copyConstructorProperties = require_copy_constructor_properties();
    var NativeSymbol = globalThis.Symbol;
    var SymbolPrototype = NativeSymbol && NativeSymbol.prototype;
    if (DESCRIPTORS && isCallable(NativeSymbol) && (!("description" in SymbolPrototype) || // Safari 12 bug
    NativeSymbol().description !== void 0)) {
      EmptyStringDescriptionStore = {};
      SymbolWrapper = function Symbol() {
        var description = arguments.length < 1 || arguments[0] === void 0 ? void 0 : toString(arguments[0]);
        var result = isPrototypeOf(SymbolPrototype, this) ? new NativeSymbol(description) : description === void 0 ? NativeSymbol() : NativeSymbol(description);
        if (description === "") EmptyStringDescriptionStore[result] = true;
        return result;
      };
      copyConstructorProperties(SymbolWrapper, NativeSymbol);
      SymbolWrapper.prototype = SymbolPrototype;
      SymbolPrototype.constructor = SymbolWrapper;
      NATIVE_SYMBOL = String(NativeSymbol("description detection")) === "Symbol(description detection)";
      thisSymbolValue = uncurryThis(SymbolPrototype.valueOf);
      symbolDescriptiveString = uncurryThis(SymbolPrototype.toString);
      regexp = /^Symbol\((.*)\)[^)]+$/;
      replace = uncurryThis("".replace);
      stringSlice = uncurryThis("".slice);
      defineBuiltInAccessor(SymbolPrototype, "description", {
        configurable: true,
        get: function description() {
          var symbol = thisSymbolValue(this);
          if (hasOwn(EmptyStringDescriptionStore, symbol)) return "";
          var string = symbolDescriptiveString(symbol);
          var desc = NATIVE_SYMBOL ? stringSlice(string, 7, -1) : replace(string, regexp, "$1");
          return desc === "" ? void 0 : desc;
        }
      });
      $({
        global: true,
        constructor: true,
        forced: true
      }, {
        Symbol: SymbolWrapper
      });
    }
    var EmptyStringDescriptionStore;
    var SymbolWrapper;
    var NATIVE_SYMBOL;
    var thisSymbolValue;
    var symbolDescriptiveString;
    var regexp;
    var replace;
    var stringSlice;
  }
});

// node_modules/core-js/modules/es.symbol.dispose.js
var require_es_symbol_dispose = __commonJS({
  "node_modules/core-js/modules/es.symbol.dispose.js"() {
    "use strict";
    var globalThis = require_global_this();
    var defineWellKnownSymbol = require_well_known_symbol_define();
    var defineProperty = require_object_define_property().f;
    var getOwnPropertyDescriptor = require_object_get_own_property_descriptor().f;
    var Symbol = globalThis.Symbol;
    defineWellKnownSymbol("dispose");
    if (Symbol) {
      descriptor = getOwnPropertyDescriptor(Symbol, "dispose");
      if (descriptor.enumerable && descriptor.configurable && descriptor.writable) {
        defineProperty(Symbol, "dispose", {
          value: descriptor.value,
          enumerable: false,
          configurable: false,
          writable: false
        });
      }
    }
    var descriptor;
  }
});

// node_modules/core-js/modules/es.symbol.has-instance.js
var require_es_symbol_has_instance = __commonJS({
  "node_modules/core-js/modules/es.symbol.has-instance.js"() {
    "use strict";
    var defineWellKnownSymbol = require_well_known_symbol_define();
    defineWellKnownSymbol("hasInstance");
  }
});

// node_modules/core-js/modules/es.symbol.is-concat-spreadable.js
var require_es_symbol_is_concat_spreadable = __commonJS({
  "node_modules/core-js/modules/es.symbol.is-concat-spreadable.js"() {
    "use strict";
    var defineWellKnownSymbol = require_well_known_symbol_define();
    defineWellKnownSymbol("isConcatSpreadable");
  }
});

// node_modules/core-js/modules/es.symbol.iterator.js
var require_es_symbol_iterator = __commonJS({
  "node_modules/core-js/modules/es.symbol.iterator.js"() {
    "use strict";
    var defineWellKnownSymbol = require_well_known_symbol_define();
    defineWellKnownSymbol("iterator");
  }
});

// node_modules/core-js/modules/es.symbol.match.js
var require_es_symbol_match = __commonJS({
  "node_modules/core-js/modules/es.symbol.match.js"() {
    "use strict";
    var defineWellKnownSymbol = require_well_known_symbol_define();
    defineWellKnownSymbol("match");
  }
});

// node_modules/core-js/modules/es.symbol.match-all.js
var require_es_symbol_match_all = __commonJS({
  "node_modules/core-js/modules/es.symbol.match-all.js"() {
    "use strict";
    var defineWellKnownSymbol = require_well_known_symbol_define();
    defineWellKnownSymbol("matchAll");
  }
});

// node_modules/core-js/modules/es.symbol.replace.js
var require_es_symbol_replace = __commonJS({
  "node_modules/core-js/modules/es.symbol.replace.js"() {
    "use strict";
    var defineWellKnownSymbol = require_well_known_symbol_define();
    defineWellKnownSymbol("replace");
  }
});

// node_modules/core-js/modules/es.symbol.search.js
var require_es_symbol_search = __commonJS({
  "node_modules/core-js/modules/es.symbol.search.js"() {
    "use strict";
    var defineWellKnownSymbol = require_well_known_symbol_define();
    defineWellKnownSymbol("search");
  }
});

// node_modules/core-js/modules/es.symbol.species.js
var require_es_symbol_species = __commonJS({
  "node_modules/core-js/modules/es.symbol.species.js"() {
    "use strict";
    var defineWellKnownSymbol = require_well_known_symbol_define();
    defineWellKnownSymbol("species");
  }
});

// node_modules/core-js/modules/es.symbol.split.js
var require_es_symbol_split = __commonJS({
  "node_modules/core-js/modules/es.symbol.split.js"() {
    "use strict";
    var defineWellKnownSymbol = require_well_known_symbol_define();
    defineWellKnownSymbol("split");
  }
});

// node_modules/core-js/modules/es.symbol.to-primitive.js
var require_es_symbol_to_primitive = __commonJS({
  "node_modules/core-js/modules/es.symbol.to-primitive.js"() {
    "use strict";
    var defineWellKnownSymbol = require_well_known_symbol_define();
    var defineSymbolToPrimitive = require_symbol_define_to_primitive();
    defineWellKnownSymbol("toPrimitive");
    defineSymbolToPrimitive();
  }
});

// node_modules/core-js/modules/es.symbol.to-string-tag.js
var require_es_symbol_to_string_tag = __commonJS({
  "node_modules/core-js/modules/es.symbol.to-string-tag.js"() {
    "use strict";
    var getBuiltIn = require_get_built_in();
    var defineWellKnownSymbol = require_well_known_symbol_define();
    var setToStringTag = require_set_to_string_tag();
    defineWellKnownSymbol("toStringTag");
    setToStringTag(getBuiltIn("Symbol"), "Symbol");
  }
});

// node_modules/core-js/modules/es.symbol.unscopables.js
var require_es_symbol_unscopables = __commonJS({
  "node_modules/core-js/modules/es.symbol.unscopables.js"() {
    "use strict";
    var defineWellKnownSymbol = require_well_known_symbol_define();
    defineWellKnownSymbol("unscopables");
  }
});

// node_modules/core-js/es/symbol/index.js
var require_symbol = __commonJS({
  "node_modules/core-js/es/symbol/index.js"(exports, module) {
    require_es_array_concat();
    require_es_object_to_string();
    require_es_symbol();
    require_es_symbol_async_dispose();
    require_es_symbol_async_iterator();
    require_es_symbol_description();
    require_es_symbol_dispose();
    require_es_symbol_has_instance();
    require_es_symbol_is_concat_spreadable();
    require_es_symbol_iterator();
    require_es_symbol_match();
    require_es_symbol_match_all();
    require_es_symbol_replace();
    require_es_symbol_search();
    require_es_symbol_species();
    require_es_symbol_split();
    require_es_symbol_to_primitive();
    require_es_symbol_to_string_tag();
    require_es_symbol_unscopables();
    require_es_json_to_string_tag();
    require_es_math_to_string_tag();
    require_es_reflect_to_string_tag();
    var path = require_path();
    module.exports = path.Symbol;
  }
});
export default require_symbol();
//# sourceMappingURL=core-js_es_symbol.js.map
