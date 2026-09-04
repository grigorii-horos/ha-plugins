/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _e = globalThis, ft = _e.ShadowRoot && (_e.ShadyCSS === void 0 || _e.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, _t = Symbol(), St = /* @__PURE__ */ new WeakMap();
class Xt {
  constructor(e, s, n) {
    if (this._$cssResult$ = !0, n !== _t)
      throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this._strings = s;
  }
  // This is a getter so that it's lazy. In practice, this means stylesheets
  // are not created until the first element instance is made.
  get styleSheet() {
    let e = this._styleSheet;
    const s = this._strings;
    if (ft && e === void 0) {
      const n = s !== void 0 && s.length === 1;
      n && (e = St.get(s)), e === void 0 && ((this._styleSheet = e = new CSSStyleSheet()).replaceSync(this.cssText), n && St.set(s, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
}
const Ss = (t) => {
  if (t._$cssResult$ === !0)
    return t.cssText;
  if (typeof t == "number")
    return t;
  throw new Error(`Value passed to 'css' function must be a 'css' function result: ${t}. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`);
}, xs = (t) => new Xt(typeof t == "string" ? t : String(t), void 0, _t), gt = (t, ...e) => {
  const s = t.length === 1 ? t[0] : e.reduce((n, r, i) => n + Ss(r) + t[i + 1], t[0]);
  return new Xt(s, t, _t);
}, Ts = (t, e) => {
  if (ft)
    t.adoptedStyleSheets = e.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else
    for (const s of e) {
      const n = document.createElement("style"), r = _e.litNonce;
      r !== void 0 && n.setAttribute("nonce", r), n.textContent = s.cssText, t.appendChild(n);
    }
}, Is = (t) => {
  let e = "";
  for (const s of t.cssRules)
    e += s.cssText;
  return xs(e);
}, xt = ft ? (t) => t : (t) => t instanceof CSSStyleSheet ? Is(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ds, defineProperty: As, getOwnPropertyDescriptor: Tt, getOwnPropertyNames: js, getOwnPropertySymbols: Ms, getPrototypeOf: It } = Object, I = globalThis;
let j;
const Dt = I.trustedTypes, Rs = Dt ? Dt.emptyScript : "", Zt = I.reactiveElementPolyfillSupportDevMode;
I.litIssuedWarnings ??= /* @__PURE__ */ new Set(), j = (t, e) => {
  e += ` See https://lit.dev/msg/${t} for more information.`, !I.litIssuedWarnings.has(e) && !I.litIssuedWarnings.has(t) && (console.warn(e), I.litIssuedWarnings.add(e));
}, queueMicrotask(() => {
  j("dev-mode", "Lit is in dev mode. Not recommended for production!"), I.ShadyDOM?.inUse && Zt === void 0 && j("polyfill-support-missing", "Shadow DOM is being polyfilled via `ShadyDOM` but the `polyfill-support` module has not been loaded.");
});
const Ns = (t) => {
  I.emitLitDebugLogEvents && I.dispatchEvent(new CustomEvent("lit-debug", {
    detail: t
  }));
}, X = (t, e) => t, ye = {
  toAttribute(t, e) {
    switch (e) {
      case Boolean:
        t = t ? Rs : null;
        break;
      case Object:
      case Array:
        t = t == null ? t : JSON.stringify(t);
        break;
    }
    return t;
  },
  fromAttribute(t, e) {
    let s = t;
    switch (e) {
      case Boolean:
        s = t !== null;
        break;
      case Number:
        s = t === null ? null : Number(t);
        break;
      case Object:
      case Array:
        try {
          s = JSON.parse(t);
        } catch {
          s = null;
        }
        break;
    }
    return s;
  }
}, yt = (t, e) => !Ds(t, e), At = {
  attribute: !0,
  type: String,
  converter: ye,
  reflect: !1,
  useDefault: !1,
  hasChanged: yt
};
Symbol.metadata ??= Symbol("metadata");
I.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
class U extends HTMLElement {
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
  static createProperty(e, s = At) {
    if (s.state && (s.attribute = !1), this.__prepare(), this.prototype.hasOwnProperty(e) && (s = Object.create(s), s.wrapped = !0), this.elementProperties.set(e, s), !s.noAccessor) {
      const n = (
        // Use Symbol.for in dev mode to make it easier to maintain state
        // when doing HMR.
        Symbol.for(`${String(e)} (@property() cache)`)
      ), r = this.getPropertyDescriptor(e, n, s);
      r !== void 0 && As(this.prototype, e, r);
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
  static getPropertyDescriptor(e, s, n) {
    const { get: r, set: i } = Tt(this.prototype, e) ?? {
      get() {
        return this[s];
      },
      set(o) {
        this[s] = o;
      }
    };
    if (r == null) {
      if ("value" in (Tt(this.prototype, e) ?? {}))
        throw new Error(`Field ${JSON.stringify(String(e))} on ${this.name} was declared as a reactive property but it's actually declared as a value on the prototype. Usually this is due to using @property or @state on a method.`);
      j("reactive-property-without-getter", `Field ${JSON.stringify(String(e))} on ${this.name} was declared as a reactive property but it does not have a getter. This will be an error in a future version of Lit.`);
    }
    return {
      get: r,
      set(o) {
        const a = r?.call(this);
        i?.call(this, o), this.requestUpdate(e, a, n);
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
    return this.elementProperties.get(e) ?? At;
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
    if (this.hasOwnProperty(X("elementProperties")))
      return;
    const e = It(this);
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
    if (this.hasOwnProperty(X("finalized")))
      return;
    if (this.finalized = !0, this.__prepare(), this.hasOwnProperty(X("properties"))) {
      const s = this.properties, n = [
        ...js(s),
        ...Ms(s)
      ];
      for (const r of n)
        this.createProperty(r, s[r]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const s = litPropertyMetadata.get(e);
      if (s !== void 0)
        for (const [n, r] of s)
          this.elementProperties.set(n, r);
    }
    this.__attributeToPropertyMap = /* @__PURE__ */ new Map();
    for (const [s, n] of this.elementProperties) {
      const r = this.__attributeNameForProperty(s, n);
      r !== void 0 && this.__attributeToPropertyMap.set(r, s);
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
    const s = [];
    if (Array.isArray(e)) {
      const n = new Set(e.flat(1 / 0).reverse());
      for (const r of n)
        s.unshift(xt(r));
    } else e !== void 0 && s.push(xt(e));
    return s;
  }
  /**
   * Returns the property name for the given attribute `name`.
   * @nocollapse
   */
  static __attributeNameForProperty(e, s) {
    const n = s.attribute;
    return n === !1 ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
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
    const e = /* @__PURE__ */ new Map(), s = this.constructor.elementProperties;
    for (const n of s.keys())
      this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
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
    return Ts(e, this.constructor.elementStyles), e;
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
  attributeChangedCallback(e, s, n) {
    this._$attributeToProperty(e, n);
  }
  __propertyToAttribute(e, s) {
    const r = this.constructor.elementProperties.get(e), i = this.constructor.__attributeNameForProperty(e, r);
    if (i !== void 0 && r.reflect === !0) {
      const a = (r.converter?.toAttribute !== void 0 ? r.converter : ye).toAttribute(s, r.type);
      this.constructor.enabledWarnings.includes("migration") && a === void 0 && j("undefined-attribute-value", `The attribute value for the ${e} property is undefined on element ${this.localName}. The attribute will be removed, but in the previous version of \`ReactiveElement\`, the attribute would not have changed.`), this.__reflectingProperty = e, a == null ? this.removeAttribute(i) : this.setAttribute(i, a), this.__reflectingProperty = null;
    }
  }
  /** @internal */
  _$attributeToProperty(e, s) {
    const n = this.constructor, r = n.__attributeToPropertyMap.get(e);
    if (r !== void 0 && this.__reflectingProperty !== r) {
      const i = n.getPropertyOptions(r), o = typeof i.converter == "function" ? { fromAttribute: i.converter } : i.converter?.fromAttribute !== void 0 ? i.converter : ye;
      this.__reflectingProperty = r;
      const a = o.fromAttribute(s, i.type);
      this[r] = a ?? this.__defaultValues?.get(r) ?? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      a, this.__reflectingProperty = null;
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
  requestUpdate(e, s, n, r = !1, i) {
    if (e !== void 0) {
      e instanceof Event && j("", "The requestUpdate() method was called with an Event as the property name. This is probably a mistake caused by binding this.requestUpdate as an event listener. Instead bind a function that will call it with no arguments: () => this.requestUpdate()");
      const o = this.constructor;
      if (r === !1 && (i = this[e]), n ??= o.getPropertyOptions(e), (n.hasChanged ?? yt)(i, s) || // When there is no change, check a corner case that can occur when
      // 1. there's a initial value which was not reflected
      // 2. the property is subsequently set to this value.
      // For example, `prop: {useDefault: true, reflect: true}`
      // and el.prop = 'foo'. This should be considered a change if the
      // attribute is not set because we will now reflect the property to the attribute.
      n.useDefault && n.reflect && i === this.__defaultValues?.get(e) && !this.hasAttribute(o.__attributeNameForProperty(e, n)))
        this._$changeProperty(e, s, n);
      else
        return;
    }
    this.isUpdatePending === !1 && (this.__updatePromise = this.__enqueueUpdate());
  }
  /**
   * @internal
   */
  _$changeProperty(e, s, { useDefault: n, reflect: r, wrapped: i }, o) {
    n && !(this.__defaultValues ??= /* @__PURE__ */ new Map()).has(e) && (this.__defaultValues.set(e, o ?? s ?? this[e]), i !== !0 || o !== void 0) || (this._$changedProperties.has(e) || (!this.hasUpdated && !n && (s = void 0), this._$changedProperties.set(e, s)), r === !0 && this.__reflectingProperty !== e && (this.__reflectingProperties ??= /* @__PURE__ */ new Set()).add(e));
  }
  /**
   * Sets up the element to asynchronously update.
   */
  async __enqueueUpdate() {
    this.isUpdatePending = !0;
    try {
      await this.__updatePromise;
    } catch (s) {
      Promise.reject(s);
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
    if (Ns?.({ kind: "update" }), !this.hasUpdated) {
      this.renderRoot ??= this.createRenderRoot();
      {
        const i = [...this.constructor.elementProperties.keys()].filter((o) => this.hasOwnProperty(o) && o in It(this));
        if (i.length)
          throw new Error(`The following properties on element ${this.localName} will not trigger updates as expected because they are set using class fields: ${i.join(", ")}. Native class fields and some compiled output will overwrite accessors used for detecting changes. See https://lit.dev/msg/class-field-shadowing for more information.`);
      }
      if (this.__instanceProperties) {
        for (const [r, i] of this.__instanceProperties)
          this[r] = i;
        this.__instanceProperties = void 0;
      }
      const n = this.constructor.elementProperties;
      if (n.size > 0)
        for (const [r, i] of n) {
          const { wrapped: o } = i, a = this[r];
          o === !0 && !this._$changedProperties.has(r) && a !== void 0 && this._$changeProperty(r, void 0, i, a);
        }
    }
    let e = !1;
    const s = this._$changedProperties;
    try {
      e = this.shouldUpdate(s), e ? (this.willUpdate(s), this.__controllers?.forEach((n) => n.hostUpdate?.()), this.update(s)) : this.__markUpdated();
    } catch (n) {
      throw e = !1, this.__markUpdated(), n;
    }
    e && this._$didUpdate(s);
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
    this.__controllers?.forEach((s) => s.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e), this.isUpdatePending && this.constructor.enabledWarnings.includes("change-in-update") && j("change-in-update", `Element ${this.localName} scheduled an update (generally because a property was set) after an update completed, causing a new update to be scheduled. This is inefficient and should be avoided unless the next update can only be scheduled as a side effect of the previous update.`);
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
    this.__reflectingProperties &&= this.__reflectingProperties.forEach((s) => this.__propertyToAttribute(s, this[s])), this.__markUpdated();
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
U.elementStyles = [];
U.shadowRootOptions = { mode: "open" };
U[X("elementProperties")] = /* @__PURE__ */ new Map();
U[X("finalized")] = /* @__PURE__ */ new Map();
Zt?.({ ReactiveElement: U });
{
  U.enabledWarnings = [
    "change-in-update",
    "async-perform-update"
  ];
  const t = function(e) {
    e.hasOwnProperty(X("enabledWarnings")) || (e.enabledWarnings = e.enabledWarnings.slice());
  };
  U.enableWarning = function(e) {
    t(this), this.enabledWarnings.includes(e) || this.enabledWarnings.push(e);
  }, U.disableWarning = function(e) {
    t(this);
    const s = this.enabledWarnings.indexOf(e);
    s >= 0 && this.enabledWarnings.splice(s, 1);
  };
}
(I.reactiveElementVersions ??= []).push("2.1.2");
I.reactiveElementVersions.length > 1 && queueMicrotask(() => {
  j("multiple-versions", "Multiple versions of Lit loaded. Loading multiple versions is not recommended.");
});
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x = globalThis, f = (t) => {
  x.emitLitDebugLogEvents && x.dispatchEvent(new CustomEvent("lit-debug", {
    detail: t
  }));
};
let Us = 0, ae;
x.litIssuedWarnings ??= /* @__PURE__ */ new Set(), ae = (t, e) => {
  e += t ? ` See https://lit.dev/msg/${t} for more information.` : "", !x.litIssuedWarnings.has(e) && !x.litIssuedWarnings.has(t) && (console.warn(e), x.litIssuedWarnings.add(e));
}, queueMicrotask(() => {
  ae("dev-mode", "Lit is in dev mode. Not recommended for production!");
});
const A = x.ShadyDOM?.inUse && x.ShadyDOM?.noPatch === !0 ? x.ShadyDOM.wrap : (t) => t, be = x.trustedTypes, jt = be ? be.createPolicy("lit-html", {
  createHTML: (t) => t
}) : void 0, ks = (t) => t, Se = (t, e, s) => ks, zs = (t) => {
  if (q !== Se)
    throw new Error("Attempted to overwrite existing lit-html security policy. setSanitizeDOMValueFactory should be called at most once.");
  q = t;
}, Vs = () => {
  q = Se;
}, Le = (t, e, s) => q(t, e, s), es = "$lit$", N = `lit$${Math.random().toFixed(9).slice(2)}$`, ts = "?" + N, Ls = `<${ts}>`, B = document, le = () => B.createComment(""), ce = (t) => t === null || typeof t != "object" && typeof t != "function", bt = Array.isArray, Hs = (t) => bt(t) || // eslint-disable-next-line @typescript-eslint/no-explicit-any
typeof t?.[Symbol.iterator] == "function", Re = `[ 	
\f\r]`, Ws = `[^ 	
\f\r"'\`<>=]`, Fs = `[^\\s"'>=/]`, oe = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Mt = 1, Ne = 2, Bs = 3, Rt = /-->/g, Nt = />/g, H = new RegExp(`>|${Re}(?:(${Fs}+)(${Re}*=${Re}*(?:${Ws}|("|')|))|$)`, "g"), qs = 0, Ut = 1, Ks = 2, kt = 3, Ue = /'/g, ke = /"/g, ss = /^(?:script|style|textarea|title)$/i, Gs = 1, He = 2, We = 3, vt = 1, ve = 2, Ys = 3, Js = 4, Qs = 5, wt = 6, Xs = 7, Zs = (t) => (e, ...s) => (e.some((n) => n === void 0) && console.warn(`Some template strings are undefined.
This is probably caused by illegal octal escape sequences.`), s.some((n) => n?._$litStatic$) && ae("", `Static values 'literal' or 'unsafeStatic' cannot be used as values to non-static templates.
Please use the static 'html' tag function. See https://lit.dev/docs/templates/expressions/#static-expressions`), {
  // This property needs to remain unminified.
  _$litType$: t,
  strings: e,
  values: s
}), b = Zs(Gs), Z = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), zt = /* @__PURE__ */ new WeakMap(), F = B.createTreeWalker(
  B,
  129
  /* NodeFilter.SHOW_{ELEMENT|COMMENT} */
);
let q = Se;
function rs(t, e) {
  if (!bt(t) || !t.hasOwnProperty("raw")) {
    let s = "invalid template strings array";
    throw s = `
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
`), new Error(s);
  }
  return jt !== void 0 ? jt.createHTML(e) : e;
}
const er = (t, e) => {
  const s = t.length - 1, n = [];
  let r = e === He ? "<svg>" : e === We ? "<math>" : "", i, o = oe;
  for (let l = 0; l < s; l++) {
    const u = t[l];
    let c = -1, h, y = 0, p;
    for (; y < u.length && (o.lastIndex = y, p = o.exec(u), p !== null); )
      if (y = o.lastIndex, o === oe) {
        if (p[Mt] === "!--")
          o = Rt;
        else if (p[Mt] !== void 0)
          o = Nt;
        else if (p[Ne] !== void 0)
          ss.test(p[Ne]) && (i = new RegExp(`</${p[Ne]}`, "g")), o = H;
        else if (p[Bs] !== void 0)
          throw new Error("Bindings in tag names are not supported. Please use static templates instead. See https://lit.dev/docs/templates/expressions/#static-expressions");
      } else o === H ? p[qs] === ">" ? (o = i ?? oe, c = -1) : p[Ut] === void 0 ? c = -2 : (c = o.lastIndex - p[Ks].length, h = p[Ut], o = p[kt] === void 0 ? H : p[kt] === '"' ? ke : Ue) : o === ke || o === Ue ? o = H : o === Rt || o === Nt ? o = oe : (o = H, i = void 0);
    console.assert(c === -1 || o === H || o === Ue || o === ke, "unexpected parse state B");
    const Q = o === H && t[l + 1].startsWith("/>") ? " " : "";
    r += o === oe ? u + Ls : c >= 0 ? (n.push(h), u.slice(0, c) + es + u.slice(c) + N + Q) : u + N + (c === -2 ? l : Q);
  }
  const a = r + (t[s] || "<?>") + (e === He ? "</svg>" : e === We ? "</math>" : "");
  return [rs(t, a), n];
};
class ue {
  constructor({ strings: e, ["_$litType$"]: s }, n) {
    this.parts = [];
    let r, i = 0, o = 0;
    const a = e.length - 1, l = this.parts, [u, c] = er(e, s);
    if (this.el = ue.createElement(u, n), F.currentNode = this.el.content, s === He || s === We) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (r = F.nextNode()) !== null && l.length < a; ) {
      if (r.nodeType === 1) {
        {
          const h = r.localName;
          if (/^(?:textarea|template)$/i.test(h) && r.innerHTML.includes(N)) {
            const y = `Expressions are not supported inside \`${h}\` elements. See https://lit.dev/msg/expression-in-${h} for more information.`;
            if (h === "template")
              throw new Error(y);
            ae("", y);
          }
        }
        if (r.hasAttributes())
          for (const h of r.getAttributeNames())
            if (h.endsWith(es)) {
              const y = c[o++], Q = r.getAttribute(h).split(N), V = /([.?@])?(.*)/.exec(y);
              l.push({
                type: vt,
                index: i,
                name: V[2],
                strings: Q,
                ctor: V[1] === "." ? sr : V[1] === "?" ? rr : V[1] === "@" ? nr : xe
              }), r.removeAttribute(h);
            } else h.startsWith(N) && (l.push({
              type: wt,
              index: i
            }), r.removeAttribute(h));
        if (ss.test(r.tagName)) {
          const h = r.textContent.split(N), y = h.length - 1;
          if (y > 0) {
            r.textContent = be ? be.emptyScript : "";
            for (let p = 0; p < y; p++)
              r.append(h[p], le()), F.nextNode(), l.push({ type: ve, index: ++i });
            r.append(h[y], le());
          }
        }
      } else if (r.nodeType === 8)
        if (r.data === ts)
          l.push({ type: ve, index: i });
        else {
          let y = -1;
          for (; (y = r.data.indexOf(N, y + 1)) !== -1; )
            l.push({ type: Xs, index: i }), y += N.length - 1;
        }
      i++;
    }
    if (c.length !== o)
      throw new Error('Detected duplicate attribute bindings. This occurs if your template has duplicate attributes on an element tag. For example "<input ?disabled=${true} ?disabled=${false}>" contains a duplicate "disabled" attribute. The error was detected in the following template: \n`' + e.join("${...}") + "`");
    f && f({
      kind: "template prep",
      template: this,
      clonableTemplate: this.el,
      parts: this.parts,
      strings: e
    });
  }
  // Overridden via `litHtmlPolyfillSupport` to provide platform support.
  /** @nocollapse */
  static createElement(e, s) {
    const n = B.createElement("template");
    return n.innerHTML = e, n;
  }
}
function ee(t, e, s = t, n) {
  if (e === Z)
    return e;
  let r = n !== void 0 ? s.__directives?.[n] : s.__directive;
  const i = ce(e) ? void 0 : (
    // This property needs to remain unminified.
    e._$litDirective$
  );
  return r?.constructor !== i && (r?._$notifyDirectiveConnectionChanged?.(!1), i === void 0 ? r = void 0 : (r = new i(t), r._$initialize(t, s, n)), n !== void 0 ? (s.__directives ??= [])[n] = r : s.__directive = r), r !== void 0 && (e = ee(t, r._$resolve(t, e.values), r, n)), e;
}
class tr {
  constructor(e, s) {
    this._$parts = [], this._$disconnectableChildren = void 0, this._$template = e, this._$parent = s;
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
    const { el: { content: s }, parts: n } = this._$template, r = (e?.creationScope ?? B).importNode(s, !0);
    F.currentNode = r;
    let i = F.nextNode(), o = 0, a = 0, l = n[0];
    for (; l !== void 0; ) {
      if (o === l.index) {
        let u;
        l.type === ve ? u = new de(i, i.nextSibling, this, e) : l.type === vt ? u = new l.ctor(i, l.name, l.strings, this, e) : l.type === wt && (u = new ir(i, this, e)), this._$parts.push(u), l = n[++a];
      }
      o !== l?.index && (i = F.nextNode(), o++);
    }
    return F.currentNode = B, r;
  }
  _update(e) {
    let s = 0;
    for (const n of this._$parts)
      n !== void 0 && (f && f({
        kind: "set part",
        part: n,
        value: e[s],
        valueIndex: s,
        values: e,
        templateInstance: this
      }), n.strings !== void 0 ? (n._$setValue(e, n, s), s += n.strings.length - 2) : n._$setValue(e[s])), s++;
  }
}
class de {
  // See comment in Disconnectable interface for why this is a getter
  get _$isConnected() {
    return this._$parent?._$isConnected ?? this.__isConnected;
  }
  constructor(e, s, n, r) {
    this.type = ve, this._$committedValue = d, this._$disconnectableChildren = void 0, this._$startNode = e, this._$endNode = s, this._$parent = n, this.options = r, this.__isConnected = r?.isConnected ?? !0, this._textSanitizer = void 0;
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
    let e = A(this._$startNode).parentNode;
    const s = this._$parent;
    return s !== void 0 && e?.nodeType === 11 && (e = s.parentNode), e;
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
  _$setValue(e, s = this) {
    if (this.parentNode === null)
      throw new Error("This `ChildPart` has no `parentNode` and therefore cannot accept a value. This likely means the element containing the part was manipulated in an unsupported way outside of Lit's control such that the part's marker nodes were ejected from DOM. For example, setting the element's `innerHTML` or `textContent` can do this.");
    if (e = ee(this, e, s), ce(e))
      e === d || e == null || e === "" ? (this._$committedValue !== d && (f && f({
        kind: "commit nothing to child",
        start: this._$startNode,
        end: this._$endNode,
        parent: this._$parent,
        options: this.options
      }), this._$clear()), this._$committedValue = d) : e !== this._$committedValue && e !== Z && this._commitText(e);
    else if (e._$litType$ !== void 0)
      this._commitTemplateResult(e);
    else if (e.nodeType !== void 0) {
      if (this.options?.host === e) {
        this._commitText("[probable mistake: rendered a template's host in itself (commonly caused by writing ${this} in a template]"), console.warn("Attempted to render the template host", e, "inside itself. This is almost always a mistake, and in dev mode ", "we render some warning text. In production however, we'll ", "render it, which will usually result in an error, and sometimes ", "in the element disappearing from the DOM.");
        return;
      }
      this._commitNode(e);
    } else Hs(e) ? this._commitIterable(e) : this._commitText(e);
  }
  _insert(e) {
    return A(A(this._$startNode).parentNode).insertBefore(e, this._$endNode);
  }
  _commitNode(e) {
    if (this._$committedValue !== e) {
      if (this._$clear(), q !== Se) {
        const s = this._$startNode.parentNode?.nodeName;
        if (s === "STYLE" || s === "SCRIPT") {
          let n = "Forbidden";
          throw s === "STYLE" ? n = "Lit does not support binding inside style nodes. This is a security risk, as style injection attacks can exfiltrate data and spoof UIs. Consider instead using css`...` literals to compose styles, and do dynamic styling with css custom properties, ::parts, <slot>s, and by mutating the DOM rather than stylesheets." : n = "Lit does not support binding inside script nodes. This is a security risk, as it could allow arbitrary code execution.", new Error(n);
        }
      }
      f && f({
        kind: "commit node",
        start: this._$startNode,
        parent: this._$parent,
        value: e,
        options: this.options
      }), this._$committedValue = this._insert(e);
    }
  }
  _commitText(e) {
    if (this._$committedValue !== d && ce(this._$committedValue)) {
      const s = A(this._$startNode).nextSibling;
      this._textSanitizer === void 0 && (this._textSanitizer = Le(s, "data", "property")), e = this._textSanitizer(e), f && f({
        kind: "commit text",
        node: s,
        value: e,
        options: this.options
      }), s.data = e;
    } else {
      const s = B.createTextNode("");
      this._commitNode(s), this._textSanitizer === void 0 && (this._textSanitizer = Le(s, "data", "property")), e = this._textSanitizer(e), f && f({
        kind: "commit text",
        node: s,
        value: e,
        options: this.options
      }), s.data = e;
    }
    this._$committedValue = e;
  }
  _commitTemplateResult(e) {
    const { values: s, ["_$litType$"]: n } = e, r = typeof n == "number" ? this._$getTemplate(e) : (n.el === void 0 && (n.el = ue.createElement(rs(n.h, n.h[0]), this.options)), n);
    if (this._$committedValue?._$template === r)
      f && f({
        kind: "template updating",
        template: r,
        instance: this._$committedValue,
        parts: this._$committedValue._$parts,
        options: this.options,
        values: s
      }), this._$committedValue._update(s);
    else {
      const i = new tr(r, this), o = i._clone(this.options);
      f && f({
        kind: "template instantiated",
        template: r,
        instance: i,
        parts: i._$parts,
        options: this.options,
        fragment: o,
        values: s
      }), i._update(s), f && f({
        kind: "template instantiated and updated",
        template: r,
        instance: i,
        parts: i._$parts,
        options: this.options,
        fragment: o,
        values: s
      }), this._commitNode(o), this._$committedValue = i;
    }
  }
  // Overridden via `litHtmlPolyfillSupport` to provide platform support.
  /** @internal */
  _$getTemplate(e) {
    let s = zt.get(e.strings);
    return s === void 0 && zt.set(e.strings, s = new ue(e)), s;
  }
  _commitIterable(e) {
    bt(this._$committedValue) || (this._$committedValue = [], this._$clear());
    const s = this._$committedValue;
    let n = 0, r;
    for (const i of e)
      n === s.length ? s.push(r = new de(this._insert(le()), this._insert(le()), this, this.options)) : r = s[n], r._$setValue(i), n++;
    n < s.length && (this._$clear(r && A(r._$endNode).nextSibling, n), s.length = n);
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
  _$clear(e = A(this._$startNode).nextSibling, s) {
    for (this._$notifyConnectionChanged?.(!1, !0, s); e !== this._$endNode; ) {
      const n = A(e).nextSibling;
      A(e).remove(), e = n;
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
class xe {
  get tagName() {
    return this.element.tagName;
  }
  // See comment in Disconnectable interface for why this is a getter
  get _$isConnected() {
    return this._$parent._$isConnected;
  }
  constructor(e, s, n, r, i) {
    this.type = vt, this._$committedValue = d, this._$disconnectableChildren = void 0, this.element = e, this.name = s, this._$parent = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$committedValue = new Array(n.length - 1).fill(new String()), this.strings = n) : this._$committedValue = d, this._sanitizer = void 0;
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
  _$setValue(e, s = this, n, r) {
    const i = this.strings;
    let o = !1;
    if (i === void 0)
      e = ee(this, e, s, 0), o = !ce(e) || e !== this._$committedValue && e !== Z, o && (this._$committedValue = e);
    else {
      const a = e;
      e = i[0];
      let l, u;
      for (l = 0; l < i.length - 1; l++)
        u = ee(this, a[n + l], s, l), u === Z && (u = this._$committedValue[l]), o ||= !ce(u) || u !== this._$committedValue[l], u === d ? e = d : e !== d && (e += (u ?? "") + i[l + 1]), this._$committedValue[l] = u;
    }
    o && !r && this._commitValue(e);
  }
  /** @internal */
  _commitValue(e) {
    e === d ? A(this.element).removeAttribute(this.name) : (this._sanitizer === void 0 && (this._sanitizer = q(this.element, this.name, "attribute")), e = this._sanitizer(e ?? ""), f && f({
      kind: "commit attribute",
      element: this.element,
      name: this.name,
      value: e,
      options: this.options
    }), A(this.element).setAttribute(this.name, e ?? ""));
  }
}
class sr extends xe {
  constructor() {
    super(...arguments), this.type = Ys;
  }
  /** @internal */
  _commitValue(e) {
    this._sanitizer === void 0 && (this._sanitizer = q(this.element, this.name, "property")), e = this._sanitizer(e), f && f({
      kind: "commit property",
      element: this.element,
      name: this.name,
      value: e,
      options: this.options
    }), this.element[this.name] = e === d ? void 0 : e;
  }
}
class rr extends xe {
  constructor() {
    super(...arguments), this.type = Js;
  }
  /** @internal */
  _commitValue(e) {
    f && f({
      kind: "commit boolean attribute",
      element: this.element,
      name: this.name,
      value: !!(e && e !== d),
      options: this.options
    }), A(this.element).toggleAttribute(this.name, !!e && e !== d);
  }
}
class nr extends xe {
  constructor(e, s, n, r, i) {
    if (super(e, s, n, r, i), this.type = Qs, this.strings !== void 0)
      throw new Error(`A \`<${e.localName}>\` has a \`@${s}=...\` listener with invalid content. Event listeners in templates must have exactly one expression and no surrounding text.`);
  }
  // EventPart does not use the base _$setValue/_resolveValue implementation
  // since the dirty checking is more complex
  /** @internal */
  _$setValue(e, s = this) {
    if (e = ee(this, e, s, 0) ?? d, e === Z)
      return;
    const n = this._$committedValue, r = e === d && n !== d || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== d && (n === d || r);
    f && f({
      kind: "commit event listener",
      element: this.element,
      name: this.name,
      value: e,
      options: this.options,
      removeListener: r,
      addListener: i,
      oldListener: n
    }), r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$committedValue = e;
  }
  handleEvent(e) {
    typeof this._$committedValue == "function" ? this._$committedValue.call(this.options?.host ?? this.element, e) : this._$committedValue.handleEvent(e);
  }
}
class ir {
  constructor(e, s, n) {
    this.element = e, this.type = wt, this._$disconnectableChildren = void 0, this._$parent = s, this.options = n;
  }
  // See comment in Disconnectable interface for why this is a getter
  get _$isConnected() {
    return this._$parent._$isConnected;
  }
  _$setValue(e) {
    f && f({
      kind: "commit to element binding",
      element: this.element,
      value: e,
      options: this.options
    }), ee(this, e);
  }
}
const or = x.litHtmlPolyfillSupportDevMode;
or?.(ue, de);
(x.litHtmlVersions ??= []).push("3.3.3");
x.litHtmlVersions.length > 1 && queueMicrotask(() => {
  ae("multiple-versions", "Multiple versions of Lit loaded. Loading multiple versions is not recommended.");
});
const ge = (t, e, s) => {
  if (e == null)
    throw new TypeError(`The container to render into may not be ${e}`);
  const n = Us++, r = s?.renderBefore ?? e;
  let i = r._$litPart$;
  if (f && f({
    kind: "begin render",
    id: n,
    value: t,
    container: e,
    options: s,
    part: i
  }), i === void 0) {
    const o = s?.renderBefore ?? null;
    r._$litPart$ = i = new de(e.insertBefore(le(), o), o, void 0, s ?? {});
  }
  return i._$setValue(t), f && f({
    kind: "end render",
    id: n,
    value: t,
    container: e,
    options: s,
    part: i
  }), i;
};
ge.setSanitizer = zs, ge.createSanitizer = Le, ge._testOnlyClearSanitizerFactoryDoNotCallOrElse = Vs;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ar = (t, e) => t, z = globalThis;
let ns;
z.litIssuedWarnings ??= /* @__PURE__ */ new Set(), ns = (t, e) => {
  e += ` See https://lit.dev/msg/${t} for more information.`, !z.litIssuedWarnings.has(e) && !z.litIssuedWarnings.has(t) && (console.warn(e), z.litIssuedWarnings.add(e));
};
class K extends U {
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
    const s = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this.__childPart = ge(s, this.renderRoot, this.renderOptions);
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
    return Z;
  }
}
K._$litElement$ = !0;
K[ar("finalized")] = !0;
z.litElementHydrateSupport?.({ LitElement: K });
const lr = z.litElementPolyfillSupportDevMode;
lr?.({ LitElement: K });
(z.litElementVersions ??= []).push("4.2.2");
z.litElementVersions.length > 1 && queueMicrotask(() => {
  ns("multiple-versions", "Multiple versions of Lit loaded. Loading multiple versions is not recommended.");
});
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const g = (t) => (e, s) => {
  s !== void 0 ? s.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let is;
globalThis.litIssuedWarnings ??= /* @__PURE__ */ new Set(), is = (t, e) => {
  e += ` See https://lit.dev/msg/${t} for more information.`, !globalThis.litIssuedWarnings.has(e) && !globalThis.litIssuedWarnings.has(t) && (console.warn(e), globalThis.litIssuedWarnings.add(e));
};
const cr = (t, e, s) => {
  const n = e.hasOwnProperty(s);
  return e.constructor.createProperty(s, t), n ? Object.getOwnPropertyDescriptor(e, s) : void 0;
}, ur = {
  attribute: !0,
  type: String,
  converter: ye,
  reflect: !1,
  hasChanged: yt
}, dr = (t = ur, e, s) => {
  const { kind: n, metadata: r } = s;
  r == null && is("missing-class-metadata", `The class ${e} is missing decorator metadata. This could mean that you're using a compiler that supports decorators but doesn't support decorator metadata, such as TypeScript 5.1. Please update your compiler.`);
  let i = globalThis.litPropertyMetadata.get(r);
  if (i === void 0 && globalThis.litPropertyMetadata.set(r, i = /* @__PURE__ */ new Map()), n === "setter" && (t = Object.create(t), t.wrapped = !0), i.set(s.name, t), n === "accessor") {
    const { name: o } = s;
    return {
      set(a) {
        const l = e.get.call(this);
        e.set.call(this, a), this.requestUpdate(o, l, t, !0, a);
      },
      init(a) {
        return a !== void 0 && this._$changeProperty(o, void 0, t, a), a;
      }
    };
  } else if (n === "setter") {
    const { name: o } = s;
    return function(a) {
      const l = this[o];
      e.call(this, a), this.requestUpdate(o, l, t, !0, a);
    };
  }
  throw new Error(`Unsupported decorator location: ${n}`);
};
function Te(t) {
  return (e, s) => typeof s == "object" ? dr(t, e, s) : cr(t, e, s);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function v(t) {
  return Te({
    ...t,
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
const G = gt`
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
    cursor: pointer;
    pointer-events: auto;
  }
  .clickable:hover {
    opacity: 0.7;
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
`, os = /* @__PURE__ */ new Set(["unavailable", "unknown"]), hr = " · ";
function m(t, e) {
  if (!e) return;
  const s = t?.states[e];
  return {
    entityId: e,
    stateObj: s,
    missing: !s,
    unavailable: !!s && os.has(s.state)
  };
}
function mr(t, e) {
  if (!(!t || !e || !e.stateObj || e.missing || e.unavailable))
    return t.formatEntityState(e.stateObj);
}
function S(t) {
  return t.filter(
    (e) => !!e && e.text.trim() !== ""
  );
}
function w(t, e) {
  const s = mr(t, e);
  return s ? { text: s, entityId: e?.entityId } : void 0;
}
function R(t, e) {
  const s = pr(t, e);
  return s ? { text: s, entityId: e?.entityId } : void 0;
}
function pr(t, e) {
  if (!(!t || !e?.stateObj || !e.unavailable))
    return t.formatEntityState(e.stateObj);
}
function M(t) {
  if (!t?.stateObj) return;
  const e = Number(t.stateObj.state);
  return Number.isFinite(e) ? e : void 0;
}
function $t(t, e) {
  return t || (e?.stateObj?.attributes.friendly_name ?? e?.entityId ?? "");
}
function fr(t, e) {
  if (!e) return { value: t };
  if (!t.endsWith(e)) return { value: t };
  const s = t.slice(0, t.length - e.length).trimEnd();
  return s ? { value: s, unit: e } : { value: t };
}
const Fe = "unavailable", _r = "unknown", gr = "off", yr = /* @__PURE__ */ new Set(["button", "input_button", "scene"]), br = /* @__PURE__ */ new Set([
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
]), Ie = (t) => t.substring(0, t.indexOf(".")), vr = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "unknown";
function as(t, e) {
  const s = Ie(t.entity_id), n = t.state;
  if (yr.has(s))
    return n !== Fe;
  if (n === Fe || n === _r || n === gr && s !== "alert")
    return !1;
  switch (s) {
    case "alarm_control_panel":
      return n !== "disarmed";
    case "alert":
      return n !== "idle";
    case "cover":
    case "valve":
      return n !== "closed";
    case "device_tracker":
    case "person":
      return n !== "not_home";
    case "lawn_mower":
      return !["docked", "paused"].includes(n);
    case "lock":
      return n !== "locked";
    case "media_player":
      return n !== "standby";
    case "vacuum":
      return !["idle", "docked", "paused"].includes(n);
    case "plant":
      return n === "problem";
    case "group":
      return ["on", "home", "open", "locked", "problem"].includes(n);
    case "timer":
      return n === "active";
    case "camera":
      return ["streaming", "recording"].includes(n);
    default:
      return !0;
  }
}
const wr = (t) => t.reduceRight(
  (e, s) => `var(${s}${e ? `, ${e}` : ""})`,
  void 0
), $r = (t) => {
  const e = Number(t);
  if (!isNaN(e))
    return e >= 70 ? "--state-sensor-battery-high-color" : e >= 30 ? "--state-sensor-battery-medium-color" : "--state-sensor-battery-low-color";
};
function Pr(t, e) {
  if (!t) return e;
  if (t.state === Fe)
    return "var(--state-unavailable-color)";
  const s = Ie(t.entity_id), n = t.attributes.device_class;
  if (s === "sensor" && n === "battery") {
    const l = $r(t.state);
    if (l) return `var(${l})`;
  }
  if (!br.has(s))
    return e;
  const r = as(t), i = vr(t.state), o = r ? "active" : "inactive", a = [];
  return n && a.push(`--state-${s}-${n}-${i}-color`), a.push(
    `--state-${s}-${i}-color`,
    `--state-${s}-${o}-color`,
    `--state-${o}-color`
  ), wr(a);
}
function k(t) {
  if (!t) return "var(--state-inactive-color)";
  const e = Pr(t);
  return e || (as(t) ? "var(--state-icon-color)" : "var(--state-inactive-color)");
}
function W(t) {
  return t !== void 0 && t.action !== "none";
}
const Er = ["closed", "locked", "off"], Cr = /* @__PURE__ */ new Set([
  "fan",
  "input_boolean",
  "light",
  "switch",
  "group",
  "automation",
  "humidifier",
  "valve"
]);
function Pt(t) {
  if (!t) return { action: "none" };
  const e = Ie(t);
  return { action: Cr.has(e) || ["button", "input_button", "scene"].includes(e) ? "toggle" : "none" };
}
const Or = {
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
function Sr(t, e) {
  const s = Or[t];
  return s ? (e ? s.on : s.off) ?? s.on : e ? "turn_on" : "turn_off";
}
function xr(t, e) {
  const s = t.states[e];
  if (!s) return;
  const n = Ie(e), r = n === "group" ? "homeassistant" : n, i = Er.includes(s.state);
  t.callService(r, Sr(n, i), {
    entity_id: e
  });
}
function Vt(t, e, s) {
  t.dispatchEvent(
    new CustomEvent(e, { detail: s, bubbles: !0, composed: !0 })
  );
}
function Tr(t, e) {
  e ? window.history.replaceState(null, "", t) : window.history.pushState(null, "", t), window.dispatchEvent(new CustomEvent("location-changed", { detail: {} }));
}
async function Ir(t, e) {
  if (!e.confirmation) return !0;
  const s = window.loadCardHelpers;
  if (!s) return window.confirm(e.confirmation.text ?? "Подтвердить?");
  const n = await s();
  return n.showConfirmationDialog ? n.showConfirmationDialog(t, {
    text: e.confirmation.text,
    title: e.confirmation.title,
    confirmText: e.confirmation.confirm_text,
    dismissText: e.confirmation.dismiss_text
  }) : window.confirm(e.confirmation.text ?? "Подтвердить?");
}
async function Dr(t, e, s, n) {
  let r;
  if (n === "double_tap" ? r = s.double_tap_action : n === "hold" ? r = s.hold_action : r = s.tap_action, r || (r = { action: "more-info" }), !!await Ir(t, r))
    switch (r.action) {
      case "none":
        break;
      case "more-info": {
        const i = r.entity || s.entity;
        i && Vt(t, "hass-more-info", { entityId: i });
        break;
      }
      case "toggle": {
        const i = r.entity || s.entity;
        i && xr(e, i);
        break;
      }
      case "navigate":
        r.navigation_path && Tr(r.navigation_path, r.navigation_replace);
        break;
      case "url":
        r.url_path && window.open(r.url_path, "_blank", "noreferrer");
        break;
      case "perform-action":
      case "call-service": {
        const i = r.perform_action || r.service;
        if (!i) break;
        const [o, a] = i.split(".", 2);
        e.callService(o, a, {
          ...r.data ?? r.service_data ?? {},
          ...r.target ?? {}
        });
        break;
      }
      case "fire-dom-event":
        Vt(t, "ll-custom", r);
        break;
      default:
        console.warn(
          `horos-cards: действие "${r.action}" не поддержано`
        );
    }
}
const ls = 5e3, Lt = [
  "ha-tile-container",
  "ha-tile-icon",
  "ha-tile-info",
  "hui-card-features"
];
let pe, fe;
function cs(t, e) {
  return customElements.get(t) ? Promise.resolve(!0) : Promise.race([
    customElements.whenDefined(t).then(() => !0),
    new Promise((s) => setTimeout(() => s(!1), e))
  ]);
}
async function Ar() {
  const t = window.loadCardHelpers;
  if (t)
    try {
      (await t()).createCardElement?.({ type: "tile", entity: "sun.sun" });
    } catch {
    }
}
function us() {
  return pe || (pe = (async () => Lt.every((e) => customElements.get(e)) ? !0 : (await Ar(), (await Promise.all(
    Lt.map((e) => cs(e, ls))
  )).every(Boolean)))(), pe);
}
function jr() {
  return fe || (fe = (async () => {
    if (customElements.get("hui-card-features-editor")) return !0;
    await us();
    const t = customElements.get("hui-tile-card");
    try {
      await t?.getConfigElement?.();
    } catch {
    }
    return cs("hui-card-features-editor", ls);
  })(), fe);
}
var Mr = Object.defineProperty, ds = (t, e, s, n) => {
  for (var r = void 0, i = t.length - 1, o; i >= 0; i--)
    (o = t[i]) && (r = o(e, s, r) || r);
  return r && Mr(e, s, r), r;
};
class $ extends K {
  constructor() {
    super(...arguments), this._ready = !1, this.base = {};
  }
  static {
    this.styles = [G];
  }
  getCardSize() {
    return 1;
  }
  connectedCallback() {
    super.connectedCallback(), us().then((e) => {
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
  _runAction(e, s) {
    if (!this.hass) return;
    const n = s ? {
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
    Dr(this, this.hass, n, e);
  }
  // ---- отрисовка -------------------------------------------------------
  /** Плашка вместо карточки: конфиг невалиден или сущности нет в HA. */
  renderWarning(e) {
    return b`<ha-card><div class="warning">${e}</div></ha-card>`;
  }
  /** Сообщение о ненайденных сущностях, либо undefined если всё на месте. */
  missingRolesWarning(e) {
    const s = e.filter((n) => !!n && n.missing).map((n) => n.entityId);
    if (s.length)
      return s.length === 1 ? `Сущность не найдена: ${s[0]}` : `Сущности не найдены: ${s.join(", ")}`;
  }
  /**
   * Оборачивает величину в собственную цель тапа. Клик не всплывает до
   * подложки, поэтому открывается more-info этой сущности, а не главной.
   */
  renderClickable(e, s) {
    return s ? b`<span
      class="clickable"
      @click=${(n) => {
      n.stopPropagation(), this.fireMoreInfo(s);
    }}
      >${e}</span
    >` : b`<span>${e}</span>`;
  }
  renderTile(e) {
    const {
      icon: s,
      color: n,
      primary: r,
      secondary: i,
      mainEntityId: o,
      imageUrl: a,
      defaultIconAction: l,
      values: u,
      ownFeatures: c,
      customFeatures: h
    } = e;
    if (this._entityId = o, this._defaultIconAction = l, !this._ready)
      return this.renderWarning(
        "Не удалось загрузить компоненты Home Assistant"
      );
    const y = this.base.color ? Rr(this.base.color) : n ?? "var(--state-inactive-color)", p = this.base.icon_tap_action ?? l, Q = W(p) || W(this.base.icon_hold_action) || W(this.base.icon_double_tap_action), V = this.base.features?.length ? this.base.features : c, je = this.base.features_position ?? "bottom";
    return b`
      <ha-card style="--tile-color: ${y};">
        <ha-tile-container
          .featurePosition=${je}
          .vertical=${!!this.base.vertical}
          .interactive=${!0}
          .actionHandlerOptions=${{
      hasHold: W(this.base.hold_action),
      hasDoubleClick: W(this.base.double_tap_action)
    }}
          @action=${this._handleAction}
        >
          <ha-tile-icon
            slot="icon"
            class=${a ? "image" : ""}
            .interactive=${Q}
            .imageUrl=${a}
            .icon=${this.base.icon ?? s}
            .actionHandlerOptions=${{
      hasHold: W(this.base.icon_hold_action),
      hasDoubleClick: W(this.base.icon_double_tap_action)
    }}
            @action=${this._handleIconAction}
          ></ha-tile-icon>

          <div slot="info" class="info ${this.base.vertical ? "vertical" : ""}">
            <ha-tile-info>
              <span slot="primary">${r}</span>
              ${i?.length && !this.base.hide_state ? b`<span slot="secondary"
                    >${i.map(
      (L, Me) => b`
                        ${Me ? b`<span>${hr}</span>` : d}${this.renderClickable(
        L.text,
        L.entityId
      )}
                      `
    )}</span
                  >` : d}
            </ha-tile-info>
            ${u?.length ? b`<div class="values of-${u.length}">
                  ${u.map(
      (L, Me) => b`
                      ${Me ? b`<span class="values-separator">/</span>` : d}
                      ${this.renderClickable(
        b`${L.value}${L.unit ? b`<span class="unit"> ${L.unit}</span>` : d}`,
        L.entityId
      )}
                    `
    )}
                </div>` : d}
          </div>

          ${h ? b`<div slot="features" class="custom-features">
                ${h}
              </div>` : d}
          ${V?.length ? b`<hui-card-features
                slot=${je === "inline" ? "features-inline" : "features"}
                .hass=${this.hass}
                .context=${{ entity_id: o }}
                .features=${V}
                .position=${je}
              ></hui-card-features>` : d}
        </ha-tile-container>
      </ha-card>
    `;
  }
  bigValues(e) {
    return e.map((s) => {
      const n = this.formatted(s.role?.stateObj);
      return n ? { ...n, entityId: s.role?.entityId } : void 0;
    }).filter((s) => !!s);
  }
  /**
   * Адрес картинки сущности — та же логика, что в _getImageUrl штатной плитки.
   * Камеры с их отдельным адресом по размеру не поддерживаются.
   */
  entityImage(e) {
    if (!this.base.show_entity_picture || !this.hass || !e)
      return;
    const s = e.attributes.entity_picture_local || e.attributes.entity_picture;
    return s ? this.hass.hassUrl(s) : void 0;
  }
  /** Готовое к показу крупное значение. У недоступной сущности его нет. */
  formatted(e) {
    if (!(!this.hass || !e) && !os.has(e.state))
      return fr(
        this.hass.formatEntityState(e),
        e.attributes.unit_of_measurement
      );
  }
}
ds([
  Te({ attribute: !1 })
], $.prototype, "hass");
ds([
  v()
], $.prototype, "_ready");
function Rr(t) {
  return /^(#|rgb|hsl|var\()/.test(t) ? t : t === "state" ? "var(--state-icon-color)" : `var(--${t}-color, var(--state-icon-color))`;
}
const Ht = 3;
function Y(t, e, s) {
  if (!t || t.length === 0) return [e];
  if (t.length > Ht)
    throw new Error(
      `Крупных значений может быть не больше ${Ht}, указано ${t.length}`
    );
  const n = t.filter((i) => !s.includes(i));
  if (n.length)
    throw new Error(
      `Неизвестные роли в big_values: ${n.join(", ")}. Допустимы: ${s.join(", ")}`
    );
  const r = t.filter(
    (i, o) => t.indexOf(i) !== o
  );
  if (r.length)
    throw new Error(`Роль указана дважды: ${r.join(", ")}`);
  return t;
}
function J(t, e) {
  const s = e.map((r) => t.find((i) => i.key === r)).filter((r) => !!r), n = t.filter((r) => !e.includes(r.key));
  return { big: s, rest: n };
}
var Nr = Object.defineProperty, Ur = Object.getOwnPropertyDescriptor, hs = (t, e, s, n) => {
  for (var r = n > 1 ? void 0 : n ? Ur(e, s) : e, i = t.length - 1, o; i >= 0; i--)
    (o = t[i]) && (r = (n ? o(e, s, r) : o(r)) || r);
  return n && r && Nr(e, s, r), r;
};
const Wt = [
  "temperature",
  "humidity",
  "illuminance",
  "pm25"
];
let Be = class extends $ {
  constructor() {
    super(...arguments), this._bigKeys = ["temperature"];
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => kn), document.createElement(
      "horos-climate-tile-editor"
    );
  }
  static getStubConfig() {
    return { temperature: "", humidity: "" };
  }
  setConfig(t) {
    if (!t.temperature)
      throw new Error("Нужно указать сущность температуры (temperature)");
    this._bigKeys = Y(
      t.big_values,
      "temperature",
      Wt
    ), this.base = t, this._config = t;
  }
  render() {
    if (!this._config || !this.hass) return d;
    const t = this._config, e = Wt.map((o) => ({
      key: o,
      role: m(this.hass, t[o])
    })), s = this.missingRolesWarning(e.map((o) => o.role));
    if (s) return this.renderWarning(s);
    const { big: n, rest: r } = J(e, this._bigKeys), i = e[0].role;
    return this.renderTile({
      icon: "mdi:thermometer",
      color: k(i?.stateObj),
      primary: $t(t.name, i),
      imageUrl: this.entityImage(i?.stateObj),
      defaultIconAction: Pt(i?.entityId),
      secondary: S([
        R(this.hass, i),
        ...r.map((o) => w(this.hass, o.role))
      ]),
      mainEntityId: i?.entityId,
      values: this.bigValues(n)
    });
  }
};
hs([
  v()
], Be.prototype, "_config", 2);
Be = hs([
  g("horos-climate-tile")
], Be);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "horos-climate-tile",
  name: "Климат комнаты",
  description: "Температура, влажность, освещённость и PM2.5 одной комнаты в одной плитке",
  preview: !0
});
var kr = Object.defineProperty, zr = Object.getOwnPropertyDescriptor, ms = (t, e, s, n) => {
  for (var r = n > 1 ? void 0 : n ? zr(e, s) : e, i = t.length - 1, o; i >= 0; i--)
    (o = t[i]) && (r = (n ? o(e, s, r) : o(r)) || r);
  return n && r && kr(e, s, r), r;
};
const Ft = ["switch", "power", "energy"];
let qe = class extends $ {
  constructor() {
    super(...arguments), this._bigKeys = ["power"];
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Ln), document.createElement("horos-plug-tile-editor");
  }
  static getStubConfig() {
    return { switch: "", power: "" };
  }
  setConfig(t) {
    if (!t.switch)
      throw new Error("Нужно указать выключатель (switch)");
    this._bigKeys = Y(t.big_values, "power", Ft), this.base = t, this._config = t;
  }
  render() {
    if (!this._config || !this.hass) return d;
    const t = this._config, e = Ft.map((a) => ({
      key: a,
      role: m(this.hass, t[a])
    })), s = this.missingRolesWarning(e.map((a) => a.role));
    if (s) return this.renderWarning(s);
    const { big: n, rest: r } = J(e, this._bigKeys), i = e[0].role, o = i.entityId;
    return this.renderTile({
      icon: "mdi:power-plug",
      color: k(i.stateObj),
      primary: $t(t.name, i),
      secondary: S([
        // Одна из двух вернёт кусок: доступный выключатель даёт своё
        // состояние, недоступный — статус недоступности.
        R(this.hass, i),
        ...r.map((a) => w(this.hass, a.role))
      ]),
      mainEntityId: o,
      imageUrl: this.entityImage(i.stateObj),
      defaultIconAction: Pt(o),
      values: this.bigValues(n),
      // Кнопка — штатная feature HA, своей вёрстки для неё больше нет.
      ownFeatures: t.toggle_button ? [{ type: "toggle" }] : void 0
    });
  }
};
ms([
  v()
], qe.prototype, "_config", 2);
qe = ms([
  g("horos-plug-tile")
], qe);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "horos-plug-tile",
  name: "Розетка с потреблением",
  description: "Выключатель, текущая мощность и накопленная энергия в одной плитке",
  preview: !0
});
const Bt = 30, qt = 70;
function Vr(t, e, s) {
  return t === void 0 ? "unknown" : t < e ? "dry" : t > s ? "wet" : "ok";
}
const Lr = {
  dry: "var(--warning-color)",
  ok: "var(--success-color)",
  wet: "var(--info-color)",
  unknown: "var(--state-inactive-color)"
}, Hr = {
  dry: "mdi:water-off",
  ok: "mdi:sprout",
  wet: "mdi:water-alert",
  unknown: "mdi:sprout"
};
var Wr = Object.defineProperty, Fr = Object.getOwnPropertyDescriptor, ps = (t, e, s, n) => {
  for (var r = n > 1 ? void 0 : n ? Fr(e, s) : e, i = t.length - 1, o; i >= 0; i--)
    (o = t[i]) && (r = (n ? o(e, s, r) : o(r)) || r);
  return n && r && Wr(e, s, r), r;
};
const Kt = ["moisture", "temperature", "battery"];
let Ke = class extends $ {
  constructor() {
    super(...arguments), this._bigKeys = ["moisture"];
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Fn), document.createElement(
      "horos-plant-tile-editor"
    );
  }
  static getStubConfig() {
    return { moisture: "" };
  }
  setConfig(t) {
    if (!t.moisture)
      throw new Error("Нужно указать сущность влажности почвы (moisture)");
    const e = t.dry_below ?? Bt, s = t.wet_above ?? qt;
    if (e >= s)
      throw new Error("dry_below должен быть меньше wet_above");
    this._bigKeys = Y(t.big_values, "moisture", Kt), this.base = t, this._config = t;
  }
  render() {
    if (!this._config || !this.hass) return d;
    const t = this._config, e = Kt.map((l) => ({
      key: l,
      role: m(this.hass, t[l])
    })), s = this.missingRolesWarning(e.map((l) => l.role));
    if (s) return this.renderWarning(s);
    const { big: n, rest: r } = J(e, this._bigKeys), i = e[0].role, o = M(i), a = Vr(
      o,
      t.dry_below ?? Bt,
      t.wet_above ?? qt
    );
    return this.renderTile({
      icon: Hr[a],
      color: Lr[a],
      primary: $t(t.name, i),
      imageUrl: this.entityImage(i?.stateObj),
      defaultIconAction: Pt(i?.entityId),
      secondary: S([
        R(this.hass, i),
        ...r.map((l) => w(this.hass, l.role))
      ]),
      mainEntityId: i?.entityId,
      values: this.bigValues(n),
      // Шкала — штатная feature HA, а не своя полоса. Цвет она берёт из
      // --tile-color, то есть из наших порогов сухости.
      ownFeatures: o === void 0 ? void 0 : [{ type: "bar-gauge", min: 0, max: 100 }]
    });
  }
};
ps([
  v()
], Ke.prototype, "_config", 2);
Ke = ps([
  g("horos-plant-tile")
], Ke);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "horos-plant-tile",
  name: "Растение",
  description: "Влажность почвы шкалой, температура почвы и заряд датчика в одной плитке",
  preview: !0
});
var Br = Object.defineProperty, De = (t, e, s, n) => {
  for (var r = void 0, i = t.length - 1, o; i >= 0; i--)
    (o = t[i]) && (r = o(e, s, r) || r);
  return r && Br(e, s, r), r;
};
class he extends K {
  constructor() {
    super(...arguments), this._children = [];
  }
  static {
    this.styles = gt`
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
    const s = await e(), n = this.headingConfig();
    this._heading = n ? s.createCardElement(n) : void 0, this._children = this.childConfigs().map(
      (r) => s.createCardElement(r)
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
De([
  Te({ attribute: !1 })
], he.prototype, "hass");
De([
  v()
], he.prototype, "_heading");
De([
  v()
], he.prototype, "_children");
De([
  v()
], he.prototype, "_error");
function qr(t) {
  if (!t) return;
  const e = t.split(":").pop();
  return e ? e.trim() : t;
}
function Kr(t) {
  return typeof t == "string" ? { entity: t } : t;
}
var Gr = Object.defineProperty, Yr = Object.getOwnPropertyDescriptor, fs = (t, e, s, n) => {
  for (var r = n > 1 ? void 0 : n ? Yr(e, s) : e, i = t.length - 1, o; i >= 0; i--)
    (o = t[i]) && (r = (n ? o(e, s, r) : o(r)) || r);
  return n && r && Gr(e, s, r), r;
};
const Jr = 3;
let Ge = class extends he {
  static async getConfigElement() {
    return await Promise.resolve().then(() => Kn), document.createElement(
      "horos-buttons-tile-editor"
    );
  }
  static getStubConfig() {
    return { buttons: [] };
  }
  setConfig(t) {
    if (!t.buttons?.length)
      throw new Error("Нужно указать хотя бы одну кнопку (buttons)");
    this._config = t, this.rebuild();
  }
  columns() {
    return this._config?.columns ?? Jr;
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
    return this._config ? this._config.buttons.map((t) => {
      const e = Kr(t), s = this.hass?.states[e.entity];
      return {
        type: "button",
        entity: e.entity,
        name: e.name ?? qr(s?.attributes.friendly_name),
        icon: e.icon,
        show_state: !1,
        tap_action: { action: "toggle" }
      };
    }) : [];
  }
};
fs([
  v()
], Ge.prototype, "_config", 2);
Ge = fs([
  g("horos-buttons-tile")
], Ge);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "horos-buttons-tile",
  name: "Кнопки скриптов",
  description: "Сетка кнопок, вызывающих скрипты, с общим заголовком",
  preview: !0
});
const se = gt`
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
function re(t, e) {
  return b`
    <div class="levels">
      ${t.map(
    (s) => b`
          <button
            class="level ${s.alarm ? "low" : ""}"
            style="--ink: ${s.ink};"
            title="${s.name}: ${s.text}"
            @click=${(n) => {
      n.stopPropagation(), e(s.entityId);
    }}
          >
            <span class="name">
              ${s.alarm ? b`<ha-icon
                    icon=${s.alarmIcon ?? "mdi:alert-circle"}
                  ></ha-icon>` : d}${s.name}
            </span>
            <span class="bar">
              <span
                class="fill"
                style="width: ${Math.max(0, Math.min(100, s.level))}%"
              ></span>
              <span class="rest"></span>
            </span>
            <span class="value">${s.text}</span>
          </button>
        `
  )}
    </div>
  `;
}
function ne(t, e) {
  if (t) {
    if (e && t.startsWith(e)) {
      const s = t.slice(e.length).trim();
      if (s) return s;
    }
    return t;
  }
}
function me(t) {
  return t === void 0 ? "var(--state-unavailable-color)" : t >= 70 ? "var(--state-sensor-battery-high-color, #4caf50)" : t >= 30 ? "var(--state-sensor-battery-medium-color, #ffa600)" : "var(--state-sensor-battery-low-color, #db4437)";
}
const Qr = me;
function Xr(t) {
  return t === void 0 ? "var(--state-unavailable-color)" : t >= 90 ? "var(--error-color, #db4437)" : t >= 80 ? "var(--warning-color, #ffa600)" : "var(--state-icon-color)";
}
const Zr = [
  [/black|pgbk|_bk(_|$)/i, "black"],
  [/cyan/i, "cyan"],
  [/magenta/i, "purple"],
  [/yellow/i, "yellow"],
  // MC — сервисный бак, а не чернила. Своим оттенком, иначе он
  // неотличим от чёрного: тот красится цветом текста и тоже выходит серым.
  [/_mc(_|$)|maintenance/i, "blue-grey"]
];
function en(t) {
  return Zr.find(([s]) => s.test(t))?.[1];
}
function tn(t) {
  return t === "black" ? "var(--primary-text-color)" : /^(#|rgb|hsl|var\()/.test(t) ? t : `var(--${t}-color, var(--state-icon-color))`;
}
const sn = ne;
function O(t) {
  return typeof t == "string" ? { entity: t } : t;
}
const Gt = (t, e) => typeof t == "number" && Number.isFinite(t) ? t : e;
function rn(t, e, s) {
  const n = Number(t);
  if (!Number.isFinite(n)) return;
  const r = Gt(e.marker_high_level, 100), i = Gt(e.marker_low_level, 0), o = String(e.marker_type ?? "").includes("waste"), a = r > 0 ? Math.max(0, Math.min(100, n / r * 100)) : 0, l = o ? n >= r : n <= (s ?? i);
  return { fill: a, alarm: l, fills: o };
}
var nn = Object.defineProperty, on = Object.getOwnPropertyDescriptor, _s = (t, e, s, n) => {
  for (var r = n > 1 ? void 0 : n ? on(e, s) : e, i = t.length - 1, o; i >= 0; i--)
    (o = t[i]) && (r = (n ? o(e, s, r) : o(r)) || r);
  return n && r && nn(e, s, r), r;
};
let we = class extends $ {
  static async getConfigElement() {
    return await Promise.resolve().then(() => Jn), document.createElement(
      "horos-printer-tile-editor"
    );
  }
  static getStubConfig() {
    return { cartridges: [] };
  }
  setConfig(t) {
    if (!t.cartridges?.length)
      throw new Error("Нужно указать хотя бы один картридж (cartridges)");
    this.base = t, this._config = t;
  }
  get _printerName() {
    return this._config?.name ? this._config.name : (this._config?.status ? this.hass?.states[this._config.status] : void 0)?.attributes.friendly_name;
  }
  _tanks() {
    if (!this._config || !this.hass) return [];
    const t = this._printerName;
    return this._config.cartridges.map((e) => O(e)).map((e) => {
      const s = this.hass.states[e.entity];
      return {
        entityId: e.entity,
        name: e.name ?? sn(s?.attributes.friendly_name, t),
        ink: tn(
          e.color ?? en(e.entity) ?? "grey"
        ),
        marker: s ? rn(
          s.state,
          s.attributes,
          this._config.low_below
        ) : void 0,
        text: s ? this.hass.formatEntityState(s) : "—"
      };
    });
  }
  render() {
    if (!this._config || !this.hass) return d;
    const t = this._tanks(), e = t.filter((a) => !a.marker && a.text === "—");
    if (e.length)
      return this.renderWarning(
        `Сущности не найдены: ${e.map((a) => a.entityId).join(", ")}`
      );
    const n = t.filter((a) => a.marker && !a.marker.fills).reduce(
      (a, l) => !a || l.marker.fill < a.marker.fill ? l : a,
      void 0
    ), r = this._config.status ? m(this.hass, this._config.status) : void 0, i = (this._config.sensors ?? []).map((a) => O(a)).map((a) => m(this.hass, a.entity)), o = r?.stateObj;
    return this.renderTile({
      icon: "mdi:printer",
      color: o ? k(o) : "var(--state-icon-color)",
      primary: this._printerName ?? "Принтер",
      secondary: S([
        w(this.hass, r),
        ...i.map((a) => w(this.hass, a))
      ]),
      mainEntityId: this._config.status ?? n?.entityId,
      values: n ? [
        {
          value: String(Math.round(n.marker.fill)),
          unit: "%",
          entityId: n.entityId
        }
      ] : [],
      customFeatures: re(
        t.map((a) => ({
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
};
we.styles = [G, se];
_s([
  v()
], we.prototype, "_config", 2);
we = _s([
  g("horos-printer-tile")
], we);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "horos-printer-tile",
  name: "Принтер",
  description: "Состояние принтера и уровни чернил колбами в одной плитке",
  preview: !0
});
var an = Object.defineProperty, ln = Object.getOwnPropertyDescriptor, gs = (t, e, s, n) => {
  for (var r = n > 1 ? void 0 : n ? ln(e, s) : e, i = t.length - 1, o; i >= 0; i--)
    (o = t[i]) && (r = (n ? o(e, s, r) : o(r)) || r);
  return n && r && an(e, s, r), r;
};
const cn = 20;
let $e = class extends $ {
  static async getConfigElement() {
    return await Promise.resolve().then(() => Zn), document.createElement(
      "horos-vacuum-tile-editor"
    );
  }
  static getStubConfig() {
    return { vacuum: "" };
  }
  setConfig(t) {
    if (!t.vacuum)
      throw new Error("Нужно указать пылесос (vacuum)");
    this.base = t, this._config = t;
  }
  render() {
    if (!this._config || !this.hass) return d;
    const t = this._config, e = m(this.hass, t.vacuum), s = m(this.hass, t.battery), n = (t.sensors ?? []).map((l) => O(l)).map((l) => m(this.hass, l.entity)), r = this.missingRolesWarning([e, s, ...n]);
    if (r) return this.renderWarning(r);
    const i = e?.stateObj?.attributes.friendly_name, o = t.low_below ?? cn, a = (t.consumables ?? []).map((l) => O(l)).map((l) => {
      const u = m(this.hass, l.entity), c = M(u) ?? 0, h = l.name ?? ne(u?.stateObj?.attributes.friendly_name, i);
      return {
        entityId: l.entity,
        name: h ?? l.entity,
        text: `${c}%`,
        // Цветом плитки красить нельзя: у стоящего на базе пылесоса он
        // неактивный, и все колбы выходят одинаково серыми. Красим по
        // уровню — вопрос у расходника тот же, что у батарейки.
        ink: l.color ?? me(c),
        level: c,
        alarm: c < o
      };
    });
    return this.renderTile({
      icon: "mdi:robot-vacuum",
      color: k(e?.stateObj),
      primary: t.name ?? i ?? "Пылесос",
      mainEntityId: e?.entityId,
      secondary: S([
        R(this.hass, e),
        w(this.hass, e),
        ...n.map((l) => w(this.hass, l))
      ]),
      values: s ? this.bigValues([{ key: "battery", role: s }]) : [],
      customFeatures: a.length ? re(a, (l) => this.fireMoreInfo(l)) : void 0
    });
  }
};
$e.styles = [G, se];
gs([
  v()
], $e.prototype, "_config", 2);
$e = gs([
  g("horos-vacuum-tile")
], $e);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "horos-vacuum-tile",
  name: "Пылесос",
  description: "Состояние робота, заряд и ресурс расходников в одной плитке",
  preview: !0
});
var un = Object.defineProperty, dn = Object.getOwnPropertyDescriptor, ys = (t, e, s, n) => {
  for (var r = n > 1 ? void 0 : n ? dn(e, s) : e, i = t.length - 1, o; i >= 0; i--)
    (o = t[i]) && (r = (n ? o(e, s, r) : o(r)) || r);
  return n && r && un(e, s, r), r;
};
const hn = 30;
let Ye = class extends $ {
  static async getConfigElement() {
    return await Promise.resolve().then(() => si), document.createElement(
      "horos-batteries-tile-editor"
    );
  }
  static getStubConfig() {
    return { batteries: [] };
  }
  setConfig(t) {
    if (!t.batteries?.length)
      throw new Error("Нужно указать хотя бы одну батарейку (batteries)");
    this.base = t, this._config = t;
  }
  render() {
    if (!this._config || !this.hass) return d;
    const t = this._config, e = t.low_below ?? hn, s = [], n = [];
    for (const o of t.batteries) {
      const a = O(o), l = m(this.hass, a.entity);
      if (l?.missing) {
        n.push(a.entity);
        continue;
      }
      const u = M(l);
      u !== void 0 && s.push({
        entityId: a.entity,
        name: a.name ?? l?.stateObj?.attributes.friendly_name ?? a.entity,
        level: u
      });
    }
    if (n.length)
      return this.renderWarning(`Сущности не найдены: ${n.join(", ")}`);
    const r = s.filter((o) => o.level < e).sort((o, a) => o.level - a.level), i = r[0];
    return this.renderTile({
      icon: i ? "mdi:battery-alert-variant-outline" : "mdi:battery",
      color: Qr(i?.level),
      primary: t.name ?? "Батарейки",
      mainEntityId: i?.entityId,
      secondary: S(
        r.length ? r.map((o) => ({
          text: `${o.name} ${o.level}%`,
          entityId: o.entityId
        })) : [{ text: `Все заряжены, ${s.length} шт.` }]
      ),
      values: i ? [{ value: String(i.level), unit: "%", entityId: i.entityId }] : []
    });
  }
};
ys([
  v()
], Ye.prototype, "_config", 2);
Ye = ys([
  g("horos-batteries-tile")
], Ye);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "horos-batteries-tile",
  name: "Батарейки",
  description: "Только садящиеся батарейки, от самой пустой",
  preview: !0
});
var mn = Object.defineProperty, pn = Object.getOwnPropertyDescriptor, bs = (t, e, s, n) => {
  for (var r = n > 1 ? void 0 : n ? pn(e, s) : e, i = t.length - 1, o; i >= 0; i--)
    (o = t[i]) && (r = (n ? o(e, s, r) : o(r)) || r);
  return n && r && mn(e, s, r), r;
};
let Je = class extends $ {
  static async getConfigElement() {
    return await Promise.resolve().then(() => ii), document.createElement(
      "horos-safety-tile-editor"
    );
  }
  static getStubConfig() {
    return { sensors: [] };
  }
  setConfig(t) {
    if (!t.sensors?.length)
      throw new Error("Нужно указать хотя бы один датчик (sensors)");
    this.base = t, this._config = t;
  }
  render() {
    if (!this._config || !this.hass) return d;
    const t = this._config, e = [], s = [], n = [];
    let r = 0;
    for (const a of t.sensors) {
      const l = O(a), u = m(this.hass, l.entity);
      if (u?.missing) {
        n.push(l.entity);
        continue;
      }
      r += 1;
      const c = l.name ?? u?.stateObj?.attributes.friendly_name ?? l.entity;
      u?.unavailable ? s.push({ text: `${c}: нет связи`, entityId: l.entity }) : u?.stateObj?.state === "on" && e.push({ text: c, entityId: l.entity });
    }
    if (n.length)
      return this.renderWarning(`Сущности не найдены: ${n.join(", ")}`);
    const i = e.length > 0, o = [...e, ...s];
    return this.renderTile({
      icon: i ? "mdi:shield-alert" : s.length ? "mdi:shield-off-outline" : "mdi:shield-check",
      color: i ? "var(--error-color, #db4437)" : s.length ? "var(--warning-color, #ffa600)" : "var(--success-color, #43a047)",
      primary: t.name ?? "Безопасность",
      mainEntityId: o[0]?.entityId,
      secondary: S(
        o.length ? o : [{ text: `Всё спокойно, ${r} датч.` }]
      )
    });
  }
};
bs([
  v()
], Je.prototype, "_config", 2);
Je = bs([
  g("horos-safety-tile")
], Je);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "horos-safety-tile",
  name: "Безопасность",
  description: "Протечка, дым, газ — и датчики, потерявшие связь",
  preview: !0
});
var fn = Object.defineProperty, _n = Object.getOwnPropertyDescriptor, vs = (t, e, s, n) => {
  for (var r = n > 1 ? void 0 : n ? _n(e, s) : e, i = t.length - 1, o; i >= 0; i--)
    (o = t[i]) && (r = (n ? o(e, s, r) : o(r)) || r);
  return n && r && fn(e, s, r), r;
};
const Yt = ["disk", "download", "upload"];
let Qe = class extends $ {
  constructor() {
    super(...arguments), this._bigKeys = ["disk"];
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => li), document.createElement(
      "horos-server-tile-editor"
    );
  }
  static getStubConfig() {
    return { disk: "" };
  }
  setConfig(t) {
    if (!t.disk && !t.download && !t.status)
      throw new Error(
        "Нужна хотя бы одна сущность: status, disk или download"
      );
    this._bigKeys = Y(t.big_values, "disk", Yt), this.base = t, this._config = t;
  }
  render() {
    if (!this._config || !this.hass) return d;
    const t = this._config, e = Yt.map((a) => ({
      key: a,
      role: m(this.hass, t[a])
    })), s = m(this.hass, t.status), n = (t.services ?? []).map((a) => O(a)).map((a) => m(this.hass, a.entity)), r = this.missingRolesWarning([
      s,
      ...e.map((a) => a.role),
      ...n
    ]);
    if (r) return this.renderWarning(r);
    const { big: i, rest: o } = J(e, this._bigKeys);
    return this.renderTile({
      icon: "mdi:server",
      color: s ? k(s.stateObj) : "var(--state-icon-color)",
      primary: t.name ?? "Домашний сервер",
      mainEntityId: s?.entityId ?? e[0].role?.entityId,
      secondary: S([
        R(this.hass, s),
        w(this.hass, s),
        ...o.map((a) => {
          const l = w(this.hass, a.role);
          if (!l) return;
          const u = a.key === "download" ? "↓ " : a.key === "upload" ? "↑ " : "";
          return { ...l, text: u + l.text };
        }),
        ...n.map((a) => w(this.hass, a))
      ]),
      values: this.bigValues(i)
    });
  }
};
vs([
  v()
], Qe.prototype, "_config", 2);
Qe = vs([
  g("horos-server-tile")
], Qe);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "horos-server-tile",
  name: "Домашний сервер",
  description: "Диск, скорости и состояние сервисов в одной плитке",
  preview: !0
});
var gn = Object.defineProperty, yn = Object.getOwnPropertyDescriptor, ws = (t, e, s, n) => {
  for (var r = n > 1 ? void 0 : n ? yn(e, s) : e, i = t.length - 1, o; i >= 0; i--)
    (o = t[i]) && (r = (n ? o(e, s, r) : o(r)) || r);
  return n && r && gn(e, s, r), r;
};
let Pe = class extends $ {
  static async getConfigElement() {
    return await Promise.resolve().then(() => di), document.createElement(
      "horos-person-tile-editor"
    );
  }
  static getStubConfig() {
    return { person: "" };
  }
  setConfig(t) {
    if (!t.person)
      throw new Error("Нужно указать человека (person)");
    this.base = { show_entity_picture: !0, ...t }, this._config = t;
  }
  render() {
    if (!this._config || !this.hass) return d;
    const t = this._config, e = m(this.hass, t.person), s = m(this.hass, t.battery), n = m(this.hass, t.location), r = this.missingRolesWarning([e, s, n]);
    if (r) return this.renderWarning(r);
    const i = (t.devices ?? []).map((o) => O(o)).map((o) => {
      const a = m(this.hass, o.entity), l = M(a), u = o.name ?? ne(
        a?.stateObj?.attributes.friendly_name,
        t.name
      ) ?? o.entity;
      return {
        entityId: o.entity,
        name: u,
        text: l === void 0 ? "нет данных" : `${l}%`,
        ink: o.color ?? me(l),
        level: l ?? 0,
        alarm: l !== void 0 && l < 20,
        alarmIcon: "mdi:battery-alert-variant-outline"
      };
    });
    return this.renderTile({
      icon: "mdi:account",
      color: k(e?.stateObj),
      primary: t.name ?? e?.stateObj?.attributes.friendly_name ?? "Человек",
      mainEntityId: e?.entityId,
      imageUrl: this.entityImage(e?.stateObj),
      secondary: S([
        R(this.hass, e),
        w(this.hass, e),
        w(this.hass, n)
      ]),
      values: s ? this.bigValues([{ key: "battery", role: s }]) : [],
      customFeatures: i.length ? re(i, (o) => this.fireMoreInfo(o)) : void 0
    });
  }
};
Pe.styles = [G, se];
ws([
  v()
], Pe.prototype, "_config", 2);
Pe = ws([
  g("horos-person-tile")
], Pe);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "horos-person-tile",
  name: "Человек",
  description: "Дома ли, где именно и заряд его устройств",
  preview: !0
});
function ze(t, e, s) {
  if (!t || !e?.length) return;
  let n, r;
  for (const i of e) {
    const o = m(t, i), a = M(o);
    a !== void 0 && (r === void 0 || (s === "max" ? a > r : a < r)) && (n = o, r = a);
  }
  return n ?? m(t, e[0]);
}
var bn = Object.defineProperty, vn = Object.getOwnPropertyDescriptor, $s = (t, e, s, n) => {
  for (var r = n > 1 ? void 0 : n ? vn(e, s) : e, i = t.length - 1, o; i >= 0; i--)
    (o = t[i]) && (r = (n ? o(e, s, r) : o(r)) || r);
  return n && r && bn(e, s, r), r;
};
const wn = [
  "temperature",
  "cpu",
  "memory",
  "gpu",
  "disk"
];
let Ee = class extends $ {
  constructor() {
    super(...arguments), this._bigKeys = ["temperature"];
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => pi), document.createElement(
      "horos-computer-tile-editor"
    );
  }
  static getStubConfig() {
    return { cpu: "" };
  }
  setConfig(t) {
    if (!t.cpu && !t.memory && !t.temperatures?.length && !t.disks?.length && !t.disks_free?.length)
      throw new Error(
        "Нужна хотя бы одна сущность: cpu, memory, temperatures или disks"
      );
    this._bigKeys = Y(
      t.big_values,
      "temperature",
      wn
    ), this.base = t, this._config = t;
  }
  /** Роли карточки: списки уже сведены к крайнему датчику. */
  _roles() {
    const t = this._config;
    return [
      {
        key: "temperature",
        role: ze(this.hass, t.temperatures, "max")
      },
      { key: "cpu", role: m(this.hass, t.cpu) },
      { key: "memory", role: m(this.hass, t.memory) },
      { key: "gpu", role: m(this.hass, t.gpu) },
      { key: "disk", role: ze(this.hass, t.disks, "max") }
    ];
  }
  /** Раздел с наименьшим запасом свободного места. */
  _freeDisk() {
    return ze(this.hass, this._config?.disks_free, "min");
  }
  _levelRow(t, e) {
    if (!e) return;
    const s = M(e);
    return {
      entityId: e.entityId,
      name: t,
      text: s === void 0 ? "нет данных" : `${Math.round(s)}%`,
      ink: Xr(s),
      level: s ?? 0,
      alarm: s !== void 0 && s >= 90,
      alarmIcon: "mdi:alert-circle"
    };
  }
  render() {
    if (!this._config || !this.hass) return d;
    const t = this._config, e = this._roles(), s = m(this.hass, t.status), n = (t.sensors ?? []).map((c) => O(c)).map((c) => m(this.hass, c.entity)), r = this.missingRolesWarning([
      s,
      ...e.map((c) => c.role),
      ...n
    ]);
    if (r) return this.renderWarning(r);
    const i = (t.alerts ?? []).map((c) => O(c)).map((c) => ({ alert: c, role: m(this.hass, c.entity) })).filter(({ role: c }) => c?.stateObj?.state === "on").map(({ alert: c, role: h }) => ({
      text: c.name ?? ne(
        h?.stateObj?.attributes.friendly_name,
        t.name
      ) ?? c.entity,
      entityId: c.entity
    })), { big: o } = J(e, this._bigKeys), a = this._freeDisk(), l = M(a), u = [
      this._levelRow("CPU", e[1].role),
      this._levelRow("Память", e[2].role),
      this._levelRow("GPU", e[3].role),
      this._levelRow("Диск", e[4].role),
      // Свободное место — ресурс, который кончается, поэтому и цвет, и тревога
      // здесь как у батарейки, а не как у загрузки.
      a ? {
        entityId: a.entityId,
        name: "Свободно",
        text: l === void 0 ? "нет данных" : `${Math.round(l)}%`,
        ink: me(l),
        level: l ?? 0,
        alarm: l !== void 0 && l < 10,
        alarmIcon: "mdi:harddisk"
      } : void 0
    ].filter((c) => !!c);
    return this.renderTile({
      icon: "mdi:desktop-tower-monitor",
      color: s ? k(s.stateObj) : "var(--state-icon-color)",
      primary: t.name ?? "Компьютер",
      mainEntityId: s?.entityId ?? e[0].role?.entityId ?? a?.entityId,
      secondary: S([
        R(this.hass, s),
        ...i,
        ...n.map((c) => w(this.hass, c)),
        // Загрузка и диски уже показаны полосами со своими подписями.
        ...this._bigKeys.includes("temperature") ? [] : [w(this.hass, e[0].role)]
      ]),
      values: this.bigValues(o),
      customFeatures: u.length ? re(u, (c) => this.fireMoreInfo(c)) : void 0
    });
  }
};
Ee.styles = [G, se];
$s([
  v()
], Ee.prototype, "_config", 2);
Ee = $s([
  g("horos-computer-tile")
], Ee);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "horos-computer-tile",
  name: "Компьютер",
  description: "Самая горячая точка, загрузка и диски одной плиткой",
  preview: !0
});
var $n = Object.defineProperty, Pn = Object.getOwnPropertyDescriptor, Ps = (t, e, s, n) => {
  for (var r = n > 1 ? void 0 : n ? Pn(e, s) : e, i = t.length - 1, o; i >= 0; i--)
    (o = t[i]) && (r = (n ? o(e, s, r) : o(r)) || r);
  return n && r && $n(e, s, r), r;
};
const Jt = ["pm25", "humidity", "temperature", "power"];
let Xe = class extends $ {
  constructor() {
    super(...arguments), this._bigKeys = ["pm25"];
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => gi), document.createElement("horos-air-tile-editor");
  }
  static getStubConfig() {
    return { appliance: "" };
  }
  setConfig(t) {
    if (!t.appliance)
      throw new Error("Нужно указать прибор (appliance)");
    this._bigKeys = Y(t.big_values, "pm25", Jt), this.base = t, this._config = t;
  }
  render() {
    if (!this._config || !this.hass) return d;
    const t = this._config, e = m(this.hass, t.appliance), s = Jt.map((l) => {
      const u = m(this.hass, t[l]);
      if (l === "pm25") {
        const c = M(u);
        if (c !== void 0 && c < 0) return { key: l, role: void 0 };
      }
      return { key: l, role: u };
    }), n = (t.sensors ?? []).map((l) => O(l)).map((l) => m(this.hass, l.entity)), r = this.missingRolesWarning([
      e,
      ...s.map((l) => l.role),
      ...n
    ]);
    if (r) return this.renderWarning(r);
    const i = (t.alerts ?? []).map((l) => O(l)).map((l) => ({ alert: l, role: m(this.hass, l.entity) })).filter(({ role: l }) => l?.stateObj?.state === "on").map(({ alert: l, role: u }) => ({
      text: l.name ?? ne(
        u?.stateObj?.attributes.friendly_name,
        t.name
      ) ?? l.entity,
      entityId: l.entity
    })), { big: o, rest: a } = J(s, this._bigKeys);
    return this.renderTile({
      icon: t.humidity ? "mdi:air-humidifier" : "mdi:air-filter",
      color: k(e?.stateObj),
      primary: t.name ?? e?.stateObj?.attributes.friendly_name ?? "Воздух",
      mainEntityId: e?.entityId,
      secondary: S([
        R(this.hass, e),
        ...i,
        w(this.hass, e),
        ...n.map((l) => w(this.hass, l)),
        ...a.map((l) => w(this.hass, l.role))
      ]),
      values: this.bigValues(o)
    });
  }
};
Ps([
  v()
], Xe.prototype, "_config", 2);
Xe = Ps([
  g("horos-air-tile")
], Xe);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "horos-air-tile",
  name: "Воздух",
  description: "Очиститель, рекуператор, увлажнитель — прибор и что с воздухом",
  preview: !0
});
var En = Object.defineProperty, Cn = Object.getOwnPropertyDescriptor, Es = (t, e, s, n) => {
  for (var r = n > 1 ? void 0 : n ? Cn(e, s) : e, i = t.length - 1, o; i >= 0; i--)
    (o = t[i]) && (r = (n ? o(e, s, r) : o(r)) || r);
  return n && r && En(e, s, r), r;
};
const Qt = ["illuminance", "battery"], On = 1, Sn = 2, xn = 4;
let Ce = class extends $ {
  constructor() {
    super(...arguments), this._bigKeys = ["illuminance"];
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => vi), document.createElement(
      "horos-cover-tile-editor"
    );
  }
  static getStubConfig() {
    return { cover: "" };
  }
  setConfig(t) {
    if (!t.cover)
      throw new Error("Нужно указать штору (cover)");
    this._bigKeys = Y(t.big_values, "illuminance", Qt), this.base = t, this._config = t;
  }
  render() {
    if (!this._config || !this.hass) return d;
    const t = this._config, e = m(this.hass, t.cover), s = m(this.hass, t.position), n = Qt.map((p) => ({
      key: p,
      role: m(this.hass, t[p])
    })), r = this.missingRolesWarning([
      e,
      s,
      ...n.map((p) => p.role)
    ]);
    if (r) return this.renderWarning(r);
    const { big: i, rest: o } = J(n, this._bigKeys), a = Number(
      e?.stateObj?.attributes.supported_features ?? 0
    ), l = (a & xn) !== 0, u = (a & (On | Sn)) !== 0, c = [];
    t.controls !== !1 && (l && c.push({ type: "cover-position" }), u && c.push({ type: "cover-open-close" }));
    const h = M(s), y = s && !l ? [
      {
        entityId: s.entityId,
        name: "Открыто",
        text: h === void 0 ? "нет данных" : `${Math.round(h)}%`,
        ink: me(h),
        level: h ?? 0
      }
    ] : [];
    return this.renderTile({
      icon: "mdi:curtains",
      color: k(e?.stateObj),
      primary: t.name ?? e?.stateObj?.attributes.friendly_name ?? "Шторы",
      mainEntityId: e?.entityId,
      secondary: S([
        R(this.hass, e),
        w(this.hass, e),
        ...o.map((p) => w(this.hass, p.role))
      ]),
      values: this.bigValues(i),
      ownFeatures: c.length ? c : void 0,
      customFeatures: y.length ? re(y, (p) => this.fireMoreInfo(p)) : void 0
    });
  }
};
Ce.styles = [G, se];
Es([
  v()
], Ce.prototype, "_config", 2);
Ce = Es([
  g("horos-cover-tile")
], Ce);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "horos-cover-tile",
  name: "Шторы",
  description: "Насколько открыты, светло ли снаружи и сколько заряда",
  preview: !0
});
var Tn = Object.defineProperty, In = Object.getOwnPropertyDescriptor, Cs = (t, e, s, n) => {
  for (var r = n > 1 ? void 0 : n ? In(e, s) : e, i = t.length - 1, o; i >= 0; i--)
    (o = t[i]) && (r = (n ? o(e, s, r) : o(r)) || r);
  return n && r && Tn(e, s, r), r;
};
const Dn = 5;
let Oe = class extends $ {
  static async getConfigElement() {
    return await Promise.resolve().then(() => Pi), document.createElement(
      "horos-energy-tile-editor"
    );
  }
  static getStubConfig() {
    return { consumers: [] };
  }
  setConfig(t) {
    if (!t.consumers?.length)
      throw new Error("Нужно указать хотя бы одного потребителя (consumers)");
    this.base = t, this._config = t;
  }
  render() {
    if (!this._config || !this.hass) return d;
    const t = this._config, e = m(this.hass, t.total), s = [], n = [], r = [];
    for (const u of t.consumers) {
      const c = O(u), h = m(this.hass, c.entity);
      if (h?.missing) {
        s.push(c.entity);
        continue;
      }
      const y = c.name ?? ne(h?.stateObj?.attributes.friendly_name, t.name) ?? c.entity;
      if (h?.unavailable) {
        n.push(y);
        continue;
      }
      const p = M(h);
      p === void 0 || p <= 0 || r.push({
        watts: p,
        row: {
          entityId: c.entity,
          name: y,
          text: this.hass.formatEntityState(h.stateObj),
          ink: c.color ?? "var(--amber-color, #ffc107)"
        }
      });
    }
    if (s.length)
      return this.renderWarning(`Сущности не найдены: ${s.join(", ")}`);
    r.sort((u, c) => c.watts - u.watts);
    const i = r.slice(0, t.limit ?? Dn), o = i[0]?.watts ?? 0, a = i.map(({ row: u, watts: c }) => ({
      ...u,
      level: o > 0 ? c / o * 100 : 0
    })), l = [
      R(this.hass, e),
      r.length ? { text: `${r.length} потребляют` } : { text: "Никто не потребляет" },
      n.length ? { text: `${n.length} без связи` } : void 0
    ];
    return this.renderTile({
      icon: "mdi:flash",
      color: "var(--amber-color, #ffc107)",
      primary: t.name ?? "Энергия",
      mainEntityId: e?.entityId ?? i[0]?.row.entityId,
      secondary: S([w(this.hass, e), ...l]),
      values: e ? this.bigValues([{ key: "total", role: e }]) : [],
      customFeatures: a.length ? re(a, (u) => this.fireMoreInfo(u)) : void 0
    });
  }
};
Oe.styles = [G, se];
Cs([
  v()
], Oe.prototype, "_config", 2);
Oe = Cs([
  g("horos-energy-tile")
], Oe);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "horos-energy-tile",
  name: "Энергия",
  description: "Кто в доме ест электричество, от самого прожорливого",
  preview: !0
});
var An = Object.defineProperty, jn = Object.getOwnPropertyDescriptor, Os = (t, e, s, n) => {
  for (var r = n > 1 ? void 0 : n ? jn(e, s) : e, i = t.length - 1, o; i >= 0; i--)
    (o = t[i]) && (r = (n ? o(e, s, r) : o(r)) || r);
  return n && r && An(e, s, r), r;
};
let Ze = class extends $ {
  static async getConfigElement() {
    return await Promise.resolve().then(() => Oi), document.createElement(
      "horos-presence-tile-editor"
    );
  }
  static getStubConfig() {
    return { areas: [] };
  }
  setConfig(t) {
    if (!t.areas?.length)
      throw new Error("Нужно указать хотя бы одну зону (areas)");
    this.base = t, this._config = t;
  }
  render() {
    if (!this._config || !this.hass) return d;
    const t = this._config, e = [], s = [];
    let n = 0, r = 0;
    for (const i of t.areas) {
      const o = O(i), a = m(this.hass, o.entity);
      if (a?.missing) {
        s.push(o.entity);
        continue;
      }
      if (r += 1, a?.unavailable) {
        n += 1;
        continue;
      }
      a?.stateObj?.state === "on" && e.push({
        text: o.name ?? a.stateObj.attributes.friendly_name ?? o.entity,
        entityId: o.entity
      });
    }
    return s.length ? this.renderWarning(`Сущности не найдены: ${s.join(", ")}`) : this.renderTile({
      icon: e.length ? "mdi:home-account" : "mdi:home-outline",
      color: e.length ? "var(--state-icon-color)" : "var(--state-inactive-color)",
      primary: t.name ?? "Присутствие",
      mainEntityId: e[0]?.entityId,
      secondary: S([
        ...e.length ? e : [{ text: `Пусто, ${r} зон` }],
        n ? { text: `${n} без связи` } : void 0
      ]),
      values: [
        { value: String(e.length), entityId: e[0]?.entityId }
      ]
    });
  }
};
Os([
  v()
], Ze.prototype, "_config", 2);
Ze = Os([
  g("horos-presence-tile")
], Ze);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "horos-presence-tile",
  name: "Присутствие",
  description: "В каких зонах сейчас есть кто-то",
  preview: !0
});
console.info(
  "%c HOROS-CARDS %c 0.1.0 ",
  "background:#03a9f4;color:#fff;border-radius:3px 0 0 3px;padding:2px 4px",
  "background:#555;color:#fff;border-radius:0 3px 3px 0;padding:2px 4px"
);
var Mn = Object.defineProperty, Et = (t, e, s, n) => {
  for (var r = void 0, i = t.length - 1, o; i >= 0; i--)
    (o = t[i]) && (r = o(e, s, r) || r);
  return r && Mn(e, s, r), r;
};
class C extends K {
  constructor() {
    super(...arguments), this._computeLabel = (e) => this.labels[e.name] ?? T[e.name] ?? e.name;
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
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }
  render() {
    return this.renderForm();
  }
}
Et([
  Te({ attribute: !1 })
], C.prototype, "hass");
Et([
  v()
], C.prototype, "_config");
class Ae extends C {
  constructor() {
    super(...arguments), this._featuresEditorReady = !1;
  }
  connectedCallback() {
    super.connectedCallback(), jr().then((e) => {
      this._featuresEditorReady = e;
    });
  }
  /**
   * Форма показывает раскладку картинками (content_layout), а в конфиге лежит
   * булево vertical — ровно как в редакторе штатной плитки.
   */
  get formData() {
    const { vertical: e, ...s } = this._config ?? {};
    return {
      ...s,
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
    const { content_layout: s, ...n } = e, r = { ...n };
    return s === "vertical" && (r.vertical = !0), r;
  }
  render() {
    return !this.hass || !this._config ? d : b`
      ${this.renderForm()}
      ${this._featuresEditorReady ? b`
            <hui-card-features-editor
              .hass=${this.hass}
              .context=${{
      entity_id: this._config[this.entityField]
    }}
              .features=${this._config.features ?? []}
              label="Features"
              @features-changed=${this._featuresChanged}
            ></hui-card-features-editor>
          ` : d}
    `;
  }
}
Et([
  v()
], Ae.prototype, "_featuresEditorReady");
const Ct = (t) => ({
  name: "appearance",
  type: "expandable",
  flatten: !0,
  icon: "mdi:text-short",
  schema: [
    {
      name: "",
      type: "grid",
      schema: [
        {
          name: "icon",
          selector: { icon: {} },
          context: { icon_entity: t }
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
              label: "Горизонтальная",
              image: {
                src: "/static/images/form/tile_content_layout_horizontal.svg",
                src_dark: "/static/images/form/tile_content_layout_horizontal_dark.svg",
                flip_rtl: !0
              }
            },
            {
              value: "vertical",
              label: "Вертикальная",
              image: {
                src: "/static/images/form/tile_content_layout_vertical.svg",
                src_dark: "/static/images/form/tile_content_layout_vertical_dark.svg",
                flip_rtl: !0
              }
            }
          ]
        }
      }
    }
  ]
}), Ve = (t) => ({
  entity_id: t,
  area_id: "area"
}), Ot = (t, e) => ({
  name: "interactions",
  type: "expandable",
  flatten: !0,
  icon: "mdi:gesture-tap",
  schema: [
    {
      name: "tap_action",
      selector: { ui_action: { default_action: "more-info" } },
      context: Ve(t)
    },
    { name: "", type: "divider" },
    {
      name: "icon_tap_action",
      selector: { ui_action: { default_action: e } },
      context: Ve(t)
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
      ].map((s) => ({
        name: s,
        selector: { ui_action: { default_action: "none" } },
        context: Ve(t)
      }))
    }
  ]
}), T = {
  appearance: "Внешний вид",
  interactions: "Взаимодействия",
  icon: "Иконка",
  color: "Цвет",
  content_layout: "Раскладка",
  show_entity_picture: "Картинка сущности",
  hide_state: "Скрыть вторичную строку",
  tap_action: "Тап по карточке",
  hold_action: "Долгое нажатие на карточку",
  double_tap_action: "Двойной тап по карточке",
  icon_tap_action: "Тап по иконке",
  icon_hold_action: "Долгое нажатие на иконку",
  icon_double_tap_action: "Двойной тап по иконке"
}, _ = (t, e) => ({
  entity: {
    filter: e ? { domain: t, device_class: e } : { domain: t }
  }
}), te = (t, e, s) => ({
  number: { min: t, max: e, mode: "box", unit_of_measurement: s }
}), D = { text: {} }, ie = (t) => ({
  select: { multiple: !0, mode: "list", options: t }
}), Rn = { boolean: {} };
var Nn = Object.getOwnPropertyDescriptor, Un = (t, e, s, n) => {
  for (var r = n > 1 ? void 0 : n ? Nn(e, s) : e, i = t.length - 1, o; i >= 0; i--)
    (o = t[i]) && (r = o(r) || r);
  return r;
};
let et = class extends Ae {
  get entityField() {
    return "temperature";
  }
  get schema() {
    return [
      {
        name: "name",
        selector: { entity_name: {} },
        context: { entity: "temperature" }
      },
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
      {
        name: "big_values",
        selector: ie([
          { value: "temperature", label: "Температура" },
          { value: "humidity", label: "Влажность" },
          { value: "illuminance", label: "Освещённость" },
          { value: "pm25", label: "PM2.5" }
        ])
      },
      Ct("temperature"),
      Ot("temperature", "none")
    ];
  }
  get labels() {
    return {
      name: "Название",
      temperature: "Температура",
      humidity: "Влажность",
      illuminance: "Освещённость",
      pm25: "PM2.5",
      big_values: "Крупно справа (не больше двух)"
    };
  }
};
et = Un([
  g("horos-climate-tile-editor")
], et);
const kn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get HorosClimateTileEditor() {
    return et;
  }
}, Symbol.toStringTag, { value: "Module" }));
var zn = Object.getOwnPropertyDescriptor, Vn = (t, e, s, n) => {
  for (var r = n > 1 ? void 0 : n ? zn(e, s) : e, i = t.length - 1, o; i >= 0; i--)
    (o = t[i]) && (r = o(r) || r);
  return r;
};
let tt = class extends Ae {
  get entityField() {
    return "switch";
  }
  get schema() {
    return [
      {
        name: "name",
        selector: { entity_name: {} },
        context: { entity: "switch" }
      },
      { name: "switch", required: !0, selector: _("switch") },
      { name: "power", selector: _("sensor", "power") },
      { name: "energy", selector: _("sensor", "energy") },
      {
        name: "big_values",
        selector: ie([
          { value: "power", label: "Мощность" },
          { value: "energy", label: "Энергия" },
          { value: "switch", label: "Состояние" }
        ])
      },
      { name: "toggle_button", selector: Rn },
      Ct("switch"),
      Ot("switch", "toggle")
    ];
  }
  get labels() {
    return {
      name: "Название",
      switch: "Выключатель",
      power: "Мощность",
      energy: "Энергия",
      big_values: "Крупно справа (не больше двух)",
      toggle_button: "Кнопка переключения под строкой"
    };
  }
};
tt = Vn([
  g("horos-plug-tile-editor")
], tt);
const Ln = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get HorosPlugTileEditor() {
    return tt;
  }
}, Symbol.toStringTag, { value: "Module" }));
var Hn = Object.getOwnPropertyDescriptor, Wn = (t, e, s, n) => {
  for (var r = n > 1 ? void 0 : n ? Hn(e, s) : e, i = t.length - 1, o; i >= 0; i--)
    (o = t[i]) && (r = o(r) || r);
  return r;
};
let st = class extends Ae {
  get entityField() {
    return "moisture";
  }
  get schema() {
    return [
      {
        name: "name",
        selector: { entity_name: {} },
        context: { entity: "moisture" }
      },
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
      { name: "dry_below", selector: te(0, 100, "%") },
      { name: "wet_above", selector: te(0, 100, "%") },
      {
        name: "big_values",
        selector: ie([
          { value: "moisture", label: "Влажность почвы" },
          { value: "temperature", label: "Температура почвы" },
          { value: "battery", label: "Заряд датчика" }
        ])
      },
      Ct("moisture"),
      Ot("moisture", "none")
    ];
  }
  get labels() {
    return {
      name: "Название",
      moisture: "Влажность почвы",
      temperature: "Температура почвы",
      battery: "Заряд датчика",
      dry_below: "Ниже этого — сухо",
      wet_above: "Выше этого — залито",
      big_values: "Крупно справа (не больше двух)"
    };
  }
};
st = Wn([
  g("horos-plant-tile-editor")
], st);
const Fn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get HorosPlantTileEditor() {
    return st;
  }
}, Symbol.toStringTag, { value: "Module" }));
function P(t, e) {
  const s = /* @__PURE__ */ new Map();
  for (const n of t ?? [])
    s.set(typeof n == "string" ? n : n.entity, n);
  return e.map((n) => s.get(n) ?? n);
}
function E(t) {
  return (t ?? []).map(
    (e) => typeof e == "string" ? e : e.entity
  );
}
var Bn = Object.getOwnPropertyDescriptor, qn = (t, e, s, n) => {
  for (var r = n > 1 ? void 0 : n ? Bn(e, s) : e, i = t.length - 1, o; i >= 0; i--)
    (o = t[i]) && (r = o(r) || r);
  return r;
};
let rt = class extends C {
  get schema() {
    return [
      { name: "name", selector: D },
      { name: "icon", selector: { icon: {} } },
      { name: "columns", selector: te(1, 6) },
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
    return {
      ...T,
      name: "Заголовок",
      columns: "Кнопок в ряд",
      buttons: "Кнопки"
    };
  }
  get formData() {
    const t = this._config ?? {};
    return {
      ...t,
      buttons: E(t.buttons)
    };
  }
  fromForm(t) {
    return {
      ...t,
      buttons: P(
        this._config?.buttons,
        t.buttons ?? []
      )
    };
  }
};
rt = qn([
  g("horos-buttons-tile-editor")
], rt);
const Kn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get HorosButtonsTileEditor() {
    return rt;
  }
}, Symbol.toStringTag, { value: "Module" }));
var Gn = Object.getOwnPropertyDescriptor, Yn = (t, e, s, n) => {
  for (var r = n > 1 ? void 0 : n ? Gn(e, s) : e, i = t.length - 1, o; i >= 0; i--)
    (o = t[i]) && (r = o(r) || r);
  return r;
};
let nt = class extends C {
  get schema() {
    return [
      { name: "name", selector: D },
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
    return {
      ...T,
      name: "Название принтера",
      status: "Состояние принтера",
      cartridges: "Картриджи",
      low_below: "Мало чернил ниже",
      sensors: "Прочее про принтер"
    };
  }
  get formData() {
    const t = this._config ?? {};
    return {
      ...t,
      cartridges: E(
        t.cartridges
      ),
      sensors: E(t.sensors)
    };
  }
  fromForm(t) {
    return {
      ...t,
      cartridges: P(
        this._config?.cartridges,
        t.cartridges ?? []
      ),
      sensors: P(
        this._config?.sensors,
        t.sensors ?? []
      )
    };
  }
};
nt = Yn([
  g("horos-printer-tile-editor")
], nt);
const Jn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get HorosPrinterTileEditor() {
    return nt;
  }
}, Symbol.toStringTag, { value: "Module" }));
var Qn = Object.getOwnPropertyDescriptor, Xn = (t, e, s, n) => {
  for (var r = n > 1 ? void 0 : n ? Qn(e, s) : e, i = t.length - 1, o; i >= 0; i--)
    (o = t[i]) && (r = o(r) || r);
  return r;
};
let it = class extends C {
  get schema() {
    return [
      { name: "name", selector: D },
      { name: "vacuum", required: !0, selector: _("vacuum") },
      { name: "battery", selector: _("sensor", "battery") },
      { name: "sensors", selector: { entity: { multiple: !0 } } },
      { name: "consumables", selector: { entity: { multiple: !0 } } },
      { name: "low_below", selector: te(0, 100, "%") }
    ];
  }
  get labels() {
    return {
      ...T,
      name: "Название",
      vacuum: "Пылесос",
      battery: "Заряд",
      sensors: "Что ещё сказать",
      consumables: "Расходники",
      low_below: "Просит замены ниже"
    };
  }
  get formData() {
    const t = this._config ?? {};
    return {
      ...t,
      sensors: E(t.sensors),
      consumables: E(t.consumables)
    };
  }
  fromForm(t) {
    return {
      ...t,
      sensors: P(
        this._config?.sensors,
        t.sensors ?? []
      ),
      consumables: P(
        this._config?.consumables,
        t.consumables ?? []
      )
    };
  }
};
it = Xn([
  g("horos-vacuum-tile-editor")
], it);
const Zn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get HorosVacuumTileEditor() {
    return it;
  }
}, Symbol.toStringTag, { value: "Module" }));
var ei = Object.getOwnPropertyDescriptor, ti = (t, e, s, n) => {
  for (var r = n > 1 ? void 0 : n ? ei(e, s) : e, i = t.length - 1, o; i >= 0; i--)
    (o = t[i]) && (r = o(r) || r);
  return r;
};
let ot = class extends C {
  get schema() {
    return [
      { name: "name", selector: D },
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
      { name: "low_below", selector: te(0, 100, "%") }
    ];
  }
  get labels() {
    return {
      ...T,
      name: "Название",
      batteries: "Батарейки",
      low_below: "Показывать ниже"
    };
  }
  get formData() {
    const t = this._config ?? {};
    return {
      ...t,
      batteries: E(t.batteries)
    };
  }
  fromForm(t) {
    return {
      ...t,
      batteries: P(
        this._config?.batteries,
        t.batteries ?? []
      )
    };
  }
};
ot = ti([
  g("horos-batteries-tile-editor")
], ot);
const si = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get HorosBatteriesTileEditor() {
    return ot;
  }
}, Symbol.toStringTag, { value: "Module" }));
var ri = Object.getOwnPropertyDescriptor, ni = (t, e, s, n) => {
  for (var r = n > 1 ? void 0 : n ? ri(e, s) : e, i = t.length - 1, o; i >= 0; i--)
    (o = t[i]) && (r = o(r) || r);
  return r;
};
let at = class extends C {
  get schema() {
    return [
      { name: "name", selector: D },
      {
        name: "sensors",
        required: !0,
        selector: { entity: { multiple: !0, filter: [{ domain: "binary_sensor" }] } }
      }
    ];
  }
  get labels() {
    return {
      ...T,
      name: "Название",
      sensors: "Датчики"
    };
  }
  get formData() {
    const t = this._config ?? {};
    return {
      ...t,
      sensors: E(t.sensors)
    };
  }
  fromForm(t) {
    return {
      ...t,
      sensors: P(
        this._config?.sensors,
        t.sensors ?? []
      )
    };
  }
};
at = ni([
  g("horos-safety-tile-editor")
], at);
const ii = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get HorosSafetyTileEditor() {
    return at;
  }
}, Symbol.toStringTag, { value: "Module" }));
var oi = Object.getOwnPropertyDescriptor, ai = (t, e, s, n) => {
  for (var r = n > 1 ? void 0 : n ? oi(e, s) : e, i = t.length - 1, o; i >= 0; i--)
    (o = t[i]) && (r = o(r) || r);
  return r;
};
let lt = class extends C {
  get schema() {
    return [
      { name: "name", selector: D },
      { name: "status", selector: { entity: {} } },
      { name: "disk", selector: _("sensor", "data_size") },
      { name: "download", selector: _("sensor", "data_rate") },
      { name: "upload", selector: _("sensor", "data_rate") },
      { name: "services", selector: { entity: { multiple: !0 } } }
    ];
  }
  get labels() {
    return {
      ...T,
      name: "Название",
      status: "Состояние",
      disk: "Свободное место",
      download: "Скорость приёма",
      upload: "Скорость отдачи",
      services: "Что ещё сказать"
    };
  }
  get formData() {
    const t = this._config ?? {};
    return {
      ...t,
      services: E(t.services)
    };
  }
  fromForm(t) {
    return {
      ...t,
      services: P(
        this._config?.services,
        t.services ?? []
      )
    };
  }
};
lt = ai([
  g("horos-server-tile-editor")
], lt);
const li = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get HorosServerTileEditor() {
    return lt;
  }
}, Symbol.toStringTag, { value: "Module" }));
var ci = Object.getOwnPropertyDescriptor, ui = (t, e, s, n) => {
  for (var r = n > 1 ? void 0 : n ? ci(e, s) : e, i = t.length - 1, o; i >= 0; i--)
    (o = t[i]) && (r = o(r) || r);
  return r;
};
let ct = class extends C {
  get schema() {
    return [
      { name: "name", selector: D },
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
    return {
      ...T,
      name: "Имя",
      person: "Человек",
      battery: "Заряд основного устройства",
      location: "Где именно",
      devices: "Остальные устройства"
    };
  }
  get formData() {
    const t = this._config ?? {};
    return {
      ...t,
      devices: E(t.devices)
    };
  }
  fromForm(t) {
    return {
      ...t,
      devices: P(
        this._config?.devices,
        t.devices ?? []
      )
    };
  }
};
ct = ui([
  g("horos-person-tile-editor")
], ct);
const di = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get HorosPersonTileEditor() {
    return ct;
  }
}, Symbol.toStringTag, { value: "Module" }));
var hi = Object.getOwnPropertyDescriptor, mi = (t, e, s, n) => {
  for (var r = n > 1 ? void 0 : n ? hi(e, s) : e, i = t.length - 1, o; i >= 0; i--)
    (o = t[i]) && (r = o(r) || r);
  return r;
};
let ut = class extends C {
  get schema() {
    return [
      { name: "name", selector: D },
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
        selector: ie([
          { value: "temperature", label: "Самая горячая точка" },
          { value: "cpu", label: "Процессор" },
          { value: "memory", label: "Память" },
          { value: "gpu", label: "Видеокарта" },
          { value: "disk", label: "Самый полный диск" }
        ])
      }
    ];
  }
  get labels() {
    return {
      ...T,
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
    };
  }
  get formData() {
    const t = this._config ?? {};
    return {
      ...t,
      sensors: E(t.sensors),
      alerts: E(t.alerts)
    };
  }
  fromForm(t) {
    return {
      ...t,
      sensors: P(
        this._config?.sensors,
        t.sensors ?? []
      ),
      alerts: P(
        this._config?.alerts,
        t.alerts ?? []
      )
    };
  }
};
ut = mi([
  g("horos-computer-tile-editor")
], ut);
const pi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get HorosComputerTileEditor() {
    return ut;
  }
}, Symbol.toStringTag, { value: "Module" }));
var fi = Object.getOwnPropertyDescriptor, _i = (t, e, s, n) => {
  for (var r = n > 1 ? void 0 : n ? fi(e, s) : e, i = t.length - 1, o; i >= 0; i--)
    (o = t[i]) && (r = o(r) || r);
  return r;
};
let dt = class extends C {
  get schema() {
    return [
      { name: "name", selector: D },
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
        selector: ie([
          { value: "pm25", label: "PM2.5" },
          { value: "humidity", label: "Влажность" },
          { value: "temperature", label: "Температура" },
          { value: "power", label: "Мощность" }
        ])
      }
    ];
  }
  get labels() {
    return {
      ...T,
      name: "Название",
      appliance: "Прибор",
      pm25: "PM2.5",
      humidity: "Влажность",
      temperature: "Температура",
      power: "Мощность",
      sensors: "Что ещё сказать",
      alerts: "Сообщать, когда сработало",
      big_values: "Крупно справа (не больше трёх)"
    };
  }
  get formData() {
    const t = this._config ?? {};
    return {
      ...t,
      sensors: E(t.sensors),
      alerts: E(t.alerts)
    };
  }
  fromForm(t) {
    return {
      ...t,
      sensors: P(
        this._config?.sensors,
        t.sensors ?? []
      ),
      alerts: P(
        this._config?.alerts,
        t.alerts ?? []
      )
    };
  }
};
dt = _i([
  g("horos-air-tile-editor")
], dt);
const gi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get HorosAirTileEditor() {
    return dt;
  }
}, Symbol.toStringTag, { value: "Module" }));
var yi = Object.getOwnPropertyDescriptor, bi = (t, e, s, n) => {
  for (var r = n > 1 ? void 0 : n ? yi(e, s) : e, i = t.length - 1, o; i >= 0; i--)
    (o = t[i]) && (r = o(r) || r);
  return r;
};
let ht = class extends C {
  get schema() {
    return [
      { name: "name", selector: D },
      { name: "cover", required: !0, selector: _("cover") },
      { name: "position", selector: _("sensor") },
      { name: "illuminance", selector: _("sensor", "illuminance") },
      { name: "battery", selector: _("sensor", "battery") },
      { name: "controls", selector: { boolean: {} } },
      {
        name: "big_values",
        selector: ie([
          { value: "illuminance", label: "Освещённость" },
          { value: "battery", label: "Заряд" }
        ])
      }
    ];
  }
  get labels() {
    return {
      ...T,
      name: "Название",
      cover: "Штора",
      position: "Насколько открыто",
      illuminance: "Освещённость",
      battery: "Заряд",
      controls: "Кнопки управления",
      big_values: "Крупно справа (не больше трёх)"
    };
  }
};
ht = bi([
  g("horos-cover-tile-editor")
], ht);
const vi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get HorosCoverTileEditor() {
    return ht;
  }
}, Symbol.toStringTag, { value: "Module" }));
var wi = Object.getOwnPropertyDescriptor, $i = (t, e, s, n) => {
  for (var r = n > 1 ? void 0 : n ? wi(e, s) : e, i = t.length - 1, o; i >= 0; i--)
    (o = t[i]) && (r = o(r) || r);
  return r;
};
let mt = class extends C {
  get schema() {
    return [
      { name: "name", selector: D },
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
      { name: "limit", selector: te(1, 12) }
    ];
  }
  get labels() {
    return {
      ...T,
      name: "Название",
      total: "Общая мощность",
      consumers: "Потребители",
      limit: "Сколько показывать"
    };
  }
  get formData() {
    const t = this._config ?? {};
    return {
      ...t,
      consumers: E(t.consumers)
    };
  }
  fromForm(t) {
    return {
      ...t,
      consumers: P(
        this._config?.consumers,
        t.consumers ?? []
      )
    };
  }
};
mt = $i([
  g("horos-energy-tile-editor")
], mt);
const Pi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get HorosEnergyTileEditor() {
    return mt;
  }
}, Symbol.toStringTag, { value: "Module" }));
var Ei = Object.getOwnPropertyDescriptor, Ci = (t, e, s, n) => {
  for (var r = n > 1 ? void 0 : n ? Ei(e, s) : e, i = t.length - 1, o; i >= 0; i--)
    (o = t[i]) && (r = o(r) || r);
  return r;
};
let pt = class extends C {
  get schema() {
    return [
      { name: "name", selector: D },
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
    return {
      ...T,
      name: "Название",
      areas: "Зоны"
    };
  }
  get formData() {
    const t = this._config ?? {};
    return {
      ...t,
      areas: E(t.areas)
    };
  }
  fromForm(t) {
    return {
      ...t,
      areas: P(
        this._config?.areas,
        t.areas ?? []
      )
    };
  }
};
pt = Ci([
  g("horos-presence-tile-editor")
], pt);
const Oi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get HorosPresenceTileEditor() {
    return pt;
  }
}, Symbol.toStringTag, { value: "Module" }));
