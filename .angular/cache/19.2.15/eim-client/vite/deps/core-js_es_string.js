import {
  require_advance_string_index,
  require_es_regexp_exec,
  require_es_string_match,
  require_es_string_replace,
  require_es_string_search,
  require_es_string_split,
  require_get_substitution,
  require_is_regexp,
  require_regexp_exec_abstract,
  require_regexp_get_flags
} from "./chunk-KXH75HEH.js";
import "./chunk-IXACK6AY.js";
import {
  require_string_trim
} from "./chunk-LKNLMXKK.js";
import {
  require_whitespaces
} from "./chunk-677LGTPM.js";
import {
  require_species_constructor
} from "./chunk-EO4T7LOD.js";
import "./chunk-RWQHAGJX.js";
import {
  require_create_iter_result_object,
  require_es_string_iterator,
  require_iterator_create_constructor
} from "./chunk-TW74BKZB.js";
import {
  require_string_multibyte
} from "./chunk-G7RHFS26.js";
import "./chunk-MPAR7FPC.js";
import "./chunk-K4HCWTBL.js";
import {
  require_function_uncurry_this_clause
} from "./chunk-IP7WRSH3.js";
import "./chunk-KTBTE3ID.js";
import {
  require_es_object_to_string
} from "./chunk-W5WTIVVC.js";
import "./chunk-5J3DNA3C.js";
import "./chunk-YD4VTJX4.js";
import "./chunk-LJACIHUK.js";
import {
  require_string_pad
} from "./chunk-PMYWT43N.js";
import {
  require_string_repeat
} from "./chunk-6UNXP5FG.js";
import {
  require_to_string
} from "./chunk-L2Q7U5JX.js";
import "./chunk-OW7VFTLO.js";
import {
  require_path
} from "./chunk-N7EDGOTA.js";
import {
  require_an_object,
  require_classof_raw,
  require_define_built_in,
  require_environment_user_agent,
  require_export,
  require_fails,
  require_function_call,
  require_function_name,
  require_function_uncurry_this,
  require_get_method,
  require_internal_state,
  require_is_callable,
  require_is_object,
  require_is_pure,
  require_length_of_array_like,
  require_object_get_own_property_descriptor,
  require_require_object_coercible,
  require_to_absolute_index,
  require_to_indexed_object,
  require_to_integer_or_infinity,
  require_to_length,
  require_to_object,
  require_well_known_symbol
} from "./chunk-SYAKHIZ5.js";
import {
  __commonJS
} from "./chunk-F52B2RLG.js";

// node_modules/core-js/modules/es.string.from-code-point.js
var require_es_string_from_code_point = __commonJS({
  "node_modules/core-js/modules/es.string.from-code-point.js"() {
    "use strict";
    var $ = require_export();
    var uncurryThis = require_function_uncurry_this();
    var toAbsoluteIndex = require_to_absolute_index();
    var $RangeError = RangeError;
    var fromCharCode = String.fromCharCode;
    var $fromCodePoint = String.fromCodePoint;
    var join = uncurryThis([].join);
    var INCORRECT_LENGTH = !!$fromCodePoint && $fromCodePoint.length !== 1;
    $({
      target: "String",
      stat: true,
      arity: 1,
      forced: INCORRECT_LENGTH
    }, {
      // eslint-disable-next-line no-unused-vars -- required for `.length`
      fromCodePoint: function fromCodePoint(x) {
        var elements = [];
        var length = arguments.length;
        var i = 0;
        var code;
        while (length > i) {
          code = +arguments[i++];
          if (toAbsoluteIndex(code, 1114111) !== code) throw new $RangeError(code + " is not a valid code point");
          elements[i] = code < 65536 ? fromCharCode(code) : fromCharCode(((code -= 65536) >> 10) + 55296, code % 1024 + 56320);
        }
        return join(elements, "");
      }
    });
  }
});

// node_modules/core-js/modules/es.string.raw.js
var require_es_string_raw = __commonJS({
  "node_modules/core-js/modules/es.string.raw.js"() {
    "use strict";
    var $ = require_export();
    var uncurryThis = require_function_uncurry_this();
    var toIndexedObject = require_to_indexed_object();
    var toObject = require_to_object();
    var toString = require_to_string();
    var lengthOfArrayLike = require_length_of_array_like();
    var push = uncurryThis([].push);
    var join = uncurryThis([].join);
    $({
      target: "String",
      stat: true
    }, {
      raw: function raw(template) {
        var rawTemplate = toIndexedObject(toObject(template).raw);
        var literalSegments = lengthOfArrayLike(rawTemplate);
        if (!literalSegments) return "";
        var argumentsLength = arguments.length;
        var elements = [];
        var i = 0;
        while (true) {
          push(elements, toString(rawTemplate[i++]));
          if (i === literalSegments) return join(elements, "");
          if (i < argumentsLength) push(elements, toString(arguments[i]));
        }
      }
    });
  }
});

// node_modules/core-js/modules/es.string.code-point-at.js
var require_es_string_code_point_at = __commonJS({
  "node_modules/core-js/modules/es.string.code-point-at.js"() {
    "use strict";
    var $ = require_export();
    var codeAt = require_string_multibyte().codeAt;
    $({
      target: "String",
      proto: true
    }, {
      codePointAt: function codePointAt(pos) {
        return codeAt(this, pos);
      }
    });
  }
});

// node_modules/core-js/modules/es.string.at-alternative.js
var require_es_string_at_alternative = __commonJS({
  "node_modules/core-js/modules/es.string.at-alternative.js"() {
    "use strict";
    var $ = require_export();
    var uncurryThis = require_function_uncurry_this();
    var requireObjectCoercible = require_require_object_coercible();
    var toIntegerOrInfinity = require_to_integer_or_infinity();
    var toString = require_to_string();
    var fails = require_fails();
    var charAt = uncurryThis("".charAt);
    var FORCED = fails(function() {
      return "𠮷".at(-2) !== "\uD842";
    });
    $({
      target: "String",
      proto: true,
      forced: FORCED
    }, {
      at: function at(index) {
        var S = toString(requireObjectCoercible(this));
        var len = S.length;
        var relativeIndex = toIntegerOrInfinity(index);
        var k = relativeIndex >= 0 ? relativeIndex : len + relativeIndex;
        return k < 0 || k >= len ? void 0 : charAt(S, k);
      }
    });
  }
});

// node_modules/core-js/internals/not-a-regexp.js
var require_not_a_regexp = __commonJS({
  "node_modules/core-js/internals/not-a-regexp.js"(exports, module) {
    "use strict";
    var isRegExp = require_is_regexp();
    var $TypeError = TypeError;
    module.exports = function(it) {
      if (isRegExp(it)) {
        throw new $TypeError("The method doesn't accept regular expressions");
      }
      return it;
    };
  }
});

// node_modules/core-js/internals/correct-is-regexp-logic.js
var require_correct_is_regexp_logic = __commonJS({
  "node_modules/core-js/internals/correct-is-regexp-logic.js"(exports, module) {
    "use strict";
    var wellKnownSymbol = require_well_known_symbol();
    var MATCH = wellKnownSymbol("match");
    module.exports = function(METHOD_NAME) {
      var regexp = /./;
      try {
        "/./"[METHOD_NAME](regexp);
      } catch (error1) {
        try {
          regexp[MATCH] = false;
          return "/./"[METHOD_NAME](regexp);
        } catch (error2) {
        }
      }
      return false;
    };
  }
});

// node_modules/core-js/modules/es.string.ends-with.js
var require_es_string_ends_with = __commonJS({
  "node_modules/core-js/modules/es.string.ends-with.js"() {
    "use strict";
    var $ = require_export();
    var uncurryThis = require_function_uncurry_this_clause();
    var getOwnPropertyDescriptor = require_object_get_own_property_descriptor().f;
    var toLength = require_to_length();
    var toString = require_to_string();
    var notARegExp = require_not_a_regexp();
    var requireObjectCoercible = require_require_object_coercible();
    var correctIsRegExpLogic = require_correct_is_regexp_logic();
    var IS_PURE = require_is_pure();
    var slice = uncurryThis("".slice);
    var min = Math.min;
    var CORRECT_IS_REGEXP_LOGIC = correctIsRegExpLogic("endsWith");
    var MDN_POLYFILL_BUG = !IS_PURE && !CORRECT_IS_REGEXP_LOGIC && !!function() {
      var descriptor = getOwnPropertyDescriptor(String.prototype, "endsWith");
      return descriptor && !descriptor.writable;
    }();
    $({
      target: "String",
      proto: true,
      forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC
    }, {
      endsWith: function endsWith(searchString) {
        var that = toString(requireObjectCoercible(this));
        notARegExp(searchString);
        var endPosition = arguments.length > 1 ? arguments[1] : void 0;
        var len = that.length;
        var end = endPosition === void 0 ? len : min(toLength(endPosition), len);
        var search = toString(searchString);
        return slice(that, end - search.length, end) === search;
      }
    });
  }
});

// node_modules/core-js/modules/es.string.includes.js
var require_es_string_includes = __commonJS({
  "node_modules/core-js/modules/es.string.includes.js"() {
    "use strict";
    var $ = require_export();
    var uncurryThis = require_function_uncurry_this();
    var notARegExp = require_not_a_regexp();
    var requireObjectCoercible = require_require_object_coercible();
    var toString = require_to_string();
    var correctIsRegExpLogic = require_correct_is_regexp_logic();
    var stringIndexOf = uncurryThis("".indexOf);
    $({
      target: "String",
      proto: true,
      forced: !correctIsRegExpLogic("includes")
    }, {
      includes: function includes(searchString) {
        return !!~stringIndexOf(toString(requireObjectCoercible(this)), toString(notARegExp(searchString)), arguments.length > 1 ? arguments[1] : void 0);
      }
    });
  }
});

// node_modules/core-js/modules/es.string.is-well-formed.js
var require_es_string_is_well_formed = __commonJS({
  "node_modules/core-js/modules/es.string.is-well-formed.js"() {
    "use strict";
    var $ = require_export();
    var uncurryThis = require_function_uncurry_this();
    var requireObjectCoercible = require_require_object_coercible();
    var toString = require_to_string();
    var charCodeAt = uncurryThis("".charCodeAt);
    $({
      target: "String",
      proto: true
    }, {
      isWellFormed: function isWellFormed() {
        var S = toString(requireObjectCoercible(this));
        var length = S.length;
        for (var i = 0; i < length; i++) {
          var charCode = charCodeAt(S, i);
          if ((charCode & 63488) !== 55296) continue;
          if (charCode >= 56320 || ++i >= length || (charCodeAt(S, i) & 64512) !== 56320) return false;
        }
        return true;
      }
    });
  }
});

// node_modules/core-js/modules/es.string.match-all.js
var require_es_string_match_all = __commonJS({
  "node_modules/core-js/modules/es.string.match-all.js"() {
    "use strict";
    var $ = require_export();
    var call = require_function_call();
    var uncurryThis = require_function_uncurry_this_clause();
    var createIteratorConstructor = require_iterator_create_constructor();
    var createIterResultObject = require_create_iter_result_object();
    var requireObjectCoercible = require_require_object_coercible();
    var toLength = require_to_length();
    var toString = require_to_string();
    var anObject = require_an_object();
    var isObject = require_is_object();
    var classof = require_classof_raw();
    var isRegExp = require_is_regexp();
    var getRegExpFlags = require_regexp_get_flags();
    var getMethod = require_get_method();
    var defineBuiltIn = require_define_built_in();
    var fails = require_fails();
    var wellKnownSymbol = require_well_known_symbol();
    var speciesConstructor = require_species_constructor();
    var advanceStringIndex = require_advance_string_index();
    var regExpExec = require_regexp_exec_abstract();
    var InternalStateModule = require_internal_state();
    var IS_PURE = require_is_pure();
    var MATCH_ALL = wellKnownSymbol("matchAll");
    var REGEXP_STRING = "RegExp String";
    var REGEXP_STRING_ITERATOR = REGEXP_STRING + " Iterator";
    var setInternalState = InternalStateModule.set;
    var getInternalState = InternalStateModule.getterFor(REGEXP_STRING_ITERATOR);
    var RegExpPrototype = RegExp.prototype;
    var $TypeError = TypeError;
    var stringIndexOf = uncurryThis("".indexOf);
    var nativeMatchAll = uncurryThis("".matchAll);
    var WORKS_WITH_NON_GLOBAL_REGEX = !!nativeMatchAll && !fails(function() {
      nativeMatchAll("a", /./);
    });
    var $RegExpStringIterator = createIteratorConstructor(function RegExpStringIterator(regexp, string, $global, fullUnicode) {
      setInternalState(this, {
        type: REGEXP_STRING_ITERATOR,
        regexp,
        string,
        global: $global,
        unicode: fullUnicode,
        done: false
      });
    }, REGEXP_STRING, function next() {
      var state = getInternalState(this);
      if (state.done) return createIterResultObject(void 0, true);
      var R = state.regexp;
      var S = state.string;
      var match = regExpExec(R, S);
      if (match === null) {
        state.done = true;
        return createIterResultObject(void 0, true);
      }
      if (state.global) {
        if (toString(match[0]) === "") R.lastIndex = advanceStringIndex(S, toLength(R.lastIndex), state.unicode);
        return createIterResultObject(match, false);
      }
      state.done = true;
      return createIterResultObject(match, false);
    });
    var $matchAll = function(string) {
      var R = anObject(this);
      var S = toString(string);
      var C = speciesConstructor(R, RegExp);
      var flags = toString(getRegExpFlags(R));
      var matcher, $global, fullUnicode;
      matcher = new C(C === RegExp ? R.source : R, flags);
      $global = !!~stringIndexOf(flags, "g");
      fullUnicode = !!~stringIndexOf(flags, "u");
      matcher.lastIndex = toLength(R.lastIndex);
      return new $RegExpStringIterator(matcher, S, $global, fullUnicode);
    };
    $({
      target: "String",
      proto: true,
      forced: WORKS_WITH_NON_GLOBAL_REGEX
    }, {
      matchAll: function matchAll(regexp) {
        var O = requireObjectCoercible(this);
        var flags, S, matcher, rx;
        if (isObject(regexp)) {
          if (isRegExp(regexp)) {
            flags = toString(requireObjectCoercible(getRegExpFlags(regexp)));
            if (!~stringIndexOf(flags, "g")) throw new $TypeError("`.matchAll` does not allow non-global regexes");
          }
          if (WORKS_WITH_NON_GLOBAL_REGEX) return nativeMatchAll(O, regexp);
          matcher = getMethod(regexp, MATCH_ALL);
          if (matcher === void 0 && IS_PURE && classof(regexp) === "RegExp") matcher = $matchAll;
          if (matcher) return call(matcher, regexp, O);
        } else if (WORKS_WITH_NON_GLOBAL_REGEX) return nativeMatchAll(O, regexp);
        S = toString(O);
        rx = new RegExp(regexp, "g");
        return IS_PURE ? call($matchAll, rx, S) : rx[MATCH_ALL](S);
      }
    });
    IS_PURE || MATCH_ALL in RegExpPrototype || defineBuiltIn(RegExpPrototype, MATCH_ALL, $matchAll);
  }
});

// node_modules/core-js/internals/string-pad-webkit-bug.js
var require_string_pad_webkit_bug = __commonJS({
  "node_modules/core-js/internals/string-pad-webkit-bug.js"(exports, module) {
    "use strict";
    var userAgent = require_environment_user_agent();
    module.exports = /Version\/10(?:\.\d+){1,2}(?: [\w./]+)?(?: Mobile\/\w+)? Safari\//.test(userAgent);
  }
});

// node_modules/core-js/modules/es.string.pad-end.js
var require_es_string_pad_end = __commonJS({
  "node_modules/core-js/modules/es.string.pad-end.js"() {
    "use strict";
    var $ = require_export();
    var $padEnd = require_string_pad().end;
    var WEBKIT_BUG = require_string_pad_webkit_bug();
    $({
      target: "String",
      proto: true,
      forced: WEBKIT_BUG
    }, {
      padEnd: function padEnd(maxLength) {
        return $padEnd(this, maxLength, arguments.length > 1 ? arguments[1] : void 0);
      }
    });
  }
});

// node_modules/core-js/modules/es.string.pad-start.js
var require_es_string_pad_start = __commonJS({
  "node_modules/core-js/modules/es.string.pad-start.js"() {
    "use strict";
    var $ = require_export();
    var $padStart = require_string_pad().start;
    var WEBKIT_BUG = require_string_pad_webkit_bug();
    $({
      target: "String",
      proto: true,
      forced: WEBKIT_BUG
    }, {
      padStart: function padStart(maxLength) {
        return $padStart(this, maxLength, arguments.length > 1 ? arguments[1] : void 0);
      }
    });
  }
});

// node_modules/core-js/modules/es.string.repeat.js
var require_es_string_repeat = __commonJS({
  "node_modules/core-js/modules/es.string.repeat.js"() {
    "use strict";
    var $ = require_export();
    var repeat = require_string_repeat();
    $({
      target: "String",
      proto: true
    }, {
      repeat
    });
  }
});

// node_modules/core-js/modules/es.string.replace-all.js
var require_es_string_replace_all = __commonJS({
  "node_modules/core-js/modules/es.string.replace-all.js"() {
    "use strict";
    var $ = require_export();
    var call = require_function_call();
    var uncurryThis = require_function_uncurry_this();
    var requireObjectCoercible = require_require_object_coercible();
    var isCallable = require_is_callable();
    var isObject = require_is_object();
    var isRegExp = require_is_regexp();
    var toString = require_to_string();
    var getMethod = require_get_method();
    var getRegExpFlags = require_regexp_get_flags();
    var getSubstitution = require_get_substitution();
    var wellKnownSymbol = require_well_known_symbol();
    var IS_PURE = require_is_pure();
    var REPLACE = wellKnownSymbol("replace");
    var $TypeError = TypeError;
    var indexOf = uncurryThis("".indexOf);
    var replace = uncurryThis("".replace);
    var stringSlice = uncurryThis("".slice);
    var max = Math.max;
    $({
      target: "String",
      proto: true
    }, {
      replaceAll: function replaceAll(searchValue, replaceValue) {
        var O = requireObjectCoercible(this);
        var IS_REG_EXP, flags, replacer, string, searchString, functionalReplace, searchLength, advanceBy, position, replacement;
        var endOfLastMatch = 0;
        var result = "";
        if (isObject(searchValue)) {
          IS_REG_EXP = isRegExp(searchValue);
          if (IS_REG_EXP) {
            flags = toString(requireObjectCoercible(getRegExpFlags(searchValue)));
            if (!~indexOf(flags, "g")) throw new $TypeError("`.replaceAll` does not allow non-global regexes");
          }
          replacer = getMethod(searchValue, REPLACE);
          if (replacer) return call(replacer, searchValue, O, replaceValue);
          if (IS_PURE && IS_REG_EXP) return replace(toString(O), searchValue, replaceValue);
        }
        string = toString(O);
        searchString = toString(searchValue);
        functionalReplace = isCallable(replaceValue);
        if (!functionalReplace) replaceValue = toString(replaceValue);
        searchLength = searchString.length;
        advanceBy = max(1, searchLength);
        position = indexOf(string, searchString);
        while (position !== -1) {
          replacement = functionalReplace ? toString(replaceValue(searchString, position, string)) : getSubstitution(searchString, string, position, [], void 0, replaceValue);
          result += stringSlice(string, endOfLastMatch, position) + replacement;
          endOfLastMatch = position + searchLength;
          position = position + advanceBy > string.length ? -1 : indexOf(string, searchString, position + advanceBy);
        }
        if (endOfLastMatch < string.length) {
          result += stringSlice(string, endOfLastMatch);
        }
        return result;
      }
    });
  }
});

// node_modules/core-js/modules/es.string.starts-with.js
var require_es_string_starts_with = __commonJS({
  "node_modules/core-js/modules/es.string.starts-with.js"() {
    "use strict";
    var $ = require_export();
    var uncurryThis = require_function_uncurry_this_clause();
    var getOwnPropertyDescriptor = require_object_get_own_property_descriptor().f;
    var toLength = require_to_length();
    var toString = require_to_string();
    var notARegExp = require_not_a_regexp();
    var requireObjectCoercible = require_require_object_coercible();
    var correctIsRegExpLogic = require_correct_is_regexp_logic();
    var IS_PURE = require_is_pure();
    var stringSlice = uncurryThis("".slice);
    var min = Math.min;
    var CORRECT_IS_REGEXP_LOGIC = correctIsRegExpLogic("startsWith");
    var MDN_POLYFILL_BUG = !IS_PURE && !CORRECT_IS_REGEXP_LOGIC && !!function() {
      var descriptor = getOwnPropertyDescriptor(String.prototype, "startsWith");
      return descriptor && !descriptor.writable;
    }();
    $({
      target: "String",
      proto: true,
      forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC
    }, {
      startsWith: function startsWith(searchString) {
        var that = toString(requireObjectCoercible(this));
        notARegExp(searchString);
        var index = toLength(min(arguments.length > 1 ? arguments[1] : void 0, that.length));
        var search = toString(searchString);
        return stringSlice(that, index, index + search.length) === search;
      }
    });
  }
});

// node_modules/core-js/modules/es.string.substr.js
var require_es_string_substr = __commonJS({
  "node_modules/core-js/modules/es.string.substr.js"() {
    "use strict";
    var $ = require_export();
    var uncurryThis = require_function_uncurry_this();
    var requireObjectCoercible = require_require_object_coercible();
    var toIntegerOrInfinity = require_to_integer_or_infinity();
    var toString = require_to_string();
    var stringSlice = uncurryThis("".slice);
    var max = Math.max;
    var min = Math.min;
    var FORCED = !"".substr || "ab".substr(-1) !== "b";
    $({
      target: "String",
      proto: true,
      forced: FORCED
    }, {
      substr: function substr(start, length) {
        var that = toString(requireObjectCoercible(this));
        var size = that.length;
        var intStart = toIntegerOrInfinity(start);
        var intLength, intEnd;
        if (intStart === Infinity) intStart = 0;
        if (intStart < 0) intStart = max(size + intStart, 0);
        intLength = length === void 0 ? size : toIntegerOrInfinity(length);
        if (intLength <= 0 || intLength === Infinity) return "";
        intEnd = min(intStart + intLength, size);
        return intStart >= intEnd ? "" : stringSlice(that, intStart, intEnd);
      }
    });
  }
});

// node_modules/core-js/modules/es.string.to-well-formed.js
var require_es_string_to_well_formed = __commonJS({
  "node_modules/core-js/modules/es.string.to-well-formed.js"() {
    "use strict";
    var $ = require_export();
    var call = require_function_call();
    var uncurryThis = require_function_uncurry_this();
    var requireObjectCoercible = require_require_object_coercible();
    var toString = require_to_string();
    var fails = require_fails();
    var $Array = Array;
    var charAt = uncurryThis("".charAt);
    var charCodeAt = uncurryThis("".charCodeAt);
    var join = uncurryThis([].join);
    var $toWellFormed = "".toWellFormed;
    var REPLACEMENT_CHARACTER = "�";
    var TO_STRING_CONVERSION_BUG = $toWellFormed && fails(function() {
      return call($toWellFormed, 1) !== "1";
    });
    $({
      target: "String",
      proto: true,
      forced: TO_STRING_CONVERSION_BUG
    }, {
      toWellFormed: function toWellFormed() {
        var S = toString(requireObjectCoercible(this));
        if (TO_STRING_CONVERSION_BUG) return call($toWellFormed, S);
        var length = S.length;
        var result = $Array(length);
        for (var i = 0; i < length; i++) {
          var charCode = charCodeAt(S, i);
          if ((charCode & 63488) !== 55296) result[i] = charAt(S, i);
          else if (charCode >= 56320 || i + 1 >= length || (charCodeAt(S, i + 1) & 64512) !== 56320) result[i] = REPLACEMENT_CHARACTER;
          else {
            result[i] = charAt(S, i);
            result[++i] = charAt(S, i);
          }
        }
        return join(result, "");
      }
    });
  }
});

// node_modules/core-js/internals/string-trim-forced.js
var require_string_trim_forced = __commonJS({
  "node_modules/core-js/internals/string-trim-forced.js"(exports, module) {
    "use strict";
    var PROPER_FUNCTION_NAME = require_function_name().PROPER;
    var fails = require_fails();
    var whitespaces = require_whitespaces();
    var non = "​᠎";
    module.exports = function(METHOD_NAME) {
      return fails(function() {
        return !!whitespaces[METHOD_NAME]() || non[METHOD_NAME]() !== non || PROPER_FUNCTION_NAME && whitespaces[METHOD_NAME].name !== METHOD_NAME;
      });
    };
  }
});

// node_modules/core-js/modules/es.string.trim.js
var require_es_string_trim = __commonJS({
  "node_modules/core-js/modules/es.string.trim.js"() {
    "use strict";
    var $ = require_export();
    var $trim = require_string_trim().trim;
    var forcedStringTrimMethod = require_string_trim_forced();
    $({
      target: "String",
      proto: true,
      forced: forcedStringTrimMethod("trim")
    }, {
      trim: function trim() {
        return $trim(this);
      }
    });
  }
});

// node_modules/core-js/internals/string-trim-start.js
var require_string_trim_start = __commonJS({
  "node_modules/core-js/internals/string-trim-start.js"(exports, module) {
    "use strict";
    var $trimStart = require_string_trim().start;
    var forcedStringTrimMethod = require_string_trim_forced();
    module.exports = forcedStringTrimMethod("trimStart") ? function trimStart() {
      return $trimStart(this);
    } : "".trimStart;
  }
});

// node_modules/core-js/modules/es.string.trim-left.js
var require_es_string_trim_left = __commonJS({
  "node_modules/core-js/modules/es.string.trim-left.js"() {
    "use strict";
    var $ = require_export();
    var trimStart = require_string_trim_start();
    $({
      target: "String",
      proto: true,
      name: "trimStart",
      forced: "".trimLeft !== trimStart
    }, {
      trimLeft: trimStart
    });
  }
});

// node_modules/core-js/modules/es.string.trim-start.js
var require_es_string_trim_start = __commonJS({
  "node_modules/core-js/modules/es.string.trim-start.js"() {
    "use strict";
    require_es_string_trim_left();
    var $ = require_export();
    var trimStart = require_string_trim_start();
    $({
      target: "String",
      proto: true,
      name: "trimStart",
      forced: "".trimStart !== trimStart
    }, {
      trimStart
    });
  }
});

// node_modules/core-js/internals/string-trim-end.js
var require_string_trim_end = __commonJS({
  "node_modules/core-js/internals/string-trim-end.js"(exports, module) {
    "use strict";
    var $trimEnd = require_string_trim().end;
    var forcedStringTrimMethod = require_string_trim_forced();
    module.exports = forcedStringTrimMethod("trimEnd") ? function trimEnd() {
      return $trimEnd(this);
    } : "".trimEnd;
  }
});

// node_modules/core-js/modules/es.string.trim-right.js
var require_es_string_trim_right = __commonJS({
  "node_modules/core-js/modules/es.string.trim-right.js"() {
    "use strict";
    var $ = require_export();
    var trimEnd = require_string_trim_end();
    $({
      target: "String",
      proto: true,
      name: "trimEnd",
      forced: "".trimRight !== trimEnd
    }, {
      trimRight: trimEnd
    });
  }
});

// node_modules/core-js/modules/es.string.trim-end.js
var require_es_string_trim_end = __commonJS({
  "node_modules/core-js/modules/es.string.trim-end.js"() {
    "use strict";
    require_es_string_trim_right();
    var $ = require_export();
    var trimEnd = require_string_trim_end();
    $({
      target: "String",
      proto: true,
      name: "trimEnd",
      forced: "".trimEnd !== trimEnd
    }, {
      trimEnd
    });
  }
});

// node_modules/core-js/internals/create-html.js
var require_create_html = __commonJS({
  "node_modules/core-js/internals/create-html.js"(exports, module) {
    "use strict";
    var uncurryThis = require_function_uncurry_this();
    var requireObjectCoercible = require_require_object_coercible();
    var toString = require_to_string();
    var quot = /"/g;
    var replace = uncurryThis("".replace);
    module.exports = function(string, tag, attribute, value) {
      var S = toString(requireObjectCoercible(string));
      var p1 = "<" + tag;
      if (attribute !== "") p1 += " " + attribute + '="' + replace(toString(value), quot, "&quot;") + '"';
      return p1 + ">" + S + "</" + tag + ">";
    };
  }
});

// node_modules/core-js/internals/string-html-forced.js
var require_string_html_forced = __commonJS({
  "node_modules/core-js/internals/string-html-forced.js"(exports, module) {
    "use strict";
    var fails = require_fails();
    module.exports = function(METHOD_NAME) {
      return fails(function() {
        var test = ""[METHOD_NAME]('"');
        return test !== test.toLowerCase() || test.split('"').length > 3;
      });
    };
  }
});

// node_modules/core-js/modules/es.string.anchor.js
var require_es_string_anchor = __commonJS({
  "node_modules/core-js/modules/es.string.anchor.js"() {
    "use strict";
    var $ = require_export();
    var createHTML = require_create_html();
    var forcedStringHTMLMethod = require_string_html_forced();
    $({
      target: "String",
      proto: true,
      forced: forcedStringHTMLMethod("anchor")
    }, {
      anchor: function anchor(name) {
        return createHTML(this, "a", "name", name);
      }
    });
  }
});

// node_modules/core-js/modules/es.string.big.js
var require_es_string_big = __commonJS({
  "node_modules/core-js/modules/es.string.big.js"() {
    "use strict";
    var $ = require_export();
    var createHTML = require_create_html();
    var forcedStringHTMLMethod = require_string_html_forced();
    $({
      target: "String",
      proto: true,
      forced: forcedStringHTMLMethod("big")
    }, {
      big: function big() {
        return createHTML(this, "big", "", "");
      }
    });
  }
});

// node_modules/core-js/modules/es.string.blink.js
var require_es_string_blink = __commonJS({
  "node_modules/core-js/modules/es.string.blink.js"() {
    "use strict";
    var $ = require_export();
    var createHTML = require_create_html();
    var forcedStringHTMLMethod = require_string_html_forced();
    $({
      target: "String",
      proto: true,
      forced: forcedStringHTMLMethod("blink")
    }, {
      blink: function blink() {
        return createHTML(this, "blink", "", "");
      }
    });
  }
});

// node_modules/core-js/modules/es.string.bold.js
var require_es_string_bold = __commonJS({
  "node_modules/core-js/modules/es.string.bold.js"() {
    "use strict";
    var $ = require_export();
    var createHTML = require_create_html();
    var forcedStringHTMLMethod = require_string_html_forced();
    $({
      target: "String",
      proto: true,
      forced: forcedStringHTMLMethod("bold")
    }, {
      bold: function bold() {
        return createHTML(this, "b", "", "");
      }
    });
  }
});

// node_modules/core-js/modules/es.string.fixed.js
var require_es_string_fixed = __commonJS({
  "node_modules/core-js/modules/es.string.fixed.js"() {
    "use strict";
    var $ = require_export();
    var createHTML = require_create_html();
    var forcedStringHTMLMethod = require_string_html_forced();
    $({
      target: "String",
      proto: true,
      forced: forcedStringHTMLMethod("fixed")
    }, {
      fixed: function fixed() {
        return createHTML(this, "tt", "", "");
      }
    });
  }
});

// node_modules/core-js/modules/es.string.fontcolor.js
var require_es_string_fontcolor = __commonJS({
  "node_modules/core-js/modules/es.string.fontcolor.js"() {
    "use strict";
    var $ = require_export();
    var createHTML = require_create_html();
    var forcedStringHTMLMethod = require_string_html_forced();
    $({
      target: "String",
      proto: true,
      forced: forcedStringHTMLMethod("fontcolor")
    }, {
      fontcolor: function fontcolor(color) {
        return createHTML(this, "font", "color", color);
      }
    });
  }
});

// node_modules/core-js/modules/es.string.fontsize.js
var require_es_string_fontsize = __commonJS({
  "node_modules/core-js/modules/es.string.fontsize.js"() {
    "use strict";
    var $ = require_export();
    var createHTML = require_create_html();
    var forcedStringHTMLMethod = require_string_html_forced();
    $({
      target: "String",
      proto: true,
      forced: forcedStringHTMLMethod("fontsize")
    }, {
      fontsize: function fontsize(size) {
        return createHTML(this, "font", "size", size);
      }
    });
  }
});

// node_modules/core-js/modules/es.string.italics.js
var require_es_string_italics = __commonJS({
  "node_modules/core-js/modules/es.string.italics.js"() {
    "use strict";
    var $ = require_export();
    var createHTML = require_create_html();
    var forcedStringHTMLMethod = require_string_html_forced();
    $({
      target: "String",
      proto: true,
      forced: forcedStringHTMLMethod("italics")
    }, {
      italics: function italics() {
        return createHTML(this, "i", "", "");
      }
    });
  }
});

// node_modules/core-js/modules/es.string.link.js
var require_es_string_link = __commonJS({
  "node_modules/core-js/modules/es.string.link.js"() {
    "use strict";
    var $ = require_export();
    var createHTML = require_create_html();
    var forcedStringHTMLMethod = require_string_html_forced();
    $({
      target: "String",
      proto: true,
      forced: forcedStringHTMLMethod("link")
    }, {
      link: function link(url) {
        return createHTML(this, "a", "href", url);
      }
    });
  }
});

// node_modules/core-js/modules/es.string.small.js
var require_es_string_small = __commonJS({
  "node_modules/core-js/modules/es.string.small.js"() {
    "use strict";
    var $ = require_export();
    var createHTML = require_create_html();
    var forcedStringHTMLMethod = require_string_html_forced();
    $({
      target: "String",
      proto: true,
      forced: forcedStringHTMLMethod("small")
    }, {
      small: function small() {
        return createHTML(this, "small", "", "");
      }
    });
  }
});

// node_modules/core-js/modules/es.string.strike.js
var require_es_string_strike = __commonJS({
  "node_modules/core-js/modules/es.string.strike.js"() {
    "use strict";
    var $ = require_export();
    var createHTML = require_create_html();
    var forcedStringHTMLMethod = require_string_html_forced();
    $({
      target: "String",
      proto: true,
      forced: forcedStringHTMLMethod("strike")
    }, {
      strike: function strike() {
        return createHTML(this, "strike", "", "");
      }
    });
  }
});

// node_modules/core-js/modules/es.string.sub.js
var require_es_string_sub = __commonJS({
  "node_modules/core-js/modules/es.string.sub.js"() {
    "use strict";
    var $ = require_export();
    var createHTML = require_create_html();
    var forcedStringHTMLMethod = require_string_html_forced();
    $({
      target: "String",
      proto: true,
      forced: forcedStringHTMLMethod("sub")
    }, {
      sub: function sub() {
        return createHTML(this, "sub", "", "");
      }
    });
  }
});

// node_modules/core-js/modules/es.string.sup.js
var require_es_string_sup = __commonJS({
  "node_modules/core-js/modules/es.string.sup.js"() {
    "use strict";
    var $ = require_export();
    var createHTML = require_create_html();
    var forcedStringHTMLMethod = require_string_html_forced();
    $({
      target: "String",
      proto: true,
      forced: forcedStringHTMLMethod("sup")
    }, {
      sup: function sup() {
        return createHTML(this, "sup", "", "");
      }
    });
  }
});

// node_modules/core-js/es/string/index.js
var require_string = __commonJS({
  "node_modules/core-js/es/string/index.js"(exports, module) {
    require_es_object_to_string();
    require_es_regexp_exec();
    require_es_string_from_code_point();
    require_es_string_raw();
    require_es_string_code_point_at();
    require_es_string_at_alternative();
    require_es_string_ends_with();
    require_es_string_includes();
    require_es_string_is_well_formed();
    require_es_string_match();
    require_es_string_match_all();
    require_es_string_pad_end();
    require_es_string_pad_start();
    require_es_string_repeat();
    require_es_string_replace();
    require_es_string_replace_all();
    require_es_string_search();
    require_es_string_split();
    require_es_string_starts_with();
    require_es_string_substr();
    require_es_string_to_well_formed();
    require_es_string_trim();
    require_es_string_trim_start();
    require_es_string_trim_end();
    require_es_string_iterator();
    require_es_string_anchor();
    require_es_string_big();
    require_es_string_blink();
    require_es_string_bold();
    require_es_string_fixed();
    require_es_string_fontcolor();
    require_es_string_fontsize();
    require_es_string_italics();
    require_es_string_link();
    require_es_string_small();
    require_es_string_strike();
    require_es_string_sub();
    require_es_string_sup();
    var path = require_path();
    module.exports = path.String;
  }
});
export default require_string();
//# sourceMappingURL=core-js_es_string.js.map
