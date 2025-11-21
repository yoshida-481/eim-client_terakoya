import {
  require_number_parse_float
} from "./chunk-VI3E2CLI.js";
import "./chunk-LKNLMXKK.js";
import "./chunk-677LGTPM.js";
import "./chunk-L2Q7U5JX.js";
import "./chunk-OW7VFTLO.js";
import {
  require_path
} from "./chunk-N7EDGOTA.js";
import {
  require_export
} from "./chunk-SYAKHIZ5.js";
import {
  __commonJS
} from "./chunk-F52B2RLG.js";

// node_modules/core-js/modules/es.parse-float.js
var require_es_parse_float = __commonJS({
  "node_modules/core-js/modules/es.parse-float.js"() {
    "use strict";
    var $ = require_export();
    var $parseFloat = require_number_parse_float();
    $({
      global: true,
      forced: parseFloat !== $parseFloat
    }, {
      parseFloat: $parseFloat
    });
  }
});

// node_modules/core-js/es/parse-float.js
var require_parse_float = __commonJS({
  "node_modules/core-js/es/parse-float.js"(exports, module) {
    require_es_parse_float();
    var path = require_path();
    module.exports = path.parseFloat;
  }
});
export default require_parse_float();
//# sourceMappingURL=core-js_es_parse-float.js.map
