import {
  NgStyle,
  NgTemplateOutlet
} from "./chunk-HTO3GHGJ.js";
import {
  DOCUMENT
} from "./chunk-BP7JFP24.js";
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Directive,
  ElementRef,
  HostBinding,
  InjectionToken,
  Injector,
  NgModule,
  NgZone,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
  assertInInjectionContext,
  booleanAttribute,
  computed,
  contentChild,
  contentChildren,
  effect,
  inject,
  input,
  isDevMode,
  numberAttribute,
  output,
  setClassMetadata,
  signal,
  untracked,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵcontentQuerySignal,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵhostProperty,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵpureFunction6,
  ɵɵqueryAdvance,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtemplate
} from "./chunk-I4OGGNFD.js";
import "./chunk-J4BNNGYM.js";
import {
  fromEvent,
  merge
} from "./chunk-DTASOMIO.js";
import {
  Subject,
  delay,
  filter,
  of,
  pairwise,
  repeat,
  scan,
  skipWhile,
  startWith,
  switchMap,
  take,
  takeUntil,
  tap,
  timeInterval
} from "./chunk-GEW5N7QM.js";
import {
  Observable,
  mergeMap
} from "./chunk-EYTNAWIT.js";
import {
  map
} from "./chunk-ITQX4XGD.js";
import "./chunk-RCUNUVBJ.js";
import "./chunk-SN5L552R.js";
import {
  __spreadValues
} from "./chunk-F52B2RLG.js";

// node_modules/@angular/core/fesm2022/rxjs-interop.mjs
function takeUntilDestroyed(destroyRef) {
  if (!destroyRef) {
    assertInInjectionContext(takeUntilDestroyed);
    destroyRef = inject(DestroyRef);
  }
  const destroyed$ = new Observable((observer) => {
    const unregisterFn = destroyRef.onDestroy(observer.next.bind(observer));
    return unregisterFn;
  });
  return (source) => {
    return source.pipe(takeUntil(destroyed$));
  };
}

// node_modules/angular-split/fesm2022/angular-split.mjs
var _c0 = ["*"];
var _c1 = (a0, a1, a2, a3, a4, a5) => ({
  areaBefore: a0,
  areaAfter: a1,
  gutterNum: a2,
  first: a3,
  last: a4,
  isDragged: a5
});
function SplitComponent_For_2_Conditional_0_Conditional_2_ng_container_0_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function SplitComponent_For_2_Conditional_0_Conditional_2_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtemplate(1, SplitComponent_For_2_Conditional_0_Conditional_2_ng_container_0_ng_container_1_Template, 1, 0, "ng-container", 5);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const injector_r5 = ctx.$implicit;
    const ctx_r5 = ɵɵnextContext(3);
    const area_r7 = ctx_r5.$implicit;
    const $index_r2 = ctx_r5.$index;
    const ɵ$index_2_r8 = ctx_r5.$index;
    const ctx_r2 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", ctx_r2.customGutter().template)("ngTemplateOutletContext", ɵɵpureFunction6(3, _c1, area_r7, ctx_r2._areas()[$index_r2 + 1], $index_r2 + 1, ɵ$index_2_r8 === 0, $index_r2 === ctx_r2._areas().length - 2, ctx_r2.draggedGutterIndex() === $index_r2))("ngTemplateOutletInjector", injector_r5);
  }
}
function SplitComponent_For_2_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, SplitComponent_For_2_Conditional_0_Conditional_2_ng_container_0_Template, 2, 10, "ng-container", 4);
  }
  if (rf & 2) {
    const $index_r2 = ɵɵnextContext(2).$index;
    ɵɵproperty("asSplitGutterDynamicInjector", $index_r2 + 1);
  }
}
function SplitComponent_For_2_Conditional_0_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "div", 3);
  }
}
function SplitComponent_For_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "div", 2, 0);
    ɵɵlistener("asSplitCustomClick", function SplitComponent_For_2_Conditional_0_Template_div_asSplitCustomClick_0_listener() {
      ɵɵrestoreView(_r1);
      const $index_r2 = ɵɵnextContext().$index;
      const ctx_r2 = ɵɵnextContext();
      return ɵɵresetView(ctx_r2.gutterClicked($index_r2));
    })("asSplitCustomDblClick", function SplitComponent_For_2_Conditional_0_Template_div_asSplitCustomDblClick_0_listener() {
      ɵɵrestoreView(_r1);
      const $index_r2 = ɵɵnextContext().$index;
      const ctx_r2 = ɵɵnextContext();
      return ɵɵresetView(ctx_r2.gutterDoubleClicked($index_r2));
    })("asSplitCustomMouseDown", function SplitComponent_For_2_Conditional_0_Template_div_asSplitCustomMouseDown_0_listener($event) {
      ɵɵrestoreView(_r1);
      const gutter_r4 = ɵɵreference(1);
      const $index_r2 = ɵɵnextContext().$index;
      const ctx_r2 = ɵɵnextContext();
      return ɵɵresetView(ctx_r2.gutterMouseDown($event, gutter_r4, $index_r2, $index_r2, $index_r2 + 1));
    })("asSplitCustomKeyDown", function SplitComponent_For_2_Conditional_0_Template_div_asSplitCustomKeyDown_0_listener($event) {
      ɵɵrestoreView(_r1);
      const $index_r2 = ɵɵnextContext().$index;
      const ctx_r2 = ɵɵnextContext();
      return ɵɵresetView(ctx_r2.gutterKeyDown($event, $index_r2, $index_r2, $index_r2 + 1));
    });
    ɵɵtemplate(2, SplitComponent_For_2_Conditional_0_Conditional_2_Template, 1, 1, "ng-container")(3, SplitComponent_For_2_Conditional_0_Conditional_3_Template, 1, 0, "div", 3);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    let tmp_22_0;
    const ctx_r5 = ɵɵnextContext();
    const area_r7 = ctx_r5.$implicit;
    const $index_r2 = ctx_r5.$index;
    const ctx_r2 = ɵɵnextContext();
    ɵɵclassProp("as-dragged", ctx_r2.draggedGutterIndex() === $index_r2);
    ɵɵproperty("ngStyle", ctx_r2.getGutterGridStyle($index_r2 + 1))("asSplitCustomMultiClickThreshold", ctx_r2.gutterDblClickDuration())("asSplitCustomClickDeltaInPx", ctx_r2.gutterClickDeltaPx());
    ɵɵattribute("aria-label", ctx_r2.gutterAriaLabel())("aria-orientation", ctx_r2.direction())("aria-valuemin", ctx_r2.getAriaValue(area_r7.minSize()))("aria-valuemax", ctx_r2.getAriaValue(area_r7.maxSize()))("aria-valuenow", ctx_r2.getAriaValue(area_r7._internalSize()))("aria-valuetext", ctx_r2.getAriaAreaSizeText(area_r7));
    ɵɵadvance(2);
    ɵɵconditional(((tmp_22_0 = ctx_r2.customGutter()) == null ? null : tmp_22_0.template) ? 2 : 3);
  }
}
function SplitComponent_For_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, SplitComponent_For_2_Conditional_0_Template, 4, 12, "div", 1);
  }
  if (rf & 2) {
    const ɵ$index_2_r8 = ctx.$index;
    const ɵ$count_2_r9 = ctx.$count;
    ɵɵconditional(!(ɵ$index_2_r8 === ɵ$count_2_r9 - 1) ? 0 : -1);
  }
}
function SplitAreaComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "div", 0);
  }
}
var defaultOptions = {
  dir: "ltr",
  direction: "horizontal",
  disabled: false,
  gutterDblClickDuration: 0,
  gutterSize: 11,
  gutterStep: 1,
  gutterClickDeltaPx: 2,
  restrictMove: false,
  unit: "percent",
  useTransition: false
};
var ANGULAR_SPLIT_DEFAULT_OPTIONS = new InjectionToken("angular-split-global-config", {
  providedIn: "root",
  factory: () => defaultOptions
});
function provideAngularSplitOptions(options) {
  return {
    provide: ANGULAR_SPLIT_DEFAULT_OPTIONS,
    useFactory: () => __spreadValues(__spreadValues({}, inject(ANGULAR_SPLIT_DEFAULT_OPTIONS, {
      skipSelf: true
    })), options)
  };
}
var SplitGutterDirective = class _SplitGutterDirective {
  constructor() {
    this.template = inject(TemplateRef);
    this._gutterToHandleElementMap = /* @__PURE__ */ new Map();
    this._gutterToExcludeDragElementMap = /* @__PURE__ */ new Map();
  }
  /**
   * @internal
   */
  _canStartDragging(originElement, gutterNum) {
    if (this._gutterToExcludeDragElementMap.has(gutterNum)) {
      const isInsideExclude = this._gutterToExcludeDragElementMap.get(gutterNum).some((gutterExcludeElement) => gutterExcludeElement.nativeElement.contains(originElement));
      if (isInsideExclude) {
        return false;
      }
    }
    if (this._gutterToHandleElementMap.has(gutterNum)) {
      return this._gutterToHandleElementMap.get(gutterNum).some((gutterHandleElement) => gutterHandleElement.nativeElement.contains(originElement));
    }
    return true;
  }
  /**
   * @internal
   */
  _addToMap(map2, gutterNum, elementRef) {
    if (map2.has(gutterNum)) {
      map2.get(gutterNum).push(elementRef);
    } else {
      map2.set(gutterNum, [elementRef]);
    }
  }
  /**
   * @internal
   */
  _removedFromMap(map2, gutterNum, elementRef) {
    const elements = map2.get(gutterNum);
    elements.splice(elements.indexOf(elementRef), 1);
    if (elements.length === 0) {
      map2.delete(gutterNum);
    }
  }
  static ngTemplateContextGuard(_dir, ctx) {
    return true;
  }
  static {
    this.ɵfac = function SplitGutterDirective_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _SplitGutterDirective)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _SplitGutterDirective,
      selectors: [["", "asSplitGutter", ""]]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SplitGutterDirective, [{
    type: Directive,
    args: [{
      selector: "[asSplitGutter]",
      standalone: true
    }]
  }], null, null);
})();
var GUTTER_NUM_TOKEN = new InjectionToken("Gutter num");
var SplitGutterDragHandleDirective = class _SplitGutterDragHandleDirective {
  constructor() {
    this.gutterNum = inject(GUTTER_NUM_TOKEN);
    this.elementRef = inject(ElementRef);
    this.gutterDir = inject(SplitGutterDirective);
    this.gutterDir._addToMap(this.gutterDir._gutterToHandleElementMap, this.gutterNum, this.elementRef);
  }
  ngOnDestroy() {
    this.gutterDir._removedFromMap(this.gutterDir._gutterToHandleElementMap, this.gutterNum, this.elementRef);
  }
  static {
    this.ɵfac = function SplitGutterDragHandleDirective_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _SplitGutterDragHandleDirective)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _SplitGutterDragHandleDirective,
      selectors: [["", "asSplitGutterDragHandle", ""]]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SplitGutterDragHandleDirective, [{
    type: Directive,
    args: [{
      selector: "[asSplitGutterDragHandle]",
      standalone: true
    }]
  }], () => [], null);
})();
var SplitGutterExcludeFromDragDirective = class _SplitGutterExcludeFromDragDirective {
  constructor() {
    this.gutterNum = inject(GUTTER_NUM_TOKEN);
    this.elementRef = inject(ElementRef);
    this.gutterDir = inject(SplitGutterDirective);
    this.gutterDir._addToMap(this.gutterDir._gutterToExcludeDragElementMap, this.gutterNum, this.elementRef);
  }
  ngOnDestroy() {
    this.gutterDir._removedFromMap(this.gutterDir._gutterToExcludeDragElementMap, this.gutterNum, this.elementRef);
  }
  static {
    this.ɵfac = function SplitGutterExcludeFromDragDirective_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _SplitGutterExcludeFromDragDirective)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _SplitGutterExcludeFromDragDirective,
      selectors: [["", "asSplitGutterExcludeFromDrag", ""]]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SplitGutterExcludeFromDragDirective, [{
    type: Directive,
    args: [{
      selector: "[asSplitGutterExcludeFromDrag]",
      standalone: true
    }]
  }], () => [], null);
})();
function getPointFromEvent(event) {
  const isTouchEvent = (e) => window.TouchEvent && event instanceof TouchEvent;
  if (isTouchEvent(event)) {
    if (event.changedTouches.length === 0) {
      return void 0;
    }
    const {
      clientX,
      clientY
    } = event.changedTouches[0];
    return {
      x: clientX,
      y: clientY
    };
  }
  if (event instanceof KeyboardEvent) {
    const target = event.target;
    return {
      x: target.offsetLeft + target.offsetWidth / 2,
      y: target.offsetTop + target.offsetHeight / 2
    };
  }
  return {
    x: event.clientX,
    y: event.clientY
  };
}
function gutterEventsEqualWithDelta(startEvent, endEvent, deltaInPx, gutterElement) {
  if (!gutterElement.contains(startEvent.target) || !gutterElement.contains(endEvent.target)) {
    return false;
  }
  const startPoint = getPointFromEvent(startEvent);
  const endPoint = getPointFromEvent(endEvent);
  return Math.abs(endPoint.x - startPoint.x) <= deltaInPx && Math.abs(endPoint.y - startPoint.y) <= deltaInPx;
}
function fromMouseDownEvent(target) {
  return merge(
    fromEvent(target, "mousedown").pipe(filter((e) => e.button === 0)),
    // We must prevent default here so we declare it as non passive explicitly
    fromEvent(target, "touchstart", {
      passive: false
    })
  );
}
function fromMouseMoveEvent(target) {
  return merge(fromEvent(target, "mousemove"), fromEvent(target, "touchmove"));
}
function fromMouseUpEvent(target, includeTouchCancel = false) {
  const withoutTouchCancel = merge(fromEvent(target, "mouseup"), fromEvent(target, "touchend"));
  return includeTouchCancel ? merge(withoutTouchCancel, fromEvent(target, "touchcancel")) : withoutTouchCancel;
}
function sum(array, fn) {
  return array.reduce((sum2, item) => sum2 + fn(item), 0);
}
function toRecord(array, fn) {
  return array.reduce((record, item, index) => {
    const [key, value] = fn(item, index);
    record[key] = value;
    return record;
  }, {});
}
function createClassesString(classesRecord) {
  return Object.entries(classesRecord).filter(([, value]) => value).map(([key]) => key).join(" ");
}
function mirrorSignal(outer) {
  const inner = computed(() => signal(outer()));
  const mirror = () => inner()();
  mirror.set = (value) => untracked(inner).set(value);
  mirror.reset = () => untracked(() => inner().set(outer()));
  return mirror;
}
function leaveNgZone() {
  return (source) => new Observable((observer) => inject(NgZone).runOutsideAngular(() => source.subscribe(observer)));
}
var numberAttributeWithFallback = (fallback) => (value) => numberAttribute(value, fallback);
var assertUnreachable = (value, name) => {
  throw new Error(`as-split: unknown value "${value}" for "${name}"`);
};
var SplitCustomEventsBehaviorDirective = class _SplitCustomEventsBehaviorDirective {
  constructor() {
    this.elementRef = inject(ElementRef);
    this.document = inject(DOCUMENT);
    this.multiClickThreshold = input.required({
      alias: "asSplitCustomMultiClickThreshold"
    });
    this.deltaInPx = input.required({
      alias: "asSplitCustomClickDeltaInPx"
    });
    this.mouseDown = output({
      alias: "asSplitCustomMouseDown"
    });
    this.click = output({
      alias: "asSplitCustomClick"
    });
    this.dblClick = output({
      alias: "asSplitCustomDblClick"
    });
    this.keyDown = output({
      alias: "asSplitCustomKeyDown"
    });
    fromEvent(this.elementRef.nativeElement, "keydown").pipe(leaveNgZone(), takeUntilDestroyed()).subscribe((e) => this.keyDown.emit(e));
    const dragStarted$ = fromMouseDownEvent(this.elementRef.nativeElement).pipe(switchMap((mouseDownEvent) => fromMouseMoveEvent(this.document).pipe(filter((e) => !gutterEventsEqualWithDelta(mouseDownEvent, e, this.deltaInPx(), this.elementRef.nativeElement)), take(1), map(() => true), takeUntil(fromMouseUpEvent(this.document)))));
    fromMouseDownEvent(this.elementRef.nativeElement).pipe(
      tap((e) => this.mouseDown.emit(e)),
      // Gather mousedown events intervals to identify whether it is a single double or more click
      timeInterval(),
      // We only count a click as part of a multi click if the multiClickThreshold wasn't reached
      scan((sum2, {
        interval
      }) => interval >= this.multiClickThreshold() ? 1 : sum2 + 1, 0),
      // As mouseup always comes after mousedown if the delayed mouseup has yet to come
      // but a new mousedown arrived we can discard the older mouseup as we are part of a multi click
      switchMap((numOfConsecutiveClicks) => (
        // In case of a double click we directly emit as we don't care about more than two consecutive clicks
        // so we don't have to wait compared to a single click that might be followed by another for a double.
        // In case of a mouse up that was too long after the mouse down
        // we don't have to wait as we know it won't be a multi click but a single click
        fromMouseUpEvent(this.elementRef.nativeElement).pipe(timeInterval(), take(1), numOfConsecutiveClicks === 2 ? map(() => numOfConsecutiveClicks) : mergeMap(({
          interval
        }) => interval >= this.multiClickThreshold() ? of(numOfConsecutiveClicks) : of(numOfConsecutiveClicks).pipe(delay(this.multiClickThreshold() - interval))))
      )),
      // Discard everything once drag started and listen again (repeat) to mouse down
      takeUntil(dragStarted$),
      repeat(),
      leaveNgZone(),
      takeUntilDestroyed()
    ).subscribe((amount) => {
      if (amount === 1) {
        this.click.emit();
      } else if (amount === 2) {
        this.dblClick.emit();
      }
    });
  }
  static {
    this.ɵfac = function SplitCustomEventsBehaviorDirective_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _SplitCustomEventsBehaviorDirective)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _SplitCustomEventsBehaviorDirective,
      selectors: [["", "asSplitCustomEventsBehavior", ""]],
      inputs: {
        multiClickThreshold: [1, "asSplitCustomMultiClickThreshold", "multiClickThreshold"],
        deltaInPx: [1, "asSplitCustomClickDeltaInPx", "deltaInPx"]
      },
      outputs: {
        mouseDown: "asSplitCustomMouseDown",
        click: "asSplitCustomClick",
        dblClick: "asSplitCustomDblClick",
        keyDown: "asSplitCustomKeyDown"
      }
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SplitCustomEventsBehaviorDirective, [{
    type: Directive,
    args: [{
      selector: "[asSplitCustomEventsBehavior]",
      standalone: true
    }]
  }], () => [], null);
})();
function areAreasValid(areas, unit, logWarnings) {
  if (areas.length === 0) {
    return true;
  }
  const areaSizes = areas.map((area) => {
    const size = area.size();
    return size === "auto" ? "*" : size;
  });
  const wildcardAreas = areaSizes.filter((areaSize) => areaSize === "*");
  if (wildcardAreas.length > 1) {
    if (logWarnings) {
      console.warn("as-split: Maximum one * area is allowed");
    }
    return false;
  }
  if (unit === "pixel") {
    if (wildcardAreas.length === 1) {
      return true;
    }
    if (logWarnings) {
      console.warn("as-split: Pixel mode must have exactly one * area");
    }
    return false;
  }
  const sumPercent = sum(areaSizes, (areaSize) => areaSize === "*" ? 0 : areaSize);
  if (wildcardAreas.length === 1) {
    if (sumPercent <= 100.1) {
      return true;
    }
    if (logWarnings) {
      console.warn(`as-split: Percent areas must total 100%`);
    }
    return false;
  }
  if (sumPercent < 99.9 || sumPercent > 100.1) {
    if (logWarnings) {
      console.warn("as-split: Percent areas must total 100%");
    }
    return false;
  }
  return true;
}
var SplitGutterDynamicInjectorDirective = class _SplitGutterDynamicInjectorDirective {
  constructor() {
    this.vcr = inject(ViewContainerRef);
    this.templateRef = inject(TemplateRef);
    this.gutterNum = input.required({
      alias: "asSplitGutterDynamicInjector"
    });
    effect(() => {
      this.vcr.clear();
      const injector = Injector.create({
        providers: [{
          provide: GUTTER_NUM_TOKEN,
          useValue: this.gutterNum()
        }],
        parent: this.vcr.injector
      });
      this.vcr.createEmbeddedView(this.templateRef, {
        $implicit: injector
      });
    });
  }
  static ngTemplateContextGuard(_dir, ctx) {
    return true;
  }
  static {
    this.ɵfac = function SplitGutterDynamicInjectorDirective_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _SplitGutterDynamicInjectorDirective)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _SplitGutterDynamicInjectorDirective,
      selectors: [["", "asSplitGutterDynamicInjector", ""]],
      inputs: {
        gutterNum: [1, "asSplitGutterDynamicInjector", "gutterNum"]
      }
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SplitGutterDynamicInjectorDirective, [{
    type: Directive,
    args: [{
      selector: "[asSplitGutterDynamicInjector]",
      standalone: true
    }]
  }], () => [], null);
})();
var SPLIT_AREA_CONTRACT = new InjectionToken("Split Area Contract");
var SplitComponent = class _SplitComponent {
  get hostClassesBinding() {
    return this.hostClasses();
  }
  get hostDirBinding() {
    return this.dir();
  }
  constructor() {
    this.document = inject(DOCUMENT);
    this.renderer = inject(Renderer2);
    this.elementRef = inject(ElementRef);
    this.ngZone = inject(NgZone);
    this.defaultOptions = inject(ANGULAR_SPLIT_DEFAULT_OPTIONS);
    this.gutterMouseDownSubject = new Subject();
    this.dragProgressSubject = new Subject();
    this._areas = contentChildren(SPLIT_AREA_CONTRACT);
    this.customGutter = contentChild(SplitGutterDirective);
    this.gutterSize = input(this.defaultOptions.gutterSize, {
      transform: numberAttributeWithFallback(this.defaultOptions.gutterSize)
    });
    this.gutterStep = input(this.defaultOptions.gutterStep, {
      transform: numberAttributeWithFallback(this.defaultOptions.gutterStep)
    });
    this.disabled = input(this.defaultOptions.disabled, {
      transform: booleanAttribute
    });
    this.gutterClickDeltaPx = input(this.defaultOptions.gutterClickDeltaPx, {
      transform: numberAttributeWithFallback(this.defaultOptions.gutterClickDeltaPx)
    });
    this.direction = input(this.defaultOptions.direction);
    this.dir = input(this.defaultOptions.dir);
    this.unit = input(this.defaultOptions.unit);
    this.gutterAriaLabel = input();
    this.restrictMove = input(this.defaultOptions.restrictMove, {
      transform: booleanAttribute
    });
    this.useTransition = input(this.defaultOptions.useTransition, {
      transform: booleanAttribute
    });
    this.gutterDblClickDuration = input(this.defaultOptions.gutterDblClickDuration, {
      transform: numberAttributeWithFallback(this.defaultOptions.gutterDblClickDuration)
    });
    this.gutterClick = output();
    this.gutterDblClick = output();
    this.dragStart = output();
    this.dragEnd = output();
    this.transitionEnd = output();
    this.dragProgress$ = this.dragProgressSubject.asObservable();
    this._visibleAreas = computed(() => this._areas().filter((area) => area.visible()));
    this.gridTemplateColumnsStyle = computed(() => this.createGridTemplateColumnsStyle());
    this.hostClasses = computed(() => createClassesString({
      [`as-${this.direction()}`]: true,
      [`as-${this.unit()}`]: true,
      ["as-disabled"]: this.disabled(),
      ["as-dragging"]: this._isDragging(),
      ["as-transition"]: this.useTransition() && !this._isDragging()
    }));
    this.draggedGutterIndex = signal(void 0);
    this._isDragging = computed(() => this.draggedGutterIndex() !== void 0);
    this._alignedVisibleAreasSizes = computed(() => this.createAlignedVisibleAreasSize());
    if (isDevMode()) {
      effect(() => {
        if (this.unit() === "percent" && this._visibleAreas().every((area) => area.size() === "auto")) {
          return;
        }
        areAreasValid(this._visibleAreas(), this.unit(), true);
      });
    }
    effect(() => {
      const gridTemplateColumnsStyle = this.gridTemplateColumnsStyle();
      this.renderer.setStyle(this.elementRef.nativeElement, "grid-template", gridTemplateColumnsStyle);
    });
    this.gutterMouseDownSubject.pipe(filter((context) => !this.customGutter() || this.customGutter()._canStartDragging(context.mouseDownEvent.target, context.gutterIndex + 1)), switchMap((mouseDownContext) => (
      // As we have gutterClickDeltaPx we can't just start the drag but need to make sure
      // we are out of the delta pixels. As the delta can be any number we make sure
      // we always start the drag if we go out of the gutter (delta based on mouse position is larger than gutter).
      // As moving can start inside the drag and end outside of it we always keep track of the previous event
      // so once the current is out of the delta size we use the previous one as the drag start baseline.
      fromMouseMoveEvent(this.document).pipe(startWith(mouseDownContext.mouseDownEvent), pairwise(), skipWhile(([, currMoveEvent]) => gutterEventsEqualWithDelta(mouseDownContext.mouseDownEvent, currMoveEvent, this.gutterClickDeltaPx(), mouseDownContext.gutterElement)), take(1), takeUntil(fromMouseUpEvent(this.document, true)), tap(() => {
        this.ngZone.run(() => {
          this.dragStart.emit(this.createDragInteractionEvent(mouseDownContext.gutterIndex));
          this.draggedGutterIndex.set(mouseDownContext.gutterIndex);
        });
      }), map(([prevMouseEvent]) => this.createDragStartContext(prevMouseEvent, mouseDownContext.areaBeforeGutterIndex, mouseDownContext.areaAfterGutterIndex)), switchMap((dragStartContext) => fromMouseMoveEvent(this.document).pipe(tap((moveEvent) => this.mouseDragMove(moveEvent, dragStartContext)), takeUntil(fromMouseUpEvent(this.document, true)), tap({
        complete: () => this.ngZone.run(() => {
          this.dragEnd.emit(this.createDragInteractionEvent(this.draggedGutterIndex()));
          this.draggedGutterIndex.set(void 0);
        })
      }))))
    )), takeUntilDestroyed()).subscribe();
    fromEvent(this.elementRef.nativeElement, "transitionend").pipe(filter((e) => e.propertyName.startsWith("grid-template")), leaveNgZone(), takeUntilDestroyed()).subscribe(() => this.ngZone.run(() => this.transitionEnd.emit(this.createAreaSizes())));
  }
  gutterClicked(gutterIndex) {
    this.ngZone.run(() => this.gutterClick.emit(this.createDragInteractionEvent(gutterIndex)));
  }
  gutterDoubleClicked(gutterIndex) {
    this.ngZone.run(() => this.gutterDblClick.emit(this.createDragInteractionEvent(gutterIndex)));
  }
  gutterMouseDown(e, gutterElement, gutterIndex, areaBeforeGutterIndex, areaAfterGutterIndex) {
    if (this.disabled()) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    this.gutterMouseDownSubject.next({
      mouseDownEvent: e,
      gutterElement,
      gutterIndex,
      areaBeforeGutterIndex,
      areaAfterGutterIndex
    });
  }
  gutterKeyDown(e, gutterIndex, areaBeforeGutterIndex, areaAfterGutterIndex) {
    if (this.disabled()) {
      return;
    }
    const pixelsToMove = 50;
    const pageMoveMultiplier = 10;
    let xPointOffset = 0;
    let yPointOffset = 0;
    if (this.direction() === "horizontal") {
      switch (e.key) {
        case "ArrowLeft":
          xPointOffset -= pixelsToMove;
          break;
        case "ArrowRight":
          xPointOffset += pixelsToMove;
          break;
        case "PageUp":
          if (this.dir() === "rtl") {
            xPointOffset -= pixelsToMove * pageMoveMultiplier;
          } else {
            xPointOffset += pixelsToMove * pageMoveMultiplier;
          }
          break;
        case "PageDown":
          if (this.dir() === "rtl") {
            xPointOffset += pixelsToMove * pageMoveMultiplier;
          } else {
            xPointOffset -= pixelsToMove * pageMoveMultiplier;
          }
          break;
        default:
          return;
      }
    } else {
      switch (e.key) {
        case "ArrowUp":
          yPointOffset -= pixelsToMove;
          break;
        case "ArrowDown":
          yPointOffset += pixelsToMove;
          break;
        case "PageUp":
          yPointOffset -= pixelsToMove * pageMoveMultiplier;
          break;
        case "PageDown":
          yPointOffset += pixelsToMove * pageMoveMultiplier;
          break;
        default:
          return;
      }
    }
    e.preventDefault();
    e.stopPropagation();
    const gutterMidPoint = getPointFromEvent(e);
    const dragStartContext = this.createDragStartContext(e, areaBeforeGutterIndex, areaAfterGutterIndex);
    this.ngZone.run(() => {
      this.dragStart.emit(this.createDragInteractionEvent(gutterIndex));
      this.draggedGutterIndex.set(gutterIndex);
    });
    this.dragMoveToPoint({
      x: gutterMidPoint.x + xPointOffset,
      y: gutterMidPoint.y + yPointOffset
    }, dragStartContext);
    this.ngZone.run(() => {
      this.dragEnd.emit(this.createDragInteractionEvent(gutterIndex));
      this.draggedGutterIndex.set(void 0);
    });
  }
  getGutterGridStyle(nextAreaIndex) {
    const gutterNum = nextAreaIndex * 2;
    const style = `${gutterNum} / ${gutterNum}`;
    return {
      ["grid-column"]: this.direction() === "horizontal" ? style : "1",
      ["grid-row"]: this.direction() === "vertical" ? style : "1"
    };
  }
  getAriaAreaSizeText(area) {
    const size = area._internalSize();
    if (size === "*") {
      return void 0;
    }
    return `${size.toFixed(0)} ${this.unit()}`;
  }
  getAriaValue(size) {
    return size === "*" ? void 0 : size;
  }
  createDragInteractionEvent(gutterIndex) {
    return {
      gutterNum: gutterIndex + 1,
      sizes: this.createAreaSizes()
    };
  }
  createAreaSizes() {
    return this._visibleAreas().map((area) => area._internalSize());
  }
  createDragStartContext(startEvent, areaBeforeGutterIndex, areaAfterGutterIndex) {
    const splitBoundingRect = this.elementRef.nativeElement.getBoundingClientRect();
    const splitSize = this.direction() === "horizontal" ? splitBoundingRect.width : splitBoundingRect.height;
    const totalAreasPixelSize = splitSize - (this._visibleAreas().length - 1) * this.gutterSize();
    const areaPixelSizesWithWildcard = this._areas().map((area) => {
      if (this.unit() === "pixel") {
        return area._internalSize();
      } else {
        const size = area._internalSize();
        if (size === "*") {
          return size;
        }
        return size / 100 * totalAreasPixelSize;
      }
    });
    const remainingSize = Math.max(0, totalAreasPixelSize - sum(areaPixelSizesWithWildcard, (size) => size === "*" ? 0 : size));
    const areasPixelSizes = areaPixelSizesWithWildcard.map((size) => size === "*" ? remainingSize : size);
    return {
      startEvent,
      areaBeforeGutterIndex,
      areaAfterGutterIndex,
      areasPixelSizes,
      totalAreasPixelSize,
      areaIndexToBoundaries: toRecord(this._areas(), (area, index) => {
        const percentToPixels = (percent) => percent / 100 * totalAreasPixelSize;
        const value = this.unit() === "pixel" ? {
          min: area._normalizedMinSize(),
          max: area._normalizedMaxSize()
        } : {
          min: percentToPixels(area._normalizedMinSize()),
          max: percentToPixels(area._normalizedMaxSize())
        };
        return [index.toString(), value];
      })
    };
  }
  mouseDragMove(moveEvent, dragStartContext) {
    moveEvent.preventDefault();
    moveEvent.stopPropagation();
    const endPoint = getPointFromEvent(moveEvent);
    this.dragMoveToPoint(endPoint, dragStartContext);
  }
  dragMoveToPoint(endPoint, dragStartContext) {
    const startPoint = getPointFromEvent(dragStartContext.startEvent);
    const preDirOffset = this.direction() === "horizontal" ? endPoint.x - startPoint.x : endPoint.y - startPoint.y;
    const offset = this.direction() === "horizontal" && this.dir() === "rtl" ? -preDirOffset : preDirOffset;
    const isDraggingForward = offset > 0;
    const absSteppedOffset = Math.abs(Math.round(offset / this.gutterStep()) * this.gutterStep());
    const tempAreasPixelSizes = [...dragStartContext.areasPixelSizes];
    const areasIndices = tempAreasPixelSizes.map((_, index) => index);
    const areasIndicesBeforeGutter = this.restrictMove() ? [dragStartContext.areaBeforeGutterIndex] : areasIndices.slice(0, dragStartContext.areaBeforeGutterIndex + 1).filter((index) => this._areas()[index].visible()).reverse();
    const areasIndicesAfterGutter = this.restrictMove() ? [dragStartContext.areaAfterGutterIndex] : areasIndices.slice(dragStartContext.areaAfterGutterIndex).filter((index) => this._areas()[index].visible());
    const potentialAreasIndicesArrToShrink = isDraggingForward ? areasIndicesAfterGutter : areasIndicesBeforeGutter;
    const potentialAreasIndicesArrToExpand = isDraggingForward ? areasIndicesBeforeGutter : areasIndicesAfterGutter;
    let remainingPixels = absSteppedOffset;
    let potentialShrinkArrIndex = 0;
    let potentialExpandArrIndex = 0;
    while (remainingPixels !== 0 && potentialShrinkArrIndex < potentialAreasIndicesArrToShrink.length && potentialExpandArrIndex < potentialAreasIndicesArrToExpand.length) {
      const areaIndexToShrink = potentialAreasIndicesArrToShrink[potentialShrinkArrIndex];
      const areaIndexToExpand = potentialAreasIndicesArrToExpand[potentialExpandArrIndex];
      const areaToShrinkSize = tempAreasPixelSizes[areaIndexToShrink];
      const areaToExpandSize = tempAreasPixelSizes[areaIndexToExpand];
      const areaToShrinkMinSize = dragStartContext.areaIndexToBoundaries[areaIndexToShrink].min;
      const areaToExpandMaxSize = dragStartContext.areaIndexToBoundaries[areaIndexToExpand].max;
      const maxPixelsToShrink = areaToShrinkSize - areaToShrinkMinSize;
      const maxPixelsToExpand = areaToExpandMaxSize - areaToExpandSize;
      const pixelsToTransfer = Math.min(maxPixelsToShrink, maxPixelsToExpand, remainingPixels);
      tempAreasPixelSizes[areaIndexToShrink] -= pixelsToTransfer;
      tempAreasPixelSizes[areaIndexToExpand] += pixelsToTransfer;
      remainingPixels -= pixelsToTransfer;
      if (tempAreasPixelSizes[areaIndexToShrink] === areaToShrinkMinSize) {
        potentialShrinkArrIndex++;
      }
      if (tempAreasPixelSizes[areaIndexToExpand] === areaToExpandMaxSize) {
        potentialExpandArrIndex++;
      }
    }
    this._areas().forEach((area, index) => {
      if (area._internalSize() === "*") {
        return;
      }
      if (this.unit() === "pixel") {
        area._internalSize.set(tempAreasPixelSizes[index]);
      } else {
        const percentSize = tempAreasPixelSizes[index] / dragStartContext.totalAreasPixelSize * 100;
        area._internalSize.set(parseFloat(percentSize.toFixed(10)));
      }
    });
    this.dragProgressSubject.next(this.createDragInteractionEvent(this.draggedGutterIndex()));
  }
  createGridTemplateColumnsStyle() {
    const columns = [];
    const sumNonWildcardSizes = sum(this._visibleAreas(), (area) => {
      const size = area._internalSize();
      return size === "*" ? 0 : size;
    });
    const visibleAreasCount = this._visibleAreas().length;
    let visitedVisibleAreas = 0;
    this._areas().forEach((area, index, areas) => {
      const unit = this.unit();
      const areaSize = area._internalSize();
      if (!area.visible()) {
        columns.push(unit === "percent" || areaSize === "*" ? "0fr" : "0px");
      } else {
        if (unit === "pixel") {
          const columnValue = areaSize === "*" ? "1fr" : `${areaSize}px`;
          columns.push(columnValue);
        } else {
          const percentSize = areaSize === "*" ? 100 - sumNonWildcardSizes : areaSize;
          const columnValue = `${percentSize}fr`;
          columns.push(columnValue);
        }
        visitedVisibleAreas++;
      }
      const isLastArea = index === areas.length - 1;
      if (isLastArea) {
        return;
      }
      const remainingVisibleAreas = visibleAreasCount - visitedVisibleAreas;
      if (area.visible() && remainingVisibleAreas > 0) {
        columns.push(`${this.gutterSize()}px`);
      } else {
        columns.push("0px");
      }
    });
    return this.direction() === "horizontal" ? `1fr / ${columns.join(" ")}` : `${columns.join(" ")} / 1fr`;
  }
  createAlignedVisibleAreasSize() {
    const visibleAreasSizes = this._visibleAreas().map((area) => {
      const size = area.size();
      return size === "auto" ? "*" : size;
    });
    const isValid = areAreasValid(this._visibleAreas(), this.unit(), false);
    if (isValid) {
      return visibleAreasSizes;
    }
    const unit = this.unit();
    if (unit === "percent") {
      const defaultPercentSize = 100 / visibleAreasSizes.length;
      return visibleAreasSizes.map(() => defaultPercentSize);
    }
    if (unit === "pixel") {
      const wildcardAreas = visibleAreasSizes.filter((areaSize) => areaSize === "*");
      if (wildcardAreas.length === 0) {
        return ["*", ...visibleAreasSizes.slice(1)];
      } else {
        const firstWildcardIndex = visibleAreasSizes.findIndex((areaSize) => areaSize === "*");
        const defaultPxSize = 100;
        return visibleAreasSizes.map((areaSize, index) => index === firstWildcardIndex || areaSize !== "*" ? areaSize : defaultPxSize);
      }
    }
    return assertUnreachable(unit, "SplitUnit");
  }
  static {
    this.ɵfac = function SplitComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _SplitComponent)();
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _SplitComponent,
      selectors: [["as-split"]],
      contentQueries: function SplitComponent_ContentQueries(rf, ctx, dirIndex) {
        if (rf & 1) {
          ɵɵcontentQuerySignal(dirIndex, ctx._areas, SPLIT_AREA_CONTRACT, 4);
          ɵɵcontentQuerySignal(dirIndex, ctx.customGutter, SplitGutterDirective, 5);
        }
        if (rf & 2) {
          ɵɵqueryAdvance(2);
        }
      },
      hostVars: 3,
      hostBindings: function SplitComponent_HostBindings(rf, ctx) {
        if (rf & 2) {
          ɵɵhostProperty("dir", ctx.hostDirBinding);
          ɵɵclassMap(ctx.hostClassesBinding);
        }
      },
      inputs: {
        gutterSize: [1, "gutterSize"],
        gutterStep: [1, "gutterStep"],
        disabled: [1, "disabled"],
        gutterClickDeltaPx: [1, "gutterClickDeltaPx"],
        direction: [1, "direction"],
        dir: [1, "dir"],
        unit: [1, "unit"],
        gutterAriaLabel: [1, "gutterAriaLabel"],
        restrictMove: [1, "restrictMove"],
        useTransition: [1, "useTransition"],
        gutterDblClickDuration: [1, "gutterDblClickDuration"]
      },
      outputs: {
        gutterClick: "gutterClick",
        gutterDblClick: "gutterDblClick",
        dragStart: "dragStart",
        dragEnd: "dragEnd",
        transitionEnd: "transitionEnd"
      },
      exportAs: ["asSplit"],
      ngContentSelectors: _c0,
      decls: 3,
      vars: 0,
      consts: [["gutter", ""], ["role", "separator", "tabindex", "0", "asSplitCustomEventsBehavior", "", 1, "as-split-gutter", 3, "ngStyle", "as-dragged", "asSplitCustomMultiClickThreshold", "asSplitCustomClickDeltaInPx"], ["role", "separator", "tabindex", "0", "asSplitCustomEventsBehavior", "", 1, "as-split-gutter", 3, "asSplitCustomClick", "asSplitCustomDblClick", "asSplitCustomMouseDown", "asSplitCustomKeyDown", "ngStyle", "asSplitCustomMultiClickThreshold", "asSplitCustomClickDeltaInPx"], [1, "as-split-gutter-icon"], [4, "asSplitGutterDynamicInjector"], [4, "ngTemplateOutlet", "ngTemplateOutletContext", "ngTemplateOutletInjector"]],
      template: function SplitComponent_Template(rf, ctx) {
        if (rf & 1) {
          ɵɵprojectionDef();
          ɵɵprojection(0);
          ɵɵrepeaterCreate(1, SplitComponent_For_2_Template, 1, 1, null, null, ɵɵrepeaterTrackByIdentity);
        }
        if (rf & 2) {
          ɵɵadvance();
          ɵɵrepeater(ctx._areas());
        }
      },
      dependencies: [NgStyle, SplitCustomEventsBehaviorDirective, SplitGutterDynamicInjectorDirective, NgTemplateOutlet],
      styles: ['@property --as-gutter-background-color{syntax: "<color>"; inherits: true; initial-value: #eeeeee;}@property --as-gutter-icon-horizontal{syntax: "<url>"; inherits: true; initial-value: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==);}@property --as-gutter-icon-vertical{syntax: "<url>"; inherits: true; initial-value: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFCAMAAABl/6zIAAAABlBMVEUAAADMzMzIT8AyAAAAAXRSTlMAQObYZgAAABRJREFUeAFjYGRkwIMJSeMHlBkOABP7AEGzSuPKAAAAAElFTkSuQmCC);}@property --as-gutter-icon-disabled{syntax: "<url>"; inherits: true; initial-value: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==);}@property --as-transition-duration{syntax: "<time>"; inherits: true; initial-value: .3s;}@property --as-gutter-disabled-cursor{syntax: "*"; inherits: true; initial-value: default;}[_nghost-%COMP%]{--_as-gutter-background-color: var(--as-gutter-background-color, #eeeeee);--_as-gutter-icon-horizontal: var( --as-gutter-icon-horizontal, url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==) );--_as-gutter-icon-vertical: var( --as-gutter-icon-vertical, url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFCAMAAABl/6zIAAAABlBMVEUAAADMzMzIT8AyAAAAAXRSTlMAQObYZgAAABRJREFUeAFjYGRkwIMJSeMHlBkOABP7AEGzSuPKAAAAAElFTkSuQmCC) );--_as-gutter-icon-disabled: var( --as-gutter-icon-disabled, url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==) );--_as-transition-duration: var(--as-transition-duration, .3s);--_as-gutter-disabled-cursor: var(--as-gutter-disabled-cursor, default)}[_nghost-%COMP%]{display:grid;overflow:hidden;height:100%;width:100%}.as-transition[_nghost-%COMP%]{transition:grid-template var(--_as-transition-duration)}.as-split-gutter[_ngcontent-%COMP%]{background-color:var(--_as-gutter-background-color);display:flex;align-items:center;justify-content:center;touch-action:none}.as-horizontal[_nghost-%COMP%] > .as-split-gutter[_ngcontent-%COMP%]{cursor:col-resize;height:100%}.as-vertical[_nghost-%COMP%] > .as-split-gutter[_ngcontent-%COMP%]{cursor:row-resize;width:100%}.as-disabled[_nghost-%COMP%] > .as-split-gutter[_ngcontent-%COMP%]{cursor:var(--_as-gutter-disabled-cursor)}.as-split-gutter-icon[_ngcontent-%COMP%]{width:100%;height:100%;background-position:center center;background-repeat:no-repeat}.as-horizontal[_nghost-%COMP%] > .as-split-gutter[_ngcontent-%COMP%] > .as-split-gutter-icon[_ngcontent-%COMP%]{background-image:var(--_as-gutter-icon-horizontal)}.as-vertical[_nghost-%COMP%] > .as-split-gutter[_ngcontent-%COMP%] > .as-split-gutter-icon[_ngcontent-%COMP%]{background-image:var(--_as-gutter-icon-vertical)}.as-disabled[_nghost-%COMP%] > .as-split-gutter[_ngcontent-%COMP%] > .as-split-gutter-icon[_ngcontent-%COMP%]{background-image:var(--_as-gutter-icon-disabled)}'],
      changeDetection: 0
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SplitComponent, [{
    type: Component,
    args: [{
      selector: "as-split",
      imports: [NgStyle, SplitCustomEventsBehaviorDirective, SplitGutterDynamicInjectorDirective, NgTemplateOutlet],
      exportAs: "asSplit",
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: '<ng-content></ng-content>\n@for (area of _areas(); track area) {\n  @if (!$last) {\n    <div\n      #gutter\n      class="as-split-gutter"\n      role="separator"\n      tabindex="0"\n      [attr.aria-label]="gutterAriaLabel()"\n      [attr.aria-orientation]="direction()"\n      [attr.aria-valuemin]="getAriaValue(area.minSize())"\n      [attr.aria-valuemax]="getAriaValue(area.maxSize())"\n      [attr.aria-valuenow]="getAriaValue(area._internalSize())"\n      [attr.aria-valuetext]="getAriaAreaSizeText(area)"\n      [ngStyle]="getGutterGridStyle($index + 1)"\n      [class.as-dragged]="draggedGutterIndex() === $index"\n      asSplitCustomEventsBehavior\n      [asSplitCustomMultiClickThreshold]="gutterDblClickDuration()"\n      [asSplitCustomClickDeltaInPx]="gutterClickDeltaPx()"\n      (asSplitCustomClick)="gutterClicked($index)"\n      (asSplitCustomDblClick)="gutterDoubleClicked($index)"\n      (asSplitCustomMouseDown)="gutterMouseDown($event, gutter, $index, $index, $index + 1)"\n      (asSplitCustomKeyDown)="gutterKeyDown($event, $index, $index, $index + 1)"\n    >\n      @if (customGutter()?.template) {\n        <ng-container *asSplitGutterDynamicInjector="$index + 1; let injector">\n          <ng-container\n            *ngTemplateOutlet="\n              customGutter().template;\n              context: {\n                areaBefore: area,\n                areaAfter: _areas()[$index + 1],\n                gutterNum: $index + 1,\n                first: $first,\n                last: $index === _areas().length - 2,\n                isDragged: draggedGutterIndex() === $index\n              };\n              injector: injector\n            "\n          ></ng-container>\n        </ng-container>\n      } @else {\n        <div class="as-split-gutter-icon"></div>\n      }\n    </div>\n  }\n}\n',
      styles: ['@property --as-gutter-background-color{syntax: "<color>"; inherits: true; initial-value: #eeeeee;}@property --as-gutter-icon-horizontal{syntax: "<url>"; inherits: true; initial-value: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==);}@property --as-gutter-icon-vertical{syntax: "<url>"; inherits: true; initial-value: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFCAMAAABl/6zIAAAABlBMVEUAAADMzMzIT8AyAAAAAXRSTlMAQObYZgAAABRJREFUeAFjYGRkwIMJSeMHlBkOABP7AEGzSuPKAAAAAElFTkSuQmCC);}@property --as-gutter-icon-disabled{syntax: "<url>"; inherits: true; initial-value: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==);}@property --as-transition-duration{syntax: "<time>"; inherits: true; initial-value: .3s;}@property --as-gutter-disabled-cursor{syntax: "*"; inherits: true; initial-value: default;}:host{--_as-gutter-background-color: var(--as-gutter-background-color, #eeeeee);--_as-gutter-icon-horizontal: var( --as-gutter-icon-horizontal, url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==) );--_as-gutter-icon-vertical: var( --as-gutter-icon-vertical, url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFCAMAAABl/6zIAAAABlBMVEUAAADMzMzIT8AyAAAAAXRSTlMAQObYZgAAABRJREFUeAFjYGRkwIMJSeMHlBkOABP7AEGzSuPKAAAAAElFTkSuQmCC) );--_as-gutter-icon-disabled: var( --as-gutter-icon-disabled, url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==) );--_as-transition-duration: var(--as-transition-duration, .3s);--_as-gutter-disabled-cursor: var(--as-gutter-disabled-cursor, default)}:host{display:grid;overflow:hidden;height:100%;width:100%}:host(.as-transition){transition:grid-template var(--_as-transition-duration)}.as-split-gutter{background-color:var(--_as-gutter-background-color);display:flex;align-items:center;justify-content:center;touch-action:none}:host(.as-horizontal)>.as-split-gutter{cursor:col-resize;height:100%}:host(.as-vertical)>.as-split-gutter{cursor:row-resize;width:100%}:host(.as-disabled)>.as-split-gutter{cursor:var(--_as-gutter-disabled-cursor)}.as-split-gutter-icon{width:100%;height:100%;background-position:center center;background-repeat:no-repeat}:host(.as-horizontal)>.as-split-gutter>.as-split-gutter-icon{background-image:var(--_as-gutter-icon-horizontal)}:host(.as-vertical)>.as-split-gutter>.as-split-gutter-icon{background-image:var(--_as-gutter-icon-vertical)}:host(.as-disabled)>.as-split-gutter>.as-split-gutter-icon{background-image:var(--_as-gutter-icon-disabled)}\n']
    }]
  }], () => [], {
    hostClassesBinding: [{
      type: HostBinding,
      args: ["class"]
    }],
    hostDirBinding: [{
      type: HostBinding,
      args: ["dir"]
    }]
  });
})();
var internalAreaSizeTransform = (areaSize) => areaSize === void 0 || areaSize === null || areaSize === "*" ? "*" : +areaSize;
var areaSizeTransform = (areaSize) => internalAreaSizeTransform(areaSize);
var boundaryAreaSizeTransform = (areaSize) => internalAreaSizeTransform(areaSize);
var SplitAreaComponent = class _SplitAreaComponent {
  constructor() {
    this.split = inject(SplitComponent);
    this.size = input("auto", {
      transform: areaSizeTransform
    });
    this.minSize = input("*", {
      transform: boundaryAreaSizeTransform
    });
    this.maxSize = input("*", {
      transform: boundaryAreaSizeTransform
    });
    this.lockSize = input(false, {
      transform: booleanAttribute
    });
    this.visible = input(true, {
      transform: booleanAttribute
    });
    this._internalSize = mirrorSignal(
      // As size is an input and we can change the size without the outside
      // listening to the change we need an intermediate writeable signal
      computed(() => {
        if (!this.visible()) {
          return 0;
        }
        const visibleIndex = this.split._visibleAreas().findIndex((area) => area === this);
        return this.split._alignedVisibleAreasSizes()[visibleIndex];
      })
    );
    this._normalizedMinSize = computed(() => this.normalizeMinSize());
    this._normalizedMaxSize = computed(() => this.normalizeMaxSize());
    this.index = computed(() => this.split._areas().findIndex((area) => area === this));
    this.gridAreaNum = computed(() => this.index() * 2 + 1);
    this.hostClasses = computed(() => createClassesString({
      ["as-split-area"]: true,
      ["as-min"]: this.visible() && this._internalSize() === this._normalizedMinSize(),
      ["as-max"]: this.visible() && this._internalSize() === this._normalizedMaxSize(),
      ["as-hidden"]: !this.visible()
    }));
  }
  get hostClassesBinding() {
    return this.hostClasses();
  }
  get hostGridColumnStyleBinding() {
    return this.split.direction() === "horizontal" ? `${this.gridAreaNum()} / ${this.gridAreaNum()}` : void 0;
  }
  get hostGridRowStyleBinding() {
    return this.split.direction() === "vertical" ? `${this.gridAreaNum()} / ${this.gridAreaNum()}` : void 0;
  }
  get hostPositionStyleBinding() {
    return this.split._isDragging() ? "relative" : void 0;
  }
  normalizeMinSize() {
    const defaultMinSize = 0;
    if (!this.visible()) {
      return defaultMinSize;
    }
    const minSize = this.normalizeSizeBoundary(this.minSize, defaultMinSize);
    const size = this.size();
    if (size !== "*" && size !== "auto" && size < minSize) {
      if (isDevMode()) {
        console.warn("as-split: size cannot be smaller than minSize");
      }
      return defaultMinSize;
    }
    return minSize;
  }
  normalizeMaxSize() {
    const defaultMaxSize = Infinity;
    if (!this.visible()) {
      return defaultMaxSize;
    }
    const maxSize = this.normalizeSizeBoundary(this.maxSize, defaultMaxSize);
    const size = this.size();
    if (size !== "*" && size !== "auto" && size > maxSize) {
      if (isDevMode()) {
        console.warn("as-split: size cannot be larger than maxSize");
      }
      return defaultMaxSize;
    }
    return maxSize;
  }
  normalizeSizeBoundary(sizeBoundarySignal, defaultBoundarySize) {
    const size = this.size();
    const lockSize = this.lockSize();
    const boundarySize = sizeBoundarySignal();
    if (lockSize) {
      if (isDevMode() && boundarySize !== "*") {
        console.warn("as-split: lockSize overwrites maxSize/minSize");
      }
      if (size === "*" || size === "auto") {
        if (isDevMode()) {
          console.warn(`as-split: lockSize isn't supported on area with * size or without size`);
        }
        return defaultBoundarySize;
      }
      return size;
    }
    if (boundarySize === "*") {
      return defaultBoundarySize;
    }
    if (size === "*" || size === "auto") {
      if (isDevMode()) {
        console.warn("as-split: maxSize/minSize not allowed on * or without size");
      }
      return defaultBoundarySize;
    }
    return boundarySize;
  }
  static {
    this.ɵfac = function SplitAreaComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _SplitAreaComponent)();
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _SplitAreaComponent,
      selectors: [["as-split-area"]],
      hostVars: 8,
      hostBindings: function SplitAreaComponent_HostBindings(rf, ctx) {
        if (rf & 2) {
          ɵɵclassMap(ctx.hostClassesBinding);
          ɵɵstyleProp("grid-column", ctx.hostGridColumnStyleBinding)("grid-row", ctx.hostGridRowStyleBinding)("position", ctx.hostPositionStyleBinding);
        }
      },
      inputs: {
        size: [1, "size"],
        minSize: [1, "minSize"],
        maxSize: [1, "maxSize"],
        lockSize: [1, "lockSize"],
        visible: [1, "visible"]
      },
      exportAs: ["asSplitArea"],
      features: [ɵɵProvidersFeature([{
        provide: SPLIT_AREA_CONTRACT,
        useExisting: _SplitAreaComponent
      }])],
      ngContentSelectors: _c0,
      decls: 2,
      vars: 1,
      consts: [[1, "as-iframe-fix"]],
      template: function SplitAreaComponent_Template(rf, ctx) {
        if (rf & 1) {
          ɵɵprojectionDef();
          ɵɵprojection(0);
          ɵɵtemplate(1, SplitAreaComponent_Conditional_1_Template, 1, 0, "div", 0);
        }
        if (rf & 2) {
          ɵɵadvance();
          ɵɵconditional(ctx.split._isDragging() ? 1 : -1);
        }
      },
      styles: ["[_nghost-%COMP%]{overflow-x:hidden;overflow-y:auto}.as-horizontal > [_nghost-%COMP%]{height:100%}.as-vertical > [_nghost-%COMP%]{width:100%}.as-iframe-fix[_ngcontent-%COMP%]{position:absolute;top:0;left:0;width:100%;height:100%}"],
      changeDetection: 0
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SplitAreaComponent, [{
    type: Component,
    args: [{
      selector: "as-split-area",
      standalone: true,
      exportAs: "asSplitArea",
      providers: [{
        provide: SPLIT_AREA_CONTRACT,
        useExisting: SplitAreaComponent
      }],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: '<ng-content></ng-content>\n@if (split._isDragging()) {\n  <div class="as-iframe-fix"></div>\n}\n',
      styles: [":host{overflow-x:hidden;overflow-y:auto}.as-horizontal>:host{height:100%}.as-vertical>:host{width:100%}.as-iframe-fix{position:absolute;top:0;left:0;width:100%;height:100%}\n"]
    }]
  }], null, {
    hostClassesBinding: [{
      type: HostBinding,
      args: ["class"]
    }],
    hostGridColumnStyleBinding: [{
      type: HostBinding,
      args: ["style.grid-column"]
    }],
    hostGridRowStyleBinding: [{
      type: HostBinding,
      args: ["style.grid-row"]
    }],
    hostPositionStyleBinding: [{
      type: HostBinding,
      args: ["style.position"]
    }]
  });
})();
var AngularSplitModule = class _AngularSplitModule {
  static {
    this.ɵfac = function AngularSplitModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _AngularSplitModule)();
    };
  }
  static {
    this.ɵmod = ɵɵdefineNgModule({
      type: _AngularSplitModule,
      imports: [SplitComponent, SplitAreaComponent, SplitGutterDirective, SplitGutterDragHandleDirective, SplitGutterExcludeFromDragDirective],
      exports: [SplitComponent, SplitAreaComponent, SplitGutterDirective, SplitGutterDragHandleDirective, SplitGutterExcludeFromDragDirective]
    });
  }
  static {
    this.ɵinj = ɵɵdefineInjector({});
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AngularSplitModule, [{
    type: NgModule,
    args: [{
      imports: [SplitComponent, SplitAreaComponent, SplitGutterDirective, SplitGutterDragHandleDirective, SplitGutterExcludeFromDragDirective],
      exports: [SplitComponent, SplitAreaComponent, SplitGutterDirective, SplitGutterDragHandleDirective, SplitGutterExcludeFromDragDirective]
    }]
  }], null, null);
})();
export {
  AngularSplitModule,
  SplitAreaComponent,
  SplitComponent,
  SplitGutterDirective,
  SplitGutterDragHandleDirective,
  SplitGutterExcludeFromDragDirective,
  provideAngularSplitOptions
};
/*! Bundled license information:

@angular/core/fesm2022/rxjs-interop.mjs:
  (**
   * @license Angular v19.2.14
   * (c) 2010-2025 Google LLC. https://angular.io/
   * License: MIT
   *)
*/
//# sourceMappingURL=angular-split.js.map
