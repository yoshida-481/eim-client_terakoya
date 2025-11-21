import {
  require_internal_metadata
} from "./chunk-TZWIGHWK.js";
import {
  require_inherit_if_required
} from "./chunk-2GGPBGA4.js";
import {
  require_an_instance,
  require_check_correctness_of_iteration,
  require_define_built_ins
} from "./chunk-4FVOVKFT.js";
import {
  require_create_iter_result_object,
  require_iterator_define
} from "./chunk-ST6GXIMP.js";
import {
  require_iterate
} from "./chunk-3DNXURTP.js";
import {
  require_function_bind_context
} from "./chunk-V7V7HOLZ.js";
import {
  require_set_to_string_tag
} from "./chunk-YD4VTJX4.js";
import {
  require_set_species
} from "./chunk-WWTHI2BJ.js";
import {
  require_object_create
} from "./chunk-5J3DNA3C.js";
import {
  require_define_built_in_accessor
} from "./chunk-XIS6K74X.js";
import {
  require_define_built_in,
  require_descriptors,
  require_export,
  require_fails,
  require_function_uncurry_this,
  require_global_this,
  require_internal_state,
  require_is_callable,
  require_is_forced,
  require_is_null_or_undefined,
  require_is_object
} from "./chunk-SYAKHIZ5.js";
import {
  __commonJS
} from "./chunk-F52B2RLG.js";

// node_modules/core-js/internals/collection.js
var require_collection = __commonJS({
  "node_modules/core-js/internals/collection.js"(exports, module) {
    "use strict";
    var $ = require_export();
    var globalThis = require_global_this();
    var uncurryThis = require_function_uncurry_this();
    var isForced = require_is_forced();
    var defineBuiltIn = require_define_built_in();
    var InternalMetadataModule = require_internal_metadata();
    var iterate = require_iterate();
    var anInstance = require_an_instance();
    var isCallable = require_is_callable();
    var isNullOrUndefined = require_is_null_or_undefined();
    var isObject = require_is_object();
    var fails = require_fails();
    var checkCorrectnessOfIteration = require_check_correctness_of_iteration();
    var setToStringTag = require_set_to_string_tag();
    var inheritIfRequired = require_inherit_if_required();
    module.exports = function(CONSTRUCTOR_NAME, wrapper, common) {
      var IS_MAP = CONSTRUCTOR_NAME.indexOf("Map") !== -1;
      var IS_WEAK = CONSTRUCTOR_NAME.indexOf("Weak") !== -1;
      var ADDER = IS_MAP ? "set" : "add";
      var NativeConstructor = globalThis[CONSTRUCTOR_NAME];
      var NativePrototype = NativeConstructor && NativeConstructor.prototype;
      var Constructor = NativeConstructor;
      var exported = {};
      var fixMethod = function(KEY) {
        var uncurriedNativeMethod = uncurryThis(NativePrototype[KEY]);
        defineBuiltIn(NativePrototype, KEY, KEY === "add" ? function add(value) {
          uncurriedNativeMethod(this, value === 0 ? 0 : value);
          return this;
        } : KEY === "delete" ? function(key) {
          return IS_WEAK && !isObject(key) ? false : uncurriedNativeMethod(this, key === 0 ? 0 : key);
        } : KEY === "get" ? function get(key) {
          return IS_WEAK && !isObject(key) ? void 0 : uncurriedNativeMethod(this, key === 0 ? 0 : key);
        } : KEY === "has" ? function has(key) {
          return IS_WEAK && !isObject(key) ? false : uncurriedNativeMethod(this, key === 0 ? 0 : key);
        } : function set(key, value) {
          uncurriedNativeMethod(this, key === 0 ? 0 : key, value);
          return this;
        });
      };
      var REPLACE = isForced(CONSTRUCTOR_NAME, !isCallable(NativeConstructor) || !(IS_WEAK || NativePrototype.forEach && !fails(function() {
        new NativeConstructor().entries().next();
      })));
      if (REPLACE) {
        Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
        InternalMetadataModule.enable();
      } else if (isForced(CONSTRUCTOR_NAME, true)) {
        var instance = new Constructor();
        var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) !== instance;
        var THROWS_ON_PRIMITIVES = fails(function() {
          instance.has(1);
        });
        var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function(iterable) {
          new NativeConstructor(iterable);
        });
        var BUGGY_ZERO = !IS_WEAK && fails(function() {
          var $instance = new NativeConstructor();
          var index = 5;
          while (index--) $instance[ADDER](index, index);
          return !$instance.has(-0);
        });
        if (!ACCEPT_ITERABLES) {
          Constructor = wrapper(function(dummy, iterable) {
            anInstance(dummy, NativePrototype);
            var that = inheritIfRequired(new NativeConstructor(), dummy, Constructor);
            if (!isNullOrUndefined(iterable)) iterate(iterable, that[ADDER], {
              that,
              AS_ENTRIES: IS_MAP
            });
            return that;
          });
          Constructor.prototype = NativePrototype;
          NativePrototype.constructor = Constructor;
        }
        if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
          fixMethod("delete");
          fixMethod("has");
          IS_MAP && fixMethod("get");
        }
        if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);
        if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
      }
      exported[CONSTRUCTOR_NAME] = Constructor;
      $({
        global: true,
        constructor: true,
        forced: Constructor !== NativeConstructor
      }, exported);
      setToStringTag(Constructor, CONSTRUCTOR_NAME);
      if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);
      return Constructor;
    };
  }
});

// node_modules/core-js/internals/collection-strong.js
var require_collection_strong = __commonJS({
  "node_modules/core-js/internals/collection-strong.js"(exports, module) {
    "use strict";
    var create = require_object_create();
    var defineBuiltInAccessor = require_define_built_in_accessor();
    var defineBuiltIns = require_define_built_ins();
    var bind = require_function_bind_context();
    var anInstance = require_an_instance();
    var isNullOrUndefined = require_is_null_or_undefined();
    var iterate = require_iterate();
    var defineIterator = require_iterator_define();
    var createIterResultObject = require_create_iter_result_object();
    var setSpecies = require_set_species();
    var DESCRIPTORS = require_descriptors();
    var fastKey = require_internal_metadata().fastKey;
    var InternalStateModule = require_internal_state();
    var setInternalState = InternalStateModule.set;
    var internalStateGetterFor = InternalStateModule.getterFor;
    module.exports = {
      getConstructor: function(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
        var Constructor = wrapper(function(that, iterable) {
          anInstance(that, Prototype);
          setInternalState(that, {
            type: CONSTRUCTOR_NAME,
            index: create(null),
            first: null,
            last: null,
            size: 0
          });
          if (!DESCRIPTORS) that.size = 0;
          if (!isNullOrUndefined(iterable)) iterate(iterable, that[ADDER], {
            that,
            AS_ENTRIES: IS_MAP
          });
        });
        var Prototype = Constructor.prototype;
        var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);
        var define = function(that, key, value) {
          var state = getInternalState(that);
          var entry = getEntry(that, key);
          var previous, index;
          if (entry) {
            entry.value = value;
          } else {
            state.last = entry = {
              index: index = fastKey(key, true),
              key,
              value,
              previous: previous = state.last,
              next: null,
              removed: false
            };
            if (!state.first) state.first = entry;
            if (previous) previous.next = entry;
            if (DESCRIPTORS) state.size++;
            else that.size++;
            if (index !== "F") state.index[index] = entry;
          }
          return that;
        };
        var getEntry = function(that, key) {
          var state = getInternalState(that);
          var index = fastKey(key);
          var entry;
          if (index !== "F") return state.index[index];
          for (entry = state.first; entry; entry = entry.next) {
            if (entry.key === key) return entry;
          }
        };
        defineBuiltIns(Prototype, {
          // `{ Map, Set }.prototype.clear()` methods
          // https://tc39.es/ecma262/#sec-map.prototype.clear
          // https://tc39.es/ecma262/#sec-set.prototype.clear
          clear: function clear() {
            var that = this;
            var state = getInternalState(that);
            var entry = state.first;
            while (entry) {
              entry.removed = true;
              if (entry.previous) entry.previous = entry.previous.next = null;
              entry = entry.next;
            }
            state.first = state.last = null;
            state.index = create(null);
            if (DESCRIPTORS) state.size = 0;
            else that.size = 0;
          },
          // `{ Map, Set }.prototype.delete(key)` methods
          // https://tc39.es/ecma262/#sec-map.prototype.delete
          // https://tc39.es/ecma262/#sec-set.prototype.delete
          "delete": function(key) {
            var that = this;
            var state = getInternalState(that);
            var entry = getEntry(that, key);
            if (entry) {
              var next = entry.next;
              var prev = entry.previous;
              delete state.index[entry.index];
              entry.removed = true;
              if (prev) prev.next = next;
              if (next) next.previous = prev;
              if (state.first === entry) state.first = next;
              if (state.last === entry) state.last = prev;
              if (DESCRIPTORS) state.size--;
              else that.size--;
            }
            return !!entry;
          },
          // `{ Map, Set }.prototype.forEach(callbackfn, thisArg = undefined)` methods
          // https://tc39.es/ecma262/#sec-map.prototype.foreach
          // https://tc39.es/ecma262/#sec-set.prototype.foreach
          forEach: function forEach(callbackfn) {
            var state = getInternalState(this);
            var boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : void 0);
            var entry;
            while (entry = entry ? entry.next : state.first) {
              boundFunction(entry.value, entry.key, this);
              while (entry && entry.removed) entry = entry.previous;
            }
          },
          // `{ Map, Set}.prototype.has(key)` methods
          // https://tc39.es/ecma262/#sec-map.prototype.has
          // https://tc39.es/ecma262/#sec-set.prototype.has
          has: function has(key) {
            return !!getEntry(this, key);
          }
        });
        defineBuiltIns(Prototype, IS_MAP ? {
          // `Map.prototype.get(key)` method
          // https://tc39.es/ecma262/#sec-map.prototype.get
          get: function get(key) {
            var entry = getEntry(this, key);
            return entry && entry.value;
          },
          // `Map.prototype.set(key, value)` method
          // https://tc39.es/ecma262/#sec-map.prototype.set
          set: function set(key, value) {
            return define(this, key === 0 ? 0 : key, value);
          }
        } : {
          // `Set.prototype.add(value)` method
          // https://tc39.es/ecma262/#sec-set.prototype.add
          add: function add(value) {
            return define(this, value = value === 0 ? 0 : value, value);
          }
        });
        if (DESCRIPTORS) defineBuiltInAccessor(Prototype, "size", {
          configurable: true,
          get: function() {
            return getInternalState(this).size;
          }
        });
        return Constructor;
      },
      setStrong: function(Constructor, CONSTRUCTOR_NAME, IS_MAP) {
        var ITERATOR_NAME = CONSTRUCTOR_NAME + " Iterator";
        var getInternalCollectionState = internalStateGetterFor(CONSTRUCTOR_NAME);
        var getInternalIteratorState = internalStateGetterFor(ITERATOR_NAME);
        defineIterator(Constructor, CONSTRUCTOR_NAME, function(iterated, kind) {
          setInternalState(this, {
            type: ITERATOR_NAME,
            target: iterated,
            state: getInternalCollectionState(iterated),
            kind,
            last: null
          });
        }, function() {
          var state = getInternalIteratorState(this);
          var kind = state.kind;
          var entry = state.last;
          while (entry && entry.removed) entry = entry.previous;
          if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
            state.target = null;
            return createIterResultObject(void 0, true);
          }
          if (kind === "keys") return createIterResultObject(entry.key, false);
          if (kind === "values") return createIterResultObject(entry.value, false);
          return createIterResultObject([entry.key, entry.value], false);
        }, IS_MAP ? "entries" : "values", !IS_MAP, true);
        setSpecies(CONSTRUCTOR_NAME);
      }
    };
  }
});

export {
  require_collection,
  require_collection_strong
};
//# sourceMappingURL=chunk-SVGS66WF.js.map
