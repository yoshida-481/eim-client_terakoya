import {
  require_es_json_to_string_tag,
  require_es_symbol
} from "./chunk-JOL3OR4M.js";
import {
  require_es_reflect_to_string_tag
} from "./chunk-KKS5COGJ.js";
import {
  require_es_math_to_string_tag
} from "./chunk-DI6HPGHT.js";
import {
  require_same_value
} from "./chunk-IXACK6AY.js";
import {
  require_environment_webkit_version
} from "./chunk-DBDY7KDW.js";
import {
  require_create_property
} from "./chunk-45DNTKU3.js";
import "./chunk-MPAR7FPC.js";
import {
  require_internal_metadata
} from "./chunk-YGYPGFD2.js";
import {
  require_array_buffer_non_extensible,
  require_freezing,
  require_object_is_extensible
} from "./chunk-GPYUX3T7.js";
import {
  require_object_get_own_property_names_external
} from "./chunk-GYN7VWKI.js";
import {
  require_iterate
} from "./chunk-3DNXURTP.js";
import "./chunk-V7V7HOLZ.js";
import "./chunk-ZMV7AIVQ.js";
import {
  require_define_built_in_accessor
} from "./chunk-XIS6K74X.js";
import "./chunk-K4HCWTBL.js";
import {
  require_correct_prototype_getter,
  require_object_get_prototype_of
} from "./chunk-KTBTE3ID.js";
import "./chunk-IP7WRSH3.js";
import {
  require_es_object_to_string
} from "./chunk-W5WTIVVC.js";
import {
  require_object_create,
  require_object_define_properties,
  require_object_keys
} from "./chunk-5J3DNA3C.js";
import "./chunk-YD4VTJX4.js";
import {
  require_is_possible_prototype,
  require_object_set_prototype_of
} from "./chunk-LJACIHUK.js";
import "./chunk-L2Q7U5JX.js";
import "./chunk-OW7VFTLO.js";
import {
  require_path
} from "./chunk-N7EDGOTA.js";
import {
  require_a_callable,
  require_classof_raw,
  require_descriptors,
  require_export,
  require_fails,
  require_function_call,
  require_function_uncurry_this,
  require_get_built_in,
  require_global_this,
  require_has_own_property,
  require_indexed_object,
  require_is_object,
  require_is_pure,
  require_object_define_property,
  require_object_get_own_property_descriptor,
  require_object_get_own_property_symbols,
  require_object_property_is_enumerable,
  require_own_keys,
  require_require_object_coercible,
  require_to_indexed_object,
  require_to_object,
  require_to_property_key
} from "./chunk-SYAKHIZ5.js";
import {
  __commonJS
} from "./chunk-F52B2RLG.js";

// node_modules/core-js/internals/object-assign.js
var require_object_assign = __commonJS({
  "node_modules/core-js/internals/object-assign.js"(exports, module) {
    "use strict";
    var DESCRIPTORS = require_descriptors();
    var uncurryThis = require_function_uncurry_this();
    var call = require_function_call();
    var fails = require_fails();
    var objectKeys = require_object_keys();
    var getOwnPropertySymbolsModule = require_object_get_own_property_symbols();
    var propertyIsEnumerableModule = require_object_property_is_enumerable();
    var toObject = require_to_object();
    var IndexedObject = require_indexed_object();
    var $assign = Object.assign;
    var defineProperty = Object.defineProperty;
    var concat = uncurryThis([].concat);
    module.exports = !$assign || fails(function() {
      if (DESCRIPTORS && $assign({
        b: 1
      }, $assign(defineProperty({}, "a", {
        enumerable: true,
        get: function() {
          defineProperty(this, "b", {
            value: 3,
            enumerable: false
          });
        }
      }), {
        b: 2
      })).b !== 1) return true;
      var A = {};
      var B = {};
      var symbol = Symbol("assign detection");
      var alphabet = "abcdefghijklmnopqrst";
      A[symbol] = 7;
      alphabet.split("").forEach(function(chr) {
        B[chr] = chr;
      });
      return $assign({}, A)[symbol] !== 7 || objectKeys($assign({}, B)).join("") !== alphabet;
    }) ? function assign(target, source) {
      var T = toObject(target);
      var argumentsLength = arguments.length;
      var index = 1;
      var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
      var propertyIsEnumerable = propertyIsEnumerableModule.f;
      while (argumentsLength > index) {
        var S = IndexedObject(arguments[index++]);
        var keys = getOwnPropertySymbols ? concat(objectKeys(S), getOwnPropertySymbols(S)) : objectKeys(S);
        var length = keys.length;
        var j = 0;
        var key;
        while (length > j) {
          key = keys[j++];
          if (!DESCRIPTORS || call(propertyIsEnumerable, S, key)) T[key] = S[key];
        }
      }
      return T;
    } : $assign;
  }
});

// node_modules/core-js/modules/es.object.assign.js
var require_es_object_assign = __commonJS({
  "node_modules/core-js/modules/es.object.assign.js"() {
    "use strict";
    var $ = require_export();
    var assign = require_object_assign();
    $({
      target: "Object",
      stat: true,
      arity: 2,
      forced: Object.assign !== assign
    }, {
      assign
    });
  }
});

// node_modules/core-js/modules/es.object.create.js
var require_es_object_create = __commonJS({
  "node_modules/core-js/modules/es.object.create.js"() {
    "use strict";
    var $ = require_export();
    var DESCRIPTORS = require_descriptors();
    var create = require_object_create();
    $({
      target: "Object",
      stat: true,
      sham: !DESCRIPTORS
    }, {
      create
    });
  }
});

// node_modules/core-js/modules/es.object.define-property.js
var require_es_object_define_property = __commonJS({
  "node_modules/core-js/modules/es.object.define-property.js"() {
    "use strict";
    var $ = require_export();
    var DESCRIPTORS = require_descriptors();
    var defineProperty = require_object_define_property().f;
    $({
      target: "Object",
      stat: true,
      forced: Object.defineProperty !== defineProperty,
      sham: !DESCRIPTORS
    }, {
      defineProperty
    });
  }
});

// node_modules/core-js/modules/es.object.define-properties.js
var require_es_object_define_properties = __commonJS({
  "node_modules/core-js/modules/es.object.define-properties.js"() {
    "use strict";
    var $ = require_export();
    var DESCRIPTORS = require_descriptors();
    var defineProperties = require_object_define_properties().f;
    $({
      target: "Object",
      stat: true,
      forced: Object.defineProperties !== defineProperties,
      sham: !DESCRIPTORS
    }, {
      defineProperties
    });
  }
});

// node_modules/core-js/internals/object-to-array.js
var require_object_to_array = __commonJS({
  "node_modules/core-js/internals/object-to-array.js"(exports, module) {
    "use strict";
    var DESCRIPTORS = require_descriptors();
    var fails = require_fails();
    var uncurryThis = require_function_uncurry_this();
    var objectGetPrototypeOf = require_object_get_prototype_of();
    var objectKeys = require_object_keys();
    var toIndexedObject = require_to_indexed_object();
    var $propertyIsEnumerable = require_object_property_is_enumerable().f;
    var propertyIsEnumerable = uncurryThis($propertyIsEnumerable);
    var push = uncurryThis([].push);
    var IE_BUG = DESCRIPTORS && fails(function() {
      var O = /* @__PURE__ */ Object.create(null);
      O[2] = 2;
      return !propertyIsEnumerable(O, 2);
    });
    var createMethod = function(TO_ENTRIES) {
      return function(it) {
        var O = toIndexedObject(it);
        var keys = objectKeys(O);
        var IE_WORKAROUND = IE_BUG && objectGetPrototypeOf(O) === null;
        var length = keys.length;
        var i = 0;
        var result = [];
        var key;
        while (length > i) {
          key = keys[i++];
          if (!DESCRIPTORS || (IE_WORKAROUND ? key in O : propertyIsEnumerable(O, key))) {
            push(result, TO_ENTRIES ? [key, O[key]] : O[key]);
          }
        }
        return result;
      };
    };
    module.exports = {
      // `Object.entries` method
      // https://tc39.es/ecma262/#sec-object.entries
      entries: createMethod(true),
      // `Object.values` method
      // https://tc39.es/ecma262/#sec-object.values
      values: createMethod(false)
    };
  }
});

// node_modules/core-js/modules/es.object.entries.js
var require_es_object_entries = __commonJS({
  "node_modules/core-js/modules/es.object.entries.js"() {
    "use strict";
    var $ = require_export();
    var $entries = require_object_to_array().entries;
    $({
      target: "Object",
      stat: true
    }, {
      entries: function entries(O) {
        return $entries(O);
      }
    });
  }
});

// node_modules/core-js/modules/es.object.freeze.js
var require_es_object_freeze = __commonJS({
  "node_modules/core-js/modules/es.object.freeze.js"() {
    "use strict";
    var $ = require_export();
    var FREEZING = require_freezing();
    var fails = require_fails();
    var isObject = require_is_object();
    var onFreeze = require_internal_metadata().onFreeze;
    var $freeze = Object.freeze;
    var FAILS_ON_PRIMITIVES = fails(function() {
      $freeze(1);
    });
    $({
      target: "Object",
      stat: true,
      forced: FAILS_ON_PRIMITIVES,
      sham: !FREEZING
    }, {
      freeze: function freeze(it) {
        return $freeze && isObject(it) ? $freeze(onFreeze(it)) : it;
      }
    });
  }
});

// node_modules/core-js/modules/es.object.from-entries.js
var require_es_object_from_entries = __commonJS({
  "node_modules/core-js/modules/es.object.from-entries.js"() {
    "use strict";
    var $ = require_export();
    var iterate = require_iterate();
    var createProperty = require_create_property();
    $({
      target: "Object",
      stat: true
    }, {
      fromEntries: function fromEntries(iterable) {
        var obj = {};
        iterate(iterable, function(k, v) {
          createProperty(obj, k, v);
        }, {
          AS_ENTRIES: true
        });
        return obj;
      }
    });
  }
});

// node_modules/core-js/modules/es.object.get-own-property-descriptor.js
var require_es_object_get_own_property_descriptor = __commonJS({
  "node_modules/core-js/modules/es.object.get-own-property-descriptor.js"() {
    "use strict";
    var $ = require_export();
    var fails = require_fails();
    var toIndexedObject = require_to_indexed_object();
    var nativeGetOwnPropertyDescriptor = require_object_get_own_property_descriptor().f;
    var DESCRIPTORS = require_descriptors();
    var FORCED = !DESCRIPTORS || fails(function() {
      nativeGetOwnPropertyDescriptor(1);
    });
    $({
      target: "Object",
      stat: true,
      forced: FORCED,
      sham: !DESCRIPTORS
    }, {
      getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
        return nativeGetOwnPropertyDescriptor(toIndexedObject(it), key);
      }
    });
  }
});

// node_modules/core-js/modules/es.object.get-own-property-descriptors.js
var require_es_object_get_own_property_descriptors = __commonJS({
  "node_modules/core-js/modules/es.object.get-own-property-descriptors.js"() {
    "use strict";
    var $ = require_export();
    var DESCRIPTORS = require_descriptors();
    var ownKeys = require_own_keys();
    var toIndexedObject = require_to_indexed_object();
    var getOwnPropertyDescriptorModule = require_object_get_own_property_descriptor();
    var createProperty = require_create_property();
    $({
      target: "Object",
      stat: true,
      sham: !DESCRIPTORS
    }, {
      getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
        var O = toIndexedObject(object);
        var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
        var keys = ownKeys(O);
        var result = {};
        var index = 0;
        var key, descriptor;
        while (keys.length > index) {
          descriptor = getOwnPropertyDescriptor(O, key = keys[index++]);
          if (descriptor !== void 0) createProperty(result, key, descriptor);
        }
        return result;
      }
    });
  }
});

// node_modules/core-js/modules/es.object.get-own-property-names.js
var require_es_object_get_own_property_names = __commonJS({
  "node_modules/core-js/modules/es.object.get-own-property-names.js"() {
    "use strict";
    var $ = require_export();
    var fails = require_fails();
    var getOwnPropertyNames = require_object_get_own_property_names_external().f;
    var FAILS_ON_PRIMITIVES = fails(function() {
      return !Object.getOwnPropertyNames(1);
    });
    $({
      target: "Object",
      stat: true,
      forced: FAILS_ON_PRIMITIVES
    }, {
      getOwnPropertyNames
    });
  }
});

// node_modules/core-js/modules/es.object.get-prototype-of.js
var require_es_object_get_prototype_of = __commonJS({
  "node_modules/core-js/modules/es.object.get-prototype-of.js"() {
    "use strict";
    var $ = require_export();
    var fails = require_fails();
    var toObject = require_to_object();
    var nativeGetPrototypeOf = require_object_get_prototype_of();
    var CORRECT_PROTOTYPE_GETTER = require_correct_prototype_getter();
    var FAILS_ON_PRIMITIVES = fails(function() {
      nativeGetPrototypeOf(1);
    });
    $({
      target: "Object",
      stat: true,
      forced: FAILS_ON_PRIMITIVES,
      sham: !CORRECT_PROTOTYPE_GETTER
    }, {
      getPrototypeOf: function getPrototypeOf(it) {
        return nativeGetPrototypeOf(toObject(it));
      }
    });
  }
});

// node_modules/core-js/modules/es.object.group-by.js
var require_es_object_group_by = __commonJS({
  "node_modules/core-js/modules/es.object.group-by.js"() {
    "use strict";
    var $ = require_export();
    var getBuiltIn = require_get_built_in();
    var uncurryThis = require_function_uncurry_this();
    var aCallable = require_a_callable();
    var requireObjectCoercible = require_require_object_coercible();
    var toPropertyKey = require_to_property_key();
    var iterate = require_iterate();
    var fails = require_fails();
    var nativeGroupBy = Object.groupBy;
    var create = getBuiltIn("Object", "create");
    var push = uncurryThis([].push);
    var DOES_NOT_WORK_WITH_PRIMITIVES = !nativeGroupBy || fails(function() {
      return nativeGroupBy("ab", function(it) {
        return it;
      }).a.length !== 1;
    });
    $({
      target: "Object",
      stat: true,
      forced: DOES_NOT_WORK_WITH_PRIMITIVES
    }, {
      groupBy: function groupBy(items, callbackfn) {
        requireObjectCoercible(items);
        aCallable(callbackfn);
        var obj = create(null);
        var k = 0;
        iterate(items, function(value) {
          var key = toPropertyKey(callbackfn(value, k++));
          if (key in obj) push(obj[key], value);
          else obj[key] = [value];
        });
        return obj;
      }
    });
  }
});

// node_modules/core-js/modules/es.object.has-own.js
var require_es_object_has_own = __commonJS({
  "node_modules/core-js/modules/es.object.has-own.js"() {
    "use strict";
    var $ = require_export();
    var hasOwn = require_has_own_property();
    $({
      target: "Object",
      stat: true
    }, {
      hasOwn
    });
  }
});

// node_modules/core-js/modules/es.object.is.js
var require_es_object_is = __commonJS({
  "node_modules/core-js/modules/es.object.is.js"() {
    "use strict";
    var $ = require_export();
    var is = require_same_value();
    $({
      target: "Object",
      stat: true
    }, {
      is
    });
  }
});

// node_modules/core-js/modules/es.object.is-extensible.js
var require_es_object_is_extensible = __commonJS({
  "node_modules/core-js/modules/es.object.is-extensible.js"() {
    "use strict";
    var $ = require_export();
    var $isExtensible = require_object_is_extensible();
    $({
      target: "Object",
      stat: true,
      forced: Object.isExtensible !== $isExtensible
    }, {
      isExtensible: $isExtensible
    });
  }
});

// node_modules/core-js/modules/es.object.is-frozen.js
var require_es_object_is_frozen = __commonJS({
  "node_modules/core-js/modules/es.object.is-frozen.js"() {
    "use strict";
    var $ = require_export();
    var fails = require_fails();
    var isObject = require_is_object();
    var classof = require_classof_raw();
    var ARRAY_BUFFER_NON_EXTENSIBLE = require_array_buffer_non_extensible();
    var $isFrozen = Object.isFrozen;
    var FORCED = ARRAY_BUFFER_NON_EXTENSIBLE || fails(function() {
      $isFrozen(1);
    });
    $({
      target: "Object",
      stat: true,
      forced: FORCED
    }, {
      isFrozen: function isFrozen(it) {
        if (!isObject(it)) return true;
        if (ARRAY_BUFFER_NON_EXTENSIBLE && classof(it) === "ArrayBuffer") return true;
        return $isFrozen ? $isFrozen(it) : false;
      }
    });
  }
});

// node_modules/core-js/modules/es.object.is-sealed.js
var require_es_object_is_sealed = __commonJS({
  "node_modules/core-js/modules/es.object.is-sealed.js"() {
    "use strict";
    var $ = require_export();
    var fails = require_fails();
    var isObject = require_is_object();
    var classof = require_classof_raw();
    var ARRAY_BUFFER_NON_EXTENSIBLE = require_array_buffer_non_extensible();
    var $isSealed = Object.isSealed;
    var FORCED = ARRAY_BUFFER_NON_EXTENSIBLE || fails(function() {
      $isSealed(1);
    });
    $({
      target: "Object",
      stat: true,
      forced: FORCED
    }, {
      isSealed: function isSealed(it) {
        if (!isObject(it)) return true;
        if (ARRAY_BUFFER_NON_EXTENSIBLE && classof(it) === "ArrayBuffer") return true;
        return $isSealed ? $isSealed(it) : false;
      }
    });
  }
});

// node_modules/core-js/modules/es.object.keys.js
var require_es_object_keys = __commonJS({
  "node_modules/core-js/modules/es.object.keys.js"() {
    "use strict";
    var $ = require_export();
    var toObject = require_to_object();
    var nativeKeys = require_object_keys();
    var fails = require_fails();
    var FAILS_ON_PRIMITIVES = fails(function() {
      nativeKeys(1);
    });
    $({
      target: "Object",
      stat: true,
      forced: FAILS_ON_PRIMITIVES
    }, {
      keys: function keys(it) {
        return nativeKeys(toObject(it));
      }
    });
  }
});

// node_modules/core-js/modules/es.object.prevent-extensions.js
var require_es_object_prevent_extensions = __commonJS({
  "node_modules/core-js/modules/es.object.prevent-extensions.js"() {
    "use strict";
    var $ = require_export();
    var isObject = require_is_object();
    var onFreeze = require_internal_metadata().onFreeze;
    var FREEZING = require_freezing();
    var fails = require_fails();
    var $preventExtensions = Object.preventExtensions;
    var FAILS_ON_PRIMITIVES = fails(function() {
      $preventExtensions(1);
    });
    $({
      target: "Object",
      stat: true,
      forced: FAILS_ON_PRIMITIVES,
      sham: !FREEZING
    }, {
      preventExtensions: function preventExtensions(it) {
        return $preventExtensions && isObject(it) ? $preventExtensions(onFreeze(it)) : it;
      }
    });
  }
});

// node_modules/core-js/modules/es.object.proto.js
var require_es_object_proto = __commonJS({
  "node_modules/core-js/modules/es.object.proto.js"() {
    "use strict";
    var DESCRIPTORS = require_descriptors();
    var defineBuiltInAccessor = require_define_built_in_accessor();
    var isObject = require_is_object();
    var isPossiblePrototype = require_is_possible_prototype();
    var toObject = require_to_object();
    var requireObjectCoercible = require_require_object_coercible();
    var getPrototypeOf = Object.getPrototypeOf;
    var setPrototypeOf = Object.setPrototypeOf;
    var ObjectPrototype = Object.prototype;
    var PROTO = "__proto__";
    if (DESCRIPTORS && getPrototypeOf && setPrototypeOf && !(PROTO in ObjectPrototype)) try {
      defineBuiltInAccessor(ObjectPrototype, PROTO, {
        configurable: true,
        get: function __proto__() {
          return getPrototypeOf(toObject(this));
        },
        set: function __proto__(proto) {
          var O = requireObjectCoercible(this);
          if (isPossiblePrototype(proto) && isObject(O)) {
            setPrototypeOf(O, proto);
          }
        }
      });
    } catch (error) {
    }
  }
});

// node_modules/core-js/modules/es.object.seal.js
var require_es_object_seal = __commonJS({
  "node_modules/core-js/modules/es.object.seal.js"() {
    "use strict";
    var $ = require_export();
    var isObject = require_is_object();
    var onFreeze = require_internal_metadata().onFreeze;
    var FREEZING = require_freezing();
    var fails = require_fails();
    var $seal = Object.seal;
    var FAILS_ON_PRIMITIVES = fails(function() {
      $seal(1);
    });
    $({
      target: "Object",
      stat: true,
      forced: FAILS_ON_PRIMITIVES,
      sham: !FREEZING
    }, {
      seal: function seal(it) {
        return $seal && isObject(it) ? $seal(onFreeze(it)) : it;
      }
    });
  }
});

// node_modules/core-js/modules/es.object.set-prototype-of.js
var require_es_object_set_prototype_of = __commonJS({
  "node_modules/core-js/modules/es.object.set-prototype-of.js"() {
    "use strict";
    var $ = require_export();
    var setPrototypeOf = require_object_set_prototype_of();
    $({
      target: "Object",
      stat: true
    }, {
      setPrototypeOf
    });
  }
});

// node_modules/core-js/modules/es.object.values.js
var require_es_object_values = __commonJS({
  "node_modules/core-js/modules/es.object.values.js"() {
    "use strict";
    var $ = require_export();
    var $values = require_object_to_array().values;
    $({
      target: "Object",
      stat: true
    }, {
      values: function values(O) {
        return $values(O);
      }
    });
  }
});

// node_modules/core-js/internals/object-prototype-accessors-forced.js
var require_object_prototype_accessors_forced = __commonJS({
  "node_modules/core-js/internals/object-prototype-accessors-forced.js"(exports, module) {
    "use strict";
    var IS_PURE = require_is_pure();
    var globalThis = require_global_this();
    var fails = require_fails();
    var WEBKIT = require_environment_webkit_version();
    module.exports = IS_PURE || !fails(function() {
      if (WEBKIT && WEBKIT < 535) return;
      var key = Math.random();
      __defineSetter__.call(null, key, function() {
      });
      delete globalThis[key];
    });
  }
});

// node_modules/core-js/modules/es.object.define-getter.js
var require_es_object_define_getter = __commonJS({
  "node_modules/core-js/modules/es.object.define-getter.js"() {
    "use strict";
    var $ = require_export();
    var DESCRIPTORS = require_descriptors();
    var FORCED = require_object_prototype_accessors_forced();
    var aCallable = require_a_callable();
    var toObject = require_to_object();
    var definePropertyModule = require_object_define_property();
    if (DESCRIPTORS) {
      $({
        target: "Object",
        proto: true,
        forced: FORCED
      }, {
        __defineGetter__: function __defineGetter__(P, getter) {
          definePropertyModule.f(toObject(this), P, {
            get: aCallable(getter),
            enumerable: true,
            configurable: true
          });
        }
      });
    }
  }
});

// node_modules/core-js/modules/es.object.define-setter.js
var require_es_object_define_setter = __commonJS({
  "node_modules/core-js/modules/es.object.define-setter.js"() {
    "use strict";
    var $ = require_export();
    var DESCRIPTORS = require_descriptors();
    var FORCED = require_object_prototype_accessors_forced();
    var aCallable = require_a_callable();
    var toObject = require_to_object();
    var definePropertyModule = require_object_define_property();
    if (DESCRIPTORS) {
      $({
        target: "Object",
        proto: true,
        forced: FORCED
      }, {
        __defineSetter__: function __defineSetter__2(P, setter) {
          definePropertyModule.f(toObject(this), P, {
            set: aCallable(setter),
            enumerable: true,
            configurable: true
          });
        }
      });
    }
  }
});

// node_modules/core-js/modules/es.object.lookup-getter.js
var require_es_object_lookup_getter = __commonJS({
  "node_modules/core-js/modules/es.object.lookup-getter.js"() {
    "use strict";
    var $ = require_export();
    var DESCRIPTORS = require_descriptors();
    var FORCED = require_object_prototype_accessors_forced();
    var toObject = require_to_object();
    var toPropertyKey = require_to_property_key();
    var getPrototypeOf = require_object_get_prototype_of();
    var getOwnPropertyDescriptor = require_object_get_own_property_descriptor().f;
    if (DESCRIPTORS) {
      $({
        target: "Object",
        proto: true,
        forced: FORCED
      }, {
        __lookupGetter__: function __lookupGetter__(P) {
          var O = toObject(this);
          var key = toPropertyKey(P);
          var desc;
          do {
            if (desc = getOwnPropertyDescriptor(O, key)) return desc.get;
          } while (O = getPrototypeOf(O));
        }
      });
    }
  }
});

// node_modules/core-js/modules/es.object.lookup-setter.js
var require_es_object_lookup_setter = __commonJS({
  "node_modules/core-js/modules/es.object.lookup-setter.js"() {
    "use strict";
    var $ = require_export();
    var DESCRIPTORS = require_descriptors();
    var FORCED = require_object_prototype_accessors_forced();
    var toObject = require_to_object();
    var toPropertyKey = require_to_property_key();
    var getPrototypeOf = require_object_get_prototype_of();
    var getOwnPropertyDescriptor = require_object_get_own_property_descriptor().f;
    if (DESCRIPTORS) {
      $({
        target: "Object",
        proto: true,
        forced: FORCED
      }, {
        __lookupSetter__: function __lookupSetter__(P) {
          var O = toObject(this);
          var key = toPropertyKey(P);
          var desc;
          do {
            if (desc = getOwnPropertyDescriptor(O, key)) return desc.set;
          } while (O = getPrototypeOf(O));
        }
      });
    }
  }
});

// node_modules/core-js/es/object/index.js
var require_object = __commonJS({
  "node_modules/core-js/es/object/index.js"(exports, module) {
    require_es_symbol();
    require_es_object_assign();
    require_es_object_create();
    require_es_object_define_property();
    require_es_object_define_properties();
    require_es_object_entries();
    require_es_object_freeze();
    require_es_object_from_entries();
    require_es_object_get_own_property_descriptor();
    require_es_object_get_own_property_descriptors();
    require_es_object_get_own_property_names();
    require_es_object_get_prototype_of();
    require_es_object_group_by();
    require_es_object_has_own();
    require_es_object_is();
    require_es_object_is_extensible();
    require_es_object_is_frozen();
    require_es_object_is_sealed();
    require_es_object_keys();
    require_es_object_prevent_extensions();
    require_es_object_proto();
    require_es_object_seal();
    require_es_object_set_prototype_of();
    require_es_object_values();
    require_es_object_to_string();
    require_es_object_define_getter();
    require_es_object_define_setter();
    require_es_object_lookup_getter();
    require_es_object_lookup_setter();
    require_es_json_to_string_tag();
    require_es_math_to_string_tag();
    require_es_reflect_to_string_tag();
    var path = require_path();
    module.exports = path.Object;
  }
});
export default require_object();
//# sourceMappingURL=core-js_es_object.js.map
