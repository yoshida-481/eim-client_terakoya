import {
  require_es_reflect_to_string_tag
} from "./chunk-KKS5COGJ.js";
import {
  require_freezing,
  require_object_is_extensible
} from "./chunk-GPYUX3T7.js";
import {
  require_correct_prototype_getter,
  require_object_get_prototype_of
} from "./chunk-KTBTE3ID.js";
import {
  require_es_object_to_string
} from "./chunk-W5WTIVVC.js";
import "./chunk-YD4VTJX4.js";
import {
  require_a_constructor
} from "./chunk-RWQHAGJX.js";
import {
  require_function_apply
} from "./chunk-MPAR7FPC.js";
import {
  require_object_create
} from "./chunk-5J3DNA3C.js";
import {
  require_a_possible_prototype,
  require_object_set_prototype_of
} from "./chunk-LJACIHUK.js";
import "./chunk-OW7VFTLO.js";
import {
  require_function_bind
} from "./chunk-LF7IXTHJ.js";
import "./chunk-ZMV7AIVQ.js";
import {
  require_path
} from "./chunk-N7EDGOTA.js";
import {
  require_a_callable,
  require_an_object,
  require_create_property_descriptor,
  require_descriptors,
  require_export,
  require_fails,
  require_function_call,
  require_get_built_in,
  require_has_own_property,
  require_is_object,
  require_object_define_property,
  require_object_get_own_property_descriptor,
  require_own_keys,
  require_to_property_key
} from "./chunk-SYAKHIZ5.js";
import {
  __commonJS
} from "./chunk-F52B2RLG.js";

// node_modules/core-js/modules/es.reflect.apply.js
var require_es_reflect_apply = __commonJS({
  "node_modules/core-js/modules/es.reflect.apply.js"() {
    "use strict";
    var $ = require_export();
    var functionApply = require_function_apply();
    var aCallable = require_a_callable();
    var anObject = require_an_object();
    var fails = require_fails();
    var OPTIONAL_ARGUMENTS_LIST = !fails(function() {
      Reflect.apply(function() {
      });
    });
    $({
      target: "Reflect",
      stat: true,
      forced: OPTIONAL_ARGUMENTS_LIST
    }, {
      apply: function apply(target, thisArgument, argumentsList) {
        return functionApply(aCallable(target), thisArgument, anObject(argumentsList));
      }
    });
  }
});

// node_modules/core-js/modules/es.reflect.construct.js
var require_es_reflect_construct = __commonJS({
  "node_modules/core-js/modules/es.reflect.construct.js"() {
    "use strict";
    var $ = require_export();
    var getBuiltIn = require_get_built_in();
    var apply = require_function_apply();
    var bind = require_function_bind();
    var aConstructor = require_a_constructor();
    var anObject = require_an_object();
    var isObject = require_is_object();
    var create = require_object_create();
    var fails = require_fails();
    var nativeConstruct = getBuiltIn("Reflect", "construct");
    var ObjectPrototype = Object.prototype;
    var push = [].push;
    var NEW_TARGET_BUG = fails(function() {
      function F() {
      }
      return !(nativeConstruct(function() {
      }, [], F) instanceof F);
    });
    var ARGS_BUG = !fails(function() {
      nativeConstruct(function() {
      });
    });
    var FORCED = NEW_TARGET_BUG || ARGS_BUG;
    $({
      target: "Reflect",
      stat: true,
      forced: FORCED,
      sham: FORCED
    }, {
      construct: function construct(Target, args) {
        aConstructor(Target);
        anObject(args);
        var newTarget = arguments.length < 3 ? Target : aConstructor(arguments[2]);
        if (ARGS_BUG && !NEW_TARGET_BUG) return nativeConstruct(Target, args, newTarget);
        if (Target === newTarget) {
          switch (args.length) {
            case 0:
              return new Target();
            case 1:
              return new Target(args[0]);
            case 2:
              return new Target(args[0], args[1]);
            case 3:
              return new Target(args[0], args[1], args[2]);
            case 4:
              return new Target(args[0], args[1], args[2], args[3]);
          }
          var $args = [null];
          apply(push, $args, args);
          return new (apply(bind, Target, $args))();
        }
        var proto = newTarget.prototype;
        var instance = create(isObject(proto) ? proto : ObjectPrototype);
        var result = apply(Target, instance, args);
        return isObject(result) ? result : instance;
      }
    });
  }
});

// node_modules/core-js/modules/es.reflect.define-property.js
var require_es_reflect_define_property = __commonJS({
  "node_modules/core-js/modules/es.reflect.define-property.js"() {
    "use strict";
    var $ = require_export();
    var DESCRIPTORS = require_descriptors();
    var anObject = require_an_object();
    var toPropertyKey = require_to_property_key();
    var definePropertyModule = require_object_define_property();
    var fails = require_fails();
    var ERROR_INSTEAD_OF_FALSE = fails(function() {
      Reflect.defineProperty(definePropertyModule.f({}, 1, {
        value: 1
      }), 1, {
        value: 2
      });
    });
    $({
      target: "Reflect",
      stat: true,
      forced: ERROR_INSTEAD_OF_FALSE,
      sham: !DESCRIPTORS
    }, {
      defineProperty: function defineProperty(target, propertyKey, attributes) {
        anObject(target);
        var key = toPropertyKey(propertyKey);
        anObject(attributes);
        try {
          definePropertyModule.f(target, key, attributes);
          return true;
        } catch (error) {
          return false;
        }
      }
    });
  }
});

// node_modules/core-js/modules/es.reflect.delete-property.js
var require_es_reflect_delete_property = __commonJS({
  "node_modules/core-js/modules/es.reflect.delete-property.js"() {
    "use strict";
    var $ = require_export();
    var anObject = require_an_object();
    var getOwnPropertyDescriptor = require_object_get_own_property_descriptor().f;
    $({
      target: "Reflect",
      stat: true
    }, {
      deleteProperty: function deleteProperty(target, propertyKey) {
        var descriptor = getOwnPropertyDescriptor(anObject(target), propertyKey);
        return descriptor && !descriptor.configurable ? false : delete target[propertyKey];
      }
    });
  }
});

// node_modules/core-js/internals/is-data-descriptor.js
var require_is_data_descriptor = __commonJS({
  "node_modules/core-js/internals/is-data-descriptor.js"(exports, module) {
    "use strict";
    var hasOwn = require_has_own_property();
    module.exports = function(descriptor) {
      return descriptor !== void 0 && (hasOwn(descriptor, "value") || hasOwn(descriptor, "writable"));
    };
  }
});

// node_modules/core-js/modules/es.reflect.get.js
var require_es_reflect_get = __commonJS({
  "node_modules/core-js/modules/es.reflect.get.js"() {
    "use strict";
    var $ = require_export();
    var call = require_function_call();
    var isObject = require_is_object();
    var anObject = require_an_object();
    var isDataDescriptor = require_is_data_descriptor();
    var getOwnPropertyDescriptorModule = require_object_get_own_property_descriptor();
    var getPrototypeOf = require_object_get_prototype_of();
    function get(target, propertyKey) {
      var receiver = arguments.length < 3 ? target : arguments[2];
      var descriptor, prototype;
      if (anObject(target) === receiver) return target[propertyKey];
      descriptor = getOwnPropertyDescriptorModule.f(target, propertyKey);
      if (descriptor) return isDataDescriptor(descriptor) ? descriptor.value : descriptor.get === void 0 ? void 0 : call(descriptor.get, receiver);
      if (isObject(prototype = getPrototypeOf(target))) return get(prototype, propertyKey, receiver);
    }
    $({
      target: "Reflect",
      stat: true
    }, {
      get
    });
  }
});

// node_modules/core-js/modules/es.reflect.get-own-property-descriptor.js
var require_es_reflect_get_own_property_descriptor = __commonJS({
  "node_modules/core-js/modules/es.reflect.get-own-property-descriptor.js"() {
    "use strict";
    var $ = require_export();
    var DESCRIPTORS = require_descriptors();
    var anObject = require_an_object();
    var getOwnPropertyDescriptorModule = require_object_get_own_property_descriptor();
    $({
      target: "Reflect",
      stat: true,
      sham: !DESCRIPTORS
    }, {
      getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
        return getOwnPropertyDescriptorModule.f(anObject(target), propertyKey);
      }
    });
  }
});

// node_modules/core-js/modules/es.reflect.get-prototype-of.js
var require_es_reflect_get_prototype_of = __commonJS({
  "node_modules/core-js/modules/es.reflect.get-prototype-of.js"() {
    "use strict";
    var $ = require_export();
    var anObject = require_an_object();
    var objectGetPrototypeOf = require_object_get_prototype_of();
    var CORRECT_PROTOTYPE_GETTER = require_correct_prototype_getter();
    $({
      target: "Reflect",
      stat: true,
      sham: !CORRECT_PROTOTYPE_GETTER
    }, {
      getPrototypeOf: function getPrototypeOf(target) {
        return objectGetPrototypeOf(anObject(target));
      }
    });
  }
});

// node_modules/core-js/modules/es.reflect.has.js
var require_es_reflect_has = __commonJS({
  "node_modules/core-js/modules/es.reflect.has.js"() {
    "use strict";
    var $ = require_export();
    $({
      target: "Reflect",
      stat: true
    }, {
      has: function has(target, propertyKey) {
        return propertyKey in target;
      }
    });
  }
});

// node_modules/core-js/modules/es.reflect.is-extensible.js
var require_es_reflect_is_extensible = __commonJS({
  "node_modules/core-js/modules/es.reflect.is-extensible.js"() {
    "use strict";
    var $ = require_export();
    var anObject = require_an_object();
    var $isExtensible = require_object_is_extensible();
    $({
      target: "Reflect",
      stat: true
    }, {
      isExtensible: function isExtensible(target) {
        anObject(target);
        return $isExtensible(target);
      }
    });
  }
});

// node_modules/core-js/modules/es.reflect.own-keys.js
var require_es_reflect_own_keys = __commonJS({
  "node_modules/core-js/modules/es.reflect.own-keys.js"() {
    "use strict";
    var $ = require_export();
    var ownKeys = require_own_keys();
    $({
      target: "Reflect",
      stat: true
    }, {
      ownKeys
    });
  }
});

// node_modules/core-js/modules/es.reflect.prevent-extensions.js
var require_es_reflect_prevent_extensions = __commonJS({
  "node_modules/core-js/modules/es.reflect.prevent-extensions.js"() {
    "use strict";
    var $ = require_export();
    var getBuiltIn = require_get_built_in();
    var anObject = require_an_object();
    var FREEZING = require_freezing();
    $({
      target: "Reflect",
      stat: true,
      sham: !FREEZING
    }, {
      preventExtensions: function preventExtensions(target) {
        anObject(target);
        try {
          var objectPreventExtensions = getBuiltIn("Object", "preventExtensions");
          if (objectPreventExtensions) objectPreventExtensions(target);
          return true;
        } catch (error) {
          return false;
        }
      }
    });
  }
});

// node_modules/core-js/modules/es.reflect.set.js
var require_es_reflect_set = __commonJS({
  "node_modules/core-js/modules/es.reflect.set.js"() {
    "use strict";
    var $ = require_export();
    var call = require_function_call();
    var anObject = require_an_object();
    var isObject = require_is_object();
    var isDataDescriptor = require_is_data_descriptor();
    var fails = require_fails();
    var definePropertyModule = require_object_define_property();
    var getOwnPropertyDescriptorModule = require_object_get_own_property_descriptor();
    var getPrototypeOf = require_object_get_prototype_of();
    var createPropertyDescriptor = require_create_property_descriptor();
    function set(target, propertyKey, V) {
      var receiver = arguments.length < 4 ? target : arguments[3];
      var ownDescriptor = getOwnPropertyDescriptorModule.f(anObject(target), propertyKey);
      var existingDescriptor, prototype, setter;
      if (!ownDescriptor) {
        if (isObject(prototype = getPrototypeOf(target))) {
          return set(prototype, propertyKey, V, receiver);
        }
        ownDescriptor = createPropertyDescriptor(0);
      }
      if (isDataDescriptor(ownDescriptor)) {
        if (ownDescriptor.writable === false || !isObject(receiver)) return false;
        if (existingDescriptor = getOwnPropertyDescriptorModule.f(receiver, propertyKey)) {
          if (existingDescriptor.get || existingDescriptor.set || existingDescriptor.writable === false) return false;
          existingDescriptor.value = V;
          definePropertyModule.f(receiver, propertyKey, existingDescriptor);
        } else definePropertyModule.f(receiver, propertyKey, createPropertyDescriptor(0, V));
      } else {
        setter = ownDescriptor.set;
        if (setter === void 0) return false;
        call(setter, receiver, V);
      }
      return true;
    }
    var MS_EDGE_BUG = fails(function() {
      var Constructor = function() {
      };
      var object = definePropertyModule.f(new Constructor(), "a", {
        configurable: true
      });
      return Reflect.set(Constructor.prototype, "a", 1, object) !== false;
    });
    $({
      target: "Reflect",
      stat: true,
      forced: MS_EDGE_BUG
    }, {
      set
    });
  }
});

// node_modules/core-js/modules/es.reflect.set-prototype-of.js
var require_es_reflect_set_prototype_of = __commonJS({
  "node_modules/core-js/modules/es.reflect.set-prototype-of.js"() {
    "use strict";
    var $ = require_export();
    var anObject = require_an_object();
    var aPossiblePrototype = require_a_possible_prototype();
    var objectSetPrototypeOf = require_object_set_prototype_of();
    if (objectSetPrototypeOf) $({
      target: "Reflect",
      stat: true
    }, {
      setPrototypeOf: function setPrototypeOf(target, proto) {
        anObject(target);
        aPossiblePrototype(proto);
        try {
          objectSetPrototypeOf(target, proto);
          return true;
        } catch (error) {
          return false;
        }
      }
    });
  }
});

// node_modules/core-js/es/reflect/index.js
var require_reflect = __commonJS({
  "node_modules/core-js/es/reflect/index.js"(exports, module) {
    require_es_object_to_string();
    require_es_reflect_apply();
    require_es_reflect_construct();
    require_es_reflect_define_property();
    require_es_reflect_delete_property();
    require_es_reflect_get();
    require_es_reflect_get_own_property_descriptor();
    require_es_reflect_get_prototype_of();
    require_es_reflect_has();
    require_es_reflect_is_extensible();
    require_es_reflect_own_keys();
    require_es_reflect_prevent_extensions();
    require_es_reflect_set();
    require_es_reflect_set_prototype_of();
    require_es_reflect_to_string_tag();
    var path = require_path();
    module.exports = path.Reflect;
  }
});
export default require_reflect();
//# sourceMappingURL=core-js_es_reflect.js.map
