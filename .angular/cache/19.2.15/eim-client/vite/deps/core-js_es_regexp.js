import {
  require_es_regexp_exec,
  require_es_string_match,
  require_es_string_replace,
  require_es_string_search,
  require_es_string_split,
  require_is_regexp,
  require_regexp_flags,
  require_regexp_flags_detection,
  require_regexp_get_flags,
  require_regexp_sticky_helpers,
  require_regexp_unsupported_dot_all,
  require_regexp_unsupported_ncg
} from "./chunk-D6BY6HBJ.js";
import {
  require_string_pad
} from "./chunk-PMYWT43N.js";
import "./chunk-6UNXP5FG.js";
import "./chunk-IXACK6AY.js";
import {
  require_whitespaces
} from "./chunk-677LGTPM.js";
import "./chunk-EO4T7LOD.js";
import "./chunk-RWQHAGJX.js";
import "./chunk-MPAR7FPC.js";
import {
  require_inherit_if_required
} from "./chunk-2GGPBGA4.js";
import {
  require_set_species
} from "./chunk-WWTHI2BJ.js";
import {
  require_define_built_in_accessor
} from "./chunk-XIS6K74X.js";
import "./chunk-G7RHFS26.js";
import {
  require_object_create
} from "./chunk-5J3DNA3C.js";
import "./chunk-LJACIHUK.js";
import {
  require_to_string
} from "./chunk-L2Q7U5JX.js";
import "./chunk-OW7VFTLO.js";
import {
  require_an_object,
  require_classof_raw,
  require_create_non_enumerable_property,
  require_define_built_in,
  require_descriptors,
  require_export,
  require_fails,
  require_function_call,
  require_function_name,
  require_function_uncurry_this,
  require_global_this,
  require_has_own_property,
  require_internal_state,
  require_is_callable,
  require_is_forced,
  require_object_define_property,
  require_object_get_own_property_names,
  require_object_is_prototype_of,
  require_well_known_symbol
} from "./chunk-SYAKHIZ5.js";
import {
  __commonJS
} from "./chunk-F52B2RLG.js";

// node_modules/core-js/internals/proxy-accessor.js
var require_proxy_accessor = __commonJS({
  "node_modules/core-js/internals/proxy-accessor.js"(exports, module) {
    "use strict";
    var defineProperty = require_object_define_property().f;
    module.exports = function(Target, Source, key) {
      key in Target || defineProperty(Target, key, {
        configurable: true,
        get: function() {
          return Source[key];
        },
        set: function(it) {
          Source[key] = it;
        }
      });
    };
  }
});

// node_modules/core-js/modules/es.regexp.constructor.js
var require_es_regexp_constructor = __commonJS({
  "node_modules/core-js/modules/es.regexp.constructor.js"() {
    "use strict";
    var DESCRIPTORS = require_descriptors();
    var globalThis = require_global_this();
    var uncurryThis = require_function_uncurry_this();
    var isForced = require_is_forced();
    var inheritIfRequired = require_inherit_if_required();
    var createNonEnumerableProperty = require_create_non_enumerable_property();
    var create = require_object_create();
    var getOwnPropertyNames = require_object_get_own_property_names().f;
    var isPrototypeOf = require_object_is_prototype_of();
    var isRegExp = require_is_regexp();
    var toString = require_to_string();
    var getRegExpFlags = require_regexp_get_flags();
    var stickyHelpers = require_regexp_sticky_helpers();
    var proxyAccessor = require_proxy_accessor();
    var defineBuiltIn = require_define_built_in();
    var fails = require_fails();
    var hasOwn = require_has_own_property();
    var enforceInternalState = require_internal_state().enforce;
    var setSpecies = require_set_species();
    var wellKnownSymbol = require_well_known_symbol();
    var UNSUPPORTED_DOT_ALL = require_regexp_unsupported_dot_all();
    var UNSUPPORTED_NCG = require_regexp_unsupported_ncg();
    var MATCH = wellKnownSymbol("match");
    var NativeRegExp = globalThis.RegExp;
    var RegExpPrototype = NativeRegExp.prototype;
    var SyntaxError = globalThis.SyntaxError;
    var exec = uncurryThis(RegExpPrototype.exec);
    var charAt = uncurryThis("".charAt);
    var replace = uncurryThis("".replace);
    var stringIndexOf = uncurryThis("".indexOf);
    var stringSlice = uncurryThis("".slice);
    var IS_NCG = /^\?<[^\s\d!#%&*+<=>@^][^\s!#%&*+<=>@^]*>/;
    var re1 = /a/g;
    var re2 = /a/g;
    var CORRECT_NEW = new NativeRegExp(re1) !== re1;
    var MISSED_STICKY = stickyHelpers.MISSED_STICKY;
    var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y;
    var BASE_FORCED = DESCRIPTORS && (!CORRECT_NEW || MISSED_STICKY || UNSUPPORTED_DOT_ALL || UNSUPPORTED_NCG || fails(function() {
      re2[MATCH] = false;
      return NativeRegExp(re1) !== re1 || NativeRegExp(re2) === re2 || String(NativeRegExp(re1, "i")) !== "/a/i";
    }));
    var handleDotAll = function(string) {
      var length = string.length;
      var index2 = 0;
      var result = "";
      var brackets = false;
      var chr;
      for (; index2 <= length; index2++) {
        chr = charAt(string, index2);
        if (chr === "\\") {
          result += chr + charAt(string, ++index2);
          continue;
        }
        if (!brackets && chr === ".") {
          result += "[\\s\\S]";
        } else {
          if (chr === "[") {
            brackets = true;
          } else if (chr === "]") {
            brackets = false;
          }
          result += chr;
        }
      }
      return result;
    };
    var handleNCG = function(string) {
      var length = string.length;
      var index2 = 0;
      var result = "";
      var named = [];
      var names = create(null);
      var brackets = false;
      var ncg = false;
      var groupid = 0;
      var groupname = "";
      var chr;
      for (; index2 <= length; index2++) {
        chr = charAt(string, index2);
        if (chr === "\\") {
          chr += charAt(string, ++index2);
        } else if (chr === "]") {
          brackets = false;
        } else if (!brackets) switch (true) {
          case chr === "[":
            brackets = true;
            break;
          case chr === "(":
            result += chr;
            if (stringSlice(string, index2 + 1, index2 + 3) === "?:") {
              continue;
            }
            if (exec(IS_NCG, stringSlice(string, index2 + 1))) {
              index2 += 2;
              ncg = true;
            }
            groupid++;
            continue;
          case (chr === ">" && ncg):
            if (groupname === "" || hasOwn(names, groupname)) {
              throw new SyntaxError("Invalid capture group name");
            }
            names[groupname] = true;
            named[named.length] = [groupname, groupid];
            ncg = false;
            groupname = "";
            continue;
        }
        if (ncg) groupname += chr;
        else result += chr;
      }
      return [result, named];
    };
    if (isForced("RegExp", BASE_FORCED)) {
      RegExpWrapper = function RegExp2(pattern, flags) {
        var thisIsRegExp = isPrototypeOf(RegExpPrototype, this);
        var patternIsRegExp = isRegExp(pattern);
        var flagsAreUndefined = flags === void 0;
        var groups = [];
        var rawPattern = pattern;
        var rawFlags, dotAll, sticky, handled, result, state;
        if (!thisIsRegExp && patternIsRegExp && flagsAreUndefined && pattern.constructor === RegExpWrapper) {
          return pattern;
        }
        if (patternIsRegExp || isPrototypeOf(RegExpPrototype, pattern)) {
          pattern = pattern.source;
          if (flagsAreUndefined) flags = getRegExpFlags(rawPattern);
        }
        pattern = pattern === void 0 ? "" : toString(pattern);
        flags = flags === void 0 ? "" : toString(flags);
        rawPattern = pattern;
        if (UNSUPPORTED_DOT_ALL && "dotAll" in re1) {
          dotAll = !!flags && stringIndexOf(flags, "s") > -1;
          if (dotAll) flags = replace(flags, /s/g, "");
        }
        rawFlags = flags;
        if (MISSED_STICKY && "sticky" in re1) {
          sticky = !!flags && stringIndexOf(flags, "y") > -1;
          if (sticky && UNSUPPORTED_Y) flags = replace(flags, /y/g, "");
        }
        if (UNSUPPORTED_NCG) {
          handled = handleNCG(pattern);
          pattern = handled[0];
          groups = handled[1];
        }
        result = inheritIfRequired(NativeRegExp(pattern, flags), thisIsRegExp ? this : RegExpPrototype, RegExpWrapper);
        if (dotAll || sticky || groups.length) {
          state = enforceInternalState(result);
          if (dotAll) {
            state.dotAll = true;
            state.raw = RegExpWrapper(handleDotAll(pattern), rawFlags);
          }
          if (sticky) state.sticky = true;
          if (groups.length) state.groups = groups;
        }
        if (pattern !== rawPattern) try {
          createNonEnumerableProperty(result, "source", rawPattern === "" ? "(?:)" : rawPattern);
        } catch (error) {
        }
        return result;
      };
      for (keys = getOwnPropertyNames(NativeRegExp), index = 0; keys.length > index; ) {
        proxyAccessor(RegExpWrapper, NativeRegExp, keys[index++]);
      }
      RegExpPrototype.constructor = RegExpWrapper;
      RegExpWrapper.prototype = RegExpPrototype;
      defineBuiltIn(globalThis, "RegExp", RegExpWrapper, {
        constructor: true
      });
    }
    var RegExpWrapper;
    var keys;
    var index;
    setSpecies("RegExp");
  }
});

// node_modules/core-js/internals/a-string.js
var require_a_string = __commonJS({
  "node_modules/core-js/internals/a-string.js"(exports, module) {
    "use strict";
    var $TypeError = TypeError;
    module.exports = function(argument) {
      if (typeof argument == "string") return argument;
      throw new $TypeError("Argument is not a string");
    };
  }
});

// node_modules/core-js/modules/es.regexp.escape.js
var require_es_regexp_escape = __commonJS({
  "node_modules/core-js/modules/es.regexp.escape.js"() {
    "use strict";
    var $ = require_export();
    var uncurryThis = require_function_uncurry_this();
    var aString = require_a_string();
    var hasOwn = require_has_own_property();
    var padStart = require_string_pad().start;
    var WHITESPACES = require_whitespaces();
    var $Array = Array;
    var $escape = RegExp.escape;
    var charAt = uncurryThis("".charAt);
    var charCodeAt = uncurryThis("".charCodeAt);
    var numberToString = uncurryThis(1.1.toString);
    var join = uncurryThis([].join);
    var FIRST_DIGIT_OR_ASCII = /^[0-9a-z]/i;
    var SYNTAX_SOLIDUS = /^[$()*+./?[\\\]^{|}]/;
    var OTHER_PUNCTUATORS_AND_WHITESPACES = RegExp("^[!\"#%&',\\-:;<=>@`~" + WHITESPACES + "]");
    var exec = uncurryThis(FIRST_DIGIT_OR_ASCII.exec);
    var ControlEscape = {
      "	": "t",
      "\n": "n",
      "\v": "v",
      "\f": "f",
      "\r": "r"
    };
    var escapeChar = function(chr) {
      var hex = numberToString(charCodeAt(chr, 0), 16);
      return hex.length < 3 ? "\\x" + padStart(hex, 2, "0") : "\\u" + padStart(hex, 4, "0");
    };
    var FORCED = !$escape || $escape("ab") !== "\\x61b";
    $({
      target: "RegExp",
      stat: true,
      forced: FORCED
    }, {
      escape: function escape(S) {
        aString(S);
        var length = S.length;
        var result = $Array(length);
        for (var i = 0; i < length; i++) {
          var chr = charAt(S, i);
          if (i === 0 && exec(FIRST_DIGIT_OR_ASCII, chr)) {
            result[i] = escapeChar(chr);
          } else if (hasOwn(ControlEscape, chr)) {
            result[i] = "\\" + ControlEscape[chr];
          } else if (exec(SYNTAX_SOLIDUS, chr)) {
            result[i] = "\\" + chr;
          } else if (exec(OTHER_PUNCTUATORS_AND_WHITESPACES, chr)) {
            result[i] = escapeChar(chr);
          } else {
            var charCode = charCodeAt(chr, 0);
            if ((charCode & 63488) !== 55296) result[i] = chr;
            else if (charCode >= 56320 || i + 1 >= length || (charCodeAt(S, i + 1) & 64512) !== 56320) result[i] = escapeChar(chr);
            else {
              result[i] = chr;
              result[++i] = charAt(S, i);
            }
          }
        }
        return join(result, "");
      }
    });
  }
});

// node_modules/core-js/modules/es.regexp.to-string.js
var require_es_regexp_to_string = __commonJS({
  "node_modules/core-js/modules/es.regexp.to-string.js"() {
    "use strict";
    var PROPER_FUNCTION_NAME = require_function_name().PROPER;
    var defineBuiltIn = require_define_built_in();
    var anObject = require_an_object();
    var $toString = require_to_string();
    var fails = require_fails();
    var getRegExpFlags = require_regexp_get_flags();
    var TO_STRING = "toString";
    var RegExpPrototype = RegExp.prototype;
    var nativeToString = RegExpPrototype[TO_STRING];
    var NOT_GENERIC = fails(function() {
      return nativeToString.call({
        source: "a",
        flags: "b"
      }) !== "/a/b";
    });
    var INCORRECT_NAME = PROPER_FUNCTION_NAME && nativeToString.name !== TO_STRING;
    if (NOT_GENERIC || INCORRECT_NAME) {
      defineBuiltIn(RegExpPrototype, TO_STRING, function toString() {
        var R = anObject(this);
        var pattern = $toString(R.source);
        var flags = $toString(getRegExpFlags(R));
        return "/" + pattern + "/" + flags;
      }, {
        unsafe: true
      });
    }
  }
});

// node_modules/core-js/modules/es.regexp.dot-all.js
var require_es_regexp_dot_all = __commonJS({
  "node_modules/core-js/modules/es.regexp.dot-all.js"() {
    "use strict";
    var DESCRIPTORS = require_descriptors();
    var UNSUPPORTED_DOT_ALL = require_regexp_unsupported_dot_all();
    var classof = require_classof_raw();
    var defineBuiltInAccessor = require_define_built_in_accessor();
    var getInternalState = require_internal_state().get;
    var RegExpPrototype = RegExp.prototype;
    var $TypeError = TypeError;
    if (DESCRIPTORS && UNSUPPORTED_DOT_ALL) {
      defineBuiltInAccessor(RegExpPrototype, "dotAll", {
        configurable: true,
        get: function dotAll() {
          if (this === RegExpPrototype) return;
          if (classof(this) === "RegExp") {
            return !!getInternalState(this).dotAll;
          }
          throw new $TypeError("Incompatible receiver, RegExp required");
        }
      });
    }
  }
});

// node_modules/core-js/modules/es.regexp.flags.js
var require_es_regexp_flags = __commonJS({
  "node_modules/core-js/modules/es.regexp.flags.js"() {
    "use strict";
    var DESCRIPTORS = require_descriptors();
    var defineBuiltInAccessor = require_define_built_in_accessor();
    var regExpFlagsDetection = require_regexp_flags_detection();
    var regExpFlagsGetterImplementation = require_regexp_flags();
    if (DESCRIPTORS && !regExpFlagsDetection.correct) {
      defineBuiltInAccessor(RegExp.prototype, "flags", {
        configurable: true,
        get: regExpFlagsGetterImplementation
      });
      regExpFlagsDetection.correct = true;
    }
  }
});

// node_modules/core-js/modules/es.regexp.sticky.js
var require_es_regexp_sticky = __commonJS({
  "node_modules/core-js/modules/es.regexp.sticky.js"() {
    "use strict";
    var DESCRIPTORS = require_descriptors();
    var MISSED_STICKY = require_regexp_sticky_helpers().MISSED_STICKY;
    var classof = require_classof_raw();
    var defineBuiltInAccessor = require_define_built_in_accessor();
    var getInternalState = require_internal_state().get;
    var RegExpPrototype = RegExp.prototype;
    var $TypeError = TypeError;
    if (DESCRIPTORS && MISSED_STICKY) {
      defineBuiltInAccessor(RegExpPrototype, "sticky", {
        configurable: true,
        get: function sticky() {
          if (this === RegExpPrototype) return;
          if (classof(this) === "RegExp") {
            return !!getInternalState(this).sticky;
          }
          throw new $TypeError("Incompatible receiver, RegExp required");
        }
      });
    }
  }
});

// node_modules/core-js/modules/es.regexp.test.js
var require_es_regexp_test = __commonJS({
  "node_modules/core-js/modules/es.regexp.test.js"() {
    "use strict";
    require_es_regexp_exec();
    var $ = require_export();
    var call = require_function_call();
    var isCallable = require_is_callable();
    var anObject = require_an_object();
    var toString = require_to_string();
    var DELEGATES_TO_EXEC = function() {
      var execCalled = false;
      var re = /[ac]/;
      re.exec = function() {
        execCalled = true;
        return /./.exec.apply(this, arguments);
      };
      return re.test("abc") === true && execCalled;
    }();
    var nativeTest = /./.test;
    $({
      target: "RegExp",
      proto: true,
      forced: !DELEGATES_TO_EXEC
    }, {
      test: function(S) {
        var R = anObject(this);
        var string = toString(S);
        var exec = R.exec;
        if (!isCallable(exec)) return call(nativeTest, R, string);
        var result = call(exec, R, string);
        if (result === null) return false;
        anObject(result);
        return true;
      }
    });
  }
});

// node_modules/core-js/es/regexp/index.js
require_es_regexp_constructor();
require_es_regexp_escape();
require_es_regexp_to_string();
require_es_regexp_dot_all();
require_es_regexp_exec();
require_es_regexp_flags();
require_es_regexp_sticky();
require_es_regexp_test();
require_es_string_match();
require_es_string_replace();
require_es_string_search();
require_es_string_split();
//# sourceMappingURL=core-js_es_regexp.js.map
