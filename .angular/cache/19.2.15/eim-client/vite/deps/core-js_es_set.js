import {
  require_get_iterator_direct
} from "./chunk-E2IVN7IE.js";
import {
  require_collection,
  require_collection_strong
} from "./chunk-OYLBDZNS.js";
import {
  require_es_array_iterator
} from "./chunk-PTQJDEVM.js";
import {
  require_es_string_iterator
} from "./chunk-D7Y7TYXE.js";
import "./chunk-TZWIGHWK.js";
import "./chunk-GYN7VWKI.js";
import {
  require_iterator_close
} from "./chunk-OY3IZACA.js";
import "./chunk-K4HCWTBL.js";
import "./chunk-V7V7HOLZ.js";
import "./chunk-IP7WRSH3.js";
import "./chunk-WWTHI2BJ.js";
import "./chunk-G7RHFS26.js";
import "./chunk-2GGPBGA4.js";
import "./chunk-GPYUX3T7.js";
import "./chunk-KTBTE3ID.js";
import {
  require_es_object_to_string
} from "./chunk-W5WTIVVC.js";
import "./chunk-YD4VTJX4.js";
import "./chunk-5J3DNA3C.js";
import {
  require_function_uncurry_this_accessor
} from "./chunk-LJACIHUK.js";
import "./chunk-L2Q7U5JX.js";
import "./chunk-OW7VFTLO.js";
import "./chunk-XIS6K74X.js";
import "./chunk-ZMV7AIVQ.js";
import {
  require_path
} from "./chunk-N7EDGOTA.js";
import {
  require_a_callable,
  require_an_object,
  require_export,
  require_fails,
  require_function_call,
  require_function_uncurry_this,
  require_get_built_in,
  require_to_integer_or_infinity
} from "./chunk-SYAKHIZ5.js";
import {
  __commonJS
} from "./chunk-F52B2RLG.js";

// node_modules/core-js/modules/es.set.constructor.js
var require_es_set_constructor = __commonJS({
  "node_modules/core-js/modules/es.set.constructor.js"() {
    "use strict";
    var collection = require_collection();
    var collectionStrong = require_collection_strong();
    collection("Set", function(init) {
      return function Set2() {
        return init(this, arguments.length ? arguments[0] : void 0);
      };
    }, collectionStrong);
  }
});

// node_modules/core-js/modules/es.set.js
var require_es_set = __commonJS({
  "node_modules/core-js/modules/es.set.js"() {
    "use strict";
    require_es_set_constructor();
  }
});

// node_modules/core-js/internals/set-helpers.js
var require_set_helpers = __commonJS({
  "node_modules/core-js/internals/set-helpers.js"(exports, module) {
    "use strict";
    var uncurryThis = require_function_uncurry_this();
    var SetPrototype = Set.prototype;
    module.exports = {
      // eslint-disable-next-line es/no-set -- safe
      Set,
      add: uncurryThis(SetPrototype.add),
      has: uncurryThis(SetPrototype.has),
      remove: uncurryThis(SetPrototype["delete"]),
      proto: SetPrototype
    };
  }
});

// node_modules/core-js/internals/a-set.js
var require_a_set = __commonJS({
  "node_modules/core-js/internals/a-set.js"(exports, module) {
    "use strict";
    var has = require_set_helpers().has;
    module.exports = function(it) {
      has(it);
      return it;
    };
  }
});

// node_modules/core-js/internals/iterate-simple.js
var require_iterate_simple = __commonJS({
  "node_modules/core-js/internals/iterate-simple.js"(exports, module) {
    "use strict";
    var call = require_function_call();
    module.exports = function(record, fn, ITERATOR_INSTEAD_OF_RECORD) {
      var iterator = ITERATOR_INSTEAD_OF_RECORD ? record : record.iterator;
      var next = record.next;
      var step, result;
      while (!(step = call(next, iterator)).done) {
        result = fn(step.value);
        if (result !== void 0) return result;
      }
    };
  }
});

// node_modules/core-js/internals/set-iterate.js
var require_set_iterate = __commonJS({
  "node_modules/core-js/internals/set-iterate.js"(exports, module) {
    "use strict";
    var uncurryThis = require_function_uncurry_this();
    var iterateSimple = require_iterate_simple();
    var SetHelpers = require_set_helpers();
    var Set2 = SetHelpers.Set;
    var SetPrototype = SetHelpers.proto;
    var forEach = uncurryThis(SetPrototype.forEach);
    var keys = uncurryThis(SetPrototype.keys);
    var next = keys(new Set2()).next;
    module.exports = function(set, fn, interruptible) {
      return interruptible ? iterateSimple({
        iterator: keys(set),
        next
      }, fn) : forEach(set, fn);
    };
  }
});

// node_modules/core-js/internals/set-clone.js
var require_set_clone = __commonJS({
  "node_modules/core-js/internals/set-clone.js"(exports, module) {
    "use strict";
    var SetHelpers = require_set_helpers();
    var iterate = require_set_iterate();
    var Set2 = SetHelpers.Set;
    var add = SetHelpers.add;
    module.exports = function(set) {
      var result = new Set2();
      iterate(set, function(it) {
        add(result, it);
      });
      return result;
    };
  }
});

// node_modules/core-js/internals/set-size.js
var require_set_size = __commonJS({
  "node_modules/core-js/internals/set-size.js"(exports, module) {
    "use strict";
    var uncurryThisAccessor = require_function_uncurry_this_accessor();
    var SetHelpers = require_set_helpers();
    module.exports = uncurryThisAccessor(SetHelpers.proto, "size", "get") || function(set) {
      return set.size;
    };
  }
});

// node_modules/core-js/internals/get-set-record.js
var require_get_set_record = __commonJS({
  "node_modules/core-js/internals/get-set-record.js"(exports, module) {
    "use strict";
    var aCallable = require_a_callable();
    var anObject = require_an_object();
    var call = require_function_call();
    var toIntegerOrInfinity = require_to_integer_or_infinity();
    var getIteratorDirect = require_get_iterator_direct();
    var INVALID_SIZE = "Invalid size";
    var $RangeError = RangeError;
    var $TypeError = TypeError;
    var max = Math.max;
    var SetRecord = function(set, intSize) {
      this.set = set;
      this.size = max(intSize, 0);
      this.has = aCallable(set.has);
      this.keys = aCallable(set.keys);
    };
    SetRecord.prototype = {
      getIterator: function() {
        return getIteratorDirect(anObject(call(this.keys, this.set)));
      },
      includes: function(it) {
        return call(this.has, this.set, it);
      }
    };
    module.exports = function(obj) {
      anObject(obj);
      var numSize = +obj.size;
      if (numSize !== numSize) throw new $TypeError(INVALID_SIZE);
      var intSize = toIntegerOrInfinity(numSize);
      if (intSize < 0) throw new $RangeError(INVALID_SIZE);
      return new SetRecord(obj, intSize);
    };
  }
});

// node_modules/core-js/internals/set-difference.js
var require_set_difference = __commonJS({
  "node_modules/core-js/internals/set-difference.js"(exports, module) {
    "use strict";
    var aSet = require_a_set();
    var SetHelpers = require_set_helpers();
    var clone = require_set_clone();
    var size = require_set_size();
    var getSetRecord = require_get_set_record();
    var iterateSet = require_set_iterate();
    var iterateSimple = require_iterate_simple();
    var has = SetHelpers.has;
    var remove = SetHelpers.remove;
    module.exports = function difference(other) {
      var O = aSet(this);
      var otherRec = getSetRecord(other);
      var result = clone(O);
      if (size(O) <= otherRec.size) iterateSet(O, function(e) {
        if (otherRec.includes(e)) remove(result, e);
      });
      else iterateSimple(otherRec.getIterator(), function(e) {
        if (has(result, e)) remove(result, e);
      });
      return result;
    };
  }
});

// node_modules/core-js/internals/set-method-accept-set-like.js
var require_set_method_accept_set_like = __commonJS({
  "node_modules/core-js/internals/set-method-accept-set-like.js"(exports, module) {
    "use strict";
    var getBuiltIn = require_get_built_in();
    var createSetLike = function(size) {
      return {
        size,
        has: function() {
          return false;
        },
        keys: function() {
          return {
            next: function() {
              return {
                done: true
              };
            }
          };
        }
      };
    };
    var createSetLikeWithInfinitySize = function(size) {
      return {
        size,
        has: function() {
          return true;
        },
        keys: function() {
          throw new Error("e");
        }
      };
    };
    module.exports = function(name, callback) {
      var Set2 = getBuiltIn("Set");
      try {
        new Set2()[name](createSetLike(0));
        try {
          new Set2()[name](createSetLike(-1));
          return false;
        } catch (error2) {
          if (!callback) return true;
          try {
            new Set2()[name](createSetLikeWithInfinitySize(-Infinity));
            return false;
          } catch (error) {
            var set = new Set2();
            set.add(1);
            set.add(2);
            return callback(set[name](createSetLikeWithInfinitySize(Infinity)));
          }
        }
      } catch (error) {
        return false;
      }
    };
  }
});

// node_modules/core-js/modules/es.set.difference.v2.js
var require_es_set_difference_v2 = __commonJS({
  "node_modules/core-js/modules/es.set.difference.v2.js"() {
    "use strict";
    var $ = require_export();
    var difference = require_set_difference();
    var fails = require_fails();
    var setMethodAcceptSetLike = require_set_method_accept_set_like();
    var SET_LIKE_INCORRECT_BEHAVIOR = !setMethodAcceptSetLike("difference", function(result) {
      return result.size === 0;
    });
    var FORCED = SET_LIKE_INCORRECT_BEHAVIOR || fails(function() {
      var setLike = {
        size: 1,
        has: function() {
          return true;
        },
        keys: function() {
          var index = 0;
          return {
            next: function() {
              var done = index++ > 1;
              if (baseSet.has(1)) baseSet.clear();
              return {
                done,
                value: 2
              };
            }
          };
        }
      };
      var baseSet = /* @__PURE__ */ new Set([1, 2, 3, 4]);
      return baseSet.difference(setLike).size !== 3;
    });
    $({
      target: "Set",
      proto: true,
      real: true,
      forced: FORCED
    }, {
      difference
    });
  }
});

// node_modules/core-js/internals/set-intersection.js
var require_set_intersection = __commonJS({
  "node_modules/core-js/internals/set-intersection.js"(exports, module) {
    "use strict";
    var aSet = require_a_set();
    var SetHelpers = require_set_helpers();
    var size = require_set_size();
    var getSetRecord = require_get_set_record();
    var iterateSet = require_set_iterate();
    var iterateSimple = require_iterate_simple();
    var Set2 = SetHelpers.Set;
    var add = SetHelpers.add;
    var has = SetHelpers.has;
    module.exports = function intersection(other) {
      var O = aSet(this);
      var otherRec = getSetRecord(other);
      var result = new Set2();
      if (size(O) > otherRec.size) {
        iterateSimple(otherRec.getIterator(), function(e) {
          if (has(O, e)) add(result, e);
        });
      } else {
        iterateSet(O, function(e) {
          if (otherRec.includes(e)) add(result, e);
        });
      }
      return result;
    };
  }
});

// node_modules/core-js/modules/es.set.intersection.v2.js
var require_es_set_intersection_v2 = __commonJS({
  "node_modules/core-js/modules/es.set.intersection.v2.js"() {
    "use strict";
    var $ = require_export();
    var fails = require_fails();
    var intersection = require_set_intersection();
    var setMethodAcceptSetLike = require_set_method_accept_set_like();
    var INCORRECT = !setMethodAcceptSetLike("intersection", function(result) {
      return result.size === 2 && result.has(1) && result.has(2);
    }) || fails(function() {
      return String(Array.from((/* @__PURE__ */ new Set([1, 2, 3])).intersection(/* @__PURE__ */ new Set([3, 2])))) !== "3,2";
    });
    $({
      target: "Set",
      proto: true,
      real: true,
      forced: INCORRECT
    }, {
      intersection
    });
  }
});

// node_modules/core-js/internals/set-is-disjoint-from.js
var require_set_is_disjoint_from = __commonJS({
  "node_modules/core-js/internals/set-is-disjoint-from.js"(exports, module) {
    "use strict";
    var aSet = require_a_set();
    var has = require_set_helpers().has;
    var size = require_set_size();
    var getSetRecord = require_get_set_record();
    var iterateSet = require_set_iterate();
    var iterateSimple = require_iterate_simple();
    var iteratorClose = require_iterator_close();
    module.exports = function isDisjointFrom(other) {
      var O = aSet(this);
      var otherRec = getSetRecord(other);
      if (size(O) <= otherRec.size) return iterateSet(O, function(e) {
        if (otherRec.includes(e)) return false;
      }, true) !== false;
      var iterator = otherRec.getIterator();
      return iterateSimple(iterator, function(e) {
        if (has(O, e)) return iteratorClose(iterator, "normal", false);
      }) !== false;
    };
  }
});

// node_modules/core-js/modules/es.set.is-disjoint-from.v2.js
var require_es_set_is_disjoint_from_v2 = __commonJS({
  "node_modules/core-js/modules/es.set.is-disjoint-from.v2.js"() {
    "use strict";
    var $ = require_export();
    var isDisjointFrom = require_set_is_disjoint_from();
    var setMethodAcceptSetLike = require_set_method_accept_set_like();
    var INCORRECT = !setMethodAcceptSetLike("isDisjointFrom", function(result) {
      return !result;
    });
    $({
      target: "Set",
      proto: true,
      real: true,
      forced: INCORRECT
    }, {
      isDisjointFrom
    });
  }
});

// node_modules/core-js/internals/set-is-subset-of.js
var require_set_is_subset_of = __commonJS({
  "node_modules/core-js/internals/set-is-subset-of.js"(exports, module) {
    "use strict";
    var aSet = require_a_set();
    var size = require_set_size();
    var iterate = require_set_iterate();
    var getSetRecord = require_get_set_record();
    module.exports = function isSubsetOf(other) {
      var O = aSet(this);
      var otherRec = getSetRecord(other);
      if (size(O) > otherRec.size) return false;
      return iterate(O, function(e) {
        if (!otherRec.includes(e)) return false;
      }, true) !== false;
    };
  }
});

// node_modules/core-js/modules/es.set.is-subset-of.v2.js
var require_es_set_is_subset_of_v2 = __commonJS({
  "node_modules/core-js/modules/es.set.is-subset-of.v2.js"() {
    "use strict";
    var $ = require_export();
    var isSubsetOf = require_set_is_subset_of();
    var setMethodAcceptSetLike = require_set_method_accept_set_like();
    var INCORRECT = !setMethodAcceptSetLike("isSubsetOf", function(result) {
      return result;
    });
    $({
      target: "Set",
      proto: true,
      real: true,
      forced: INCORRECT
    }, {
      isSubsetOf
    });
  }
});

// node_modules/core-js/internals/set-is-superset-of.js
var require_set_is_superset_of = __commonJS({
  "node_modules/core-js/internals/set-is-superset-of.js"(exports, module) {
    "use strict";
    var aSet = require_a_set();
    var has = require_set_helpers().has;
    var size = require_set_size();
    var getSetRecord = require_get_set_record();
    var iterateSimple = require_iterate_simple();
    var iteratorClose = require_iterator_close();
    module.exports = function isSupersetOf(other) {
      var O = aSet(this);
      var otherRec = getSetRecord(other);
      if (size(O) < otherRec.size) return false;
      var iterator = otherRec.getIterator();
      return iterateSimple(iterator, function(e) {
        if (!has(O, e)) return iteratorClose(iterator, "normal", false);
      }) !== false;
    };
  }
});

// node_modules/core-js/modules/es.set.is-superset-of.v2.js
var require_es_set_is_superset_of_v2 = __commonJS({
  "node_modules/core-js/modules/es.set.is-superset-of.v2.js"() {
    "use strict";
    var $ = require_export();
    var isSupersetOf = require_set_is_superset_of();
    var setMethodAcceptSetLike = require_set_method_accept_set_like();
    var INCORRECT = !setMethodAcceptSetLike("isSupersetOf", function(result) {
      return !result;
    });
    $({
      target: "Set",
      proto: true,
      real: true,
      forced: INCORRECT
    }, {
      isSupersetOf
    });
  }
});

// node_modules/core-js/internals/set-symmetric-difference.js
var require_set_symmetric_difference = __commonJS({
  "node_modules/core-js/internals/set-symmetric-difference.js"(exports, module) {
    "use strict";
    var aSet = require_a_set();
    var SetHelpers = require_set_helpers();
    var clone = require_set_clone();
    var getSetRecord = require_get_set_record();
    var iterateSimple = require_iterate_simple();
    var add = SetHelpers.add;
    var has = SetHelpers.has;
    var remove = SetHelpers.remove;
    module.exports = function symmetricDifference(other) {
      var O = aSet(this);
      var keysIter = getSetRecord(other).getIterator();
      var result = clone(O);
      iterateSimple(keysIter, function(e) {
        if (has(O, e)) remove(result, e);
        else add(result, e);
      });
      return result;
    };
  }
});

// node_modules/core-js/internals/set-method-get-keys-before-cloning-detection.js
var require_set_method_get_keys_before_cloning_detection = __commonJS({
  "node_modules/core-js/internals/set-method-get-keys-before-cloning-detection.js"(exports, module) {
    "use strict";
    module.exports = function(METHOD_NAME) {
      try {
        var baseSet = /* @__PURE__ */ new Set();
        var setLike = {
          size: 0,
          has: function() {
            return true;
          },
          keys: function() {
            return Object.defineProperty({}, "next", {
              get: function() {
                baseSet.clear();
                baseSet.add(4);
                return function() {
                  return {
                    done: true
                  };
                };
              }
            });
          }
        };
        var result = baseSet[METHOD_NAME](setLike);
        return result.size === 1 && result.values().next().value === 4;
      } catch (error) {
        return false;
      }
    };
  }
});

// node_modules/core-js/modules/es.set.symmetric-difference.v2.js
var require_es_set_symmetric_difference_v2 = __commonJS({
  "node_modules/core-js/modules/es.set.symmetric-difference.v2.js"() {
    "use strict";
    var $ = require_export();
    var symmetricDifference = require_set_symmetric_difference();
    var setMethodGetKeysBeforeCloning = require_set_method_get_keys_before_cloning_detection();
    var setMethodAcceptSetLike = require_set_method_accept_set_like();
    var FORCED = !setMethodAcceptSetLike("symmetricDifference") || !setMethodGetKeysBeforeCloning("symmetricDifference");
    $({
      target: "Set",
      proto: true,
      real: true,
      forced: FORCED
    }, {
      symmetricDifference
    });
  }
});

// node_modules/core-js/internals/set-union.js
var require_set_union = __commonJS({
  "node_modules/core-js/internals/set-union.js"(exports, module) {
    "use strict";
    var aSet = require_a_set();
    var add = require_set_helpers().add;
    var clone = require_set_clone();
    var getSetRecord = require_get_set_record();
    var iterateSimple = require_iterate_simple();
    module.exports = function union(other) {
      var O = aSet(this);
      var keysIter = getSetRecord(other).getIterator();
      var result = clone(O);
      iterateSimple(keysIter, function(it) {
        add(result, it);
      });
      return result;
    };
  }
});

// node_modules/core-js/modules/es.set.union.v2.js
var require_es_set_union_v2 = __commonJS({
  "node_modules/core-js/modules/es.set.union.v2.js"() {
    "use strict";
    var $ = require_export();
    var union = require_set_union();
    var setMethodGetKeysBeforeCloning = require_set_method_get_keys_before_cloning_detection();
    var setMethodAcceptSetLike = require_set_method_accept_set_like();
    var FORCED = !setMethodAcceptSetLike("union") || !setMethodGetKeysBeforeCloning("union");
    $({
      target: "Set",
      proto: true,
      real: true,
      forced: FORCED
    }, {
      union
    });
  }
});

// node_modules/core-js/es/set/index.js
var require_set = __commonJS({
  "node_modules/core-js/es/set/index.js"(exports, module) {
    require_es_array_iterator();
    require_es_object_to_string();
    require_es_set();
    require_es_set_difference_v2();
    require_es_set_intersection_v2();
    require_es_set_is_disjoint_from_v2();
    require_es_set_is_subset_of_v2();
    require_es_set_is_superset_of_v2();
    require_es_set_symmetric_difference_v2();
    require_es_set_union_v2();
    require_es_string_iterator();
    var path = require_path();
    module.exports = path.Set;
  }
});
export default require_set();
//# sourceMappingURL=core-js_es_set.js.map
