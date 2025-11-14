import {
  require_environment_user_agent
} from "./chunk-SYAKHIZ5.js";
import {
  __commonJS
} from "./chunk-F52B2RLG.js";

// node_modules/core-js/internals/environment-webkit-version.js
var require_environment_webkit_version = __commonJS({
  "node_modules/core-js/internals/environment-webkit-version.js"(exports, module) {
    "use strict";
    var userAgent = require_environment_user_agent();
    var webkit = userAgent.match(/AppleWebKit\/(\d+)\./);
    module.exports = !!webkit && +webkit[1];
  }
});

export {
  require_environment_webkit_version
};
//# sourceMappingURL=chunk-DBDY7KDW.js.map
