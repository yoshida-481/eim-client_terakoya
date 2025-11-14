import {
  require_species_constructor
} from "./chunk-EO4T7LOD.js";
import {
  require_string_multibyte
} from "./chunk-G7RHFS26.js";
import {
  require_same_value
} from "./chunk-IXACK6AY.js";
import {
  require_function_apply
} from "./chunk-MPAR7FPC.js";
import {
  require_object_create
} from "./chunk-5J3DNA3C.js";
import {
  require_to_string
} from "./chunk-L2Q7U5JX.js";
import {
  require_an_object,
  require_classof_raw,
  require_create_non_enumerable_property,
  require_define_built_in,
  require_export,
  require_fails,
  require_function_call,
  require_function_uncurry_this,
  require_get_method,
  require_global_this,
  require_has_own_property,
  require_internal_state,
  require_is_callable,
  require_is_object,
  require_object_is_prototype_of,
  require_require_object_coercible,
  require_shared,
  require_to_integer_or_infinity,
  require_to_length,
  require_to_object,
  require_well_known_symbol
} from "./chunk-SYAKHIZ5.js";
import {
  __commonJS
} from "./chunk-F52B2RLG.js";

// node_modules/core-js/internals/regexp-flags.js
var require_regexp_flags = __commonJS({
  "node_modules/core-js/internals/regexp-flags.js"(exports, module) {
    "use strict";
    var anObject = require_an_object();
    module.exports = function() {
      var that = anObject(this);
      var result = "";
      if (that.hasIndices) result += "d";
      if (that.global) result += "g";
      if (that.ignoreCase) result += "i";
      if (that.multiline) result += "m";
      if (that.dotAll) result += "s";
      if (that.unicode) result += "u";
      if (that.unicodeSets) result += "v";
      if (that.sticky) result += "y";
      return result;
    };
  }
});

// node_modules/core-js/internals/regexp-sticky-helpers.js
var require_regexp_sticky_helpers = __commonJS({
  "node_modules/core-js/internals/regexp-sticky-helpers.js"(exports, module) {
    "use strict";
    var fails = require_fails();
    var globalThis = require_global_this();
    var $RegExp = globalThis.RegExp;
    var UNSUPPORTED_Y = fails(function() {
      var re = $RegExp("a", "y");
      re.lastIndex = 2;
      return re.exec("abcd") !== null;
    });
    var MISSED_STICKY = UNSUPPORTED_Y || fails(function() {
      return !$RegExp("a", "y").sticky;
    });
    var BROKEN_CARET = UNSUPPORTED_Y || fails(function() {
      var re = $RegExp("^r", "gy");
      re.lastIndex = 2;
      return re.exec("str") !== null;
    });
    module.exports = {
      BROKEN_CARET,
      MISSED_STICKY,
      UNSUPPORTED_Y
    };
  }
});

// node_modules/core-js/internals/regexp-unsupported-dot-all.js
var require_regexp_unsupported_dot_all = __commonJS({
  "node_modules/core-js/internals/regexp-unsupported-dot-all.js"(exports, module) {
    "use strict";
    var fails = require_fails();
    var globalThis = require_global_this();
    var $RegExp = globalThis.RegExp;
    module.exports = fails(function() {
      var re = $RegExp(".", "s");
      return !(re.dotAll && re.test("\n") && re.flags === "s");
    });
  }
});

// node_modules/core-js/internals/regexp-unsupported-ncg.js
var require_regexp_unsupported_ncg = __commonJS({
  "node_modules/core-js/internals/regexp-unsupported-ncg.js"(exports, module) {
    "use strict";
    var fails = require_fails();
    var globalThis = require_global_this();
    var $RegExp = globalThis.RegExp;
    module.exports = fails(function() {
      var re = $RegExp("(?<a>b)", "g");
      return re.exec("b").groups.a !== "b" || "b".replace(re, "$<a>c") !== "bc";
    });
  }
});

// node_modules/core-js/internals/regexp-exec.js
var require_regexp_exec = __commonJS({
  "node_modules/core-js/internals/regexp-exec.js"(exports, module) {
    "use strict";
    var call = require_function_call();
    var uncurryThis = require_function_uncurry_this();
    var toString = require_to_string();
    var regexpFlags = require_regexp_flags();
    var stickyHelpers = require_regexp_sticky_helpers();
    var shared = require_shared();
    var create = require_object_create();
    var getInternalState = require_internal_state().get;
    var UNSUPPORTED_DOT_ALL = require_regexp_unsupported_dot_all();
    var UNSUPPORTED_NCG = require_regexp_unsupported_ncg();
    var nativeReplace = shared("native-string-replace", String.prototype.replace);
    var nativeExec = RegExp.prototype.exec;
    var patchedExec = nativeExec;
    var charAt = uncurryThis("".charAt);
    var indexOf = uncurryThis("".indexOf);
    var replace = uncurryThis("".replace);
    var stringSlice = uncurryThis("".slice);
    var UPDATES_LAST_INDEX_WRONG = function() {
      var re1 = /a/;
      var re2 = /b*/g;
      call(nativeExec, re1, "a");
      call(nativeExec, re2, "a");
      return re1.lastIndex !== 0 || re2.lastIndex !== 0;
    }();
    var UNSUPPORTED_Y = stickyHelpers.BROKEN_CARET;
    var NPCG_INCLUDED = /()??/.exec("")[1] !== void 0;
    var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y || UNSUPPORTED_DOT_ALL || UNSUPPORTED_NCG;
    if (PATCH) {
      patchedExec = function exec(string) {
        var re = this;
        var state = getInternalState(re);
        var str = toString(string);
        var raw = state.raw;
        var result, reCopy, lastIndex, match, i, object, group;
        if (raw) {
          raw.lastIndex = re.lastIndex;
          result = call(patchedExec, raw, str);
          re.lastIndex = raw.lastIndex;
          return result;
        }
        var groups = state.groups;
        var sticky = UNSUPPORTED_Y && re.sticky;
        var flags = call(regexpFlags, re);
        var source = re.source;
        var charsAdded = 0;
        var strCopy = str;
        if (sticky) {
          flags = replace(flags, "y", "");
          if (indexOf(flags, "g") === -1) {
            flags += "g";
          }
          strCopy = stringSlice(str, re.lastIndex);
          if (re.lastIndex > 0 && (!re.multiline || re.multiline && charAt(str, re.lastIndex - 1) !== "\n")) {
            source = "(?: " + source + ")";
            strCopy = " " + strCopy;
            charsAdded++;
          }
          reCopy = new RegExp("^(?:" + source + ")", flags);
        }
        if (NPCG_INCLUDED) {
          reCopy = new RegExp("^" + source + "$(?!\\s)", flags);
        }
        if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;
        match = call(nativeExec, sticky ? reCopy : re, strCopy);
        if (sticky) {
          if (match) {
            match.input = stringSlice(match.input, charsAdded);
            match[0] = stringSlice(match[0], charsAdded);
            match.index = re.lastIndex;
            re.lastIndex += match[0].length;
          } else re.lastIndex = 0;
        } else if (UPDATES_LAST_INDEX_WRONG && match) {
          re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
        }
        if (NPCG_INCLUDED && match && match.length > 1) {
          call(nativeReplace, match[0], reCopy, function() {
            for (i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === void 0) match[i] = void 0;
            }
          });
        }
        if (match && groups) {
          match.groups = object = create(null);
          for (i = 0; i < groups.length; i++) {
            group = groups[i];
            object[group[0]] = match[group[1]];
          }
        }
        return match;
      };
    }
    module.exports = patchedExec;
  }
});

// node_modules/core-js/modules/es.regexp.exec.js
var require_es_regexp_exec = __commonJS({
  "node_modules/core-js/modules/es.regexp.exec.js"() {
    "use strict";
    var $ = require_export();
    var exec = require_regexp_exec();
    $({
      target: "RegExp",
      proto: true,
      forced: /./.exec !== exec
    }, {
      exec
    });
  }
});

// node_modules/core-js/internals/fix-regexp-well-known-symbol-logic.js
var require_fix_regexp_well_known_symbol_logic = __commonJS({
  "node_modules/core-js/internals/fix-regexp-well-known-symbol-logic.js"(exports, module) {
    "use strict";
    require_es_regexp_exec();
    var call = require_function_call();
    var defineBuiltIn = require_define_built_in();
    var regexpExec = require_regexp_exec();
    var fails = require_fails();
    var wellKnownSymbol = require_well_known_symbol();
    var createNonEnumerableProperty = require_create_non_enumerable_property();
    var SPECIES = wellKnownSymbol("species");
    var RegExpPrototype = RegExp.prototype;
    module.exports = function(KEY, exec, FORCED, SHAM) {
      var SYMBOL = wellKnownSymbol(KEY);
      var DELEGATES_TO_SYMBOL = !fails(function() {
        var O = {};
        O[SYMBOL] = function() {
          return 7;
        };
        return ""[KEY](O) !== 7;
      });
      var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function() {
        var execCalled = false;
        var re = /a/;
        if (KEY === "split") {
          re = {};
          re.constructor = {};
          re.constructor[SPECIES] = function() {
            return re;
          };
          re.flags = "";
          re[SYMBOL] = /./[SYMBOL];
        }
        re.exec = function() {
          execCalled = true;
          return null;
        };
        re[SYMBOL]("");
        return !execCalled;
      });
      if (!DELEGATES_TO_SYMBOL || !DELEGATES_TO_EXEC || FORCED) {
        var nativeRegExpMethod = /./[SYMBOL];
        var methods = exec(SYMBOL, ""[KEY], function(nativeMethod, regexp, str, arg2, forceStringMethod) {
          var $exec = regexp.exec;
          if ($exec === regexpExec || $exec === RegExpPrototype.exec) {
            if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
              return {
                done: true,
                value: call(nativeRegExpMethod, regexp, str, arg2)
              };
            }
            return {
              done: true,
              value: call(nativeMethod, str, regexp, arg2)
            };
          }
          return {
            done: false
          };
        });
        defineBuiltIn(String.prototype, KEY, methods[0]);
        defineBuiltIn(RegExpPrototype, SYMBOL, methods[1]);
      }
      if (SHAM) createNonEnumerableProperty(RegExpPrototype[SYMBOL], "sham", true);
    };
  }
});

// node_modules/core-js/internals/advance-string-index.js
var require_advance_string_index = __commonJS({
  "node_modules/core-js/internals/advance-string-index.js"(exports, module) {
    "use strict";
    var charAt = require_string_multibyte().charAt;
    module.exports = function(S, index, unicode) {
      return index + (unicode ? charAt(S, index).length : 1);
    };
  }
});

// node_modules/core-js/internals/regexp-flags-detection.js
var require_regexp_flags_detection = __commonJS({
  "node_modules/core-js/internals/regexp-flags-detection.js"(exports, module) {
    "use strict";
    var globalThis = require_global_this();
    var fails = require_fails();
    var RegExp2 = globalThis.RegExp;
    var FLAGS_GETTER_IS_CORRECT = !fails(function() {
      var INDICES_SUPPORT = true;
      try {
        RegExp2(".", "d");
      } catch (error) {
        INDICES_SUPPORT = false;
      }
      var O = {};
      var calls = "";
      var expected = INDICES_SUPPORT ? "dgimsy" : "gimsy";
      var addGetter = function(key2, chr) {
        Object.defineProperty(O, key2, {
          get: function() {
            calls += chr;
            return true;
          }
        });
      };
      var pairs = {
        dotAll: "s",
        global: "g",
        ignoreCase: "i",
        multiline: "m",
        sticky: "y"
      };
      if (INDICES_SUPPORT) pairs.hasIndices = "d";
      for (var key in pairs) addGetter(key, pairs[key]);
      var result = Object.getOwnPropertyDescriptor(RegExp2.prototype, "flags").get.call(O);
      return result !== expected || calls !== expected;
    });
    module.exports = {
      correct: FLAGS_GETTER_IS_CORRECT
    };
  }
});

// node_modules/core-js/internals/regexp-get-flags.js
var require_regexp_get_flags = __commonJS({
  "node_modules/core-js/internals/regexp-get-flags.js"(exports, module) {
    "use strict";
    var call = require_function_call();
    var hasOwn = require_has_own_property();
    var isPrototypeOf = require_object_is_prototype_of();
    var regExpFlagsDetection = require_regexp_flags_detection();
    var regExpFlagsGetterImplementation = require_regexp_flags();
    var RegExpPrototype = RegExp.prototype;
    module.exports = regExpFlagsDetection.correct ? function(it) {
      return it.flags;
    } : function(it) {
      return !regExpFlagsDetection.correct && isPrototypeOf(RegExpPrototype, it) && !hasOwn(it, "flags") ? call(regExpFlagsGetterImplementation, it) : it.flags;
    };
  }
});

// node_modules/core-js/internals/regexp-exec-abstract.js
var require_regexp_exec_abstract = __commonJS({
  "node_modules/core-js/internals/regexp-exec-abstract.js"(exports, module) {
    "use strict";
    var call = require_function_call();
    var anObject = require_an_object();
    var isCallable = require_is_callable();
    var classof = require_classof_raw();
    var regexpExec = require_regexp_exec();
    var $TypeError = TypeError;
    module.exports = function(R, S) {
      var exec = R.exec;
      if (isCallable(exec)) {
        var result = call(exec, R, S);
        if (result !== null) anObject(result);
        return result;
      }
      if (classof(R) === "RegExp") return call(regexpExec, R, S);
      throw new $TypeError("RegExp#exec called on incompatible receiver");
    };
  }
});

// node_modules/core-js/modules/es.string.match.js
var require_es_string_match = __commonJS({
  "node_modules/core-js/modules/es.string.match.js"() {
    "use strict";
    var call = require_function_call();
    var uncurryThis = require_function_uncurry_this();
    var fixRegExpWellKnownSymbolLogic = require_fix_regexp_well_known_symbol_logic();
    var anObject = require_an_object();
    var isObject = require_is_object();
    var toLength = require_to_length();
    var toString = require_to_string();
    var requireObjectCoercible = require_require_object_coercible();
    var getMethod = require_get_method();
    var advanceStringIndex = require_advance_string_index();
    var getRegExpFlags = require_regexp_get_flags();
    var regExpExec = require_regexp_exec_abstract();
    var stringIndexOf = uncurryThis("".indexOf);
    fixRegExpWellKnownSymbolLogic("match", function(MATCH, nativeMatch, maybeCallNative) {
      return [
        // `String.prototype.match` method
        // https://tc39.es/ecma262/#sec-string.prototype.match
        function match(regexp) {
          var O = requireObjectCoercible(this);
          var matcher = isObject(regexp) ? getMethod(regexp, MATCH) : void 0;
          return matcher ? call(matcher, regexp, O) : new RegExp(regexp)[MATCH](toString(O));
        },
        // `RegExp.prototype[@@match]` method
        // https://tc39.es/ecma262/#sec-regexp.prototype-@@match
        function(string) {
          var rx = anObject(this);
          var S = toString(string);
          var res = maybeCallNative(nativeMatch, rx, S);
          if (res.done) return res.value;
          var flags = toString(getRegExpFlags(rx));
          if (stringIndexOf(flags, "g") === -1) return regExpExec(rx, S);
          var fullUnicode = stringIndexOf(flags, "u") !== -1;
          rx.lastIndex = 0;
          var A = [];
          var n = 0;
          var result;
          while ((result = regExpExec(rx, S)) !== null) {
            var matchStr = toString(result[0]);
            A[n] = matchStr;
            if (matchStr === "") rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
            n++;
          }
          return n === 0 ? null : A;
        }
      ];
    });
  }
});

// node_modules/core-js/internals/get-substitution.js
var require_get_substitution = __commonJS({
  "node_modules/core-js/internals/get-substitution.js"(exports, module) {
    "use strict";
    var uncurryThis = require_function_uncurry_this();
    var toObject = require_to_object();
    var floor = Math.floor;
    var charAt = uncurryThis("".charAt);
    var replace = uncurryThis("".replace);
    var stringSlice = uncurryThis("".slice);
    var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
    var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d{1,2})/g;
    module.exports = function(matched, str, position, captures, namedCaptures, replacement) {
      var tailPos = position + matched.length;
      var m = captures.length;
      var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
      if (namedCaptures !== void 0) {
        namedCaptures = toObject(namedCaptures);
        symbols = SUBSTITUTION_SYMBOLS;
      }
      return replace(replacement, symbols, function(match, ch) {
        var capture;
        switch (charAt(ch, 0)) {
          case "$":
            return "$";
          case "&":
            return matched;
          case "`":
            return stringSlice(str, 0, position);
          case "'":
            return stringSlice(str, tailPos);
          case "<":
            capture = namedCaptures[stringSlice(ch, 1, -1)];
            break;
          default:
            var n = +ch;
            if (n === 0) return match;
            if (n > m) {
              var f = floor(n / 10);
              if (f === 0) return match;
              if (f <= m) return captures[f - 1] === void 0 ? charAt(ch, 1) : captures[f - 1] + charAt(ch, 1);
              return match;
            }
            capture = captures[n - 1];
        }
        return capture === void 0 ? "" : capture;
      });
    };
  }
});

// node_modules/core-js/modules/es.string.replace.js
var require_es_string_replace = __commonJS({
  "node_modules/core-js/modules/es.string.replace.js"() {
    "use strict";
    var apply = require_function_apply();
    var call = require_function_call();
    var uncurryThis = require_function_uncurry_this();
    var fixRegExpWellKnownSymbolLogic = require_fix_regexp_well_known_symbol_logic();
    var fails = require_fails();
    var anObject = require_an_object();
    var isCallable = require_is_callable();
    var isObject = require_is_object();
    var toIntegerOrInfinity = require_to_integer_or_infinity();
    var toLength = require_to_length();
    var toString = require_to_string();
    var requireObjectCoercible = require_require_object_coercible();
    var advanceStringIndex = require_advance_string_index();
    var getMethod = require_get_method();
    var getSubstitution = require_get_substitution();
    var getRegExpFlags = require_regexp_get_flags();
    var regExpExec = require_regexp_exec_abstract();
    var wellKnownSymbol = require_well_known_symbol();
    var REPLACE = wellKnownSymbol("replace");
    var max = Math.max;
    var min = Math.min;
    var concat = uncurryThis([].concat);
    var push = uncurryThis([].push);
    var stringIndexOf = uncurryThis("".indexOf);
    var stringSlice = uncurryThis("".slice);
    var maybeToString = function(it) {
      return it === void 0 ? it : String(it);
    };
    var REPLACE_KEEPS_$0 = function() {
      return "a".replace(/./, "$0") === "$0";
    }();
    var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = function() {
      if (/./[REPLACE]) {
        return /./[REPLACE]("a", "$0") === "";
      }
      return false;
    }();
    var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function() {
      var re = /./;
      re.exec = function() {
        var result = [];
        result.groups = {
          a: "7"
        };
        return result;
      };
      return "".replace(re, "$<a>") !== "7";
    });
    fixRegExpWellKnownSymbolLogic("replace", function(_, nativeReplace, maybeCallNative) {
      var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? "$" : "$0";
      return [
        // `String.prototype.replace` method
        // https://tc39.es/ecma262/#sec-string.prototype.replace
        function replace(searchValue, replaceValue) {
          var O = requireObjectCoercible(this);
          var replacer = isObject(searchValue) ? getMethod(searchValue, REPLACE) : void 0;
          return replacer ? call(replacer, searchValue, O, replaceValue) : call(nativeReplace, toString(O), searchValue, replaceValue);
        },
        // `RegExp.prototype[@@replace]` method
        // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
        function(string, replaceValue) {
          var rx = anObject(this);
          var S = toString(string);
          if (typeof replaceValue == "string" && stringIndexOf(replaceValue, UNSAFE_SUBSTITUTE) === -1 && stringIndexOf(replaceValue, "$<") === -1) {
            var res = maybeCallNative(nativeReplace, rx, S, replaceValue);
            if (res.done) return res.value;
          }
          var functionalReplace = isCallable(replaceValue);
          if (!functionalReplace) replaceValue = toString(replaceValue);
          var flags = toString(getRegExpFlags(rx));
          var global = stringIndexOf(flags, "g") !== -1;
          var fullUnicode;
          if (global) {
            fullUnicode = stringIndexOf(flags, "u") !== -1;
            rx.lastIndex = 0;
          }
          var results = [];
          var result;
          while (true) {
            result = regExpExec(rx, S);
            if (result === null) break;
            push(results, result);
            if (!global) break;
            var matchStr = toString(result[0]);
            if (matchStr === "") rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
          }
          var accumulatedResult = "";
          var nextSourcePosition = 0;
          for (var i = 0; i < results.length; i++) {
            result = results[i];
            var matched = toString(result[0]);
            var position = max(min(toIntegerOrInfinity(result.index), S.length), 0);
            var captures = [];
            var replacement;
            for (var j = 1; j < result.length; j++) push(captures, maybeToString(result[j]));
            var namedCaptures = result.groups;
            if (functionalReplace) {
              var replacerArgs = concat([matched], captures, position, S);
              if (namedCaptures !== void 0) push(replacerArgs, namedCaptures);
              replacement = toString(apply(replaceValue, void 0, replacerArgs));
            } else {
              replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
            }
            if (position >= nextSourcePosition) {
              accumulatedResult += stringSlice(S, nextSourcePosition, position) + replacement;
              nextSourcePosition = position + matched.length;
            }
          }
          return accumulatedResult + stringSlice(S, nextSourcePosition);
        }
      ];
    }, !REPLACE_SUPPORTS_NAMED_GROUPS || !REPLACE_KEEPS_$0 || REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE);
  }
});

// node_modules/core-js/modules/es.string.search.js
var require_es_string_search = __commonJS({
  "node_modules/core-js/modules/es.string.search.js"() {
    "use strict";
    var call = require_function_call();
    var fixRegExpWellKnownSymbolLogic = require_fix_regexp_well_known_symbol_logic();
    var anObject = require_an_object();
    var isObject = require_is_object();
    var requireObjectCoercible = require_require_object_coercible();
    var sameValue = require_same_value();
    var toString = require_to_string();
    var getMethod = require_get_method();
    var regExpExec = require_regexp_exec_abstract();
    fixRegExpWellKnownSymbolLogic("search", function(SEARCH, nativeSearch, maybeCallNative) {
      return [
        // `String.prototype.search` method
        // https://tc39.es/ecma262/#sec-string.prototype.search
        function search(regexp) {
          var O = requireObjectCoercible(this);
          var searcher = isObject(regexp) ? getMethod(regexp, SEARCH) : void 0;
          return searcher ? call(searcher, regexp, O) : new RegExp(regexp)[SEARCH](toString(O));
        },
        // `RegExp.prototype[@@search]` method
        // https://tc39.es/ecma262/#sec-regexp.prototype-@@search
        function(string) {
          var rx = anObject(this);
          var S = toString(string);
          var res = maybeCallNative(nativeSearch, rx, S);
          if (res.done) return res.value;
          var previousLastIndex = rx.lastIndex;
          if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
          var result = regExpExec(rx, S);
          if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
          return result === null ? -1 : result.index;
        }
      ];
    });
  }
});

// node_modules/core-js/modules/es.string.split.js
var require_es_string_split = __commonJS({
  "node_modules/core-js/modules/es.string.split.js"() {
    "use strict";
    var call = require_function_call();
    var uncurryThis = require_function_uncurry_this();
    var fixRegExpWellKnownSymbolLogic = require_fix_regexp_well_known_symbol_logic();
    var anObject = require_an_object();
    var isObject = require_is_object();
    var requireObjectCoercible = require_require_object_coercible();
    var speciesConstructor = require_species_constructor();
    var advanceStringIndex = require_advance_string_index();
    var toLength = require_to_length();
    var toString = require_to_string();
    var getMethod = require_get_method();
    var regExpExec = require_regexp_exec_abstract();
    var stickyHelpers = require_regexp_sticky_helpers();
    var fails = require_fails();
    var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y;
    var MAX_UINT32 = 4294967295;
    var min = Math.min;
    var push = uncurryThis([].push);
    var stringSlice = uncurryThis("".slice);
    var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function() {
      var re = /(?:)/;
      var originalExec = re.exec;
      re.exec = function() {
        return originalExec.apply(this, arguments);
      };
      var result = "ab".split(re);
      return result.length !== 2 || result[0] !== "a" || result[1] !== "b";
    });
    var BUGGY = "abbc".split(/(b)*/)[1] === "c" || // eslint-disable-next-line regexp/no-empty-group -- required for testing
    "test".split(/(?:)/, -1).length !== 4 || "ab".split(/(?:ab)*/).length !== 2 || ".".split(/(.?)(.?)/).length !== 4 || // eslint-disable-next-line regexp/no-empty-capturing-group, regexp/no-empty-group -- required for testing
    ".".split(/()()/).length > 1 || "".split(/.?/).length;
    fixRegExpWellKnownSymbolLogic("split", function(SPLIT, nativeSplit, maybeCallNative) {
      var internalSplit = "0".split(void 0, 0).length ? function(separator, limit) {
        return separator === void 0 && limit === 0 ? [] : call(nativeSplit, this, separator, limit);
      } : nativeSplit;
      return [
        // `String.prototype.split` method
        // https://tc39.es/ecma262/#sec-string.prototype.split
        function split(separator, limit) {
          var O = requireObjectCoercible(this);
          var splitter = isObject(separator) ? getMethod(separator, SPLIT) : void 0;
          return splitter ? call(splitter, separator, O, limit) : call(internalSplit, toString(O), separator, limit);
        },
        // `RegExp.prototype[@@split]` method
        // https://tc39.es/ecma262/#sec-regexp.prototype-@@split
        //
        // NOTE: This cannot be properly polyfilled in engines that don't support
        // the 'y' flag.
        function(string, limit) {
          var rx = anObject(this);
          var S = toString(string);
          if (!BUGGY) {
            var res = maybeCallNative(internalSplit, rx, S, limit, internalSplit !== nativeSplit);
            if (res.done) return res.value;
          }
          var C = speciesConstructor(rx, RegExp);
          var unicodeMatching = rx.unicode;
          var flags = (rx.ignoreCase ? "i" : "") + (rx.multiline ? "m" : "") + (rx.unicode ? "u" : "") + (UNSUPPORTED_Y ? "g" : "y");
          var splitter = new C(UNSUPPORTED_Y ? "^(?:" + rx.source + ")" : rx, flags);
          var lim = limit === void 0 ? MAX_UINT32 : limit >>> 0;
          if (lim === 0) return [];
          if (S.length === 0) return regExpExec(splitter, S) === null ? [S] : [];
          var p = 0;
          var q = 0;
          var A = [];
          while (q < S.length) {
            splitter.lastIndex = UNSUPPORTED_Y ? 0 : q;
            var z = regExpExec(splitter, UNSUPPORTED_Y ? stringSlice(S, q) : S);
            var e;
            if (z === null || (e = min(toLength(splitter.lastIndex + (UNSUPPORTED_Y ? q : 0)), S.length)) === p) {
              q = advanceStringIndex(S, q, unicodeMatching);
            } else {
              push(A, stringSlice(S, p, q));
              if (A.length === lim) return A;
              for (var i = 1; i <= z.length - 1; i++) {
                push(A, z[i]);
                if (A.length === lim) return A;
              }
              q = p = e;
            }
          }
          push(A, stringSlice(S, p));
          return A;
        }
      ];
    }, BUGGY || !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC, UNSUPPORTED_Y);
  }
});

// node_modules/core-js/internals/is-regexp.js
var require_is_regexp = __commonJS({
  "node_modules/core-js/internals/is-regexp.js"(exports, module) {
    "use strict";
    var isObject = require_is_object();
    var classof = require_classof_raw();
    var wellKnownSymbol = require_well_known_symbol();
    var MATCH = wellKnownSymbol("match");
    module.exports = function(it) {
      var isRegExp;
      return isObject(it) && ((isRegExp = it[MATCH]) !== void 0 ? !!isRegExp : classof(it) === "RegExp");
    };
  }
});

export {
  require_is_regexp,
  require_regexp_flags_detection,
  require_regexp_flags,
  require_regexp_get_flags,
  require_regexp_sticky_helpers,
  require_regexp_unsupported_dot_all,
  require_regexp_unsupported_ncg,
  require_es_regexp_exec,
  require_advance_string_index,
  require_regexp_exec_abstract,
  require_es_string_match,
  require_get_substitution,
  require_es_string_replace,
  require_es_string_search,
  require_es_string_split
};
//# sourceMappingURL=chunk-XWURD2BU.js.map
