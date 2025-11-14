import {
  require_define_built_in_accessor
} from "./chunk-XIS6K74X.js";
import {
  require_function_bind
} from "./chunk-LF7IXTHJ.js";
import "./chunk-ZMV7AIVQ.js";
import {
  require_path
} from "./chunk-N7EDGOTA.js";
import {
  require_descriptors,
  require_export,
  require_function_name,
  require_function_uncurry_this,
  require_is_callable,
  require_is_object,
  require_make_built_in,
  require_object_define_property,
  require_object_is_prototype_of,
  require_well_known_symbol
} from "./chunk-SYAKHIZ5.js";
import {
  __commonJS
} from "./chunk-F52B2RLG.js";

// node_modules/core-js/modules/es.function.bind.js
var require_es_function_bind = __commonJS({
  "node_modules/core-js/modules/es.function.bind.js"() {
    "use strict";
    var $ = require_export();
    var bind = require_function_bind();
    $({
      target: "Function",
      proto: true,
      forced: Function.bind !== bind
    }, {
      bind
    });
  }
});

// node_modules/core-js/modules/es.function.name.js
var require_es_function_name = __commonJS({
  "node_modules/core-js/modules/es.function.name.js"() {
    "use strict";
    var DESCRIPTORS = require_descriptors();
    var FUNCTION_NAME_EXISTS = require_function_name().EXISTS;
    var uncurryThis = require_function_uncurry_this();
    var defineBuiltInAccessor = require_define_built_in_accessor();
    var FunctionPrototype = Function.prototype;
    var functionToString = uncurryThis(FunctionPrototype.toString);
    var nameRE = /function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/;
    var regExpExec = uncurryThis(nameRE.exec);
    var NAME = "name";
    if (DESCRIPTORS && !FUNCTION_NAME_EXISTS) {
      defineBuiltInAccessor(FunctionPrototype, NAME, {
        configurable: true,
        get: function() {
          try {
            return regExpExec(nameRE, functionToString(this))[1];
          } catch (error) {
            return "";
          }
        }
      });
    }
  }
});

// node_modules/core-js/modules/es.function.has-instance.js
var require_es_function_has_instance = __commonJS({
  "node_modules/core-js/modules/es.function.has-instance.js"() {
    "use strict";
    var isCallable = require_is_callable();
    var isObject = require_is_object();
    var definePropertyModule = require_object_define_property();
    var isPrototypeOf = require_object_is_prototype_of();
    var wellKnownSymbol = require_well_known_symbol();
    var makeBuiltIn = require_make_built_in();
    var HAS_INSTANCE = wellKnownSymbol("hasInstance");
    var FunctionPrototype = Function.prototype;
    if (!(HAS_INSTANCE in FunctionPrototype)) {
      definePropertyModule.f(FunctionPrototype, HAS_INSTANCE, {
        value: makeBuiltIn(function(O) {
          if (!isCallable(this) || !isObject(O)) return false;
          var P = this.prototype;
          return isObject(P) ? isPrototypeOf(P, O) : O instanceof this;
        }, HAS_INSTANCE)
      });
    }
  }
});

// node_modules/core-js/es/function/index.js
var require_function = __commonJS({
  "node_modules/core-js/es/function/index.js"(exports, module) {
    require_es_function_bind();
    require_es_function_name();
    require_es_function_has_instance();
    var path = require_path();
    module.exports = path.Function;
  }
});
export default require_function();
//# sourceMappingURL=core-js_es_function.js.map
