import {
  operate
} from "./chunk-SN5L552R.js";

// node_modules/rxjs/dist/esm5/internal/operators/finalize.js
function finalize(callback) {
  return operate(function(source, subscriber) {
    try {
      source.subscribe(subscriber);
    } finally {
      subscriber.add(callback);
    }
  });
}

export {
  finalize
};
//# sourceMappingURL=chunk-RCUNUVBJ.js.map
