import {
  require_number_parse_int
} from "./chunk-DX545QX2.js";
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

// node_modules/core-js/modules/es.parse-int.js
var require_es_parse_int = __commonJS({
  "node_modules/core-js/modules/es.parse-int.js"() {
    "use strict";
    var $ = require_export();
    var $parseInt = require_number_parse_int();
    $({
      global: true,
      forced: parseInt !== $parseInt
    }, {
      parseInt: $parseInt
    });
  }
});

// node_modules/core-js/es/parse-int.js
var require_parse_int = __commonJS({
  "node_modules/core-js/es/parse-int.js"(exports, module) {
    require_es_parse_int();
    var path = require_path();
    module.exports = path.parseInt;
  }
});
export default require_parse_int();
//# sourceMappingURL=core-js_es_parse-int.js.map
