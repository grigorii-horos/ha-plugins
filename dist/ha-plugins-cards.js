/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ve = globalThis, Fe = ve.ShadowRoot && (ve.ShadyCSS === void 0 || ve.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Be = Symbol(), st = /* @__PURE__ */ new WeakMap();
class Tt {
  constructor(e, t, i) {
    if (this._$cssResult$ = !0, i !== Be)
      throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this._strings = t;
  }
  // This is a getter so that it's lazy. In practice, this means stylesheets
  // are not created until the first element instance is made.
  get styleSheet() {
    let e = this._styleSheet;
    const t = this._strings;
    if (Fe && e === void 0) {
      const i = t !== void 0 && t.length === 1;
      i && (e = st.get(t)), e === void 0 && ((this._styleSheet = e = new CSSStyleSheet()).replaceSync(this.cssText), i && st.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
}
const vs = (s) => {
  if (s._$cssResult$ === !0)
    return s.cssText;
  if (typeof s == "number")
    return s;
  throw new Error(`Value passed to 'css' function must be a 'css' function result: ${s}. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`);
}, ws = (s) => new Tt(typeof s == "string" ? s : String(s), void 0, Be), qe = (s, ...e) => {
  const t = s.length === 1 ? s[0] : e.reduce((i, n, r) => i + vs(n) + s[r + 1], s[0]);
  return new Tt(t, s, Be);
}, $s = (s, e) => {
  if (Fe)
    s.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else
    for (const t of e) {
      const i = document.createElement("style"), n = ve.litNonce;
      n !== void 0 && i.setAttribute("nonce", n), i.textContent = t.cssText, s.appendChild(i);
    }
}, Es = (s) => {
  let e = "";
  for (const t of s.cssRules)
    e += t.cssText;
  return ws(e);
}, nt = Fe ? (s) => s : (s) => s instanceof CSSStyleSheet ? Es(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ss, defineProperty: xs, getOwnPropertyDescriptor: it, getOwnPropertyNames: Ps, getOwnPropertySymbols: Cs, getPrototypeOf: rt } = Object, M = globalThis;
let j;
const ot = M.trustedTypes, Ts = ot ? ot.emptyScript : "", kt = M.reactiveElementPolyfillSupportDevMode;
M.litIssuedWarnings ??= /* @__PURE__ */ new Set(), j = (s, e) => {
  e += ` See https://lit.dev/msg/${s} for more information.`, !M.litIssuedWarnings.has(e) && !M.litIssuedWarnings.has(s) && (console.warn(e), M.litIssuedWarnings.add(e));
}, queueMicrotask(() => {
  j("dev-mode", "Lit is in dev mode. Not recommended for production!"), M.ShadyDOM?.inUse && kt === void 0 && j("polyfill-support-missing", "Shadow DOM is being polyfilled via `ShadyDOM` but the `polyfill-support` module has not been loaded.");
});
const ks = (s) => {
  M.emitLitDebugLogEvents && M.dispatchEvent(new CustomEvent("lit-debug", {
    detail: s
  }));
}, se = (s, e) => s, Ee = {
  toAttribute(s, e) {
    switch (e) {
      case Boolean:
        s = s ? Ts : null;
        break;
      case Object:
      case Array:
        s = s == null ? s : JSON.stringify(s);
        break;
    }
    return s;
  },
  fromAttribute(s, e) {
    let t = s;
    switch (e) {
      case Boolean:
        t = s !== null;
        break;
      case Number:
        t = s === null ? null : Number(s);
        break;
      case Object:
      case Array:
        try {
          t = JSON.parse(s);
        } catch {
          t = null;
        }
        break;
    }
    return t;
  }
}, Ke = (s, e) => !Ss(s, e), at = {
  attribute: !0,
  type: String,
  converter: Ee,
  reflect: !1,
  useDefault: !1,
  hasChanged: Ke
};
Symbol.metadata ??= Symbol("metadata");
M.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
class H extends HTMLElement {
  /**
   * Adds an initializer function to the class that is called during instance
   * construction.
   *
   * This is useful for code that runs against a `ReactiveElement`
   * subclass, such as a decorator, that needs to do work for each
   * instance, such as setting up a `ReactiveController`.
   *
   * ```ts
   * const myDecorator = (target: typeof ReactiveElement, key: string) => {
   *   target.addInitializer((instance: ReactiveElement) => {
   *     // This is run during construction of the element
   *     new MyController(instance);
   *   });
   * }
   * ```
   *
   * Decorating a field will then cause each instance to run an initializer
   * that adds a controller:
   *
   * ```ts
   * class MyElement extends LitElement {
   *   @myDecorator foo;
   * }
   * ```
   *
   * Initializers are stored per-constructor. Adding an initializer to a
   * subclass does not add it to a superclass. Since initializers are run in
   * constructors, initializers will run in order of the class hierarchy,
   * starting with superclasses and progressing to the instance's class.
   *
   * @nocollapse
   */
  static addInitializer(e) {
    this.__prepare(), (this._initializers ??= []).push(e);
  }
  /**
   * Returns a list of attributes corresponding to the registered properties.
   * @nocollapse
   * @category attributes
   */
  static get observedAttributes() {
    return this.finalize(), this.__attributeToPropertyMap && [...this.__attributeToPropertyMap.keys()];
  }
  /**
   * Creates a property accessor on the element prototype if one does not exist
   * and stores a {@linkcode PropertyDeclaration} for the property with the
   * given options. The property setter calls the property's `hasChanged`
   * property option or uses a strict identity check to determine whether or not
   * to request an update.
   *
   * This method may be overridden to customize properties; however,
   * when doing so, it's important to call `super.createProperty` to ensure
   * the property is setup correctly. This method calls
   * `getPropertyDescriptor` internally to get a descriptor to install.
   * To customize what properties do when they are get or set, override
   * `getPropertyDescriptor`. To customize the options for a property,
   * implement `createProperty` like this:
   *
   * ```ts
   * static createProperty(name, options) {
   *   options = Object.assign(options, {myOption: true});
   *   super.createProperty(name, options);
   * }
   * ```
   *
   * @nocollapse
   * @category properties
   */
  static createProperty(e, t = at) {
    if (t.state && (t.attribute = !1), this.__prepare(), this.prototype.hasOwnProperty(e) && (t = Object.create(t), t.wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const i = (
        // Use Symbol.for in dev mode to make it easier to maintain state
        // when doing HMR.
        Symbol.for(`${String(e)} (@property() cache)`)
      ), n = this.getPropertyDescriptor(e, i, t);
      n !== void 0 && xs(this.prototype, e, n);
    }
  }
  /**
   * Returns a property descriptor to be defined on the given named property.
   * If no descriptor is returned, the property will not become an accessor.
   * For example,
   *
   * ```ts
   * class MyElement extends LitElement {
   *   static getPropertyDescriptor(name, key, options) {
   *     const defaultDescriptor =
   *         super.getPropertyDescriptor(name, key, options);
   *     const setter = defaultDescriptor.set;
   *     return {
   *       get: defaultDescriptor.get,
   *       set(value) {
   *         setter.call(this, value);
   *         // custom action.
   *       },
   *       configurable: true,
   *       enumerable: true
   *     }
   *   }
   * }
   * ```
   *
   * @nocollapse
   * @category properties
   */
  static getPropertyDescriptor(e, t, i) {
    const { get: n, set: r } = it(this.prototype, e) ?? {
      get() {
        return this[t];
      },
      set(o) {
        this[t] = o;
      }
    };
    if (n == null) {
      if ("value" in (it(this.prototype, e) ?? {}))
        throw new Error(`Field ${JSON.stringify(String(e))} on ${this.name} was declared as a reactive property but it's actually declared as a value on the prototype. Usually this is due to using @property or @state on a method.`);
      j("reactive-property-without-getter", `Field ${JSON.stringify(String(e))} on ${this.name} was declared as a reactive property but it does not have a getter. This will be an error in a future version of Lit.`);
    }
    return {
      get: n,
      set(o) {
        const c = n?.call(this);
        r?.call(this, o), this.requestUpdate(e, c, i);
      },
      configurable: !0,
      enumerable: !0
    };
  }
  /**
   * Returns the property options associated with the given property.
   * These options are defined with a `PropertyDeclaration` via the `properties`
   * object or the `@property` decorator and are registered in
   * `createProperty(...)`.
   *
   * Note, this method should be considered "final" and not overridden. To
   * customize the options for a given property, override
   * {@linkcode createProperty}.
   *
   * @nocollapse
   * @final
   * @category properties
   */
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? at;
  }
  /**
   * Initializes static own properties of the class used in bookkeeping
   * for element properties, initializers, etc.
   *
   * Can be called multiple times by code that needs to ensure these
   * properties exist before using them.
   *
   * This method ensures the superclass is finalized so that inherited
   * property metadata can be copied down.
   * @nocollapse
   */
  static __prepare() {
    if (this.hasOwnProperty(se("elementProperties")))
      return;
    const e = rt(this);
    e.finalize(), e._initializers !== void 0 && (this._initializers = [...e._initializers]), this.elementProperties = new Map(e.elementProperties);
  }
  /**
   * Finishes setting up the class so that it's ready to be registered
   * as a custom element and instantiated.
   *
   * This method is called by the ReactiveElement.observedAttributes getter.
   * If you override the observedAttributes getter, you must either call
   * super.observedAttributes to trigger finalization, or call finalize()
   * yourself.
   *
   * @nocollapse
   */
  static finalize() {
    if (this.hasOwnProperty(se("finalized")))
      return;
    if (this.finalized = !0, this.__prepare(), this.hasOwnProperty(se("properties"))) {
      const t = this.properties, i = [
        ...Ps(t),
        ...Cs(t)
      ];
      for (const n of i)
        this.createProperty(n, t[n]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0)
        for (const [i, n] of t)
          this.elementProperties.set(i, n);
    }
    this.__attributeToPropertyMap = /* @__PURE__ */ new Map();
    for (const [t, i] of this.elementProperties) {
      const n = this.__attributeNameForProperty(t, i);
      n !== void 0 && this.__attributeToPropertyMap.set(n, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles), this.hasOwnProperty("createProperty") && j("no-override-create-property", "Overriding ReactiveElement.createProperty() is deprecated. The override will not be called with standard decorators"), this.hasOwnProperty("getPropertyDescriptor") && j("no-override-get-property-descriptor", "Overriding ReactiveElement.getPropertyDescriptor() is deprecated. The override will not be called with standard decorators");
  }
  /**
   * Takes the styles the user supplied via the `static styles` property and
   * returns the array of styles to apply to the element.
   * Override this method to integrate into a style management system.
   *
   * Styles are deduplicated preserving the _last_ instance in the list. This
   * is a performance optimization to avoid duplicated styles that can occur
   * especially when composing via subclassing. The last item is kept to try
   * to preserve the cascade order with the assumption that it's most important
   * that last added styles override previous styles.
   *
   * @nocollapse
   * @category styles
   */
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const n of i)
        t.unshift(nt(n));
    } else e !== void 0 && t.push(nt(e));
    return t;
  }
  /**
   * Returns the property name for the given attribute `name`.
   * @nocollapse
   */
  static __attributeNameForProperty(e, t) {
    const i = t.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this.__instanceProperties = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this.__reflectingProperty = null, this.__initialize();
  }
  /**
   * Internal only override point for customizing work done when elements
   * are constructed.
   */
  __initialize() {
    this.__updatePromise = new Promise((e) => this.enableUpdating = e), this._$changedProperties = /* @__PURE__ */ new Map(), this.__saveInstanceProperties(), this.requestUpdate(), this.constructor._initializers?.forEach((e) => e(this));
  }
  /**
   * Registers a `ReactiveController` to participate in the element's reactive
   * update cycle. The element automatically calls into any registered
   * controllers during its lifecycle callbacks.
   *
   * If the element is connected when `addController()` is called, the
   * controller's `hostConnected()` callback will be immediately called.
   * @category controllers
   */
  addController(e) {
    (this.__controllers ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
  }
  /**
   * Removes a `ReactiveController` from the element.
   * @category controllers
   */
  removeController(e) {
    this.__controllers?.delete(e);
  }
  /**
   * Fixes any properties set on the instance before upgrade time.
   * Otherwise these would shadow the accessor and break these properties.
   * The properties are stored in a Map which is played back after the
   * constructor runs.
   */
  __saveInstanceProperties() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const i of t.keys())
      this.hasOwnProperty(i) && (e.set(i, this[i]), delete this[i]);
    e.size > 0 && (this.__instanceProperties = e);
  }
  /**
   * Returns the node into which the element should render and by default
   * creates and returns an open shadowRoot. Implement to customize where the
   * element's DOM is rendered. For example, to render into the element's
   * childNodes, return `this`.
   *
   * @return Returns a node into which to render.
   * @category rendering
   */
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return $s(e, this.constructor.elementStyles), e;
  }
  /**
   * On first connection, creates the element's renderRoot, sets up
   * element styling, and enables updating.
   * @category lifecycle
   */
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this.__controllers?.forEach((e) => e.hostConnected?.());
  }
  /**
   * Note, this method should be considered final and not overridden. It is
   * overridden on the element instance with a function that triggers the first
   * update.
   * @category updates
   */
  enableUpdating(e) {
  }
  /**
   * Allows for `super.disconnectedCallback()` in extensions while
   * reserving the possibility of making non-breaking feature additions
   * when disconnecting at some point in the future.
   * @category lifecycle
   */
  disconnectedCallback() {
    this.__controllers?.forEach((e) => e.hostDisconnected?.());
  }
  /**
   * Synchronizes property values when attributes change.
   *
   * Specifically, when an attribute is set, the corresponding property is set.
   * You should rarely need to implement this callback. If this method is
   * overridden, `super.attributeChangedCallback(name, _old, value)` must be
   * called.
   *
   * See [responding to attribute changes](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#responding_to_attribute_changes)
   * on MDN for more information about the `attributeChangedCallback`.
   * @category attributes
   */
  attributeChangedCallback(e, t, i) {
    this._$attributeToProperty(e, i);
  }
  __propertyToAttribute(e, t) {
    const n = this.constructor.elementProperties.get(e), r = this.constructor.__attributeNameForProperty(e, n);
    if (r !== void 0 && n.reflect === !0) {
      const c = (n.converter?.toAttribute !== void 0 ? n.converter : Ee).toAttribute(t, n.type);
      this.constructor.enabledWarnings.includes("migration") && c === void 0 && j("undefined-attribute-value", `The attribute value for the ${e} property is undefined on element ${this.localName}. The attribute will be removed, but in the previous version of \`ReactiveElement\`, the attribute would not have changed.`), this.__reflectingProperty = e, c == null ? this.removeAttribute(r) : this.setAttribute(r, c), this.__reflectingProperty = null;
    }
  }
  /** @internal */
  _$attributeToProperty(e, t) {
    const i = this.constructor, n = i.__attributeToPropertyMap.get(e);
    if (n !== void 0 && this.__reflectingProperty !== n) {
      const r = i.getPropertyOptions(n), o = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : Ee;
      this.__reflectingProperty = n;
      const c = o.fromAttribute(t, r.type);
      this[n] = c ?? this.__defaultValues?.get(n) ?? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      c, this.__reflectingProperty = null;
    }
  }
  /**
   * Requests an update which is processed asynchronously. This should be called
   * when an element should update based on some state not triggered by setting
   * a reactive property. In this case, pass no arguments. It should also be
   * called when manually implementing a property setter. In this case, pass the
   * property `name` and `oldValue` to ensure that any configured property
   * options are honored.
   *
   * @param name name of requesting property
   * @param oldValue old value of requesting property
   * @param options property options to use instead of the previously
   *     configured options
   * @param useNewValue if true, the newValue argument is used instead of
   *     reading the property value. This is important to use if the reactive
   *     property is a standard private accessor, as opposed to a plain
   *     property, since private members can't be dynamically read by name.
   * @param newValue the new value of the property. This is only used if
   *     `useNewValue` is true.
   * @category updates
   */
  requestUpdate(e, t, i, n = !1, r) {
    if (e !== void 0) {
      e instanceof Event && j("", "The requestUpdate() method was called with an Event as the property name. This is probably a mistake caused by binding this.requestUpdate as an event listener. Instead bind a function that will call it with no arguments: () => this.requestUpdate()");
      const o = this.constructor;
      if (n === !1 && (r = this[e]), i ??= o.getPropertyOptions(e), (i.hasChanged ?? Ke)(r, t) || // When there is no change, check a corner case that can occur when
      // 1. there's a initial value which was not reflected
      // 2. the property is subsequently set to this value.
      // For example, `prop: {useDefault: true, reflect: true}`
      // and el.prop = 'foo'. This should be considered a change if the
      // attribute is not set because we will now reflect the property to the attribute.
      i.useDefault && i.reflect && r === this.__defaultValues?.get(e) && !this.hasAttribute(o.__attributeNameForProperty(e, i)))
        this._$changeProperty(e, t, i);
      else
        return;
    }
    this.isUpdatePending === !1 && (this.__updatePromise = this.__enqueueUpdate());
  }
  /**
   * @internal
   */
  _$changeProperty(e, t, { useDefault: i, reflect: n, wrapped: r }, o) {
    i && !(this.__defaultValues ??= /* @__PURE__ */ new Map()).has(e) && (this.__defaultValues.set(e, o ?? t ?? this[e]), r !== !0 || o !== void 0) || (this._$changedProperties.has(e) || (!this.hasUpdated && !i && (t = void 0), this._$changedProperties.set(e, t)), n === !0 && this.__reflectingProperty !== e && (this.__reflectingProperties ??= /* @__PURE__ */ new Set()).add(e));
  }
  /**
   * Sets up the element to asynchronously update.
   */
  async __enqueueUpdate() {
    this.isUpdatePending = !0;
    try {
      await this.__updatePromise;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  /**
   * Schedules an element update. You can override this method to change the
   * timing of updates by returning a Promise. The update will await the
   * returned Promise, and you should resolve the Promise to allow the update
   * to proceed. If this method is overridden, `super.scheduleUpdate()`
   * must be called.
   *
   * For instance, to schedule updates to occur just before the next frame:
   *
   * ```ts
   * override protected async scheduleUpdate(): Promise<unknown> {
   *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
   *   super.scheduleUpdate();
   * }
   * ```
   * @category updates
   */
  scheduleUpdate() {
    const e = this.performUpdate();
    return this.constructor.enabledWarnings.includes("async-perform-update") && typeof e?.then == "function" && j("async-perform-update", `Element ${this.localName} returned a Promise from performUpdate(). This behavior is deprecated and will be removed in a future version of ReactiveElement.`), e;
  }
  /**
   * Performs an element update. Note, if an exception is thrown during the
   * update, `firstUpdated` and `updated` will not be called.
   *
   * Call `performUpdate()` to immediately process a pending update. This should
   * generally not be needed, but it can be done in rare cases when you need to
   * update synchronously.
   *
   * @category updates
   */
  performUpdate() {
    if (!this.isUpdatePending)
      return;
    if (ks?.({ kind: "update" }), !this.hasUpdated) {
      this.renderRoot ??= this.createRenderRoot();
      {
        const r = [...this.constructor.elementProperties.keys()].filter((o) => this.hasOwnProperty(o) && o in rt(this));
        if (r.length)
          throw new Error(`The following properties on element ${this.localName} will not trigger updates as expected because they are set using class fields: ${r.join(", ")}. Native class fields and some compiled output will overwrite accessors used for detecting changes. See https://lit.dev/msg/class-field-shadowing for more information.`);
      }
      if (this.__instanceProperties) {
        for (const [n, r] of this.__instanceProperties)
          this[n] = r;
        this.__instanceProperties = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0)
        for (const [n, r] of i) {
          const { wrapped: o } = r, c = this[n];
          o === !0 && !this._$changedProperties.has(n) && c !== void 0 && this._$changeProperty(n, void 0, r, c);
        }
    }
    let e = !1;
    const t = this._$changedProperties;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), this.__controllers?.forEach((i) => i.hostUpdate?.()), this.update(t)) : this.__markUpdated();
    } catch (i) {
      throw e = !1, this.__markUpdated(), i;
    }
    e && this._$didUpdate(t);
  }
  /**
   * Invoked before `update()` to compute values needed during the update.
   *
   * Implement `willUpdate` to compute property values that depend on other
   * properties and are used in the rest of the update process.
   *
   * ```ts
   * willUpdate(changedProperties) {
   *   // only need to check changed properties for an expensive computation.
   *   if (changedProperties.has('firstName') || changedProperties.has('lastName')) {
   *     this.sha = computeSHA(`${this.firstName} ${this.lastName}`);
   *   }
   * }
   *
   * render() {
   *   return html`SHA: ${this.sha}`;
   * }
   * ```
   *
   * @category updates
   */
  willUpdate(e) {
  }
  // Note, this is an override point for polyfill-support.
  // @internal
  _$didUpdate(e) {
    this.__controllers?.forEach((t) => t.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e), this.isUpdatePending && this.constructor.enabledWarnings.includes("change-in-update") && j("change-in-update", `Element ${this.localName} scheduled an update (generally because a property was set) after an update completed, causing a new update to be scheduled. This is inefficient and should be avoided unless the next update can only be scheduled as a side effect of the previous update.`);
  }
  __markUpdated() {
    this._$changedProperties = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  /**
   * Returns a Promise that resolves when the element has completed updating.
   * The Promise value is a boolean that is `true` if the element completed the
   * update without triggering another update. The Promise result is `false` if
   * a property was set inside `updated()`. If the Promise is rejected, an
   * exception was thrown during the update.
   *
   * To await additional asynchronous work, override the `getUpdateComplete`
   * method. For example, it is sometimes useful to await a rendered element
   * before fulfilling this Promise. To do this, first await
   * `super.getUpdateComplete()`, then any subsequent state.
   *
   * @return A promise of a boolean that resolves to true if the update completed
   *     without triggering another update.
   * @category updates
   */
  get updateComplete() {
    return this.getUpdateComplete();
  }
  /**
   * Override point for the `updateComplete` promise.
   *
   * It is not safe to override the `updateComplete` getter directly due to a
   * limitation in TypeScript which means it is not possible to call a
   * superclass getter (e.g. `super.updateComplete.then(...)`) when the target
   * language is ES5 (https://github.com/microsoft/TypeScript/issues/338).
   * This method should be overridden instead. For example:
   *
   * ```ts
   * class MyElement extends LitElement {
   *   override async getUpdateComplete() {
   *     const result = await super.getUpdateComplete();
   *     await this._myChild.updateComplete;
   *     return result;
   *   }
   * }
   * ```
   *
   * @return A promise of a boolean that resolves to true if the update completed
   *     without triggering another update.
   * @category updates
   */
  getUpdateComplete() {
    return this.__updatePromise;
  }
  /**
   * Controls whether or not `update()` should be called when the element requests
   * an update. By default, this method always returns `true`, but this can be
   * customized to control when to update.
   *
   * @param _changedProperties Map of changed properties with old values
   * @category updates
   */
  shouldUpdate(e) {
    return !0;
  }
  /**
   * Updates the element. This method reflects property values to attributes.
   * It can be overridden to render and keep updated element DOM.
   * Setting properties inside this method will *not* trigger
   * another update.
   *
   * @param _changedProperties Map of changed properties with old values
   * @category updates
   */
  update(e) {
    this.__reflectingProperties &&= this.__reflectingProperties.forEach((t) => this.__propertyToAttribute(t, this[t])), this.__markUpdated();
  }
  /**
   * Invoked whenever the element is updated. Implement to perform
   * post-updating tasks via DOM APIs, for example, focusing an element.
   *
   * Setting properties inside this method will trigger the element to update
   * again after this update cycle completes.
   *
   * @param _changedProperties Map of changed properties with old values
   * @category updates
   */
  updated(e) {
  }
  /**
   * Invoked when the element is first updated. Implement to perform one time
   * work on the element after update.
   *
   * ```ts
   * firstUpdated() {
   *   this.renderRoot.getElementById('my-text-area').focus();
   * }
   * ```
   *
   * Setting properties inside this method will trigger the element to update
   * again after this update cycle completes.
   *
   * @param _changedProperties Map of changed properties with old values
   * @category updates
   */
  firstUpdated(e) {
  }
}
H.elementStyles = [];
H.shadowRootOptions = { mode: "open" };
H[se("elementProperties")] = /* @__PURE__ */ new Map();
H[se("finalized")] = /* @__PURE__ */ new Map();
kt?.({ ReactiveElement: H });
{
  H.enabledWarnings = [
    "change-in-update",
    "async-perform-update"
  ];
  const s = function(e) {
    e.hasOwnProperty(se("enabledWarnings")) || (e.enabledWarnings = e.enabledWarnings.slice());
  };
  H.enableWarning = function(e) {
    s(this), this.enabledWarnings.includes(e) || this.enabledWarnings.push(e);
  }, H.disableWarning = function(e) {
    s(this);
    const t = this.enabledWarnings.indexOf(e);
    t >= 0 && this.enabledWarnings.splice(t, 1);
  };
}
(M.reactiveElementVersions ??= []).push("2.1.2");
M.reactiveElementVersions.length > 1 && queueMicrotask(() => {
  j("multiple-versions", "Multiple versions of Lit loaded. Loading multiple versions is not recommended.");
});
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const N = globalThis, g = (s) => {
  N.emitLitDebugLogEvents && N.dispatchEvent(new CustomEvent("lit-debug", {
    detail: s
  }));
};
let Os = 0, de;
N.litIssuedWarnings ??= /* @__PURE__ */ new Set(), de = (s, e) => {
  e += s ? ` See https://lit.dev/msg/${s} for more information.` : "", !N.litIssuedWarnings.has(e) && !N.litIssuedWarnings.has(s) && (console.warn(e), N.litIssuedWarnings.add(e));
}, queueMicrotask(() => {
  de("dev-mode", "Lit is in dev mode. Not recommended for production!");
});
const U = N.ShadyDOM?.inUse && N.ShadyDOM?.noPatch === !0 ? N.ShadyDOM.wrap : (s) => s, Se = N.trustedTypes, lt = Se ? Se.createPolicy("lit-html", {
  createHTML: (s) => s
}) : void 0, Is = (s) => s, Pe = (s, e, t) => Is, As = (s) => {
  if (Q !== Pe)
    throw new Error("Attempted to overwrite existing lit-html security policy. setSanitizeDOMValueFactory should be called at most once.");
  Q = s;
}, Ns = () => {
  Q = Pe;
}, ze = (s, e, t) => Q(s, e, t), Ot = "$lit$", V = `lit$${Math.random().toFixed(9).slice(2)}$`, It = "?" + V, Ms = `<${It}>`, J = document, he = () => J.createComment(""), me = (s) => s === null || typeof s != "object" && typeof s != "function", Ge = Array.isArray, Rs = (s) => Ge(s) || // eslint-disable-next-line @typescript-eslint/no-explicit-any
typeof s?.[Symbol.iterator] == "function", Me = `[ 	
\f\r]`, Us = `[^ 	
\f\r"'\`<>=]`, js = `[^\\s"'>=/]`, ue = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ct = 1, Re = 2, Ls = 3, ut = /-->/g, dt = />/g, K = new RegExp(`>|${Me}(?:(${js}+)(${Me}*=${Me}*(?:${Us}|("|')|))|$)`, "g"), Ds = 0, ht = 1, zs = 2, mt = 3, Ue = /'/g, je = /"/g, At = /^(?:script|style|textarea|title)$/i, Vs = 1, Ve = 2, He = 3, Ye = 1, xe = 2, Hs = 3, Ws = 4, Fs = 5, Je = 6, Bs = 7, qs = (s) => (e, ...t) => (e.some((i) => i === void 0) && console.warn(`Some template strings are undefined.
This is probably caused by illegal octal escape sequences.`), t.some((i) => i?._$litStatic$) && de("", `Static values 'literal' or 'unsafeStatic' cannot be used as values to non-static templates.
Please use the static 'html' tag function. See https://lit.dev/docs/templates/expressions/#static-expressions`), {
  // This property needs to remain unminified.
  _$litType$: s,
  strings: e,
  values: t
}), b = qs(Vs), ne = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), pt = /* @__PURE__ */ new WeakMap(), Y = J.createTreeWalker(
  J,
  129
  /* NodeFilter.SHOW_{ELEMENT|COMMENT} */
);
let Q = Pe;
function Nt(s, e) {
  if (!Ge(s) || !s.hasOwnProperty("raw")) {
    let t = "invalid template strings array";
    throw t = `
          Internal Error: expected template strings to be an array
          with a 'raw' field. Faking a template strings array by
          calling html or svg like an ordinary function is effectively
          the same as calling unsafeHtml and can lead to major security
          issues, e.g. opening your code up to XSS attacks.
          If you're using the html or svg tagged template functions normally
          and still seeing this error, please file a bug at
          https://github.com/lit/lit/issues/new?template=bug_report.md
          and include information about your build tooling, if any.
        `.trim().replace(/\n */g, `
`), new Error(t);
  }
  return lt !== void 0 ? lt.createHTML(e) : e;
}
const Ks = (s, e) => {
  const t = s.length - 1, i = [];
  let n = e === Ve ? "<svg>" : e === He ? "<math>" : "", r, o = ue;
  for (let a = 0; a < t; a++) {
    const l = s[a];
    let h = -1, u, f = 0, y;
    for (; f < l.length && (o.lastIndex = f, y = o.exec(l), y !== null); )
      if (f = o.lastIndex, o === ue) {
        if (y[ct] === "!--")
          o = ut;
        else if (y[ct] !== void 0)
          o = dt;
        else if (y[Re] !== void 0)
          At.test(y[Re]) && (r = new RegExp(`</${y[Re]}`, "g")), o = K;
        else if (y[Ls] !== void 0)
          throw new Error("Bindings in tag names are not supported. Please use static templates instead. See https://lit.dev/docs/templates/expressions/#static-expressions");
      } else o === K ? y[Ds] === ">" ? (o = r ?? ue, h = -1) : y[ht] === void 0 ? h = -2 : (h = o.lastIndex - y[zs].length, u = y[ht], o = y[mt] === void 0 ? K : y[mt] === '"' ? je : Ue) : o === je || o === Ue ? o = K : o === ut || o === dt ? o = ue : (o = K, r = void 0);
    console.assert(h === -1 || o === K || o === Ue || o === je, "unexpected parse state B");
    const $ = o === K && s[a + 1].startsWith("/>") ? " " : "";
    n += o === ue ? l + Ms : h >= 0 ? (i.push(u), l.slice(0, h) + Ot + l.slice(h) + V + $) : l + V + (h === -2 ? a : $);
  }
  const c = n + (s[t] || "<?>") + (e === Ve ? "</svg>" : e === He ? "</math>" : "");
  return [Nt(s, c), i];
};
class pe {
  constructor({ strings: e, ["_$litType$"]: t }, i) {
    this.parts = [];
    let n, r = 0, o = 0;
    const c = e.length - 1, a = this.parts, [l, h] = Ks(e, t);
    if (this.el = pe.createElement(l, i), Y.currentNode = this.el.content, t === Ve || t === He) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (n = Y.nextNode()) !== null && a.length < c; ) {
      if (n.nodeType === 1) {
        {
          const u = n.localName;
          if (/^(?:textarea|template)$/i.test(u) && n.innerHTML.includes(V)) {
            const f = `Expressions are not supported inside \`${u}\` elements. See https://lit.dev/msg/expression-in-${u} for more information.`;
            if (u === "template")
              throw new Error(f);
            de("", f);
          }
        }
        if (n.hasAttributes())
          for (const u of n.getAttributeNames())
            if (u.endsWith(Ot)) {
              const f = h[o++], $ = n.getAttribute(u).split(V), q = /([.?@])?(.*)/.exec(f);
              a.push({
                type: Ye,
                index: r,
                name: q[2],
                strings: $,
                ctor: q[1] === "." ? Ys : q[1] === "?" ? Js : q[1] === "@" ? Qs : Ce
              }), n.removeAttribute(u);
            } else u.startsWith(V) && (a.push({
              type: Je,
              index: r
            }), n.removeAttribute(u));
        if (At.test(n.tagName)) {
          const u = n.textContent.split(V), f = u.length - 1;
          if (f > 0) {
            n.textContent = Se ? Se.emptyScript : "";
            for (let y = 0; y < f; y++)
              n.append(u[y], he()), Y.nextNode(), a.push({ type: xe, index: ++r });
            n.append(u[f], he());
          }
        }
      } else if (n.nodeType === 8)
        if (n.data === It)
          a.push({ type: xe, index: r });
        else {
          let f = -1;
          for (; (f = n.data.indexOf(V, f + 1)) !== -1; )
            a.push({ type: Bs, index: r }), f += V.length - 1;
        }
      r++;
    }
    if (h.length !== o)
      throw new Error('Detected duplicate attribute bindings. This occurs if your template has duplicate attributes on an element tag. For example "<input ?disabled=${true} ?disabled=${false}>" contains a duplicate "disabled" attribute. The error was detected in the following template: \n`' + e.join("${...}") + "`");
    g && g({
      kind: "template prep",
      template: this,
      clonableTemplate: this.el,
      parts: this.parts,
      strings: e
    });
  }
  // Overridden via `litHtmlPolyfillSupport` to provide platform support.
  /** @nocollapse */
  static createElement(e, t) {
    const i = J.createElement("template");
    return i.innerHTML = e, i;
  }
}
function ie(s, e, t = s, i) {
  if (e === ne)
    return e;
  let n = i !== void 0 ? t.__directives?.[i] : t.__directive;
  const r = me(e) ? void 0 : (
    // This property needs to remain unminified.
    e._$litDirective$
  );
  return n?.constructor !== r && (n?._$notifyDirectiveConnectionChanged?.(!1), r === void 0 ? n = void 0 : (n = new r(s), n._$initialize(s, t, i)), i !== void 0 ? (t.__directives ??= [])[i] = n : t.__directive = n), n !== void 0 && (e = ie(s, n._$resolve(s, e.values), n, i)), e;
}
class Gs {
  constructor(e, t) {
    this._$parts = [], this._$disconnectableChildren = void 0, this._$template = e, this._$parent = t;
  }
  // Called by ChildPart parentNode getter
  get parentNode() {
    return this._$parent.parentNode;
  }
  // See comment in Disconnectable interface for why this is a getter
  get _$isConnected() {
    return this._$parent._$isConnected;
  }
  // This method is separate from the constructor because we need to return a
  // DocumentFragment and we don't want to hold onto it with an instance field.
  _clone(e) {
    const { el: { content: t }, parts: i } = this._$template, n = (e?.creationScope ?? J).importNode(t, !0);
    Y.currentNode = n;
    let r = Y.nextNode(), o = 0, c = 0, a = i[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let l;
        a.type === xe ? l = new fe(r, r.nextSibling, this, e) : a.type === Ye ? l = new a.ctor(r, a.name, a.strings, this, e) : a.type === Je && (l = new Xs(r, this, e)), this._$parts.push(l), a = i[++c];
      }
      o !== a?.index && (r = Y.nextNode(), o++);
    }
    return Y.currentNode = J, n;
  }
  _update(e) {
    let t = 0;
    for (const i of this._$parts)
      i !== void 0 && (g && g({
        kind: "set part",
        part: i,
        value: e[t],
        valueIndex: t,
        values: e,
        templateInstance: this
      }), i.strings !== void 0 ? (i._$setValue(e, i, t), t += i.strings.length - 2) : i._$setValue(e[t])), t++;
  }
}
class fe {
  // See comment in Disconnectable interface for why this is a getter
  get _$isConnected() {
    return this._$parent?._$isConnected ?? this.__isConnected;
  }
  constructor(e, t, i, n) {
    this.type = xe, this._$committedValue = d, this._$disconnectableChildren = void 0, this._$startNode = e, this._$endNode = t, this._$parent = i, this.options = n, this.__isConnected = n?.isConnected ?? !0, this._textSanitizer = void 0;
  }
  /**
   * The parent node into which the part renders its content.
   *
   * A ChildPart's content consists of a range of adjacent child nodes of
   * `.parentNode`, possibly bordered by 'marker nodes' (`.startNode` and
   * `.endNode`).
   *
   * - If both `.startNode` and `.endNode` are non-null, then the part's content
   * consists of all siblings between `.startNode` and `.endNode`, exclusively.
   *
   * - If `.startNode` is non-null but `.endNode` is null, then the part's
   * content consists of all siblings following `.startNode`, up to and
   * including the last child of `.parentNode`. If `.endNode` is non-null, then
   * `.startNode` will always be non-null.
   *
   * - If both `.endNode` and `.startNode` are null, then the part's content
   * consists of all child nodes of `.parentNode`.
   */
  get parentNode() {
    let e = U(this._$startNode).parentNode;
    const t = this._$parent;
    return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
  }
  /**
   * The part's leading marker node, if any. See `.parentNode` for more
   * information.
   */
  get startNode() {
    return this._$startNode;
  }
  /**
   * The part's trailing marker node, if any. See `.parentNode` for more
   * information.
   */
  get endNode() {
    return this._$endNode;
  }
  _$setValue(e, t = this) {
    if (this.parentNode === null)
      throw new Error("This `ChildPart` has no `parentNode` and therefore cannot accept a value. This likely means the element containing the part was manipulated in an unsupported way outside of Lit's control such that the part's marker nodes were ejected from DOM. For example, setting the element's `innerHTML` or `textContent` can do this.");
    if (e = ie(this, e, t), me(e))
      e === d || e == null || e === "" ? (this._$committedValue !== d && (g && g({
        kind: "commit nothing to child",
        start: this._$startNode,
        end: this._$endNode,
        parent: this._$parent,
        options: this.options
      }), this._$clear()), this._$committedValue = d) : e !== this._$committedValue && e !== ne && this._commitText(e);
    else if (e._$litType$ !== void 0)
      this._commitTemplateResult(e);
    else if (e.nodeType !== void 0) {
      if (this.options?.host === e) {
        this._commitText("[probable mistake: rendered a template's host in itself (commonly caused by writing ${this} in a template]"), console.warn("Attempted to render the template host", e, "inside itself. This is almost always a mistake, and in dev mode ", "we render some warning text. In production however, we'll ", "render it, which will usually result in an error, and sometimes ", "in the element disappearing from the DOM.");
        return;
      }
      this._commitNode(e);
    } else Rs(e) ? this._commitIterable(e) : this._commitText(e);
  }
  _insert(e) {
    return U(U(this._$startNode).parentNode).insertBefore(e, this._$endNode);
  }
  _commitNode(e) {
    if (this._$committedValue !== e) {
      if (this._$clear(), Q !== Pe) {
        const t = this._$startNode.parentNode?.nodeName;
        if (t === "STYLE" || t === "SCRIPT") {
          let i = "Forbidden";
          throw t === "STYLE" ? i = "Lit does not support binding inside style nodes. This is a security risk, as style injection attacks can exfiltrate data and spoof UIs. Consider instead using css`...` literals to compose styles, and do dynamic styling with css custom properties, ::parts, <slot>s, and by mutating the DOM rather than stylesheets." : i = "Lit does not support binding inside script nodes. This is a security risk, as it could allow arbitrary code execution.", new Error(i);
        }
      }
      g && g({
        kind: "commit node",
        start: this._$startNode,
        parent: this._$parent,
        value: e,
        options: this.options
      }), this._$committedValue = this._insert(e);
    }
  }
  _commitText(e) {
    if (this._$committedValue !== d && me(this._$committedValue)) {
      const t = U(this._$startNode).nextSibling;
      this._textSanitizer === void 0 && (this._textSanitizer = ze(t, "data", "property")), e = this._textSanitizer(e), g && g({
        kind: "commit text",
        node: t,
        value: e,
        options: this.options
      }), t.data = e;
    } else {
      const t = J.createTextNode("");
      this._commitNode(t), this._textSanitizer === void 0 && (this._textSanitizer = ze(t, "data", "property")), e = this._textSanitizer(e), g && g({
        kind: "commit text",
        node: t,
        value: e,
        options: this.options
      }), t.data = e;
    }
    this._$committedValue = e;
  }
  _commitTemplateResult(e) {
    const { values: t, ["_$litType$"]: i } = e, n = typeof i == "number" ? this._$getTemplate(e) : (i.el === void 0 && (i.el = pe.createElement(Nt(i.h, i.h[0]), this.options)), i);
    if (this._$committedValue?._$template === n)
      g && g({
        kind: "template updating",
        template: n,
        instance: this._$committedValue,
        parts: this._$committedValue._$parts,
        options: this.options,
        values: t
      }), this._$committedValue._update(t);
    else {
      const r = new Gs(n, this), o = r._clone(this.options);
      g && g({
        kind: "template instantiated",
        template: n,
        instance: r,
        parts: r._$parts,
        options: this.options,
        fragment: o,
        values: t
      }), r._update(t), g && g({
        kind: "template instantiated and updated",
        template: n,
        instance: r,
        parts: r._$parts,
        options: this.options,
        fragment: o,
        values: t
      }), this._commitNode(o), this._$committedValue = r;
    }
  }
  // Overridden via `litHtmlPolyfillSupport` to provide platform support.
  /** @internal */
  _$getTemplate(e) {
    let t = pt.get(e.strings);
    return t === void 0 && pt.set(e.strings, t = new pe(e)), t;
  }
  _commitIterable(e) {
    Ge(this._$committedValue) || (this._$committedValue = [], this._$clear());
    const t = this._$committedValue;
    let i = 0, n;
    for (const r of e)
      i === t.length ? t.push(n = new fe(this._insert(he()), this._insert(he()), this, this.options)) : n = t[i], n._$setValue(r), i++;
    i < t.length && (this._$clear(n && U(n._$endNode).nextSibling, i), t.length = i);
  }
  /**
   * Removes the nodes contained within this Part from the DOM.
   *
   * @param start Start node to clear from, for clearing a subset of the part's
   *     DOM (used when truncating iterables)
   * @param from  When `start` is specified, the index within the iterable from
   *     which ChildParts are being removed, used for disconnecting directives
   *     in those Parts.
   *
   * @internal
   */
  _$clear(e = U(this._$startNode).nextSibling, t) {
    for (this._$notifyConnectionChanged?.(!1, !0, t); e !== this._$endNode; ) {
      const i = U(e).nextSibling;
      U(e).remove(), e = i;
    }
  }
  /**
   * Implementation of RootPart's `isConnected`. Note that this method
   * should only be called on `RootPart`s (the `ChildPart` returned from a
   * top-level `render()` call). It has no effect on non-root ChildParts.
   * @param isConnected Whether to set
   * @internal
   */
  setConnected(e) {
    if (this._$parent === void 0)
      this.__isConnected = e, this._$notifyConnectionChanged?.(e);
    else
      throw new Error("part.setConnected() may only be called on a RootPart returned from render().");
  }
}
class Ce {
  get tagName() {
    return this.element.tagName;
  }
  // See comment in Disconnectable interface for why this is a getter
  get _$isConnected() {
    return this._$parent._$isConnected;
  }
  constructor(e, t, i, n, r) {
    this.type = Ye, this._$committedValue = d, this._$disconnectableChildren = void 0, this.element = e, this.name = t, this._$parent = n, this.options = r, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$committedValue = new Array(i.length - 1).fill(new String()), this.strings = i) : this._$committedValue = d, this._sanitizer = void 0;
  }
  /**
   * Sets the value of this part by resolving the value from possibly multiple
   * values and static strings and committing it to the DOM.
   * If this part is single-valued, `this._strings` will be undefined, and the
   * method will be called with a single value argument. If this part is
   * multi-value, `this._strings` will be defined, and the method is called
   * with the value array of the part's owning TemplateInstance, and an offset
   * into the value array from which the values should be read.
   * This method is overloaded this way to eliminate short-lived array slices
   * of the template instance values, and allow a fast-path for single-valued
   * parts.
   *
   * @param value The part value, or an array of values for multi-valued parts
   * @param valueIndex the index to start reading values from. `undefined` for
   *   single-valued parts
   * @param noCommit causes the part to not commit its value to the DOM. Used
   *   in hydration to prime attribute parts with their first-rendered value,
   *   but not set the attribute, and in SSR to no-op the DOM operation and
   *   capture the value for serialization.
   *
   * @internal
   */
  _$setValue(e, t = this, i, n) {
    const r = this.strings;
    let o = !1;
    if (r === void 0)
      e = ie(this, e, t, 0), o = !me(e) || e !== this._$committedValue && e !== ne, o && (this._$committedValue = e);
    else {
      const c = e;
      e = r[0];
      let a, l;
      for (a = 0; a < r.length - 1; a++)
        l = ie(this, c[i + a], t, a), l === ne && (l = this._$committedValue[a]), o ||= !me(l) || l !== this._$committedValue[a], l === d ? e = d : e !== d && (e += (l ?? "") + r[a + 1]), this._$committedValue[a] = l;
    }
    o && !n && this._commitValue(e);
  }
  /** @internal */
  _commitValue(e) {
    e === d ? U(this.element).removeAttribute(this.name) : (this._sanitizer === void 0 && (this._sanitizer = Q(this.element, this.name, "attribute")), e = this._sanitizer(e ?? ""), g && g({
      kind: "commit attribute",
      element: this.element,
      name: this.name,
      value: e,
      options: this.options
    }), U(this.element).setAttribute(this.name, e ?? ""));
  }
}
class Ys extends Ce {
  constructor() {
    super(...arguments), this.type = Hs;
  }
  /** @internal */
  _commitValue(e) {
    this._sanitizer === void 0 && (this._sanitizer = Q(this.element, this.name, "property")), e = this._sanitizer(e), g && g({
      kind: "commit property",
      element: this.element,
      name: this.name,
      value: e,
      options: this.options
    }), this.element[this.name] = e === d ? void 0 : e;
  }
}
class Js extends Ce {
  constructor() {
    super(...arguments), this.type = Ws;
  }
  /** @internal */
  _commitValue(e) {
    g && g({
      kind: "commit boolean attribute",
      element: this.element,
      name: this.name,
      value: !!(e && e !== d),
      options: this.options
    }), U(this.element).toggleAttribute(this.name, !!e && e !== d);
  }
}
class Qs extends Ce {
  constructor(e, t, i, n, r) {
    if (super(e, t, i, n, r), this.type = Fs, this.strings !== void 0)
      throw new Error(`A \`<${e.localName}>\` has a \`@${t}=...\` listener with invalid content. Event listeners in templates must have exactly one expression and no surrounding text.`);
  }
  // EventPart does not use the base _$setValue/_resolveValue implementation
  // since the dirty checking is more complex
  /** @internal */
  _$setValue(e, t = this) {
    if (e = ie(this, e, t, 0) ?? d, e === ne)
      return;
    const i = this._$committedValue, n = e === d && i !== d || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, r = e !== d && (i === d || n);
    g && g({
      kind: "commit event listener",
      element: this.element,
      name: this.name,
      value: e,
      options: this.options,
      removeListener: n,
      addListener: r,
      oldListener: i
    }), n && this.element.removeEventListener(this.name, this, i), r && this.element.addEventListener(this.name, this, e), this._$committedValue = e;
  }
  handleEvent(e) {
    typeof this._$committedValue == "function" ? this._$committedValue.call(this.options?.host ?? this.element, e) : this._$committedValue.handleEvent(e);
  }
}
class Xs {
  constructor(e, t, i) {
    this.element = e, this.type = Je, this._$disconnectableChildren = void 0, this._$parent = t, this.options = i;
  }
  // See comment in Disconnectable interface for why this is a getter
  get _$isConnected() {
    return this._$parent._$isConnected;
  }
  _$setValue(e) {
    g && g({
      kind: "commit to element binding",
      element: this.element,
      value: e,
      options: this.options
    }), ie(this, e);
  }
}
const Zs = N.litHtmlPolyfillSupportDevMode;
Zs?.(pe, fe);
(N.litHtmlVersions ??= []).push("3.3.3");
N.litHtmlVersions.length > 1 && queueMicrotask(() => {
  de("multiple-versions", "Multiple versions of Lit loaded. Loading multiple versions is not recommended.");
});
const we = (s, e, t) => {
  if (e == null)
    throw new TypeError(`The container to render into may not be ${e}`);
  const i = Os++, n = t?.renderBefore ?? e;
  let r = n._$litPart$;
  if (g && g({
    kind: "begin render",
    id: i,
    value: s,
    container: e,
    options: t,
    part: r
  }), r === void 0) {
    const o = t?.renderBefore ?? null;
    n._$litPart$ = r = new fe(e.insertBefore(he(), o), o, void 0, t ?? {});
  }
  return r._$setValue(s), g && g({
    kind: "end render",
    id: i,
    value: s,
    container: e,
    options: t,
    part: r
  }), r;
};
we.setSanitizer = As, we.createSanitizer = ze, we._testOnlyClearSanitizerFactoryDoNotCallOrElse = Ns;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const en = (s, e) => s, F = globalThis;
let Mt;
F.litIssuedWarnings ??= /* @__PURE__ */ new Set(), Mt = (s, e) => {
  e += ` See https://lit.dev/msg/${s} for more information.`, !F.litIssuedWarnings.has(e) && !F.litIssuedWarnings.has(s) && (console.warn(e), F.litIssuedWarnings.add(e));
};
class X extends H {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this.__childPart = void 0;
  }
  /**
   * @category rendering
   */
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  /**
   * Updates the element. This method reflects property values to attributes
   * and calls `render` to render DOM via lit-html. Setting properties inside
   * this method will *not* trigger another update.
   * @param changedProperties Map of changed properties with old values
   * @category updates
   */
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this.__childPart = we(t, this.renderRoot, this.renderOptions);
  }
  /**
   * Invoked when the component is added to the document's DOM.
   *
   * In `connectedCallback()` you should setup tasks that should only occur when
   * the element is connected to the document. The most common of these is
   * adding event listeners to nodes external to the element, like a keydown
   * event handler added to the window.
   *
   * ```ts
   * connectedCallback() {
   *   super.connectedCallback();
   *   addEventListener('keydown', this._handleKeydown);
   * }
   * ```
   *
   * Typically, anything done in `connectedCallback()` should be undone when the
   * element is disconnected, in `disconnectedCallback()`.
   *
   * @category lifecycle
   */
  connectedCallback() {
    super.connectedCallback(), this.__childPart?.setConnected(!0);
  }
  /**
   * Invoked when the component is removed from the document's DOM.
   *
   * This callback is the main signal to the element that it may no longer be
   * used. `disconnectedCallback()` should ensure that nothing is holding a
   * reference to the element (such as event listeners added to nodes external
   * to the element), so that it is free to be garbage collected.
   *
   * ```ts
   * disconnectedCallback() {
   *   super.disconnectedCallback();
   *   window.removeEventListener('keydown', this._handleKeydown);
   * }
   * ```
   *
   * An element may be re-connected after being disconnected.
   *
   * @category lifecycle
   */
  disconnectedCallback() {
    super.disconnectedCallback(), this.__childPart?.setConnected(!1);
  }
  /**
   * Invoked on each update to perform rendering tasks. This method may return
   * any value renderable by lit-html's `ChildPart` - typically a
   * `TemplateResult`. Setting properties inside this method will *not* trigger
   * the element to update.
   * @category rendering
   */
  render() {
    return ne;
  }
}
X._$litElement$ = !0;
X[en("finalized")] = !0;
F.litElementHydrateSupport?.({ LitElement: X });
const tn = F.litElementPolyfillSupportDevMode;
tn?.({ LitElement: X });
(F.litElementVersions ??= []).push("4.2.2");
F.litElementVersions.length > 1 && queueMicrotask(() => {
  Mt("multiple-versions", "Multiple versions of Lit loaded. Loading multiple versions is not recommended.");
});
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let Rt;
globalThis.litIssuedWarnings ??= /* @__PURE__ */ new Set(), Rt = (s, e) => {
  e += ` See https://lit.dev/msg/${s} for more information.`, !globalThis.litIssuedWarnings.has(e) && !globalThis.litIssuedWarnings.has(s) && (console.warn(e), globalThis.litIssuedWarnings.add(e));
};
const sn = (s, e, t) => {
  const i = e.hasOwnProperty(t);
  return e.constructor.createProperty(t, s), i ? Object.getOwnPropertyDescriptor(e, t) : void 0;
}, nn = {
  attribute: !0,
  type: String,
  converter: Ee,
  reflect: !1,
  hasChanged: Ke
}, rn = (s = nn, e, t) => {
  const { kind: i, metadata: n } = t;
  n == null && Rt("missing-class-metadata", `The class ${e} is missing decorator metadata. This could mean that you're using a compiler that supports decorators but doesn't support decorator metadata, such as TypeScript 5.1. Please update your compiler.`);
  let r = globalThis.litPropertyMetadata.get(n);
  if (r === void 0 && globalThis.litPropertyMetadata.set(n, r = /* @__PURE__ */ new Map()), i === "setter" && (s = Object.create(s), s.wrapped = !0), r.set(t.name, s), i === "accessor") {
    const { name: o } = t;
    return {
      set(c) {
        const a = e.get.call(this);
        e.set.call(this, c), this.requestUpdate(o, a, s, !0, c);
      },
      init(c) {
        return c !== void 0 && this._$changeProperty(o, void 0, s, c), c;
      }
    };
  } else if (i === "setter") {
    const { name: o } = t;
    return function(c) {
      const a = this[o];
      e.call(this, c), this.requestUpdate(o, a, s, !0, c);
    };
  }
  throw new Error(`Unsupported decorator location: ${i}`);
};
function Te(s) {
  return (e, t) => typeof t == "object" ? rn(s, e, t) : sn(s, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function v(s) {
  return Te({
    ...s,
    // Add both `state` and `attribute` because we found a third party
    // controller that is keying off of PropertyOptions.state to determine
    // whether a field is a private internal property or not.
    state: !0,
    attribute: !1
  });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
globalThis.litIssuedWarnings ??= /* @__PURE__ */ new Set();
const Z = qe`
  :host {
    --tile-color: var(--state-inactive-color, #7b7b7b);
    display: block;
  }

  ha-card {
    height: 100%;
    transition:
      box-shadow 180ms ease-in-out,
      border-color 180ms ease-in-out;
  }

  ha-card:has(ha-tile-container[focused]) {
    --shadow-default: var(--ha-card-box-shadow, 0 0 0 0 transparent);
    --shadow-focus: 0 0 0 1px var(--tile-color);
    border-color: var(--tile-color);
    box-shadow: var(--shadow-default), var(--shadow-focus);
  }

  ha-tile-icon {
    --tile-icon-color: var(--tile-color);
  }

  hui-card-features {
    --feature-color: var(--tile-color);
  }

  /* Тексты и правая колонка стоят в одной строке слота info. */
  .info {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    min-width: 0;
    gap: 6px;
  }

  .info ha-tile-info {
    flex: 1;
    min-width: 0;
  }

  .info.vertical {
    flex-direction: column;
    gap: 0;
  }

  /*
   * Единственное отступление от канона tile: главные значения вынесены в
   * правую колонку крупным шрифтом. Каждое следующее значение опускает шрифт
   * на ступень, иначе колонка съедает имя карточки.
   */
  .values {
    flex: none;
    display: flex;
    align-items: baseline;
    gap: 4px;
    white-space: nowrap;
    color: var(--primary-text-color);
    font-size: var(--ha-font-size-xl, 20px);
    line-height: var(--ha-line-height-condensed, 1.2);
  }

  .values.of-2 {
    font-size: var(--ha-font-size-l, 16px);
  }

  .values.of-3 {
    font-size: var(--ha-font-size-m, 14px);
    gap: 2px;
  }

  /* Иконка называет величину; число остаётся главным, иконка приглушена. */
  .values .clickable,
  .values > span,
  .values > button {
    display: inline-flex;
    align-items: center;
    gap: 3px;
  }

  .value-icon {
    flex: none;
    color: var(--secondary-text-color);
    --mdc-icon-size: 17px;
  }

  .values.of-2 .value-icon {
    --mdc-icon-size: 15px;
  }

  .values.of-3 .value-icon {
    --mdc-icon-size: 14px;
  }

  .values-separator {
    color: var(--secondary-text-color);
  }

  .unit {
    font-size: var(--ha-font-size-s, 12px);
    color: var(--secondary-text-color);
  }

  /*
   * Второе отступление: величины кликабельны по отдельности, тап по каждой
   * открывает more-info её сущности. Содержимое плитки событий не принимает,
   * поэтому цели тапа включают их обратно.
   */
  .clickable {
    padding: 0;
    border: none;
    background: none;
    font: inherit;
    color: inherit;
    letter-spacing: inherit;
    cursor: pointer;
    pointer-events: auto;
  }
  .clickable:hover {
    opacity: 0.7;
  }
  .clickable:focus-visible {
    outline: 2px solid var(--tile-color);
    outline-offset: 2px;
    border-radius: var(--ha-border-radius-sm, 6px);
  }

  /* Своя линия features: те же отступы, что у штатного ряда. */
  .custom-features {
    display: block;
    padding: 0 var(--ha-space-3, 12px) var(--ha-space-3, 12px);
    pointer-events: auto;
  }

  .warning {
    display: block;
    padding: var(--ha-space-3, 12px);
    color: var(--warning-color, #ffa600);
    font-size: var(--ha-font-size-m, 14px);
  }
`, Ut = /* @__PURE__ */ new Set(["unavailable", "unknown"]), on = " · ";
function m(s, e) {
  if (!e) return;
  const t = s?.states[e];
  return {
    entityId: e,
    stateObj: t,
    missing: !t,
    unavailable: !!t && Ut.has(t.state)
  };
}
function an(s, e) {
  if (!(!s || !e || !e.stateObj || e.missing || e.unavailable))
    return s.formatEntityState(e.stateObj);
}
function O(s) {
  return s.filter(
    (e) => !!e && e.text.trim() !== ""
  );
}
function w(s, e) {
  const t = an(s, e);
  return t ? { text: t, entityId: e?.entityId } : void 0;
}
function D(s, e) {
  const t = ln(s, e);
  return t ? { text: t, entityId: e?.entityId } : void 0;
}
function ln(s, e) {
  if (!(!s || !e?.stateObj || !e.unavailable))
    return s.formatEntityState(e.stateObj);
}
function L(s) {
  if (!s?.stateObj) return;
  const e = Number(s.stateObj.state);
  return Number.isFinite(e) ? e : void 0;
}
function Qe(s, e) {
  return s || (e?.stateObj?.attributes.friendly_name ?? e?.entityId ?? "");
}
function cn(s, e) {
  if (!e) return { value: s };
  if (!s.endsWith(e)) return { value: s };
  const t = s.slice(0, s.length - e.length).trimEnd();
  return t ? { value: t, unit: e } : { value: s };
}
const We = "unavailable", un = "unknown", dn = "off", hn = /* @__PURE__ */ new Set(["button", "input_button", "scene"]), mn = /* @__PURE__ */ new Set([
  "alarm_control_panel",
  "alert",
  "automation",
  "binary_sensor",
  "calendar",
  "camera",
  "climate",
  "cover",
  "device_tracker",
  "fan",
  "group",
  "humidifier",
  "input_boolean",
  "lawn_mower",
  "light",
  "lock",
  "media_player",
  "person",
  "plant",
  "remote",
  "schedule",
  "script",
  "siren",
  "sun",
  "switch",
  "timer",
  "update",
  "vacuum",
  "valve",
  "water_heater",
  "weather"
]), ke = (s) => s.substring(0, s.indexOf(".")), pn = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "unknown";
function jt(s, e) {
  const t = ke(s.entity_id), i = s.state;
  if (hn.has(t))
    return i !== We;
  if (i === We || i === un || i === dn && t !== "alert")
    return !1;
  switch (t) {
    case "alarm_control_panel":
      return i !== "disarmed";
    case "alert":
      return i !== "idle";
    case "cover":
    case "valve":
      return i !== "closed";
    case "device_tracker":
    case "person":
      return i !== "not_home";
    case "lawn_mower":
      return !["docked", "paused"].includes(i);
    case "lock":
      return i !== "locked";
    case "media_player":
      return i !== "standby";
    case "vacuum":
      return !["idle", "docked", "paused"].includes(i);
    case "plant":
      return i === "problem";
    case "group":
      return ["on", "home", "open", "locked", "problem"].includes(i);
    case "timer":
      return i === "active";
    case "camera":
      return ["streaming", "recording"].includes(i);
    default:
      return !0;
  }
}
const fn = (s) => s.reduceRight(
  (e, t) => `var(${t}${e ? `, ${e}` : ""})`,
  void 0
), gn = (s) => {
  const e = Number(s);
  if (!isNaN(e))
    return e >= 70 ? "--state-sensor-battery-high-color" : e >= 30 ? "--state-sensor-battery-medium-color" : "--state-sensor-battery-low-color";
};
function _n(s, e) {
  if (!s) return e;
  if (s.state === We)
    return "var(--state-unavailable-color)";
  const t = ke(s.entity_id), i = s.attributes.device_class;
  if (t === "sensor" && i === "battery") {
    const a = gn(s.state);
    if (a) return `var(${a})`;
  }
  if (!mn.has(t))
    return e;
  const n = jt(s), r = pn(s.state), o = n ? "active" : "inactive", c = [];
  return i && c.push(`--state-${t}-${i}-${r}-color`), c.push(
    `--state-${t}-${r}-color`,
    `--state-${t}-${o}-color`,
    `--state-${o}-color`
  ), fn(c);
}
function W(s) {
  if (!s) return "var(--state-inactive-color)";
  const e = _n(s);
  return e || (jt(s) ? "var(--state-icon-color)" : "var(--state-inactive-color)");
}
function G(s) {
  return s !== void 0 && s.action !== "none";
}
const yn = ["closed", "locked", "off"], bn = /* @__PURE__ */ new Set([
  "fan",
  "input_boolean",
  "light",
  "switch",
  "group",
  "automation",
  "humidifier",
  "valve"
]);
function Xe(s) {
  if (!s) return { action: "none" };
  const e = ke(s);
  return { action: bn.has(e) || ["button", "input_button", "scene"].includes(e) ? "toggle" : "none" };
}
const vn = {
  button: { on: "press" },
  camera: { on: "turn_on", off: "turn_off" },
  climate: { on: "turn_on", off: "turn_off" },
  cover: { on: "open_cover", off: "close_cover" },
  input_button: { on: "press" },
  lock: { on: "unlock", off: "lock" },
  media_player: { on: "turn_on", off: "turn_off" },
  scene: { on: "turn_on" },
  siren: { on: "turn_on", off: "turn_off" },
  valve: { on: "open_valve", off: "close_valve" }
};
function wn(s, e) {
  const t = vn[s];
  return t ? (e ? t.on : t.off) ?? t.on : e ? "turn_on" : "turn_off";
}
function $n(s, e) {
  const t = s.states[e];
  if (!t) return;
  const i = ke(e), n = i === "group" ? "homeassistant" : i, r = yn.includes(t.state);
  s.callService(n, wn(i, r), {
    entity_id: e
  });
}
function ft(s, e, t) {
  s.dispatchEvent(
    new CustomEvent(e, { detail: t, bubbles: !0, composed: !0 })
  );
}
function En(s, e) {
  e ? window.history.replaceState(null, "", s) : window.history.pushState(null, "", s), window.dispatchEvent(new CustomEvent("location-changed", { detail: {} }));
}
async function Sn(s, e) {
  if (!e.confirmation) return !0;
  const t = window.loadCardHelpers;
  if (!t) return window.confirm(e.confirmation.text ?? "Подтвердить?");
  const i = await t();
  return i.showConfirmationDialog ? i.showConfirmationDialog(s, {
    text: e.confirmation.text,
    title: e.confirmation.title,
    confirmText: e.confirmation.confirm_text,
    dismissText: e.confirmation.dismiss_text
  }) : window.confirm(e.confirmation.text ?? "Подтвердить?");
}
async function xn(s, e, t, i) {
  let n;
  if (i === "double_tap" ? n = t.double_tap_action : i === "hold" ? n = t.hold_action : n = t.tap_action, n || (n = { action: "more-info" }), !!await Sn(s, n))
    switch (n.action) {
      case "none":
        break;
      case "more-info": {
        const r = n.entity || t.entity;
        r && ft(s, "hass-more-info", { entityId: r });
        break;
      }
      case "toggle": {
        const r = n.entity || t.entity;
        r && $n(e, r);
        break;
      }
      case "navigate":
        n.navigation_path && En(n.navigation_path, n.navigation_replace);
        break;
      case "url":
        n.url_path && window.open(n.url_path, "_blank", "noreferrer");
        break;
      case "perform-action":
      case "call-service": {
        const r = n.perform_action || n.service;
        if (!r) break;
        const [o, c] = r.split(".", 2);
        e.callService(o, c, {
          ...n.data ?? n.service_data ?? {},
          ...n.target ?? {}
        });
        break;
      }
      case "fire-dom-event":
        ft(s, "ll-custom", n);
        break;
      default:
        console.warn(
          `horos-cards: действие "${n.action}" не поддержано`
        );
    }
}
const Lt = 5e3, gt = [
  "ha-tile-container",
  "ha-tile-icon",
  "ha-tile-info",
  "hui-card-features"
];
let ye, be;
function Dt(s, e) {
  return customElements.get(s) ? Promise.resolve(!0) : Promise.race([
    customElements.whenDefined(s).then(() => !0),
    new Promise((t) => setTimeout(() => t(!1), e))
  ]);
}
async function Pn() {
  const s = window.loadCardHelpers;
  if (s)
    try {
      (await s()).createCardElement?.({ type: "tile", entity: "sun.sun" });
    } catch {
    }
}
function zt() {
  return ye || (ye = (async () => gt.every((e) => customElements.get(e)) ? !0 : (await Pn(), (await Promise.all(
    gt.map((e) => Dt(e, Lt))
  )).every(Boolean)))(), ye);
}
function Cn() {
  return be || (be = (async () => {
    if (customElements.get("hui-card-features-editor")) return !0;
    await zt();
    const s = customElements.get("hui-tile-card");
    try {
      await s?.getConfigElement?.();
    } catch {
    }
    return Dt("hui-card-features-editor", Lt);
  })(), be);
}
const Tn = {
  temperature: "mdi:thermometer",
  humidity: "mdi:water-percent",
  moisture: "mdi:water-percent",
  illuminance: "mdi:brightness-5",
  pm25: "mdi:blur",
  power: "mdi:flash",
  energy: "mdi:counter",
  battery: "mdi:battery",
  disk: "mdi:harddisk",
  cpu: "mdi:cpu-64-bit",
  memory: "mdi:memory",
  gpu: "mdi:expansion-card",
  download: "mdi:download",
  upload: "mdi:upload",
  total: "mdi:flash"
}, kn = {
  "entity.missing.one": "Сущность не найдена: {list}",
  "entity.missing.many": "Сущности не найдены: {list}",
  "internals.failed": "Не удалось загрузить компоненты Home Assistant",
  "value.unknown": "нет данных",
  "batteries.title": "Батарейки",
  "batteries.allFull": "Все заряжены, {count} шт.",
  "safety.title": "Безопасность",
  "safety.calm.one": "Всё спокойно, {count} датчик",
  "safety.calm.few": "Всё спокойно, {count} датчика",
  "safety.calm.many": "Всё спокойно, {count} датчиков",
  "safety.offline": "{name}: нет связи",
  "presence.title": "Присутствие",
  "presence.empty.one": "Пусто, {count} зона",
  "presence.empty.few": "Пусто, {count} зоны",
  "presence.empty.many": "Пусто, {count} зон",
  "energy.title": "Энергия",
  "energy.consuming": "{count} потребляют",
  "energy.idle": "Никто не потребляет",
  "offline.count": "{count} без связи",
  "list.missing.one": "{count} не найдена",
  "list.missing.few": "{count} не найдены",
  "list.missing.many": "{count} не найдено",
  "server.title": "Домашний сервер",
  "vacuum.title": "Пылесос",
  "printer.title": "Принтер",
  "computer.title": "Компьютер",
  "person.title": "Человек",
  "air.title": "Воздух",
  "cover.title": "Шторы",
  "level.cpu": "CPU",
  "level.memory": "Память",
  "level.gpu": "GPU",
  "level.disk": "Диск",
  "level.diskFree": "Свободно",
  "level.open": "Открыто"
}, $e = {
  "entity.missing.one": "Entity not found: {list}",
  "entity.missing.many": "Entities not found: {list}",
  "internals.failed": "Could not load Home Assistant components",
  "value.unknown": "no data",
  "batteries.title": "Batteries",
  "batteries.allFull": "All charged, {count} total",
  "safety.title": "Safety",
  "safety.calm.one": "All clear, {count} sensor",
  "safety.calm.many": "All clear, {count} sensors",
  "safety.offline": "{name}: no connection",
  "presence.title": "Presence",
  "presence.empty.one": "Empty, {count} area",
  "presence.empty.many": "Empty, {count} areas",
  "energy.title": "Energy",
  "energy.consuming": "{count} drawing power",
  "energy.idle": "Nothing drawing power",
  "offline.count": "{count} offline",
  "list.missing.one": "{count} not found",
  "list.missing.many": "{count} not found",
  "server.title": "Home server",
  "vacuum.title": "Vacuum",
  "printer.title": "Printer",
  "computer.title": "Computer",
  "person.title": "Person",
  "air.title": "Air",
  "cover.title": "Curtains",
  "level.cpu": "CPU",
  "level.memory": "Memory",
  "level.gpu": "GPU",
  "level.disk": "Disk",
  "level.diskFree": "Free",
  "level.open": "Open"
}, Vt = { ru: kn, en: $e };
function B(s) {
  const t = (s?.language ?? s?.locale?.language ?? "en").split("-")[0].toLowerCase();
  return t in Vt ? t : "en";
}
function On(s, e) {
  if (s !== "ru") return e === 1 ? "one" : "many";
  const t = e % 10, i = e % 100;
  return t === 1 && i !== 11 ? "one" : t >= 2 && t <= 4 && (i < 12 || i > 14) ? "few" : "many";
}
function p(s, e, t = {}) {
  const i = B(s), n = Vt[i] ?? $e, r = t.count, o = typeof r == "number" ? `${e}.${On(i, r)}` : void 0;
  return ((o && (n[o] ?? $e[o])) ?? n[e] ?? $e[e] ?? e).replace(
    /\{(\w+)\}/g,
    (a, l) => l in t ? String(t[l]) : a
  );
}
var In = Object.defineProperty, Ht = (s, e, t, i) => {
  for (var n = void 0, r = s.length - 1, o; r >= 0; r--)
    (o = s[r]) && (n = o(e, t, n) || n);
  return n && In(e, t, n), n;
};
class E extends X {
  constructor() {
    super(...arguments), this._ready = !1, this.base = {};
  }
  static {
    this.styles = [Z];
  }
  /**
   * Сколько места под строкой занимает содержимое: строки уровней, features.
   * Наследник переопределяет, если у него что-то есть.
   */
  contentRows() {
    return 0;
  }
  getCardSize() {
    return 1 + this.contentRows();
  }
  /**
   * Разметка для сеточного дашборда.
   *
   * `rows: "auto"` — потому что высота зависит от содержимого: у принтера пять
   * строк чернил, у климата ни одной. Так же размечают себя штатные карточки с
   * плавающей высотой, entities и heading. Без этого карточка заявляла бы одну
   * строку независимо от того, что в ней.
   */
  getGridOptions() {
    return {
      columns: 6,
      rows: "auto",
      min_columns: this.base.vertical ? 3 : 6,
      min_rows: 1
    };
  }
  connectedCallback() {
    super.connectedCallback(), zt().then((e) => {
      this._ready = e;
    });
  }
  fireMoreInfo(e) {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: e },
        bubbles: !0,
        composed: !0
      })
    );
  }
  // ---- действия --------------------------------------------------------
  _handleAction(e) {
    this._runAction(e.detail.action, !1);
  }
  _handleIconAction(e) {
    e.stopPropagation(), this._runAction(e.detail.action, !0);
  }
  _runAction(e, t) {
    if (!this.hass) return;
    const i = t ? {
      entity: this._entityId,
      tap_action: this.base.icon_tap_action ?? this._defaultIconAction,
      hold_action: this.base.icon_hold_action,
      double_tap_action: this.base.icon_double_tap_action
    } : {
      entity: this._entityId,
      tap_action: this.base.tap_action,
      hold_action: this.base.hold_action,
      double_tap_action: this.base.double_tap_action
    };
    xn(this, this.hass, i, e);
  }
  // ---- отрисовка -------------------------------------------------------
  /** Плашка вместо карточки: конфиг невалиден или сущности нет в HA. */
  renderWarning(e) {
    return b`<ha-card><div class="warning">${e}</div></ha-card>`;
  }
  /** Сообщение о ненайденных сущностях, либо undefined если всё на месте. */
  missingRolesWarning(e) {
    const t = e.filter((i) => !!i && i.missing).map((i) => i.entityId);
    if (t.length)
      return p(
        this.hass,
        t.length === 1 ? "entity.missing.one" : "entity.missing.many",
        { list: t.join(", ") }
      );
  }
  /**
   * Оборачивает величину в собственную цель тапа. Клик не всплывает до
   * подложки, поэтому открывается more-info этой сущности, а не главной.
   *
   * Именно кнопка, а не span с обработчиком: величины — самостоятельные цели,
   * и до них надо доходить табом и нажимать с клавиатуры. Имя сущности идёт в
   * title и aria-label: «63%» само по себе не говорит, чьё оно, — ни глазу при
   * наведении, ни скринридеру.
   */
  renderClickable(e, t) {
    if (!t) return b`<span>${e}</span>`;
    const i = this.hass?.states[t]?.attributes.friendly_name ?? t;
    return b`<button
      class="clickable"
      title=${i}
      aria-label=${i}
      @click=${(n) => {
      n.stopPropagation(), this.fireMoreInfo(t);
    }}
      >${e}</button
    >`;
  }
  renderTile(e) {
    const {
      icon: t,
      color: i,
      primary: n,
      secondary: r,
      mainEntityId: o,
      imageUrl: c,
      defaultIconAction: a,
      values: l,
      ownFeatures: h,
      customFeatures: u
    } = e;
    if (this._entityId = o, this._defaultIconAction = a, !this._ready)
      return this.renderWarning(p(this.hass, "internals.failed"));
    const f = this.base.color ? An(this.base.color) : i ?? "var(--state-inactive-color)", y = this.base.icon_tap_action ?? a, $ = G(y) || G(this.base.icon_hold_action) || G(this.base.icon_double_tap_action), q = this.base.features?.length ? this.base.features : h, Ae = this.base.features_position ?? "bottom";
    return b`
      <ha-card style="--tile-color: ${f};">
        <ha-tile-container
          .featurePosition=${Ae}
          .vertical=${!!this.base.vertical}
          .interactive=${!0}
          .actionHandlerOptions=${{
      hasHold: G(this.base.hold_action),
      hasDoubleClick: G(this.base.double_tap_action)
    }}
          @action=${this._handleAction}
        >
          <ha-tile-icon
            slot="icon"
            class=${c ? "image" : ""}
            .interactive=${$}
            .imageUrl=${c}
            .icon=${this.base.icon ?? t}
            .actionHandlerOptions=${{
      hasHold: G(this.base.icon_hold_action),
      hasDoubleClick: G(this.base.icon_double_tap_action)
    }}
            @action=${this._handleIconAction}
          ></ha-tile-icon>

          <div slot="info" class="info ${this.base.vertical ? "vertical" : ""}">
            <ha-tile-info>
              <span slot="primary">${n}</span>
              ${r?.length && !this.base.hide_state ? b`<span slot="secondary"
                    >${r.map(
      (z, Ne) => b`
                        ${Ne ? b`<span>${on}</span>` : d}${this.renderClickable(
        z.text,
        z.entityId
      )}
                      `
    )}</span
                  >` : d}
            </ha-tile-info>
            ${l?.length ? b`<div class="values of-${l.length}">
                  ${l.map(
      (z, Ne) => b`
                      ${Ne ? b`<span class="values-separator">/</span>` : d}
                      ${this.renderClickable(
        b`${z.icon ? b`<ha-icon
                              class="value-icon"
                              .icon=${z.icon}
                            ></ha-icon>` : d}${z.value}${z.unit ? b`<span class="unit"> ${z.unit}</span>` : d}`,
        z.entityId
      )}
                    `
    )}
                </div>` : d}
          </div>

          ${u ? b`<div slot="features" class="custom-features">
                ${u}
              </div>` : d}
          ${q?.length ? b`<hui-card-features
                slot=${Ae === "inline" ? "features-inline" : "features"}
                .hass=${this.hass}
                .context=${{ entity_id: o }}
                .features=${q}
                .position=${Ae}
              ></hui-card-features>` : d}
        </ha-tile-container>
      </ha-card>
    `;
  }
  /**
   * Значения правой колонки. `icons` называет величину по ключу роли: без неё
   * два процента подряд неотличимы друг от друга.
   */
  bigValues(e, t = Tn) {
    return e.map((i) => {
      const n = this.formatted(i.role?.stateObj);
      return n ? {
        ...n,
        entityId: i.role?.entityId,
        icon: t[i.key]
      } : void 0;
    }).filter((i) => !!i);
  }
  /**
   * Адрес картинки сущности — та же логика, что в _getImageUrl штатной плитки.
   * Камеры с их отдельным адресом по размеру не поддерживаются.
   */
  entityImage(e) {
    if (!this.base.show_entity_picture || !this.hass || !e)
      return;
    const t = e.attributes.entity_picture_local || e.attributes.entity_picture;
    return t ? this.hass.hassUrl(t) : void 0;
  }
  /** Готовое к показу крупное значение. У недоступной сущности его нет. */
  formatted(e) {
    if (!(!this.hass || !e) && !Ut.has(e.state))
      return cn(
        this.hass.formatEntityState(e),
        e.attributes.unit_of_measurement
      );
  }
}
Ht([
  Te({ attribute: !1 })
], E.prototype, "hass");
Ht([
  v()
], E.prototype, "_ready");
function An(s) {
  return /^(#|rgb|hsl|var\()/.test(s) ? s : s === "state" ? "var(--state-icon-color)" : `var(--${s}-color, var(--state-icon-color))`;
}
const _t = 3;
function ee(s, e, t) {
  if (!s || s.length === 0) return [e];
  if (s.length > _t)
    throw new Error(
      `Крупных значений может быть не больше ${_t}, указано ${s.length}`
    );
  const i = s.filter((r) => !t.includes(r));
  if (i.length)
    throw new Error(
      `Неизвестные роли в big_values: ${i.join(", ")}. Допустимы: ${t.join(", ")}`
    );
  const n = s.filter(
    (r, o) => s.indexOf(r) !== o
  );
  if (n.length)
    throw new Error(`Роль указана дважды: ${n.join(", ")}`);
  return s;
}
function te(s, e) {
  const t = e.map((n) => s.find((r) => r.key === n)).filter((n) => !!n), i = s.filter((n) => !e.includes(n.key));
  return { big: t, rest: i };
}
let yt = !1;
function Nn(s) {
  yt || (yt = !0, console.warn(
    `horos-cards: карточка ${s} уже зарегистрирована. Похоже, бандл подключён к дашборду дважды — работает копия, загруженная первой. Проверьте ресурсы дашборда.`
  ));
}
function P(s, e, t) {
  if (customElements.get(s)) {
    Nn(s);
    return;
  }
  customElements.define(s, e), window.customCards = window.customCards ?? [], window.customCards.push(t);
}
function C(s, e) {
  customElements.get(s) || customElements.define(s, e);
}
var Mn = Object.defineProperty, Rn = (s, e, t, i) => {
  for (var n = void 0, r = s.length - 1, o; r >= 0; r--)
    (o = s[r]) && (n = o(e, t, n) || n);
  return n && Mn(e, t, n), n;
};
const bt = [
  "temperature",
  "humidity",
  "illuminance",
  "pm25"
];
class Wt extends E {
  constructor() {
    super(...arguments), this._bigKeys = ["temperature"];
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Ni), document.createElement(
      "horos-climate-tile-editor"
    );
  }
  static getStubConfig() {
    return { temperature: "", humidity: "" };
  }
  setConfig(e) {
    if (!e.temperature)
      throw new Error("Нужно указать сущность температуры (temperature)");
    this._bigKeys = ee(
      e.big_values,
      "temperature",
      bt
    ), this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return d;
    const e = this._config, t = bt.map((c) => ({
      key: c,
      role: m(this.hass, e[c])
    })), i = this.missingRolesWarning(t.map((c) => c.role));
    if (i) return this.renderWarning(i);
    const { big: n, rest: r } = te(t, this._bigKeys), o = t[0].role;
    return this.renderTile({
      icon: "mdi:thermometer",
      color: W(o?.stateObj),
      primary: Qe(e.name, o),
      imageUrl: this.entityImage(o?.stateObj),
      defaultIconAction: Xe(o?.entityId),
      secondary: O([
        D(this.hass, o),
        ...r.map((c) => w(this.hass, c.role))
      ]),
      mainEntityId: o?.entityId,
      values: this.bigValues(n)
    });
  }
}
Rn([
  v()
], Wt.prototype, "_config");
P("horos-climate-tile", Wt, {
  type: "horos-climate-tile",
  name: "Room climate",
  description: "Temperature, humidity, illuminance and PM2.5 of one room in a single tile",
  preview: !0
});
var Un = Object.defineProperty, jn = (s, e, t, i) => {
  for (var n = void 0, r = s.length - 1, o; r >= 0; r--)
    (o = s[r]) && (n = o(e, t, n) || n);
  return n && Un(e, t, n), n;
};
const vt = ["switch", "power", "energy"];
class Ft extends E {
  constructor() {
    super(...arguments), this._bigKeys = ["power"];
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Mi), document.createElement("horos-plug-tile-editor");
  }
  static getStubConfig() {
    return { switch: "", power: "" };
  }
  setConfig(e) {
    if (!e.switch)
      throw new Error("Нужно указать выключатель (switch)");
    this._bigKeys = ee(e.big_values, "power", vt), this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return d;
    const e = this._config, t = vt.map((a) => ({
      key: a,
      role: m(this.hass, e[a])
    })), i = this.missingRolesWarning(t.map((a) => a.role));
    if (i) return this.renderWarning(i);
    const { big: n, rest: r } = te(t, this._bigKeys), o = t[0].role, c = o.entityId;
    return this.renderTile({
      icon: "mdi:power-plug",
      color: W(o.stateObj),
      primary: Qe(e.name, o),
      secondary: O([
        // Одна из двух вернёт кусок: доступный выключатель даёт своё
        // состояние, недоступный — статус недоступности.
        D(this.hass, o),
        ...r.map((a) => w(this.hass, a.role))
      ]),
      mainEntityId: c,
      imageUrl: this.entityImage(o.stateObj),
      defaultIconAction: Xe(c),
      values: this.bigValues(n),
      // Кнопка — штатная feature HA, своей вёрстки для неё больше нет.
      ownFeatures: e.toggle_button ? [{ type: "toggle" }] : void 0
    });
  }
}
jn([
  v()
], Ft.prototype, "_config");
P("horos-plug-tile", Ft, {
  type: "horos-plug-tile",
  name: "Smart plug",
  description: "Switch, current power draw and accumulated energy in a single tile",
  preview: !0
});
const wt = 30, $t = 70;
function Ln(s, e, t) {
  return s === void 0 ? "unknown" : s < e ? "dry" : s > t ? "wet" : "ok";
}
const Dn = {
  dry: "var(--warning-color)",
  ok: "var(--success-color)",
  wet: "var(--info-color)",
  unknown: "var(--state-inactive-color)"
}, zn = {
  dry: "mdi:water-off",
  ok: "mdi:sprout",
  wet: "mdi:water-alert",
  unknown: "mdi:sprout"
};
var Vn = Object.defineProperty, Hn = (s, e, t, i) => {
  for (var n = void 0, r = s.length - 1, o; r >= 0; r--)
    (o = s[r]) && (n = o(e, t, n) || n);
  return n && Vn(e, t, n), n;
};
const Et = ["moisture", "temperature", "battery"];
class Bt extends E {
  constructor() {
    super(...arguments), this._bigKeys = ["moisture"];
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Ri), document.createElement(
      "horos-plant-tile-editor"
    );
  }
  static getStubConfig() {
    return { moisture: "" };
  }
  setConfig(e) {
    if (!e.moisture)
      throw new Error("Нужно указать сущность влажности почвы (moisture)");
    const t = e.dry_below ?? wt, i = e.wet_above ?? $t;
    if (t >= i)
      throw new Error("dry_below должен быть меньше wet_above");
    this._bigKeys = ee(e.big_values, "moisture", Et), this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return d;
    const e = this._config, t = Et.map((l) => ({
      key: l,
      role: m(this.hass, e[l])
    })), i = this.missingRolesWarning(t.map((l) => l.role));
    if (i) return this.renderWarning(i);
    const { big: n, rest: r } = te(t, this._bigKeys), o = t[0].role, c = L(o), a = Ln(
      c,
      e.dry_below ?? wt,
      e.wet_above ?? $t
    );
    return this.renderTile({
      icon: zn[a],
      color: Dn[a],
      primary: Qe(e.name, o),
      imageUrl: this.entityImage(o?.stateObj),
      defaultIconAction: Xe(o?.entityId),
      secondary: O([
        D(this.hass, o),
        ...r.map((l) => w(this.hass, l.role))
      ]),
      mainEntityId: o?.entityId,
      values: this.bigValues(n),
      // Шкала — штатная feature HA, а не своя полоса. Цвет она берёт из
      // --tile-color, то есть из наших порогов сухости.
      ownFeatures: c === void 0 ? void 0 : [{ type: "bar-gauge", min: 0, max: 100 }]
    });
  }
}
Hn([
  v()
], Bt.prototype, "_config");
P("horos-plant-tile", Bt, {
  type: "horos-plant-tile",
  name: "Plant",
  description: "Soil moisture with dryness thresholds, soil temperature and sensor battery",
  preview: !0
});
var Wn = Object.defineProperty, Oe = (s, e, t, i) => {
  for (var n = void 0, r = s.length - 1, o; r >= 0; r--)
    (o = s[r]) && (n = o(e, t, n) || n);
  return n && Wn(e, t, n), n;
};
class ge extends X {
  constructor() {
    super(...arguments), this._children = [];
  }
  static {
    this.styles = qe`
    :host {
      display: block;
    }

    .heading {
      margin-bottom: var(--ha-space-2, 8px);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(var(--columns, 2), minmax(0, 1fr));
      gap: var(--ha-space-2, 8px);
    }

    .warning {
      display: block;
      padding: var(--ha-space-3, 12px);
      color: var(--warning-color, #ffa600);
      font-size: var(--ha-font-size-m, 14px);
    }
  `;
  }
  getCardSize() {
    return 1 + Math.ceil(this._children.length / Math.max(1, this.columns()));
  }
  /** Высота зависит от числа ячеек, поэтому её считает сама HA. */
  getGridOptions() {
    return { columns: 12, rows: "auto", min_columns: 6, min_rows: 2 };
  }
  /** Наследник обязан позвать это в конце setConfig. */
  rebuild() {
    this._build();
  }
  async _build() {
    const e = window.loadCardHelpers;
    if (!e) {
      this._error = "Home Assistant не отдал помощники карточек";
      return;
    }
    const t = await e(), i = this.headingConfig();
    this._heading = i ? t.createCardElement(i) : void 0, this._children = this.childConfigs().map(
      (n) => t.createCardElement(n)
    ), this._passHass();
  }
  _passHass() {
    if (this.hass) {
      this._heading && (this._heading.hass = this.hass);
      for (const e of this._children) e.hass = this.hass;
    }
  }
  updated(e) {
    super.updated(e), e.has("hass") && this._passHass();
  }
  render() {
    return this._error ? b`<ha-card><div class="warning">${this._error}</div></ha-card>` : this._children.length ? b`
      ${this._heading ? b`<div class="heading">${this._heading}</div>` : d}
      <div class="grid" style="--columns: ${this.columns()}">
        ${this._children}
      </div>
    ` : d;
  }
}
Oe([
  Te({ attribute: !1 })
], ge.prototype, "hass");
Oe([
  v()
], ge.prototype, "_heading");
Oe([
  v()
], ge.prototype, "_children");
Oe([
  v()
], ge.prototype, "_error");
function Fn(s) {
  if (!s) return;
  const e = s.split(":").pop();
  return e ? e.trim() : s;
}
function Bn(s) {
  return typeof s == "string" ? { entity: s } : s;
}
var qn = Object.defineProperty, Kn = (s, e, t, i) => {
  for (var n = void 0, r = s.length - 1, o; r >= 0; r--)
    (o = s[r]) && (n = o(e, t, n) || n);
  return n && qn(e, t, n), n;
};
const Gn = 3;
class qt extends ge {
  static async getConfigElement() {
    return await Promise.resolve().then(() => Ui), document.createElement(
      "horos-buttons-tile-editor"
    );
  }
  static getStubConfig() {
    return { buttons: [] };
  }
  setConfig(e) {
    if (!e.buttons?.length)
      throw new Error("Нужно указать хотя бы одну кнопку (buttons)");
    this._config = e, this.rebuild();
  }
  columns() {
    return this._config?.columns ?? Gn;
  }
  headingConfig() {
    if (this._config?.name)
      return {
        type: "heading",
        heading: this._config.name,
        heading_style: "subtitle",
        icon: this._config.icon,
        tap_action: { action: "none" }
      };
  }
  childConfigs() {
    return this._config ? this._config.buttons.map((e) => {
      const t = Bn(e), i = this.hass?.states[t.entity];
      return {
        type: "button",
        entity: t.entity,
        name: t.name ?? Fn(i?.attributes.friendly_name),
        icon: t.icon,
        show_state: !1,
        tap_action: { action: "toggle" }
      };
    }) : [];
  }
}
Kn([
  v()
], qt.prototype, "_config");
P("horos-buttons-tile", qt, {
  type: "horos-buttons-tile",
  name: "Script buttons",
  description: "A grid of buttons running scripts, under one heading",
  preview: !0
});
const oe = qe`
  .levels {
    display: flex;
    flex-direction: column;
    gap: var(--ha-space-1, 4px);
  }

  .level {
    display: flex;
    align-items: center;
    gap: var(--ha-space-2, 8px);
    width: 100%;
    padding: 2px 0;
    border: none;
    background: none;
    font-family: inherit;
    cursor: pointer;
    border-radius: var(--ha-border-radius-sm, 6px);
  }

  .level:focus-visible {
    outline: 2px solid var(--ink);
    outline-offset: 2px;
  }

  /*
   * Доля, а не автоширина: иначе имена разной длины растаскивают полосы, и
   * ряд перестаёт читаться как одна шкала.
   */
  .level .name {
    flex: 0 0 34%;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: var(--ha-font-size-s, 12px);
    color: var(--secondary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .level .name ha-icon {
    flex: none;
    color: var(--error-color, #db4437);
    --mdc-icon-size: 14px;
  }

  /* Полоса как у штатной hui-bar-gauge-card-feature, только тоньше. */
  .level .bar {
    flex: 1 1 auto;
    display: flex;
    height: 8px;
    border-radius: var(--ha-border-radius-pill, 9999px);
    overflow: hidden;
  }

  .level .bar .fill {
    background-color: var(--ink);
    transition: width 400ms ease-in-out;
  }

  .level .bar .rest {
    flex: 1;
    background-color: var(--ink);
    opacity: 0.2;
  }

  .level .value {
    flex: none;
    min-width: 3.2em;
    text-align: end;
    font-size: var(--ha-font-size-s, 12px);
    color: var(--primary-text-color);
    font-variant-numeric: tabular-nums;
  }

  .level.low .value {
    color: var(--error-color, #db4437);
  }

  @media (prefers-reduced-motion: reduce) {
    .level .bar .fill {
      transition: none;
    }
  }
`;
function ae(s, e) {
  return b`
    <div class="levels">
      ${s.map(
    (t) => b`
          <button
            class="level ${t.alarm ? "low" : ""}"
            style="--ink: ${t.ink};"
            title="${t.name}: ${t.text}"
            @click=${(i) => {
      i.stopPropagation(), e(t.entityId);
    }}
          >
            <span class="name">
              ${t.alarm ? b`<ha-icon
                    icon=${t.alarmIcon ?? "mdi:alert-circle"}
                  ></ha-icon>` : d}${t.name}
            </span>
            <span class="bar">
              <span
                class="fill"
                style="width: ${Math.max(0, Math.min(100, t.level))}%"
              ></span>
              <span class="rest"></span>
            </span>
            <span class="value">${t.text}</span>
          </button>
        `
  )}
    </div>
  `;
}
function le(s, e) {
  if (s) {
    if (e && s.startsWith(e)) {
      const t = s.slice(e.length).trim();
      if (t) return t;
    }
    return s;
  }
}
function Kt(s) {
  return s ? s.replace(/[\s—-]*(battery(\s+level)?|заряд)\s*$/i, "").trim() || s : void 0;
}
function _e(s) {
  return s === void 0 ? "var(--state-unavailable-color)" : s >= 70 ? "var(--state-sensor-battery-high-color, #4caf50)" : s >= 30 ? "var(--state-sensor-battery-medium-color, #ffa600)" : "var(--state-sensor-battery-low-color, #db4437)";
}
const Yn = _e;
function Jn(s) {
  return s === void 0 ? "var(--state-unavailable-color)" : s >= 90 ? "var(--error-color, #db4437)" : s >= 80 ? "var(--warning-color, #ffa600)" : "var(--state-icon-color)";
}
function k(s) {
  return typeof s == "string" ? { entity: s } : s;
}
const Qn = [
  [/black|pgbk|_bk(_|$)/i, "black"],
  [/cyan/i, "cyan"],
  [/magenta/i, "purple"],
  [/yellow/i, "yellow"],
  // MC — сервисный бак, а не чернила. Своим оттенком, иначе он
  // неотличим от чёрного: тот красится цветом текста и тоже выходит серым.
  [/_mc(_|$)|maintenance/i, "blue-grey"]
];
function Xn(s) {
  return Qn.find(([t]) => t.test(s))?.[1];
}
function Zn(s) {
  return s === "black" ? "var(--primary-text-color)" : /^(#|rgb|hsl|var\()/.test(s) ? s : `var(--${s}-color, var(--state-icon-color))`;
}
const ei = le, St = (s, e) => typeof s == "number" && Number.isFinite(s) ? s : e;
function ti(s, e, t) {
  const i = Number(s);
  if (!Number.isFinite(i)) return;
  const n = St(e.marker_high_level, 100), r = St(e.marker_low_level, 0), o = String(e.marker_type ?? "").includes("waste"), c = n > 0 ? Math.max(0, Math.min(100, i / n * 100)) : 0, a = o ? i >= n : i <= (t ?? r);
  return { fill: c, alarm: a, fills: o };
}
var si = Object.defineProperty, ni = (s, e, t, i) => {
  for (var n = void 0, r = s.length - 1, o; r >= 0; r--)
    (o = s[r]) && (n = o(e, t, n) || n);
  return n && si(e, t, n), n;
};
class Gt extends E {
  static {
    this.styles = [Z, oe];
  }
  /** Строки уровней под плиткой: примерно две на одну строку сетки. */
  contentRows() {
    return Math.ceil(((this._config?.cartridges.length ?? 0) + (this._config?.sensors?.length ?? 0)) / 2);
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => ji), document.createElement(
      "horos-printer-tile-editor"
    );
  }
  static getStubConfig() {
    return { cartridges: [] };
  }
  setConfig(e) {
    if (!e.cartridges?.length)
      throw new Error("Нужно указать хотя бы один картридж (cartridges)");
    this.base = e, this._config = e;
  }
  get _printerName() {
    return this._config?.name ? this._config.name : (this._config?.status ? this.hass?.states[this._config.status] : void 0)?.attributes.friendly_name;
  }
  _tanks() {
    if (!this._config || !this.hass) return [];
    const e = this._printerName;
    return this._config.cartridges.map((t) => k(t)).map((t) => {
      const i = this.hass.states[t.entity];
      return {
        entityId: t.entity,
        name: t.name ?? ei(i?.attributes.friendly_name, e),
        ink: Zn(
          t.color ?? Xn(t.entity) ?? "grey"
        ),
        marker: i ? ti(
          i.state,
          i.attributes,
          this._config.low_below
        ) : void 0,
        text: i ? this.hass.formatEntityState(i) : "—"
      };
    });
  }
  render() {
    if (!this._config || !this.hass) return d;
    const e = this._tanks(), t = e.filter((a) => !a.marker && a.text === "—");
    if (t.length)
      return this.renderWarning(
        `Сущности не найдены: ${t.map((a) => a.entityId).join(", ")}`
      );
    const n = e.filter((a) => a.marker && !a.marker.fills).reduce(
      (a, l) => !a || l.marker.fill < a.marker.fill ? l : a,
      void 0
    ), r = this._config.status ? m(this.hass, this._config.status) : void 0, o = (this._config.sensors ?? []).map((a) => k(a)).map((a) => m(this.hass, a.entity)), c = r?.stateObj;
    return this.renderTile({
      icon: "mdi:printer",
      color: c ? W(c) : "var(--state-icon-color)",
      primary: this._printerName ?? p(this.hass, "printer.title"),
      secondary: O([
        w(this.hass, r),
        ...o.map((a) => w(this.hass, a))
      ]),
      mainEntityId: this._config.status ?? n?.entityId,
      values: n ? [
        {
          value: String(Math.round(n.marker.fill)),
          unit: "%",
          entityId: n.entityId,
          icon: "mdi:water"
        }
      ] : [],
      customFeatures: ae(
        e.map((a) => ({
          entityId: a.entityId,
          name: a.name ?? a.entityId,
          text: a.text,
          ink: a.ink,
          level: a.marker?.fill ?? 0,
          alarm: a.marker?.alarm ?? !1,
          alarmIcon: a.marker?.fills ? "mdi:delete-alert" : void 0
        })),
        (a) => this.fireMoreInfo(a)
      )
    });
  }
}
ni([
  v()
], Gt.prototype, "_config");
P("horos-printer-tile", Gt, {
  type: "horos-printer-tile",
  name: "Printer",
  description: "Ink levels and printer status in a single tile",
  preview: !0
});
var ii = Object.defineProperty, ri = (s, e, t, i) => {
  for (var n = void 0, r = s.length - 1, o; r >= 0; r--)
    (o = s[r]) && (n = o(e, t, n) || n);
  return n && ii(e, t, n), n;
};
const oi = 20;
class Yt extends E {
  static {
    this.styles = [Z, oe];
  }
  /** Строки уровней под плиткой: примерно две на одну строку сетки. */
  contentRows() {
    return Math.ceil((this._config?.consumables?.length ?? 0) / 2);
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Li), document.createElement(
      "horos-vacuum-tile-editor"
    );
  }
  static getStubConfig() {
    return { vacuum: "" };
  }
  setConfig(e) {
    if (!e.vacuum)
      throw new Error("Нужно указать пылесос (vacuum)");
    this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return d;
    const e = this._config, t = m(this.hass, e.vacuum), i = m(this.hass, e.battery), n = (e.sensors ?? []).map((l) => k(l)).map((l) => m(this.hass, l.entity)), r = this.missingRolesWarning([t, i, ...n]);
    if (r) return this.renderWarning(r);
    const o = t?.stateObj?.attributes.friendly_name, c = e.low_below ?? oi, a = (e.consumables ?? []).map((l) => k(l)).map((l) => {
      const h = m(this.hass, l.entity), u = L(h) ?? 0, f = l.name ?? le(h?.stateObj?.attributes.friendly_name, o);
      return {
        entityId: l.entity,
        name: f ?? l.entity,
        text: `${u}%`,
        // Цветом плитки красить нельзя: у стоящего на базе пылесоса он
        // неактивный, и все колбы выходят одинаково серыми. Красим по
        // уровню — вопрос у расходника тот же, что у батарейки.
        ink: l.color ?? _e(u),
        level: u,
        alarm: u < c
      };
    });
    return this.renderTile({
      icon: "mdi:robot-vacuum",
      color: W(t?.stateObj),
      primary: e.name ?? o ?? p(this.hass, "vacuum.title"),
      mainEntityId: t?.entityId,
      secondary: O([
        D(this.hass, t),
        w(this.hass, t),
        ...n.map((l) => w(this.hass, l))
      ]),
      values: i ? this.bigValues([{ key: "battery", role: i }]) : [],
      customFeatures: a.length ? ae(a, (l) => this.fireMoreInfo(l)) : void 0
    });
  }
}
ri([
  v()
], Yt.prototype, "_config");
P("horos-vacuum-tile", Yt, {
  type: "horos-vacuum-tile",
  name: "Vacuum",
  description: "Robot status, battery and consumable life in a single tile",
  preview: !0
});
var ai = Object.defineProperty, li = (s, e, t, i) => {
  for (var n = void 0, r = s.length - 1, o; r >= 0; r--)
    (o = s[r]) && (n = o(e, t, n) || n);
  return n && ai(e, t, n), n;
};
const ci = 30;
class Jt extends E {
  static async getConfigElement() {
    return await Promise.resolve().then(() => Di), document.createElement(
      "horos-batteries-tile-editor"
    );
  }
  static getStubConfig() {
    return { batteries: [] };
  }
  setConfig(e) {
    if (!e.batteries?.length)
      throw new Error("Нужно указать хотя бы одну батарейку (batteries)");
    this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return d;
    const e = this._config, t = e.low_below ?? ci, i = [], n = [];
    for (const c of e.batteries) {
      const a = k(c), l = m(this.hass, a.entity);
      if (l?.missing) {
        n.push(a.entity);
        continue;
      }
      const h = L(l);
      h !== void 0 && i.push({
        entityId: a.entity,
        name: a.name ?? Kt(l?.stateObj?.attributes.friendly_name) ?? a.entity,
        level: h
      });
    }
    const r = i.filter((c) => c.level < t).sort((c, a) => c.level - a.level), o = r[0];
    return this.renderTile({
      icon: o ? "mdi:battery-alert-variant-outline" : "mdi:battery",
      color: Yn(o?.level),
      primary: e.name ?? p(this.hass, "batteries.title"),
      mainEntityId: o?.entityId,
      secondary: O([
        ...r.length ? r.map((c) => ({
          text: `${c.name} ${c.level}%`,
          entityId: c.entityId
        })) : [
          {
            text: p(this.hass, "batteries.allFull", {
              count: i.length
            })
          }
        ],
        // Пропавшую строку выбрасываем, но молчать о ней нельзя: карточка со
        // списком не должна гаснуть целиком из-за одной переименованной
        // сущности, и не должна делать вид, что её там и не было.
        ...n.length ? [{ text: p(this.hass, "list.missing", { count: n.length }) }] : []
      ]),
      values: o ? [
        {
          value: String(o.level),
          unit: "%",
          entityId: o.entityId,
          icon: "mdi:battery"
        }
      ] : []
    });
  }
}
li([
  v()
], Jt.prototype, "_config");
P("horos-batteries-tile", Jt, {
  type: "horos-batteries-tile",
  name: "Batteries",
  description: "Only the batteries that are running down, emptiest first",
  preview: !0
});
var ui = Object.defineProperty, di = (s, e, t, i) => {
  for (var n = void 0, r = s.length - 1, o; r >= 0; r--)
    (o = s[r]) && (n = o(e, t, n) || n);
  return n && ui(e, t, n), n;
};
class Qt extends E {
  static async getConfigElement() {
    return await Promise.resolve().then(() => zi), document.createElement(
      "horos-safety-tile-editor"
    );
  }
  static getStubConfig() {
    return { sensors: [] };
  }
  setConfig(e) {
    if (!e.sensors?.length)
      throw new Error("Нужно указать хотя бы один датчик (sensors)");
    this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return d;
    const e = this._config, t = [], i = [], n = [];
    let r = 0;
    for (const a of e.sensors) {
      const l = k(a), h = m(this.hass, l.entity);
      if (h?.missing) {
        n.push(l.entity);
        continue;
      }
      r += 1;
      const u = l.name ?? h?.stateObj?.attributes.friendly_name ?? l.entity;
      h?.unavailable ? i.push({ text: p(this.hass, "safety.offline", { name: u }), entityId: l.entity }) : h?.stateObj?.state === "on" && t.push({ text: u, entityId: l.entity });
    }
    const o = t.length > 0, c = [...t, ...i];
    return this.renderTile({
      icon: o ? "mdi:shield-alert" : i.length ? "mdi:shield-off-outline" : "mdi:shield-check",
      color: o ? "var(--error-color, #db4437)" : i.length ? "var(--warning-color, #ffa600)" : "var(--success-color, #43a047)",
      primary: e.name ?? p(this.hass, "safety.title"),
      mainEntityId: c[0]?.entityId,
      secondary: O([
        ...c.length ? c : [{ text: p(this.hass, "safety.calm", { count: r }) }],
        ...n.length ? [{ text: p(this.hass, "list.missing", { count: n.length }) }] : []
      ])
    });
  }
}
di([
  v()
], Qt.prototype, "_config");
P("horos-safety-tile", Qt, {
  type: "horos-safety-tile",
  name: "Safety",
  description: "Leak, smoke, gas — and sensors that lost connection",
  preview: !0
});
var hi = Object.defineProperty, mi = (s, e, t, i) => {
  for (var n = void 0, r = s.length - 1, o; r >= 0; r--)
    (o = s[r]) && (n = o(e, t, n) || n);
  return n && hi(e, t, n), n;
};
const xt = ["disk", "download", "upload"];
class Xt extends E {
  constructor() {
    super(...arguments), this._bigKeys = ["disk"];
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Vi), document.createElement(
      "horos-server-tile-editor"
    );
  }
  static getStubConfig() {
    return { disk: "" };
  }
  setConfig(e) {
    if (!e.disk && !e.download && !e.status)
      throw new Error(
        "Нужна хотя бы одна сущность: status, disk или download"
      );
    this._bigKeys = ee(e.big_values, "disk", xt), this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return d;
    const e = this._config, t = xt.map((a) => ({
      key: a,
      role: m(this.hass, e[a])
    })), i = m(this.hass, e.status), n = (e.services ?? []).map((a) => k(a)).map((a) => m(this.hass, a.entity)), r = this.missingRolesWarning([
      i,
      ...t.map((a) => a.role),
      ...n
    ]);
    if (r) return this.renderWarning(r);
    const { big: o, rest: c } = te(t, this._bigKeys);
    return this.renderTile({
      icon: "mdi:server",
      color: i ? W(i.stateObj) : "var(--state-icon-color)",
      primary: e.name ?? p(this.hass, "server.title"),
      mainEntityId: i?.entityId ?? t[0].role?.entityId,
      secondary: O([
        D(this.hass, i),
        w(this.hass, i),
        ...c.map((a) => {
          const l = w(this.hass, a.role);
          if (!l) return;
          const h = a.key === "download" ? "↓ " : a.key === "upload" ? "↑ " : "";
          return { ...l, text: h + l.text };
        }),
        ...n.map((a) => w(this.hass, a))
      ]),
      values: this.bigValues(o)
    });
  }
}
mi([
  v()
], Xt.prototype, "_config");
P("horos-server-tile", Xt, {
  type: "horos-server-tile",
  name: "Home server",
  description: "Disk, speeds and service status in a single tile",
  preview: !0
});
var pi = Object.defineProperty, fi = (s, e, t, i) => {
  for (var n = void 0, r = s.length - 1, o; r >= 0; r--)
    (o = s[r]) && (n = o(e, t, n) || n);
  return n && pi(e, t, n), n;
};
class Zt extends E {
  static {
    this.styles = [Z, oe];
  }
  /** Строки уровней под плиткой: примерно две на одну строку сетки. */
  contentRows() {
    return Math.ceil((this._config?.devices?.length ?? 0) / 2);
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Hi), document.createElement(
      "horos-person-tile-editor"
    );
  }
  static getStubConfig() {
    return { person: "" };
  }
  setConfig(e) {
    if (!e.person)
      throw new Error("Нужно указать человека (person)");
    this.base = { show_entity_picture: !0, ...e }, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return d;
    const e = this._config, t = m(this.hass, e.person), i = m(this.hass, e.battery), n = m(this.hass, e.location), r = this.missingRolesWarning([t, i, n]);
    if (r) return this.renderWarning(r);
    const o = (e.devices ?? []).map((c) => k(c)).map((c) => {
      const a = m(this.hass, c.entity), l = L(a), h = c.name ?? Kt(
        le(
          a?.stateObj?.attributes.friendly_name,
          e.name
        )
      ) ?? c.entity;
      return {
        entityId: c.entity,
        name: h,
        text: l === void 0 ? p(this.hass, "value.unknown") : `${l}%`,
        ink: c.color ?? _e(l),
        level: l ?? 0,
        alarm: l !== void 0 && l < 20,
        alarmIcon: "mdi:battery-alert-variant-outline"
      };
    });
    return this.renderTile({
      icon: "mdi:account",
      color: W(t?.stateObj),
      primary: e.name ?? t?.stateObj?.attributes.friendly_name ?? p(this.hass, "person.title"),
      mainEntityId: t?.entityId,
      imageUrl: this.entityImage(t?.stateObj),
      secondary: O([
        D(this.hass, t),
        w(this.hass, t),
        w(this.hass, n)
      ]),
      values: i ? this.bigValues([{ key: "battery", role: i }]) : [],
      customFeatures: o.length ? ae(o, (c) => this.fireMoreInfo(c)) : void 0
    });
  }
}
fi([
  v()
], Zt.prototype, "_config");
P("horos-person-tile", Zt, {
  type: "horos-person-tile",
  name: "Person",
  description: "Whether they are home, where exactly, and their devices' battery",
  preview: !0
});
function Le(s, e, t) {
  if (!s || !e?.length) return;
  let i, n;
  for (const r of e) {
    const o = m(s, r), c = L(o);
    c !== void 0 && (n === void 0 || (t === "max" ? c > n : c < n)) && (i = o, n = c);
  }
  return i ?? m(s, e[0]);
}
var gi = Object.defineProperty, _i = (s, e, t, i) => {
  for (var n = void 0, r = s.length - 1, o; r >= 0; r--)
    (o = s[r]) && (n = o(e, t, n) || n);
  return n && gi(e, t, n), n;
};
const yi = [
  "temperature",
  "cpu",
  "memory",
  "gpu",
  "disk"
];
class es extends E {
  constructor() {
    super(...arguments), this._bigKeys = ["temperature"];
  }
  static {
    this.styles = [Z, oe];
  }
  /** Строки уровней под плиткой: примерно две на одну строку сетки. */
  contentRows() {
    return Math.ceil(4 / 2);
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Wi), document.createElement(
      "horos-computer-tile-editor"
    );
  }
  static getStubConfig() {
    return { cpu: "" };
  }
  setConfig(e) {
    if (!e.cpu && !e.memory && !e.temperatures?.length && !e.disks?.length && !e.disks_free?.length)
      throw new Error(
        "Нужна хотя бы одна сущность: cpu, memory, temperatures или disks"
      );
    this._bigKeys = ee(
      e.big_values,
      "temperature",
      yi
    ), this.base = e, this._config = e;
  }
  /** Роли карточки: списки уже сведены к крайнему датчику. */
  _roles() {
    const e = this._config;
    return [
      {
        key: "temperature",
        role: Le(this.hass, e.temperatures, "max")
      },
      { key: "cpu", role: m(this.hass, e.cpu) },
      { key: "memory", role: m(this.hass, e.memory) },
      { key: "gpu", role: m(this.hass, e.gpu) },
      { key: "disk", role: Le(this.hass, e.disks, "max") }
    ];
  }
  /** Раздел с наименьшим запасом свободного места. */
  _freeDisk() {
    return Le(this.hass, this._config?.disks_free, "min");
  }
  _levelRow(e, t) {
    if (!t) return;
    const i = L(t);
    return {
      entityId: t.entityId,
      name: e,
      text: i === void 0 ? p(this.hass, "value.unknown") : `${Math.round(i)}%`,
      ink: Jn(i),
      level: i ?? 0,
      alarm: i !== void 0 && i >= 90,
      alarmIcon: "mdi:alert-circle"
    };
  }
  render() {
    if (!this._config || !this.hass) return d;
    const e = this._config, t = this._roles(), i = m(this.hass, e.status), n = (e.sensors ?? []).map((u) => k(u)).map((u) => m(this.hass, u.entity)), r = this.missingRolesWarning([
      i,
      ...t.map((u) => u.role),
      ...n
    ]);
    if (r) return this.renderWarning(r);
    const o = (e.alerts ?? []).map((u) => k(u)).map((u) => ({ alert: u, role: m(this.hass, u.entity) })).filter(({ role: u }) => u?.stateObj?.state === "on").map(({ alert: u, role: f }) => ({
      text: u.name ?? le(
        f?.stateObj?.attributes.friendly_name,
        e.name
      ) ?? u.entity,
      entityId: u.entity
    })), { big: c } = te(t, this._bigKeys), a = this._freeDisk(), l = L(a), h = [
      this._levelRow(p(this.hass, "level.cpu"), t[1].role),
      this._levelRow(p(this.hass, "level.memory"), t[2].role),
      this._levelRow(p(this.hass, "level.gpu"), t[3].role),
      this._levelRow(p(this.hass, "level.disk"), t[4].role),
      // Свободное место — ресурс, который кончается, поэтому и цвет, и тревога
      // здесь как у батарейки, а не как у загрузки.
      a ? {
        entityId: a.entityId,
        name: p(this.hass, "level.diskFree"),
        text: l === void 0 ? p(this.hass, "value.unknown") : `${Math.round(l)}%`,
        ink: _e(l),
        level: l ?? 0,
        alarm: l !== void 0 && l < 10,
        alarmIcon: "mdi:harddisk"
      } : void 0
    ].filter((u) => !!u);
    return this.renderTile({
      icon: "mdi:desktop-tower-monitor",
      color: i ? W(i.stateObj) : "var(--state-icon-color)",
      primary: e.name ?? p(this.hass, "computer.title"),
      mainEntityId: i?.entityId ?? t[0].role?.entityId ?? a?.entityId,
      secondary: O([
        D(this.hass, i),
        ...o,
        ...n.map((u) => w(this.hass, u)),
        // Загрузка и диски уже показаны полосами со своими подписями.
        ...this._bigKeys.includes("temperature") ? [] : [w(this.hass, t[0].role)]
      ]),
      values: this.bigValues(c),
      customFeatures: h.length ? ae(h, (u) => this.fireMoreInfo(u)) : void 0
    });
  }
}
_i([
  v()
], es.prototype, "_config");
P("horos-computer-tile", es, {
  type: "horos-computer-tile",
  name: "Computer",
  description: "Hottest spot, load and disks in a single tile",
  preview: !0
});
var bi = Object.defineProperty, vi = (s, e, t, i) => {
  for (var n = void 0, r = s.length - 1, o; r >= 0; r--)
    (o = s[r]) && (n = o(e, t, n) || n);
  return n && bi(e, t, n), n;
};
const Pt = ["pm25", "humidity", "temperature", "power"];
class ts extends E {
  constructor() {
    super(...arguments), this._bigKeys = ["pm25"];
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Fi), document.createElement("horos-air-tile-editor");
  }
  static getStubConfig() {
    return { appliance: "" };
  }
  setConfig(e) {
    if (!e.appliance)
      throw new Error("Нужно указать прибор (appliance)");
    this._bigKeys = ee(e.big_values, "pm25", Pt), this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return d;
    const e = this._config, t = m(this.hass, e.appliance), i = Pt.map((l) => {
      const h = m(this.hass, e[l]);
      if (l === "pm25") {
        const u = L(h);
        if (u !== void 0 && u < 0) return { key: l, role: void 0 };
      }
      return { key: l, role: h };
    }), n = (e.sensors ?? []).map((l) => k(l)).map((l) => m(this.hass, l.entity)), r = this.missingRolesWarning([
      t,
      ...i.map((l) => l.role),
      ...n
    ]);
    if (r) return this.renderWarning(r);
    const o = (e.alerts ?? []).map((l) => k(l)).map((l) => ({ alert: l, role: m(this.hass, l.entity) })).filter(({ role: l }) => l?.stateObj?.state === "on").map(({ alert: l, role: h }) => ({
      text: l.name ?? le(
        h?.stateObj?.attributes.friendly_name,
        e.name
      ) ?? l.entity,
      entityId: l.entity
    })), { big: c, rest: a } = te(i, this._bigKeys);
    return this.renderTile({
      icon: e.humidity ? "mdi:air-humidifier" : "mdi:air-filter",
      color: W(t?.stateObj),
      primary: e.name ?? t?.stateObj?.attributes.friendly_name ?? p(this.hass, "air.title"),
      mainEntityId: t?.entityId,
      secondary: O([
        D(this.hass, t),
        ...o,
        w(this.hass, t),
        ...n.map((l) => w(this.hass, l)),
        ...a.map((l) => w(this.hass, l.role))
      ]),
      values: this.bigValues(c)
    });
  }
}
vi([
  v()
], ts.prototype, "_config");
P("horos-air-tile", ts, {
  type: "horos-air-tile",
  name: "Air",
  description: "Purifier, recuperator, humidifier — the appliance and the air",
  preview: !0
});
var wi = Object.defineProperty, $i = (s, e, t, i) => {
  for (var n = void 0, r = s.length - 1, o; r >= 0; r--)
    (o = s[r]) && (n = o(e, t, n) || n);
  return n && wi(e, t, n), n;
};
const Ct = ["illuminance", "battery"], Ei = 1, Si = 2, xi = 4;
class ss extends E {
  constructor() {
    super(...arguments), this._bigKeys = ["illuminance"];
  }
  static {
    this.styles = [Z, oe];
  }
  /** Строки уровней под плиткой: примерно две на одну строку сетки. */
  contentRows() {
    return Math.ceil(2 / 2);
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Bi), document.createElement(
      "horos-cover-tile-editor"
    );
  }
  static getStubConfig() {
    return { cover: "" };
  }
  setConfig(e) {
    if (!e.cover)
      throw new Error("Нужно указать штору (cover)");
    this._bigKeys = ee(e.big_values, "illuminance", Ct), this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return d;
    const e = this._config, t = m(this.hass, e.cover), i = m(this.hass, e.position), n = Ct.map(($) => ({
      key: $,
      role: m(this.hass, e[$])
    })), r = this.missingRolesWarning([
      t,
      i,
      ...n.map(($) => $.role)
    ]);
    if (r) return this.renderWarning(r);
    const { big: o, rest: c } = te(n, this._bigKeys), a = Number(
      t?.stateObj?.attributes.supported_features ?? 0
    ), l = (a & xi) !== 0, h = (a & (Ei | Si)) !== 0, u = [];
    e.controls !== !1 && (l && u.push({ type: "cover-position" }), h && u.push({ type: "cover-open-close" }));
    const f = L(i), y = i && !l ? [
      {
        entityId: i.entityId,
        name: p(this.hass, "level.open"),
        text: f === void 0 ? p(this.hass, "value.unknown") : `${Math.round(f)}%`,
        ink: _e(f),
        level: f ?? 0
      }
    ] : [];
    return this.renderTile({
      icon: "mdi:curtains",
      color: W(t?.stateObj),
      primary: e.name ?? t?.stateObj?.attributes.friendly_name ?? p(this.hass, "cover.title"),
      mainEntityId: t?.entityId,
      secondary: O([
        D(this.hass, t),
        w(this.hass, t),
        ...c.map(($) => w(this.hass, $.role))
      ]),
      values: this.bigValues(o),
      ownFeatures: u.length ? u : void 0,
      customFeatures: y.length ? ae(y, ($) => this.fireMoreInfo($)) : void 0
    });
  }
}
$i([
  v()
], ss.prototype, "_config");
P("horos-cover-tile", ss, {
  type: "horos-cover-tile",
  name: "Curtains",
  description: "How far open, how bright outside, and battery",
  preview: !0
});
var Pi = Object.defineProperty, Ci = (s, e, t, i) => {
  for (var n = void 0, r = s.length - 1, o; r >= 0; r--)
    (o = s[r]) && (n = o(e, t, n) || n);
  return n && Pi(e, t, n), n;
};
const Ti = 5;
class ns extends E {
  static {
    this.styles = [Z, oe];
  }
  /** Строки уровней под плиткой: примерно две на одну строку сетки. */
  contentRows() {
    return Math.ceil(Math.min(this._config?.consumers.length ?? 0, this._config?.limit ?? 5) / 2);
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => qi), document.createElement(
      "horos-energy-tile-editor"
    );
  }
  static getStubConfig() {
    return { consumers: [] };
  }
  setConfig(e) {
    if (!e.consumers?.length)
      throw new Error("Нужно указать хотя бы одного потребителя (consumers)");
    this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return d;
    const e = this._config, t = m(this.hass, e.total), i = [], n = [], r = [];
    for (const h of e.consumers) {
      const u = k(h), f = m(this.hass, u.entity);
      if (f?.missing) {
        i.push(u.entity);
        continue;
      }
      const y = u.name ?? le(f?.stateObj?.attributes.friendly_name, e.name) ?? u.entity;
      if (f?.unavailable) {
        n.push(y);
        continue;
      }
      const $ = L(f);
      $ === void 0 || $ <= 0 || r.push({
        watts: $,
        row: {
          entityId: u.entity,
          name: y,
          text: this.hass.formatEntityState(f.stateObj),
          ink: u.color ?? "var(--amber-color, #ffc107)"
        }
      });
    }
    r.sort((h, u) => u.watts - h.watts);
    const o = r.slice(0, e.limit ?? Ti), c = o[0]?.watts ?? 0, a = o.map(({ row: h, watts: u }) => ({
      ...h,
      level: c > 0 ? u / c * 100 : 0
    })), l = [
      D(this.hass, t),
      r.length ? { text: p(this.hass, "energy.consuming", { count: r.length }) } : { text: p(this.hass, "energy.idle") },
      n.length ? { text: p(this.hass, "offline.count", { count: n.length }) } : void 0,
      i.length ? { text: p(this.hass, "list.missing", { count: i.length }) } : void 0
    ];
    return this.renderTile({
      icon: "mdi:flash",
      color: "var(--amber-color, #ffc107)",
      primary: e.name ?? p(this.hass, "energy.title"),
      mainEntityId: t?.entityId ?? o[0]?.row.entityId,
      secondary: O([w(this.hass, t), ...l]),
      values: t ? this.bigValues([{ key: "total", role: t }]) : [],
      customFeatures: a.length ? ae(a, (h) => this.fireMoreInfo(h)) : void 0
    });
  }
}
Ci([
  v()
], ns.prototype, "_config");
P("horos-energy-tile", ns, {
  type: "horos-energy-tile",
  name: "Energy",
  description: "Who in the house draws power, hungriest first",
  preview: !0
});
var ki = Object.defineProperty, Oi = (s, e, t, i) => {
  for (var n = void 0, r = s.length - 1, o; r >= 0; r--)
    (o = s[r]) && (n = o(e, t, n) || n);
  return n && ki(e, t, n), n;
};
class is extends E {
  static async getConfigElement() {
    return await Promise.resolve().then(() => Ki), document.createElement(
      "horos-presence-tile-editor"
    );
  }
  static getStubConfig() {
    return { areas: [] };
  }
  setConfig(e) {
    if (!e.areas?.length)
      throw new Error("Нужно указать хотя бы одну зону (areas)");
    this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return d;
    const e = this._config, t = [], i = [];
    let n = 0, r = 0;
    for (const o of e.areas) {
      const c = k(o), a = m(this.hass, c.entity);
      if (a?.missing) {
        i.push(c.entity);
        continue;
      }
      if (r += 1, a?.unavailable) {
        n += 1;
        continue;
      }
      a?.stateObj?.state === "on" && t.push({
        text: c.name ?? a.stateObj.attributes.friendly_name ?? c.entity,
        entityId: c.entity
      });
    }
    return this.renderTile({
      icon: t.length ? "mdi:home-account" : "mdi:home-outline",
      color: t.length ? "var(--state-icon-color)" : "var(--state-inactive-color)",
      primary: e.name ?? p(this.hass, "presence.title"),
      mainEntityId: t[0]?.entityId,
      secondary: O([
        ...t.length ? t : [{ text: p(this.hass, "presence.empty", { count: r }) }],
        n ? { text: p(this.hass, "offline.count", { count: n }) } : void 0,
        i.length ? { text: p(this.hass, "list.missing", { count: i.length }) } : void 0
      ]),
      values: [
        {
          value: String(t.length),
          entityId: t[0]?.entityId,
          icon: "mdi:home-account"
        }
      ]
    });
  }
}
Oi([
  v()
], is.prototype, "_config");
P("horos-presence-tile", is, {
  type: "horos-presence-tile",
  name: "Presence",
  description: "Which areas have someone in them right now",
  preview: !0
});
console.info(
  "%c HOROS-CARDS %c 0.1.0 ",
  "background:#03a9f4;color:#fff;border-radius:3px 0 0 3px;padding:2px 4px",
  "background:#555;color:#fff;border-radius:0 3px 3px 0;padding:2px 4px"
);
var Ii = Object.defineProperty, Ze = (s, e, t, i) => {
  for (var n = void 0, r = s.length - 1, o; r >= 0; r--)
    (o = s[r]) && (n = o(e, t, n) || n);
  return n && Ii(e, t, n), n;
};
class T extends X {
  constructor() {
    super(...arguments), this._computeHelper = (e) => e.name === "color" ? this.pick({
      ru: {
        color: "Неактивное состояние (например, off или closed) окрашено не будет."
      },
      en: {
        color: "Inactive state (for example, off or closed) will not be coloured."
      }
    }).color : void 0, this._computeLabel = (e) => this.labels[e.name] ?? this.pick({ ru: I, en: A })[e.name] ?? e.name;
  }
  setConfig(e) {
    this._config = e;
  }
  /** Что показать форме. По умолчанию — сам конфиг. */
  get formData() {
    return this._config ?? {};
  }
  /** Что положить в конфиг из формы. */
  fromForm(e) {
    return e;
  }
  /**
   * Подписи на языке пользователя. Держим их парой прямо у карточки, а не в
   * общем словаре: одно и то же поле в разных карточках называется по-разному —
   * «Заряд», «Заряд датчика», «Заряд основного устройства».
   */
  pick(e) {
    return B(this.hass) === "ru" ? e.ru : e.en;
  }
  fireConfigChanged(e) {
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: e },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _valueChanged(e) {
    e.stopPropagation(), this.fireConfigChanged(
      this.fromForm(e.detail.value)
    );
  }
  renderForm() {
    return !this.hass || !this._config ? d : b`
      <ha-form
        .hass=${this.hass}
        .data=${this.formData}
        .schema=${this.schema}
        .computeLabel=${this._computeLabel}
        .computeHelper=${this._computeHelper}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }
  render() {
    return this.renderForm();
  }
}
Ze([
  Te({ attribute: !1 })
], T.prototype, "hass");
Ze([
  v()
], T.prototype, "_config");
class Ie extends T {
  constructor() {
    super(...arguments), this._featuresEditorReady = !1;
  }
  connectedCallback() {
    super.connectedCallback(), Cn().then((e) => {
      this._featuresEditorReady = e;
    });
  }
  /**
   * Форма показывает раскладку картинками (content_layout), а в конфиге лежит
   * булево vertical — ровно как в редакторе штатной плитки.
   */
  get formData() {
    const { vertical: e, ...t } = this._config ?? {};
    return {
      ...t,
      content_layout: e ? "vertical" : "horizontal"
    };
  }
  _featuresChanged(e) {
    e.stopPropagation(), this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: {
          config: { ...this._config, features: e.detail.features }
        },
        bubbles: !0,
        composed: !0
      })
    );
  }
  fromForm(e) {
    const { content_layout: t, ...i } = e, n = { ...i };
    return t === "vertical" && (n.vertical = !0), n;
  }
  /** Раздел features повторяет разметку редактора штатной плитки. */
  _renderFeatures() {
    const e = this._config?.features ?? [], t = this.pick({ ru: I, en: A }), i = this.pick({
      ru: { bottom: "Снизу", inline: "В строке" },
      en: { bottom: "Bottom", inline: "Inline" }
    });
    return b`
      <ha-expansion-panel outlined>
        <ha-icon slot="leading-icon" icon="mdi:list-box"></ha-icon>
        <h3 slot="header">${t.features}</h3>
        <div class="content">
          <hui-card-features-editor
            .hass=${this.hass}
            .context=${{ entity_id: this._config?.[this.entityField] }}
            .features=${e}
            @features-changed=${this._featuresChanged}
          ></hui-card-features-editor>
          ${e.length ? b`
                <ha-form
                  .hass=${this.hass}
                  .data=${this._config}
                  .schema=${[
      {
        name: "features_position",
        required: !0,
        selector: {
          select: {
            mode: "box",
            options: [
              { value: "bottom", label: i.bottom },
              { value: "inline", label: i.inline }
            ]
          }
        }
      }
    ]}
                  .computeLabel=${this._computeLabel}
                  @value-changed=${this._valueChanged}
                ></ha-form>
              ` : d}
        </div>
      </ha-expansion-panel>
    `;
  }
  render() {
    return !this.hass || !this._config ? d : b`
      ${this.renderForm()}
      ${this._featuresEditorReady ? this._renderFeatures() : d}
    `;
  }
}
Ze([
  v()
], Ie.prototype, "_featuresEditorReady");
const et = (s, e, t = []) => ({
  name: "content",
  type: "expandable",
  flatten: !0,
  icon: "mdi:text-short",
  schema: [
    {
      name: "name",
      selector: { entity_name: {} },
      context: { entity: s }
    },
    {
      name: "",
      type: "grid",
      schema: [
        {
          name: "icon",
          selector: { icon: {} },
          context: { icon_entity: s }
        },
        {
          name: "color",
          // include_state обязателен: без него значение "state" считается
          // недопустимым и поле подсвечивается как ошибочное.
          selector: { ui_color: { default_color: "state", include_state: !0 } }
        },
        { name: "show_entity_picture", selector: { boolean: {} } },
        { name: "hide_state", selector: { boolean: {} } }
      ]
    },
    {
      name: "content_layout",
      required: !0,
      selector: {
        select: {
          mode: "box",
          options: [
            {
              value: "horizontal",
              label: e === "ru" ? "Горизонтальная" : "Horizontal",
              image: {
                src: "/static/images/form/tile_content_layout_horizontal.svg",
                src_dark: "/static/images/form/tile_content_layout_horizontal_dark.svg",
                flip_rtl: !0
              }
            },
            {
              value: "vertical",
              label: e === "ru" ? "Вертикальная" : "Vertical",
              image: {
                src: "/static/images/form/tile_content_layout_vertical.svg",
                src_dark: "/static/images/form/tile_content_layout_vertical_dark.svg",
                flip_rtl: !0
              }
            }
          ]
        }
      }
    },
    ...t
  ]
}), De = (s) => ({
  entity_id: s,
  area_id: "area"
}), tt = (s, e) => ({
  name: "interactions",
  type: "expandable",
  flatten: !0,
  icon: "mdi:gesture-tap",
  schema: [
    {
      name: "tap_action",
      selector: { ui_action: { default_action: "more-info" } },
      context: De(s)
    },
    { name: "", type: "divider" },
    {
      name: "icon_tap_action",
      selector: { ui_action: { default_action: e } },
      context: De(s)
    },
    {
      name: "",
      type: "optional_actions",
      flatten: !0,
      schema: [
        "hold_action",
        "icon_hold_action",
        "double_tap_action",
        "icon_double_tap_action"
      ].map((t) => ({
        name: t,
        selector: { ui_action: { default_action: "none" } },
        context: De(s)
      }))
    }
  ]
}), I = {
  content: "Содержимое",
  interactions: "Взаимодействия",
  icon: "Иконка",
  color: "Цвет",
  content_layout: "Раскладка",
  show_entity_picture: "Показывать картинку сущности",
  hide_state: "Скрыть состояние",
  features: "Features",
  features_position: "Расположение features",
  tap_action: "Тап по карточке",
  hold_action: "Долгое нажатие на карточку",
  double_tap_action: "Двойной тап по карточке",
  icon_tap_action: "Тап по иконке",
  icon_hold_action: "Долгое нажатие на иконку",
  icon_double_tap_action: "Двойной тап по иконке"
}, A = {
  content: "Content",
  interactions: "Interactions",
  icon: "Icon",
  color: "Colour",
  content_layout: "Layout",
  show_entity_picture: "Show entity picture",
  hide_state: "Hide state",
  features: "Features",
  features_position: "Features position",
  tap_action: "Tap on card",
  hold_action: "Hold on card",
  double_tap_action: "Double tap on card",
  icon_tap_action: "Tap on icon",
  icon_hold_action: "Hold on icon",
  icon_double_tap_action: "Double tap on icon"
}, _ = (s, e) => ({
  entity: {
    filter: e ? { domain: s, device_class: e } : { domain: s }
  }
}), re = (s, e, t) => ({
  number: { min: s, max: e, mode: "box", unit_of_measurement: t }
}), R = { text: {} }, ce = (s) => ({
  select: { multiple: !0, mode: "list", options: s }
}), Ai = { boolean: {} };
class rs extends Ie {
  get entityField() {
    return "temperature";
  }
  get schema() {
    const e = B(this.hass);
    return [
      {
        name: "temperature",
        required: !0,
        selector: _("sensor", "temperature")
      },
      { name: "humidity", selector: _("sensor", "humidity") },
      {
        name: "illuminance",
        selector: _("sensor", "illuminance")
      },
      { name: "pm25", selector: _("sensor", "pm25") },
      et("temperature", e, [
        {
          name: "big_values",
          selector: ce([
            { value: "temperature", label: e === "ru" ? "Температура" : "Temperature" },
            { value: "humidity", label: e === "ru" ? "Влажность" : "Humidity" },
            { value: "illuminance", label: e === "ru" ? "Освещённость" : "Illuminance" },
            { value: "pm25", label: "PM2.5" }
          ])
        }
      ]),
      tt("temperature", "none")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        name: "Название",
        temperature: "Температура",
        humidity: "Влажность",
        illuminance: "Освещённость",
        pm25: "PM2.5",
        big_values: "Крупно справа (не больше двух)"
      },
      en: {
        name: "Name",
        temperature: "Temperature",
        humidity: "Humidity",
        illuminance: "Illuminance",
        pm25: "PM2.5",
        big_values: "Large on the right (up to two)"
      }
    });
  }
}
C("horos-climate-tile-editor", rs);
const Ni = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosClimateTileEditor: rs
}, Symbol.toStringTag, { value: "Module" }));
class os extends Ie {
  get entityField() {
    return "switch";
  }
  get schema() {
    const e = B(this.hass);
    return [
      { name: "switch", required: !0, selector: _("switch") },
      { name: "power", selector: _("sensor", "power") },
      { name: "energy", selector: _("sensor", "energy") },
      { name: "toggle_button", selector: Ai },
      et("switch", e, [
        {
          name: "big_values",
          selector: ce([
            { value: "power", label: e === "ru" ? "Мощность" : "Power" },
            { value: "energy", label: e === "ru" ? "Энергия" : "Energy" },
            { value: "switch", label: e === "ru" ? "Состояние" : "State" }
          ])
        }
      ]),
      tt("switch", "toggle")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        name: "Название",
        switch: "Выключатель",
        power: "Мощность",
        energy: "Энергия",
        big_values: "Крупно справа (не больше двух)",
        toggle_button: "Кнопка переключения под строкой"
      },
      en: {
        name: "Name",
        switch: "Switch",
        power: "Power",
        energy: "Energy",
        big_values: "Large on the right (up to two)",
        toggle_button: "Toggle button below the row"
      }
    });
  }
}
C("horos-plug-tile-editor", os);
const Mi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosPlugTileEditor: os
}, Symbol.toStringTag, { value: "Module" }));
class as extends Ie {
  get entityField() {
    return "moisture";
  }
  get schema() {
    const e = B(this.hass);
    return [
      {
        name: "moisture",
        required: !0,
        selector: _("sensor", "moisture")
      },
      {
        name: "temperature",
        selector: _("sensor", "temperature")
      },
      { name: "battery", selector: _("sensor", "battery") },
      { name: "dry_below", selector: re(0, 100, "%") },
      { name: "wet_above", selector: re(0, 100, "%") },
      et("moisture", e, [
        {
          name: "big_values",
          selector: ce([
            { value: "moisture", label: e === "ru" ? "Влажность почвы" : "Soil moisture" },
            { value: "temperature", label: e === "ru" ? "Температура почвы" : "Soil temperature" },
            { value: "battery", label: e === "ru" ? "Заряд датчика" : "Sensor battery" }
          ])
        }
      ]),
      tt("moisture", "none")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        name: "Название",
        moisture: "Влажность почвы",
        temperature: "Температура почвы",
        battery: "Заряд датчика",
        dry_below: "Ниже этого — сухо",
        wet_above: "Выше этого — залито",
        big_values: "Крупно справа (не больше двух)"
      },
      en: {
        name: "Name",
        moisture: "Soil moisture",
        temperature: "Soil temperature",
        battery: "Sensor battery",
        dry_below: "Dry below",
        wet_above: "Wet above",
        big_values: "Large on the right (up to two)"
      }
    });
  }
}
C("horos-plant-tile-editor", as);
const Ri = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosPlantTileEditor: as
}, Symbol.toStringTag, { value: "Module" }));
function S(s, e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of s ?? [])
    t.set(typeof i == "string" ? i : i.entity, i);
  return e.map((i) => t.get(i) ?? i);
}
function x(s) {
  return (s ?? []).map(
    (e) => typeof e == "string" ? e : e.entity
  );
}
class ls extends T {
  get schema() {
    return [
      { name: "name", selector: R },
      { name: "icon", selector: { icon: {} } },
      { name: "columns", selector: re(1, 6) },
      {
        name: "buttons",
        required: !0,
        selector: {
          entity: {
            multiple: !0,
            filter: [
              { domain: "script" },
              { domain: "scene" },
              { domain: "button" },
              { domain: "input_button" },
              { domain: "switch" }
            ]
          }
        }
      }
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...I,
        name: "Заголовок",
        columns: "Кнопок в ряд",
        buttons: "Кнопки"
      },
      en: {
        ...A,
        name: "Heading",
        columns: "Buttons per row",
        buttons: "Buttons"
      }
    });
  }
  get formData() {
    const e = this._config ?? {};
    return {
      ...e,
      buttons: x(e.buttons)
    };
  }
  fromForm(e) {
    return {
      ...e,
      buttons: S(
        this._config?.buttons,
        e.buttons ?? []
      )
    };
  }
}
C("horos-buttons-tile-editor", ls);
const Ui = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosButtonsTileEditor: ls
}, Symbol.toStringTag, { value: "Module" }));
class cs extends T {
  get schema() {
    return [
      { name: "name", selector: R },
      { name: "icon", selector: { icon: {} } },
      { name: "status", selector: _("sensor") },
      {
        name: "cartridges",
        required: !0,
        selector: { entity: { multiple: !0, filter: [{ domain: "sensor" }] } }
      },
      {
        name: "low_below",
        selector: { number: { min: 0, max: 100, mode: "box", unit_of_measurement: "%" } }
      },
      {
        name: "sensors",
        selector: { entity: { multiple: !0 } }
      }
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...I,
        name: "Название принтера",
        status: "Состояние принтера",
        cartridges: "Картриджи",
        low_below: "Мало чернил ниже",
        sensors: "Прочее про принтер"
      },
      en: {
        ...A,
        name: "Printer name",
        status: "Printer status",
        cartridges: "Cartridges",
        low_below: "Low ink below",
        sensors: "Other printer sensors"
      }
    });
  }
  get formData() {
    const e = this._config ?? {};
    return {
      ...e,
      cartridges: x(
        e.cartridges
      ),
      sensors: x(e.sensors)
    };
  }
  fromForm(e) {
    return {
      ...e,
      cartridges: S(
        this._config?.cartridges,
        e.cartridges ?? []
      ),
      sensors: S(
        this._config?.sensors,
        e.sensors ?? []
      )
    };
  }
}
C("horos-printer-tile-editor", cs);
const ji = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosPrinterTileEditor: cs
}, Symbol.toStringTag, { value: "Module" }));
class us extends T {
  get schema() {
    return [
      { name: "name", selector: R },
      { name: "vacuum", required: !0, selector: _("vacuum") },
      { name: "battery", selector: _("sensor", "battery") },
      { name: "sensors", selector: { entity: { multiple: !0 } } },
      { name: "consumables", selector: { entity: { multiple: !0 } } },
      { name: "low_below", selector: re(0, 100, "%") }
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...I,
        name: "Название",
        vacuum: "Пылесос",
        battery: "Заряд",
        sensors: "Что ещё сказать",
        consumables: "Расходники",
        low_below: "Просит замены ниже"
      },
      en: {
        ...A,
        name: "Name",
        vacuum: "Vacuum",
        battery: "Battery",
        sensors: "What else to show",
        consumables: "Consumables",
        low_below: "Needs replacing below"
      }
    });
  }
  get formData() {
    const e = this._config ?? {};
    return {
      ...e,
      sensors: x(e.sensors),
      consumables: x(e.consumables)
    };
  }
  fromForm(e) {
    return {
      ...e,
      sensors: S(
        this._config?.sensors,
        e.sensors ?? []
      ),
      consumables: S(
        this._config?.consumables,
        e.consumables ?? []
      )
    };
  }
}
C("horos-vacuum-tile-editor", us);
const Li = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosVacuumTileEditor: us
}, Symbol.toStringTag, { value: "Module" }));
class ds extends T {
  get schema() {
    return [
      { name: "name", selector: R },
      {
        name: "batteries",
        required: !0,
        selector: {
          entity: {
            multiple: !0,
            filter: [{ domain: "sensor", device_class: "battery" }]
          }
        }
      },
      { name: "low_below", selector: re(0, 100, "%") }
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...I,
        name: "Название",
        batteries: "Батарейки",
        low_below: "Показывать ниже"
      },
      en: {
        ...A,
        name: "Name",
        batteries: "Batteries",
        low_below: "Show below"
      }
    });
  }
  get formData() {
    const e = this._config ?? {};
    return {
      ...e,
      batteries: x(e.batteries)
    };
  }
  fromForm(e) {
    return {
      ...e,
      batteries: S(
        this._config?.batteries,
        e.batteries ?? []
      )
    };
  }
}
C("horos-batteries-tile-editor", ds);
const Di = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosBatteriesTileEditor: ds
}, Symbol.toStringTag, { value: "Module" }));
class hs extends T {
  get schema() {
    return [
      { name: "name", selector: R },
      {
        name: "sensors",
        required: !0,
        selector: { entity: { multiple: !0, filter: [{ domain: "binary_sensor" }] } }
      }
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...I,
        name: "Название",
        sensors: "Датчики"
      },
      en: {
        ...A,
        name: "Name",
        sensors: "Sensors"
      }
    });
  }
  get formData() {
    const e = this._config ?? {};
    return {
      ...e,
      sensors: x(e.sensors)
    };
  }
  fromForm(e) {
    return {
      ...e,
      sensors: S(
        this._config?.sensors,
        e.sensors ?? []
      )
    };
  }
}
C("horos-safety-tile-editor", hs);
const zi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosSafetyTileEditor: hs
}, Symbol.toStringTag, { value: "Module" }));
class ms extends T {
  get schema() {
    return [
      { name: "name", selector: R },
      { name: "status", selector: { entity: {} } },
      { name: "disk", selector: _("sensor", "data_size") },
      { name: "download", selector: _("sensor", "data_rate") },
      { name: "upload", selector: _("sensor", "data_rate") },
      { name: "services", selector: { entity: { multiple: !0 } } }
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...I,
        name: "Название",
        status: "Состояние",
        disk: "Свободное место",
        download: "Скорость приёма",
        upload: "Скорость отдачи",
        services: "Что ещё сказать"
      },
      en: {
        ...A,
        name: "Name",
        status: "Status",
        disk: "Free space",
        download: "Download speed",
        upload: "Upload speed",
        services: "What else to show"
      }
    });
  }
  get formData() {
    const e = this._config ?? {};
    return {
      ...e,
      services: x(e.services)
    };
  }
  fromForm(e) {
    return {
      ...e,
      services: S(
        this._config?.services,
        e.services ?? []
      )
    };
  }
}
C("horos-server-tile-editor", ms);
const Vi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosServerTileEditor: ms
}, Symbol.toStringTag, { value: "Module" }));
class ps extends T {
  get schema() {
    return [
      { name: "name", selector: R },
      {
        name: "person",
        required: !0,
        selector: {
          entity: {
            filter: [{ domain: "person" }, { domain: "device_tracker" }]
          }
        }
      },
      { name: "battery", selector: _("sensor", "battery") },
      { name: "location", selector: _("sensor") },
      {
        name: "devices",
        selector: {
          entity: {
            multiple: !0,
            filter: [{ domain: "sensor", device_class: "battery" }]
          }
        }
      }
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...I,
        name: "Имя",
        person: "Человек",
        battery: "Заряд основного устройства",
        location: "Где именно",
        devices: "Остальные устройства"
      },
      en: {
        ...A,
        name: "Name",
        person: "Person",
        battery: "Main device battery",
        location: "Location",
        devices: "Other devices"
      }
    });
  }
  get formData() {
    const e = this._config ?? {};
    return {
      ...e,
      devices: x(e.devices)
    };
  }
  fromForm(e) {
    return {
      ...e,
      devices: S(
        this._config?.devices,
        e.devices ?? []
      )
    };
  }
}
C("horos-person-tile-editor", ps);
const Hi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosPersonTileEditor: ps
}, Symbol.toStringTag, { value: "Module" }));
class fs extends T {
  get schema() {
    const e = B(this.hass);
    return [
      { name: "name", selector: R },
      { name: "status", selector: { entity: {} } },
      { name: "cpu", selector: _("sensor") },
      { name: "memory", selector: _("sensor") },
      { name: "gpu", selector: _("sensor") },
      {
        name: "temperatures",
        selector: {
          entity: {
            multiple: !0,
            filter: [{ domain: "sensor", device_class: "temperature" }]
          }
        }
      },
      { name: "disks", selector: { entity: { multiple: !0 } } },
      { name: "disks_free", selector: { entity: { multiple: !0 } } },
      { name: "sensors", selector: { entity: { multiple: !0 } } },
      {
        name: "alerts",
        selector: { entity: { multiple: !0, filter: [{ domain: "binary_sensor" }] } }
      },
      {
        name: "big_values",
        selector: ce([
          { value: "temperature", label: e === "ru" ? "Самая горячая точка" : "Hottest spot" },
          { value: "cpu", label: e === "ru" ? "Процессор" : "CPU" },
          { value: "memory", label: e === "ru" ? "Память" : "Memory" },
          { value: "gpu", label: e === "ru" ? "Видеокарта" : "GPU" },
          { value: "disk", label: e === "ru" ? "Самый полный диск" : "Fullest disk" }
        ])
      }
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...I,
        name: "Название",
        status: "Состояние",
        cpu: "Процессор",
        memory: "Память",
        gpu: "Видеокарта",
        temperatures: "Датчики температуры",
        disks: "Разделы диска (занято)",
        disks_free: "Разделы диска (свободно)",
        sensors: "Что ещё сказать",
        alerts: "Сообщать, когда сработало",
        big_values: "Крупно справа (не больше трёх)"
      },
      en: {
        ...A,
        name: "Name",
        status: "Status",
        cpu: "CPU",
        memory: "Memory",
        gpu: "GPU",
        temperatures: "Temperature sensors",
        disks: "Disks (used)",
        disks_free: "Disks (free)",
        sensors: "What else to show",
        alerts: "Report only when triggered",
        big_values: "Large on the right (up to three)"
      }
    });
  }
  get formData() {
    const e = this._config ?? {};
    return {
      ...e,
      sensors: x(e.sensors),
      alerts: x(e.alerts)
    };
  }
  fromForm(e) {
    return {
      ...e,
      sensors: S(
        this._config?.sensors,
        e.sensors ?? []
      ),
      alerts: S(
        this._config?.alerts,
        e.alerts ?? []
      )
    };
  }
}
C("horos-computer-tile-editor", fs);
const Wi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosComputerTileEditor: fs
}, Symbol.toStringTag, { value: "Module" }));
class gs extends T {
  get schema() {
    const e = B(this.hass);
    return [
      { name: "name", selector: R },
      {
        name: "appliance",
        required: !0,
        selector: {
          entity: {
            filter: [
              { domain: "fan" },
              { domain: "humidifier" },
              { domain: "switch" }
            ]
          }
        }
      },
      { name: "pm25", selector: _("sensor", "pm25") },
      { name: "humidity", selector: _("sensor", "humidity") },
      { name: "temperature", selector: _("sensor", "temperature") },
      { name: "power", selector: _("sensor", "power") },
      { name: "sensors", selector: { entity: { multiple: !0 } } },
      {
        name: "alerts",
        selector: { entity: { multiple: !0, filter: [{ domain: "binary_sensor" }] } }
      },
      {
        name: "big_values",
        selector: ce([
          { value: "pm25", label: "PM2.5" },
          { value: "humidity", label: e === "ru" ? "Влажность" : "Humidity" },
          { value: "temperature", label: e === "ru" ? "Температура" : "Temperature" },
          { value: "power", label: e === "ru" ? "Мощность" : "Power" }
        ])
      }
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...I,
        name: "Название",
        appliance: "Прибор",
        pm25: "PM2.5",
        humidity: "Влажность",
        temperature: "Температура",
        power: "Мощность",
        sensors: "Что ещё сказать",
        alerts: "Сообщать, когда сработало",
        big_values: "Крупно справа (не больше трёх)"
      },
      en: {
        ...A,
        name: "Name",
        appliance: "Appliance",
        pm25: "PM2.5",
        humidity: "Humidity",
        temperature: "Temperature",
        power: "Power",
        sensors: "What else to show",
        alerts: "Report only when triggered",
        big_values: "Large on the right (up to three)"
      }
    });
  }
  get formData() {
    const e = this._config ?? {};
    return {
      ...e,
      sensors: x(e.sensors),
      alerts: x(e.alerts)
    };
  }
  fromForm(e) {
    return {
      ...e,
      sensors: S(
        this._config?.sensors,
        e.sensors ?? []
      ),
      alerts: S(
        this._config?.alerts,
        e.alerts ?? []
      )
    };
  }
}
C("horos-air-tile-editor", gs);
const Fi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosAirTileEditor: gs
}, Symbol.toStringTag, { value: "Module" }));
class _s extends T {
  get schema() {
    const e = B(this.hass);
    return [
      { name: "name", selector: R },
      { name: "cover", required: !0, selector: _("cover") },
      { name: "position", selector: _("sensor") },
      { name: "illuminance", selector: _("sensor", "illuminance") },
      { name: "battery", selector: _("sensor", "battery") },
      { name: "controls", selector: { boolean: {} } },
      {
        name: "big_values",
        selector: ce([
          { value: "illuminance", label: e === "ru" ? "Освещённость" : "Illuminance" },
          { value: "battery", label: e === "ru" ? "Заряд" : "Battery" }
        ])
      }
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...I,
        name: "Название",
        cover: "Штора",
        position: "Насколько открыто",
        illuminance: "Освещённость",
        battery: "Заряд",
        controls: "Кнопки управления",
        big_values: "Крупно справа (не больше трёх)"
      },
      en: {
        ...A,
        name: "Name",
        cover: "Cover",
        position: "Position",
        illuminance: "Illuminance",
        battery: "Battery",
        controls: "Controls",
        big_values: "Large on the right (up to three)"
      }
    });
  }
}
C("horos-cover-tile-editor", _s);
const Bi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosCoverTileEditor: _s
}, Symbol.toStringTag, { value: "Module" }));
class ys extends T {
  get schema() {
    return [
      { name: "name", selector: R },
      { name: "total", selector: _("sensor", "power") },
      {
        name: "consumers",
        required: !0,
        selector: {
          entity: {
            multiple: !0,
            filter: [{ domain: "sensor", device_class: "power" }]
          }
        }
      },
      { name: "limit", selector: re(1, 12) }
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...I,
        name: "Название",
        total: "Общая мощность",
        consumers: "Потребители",
        limit: "Сколько показывать"
      },
      en: {
        ...A,
        name: "Name",
        total: "Total power",
        consumers: "Consumers",
        limit: "How many to show"
      }
    });
  }
  get formData() {
    const e = this._config ?? {};
    return {
      ...e,
      consumers: x(e.consumers)
    };
  }
  fromForm(e) {
    return {
      ...e,
      consumers: S(
        this._config?.consumers,
        e.consumers ?? []
      )
    };
  }
}
C("horos-energy-tile-editor", ys);
const qi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosEnergyTileEditor: ys
}, Symbol.toStringTag, { value: "Module" }));
class bs extends T {
  get schema() {
    return [
      { name: "name", selector: R },
      {
        name: "areas",
        required: !0,
        selector: {
          entity: {
            multiple: !0,
            filter: [
              { domain: "binary_sensor", device_class: "occupancy" },
              { domain: "binary_sensor", device_class: "presence" },
              { domain: "binary_sensor", device_class: "motion" }
            ]
          }
        }
      }
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...I,
        name: "Название",
        areas: "Зоны"
      },
      en: {
        ...A,
        name: "Name",
        areas: "Areas"
      }
    });
  }
  get formData() {
    const e = this._config ?? {};
    return {
      ...e,
      areas: x(e.areas)
    };
  }
  fromForm(e) {
    return {
      ...e,
      areas: S(
        this._config?.areas,
        e.areas ?? []
      )
    };
  }
}
C("horos-presence-tile-editor", bs);
const Ki = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosPresenceTileEditor: bs
}, Symbol.toStringTag, { value: "Module" }));
