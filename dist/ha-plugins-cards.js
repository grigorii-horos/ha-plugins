/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ae = globalThis, Ve = Ae.ShadowRoot && (Ae.ShadyCSS === void 0 || Ae.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Ke = Symbol(), at = /* @__PURE__ */ new WeakMap();
let Lt = class {
  constructor(e, t, r) {
    if (this._$cssResult$ = !0, r !== Ke) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (Ve && e === void 0) {
      const r = t !== void 0 && t.length === 1;
      r && (e = at.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && at.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Vs = (s) => new Lt(typeof s == "string" ? s : s + "", void 0, Ke), Ie = (s, ...e) => {
  const t = s.length === 1 ? s[0] : e.reduce((r, n, i) => r + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + s[i + 1], s[0]);
  return new Lt(t, s, Ke);
}, Ks = (s, e) => {
  if (Ve) s.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const r = document.createElement("style"), n = Ae.litNonce;
    n !== void 0 && r.setAttribute("nonce", n), r.textContent = t.cssText, s.appendChild(r);
  }
}, lt = Ve ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const r of e.cssRules) t += r.cssText;
  return Vs(t);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Gs, defineProperty: Ys, getOwnPropertyDescriptor: Zs, getOwnPropertyNames: Js, getOwnPropertySymbols: Xs, getPrototypeOf: Qs } = Object, je = globalThis, ct = je.trustedTypes, en = ct ? ct.emptyScript : "", tn = je.reactiveElementPolyfillSupport, fe = (s, e) => s, Te = { toAttribute(s, e) {
  switch (e) {
    case Boolean:
      s = s ? en : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, e) {
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
  }
  return t;
} }, Ge = (s, e) => !Gs(s, e), ut = { attribute: !0, type: String, converter: Te, reflect: !1, useDefault: !1, hasChanged: Ge };
Symbol.metadata ??= Symbol("metadata"), je.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let he = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = ut) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const r = Symbol(), n = this.getPropertyDescriptor(e, r, t);
      n !== void 0 && Ys(this.prototype, e, n);
    }
  }
  static getPropertyDescriptor(e, t, r) {
    const { get: n, set: i } = Zs(this.prototype, e) ?? { get() {
      return this[t];
    }, set(o) {
      this[t] = o;
    } };
    return { get: n, set(o) {
      const l = n?.call(this);
      i?.call(this, o), this.requestUpdate(e, l, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? ut;
  }
  static _$Ei() {
    if (this.hasOwnProperty(fe("elementProperties"))) return;
    const e = Qs(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(fe("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(fe("properties"))) {
      const t = this.properties, r = [...Js(t), ...Xs(t)];
      for (const n of r) this.createProperty(n, t[n]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [r, n] of t) this.elementProperties.set(r, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, r] of this.elementProperties) {
      const n = this._$Eu(t, r);
      n !== void 0 && this._$Eh.set(n, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const r = new Set(e.flat(1 / 0).reverse());
      for (const n of r) t.unshift(lt(n));
    } else e !== void 0 && t.push(lt(e));
    return t;
  }
  static _$Eu(e, t) {
    const r = t.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
  }
  addController(e) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
  }
  removeController(e) {
    this._$EO?.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const r of t.keys()) this.hasOwnProperty(r) && (e.set(r, this[r]), delete this[r]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Ks(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, t, r) {
    this._$AK(e, r);
  }
  _$ET(e, t) {
    const r = this.constructor.elementProperties.get(e), n = this.constructor._$Eu(e, r);
    if (n !== void 0 && r.reflect === !0) {
      const i = (r.converter?.toAttribute !== void 0 ? r.converter : Te).toAttribute(t, r.type);
      this._$Em = e, i == null ? this.removeAttribute(n) : this.setAttribute(n, i), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const r = this.constructor, n = r._$Eh.get(e);
    if (n !== void 0 && this._$Em !== n) {
      const i = r.getPropertyOptions(n), o = typeof i.converter == "function" ? { fromAttribute: i.converter } : i.converter?.fromAttribute !== void 0 ? i.converter : Te;
      this._$Em = n;
      const l = o.fromAttribute(t, i.type);
      this[n] = l ?? this._$Ej?.get(n) ?? l, this._$Em = null;
    }
  }
  requestUpdate(e, t, r, n = !1, i) {
    if (e !== void 0) {
      const o = this.constructor;
      if (n === !1 && (i = this[e]), r ??= o.getPropertyOptions(e), !((r.hasChanged ?? Ge)(i, t) || r.useDefault && r.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(o._$Eu(e, r)))) return;
      this.C(e, t, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: r, reflect: n, wrapped: i }, o) {
    r && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, o ?? t ?? this[e]), i !== !0 || o !== void 0) || (this._$AL.has(e) || (this.hasUpdated || r || (t = void 0), this._$AL.set(e, t)), n === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [n, i] of this._$Ep) this[n] = i;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [n, i] of r) {
        const { wrapped: o } = i, l = this[n];
        o !== !0 || this._$AL.has(n) || l === void 0 || this.C(n, void 0, i, l);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((r) => r.hostUpdate?.()), this.update(t)) : this._$EM();
    } catch (r) {
      throw e = !1, this._$EM(), r;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach((t) => t.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq &&= this._$Eq.forEach((t) => this._$ET(t, this[t])), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
he.elementStyles = [], he.shadowRootOptions = { mode: "open" }, he[fe("elementProperties")] = /* @__PURE__ */ new Map(), he[fe("finalized")] = /* @__PURE__ */ new Map(), tn?.({ ReactiveElement: he }), (je.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ye = globalThis, ht = (s) => s, Pe = Ye.trustedTypes, dt = Pe ? Pe.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, Ft = "$lit$", X = `lit$${Math.random().toFixed(9).slice(2)}$`, Ut = "?" + X, sn = `<${Ut}>`, le = document, ge = () => le.createComment(""), _e = (s) => s === null || typeof s != "object" && typeof s != "function", Ze = Array.isArray, nn = (s) => Ze(s) || typeof s?.[Symbol.iterator] == "function", De = `[ 	
\f\r]`, pe = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, mt = /-->/g, pt = />/g, re = RegExp(`>|${De}(?:([^\\s"'>=/]+)(${De}*=${De}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ft = /'/g, gt = /"/g, Dt = /^(?:script|style|textarea|title)$/i, rn = (s) => (e, ...t) => ({ _$litType$: s, strings: e, values: t }), v = rn(1), de = Symbol.for("lit-noChange"), m = Symbol.for("lit-nothing"), _t = /* @__PURE__ */ new WeakMap(), oe = le.createTreeWalker(le, 129);
function zt(s, e) {
  if (!Ze(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return dt !== void 0 ? dt.createHTML(e) : e;
}
const on = (s, e) => {
  const t = s.length - 1, r = [];
  let n, i = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = pe;
  for (let l = 0; l < t; l++) {
    const a = s[l];
    let c, h, u = -1, _ = 0;
    for (; _ < a.length && (o.lastIndex = _, h = o.exec(a), h !== null); ) _ = o.lastIndex, o === pe ? h[1] === "!--" ? o = mt : h[1] !== void 0 ? o = pt : h[2] !== void 0 ? (Dt.test(h[2]) && (n = RegExp("</" + h[2], "g")), o = re) : h[3] !== void 0 && (o = re) : o === re ? h[0] === ">" ? (o = n ?? pe, u = -1) : h[1] === void 0 ? u = -2 : (u = o.lastIndex - h[2].length, c = h[1], o = h[3] === void 0 ? re : h[3] === '"' ? gt : ft) : o === gt || o === ft ? o = re : o === mt || o === pt ? o = pe : (o = re, n = void 0);
    const f = o === re && s[l + 1].startsWith("/>") ? " " : "";
    i += o === pe ? a + sn : u >= 0 ? (r.push(c), a.slice(0, u) + Ft + a.slice(u) + X + f) : a + X + (u === -2 ? l : f);
  }
  return [zt(s, i + (s[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), r];
};
class ye {
  constructor({ strings: e, _$litType$: t }, r) {
    let n;
    this.parts = [];
    let i = 0, o = 0;
    const l = e.length - 1, a = this.parts, [c, h] = on(e, t);
    if (this.el = ye.createElement(c, r), oe.currentNode = this.el.content, t === 2 || t === 3) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (n = oe.nextNode()) !== null && a.length < l; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const u of n.getAttributeNames()) if (u.endsWith(Ft)) {
          const _ = h[o++], f = n.getAttribute(u).split(X), y = /([.?@])?(.*)/.exec(_);
          a.push({ type: 1, index: i, name: y[2], strings: f, ctor: y[1] === "." ? ln : y[1] === "?" ? cn : y[1] === "@" ? un : Me }), n.removeAttribute(u);
        } else u.startsWith(X) && (a.push({ type: 6, index: i }), n.removeAttribute(u));
        if (Dt.test(n.tagName)) {
          const u = n.textContent.split(X), _ = u.length - 1;
          if (_ > 0) {
            n.textContent = Pe ? Pe.emptyScript : "";
            for (let f = 0; f < _; f++) n.append(u[f], ge()), oe.nextNode(), a.push({ type: 2, index: ++i });
            n.append(u[_], ge());
          }
        }
      } else if (n.nodeType === 8) if (n.data === Ut) a.push({ type: 2, index: i });
      else {
        let u = -1;
        for (; (u = n.data.indexOf(X, u + 1)) !== -1; ) a.push({ type: 7, index: i }), u += X.length - 1;
      }
      i++;
    }
  }
  static createElement(e, t) {
    const r = le.createElement("template");
    return r.innerHTML = e, r;
  }
}
function me(s, e, t = s, r) {
  if (e === de) return e;
  let n = r !== void 0 ? t._$Co?.[r] : t._$Cl;
  const i = _e(e) ? void 0 : e._$litDirective$;
  return n?.constructor !== i && (n?._$AO?.(!1), i === void 0 ? n = void 0 : (n = new i(s), n._$AT(s, t, r)), r !== void 0 ? (t._$Co ??= [])[r] = n : t._$Cl = n), n !== void 0 && (e = me(s, n._$AS(s, e.values), n, r)), e;
}
class an {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: r } = this._$AD, n = (e?.creationScope ?? le).importNode(t, !0);
    oe.currentNode = n;
    let i = oe.nextNode(), o = 0, l = 0, a = r[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let c;
        a.type === 2 ? c = new ve(i, i.nextSibling, this, e) : a.type === 1 ? c = new a.ctor(i, a.name, a.strings, this, e) : a.type === 6 && (c = new hn(i, this, e)), this._$AV.push(c), a = r[++l];
      }
      o !== a?.index && (i = oe.nextNode(), o++);
    }
    return oe.currentNode = le, n;
  }
  p(e) {
    let t = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, t), t += r.strings.length - 2) : r._$AI(e[t])), t++;
  }
}
class ve {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, t, r, n) {
    this.type = 2, this._$AH = m, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = r, this.options = n, this._$Cv = n?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = me(this, e, t), _e(e) ? e === m || e == null || e === "" ? (this._$AH !== m && this._$AR(), this._$AH = m) : e !== this._$AH && e !== de && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : nn(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== m && _e(this._$AH) ? this._$AA.nextSibling.data = e : this.T(le.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: r } = e, n = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = ye.createElement(zt(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === n) this._$AH.p(t);
    else {
      const i = new an(n, this), o = i.u(this.options);
      i.p(t), this.T(o), this._$AH = i;
    }
  }
  _$AC(e) {
    let t = _t.get(e.strings);
    return t === void 0 && _t.set(e.strings, t = new ye(e)), t;
  }
  k(e) {
    Ze(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let r, n = 0;
    for (const i of e) n === t.length ? t.push(r = new ve(this.O(ge()), this.O(ge()), this, this.options)) : r = t[n], r._$AI(i), n++;
    n < t.length && (this._$AR(r && r._$AB.nextSibling, n), t.length = n);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const r = ht(e).nextSibling;
      ht(e).remove(), e = r;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class Me {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, r, n, i) {
    this.type = 1, this._$AH = m, this._$AN = void 0, this.element = e, this.name = t, this._$AM = n, this.options = i, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = m;
  }
  _$AI(e, t = this, r, n) {
    const i = this.strings;
    let o = !1;
    if (i === void 0) e = me(this, e, t, 0), o = !_e(e) || e !== this._$AH && e !== de, o && (this._$AH = e);
    else {
      const l = e;
      let a, c;
      for (e = i[0], a = 0; a < i.length - 1; a++) c = me(this, l[r + a], t, a), c === de && (c = this._$AH[a]), o ||= !_e(c) || c !== this._$AH[a], c === m ? e = m : e !== m && (e += (c ?? "") + i[a + 1]), this._$AH[a] = c;
    }
    o && !n && this.j(e);
  }
  j(e) {
    e === m ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class ln extends Me {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === m ? void 0 : e;
  }
}
class cn extends Me {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== m);
  }
}
class un extends Me {
  constructor(e, t, r, n, i) {
    super(e, t, r, n, i), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = me(this, e, t, 0) ?? m) === de) return;
    const r = this._$AH, n = e === m && r !== m || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, i = e !== m && (r === m || n);
    n && this.element.removeEventListener(this.name, this, r), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class hn {
  constructor(e, t, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    me(this, e);
  }
}
const dn = Ye.litHtmlPolyfillSupport;
dn?.(ye, ve), (Ye.litHtmlVersions ??= []).push("3.3.3");
const mn = (s, e, t) => {
  const r = t?.renderBefore ?? e;
  let n = r._$litPart$;
  if (n === void 0) {
    const i = t?.renderBefore ?? null;
    r._$litPart$ = n = new ve(e.insertBefore(ge(), i), i, void 0, t ?? {});
  }
  return n._$AI(s), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Je = globalThis;
class ae extends he {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = mn(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return de;
  }
}
ae._$litElement$ = !0, ae.finalized = !0, Je.litElementHydrateSupport?.({ LitElement: ae });
const pn = Je.litElementPolyfillSupport;
pn?.({ LitElement: ae });
(Je.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const fn = { attribute: !0, type: String, converter: Te, reflect: !1, hasChanged: Ge }, gn = (s = fn, e, t) => {
  const { kind: r, metadata: n } = t;
  let i = globalThis.litPropertyMetadata.get(n);
  if (i === void 0 && globalThis.litPropertyMetadata.set(n, i = /* @__PURE__ */ new Map()), r === "setter" && ((s = Object.create(s)).wrapped = !0), i.set(t.name, s), r === "accessor") {
    const { name: o } = t;
    return { set(l) {
      const a = e.get.call(this);
      e.set.call(this, l), this.requestUpdate(o, a, s, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(o, void 0, s, l), l;
    } };
  }
  if (r === "setter") {
    const { name: o } = t;
    return function(l) {
      const a = this[o];
      e.call(this, l), this.requestUpdate(o, a, s, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function Re(s) {
  return (e, t) => typeof t == "object" ? gn(s, e, t) : ((r, n, i) => {
    const o = n.hasOwnProperty(i);
    return n.constructor.createProperty(i, r), o ? Object.getOwnPropertyDescriptor(n, i) : void 0;
  })(s, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function b(s) {
  return Re({ ...s, state: !0, attribute: !1 });
}
const W = Ie`
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

  /* The texts and the right-hand column share one row of the info slot. */
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
   * The one departure from the tile canon: the main values are moved into the
   * right-hand column in a large font. Each next value drops the font a step,
   * otherwise the column eats the card name.
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

  /* The icon names the quantity; the number stays the star, the icon is muted. */
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
   * The second departure: values are clickable one by one, and a tap on each
   * opens more-info for its entity. Tile content does not take events, so the
   * tap targets switch them back on.
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

  /* Our own features line: the same padding as the stock row. */
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
`, Xe = /* @__PURE__ */ new Set(["unavailable", "unknown"]), _n = /* @__PURE__ */ new Set([
  "aqi",
  "battery",
  "carbon_dioxide",
  "carbon_monoxide",
  "humidity",
  "illuminance",
  "moisture",
  "nitrogen_dioxide",
  "nitrogen_monoxide",
  "nitrous_oxide",
  "ozone",
  "pm1",
  "pm10",
  "pm25",
  "sulphur_dioxide",
  "volatile_organic_compounds",
  "volatile_organic_compounds_parts"
]);
function Wt(s) {
  const e = s?.attributes.device_class;
  if (!e || !_n.has(e)) return !1;
  const t = Number(s.state);
  return Number.isFinite(t) && t < 0;
}
const yn = " · ";
function p(s, e) {
  if (!e) return;
  const t = s?.states[e];
  return {
    entityId: e,
    stateObj: t,
    missing: !t,
    unavailable: !!t && Xe.has(t.state),
    impossible: Wt(t)
  };
}
function vn(s, e) {
  if (!(!s || !e || !e.stateObj || e.missing || e.unavailable) && !e.impossible)
    return s.formatEntityState(e.stateObj);
}
function yt(s, e, t) {
  const r = e?.attributes[t];
  if (!(r == null || r === ""))
    return s?.formatEntityAttributeValue?.(e, t) ?? String(r);
}
function O(s) {
  return s.filter(
    (e) => !!e && (e.content !== void 0 || (e.text ?? "").trim() !== "")
  );
}
function L(s, e) {
  const t = vn(s, e);
  return t ? { text: t, entityId: e?.entityId } : void 0;
}
function D(s, e) {
  const t = Qe(s, e);
  return t ? { text: t, entityId: e?.entityId } : void 0;
}
function Qe(s, e) {
  if (!(!s || !e?.stateObj || !e.unavailable))
    return s.formatEntityState(e.stateObj);
}
function q(s) {
  if (!s?.stateObj || s.impossible) return;
  const e = Number(s.stateObj.state);
  return Number.isFinite(e) ? e : void 0;
}
function He(s, e) {
  return s || (e?.stateObj?.attributes.friendly_name ?? e?.entityId ?? "");
}
function qt(s, e) {
  if (!e) return { value: s };
  if (!s.endsWith(e)) return { value: s };
  const t = s.slice(0, s.length - e.length).trimEnd();
  return t ? { value: t, unit: e } : { value: s };
}
const Be = "unavailable", bn = "unknown", wn = "off", $n = /* @__PURE__ */ new Set(["button", "input_button", "scene"]), En = /* @__PURE__ */ new Set([
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
]), F = (s) => s.substring(0, s.indexOf(".")), xn = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "unknown";
function Bt(s, e) {
  const t = F(s.entity_id), r = s.state;
  if ($n.has(t))
    return r !== Be;
  if (r === Be || r === bn || r === wn && t !== "alert")
    return !1;
  switch (t) {
    case "alarm_control_panel":
      return r !== "disarmed";
    case "alert":
      return r !== "idle";
    case "cover":
    case "valve":
      return r !== "closed";
    case "device_tracker":
    case "person":
      return r !== "not_home";
    case "lawn_mower":
      return !["docked", "paused"].includes(r);
    case "lock":
      return r !== "locked";
    case "media_player":
      return r !== "standby";
    case "vacuum":
      return !["idle", "docked", "paused"].includes(r);
    case "plant":
      return r === "problem";
    case "group":
      return ["on", "home", "open", "locked", "problem"].includes(r);
    case "timer":
      return r === "active";
    case "camera":
      return ["streaming", "recording"].includes(r);
    default:
      return !0;
  }
}
const Sn = (s) => s.reduceRight(
  (e, t) => `var(${t}${e ? `, ${e}` : ""})`,
  void 0
), Cn = (s) => {
  const e = Number(s);
  if (!isNaN(e))
    return e >= 70 ? "--state-sensor-battery-high-color" : e >= 30 ? "--state-sensor-battery-medium-color" : "--state-sensor-battery-low-color";
};
function kn(s, e) {
  if (!s) return e;
  if (s.state === Be)
    return "var(--state-unavailable-color)";
  const t = F(s.entity_id), r = s.attributes.device_class;
  if (t === "sensor" && r === "battery") {
    const a = Cn(s.state);
    if (a) return `var(${a})`;
  }
  if (!En.has(t))
    return e;
  const n = Bt(s), i = xn(s.state), o = n ? "active" : "inactive", l = [];
  return r && l.push(`--state-${t}-${r}-${i}-color`), l.push(
    `--state-${t}-${i}-color`,
    `--state-${t}-${o}-color`,
    `--state-${o}-color`
  ), Sn(l);
}
function H(s) {
  if (!s) return "var(--state-inactive-color)";
  const e = kn(s);
  return e || (Bt(s) ? "var(--state-icon-color)" : "var(--state-inactive-color)");
}
function ie(s) {
  return s !== void 0 && s.action !== "none";
}
const An = ["closed", "locked", "off"], On = /* @__PURE__ */ new Set([
  "fan",
  "input_boolean",
  "light",
  "switch",
  "group",
  "automation",
  "humidifier",
  "valve"
]);
function ce(s) {
  if (!s) return { action: "none" };
  const e = F(s);
  return { action: On.has(e) || ["button", "input_button", "scene"].includes(e) ? "toggle" : "none" };
}
const Tn = {
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
function Pn(s, e) {
  const t = Tn[s];
  return t ? (e ? t.on : t.off) ?? t.on : e ? "turn_on" : "turn_off";
}
function In(s, e) {
  const t = s.states[e];
  if (!t) return;
  const r = F(e), n = r === "group" ? "homeassistant" : r, i = An.includes(t.state);
  s.callService(n, Pn(r, i), {
    entity_id: e
  });
}
function vt(s, e, t) {
  s.dispatchEvent(
    new CustomEvent(e, { detail: t, bubbles: !0, composed: !0 })
  );
}
function jn(s, e) {
  e ? window.history.replaceState(null, "", s) : window.history.pushState(null, "", s), window.dispatchEvent(new CustomEvent("location-changed", { detail: {} }));
}
async function Mn(s, e) {
  if (!e.confirmation) return !0;
  const t = window.loadCardHelpers;
  if (!t) return window.confirm(e.confirmation.text ?? "Are you sure?");
  const r = await t();
  return r.showConfirmationDialog ? r.showConfirmationDialog(s, {
    text: e.confirmation.text,
    title: e.confirmation.title,
    confirmText: e.confirmation.confirm_text,
    dismissText: e.confirmation.dismiss_text
  }) : window.confirm(e.confirmation.text ?? "Are you sure?");
}
async function Vt(s, e, t, r) {
  let n;
  if (r === "double_tap" ? n = t.double_tap_action : r === "hold" ? n = t.hold_action : n = t.tap_action, n || (n = { action: "more-info" }), !!await Mn(s, n))
    switch (n.action) {
      case "none":
        break;
      case "more-info": {
        const i = n.entity || t.entity;
        i && vt(s, "hass-more-info", { entityId: i });
        break;
      }
      case "toggle": {
        const i = n.entity || t.entity;
        i && In(e, i);
        break;
      }
      case "navigate":
        n.navigation_path && jn(n.navigation_path, n.navigation_replace);
        break;
      case "url":
        n.url_path && window.open(n.url_path, "_blank", "noreferrer");
        break;
      case "perform-action":
      case "call-service": {
        const i = n.perform_action || n.service;
        if (!i) break;
        const [o, l] = i.split(".", 2);
        e.callService(o, l, {
          ...n.data ?? n.service_data ?? {},
          ...n.target ?? {}
        });
        break;
      }
      case "fire-dom-event":
        vt(s, "ll-custom", n);
        break;
      default:
        console.warn(
          `horos-cards: action "${n.action}" is not supported`
        );
    }
}
const et = 5e3, bt = [
  "ha-tile-container",
  "ha-tile-icon",
  "ha-tile-info",
  "hui-card-features"
], wt = [
  "ha-control-button",
  "ha-control-button-group",
  "ha-control-select"
];
let Se, Ce, ke;
function tt(s, e) {
  return customElements.get(s) ? Promise.resolve(!0) : Promise.race([
    customElements.whenDefined(s).then(() => !0),
    new Promise((t) => setTimeout(() => t(!1), e))
  ]);
}
async function Rn() {
  const s = window.loadCardHelpers;
  if (s)
    try {
      (await s()).createCardElement?.({ type: "tile", entity: "sun.sun" });
    } catch {
    }
}
function st() {
  return Se || (Se = (async () => bt.every((e) => customElements.get(e)) ? !0 : (await Rn(), (await Promise.all(
    bt.map((e) => tt(e, et))
  )).every(Boolean)))(), Se);
}
function Hn() {
  return Ce || (Ce = (async () => {
    if (wt.every((r) => customElements.get(r))) return !0;
    await st();
    const s = window.loadCardHelpers;
    let e;
    try {
      e = (await s?.())?.createCardElement?.({
        type: "tile",
        entity: "sun.sun",
        features: [{ type: "cover-open-close" }, { type: "climate-hvac-modes" }]
      }), e && (e.style.position = "absolute", e.style.left = "-9999px", document.body.appendChild(e));
    } catch {
    }
    const t = await Promise.all(
      wt.map((r) => tt(r, et))
    );
    return e?.remove(), t.every(Boolean);
  })(), Ce);
}
function Nn() {
  return ke || (ke = (async () => {
    if (customElements.get("hui-card-features-editor")) return !0;
    await st();
    const s = customElements.get("hui-tile-card");
    try {
      await s?.getConfigElement?.();
    } catch {
    }
    return tt("hui-card-features-editor", et);
  })(), ke);
}
const be = {
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
  total: "mdi:flash",
  brightness: "mdi:brightness-6",
  volume: "mdi:volume-high",
  tasks: "mdi:check-circle-outline",
  updates: "mdi:package-up"
}, Ln = {
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
  "offline.title": "Не отвечает",
  "offline.allAnswer": "Все на связи",
  "offline.more.one": "и ещё {count}",
  "offline.more.few": "и ещё {count}",
  "offline.more.many": "и ещё {count}",
  "list.missing.one": "{count} не найдена",
  "list.missing.few": "{count} не найдены",
  "list.missing.many": "{count} не найдено",
  "alerts.title": "Оповещения",
  "alerts.calm": "Всё тихо, {count} под присмотром",
  "alerts.offline": "{name}: нет связи",
  "lamp.title": "Лампа",
  "lamp.bright": "Ярче",
  "lamp.dim": "Тусклее",
  "lamp.warm": "Теплее",
  "lamp.cold": "Холоднее",
  "heating.title": "Отопление",
  "heating.calling.one": "{count} из {total} просит",
  "heating.calling.few": "{count} из {total} просят",
  "heating.calling.many": "{count} из {total} просят",
  "heating.quiet": "Тепла не просят",
  "light.title": "Свет",
  "light.count": "Горит {count} из {total}",
  "light.allOff": "Все выключены",
  "light.on": "вкл",
  "light.off": "выкл",
  "media.title": "Медиа",
  "media.idle": "Ничего не играет",
  "media.playing.one": "{count} играет",
  "media.playing.few": "{count} играют",
  "media.playing.many": "{count} играют",
  "ac.title": "Кондиционер",
  "updates.title": "Обновления",
  "updates.upToDate": "Всё обновлено",
  "updates.count.one": "{count} обновление",
  "updates.count.few": "{count} обновления",
  "updates.count.many": "{count} обновлений",
  "tasks.title": "Задачи",
  "tasks.none": "Дел нет",
  "tasks.noEvents": "Событий впереди нет",
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
}, Oe = {
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
  "offline.title": "Not responding",
  "offline.allAnswer": "Everything is answering",
  "offline.more.one": "and {count} more",
  "offline.more.many": "and {count} more",
  "list.missing.one": "{count} not found",
  "list.missing.many": "{count} not found",
  "alerts.title": "Alerts",
  "alerts.calm": "All quiet, {count} watched",
  "alerts.offline": "{name}: no connection",
  "lamp.title": "Lamp",
  "lamp.bright": "Brighter",
  "lamp.dim": "Dimmer",
  "lamp.warm": "Warmer",
  "lamp.cold": "Colder",
  "heating.title": "Heating",
  "heating.calling.one": "{count} of {total} calling",
  "heating.calling.many": "{count} of {total} calling",
  "heating.quiet": "No demand",
  "light.title": "Lights",
  "light.count": "{count} of {total} on",
  "light.allOff": "All off",
  "light.on": "on",
  "light.off": "off",
  "media.title": "Media",
  "media.idle": "Nothing playing",
  "media.playing.one": "{count} playing",
  "media.playing.many": "{count} playing",
  "ac.title": "Air conditioner",
  "updates.title": "Updates",
  "updates.upToDate": "Everything up to date",
  "updates.count.one": "{count} update",
  "updates.count.many": "{count} updates",
  "tasks.title": "Tasks",
  "tasks.none": "Nothing to do",
  "tasks.noEvents": "Nothing coming up",
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
}, Kt = { ru: Ln, en: Oe };
function $(s) {
  const t = (s?.language ?? s?.locale?.language ?? "en").split("-")[0].toLowerCase();
  return t in Kt ? t : "en";
}
function Fn(s, e) {
  if (s !== "ru") return e === 1 ? "one" : "many";
  const t = e % 10, r = e % 100;
  return t === 1 && r !== 11 ? "one" : t >= 2 && t <= 4 && (r < 12 || r > 14) ? "few" : "many";
}
function d(s, e, t = {}) {
  const r = $(s), n = Kt[r] ?? Oe, i = t.count, o = typeof i == "number" ? `${e}.${Fn(r, i)}` : void 0;
  return ((o && (n[o] ?? Oe[o])) ?? n[e] ?? Oe[e] ?? e).replace(
    /\{(\w+)\}/g,
    (a, c) => c in t ? String(t[c]) : a
  );
}
var Un = Object.defineProperty, Gt = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && Un(e, t, n), n;
};
class E extends ae {
  constructor() {
    super(...arguments), this._ready = !1, this.base = {};
  }
  static {
    this.styles = [W];
  }
  /**
   * How much room the content below the line takes: level rows, features.
   * A subclass overrides this if it has any.
   */
  contentRows() {
    return 0;
  }
  getCardSize() {
    return 1 + this.contentRows();
  }
  /**
   * Layout hints for a sections dashboard.
   *
   * `rows: "auto"` because the height depends on the content: a printer has five
   * ink rows, a climate card none. The stock cards with a floating height, entities
   * and heading, describe themselves the same way. Without it the card would claim
   * one row no matter what is in it.
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
    super.connectedCallback(), st().then((e) => {
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
  // ---- actions ---------------------------------------------------------
  _handleAction(e) {
    this._runAction(e.detail.action, !1);
  }
  _handleIconAction(e) {
    e.stopPropagation(), this._runAction(e.detail.action, !0);
  }
  _runAction(e, t) {
    if (!this.hass) return;
    const r = t ? {
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
    Vt(this, this.hass, r, e);
  }
  // ---- rendering -------------------------------------------------------
  /** A banner instead of the card: the config is invalid or the entity is gone. */
  renderWarning(e) {
    return v`<ha-card><div class="warning">${e}</div></ha-card>`;
  }
  /**
   * The main entity's state for the secondary line.
   *
   * When `state_content` or `time_format` is set, the stock `state-display` does
   * the rendering: it handles attributes, last changed and time formats — no
   * reason to redo that by hand.
   */
  mainStateSegment(e) {
    if (!(!e?.stateObj || e.unavailable))
      return !this.base.state_content && !this.base.time_format ? L(this.hass, e) : {
        entityId: e.entityId,
        content: v`<state-display
        .hass=${this.hass}
        .stateObj=${e.stateObj}
        .content=${this.base.state_content}
        .timeFormat=${this.base.time_format}
      ></state-display>`
      };
  }
  /** A message about entities that were not found, or undefined if all are there. */
  missingRolesWarning(e) {
    const t = e.filter((r) => !!r && r.missing).map((r) => r.entityId);
    if (t.length)
      return d(
        this.hass,
        t.length === 1 ? "entity.missing.one" : "entity.missing.many",
        { list: t.join(", ") }
      );
  }
  /**
   * Wraps a value in its own tap target. The click does not bubble to the body,
   * so more-info opens for that entity rather than for the main one.
   *
   * A button rather than a span with a handler: values are targets in their own
   * right, and one has to be able to tab to them and press them from the
   * keyboard. The entity name goes into title and aria-label: "63%" on its own
   * says nothing about whose it is — neither on hover nor to a screen reader.
   */
  renderClickable(e, t) {
    if (!t) return v`<span>${e}</span>`;
    const r = this.hass?.states[t]?.attributes.friendly_name ?? t;
    return v`<button
      class="clickable"
      title=${r}
      aria-label=${r}
      @click=${(n) => {
      n.stopPropagation(), this.fireMoreInfo(t);
    }}
      >${e}</button
    >`;
  }
  renderTile(e) {
    const {
      icon: t,
      color: r,
      primary: n,
      secondary: i,
      mainEntityId: o,
      imageUrl: l,
      defaultIconAction: a,
      values: c,
      ownFeatures: h,
      customFeatures: u
    } = e;
    if (this._entityId = o, this._defaultIconAction = a, !this._ready)
      return this.renderWarning(d(this.hass, "internals.failed"));
    const _ = this.base.color ? Yt(this.base.color) : r ?? "var(--state-inactive-color)", f = this.base.icon_tap_action ?? a, y = ie(f) || ie(this.base.icon_hold_action) || ie(this.base.icon_double_tap_action), z = this.base.features?.length ? this.base.features : h, w = this.base.features_position ?? "bottom";
    return v`
      <ha-card style="--tile-color: ${_};">
        <ha-tile-container
          .featurePosition=${w}
          .vertical=${!!this.base.vertical}
          .interactive=${!0}
          .actionHandlerOptions=${{
      hasHold: ie(this.base.hold_action),
      hasDoubleClick: ie(this.base.double_tap_action)
    }}
          @action=${this._handleAction}
        >
          <ha-tile-icon
            slot="icon"
            class=${l ? "image" : ""}
            .interactive=${y}
            .imageUrl=${l}
            .icon=${this.base.icon ?? t}
            .actionHandlerOptions=${{
      hasHold: ie(this.base.icon_hold_action),
      hasDoubleClick: ie(this.base.icon_double_tap_action)
    }}
            @action=${this._handleIconAction}
          ></ha-tile-icon>

          <div slot="info" class="info ${this.base.vertical ? "vertical" : ""}">
            <ha-tile-info>
              <span slot="primary">${n}</span>
              ${i?.length && !this.base.hide_state ? v`<span slot="secondary"
                    >${i.map(
      (R, ne) => v`
                        ${ne ? v`<span>${yn}</span>` : m}${this.renderClickable(
        R.content ?? R.text,
        R.entityId
      )}
                      `
    )}</span
                  >` : m}
            </ha-tile-info>
            ${c?.length ? v`<div class="values of-${c.length}">
                  ${c.map(
      (R, ne) => v`
                      ${ne ? v`<span class="values-separator">/</span>` : m}
                      ${this.renderClickable(
        v`${R.icon ? v`<ha-icon
                              class="value-icon"
                              .icon=${R.icon}
                            ></ha-icon>` : m}${R.value}${R.unit ? v`<span class="unit"> ${R.unit}</span>` : m}`,
        R.entityId
      )}
                    `
    )}
                </div>` : m}
          </div>

          ${u ? v`<div slot="features" class="custom-features">
                ${u}
              </div>` : m}
          ${z?.length ? v`<hui-card-features
                slot=${w === "inline" ? "features-inline" : "features"}
                .hass=${this.hass}
                .context=${{ entity_id: o }}
                .features=${z}
                .position=${w}
              ></hui-card-features>` : m}
        </ha-tile-container>
      </ha-card>
    `;
  }
  /**
   * The values of the right-hand column. `icons` names a value by its role key:
   * without it two percentages in a row are indistinguishable.
   */
  bigValues(e, t = be) {
    return e.map((r) => {
      const n = this.formatted(r.role?.stateObj);
      return n ? {
        ...n,
        entityId: r.role?.entityId,
        icon: t[r.key]
      } : void 0;
    }).filter((r) => !!r);
  }
  /**
   * The entity picture URL — the same logic as _getImageUrl in the stock tile.
   * Cameras, with their separate size-aware URL, are not supported.
   */
  entityImage(e) {
    if (!this.base.show_entity_picture || !this.hass || !e)
      return;
    const t = e.attributes.entity_picture_local || e.attributes.entity_picture;
    return t ? this.hass.hassUrl(t) : void 0;
  }
  /** A large value ready to show. An unavailable entity has none. */
  formatted(e) {
    if (!(!this.hass || !e) && !Xe.has(e.state) && !Wt(e))
      return qt(
        this.hass.formatEntityState(e),
        e.attributes.unit_of_measurement
      );
  }
}
Gt([
  Re({ attribute: !1 })
], E.prototype, "hass");
Gt([
  b()
], E.prototype, "_ready");
function Yt(s) {
  return /^(#|rgb|hsl|var\()/.test(s) ? s : s === "state" ? "var(--state-icon-color)" : `var(--${s}-color, var(--state-icon-color))`;
}
const $t = 3;
function Y(s, e, t) {
  if (!s || s.length === 0) return [e];
  if (s.length > $t)
    throw new Error(
      `At most ${$t} large values are allowed, got ${s.length}`
    );
  const r = s.filter((i) => !t.includes(i));
  if (r.length)
    throw new Error(
      `Unknown roles in big_values: ${r.join(", ")}. Allowed: ${t.join(", ")}`
    );
  const n = s.filter(
    (i, o) => s.indexOf(i) !== o
  );
  if (n.length)
    throw new Error(`Role listed twice: ${n.join(", ")}`);
  return s;
}
function B(s, e) {
  const t = e.map((n) => s.find((i) => i.key === n)).filter((n) => !!n), r = s.filter((n) => !e.includes(n.key));
  return { big: t, rest: r };
}
let Et = !1;
function Dn(s) {
  Et || (Et = !0, console.warn(
    `horos-cards: card ${s} is already registered. The bundle looks to be attached to the dashboard twice — the copy that loaded first is the one running. Check the dashboard resources.`
  ));
}
function xt() {
  const s = document.querySelector("home-assistant");
  return $(s?.hass);
}
function x(s, e, t) {
  if (customElements.get(s)) {
    Dn(s);
    return;
  }
  customElements.define(s, e), window.customCards = window.customCards ?? [], window.customCards.push({
    type: t.type,
    preview: t.preview,
    get name() {
      return t.name[xt() === "ru" ? "ru" : "en"];
    },
    get description() {
      return t.description[xt() === "ru" ? "ru" : "en"];
    },
    getEntitySuggestion: t.suggest
  });
}
function S(s, e) {
  customElements.get(s) || customElements.define(s, e);
}
const nt = 20;
function Z(s, e) {
  return s.states[e]?.attributes.device_class;
}
function Ne(s, e) {
  return s.entities?.[e]?.hidden === !0;
}
function J(s, e) {
  const t = s.entities?.[e]?.device_id;
  if (!t || !s.entities) return [e];
  const r = Object.keys(s.entities).filter(
    (n) => n !== e && s.entities?.[n]?.device_id === t && !Ne(s, n) && s.states[n] !== void 0
  );
  return [e, ...r.sort()];
}
function N(s, e, t, ...r) {
  return e.find(
    (n) => F(n) === t && r.includes(Z(s, n) ?? "")
  );
}
function we(s, ...e) {
  return s.find((t) => e.includes(F(t)));
}
function Le(s, e, t, r, n = nt, i = () => !0) {
  const o = Object.keys(s.states).filter(
    (a) => a !== e && F(a) === t && r.includes(Z(s, a) ?? "") && !Ne(s, a) && i(a)
  ).sort();
  return [...i(e) ? [e] : [], ...o].slice(0, n);
}
function St(s, e) {
  return s.entities?.[e]?.device_id !== void 0;
}
function Q(s, e) {
  const t = s.entities?.[e];
  if (t)
    return t.area_id ? t.area_id : t.device_id ? s.devices?.[t.device_id]?.area_id : void 0;
}
function rt(s, e, t, r = nt) {
  const n = Q(s, e);
  if (!n) return [];
  const i = Object.keys(s.states).filter(
    (l) => l !== e && F(l) === t && !Ne(s, l) && Q(s, l) === n
  ).sort();
  return [...F(e) === t ? [e] : [], ...i].slice(0, r);
}
function zn(s, e, t, r, n = nt) {
  const i = (u) => r.indexOf(Z(s, u) ?? ""), o = Object.keys(s.states).filter(
    (u) => u !== e && F(u) === t && i(u) >= 0 && !Ne(s, u) && Q(s, u) !== void 0
  ).sort((u, _) => i(u) - i(_) || u.localeCompare(_)), l = /* @__PURE__ */ new Map(), a = Q(s, e);
  a && l.set(a, e);
  for (const u of o) {
    const _ = Q(s, u);
    l.has(_) || l.set(_, u);
  }
  const h = [...l.values()].filter((u) => u !== e);
  return [e, ...h].slice(0, n);
}
function U(s, e, t = {}) {
  const r = { type: s, ...t };
  for (const [n, i] of Object.entries(e))
    i && (r[n] = i);
  return { config: r };
}
function $e(s) {
  return Object.values(s).filter(Boolean).length;
}
var Wn = Object.defineProperty, qn = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && Wn(e, t, n), n;
};
const Ct = [
  "temperature",
  "humidity",
  "illuminance",
  "pm25"
];
class Zt extends E {
  constructor() {
    super(...arguments), this._bigKeys = ["temperature"];
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => gi), document.createElement(
      "horos-climate-tile-editor"
    );
  }
  static getStubConfig() {
    return { temperature: "", humidity: "" };
  }
  setConfig(e) {
    if (!e.temperature)
      throw new Error("A temperature entity is required (temperature)");
    this._bigKeys = Y(
      e.big_values,
      "temperature",
      Ct
    ), this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return m;
    const e = this._config, t = Ct.map((l) => ({
      key: l,
      role: p(this.hass, e[l])
    })), r = this.missingRolesWarning(t.map((l) => l.role));
    if (r) return this.renderWarning(r);
    const { big: n, rest: i } = B(t, this._bigKeys), o = t[0].role;
    return this.renderTile({
      icon: "mdi:thermometer",
      color: H(o?.stateObj),
      primary: He(e.name, o),
      imageUrl: this.entityImage(o?.stateObj),
      defaultIconAction: ce(o?.entityId),
      secondary: O([
        D(this.hass, o),
        ...i.map((l) => L(this.hass, l.role))
      ]),
      mainEntityId: o?.entityId,
      values: this.bigValues(n)
    });
  }
}
qn([
  b()
], Zt.prototype, "_config");
x("horos-climate-tile", Zt, {
  type: "horos-climate-tile",
  name: { ru: "Климат комнаты", en: "Room climate" },
  description: {
    ru: "Температура, влажность, освещённость и PM2.5 одной комнаты в одной плитке",
    en: "Temperature, humidity, illuminance and PM2.5 of one room in a single tile"
  },
  preview: !0,
  suggest: (s, e) => {
    if (F(e) !== "sensor") return null;
    const t = J(s, e), r = {
      temperature: N(s, t, "sensor", "temperature"),
      humidity: N(s, t, "sensor", "humidity"),
      illuminance: N(s, t, "sensor", "illuminance"),
      pm25: N(s, t, "sensor", "pm25")
    };
    return !r.temperature || $e(r) < 2 ? null : U("custom:horos-climate-tile", r);
  }
});
var Bn = Object.defineProperty, Vn = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && Bn(e, t, n), n;
};
const kt = ["switch", "power", "energy"];
class Jt extends E {
  constructor() {
    super(...arguments), this._bigKeys = ["power"];
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => _i), document.createElement("horos-plug-tile-editor");
  }
  static getStubConfig() {
    return { switch: "", power: "" };
  }
  setConfig(e) {
    if (!e.switch)
      throw new Error("A switch is required (switch)");
    this._bigKeys = Y(e.big_values, "power", kt), this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return m;
    const e = this._config, t = kt.map((a) => ({
      key: a,
      role: p(this.hass, e[a])
    })), r = this.missingRolesWarning(t.map((a) => a.role));
    if (r) return this.renderWarning(r);
    const { big: n, rest: i } = B(t, this._bigKeys), o = t[0].role, l = o.entityId;
    return this.renderTile({
      icon: "mdi:power-plug",
      color: H(o.stateObj),
      primary: He(e.name, o),
      secondary: O([
        // One of the two returns a piece: an available switch gives its state,
        // an unavailable one its unavailability status.
        D(this.hass, o),
        // The switch is the card's main entity, so its state can be shown
        // through state_content, just like on the stock tile.
        ...i.map(
          (a) => a.key === "switch" ? this.mainStateSegment(a.role) : L(this.hass, a.role)
        )
      ]),
      mainEntityId: l,
      imageUrl: this.entityImage(o.stateObj),
      defaultIconAction: ce(l),
      values: this.bigValues(n),
      // The button is a stock HA feature; there is no markup of our own left for it.
      ownFeatures: e.toggle_button ? [{ type: "toggle" }] : void 0
    });
  }
}
Vn([
  b()
], Jt.prototype, "_config");
x("horos-plug-tile", Jt, {
  type: "horos-plug-tile",
  name: { ru: "Розетка", en: "Smart plug" },
  description: {
    ru: "Выключатель, текущая мощность и накопленная энергия в одной плитке",
    en: "Switch, current power draw and accumulated energy in a single tile"
  },
  preview: !0,
  suggest: (s, e) => {
    const t = J(s, e), r = {
      switch: we(t, "switch"),
      power: N(s, t, "sensor", "power"),
      energy: N(s, t, "sensor", "energy")
    };
    return !r.switch || $e(r) < 2 ? null : U("custom:horos-plug-tile", r);
  }
});
const At = 30, Ot = 70;
function Kn(s, e, t) {
  return s === void 0 ? "unknown" : s < e ? "dry" : s > t ? "wet" : "ok";
}
const Gn = {
  dry: "var(--warning-color)",
  ok: "var(--success-color)",
  wet: "var(--info-color)",
  unknown: "var(--state-inactive-color)"
}, Yn = {
  dry: "mdi:water-off",
  ok: "mdi:sprout",
  wet: "mdi:water-alert",
  unknown: "mdi:sprout"
};
var Zn = Object.defineProperty, Jn = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && Zn(e, t, n), n;
};
const Tt = ["moisture", "temperature", "battery"];
class Xt extends E {
  constructor() {
    super(...arguments), this._bigKeys = ["moisture"];
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => yi), document.createElement(
      "horos-plant-tile-editor"
    );
  }
  static getStubConfig() {
    return { moisture: "" };
  }
  setConfig(e) {
    if (!e.moisture)
      throw new Error("A soil moisture entity is required (moisture)");
    const t = e.dry_below ?? At, r = e.wet_above ?? Ot;
    if (t >= r)
      throw new Error("dry_below must be smaller than wet_above");
    this._bigKeys = Y(e.big_values, "moisture", Tt), this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return m;
    const e = this._config, t = Tt.map((c) => ({
      key: c,
      role: p(this.hass, e[c])
    })), r = this.missingRolesWarning(t.map((c) => c.role));
    if (r) return this.renderWarning(r);
    const { big: n, rest: i } = B(t, this._bigKeys), o = t[0].role, l = q(o), a = Kn(
      l,
      e.dry_below ?? At,
      e.wet_above ?? Ot
    );
    return this.renderTile({
      icon: Yn[a],
      color: Gn[a],
      primary: He(e.name, o),
      imageUrl: this.entityImage(o?.stateObj),
      defaultIconAction: ce(o?.entityId),
      secondary: O([
        D(this.hass, o),
        ...i.map((c) => L(this.hass, c.role))
      ]),
      mainEntityId: o?.entityId,
      values: this.bigValues(n),
      // The gauge is a stock HA feature, not a bar of our own. It takes its
      // colour from --tile-color, that is, from our dryness thresholds.
      ownFeatures: l === void 0 ? void 0 : [{ type: "bar-gauge", min: 0, max: 100 }]
    });
  }
}
Jn([
  b()
], Xt.prototype, "_config");
x("horos-plant-tile", Xt, {
  type: "horos-plant-tile",
  name: { ru: "Растение", en: "Plant" },
  description: {
    ru: "Влажность почвы с порогами сухости, температура почвы и заряд датчика",
    en: "Soil moisture with dryness thresholds, soil temperature and sensor battery"
  },
  preview: !0,
  suggest: (s, e) => {
    if (F(e) !== "sensor" || Z(s, e) !== "moisture")
      return null;
    const t = J(s, e);
    return U("custom:horos-plant-tile", {
      moisture: e,
      temperature: N(s, t, "sensor", "temperature"),
      battery: N(s, t, "sensor", "battery")
    });
  }
});
var Xn = Object.defineProperty, Fe = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && Xn(e, t, n), n;
};
class Ee extends ae {
  constructor() {
    super(...arguments), this._children = [];
  }
  static {
    this.styles = Ie`
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
  /** Height depends on the number of cells, so HA computes it itself. */
  getGridOptions() {
    return { columns: 12, rows: "auto", min_columns: 6, min_rows: 2 };
  }
  /** A subclass must call this at the end of setConfig. */
  rebuild() {
    this._build();
  }
  async _build() {
    const e = window.loadCardHelpers;
    if (!e) {
      this._error = "Home Assistant did not provide card helpers";
      return;
    }
    const t = await e(), r = this.headingConfig();
    this._heading = r ? t.createCardElement(r) : void 0, this._children = this.childConfigs().map(
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
    return this._error ? v`<ha-card><div class="warning">${this._error}</div></ha-card>` : this._children.length ? v`
      ${this._heading ? v`<div class="heading">${this._heading}</div>` : m}
      <div class="grid" style="--columns: ${this.columns()}">
        ${this._children}
      </div>
    ` : m;
  }
}
Fe([
  Re({ attribute: !1 })
], Ee.prototype, "hass");
Fe([
  b()
], Ee.prototype, "_heading");
Fe([
  b()
], Ee.prototype, "_children");
Fe([
  b()
], Ee.prototype, "_error");
function Qt(s) {
  if (!s) return;
  const e = s.split(":").pop();
  return e ? e.trim() : s;
}
function Qn(s) {
  return typeof s == "string" ? { entity: s } : s;
}
var er = Object.defineProperty, tr = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && er(e, t, n), n;
};
const sr = 3;
class es extends Ee {
  static async getConfigElement() {
    return await Promise.resolve().then(() => vi), document.createElement(
      "horos-buttons-tile-editor"
    );
  }
  static getStubConfig() {
    return { buttons: [] };
  }
  setConfig(e) {
    if (!e.buttons?.length)
      throw new Error("At least one button is required (buttons)");
    this._config = e, this.rebuild();
  }
  columns() {
    return this._config?.columns ?? sr;
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
      const t = Qn(e), r = this.hass?.states[t.entity];
      return {
        type: "button",
        entity: t.entity,
        name: t.name ?? Qt(r?.attributes.friendly_name),
        icon: t.icon,
        show_state: !1,
        tap_action: { action: "toggle" }
      };
    }) : [];
  }
}
tr([
  b()
], es.prototype, "_config");
x("horos-buttons-tile", es, {
  type: "horos-buttons-tile",
  name: { ru: "Кнопки скриптов", en: "Script buttons" },
  description: {
    ru: "Сетка кнопок, вызывающих скрипты, под общим заголовком",
    en: "A grid of buttons running scripts, under one heading"
  },
  preview: !0
});
const V = Ie`
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
   * A fraction, not auto width: otherwise names of different lengths drag the
   * bars around and the row stops reading as one scale.
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

  /* The bar as in the stock hui-bar-gauge-card-feature, only thinner. */
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
function K(s, e) {
  return v`
    <div class="levels">
      ${s.map(
    (t) => v`
          <button
            class="level ${t.alarm ? "low" : ""}"
            style="--ink: ${t.ink};"
            title="${t.name}: ${t.text}"
            @click=${(r) => {
      r.stopPropagation(), e(t.entityId);
    }}
          >
            <span class="name">
              ${t.alarm ? v`<ha-icon
                    icon=${t.alarmIcon ?? "mdi:alert-circle"}
                  ></ha-icon>` : m}${t.name}
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
function te(s, e) {
  if (s) {
    if (e && s.startsWith(e)) {
      const t = s.slice(e.length).trim();
      if (t) return t;
    }
    return s;
  }
}
function ts(s) {
  return s ? s.replace(/[\s—-]*(battery(\s+level)?|заряд)\s*$/i, "").trim() || s : void 0;
}
function xe(s) {
  return s === void 0 ? "var(--state-unavailable-color)" : s >= 70 ? "var(--state-sensor-battery-high-color, #4caf50)" : s >= 30 ? "var(--state-sensor-battery-medium-color, #ffa600)" : "var(--state-sensor-battery-low-color, #db4437)";
}
const nr = xe;
function rr(s) {
  return s === void 0 ? "var(--state-unavailable-color)" : s >= 90 ? "var(--error-color, #db4437)" : s >= 80 ? "var(--warning-color, #ffa600)" : "var(--state-icon-color)";
}
function M(s) {
  return typeof s == "string" ? { entity: s } : s;
}
const ir = [
  [/black|pgbk|_bk(_|$)/i, "black"],
  [/cyan/i, "cyan"],
  [/magenta/i, "purple"],
  [/yellow/i, "yellow"],
  // MC is the maintenance tank, not ink. It gets its own shade, otherwise it is
  // indistinguishable from black: that one is painted in the text colour and
  [/_mc(_|$)|maintenance/i, "blue-grey"]
];
function or(s) {
  return ir.find(([t]) => t.test(s))?.[1];
}
function ar(s) {
  return s === "black" ? "var(--primary-text-color)" : /^(#|rgb|hsl|var\()/.test(s) ? s : `var(--${s}-color, var(--state-icon-color))`;
}
const lr = te, Pt = (s, e) => typeof s == "number" && Number.isFinite(s) ? s : e;
function cr(s, e, t) {
  const r = Number(s);
  if (!Number.isFinite(r)) return;
  const n = Pt(e.marker_high_level, 100), i = Pt(e.marker_low_level, 0), o = String(e.marker_type ?? "").includes("waste"), l = n > 0 ? Math.max(0, Math.min(100, r / n * 100)) : 0, a = o ? r >= n : r <= (t ?? i);
  return { fill: l, alarm: a, fills: o };
}
var ur = Object.defineProperty, hr = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && ur(e, t, n), n;
};
class ss extends E {
  static {
    this.styles = [W, V];
  }
  /** Level rows under the tile: roughly two per grid row. */
  contentRows() {
    return Math.ceil(((this._config?.cartridges.length ?? 0) + (this._config?.sensors?.length ?? 0)) / 2);
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => bi), document.createElement(
      "horos-printer-tile-editor"
    );
  }
  static getStubConfig() {
    return { cartridges: [] };
  }
  setConfig(e) {
    if (!e.cartridges?.length)
      throw new Error("At least one cartridge is required (cartridges)");
    this.base = e, this._config = e;
  }
  get _printerName() {
    return this._config?.name ? this._config.name : (this._config?.status ? this.hass?.states[this._config.status] : void 0)?.attributes.friendly_name;
  }
  _tanks() {
    if (!this._config || !this.hass) return [];
    const e = this._printerName;
    return this._config.cartridges.map((t) => M(t)).map((t) => {
      const r = this.hass.states[t.entity];
      return {
        entityId: t.entity,
        name: t.name ?? lr(r?.attributes.friendly_name, e),
        ink: ar(
          t.color ?? or(t.entity) ?? "grey"
        ),
        marker: r ? cr(
          r.state,
          r.attributes,
          this._config.low_below
        ) : void 0,
        text: r ? this.hass.formatEntityState(r) : "—"
      };
    });
  }
  render() {
    if (!this._config || !this.hass) return m;
    const e = this._tanks(), t = e.filter((a) => !a.marker && a.text === "—");
    if (t.length)
      return this.renderWarning(
        `Entities not found: ${t.map((a) => a.entityId).join(", ")}`
      );
    const n = e.filter((a) => a.marker && !a.marker.fills).reduce(
      (a, c) => !a || c.marker.fill < a.marker.fill ? c : a,
      void 0
    ), i = this._config.status ? p(this.hass, this._config.status) : void 0, o = (this._config.sensors ?? []).map((a) => M(a)).map((a) => p(this.hass, a.entity)), l = i?.stateObj;
    return this.renderTile({
      icon: "mdi:printer",
      color: l ? H(l) : "var(--state-icon-color)",
      primary: this._printerName ?? d(this.hass, "printer.title"),
      secondary: O([
        L(this.hass, i),
        ...o.map((a) => L(this.hass, a))
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
      customFeatures: K(
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
hr([
  b()
], ss.prototype, "_config");
x("horos-printer-tile", ss, {
  type: "horos-printer-tile",
  name: { ru: "Принтер", en: "Printer" },
  description: {
    ru: "Уровни чернил и состояние принтера в одной плитке",
    en: "Ink levels and printer status in a single tile"
  },
  preview: !0,
  suggest: (s, e) => {
    const t = J(s, e), r = t.filter(
      (i) => s.states[i]?.attributes.marker_type !== void 0
    );
    if (!r.length) return null;
    const n = t.find(
      (i) => F(i) === "sensor" && !r.includes(i) && Number.isNaN(Number(s.states[i]?.state))
    );
    return U(
      "custom:horos-printer-tile",
      { status: n },
      { cartridges: r }
    );
  }
});
var dr = Object.defineProperty, mr = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && dr(e, t, n), n;
};
const pr = 20;
class ns extends E {
  static {
    this.styles = [W, V];
  }
  /** Level rows under the tile: roughly two per grid row. */
  contentRows() {
    return Math.ceil((this._config?.consumables?.length ?? 0) / 2);
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => wi), document.createElement(
      "horos-vacuum-tile-editor"
    );
  }
  static getStubConfig() {
    return { vacuum: "" };
  }
  setConfig(e) {
    if (!e.vacuum)
      throw new Error("A vacuum is required (vacuum)");
    this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return m;
    const e = this._config, t = p(this.hass, e.vacuum), r = p(this.hass, e.battery), n = (e.sensors ?? []).map((c) => M(c)).map((c) => p(this.hass, c.entity)), i = this.missingRolesWarning([t, r, ...n]);
    if (i) return this.renderWarning(i);
    const o = t?.stateObj?.attributes.friendly_name, l = e.low_below ?? pr, a = (e.consumables ?? []).map((c) => M(c)).map((c) => {
      const h = p(this.hass, c.entity), u = q(h) ?? 0, _ = c.name ?? te(h?.stateObj?.attributes.friendly_name, o);
      return {
        entityId: c.entity,
        name: _ ?? c.entity,
        text: `${u}%`,
        // Painting them in the tile colour is wrong: a docked vacuum's colour
        // is the inactive one and every bar comes out the same grey. We paint
        // by level — a consumable asks the same question a battery does.
        ink: c.color ?? xe(u),
        level: u,
        alarm: u < l
      };
    });
    return this.renderTile({
      icon: "mdi:robot-vacuum",
      color: H(t?.stateObj),
      primary: e.name ?? o ?? d(this.hass, "vacuum.title"),
      mainEntityId: t?.entityId,
      secondary: O([
        D(this.hass, t),
        this.mainStateSegment(t),
        ...n.map((c) => L(this.hass, c))
      ]),
      values: r ? this.bigValues([{ key: "battery", role: r }]) : [],
      customFeatures: a.length ? K(a, (c) => this.fireMoreInfo(c)) : void 0
    });
  }
}
mr([
  b()
], ns.prototype, "_config");
x("horos-vacuum-tile", ns, {
  type: "horos-vacuum-tile",
  name: { ru: "Пылесос", en: "Vacuum" },
  description: {
    ru: "Состояние робота, заряд и ресурс расходников в одной плитке",
    en: "Robot status, battery and consumable life in a single tile"
  },
  preview: !0,
  suggest: (s, e) => {
    const t = J(s, e), r = we(t, "vacuum"), n = N(s, t, "sensor", "battery");
    return !r || !n ? null : U("custom:horos-vacuum-tile", { vacuum: r, battery: n });
  }
});
var fr = Object.defineProperty, gr = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && fr(e, t, n), n;
};
const _r = 30;
class rs extends E {
  static async getConfigElement() {
    return await Promise.resolve().then(() => $i), document.createElement(
      "horos-batteries-tile-editor"
    );
  }
  static getStubConfig() {
    return { batteries: [] };
  }
  setConfig(e) {
    if (!e.batteries?.length)
      throw new Error("At least one battery is required (batteries)");
    this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return m;
    const e = this._config, t = e.low_below ?? _r, r = [], n = [];
    for (const l of e.batteries) {
      const a = M(l), c = p(this.hass, a.entity);
      if (c?.missing) {
        n.push(a.entity);
        continue;
      }
      const h = q(c);
      h !== void 0 && r.push({
        entityId: a.entity,
        name: a.name ?? ts(c?.stateObj?.attributes.friendly_name) ?? a.entity,
        level: h
      });
    }
    const i = r.filter((l) => l.level < t).sort((l, a) => l.level - a.level), o = i[0];
    return this.renderTile({
      icon: o ? "mdi:battery-alert-variant-outline" : "mdi:battery",
      color: nr(o?.level),
      primary: e.name ?? d(this.hass, "batteries.title"),
      mainEntityId: o?.entityId,
      secondary: O([
        ...i.length ? i.map((l) => ({
          text: `${l.name} ${l.level}%`,
          entityId: l.entityId
        })) : [
          {
            text: d(this.hass, "batteries.allFull", {
              count: r.length
            })
          }
        ],
        // A row that disappeared is dropped, but staying silent about it is not
        // an option: a list card must not go dark over one renamed entity, and
        // must not pretend the entity was never there.
        ...n.length ? [{ text: d(this.hass, "list.missing", { count: n.length }) }] : []
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
gr([
  b()
], rs.prototype, "_config");
x("horos-batteries-tile", rs, {
  type: "horos-batteries-tile",
  name: { ru: "Батарейки", en: "Batteries" },
  description: {
    ru: "Только садящиеся батарейки, от самой пустой",
    en: "Only the batteries that are running down, emptiest first"
  },
  preview: !0,
  suggest: (s, e) => F(e) !== "sensor" || Z(s, e) !== "battery" ? null : U(
    "custom:horos-batteries-tile",
    {},
    { batteries: Le(s, e, "sensor", ["battery"]) }
  )
});
var yr = Object.defineProperty, vr = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && yr(e, t, n), n;
};
class is extends E {
  static async getConfigElement() {
    return await Promise.resolve().then(() => Ei), document.createElement(
      "horos-safety-tile-editor"
    );
  }
  static getStubConfig() {
    return { sensors: [] };
  }
  setConfig(e) {
    if (!e.sensors?.length)
      throw new Error("At least one sensor is required (sensors)");
    this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return m;
    const e = this._config, t = [], r = [], n = [];
    let i = 0;
    for (const a of e.sensors) {
      const c = M(a), h = p(this.hass, c.entity);
      if (h?.missing) {
        n.push(c.entity);
        continue;
      }
      i += 1;
      const u = c.name ?? h?.stateObj?.attributes.friendly_name ?? c.entity;
      h?.unavailable ? r.push({ text: d(this.hass, "safety.offline", { name: u }), entityId: c.entity }) : h?.stateObj?.state === "on" && t.push({ text: u, entityId: c.entity });
    }
    const o = t.length > 0, l = [...t, ...r];
    return this.renderTile({
      icon: o ? "mdi:shield-alert" : r.length ? "mdi:shield-off-outline" : "mdi:shield-check",
      color: o ? "var(--error-color, #db4437)" : r.length ? "var(--warning-color, #ffa600)" : "var(--success-color, #43a047)",
      primary: e.name ?? d(this.hass, "safety.title"),
      mainEntityId: l[0]?.entityId,
      secondary: O([
        ...l.length ? l : [{ text: d(this.hass, "safety.calm", { count: i }) }],
        ...n.length ? [{ text: d(this.hass, "list.missing", { count: n.length }) }] : []
      ])
    });
  }
}
vr([
  b()
], is.prototype, "_config");
x("horos-safety-tile", is, {
  type: "horos-safety-tile",
  name: { ru: "Безопасность", en: "Safety" },
  description: {
    ru: "Протечка, дым, газ — и датчики, потерявшие связь",
    en: "Leak, smoke, gas — and sensors that lost connection"
  },
  preview: !0,
  suggest: (s, e) => {
    const t = ["moisture", "gas", "smoke", "carbon_monoxide", "safety"];
    return F(e) !== "binary_sensor" || !t.includes(Z(s, e) ?? "") ? null : U(
      "custom:horos-safety-tile",
      {},
      { sensors: Le(s, e, "binary_sensor", t) }
    );
  }
});
var br = Object.defineProperty, wr = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && br(e, t, n), n;
};
const It = ["disk", "download", "upload"];
class os extends E {
  constructor() {
    super(...arguments), this._bigKeys = ["disk"];
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => xi), document.createElement(
      "horos-server-tile-editor"
    );
  }
  static getStubConfig() {
    return { disk: "" };
  }
  setConfig(e) {
    if (!e.disk && !e.download && !e.status)
      throw new Error(
        "At least one entity is required: status, disk or download"
      );
    this._bigKeys = Y(e.big_values, "disk", It), this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return m;
    const e = this._config, t = It.map((a) => ({
      key: a,
      role: p(this.hass, e[a])
    })), r = p(this.hass, e.status), n = (e.services ?? []).map((a) => M(a)).map((a) => p(this.hass, a.entity)), i = this.missingRolesWarning([
      r,
      ...t.map((a) => a.role),
      ...n
    ]);
    if (i) return this.renderWarning(i);
    const { big: o, rest: l } = B(t, this._bigKeys);
    return this.renderTile({
      icon: "mdi:server",
      color: r ? H(r.stateObj) : "var(--state-icon-color)",
      primary: e.name ?? d(this.hass, "server.title"),
      mainEntityId: r?.entityId ?? t[0].role?.entityId,
      secondary: O([
        D(this.hass, r),
        this.mainStateSegment(r),
        ...l.map((a) => {
          const c = L(this.hass, a.role);
          if (!c) return;
          const h = a.key === "download" ? "↓ " : a.key === "upload" ? "↑ " : "";
          return { ...c, text: h + c.text };
        }),
        ...n.map((a) => L(this.hass, a))
      ]),
      values: this.bigValues(o)
    });
  }
}
wr([
  b()
], os.prototype, "_config");
x("horos-server-tile", os, {
  type: "horos-server-tile",
  name: { ru: "Домашний сервер", en: "Home server" },
  description: {
    ru: "Диск, скорости и состояние сервисов в одной плитке",
    en: "Disk, speeds and service status in a single tile"
  },
  preview: !0
});
var $r = Object.defineProperty, Er = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && $r(e, t, n), n;
};
class as extends E {
  static {
    this.styles = [W, V];
  }
  /** Level rows under the tile: roughly two per grid row. */
  contentRows() {
    return Math.ceil((this._config?.devices?.length ?? 0) / 2);
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Si), document.createElement(
      "horos-person-tile-editor"
    );
  }
  static getStubConfig() {
    return { person: "" };
  }
  setConfig(e) {
    if (!e.person)
      throw new Error("A person is required (person)");
    this.base = { show_entity_picture: !0, ...e }, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return m;
    const e = this._config, t = p(this.hass, e.person), r = p(this.hass, e.battery), n = p(this.hass, e.location), i = this.missingRolesWarning([t, r, n]);
    if (i) return this.renderWarning(i);
    const o = (e.devices ?? []).map((l) => M(l)).map((l) => {
      const a = p(this.hass, l.entity), c = q(a), h = l.name ?? ts(
        te(
          a?.stateObj?.attributes.friendly_name,
          e.name
        )
      ) ?? l.entity;
      return {
        entityId: l.entity,
        name: h,
        text: c === void 0 ? d(this.hass, "value.unknown") : `${c}%`,
        ink: l.color ?? xe(c),
        level: c ?? 0,
        alarm: c !== void 0 && c < 20,
        alarmIcon: "mdi:battery-alert-variant-outline"
      };
    });
    return this.renderTile({
      icon: "mdi:account",
      color: H(t?.stateObj),
      primary: e.name ?? t?.stateObj?.attributes.friendly_name ?? d(this.hass, "person.title"),
      mainEntityId: t?.entityId,
      imageUrl: this.entityImage(t?.stateObj),
      secondary: O([
        D(this.hass, t),
        this.mainStateSegment(t),
        L(this.hass, n)
      ]),
      values: r ? this.bigValues([{ key: "battery", role: r }]) : [],
      customFeatures: o.length ? K(o, (l) => this.fireMoreInfo(l)) : void 0
    });
  }
}
Er([
  b()
], as.prototype, "_config");
x("horos-person-tile", as, {
  type: "horos-person-tile",
  name: { ru: "Человек", en: "Person" },
  description: {
    ru: "Дома ли он, где именно и заряд его устройств",
    en: "Whether they are home, where exactly, and their devices' battery"
  },
  preview: !0,
  suggest: (s, e) => {
    if (F(e) !== "person") return null;
    const r = (s.states[e]?.attributes.device_trackers ?? []).map((n) => N(s, J(s, n), "sensor", "battery")).find(Boolean);
    return r ? U("custom:horos-person-tile", {
      person: e,
      battery: r
    }) : null;
  }
});
function ze(s, e, t) {
  if (!s || !e?.length) return;
  let r, n;
  for (const i of e) {
    const o = p(s, i), l = q(o);
    l !== void 0 && (n === void 0 || (t === "max" ? l > n : l < n)) && (r = o, n = l);
  }
  return r ?? p(s, e[0]);
}
var xr = Object.defineProperty, Sr = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && xr(e, t, n), n;
};
const Cr = [
  "temperature",
  "cpu",
  "memory",
  "gpu",
  "disk"
];
class ls extends E {
  constructor() {
    super(...arguments), this._bigKeys = ["temperature"];
  }
  static {
    this.styles = [W, V];
  }
  /** Level rows under the tile: roughly two per grid row. */
  contentRows() {
    return Math.ceil(4 / 2);
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Ci), document.createElement(
      "horos-computer-tile-editor"
    );
  }
  static getStubConfig() {
    return { cpu: "" };
  }
  setConfig(e) {
    if (!e.cpu && !e.memory && !e.temperatures?.length && !e.disks?.length && !e.disks_free?.length)
      throw new Error(
        "At least one entity is required: cpu, memory, temperatures or disks"
      );
    this._bigKeys = Y(
      e.big_values,
      "temperature",
      Cr
    ), this.base = e, this._config = e;
  }
  /** The card's roles: the lists are already reduced to their extreme sensor. */
  _roles() {
    const e = this._config;
    return [
      {
        key: "temperature",
        role: ze(this.hass, e.temperatures, "max")
      },
      { key: "cpu", role: p(this.hass, e.cpu) },
      { key: "memory", role: p(this.hass, e.memory) },
      { key: "gpu", role: p(this.hass, e.gpu) },
      { key: "disk", role: ze(this.hass, e.disks, "max") }
    ];
  }
  /** The partition with the least free space left. */
  _freeDisk() {
    return ze(this.hass, this._config?.disks_free, "min");
  }
  _levelRow(e, t) {
    if (!t) return;
    const r = q(t);
    return {
      entityId: t.entityId,
      name: e,
      text: r === void 0 ? d(this.hass, "value.unknown") : `${Math.round(r)}%`,
      ink: rr(r),
      level: r ?? 0,
      alarm: r !== void 0 && r >= 90,
      alarmIcon: "mdi:alert-circle"
    };
  }
  render() {
    if (!this._config || !this.hass) return m;
    const e = this._config, t = this._roles(), r = p(this.hass, e.status), n = (e.sensors ?? []).map((u) => M(u)).map((u) => p(this.hass, u.entity)), i = this.missingRolesWarning([
      r,
      ...t.map((u) => u.role),
      ...n
    ]);
    if (i) return this.renderWarning(i);
    const o = (e.alerts ?? []).map((u) => M(u)).map((u) => ({ alert: u, role: p(this.hass, u.entity) })).filter(({ role: u }) => u?.stateObj?.state === "on").map(({ alert: u, role: _ }) => ({
      text: u.name ?? te(
        _?.stateObj?.attributes.friendly_name,
        e.name
      ) ?? u.entity,
      entityId: u.entity
    })), { big: l } = B(t, this._bigKeys), a = this._freeDisk(), c = q(a), h = [
      this._levelRow(d(this.hass, "level.cpu"), t[1].role),
      this._levelRow(d(this.hass, "level.memory"), t[2].role),
      this._levelRow(d(this.hass, "level.gpu"), t[3].role),
      this._levelRow(d(this.hass, "level.disk"), t[4].role),
      // Free space is a resource that runs out, so both the colour and the alarm
      // here behave like a battery's, not like load's.
      a ? {
        entityId: a.entityId,
        name: d(this.hass, "level.diskFree"),
        text: c === void 0 ? d(this.hass, "value.unknown") : `${Math.round(c)}%`,
        ink: xe(c),
        level: c ?? 0,
        alarm: c !== void 0 && c < 10,
        alarmIcon: "mdi:harddisk"
      } : void 0
    ].filter((u) => !!u);
    return this.renderTile({
      icon: "mdi:desktop-tower-monitor",
      color: r ? H(r.stateObj) : "var(--state-icon-color)",
      primary: e.name ?? d(this.hass, "computer.title"),
      mainEntityId: r?.entityId ?? t[0].role?.entityId ?? a?.entityId,
      secondary: O([
        D(this.hass, r),
        ...o,
        ...n.map((u) => L(this.hass, u)),
        // Load and disks are already shown as bars with their own labels.
        ...this._bigKeys.includes("temperature") ? [] : [L(this.hass, t[0].role)]
      ]),
      values: this.bigValues(l),
      customFeatures: h.length ? K(h, (u) => this.fireMoreInfo(u)) : void 0
    });
  }
}
Sr([
  b()
], ls.prototype, "_config");
x("horos-computer-tile", ls, {
  type: "horos-computer-tile",
  name: { ru: "Компьютер", en: "Computer" },
  description: {
    ru: "Самая горячая точка, загрузка и диски в одной плитке",
    en: "Hottest spot, load and disks in a single tile"
  },
  preview: !0
});
var kr = Object.defineProperty, Ar = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && kr(e, t, n), n;
};
const jt = ["pm25", "humidity", "temperature", "power"];
class cs extends E {
  constructor() {
    super(...arguments), this._bigKeys = ["pm25"];
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => ki), document.createElement("horos-air-tile-editor");
  }
  static getStubConfig() {
    return { appliance: "" };
  }
  setConfig(e) {
    if (!e.appliance)
      throw new Error("An appliance is required (appliance)");
    this._bigKeys = Y(e.big_values, "pm25", jt), this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return m;
    const e = this._config, t = p(this.hass, e.appliance), r = jt.map((c) => ({
      key: c,
      role: p(this.hass, e[c])
    })), n = (e.sensors ?? []).map((c) => M(c)).map((c) => p(this.hass, c.entity)), i = this.missingRolesWarning([
      t,
      ...r.map((c) => c.role),
      ...n
    ]);
    if (i) return this.renderWarning(i);
    const o = (e.alerts ?? []).map((c) => M(c)).map((c) => ({ alert: c, role: p(this.hass, c.entity) })).filter(({ role: c }) => c?.stateObj?.state === "on").map(({ alert: c, role: h }) => ({
      text: c.name ?? te(
        h?.stateObj?.attributes.friendly_name,
        e.name
      ) ?? c.entity,
      entityId: c.entity
    })), { big: l, rest: a } = B(r, this._bigKeys);
    return this.renderTile({
      icon: e.humidity ? "mdi:air-humidifier" : "mdi:air-filter",
      color: H(t?.stateObj),
      primary: e.name ?? t?.stateObj?.attributes.friendly_name ?? d(this.hass, "air.title"),
      mainEntityId: t?.entityId,
      secondary: O([
        D(this.hass, t),
        ...o,
        this.mainStateSegment(t),
        ...n.map((c) => L(this.hass, c)),
        ...a.map((c) => L(this.hass, c.role))
      ]),
      values: this.bigValues(l)
    });
  }
}
Ar([
  b()
], cs.prototype, "_config");
x("horos-air-tile", cs, {
  type: "horos-air-tile",
  name: { ru: "Воздух", en: "Air" },
  description: {
    ru: "Очиститель, рекуператор, увлажнитель — прибор и что с воздухом",
    en: "Purifier, recuperator, humidifier — the appliance and the air"
  },
  preview: !0,
  suggest: (s, e) => {
    const t = J(s, e), r = {
      appliance: we(t, "fan", "humidifier"),
      pm25: N(s, t, "sensor", "pm25"),
      humidity: N(s, t, "sensor", "humidity"),
      temperature: N(s, t, "sensor", "temperature"),
      power: N(s, t, "sensor", "power")
    };
    return !r.appliance || $e(r) < 2 ? null : U("custom:horos-air-tile", r);
  }
});
var Or = Object.defineProperty, Tr = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && Or(e, t, n), n;
};
const Mt = ["illuminance", "battery"], Pr = 1, Ir = 2, jr = 4;
class us extends E {
  constructor() {
    super(...arguments), this._bigKeys = ["illuminance"];
  }
  static {
    this.styles = [W, V];
  }
  /** Level rows under the tile: roughly two per grid row. */
  contentRows() {
    return Math.ceil(2 / 2);
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Ai), document.createElement(
      "horos-cover-tile-editor"
    );
  }
  static getStubConfig() {
    return { cover: "" };
  }
  setConfig(e) {
    if (!e.cover)
      throw new Error("A cover is required (cover)");
    this._bigKeys = Y(e.big_values, "illuminance", Mt), this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return m;
    const e = this._config, t = p(this.hass, e.cover), r = p(this.hass, e.position), n = Mt.map((y) => ({
      key: y,
      role: p(this.hass, e[y])
    })), i = this.missingRolesWarning([
      t,
      r,
      ...n.map((y) => y.role)
    ]);
    if (i) return this.renderWarning(i);
    const { big: o, rest: l } = B(n, this._bigKeys), a = Number(
      t?.stateObj?.attributes.supported_features ?? 0
    ), c = (a & jr) !== 0, h = (a & (Pr | Ir)) !== 0, u = [];
    e.controls !== !1 && (c && u.push({ type: "cover-position" }), h && u.push({ type: "cover-open-close" }));
    const _ = q(r), f = r && !c ? [
      {
        entityId: r.entityId,
        name: d(this.hass, "level.open"),
        text: _ === void 0 ? d(this.hass, "value.unknown") : `${Math.round(_)}%`,
        ink: xe(_),
        level: _ ?? 0
      }
    ] : [];
    return this.renderTile({
      icon: "mdi:curtains",
      color: H(t?.stateObj),
      primary: e.name ?? t?.stateObj?.attributes.friendly_name ?? d(this.hass, "cover.title"),
      mainEntityId: t?.entityId,
      secondary: O([
        D(this.hass, t),
        this.mainStateSegment(t),
        ...l.map((y) => L(this.hass, y.role))
      ]),
      values: this.bigValues(o),
      ownFeatures: u.length ? u : void 0,
      customFeatures: f.length ? K(f, (y) => this.fireMoreInfo(y)) : void 0
    });
  }
}
Tr([
  b()
], us.prototype, "_config");
x("horos-cover-tile", us, {
  type: "horos-cover-tile",
  name: { ru: "Шторы", en: "Curtains" },
  description: {
    ru: "Насколько открыты, светло ли снаружи и сколько заряда",
    en: "How far open, how bright outside, and battery"
  },
  preview: !0,
  suggest: (s, e) => {
    const t = J(s, e), r = {
      cover: we(t, "cover"),
      illuminance: N(s, t, "sensor", "illuminance"),
      battery: N(s, t, "sensor", "battery")
    };
    return !r.cover || $e(r) < 2 ? null : U("custom:horos-cover-tile", r);
  }
});
const Mr = [
  "update",
  "select",
  "text",
  "button",
  "number",
  "event",
  "notify"
];
function Rr(s, e = {}) {
  if (!s) return [];
  const t = new Set(e.ignore ?? []), r = new Set(
    e.ignoreDomains ?? Mr
  ), n = /* @__PURE__ */ new Map();
  for (const [i, o] of Object.entries(s.states)) {
    if (!o || o.state !== "unavailable" || t.has(i) || r.has(i.split(".")[0])) continue;
    const l = s.entities?.[i];
    if (l?.hidden) continue;
    const a = l?.device_id ? s.devices?.[l.device_id] : void 0, c = a?.name_by_user ?? a?.name ?? o.attributes.friendly_name ?? i, h = l?.device_id ?? i, u = n.get(h);
    u ? u.count += 1 : n.set(h, { name: c, count: 1, entityId: i });
  }
  return [...n.values()].sort(
    (i, o) => o.count - i.count || i.name.localeCompare(o.name)
  );
}
var Hr = Object.defineProperty, Nr = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && Hr(e, t, n), n;
};
const Lr = 4;
class hs extends E {
  static async getConfigElement() {
    return await Promise.resolve().then(() => Oi), document.createElement(
      "horos-offline-tile-editor"
    );
  }
  static getStubConfig() {
    return {};
  }
  setConfig(e) {
    this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return m;
    const e = this._config, t = Rr(this.hass, {
      ignore: e.ignore,
      ignoreDomains: e.ignore_domains
    }), r = e.limit ?? Lr, n = t.slice(0, r), i = t.length - n.length;
    return this.renderTile({
      icon: t.length ? "mdi:lan-disconnect" : "mdi:lan-check",
      color: t.length ? "var(--warning-color, #ffa600)" : "var(--success-color, #43a047)",
      primary: e.name ?? d(this.hass, "offline.title"),
      mainEntityId: t[0]?.entityId,
      secondary: O(
        t.length ? [
          ...n.map((o) => ({
            text: o.count > 1 ? `${o.name} (${o.count})` : o.name,
            entityId: o.entityId
          })),
          i > 0 ? { text: d(this.hass, "offline.more", { count: i }) } : void 0
        ] : [{ text: d(this.hass, "offline.allAnswer") }]
      ),
      values: t.length ? [
        {
          value: String(t.length),
          entityId: t[0]?.entityId,
          icon: "mdi:devices"
        }
      ] : []
    });
  }
}
Nr([
  b()
], hs.prototype, "_config");
x("horos-offline-tile", hs, {
  type: "horos-offline-tile",
  name: { ru: "Не отвечает", en: "Not responding" },
  description: {
    ru: "Что перестало отвечать, посчитанное по устройствам",
    en: "Devices that went silent, grouped by device"
  },
  preview: !0
});
var Fr = Object.defineProperty, Ur = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && Fr(e, t, n), n;
};
const Dr = 5;
class ds extends E {
  static {
    this.styles = [W, V];
  }
  /** Level rows under the tile: roughly two per grid row. */
  contentRows() {
    return Math.ceil(Math.min(this._config?.consumers.length ?? 0, this._config?.limit ?? 5) / 2);
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Ti), document.createElement(
      "horos-energy-tile-editor"
    );
  }
  static getStubConfig() {
    return { consumers: [] };
  }
  setConfig(e) {
    if (!e.consumers?.length)
      throw new Error("At least one consumer is required (consumers)");
    this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return m;
    const e = this._config, t = p(this.hass, e.total), r = [], n = [], i = [];
    for (const h of e.consumers) {
      const u = M(h), _ = p(this.hass, u.entity);
      if (_?.missing) {
        r.push(u.entity);
        continue;
      }
      const f = u.name ?? te(_?.stateObj?.attributes.friendly_name, e.name) ?? u.entity;
      if (_?.unavailable) {
        n.push(f);
        continue;
      }
      const y = q(_);
      y === void 0 || y <= 0 || i.push({
        watts: y,
        row: {
          entityId: u.entity,
          name: f,
          text: this.hass.formatEntityState(_.stateObj),
          ink: u.color ?? "var(--amber-color, #ffc107)"
        }
      });
    }
    i.sort((h, u) => u.watts - h.watts);
    const o = i.slice(0, e.limit ?? Dr), l = o[0]?.watts ?? 0, a = o.map(({ row: h, watts: u }) => ({
      ...h,
      level: l > 0 ? u / l * 100 : 0
    })), c = [
      D(this.hass, t),
      i.length ? { text: d(this.hass, "energy.consuming", { count: i.length }) } : { text: d(this.hass, "energy.idle") },
      n.length ? { text: d(this.hass, "offline.count", { count: n.length }) } : void 0,
      r.length ? { text: d(this.hass, "list.missing", { count: r.length }) } : void 0
    ];
    return this.renderTile({
      icon: "mdi:flash",
      color: "var(--amber-color, #ffc107)",
      primary: e.name ?? d(this.hass, "energy.title"),
      mainEntityId: t?.entityId ?? o[0]?.row.entityId,
      secondary: O([this.mainStateSegment(t), ...c]),
      values: t ? this.bigValues([{ key: "total", role: t }]) : [],
      customFeatures: a.length ? K(a, (h) => this.fireMoreInfo(h)) : void 0
    });
  }
}
Ur([
  b()
], ds.prototype, "_config");
x("horos-energy-tile", ds, {
  type: "horos-energy-tile",
  name: { ru: "Энергия", en: "Energy" },
  description: {
    ru: "Кто в доме ест электричество, от самого прожорливого",
    en: "Who in the house draws power, hungriest first"
  },
  preview: !0,
  suggest: (s, e) => {
    if (F(e) !== "sensor" || Z(s, e) !== "power")
      return null;
    const t = Le(
      s,
      e,
      "sensor",
      ["power"],
      12,
      (r) => St(s, r)
    );
    return t.length ? U(
      "custom:horos-energy-tile",
      { total: St(s, e) ? void 0 : e },
      { consumers: t, limit: 6 }
    ) : null;
  }
});
var zr = Object.defineProperty, Wr = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && zr(e, t, n), n;
};
class ms extends E {
  static async getConfigElement() {
    return await Promise.resolve().then(() => Pi), document.createElement(
      "horos-presence-tile-editor"
    );
  }
  static getStubConfig() {
    return { areas: [] };
  }
  setConfig(e) {
    if (!e.areas?.length)
      throw new Error("At least one area is required (areas)");
    this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return m;
    const e = this._config, t = [], r = [];
    let n = 0, i = 0;
    for (const o of e.areas) {
      const l = M(o), a = p(this.hass, l.entity);
      if (a?.missing) {
        r.push(l.entity);
        continue;
      }
      if (i += 1, a?.unavailable) {
        n += 1;
        continue;
      }
      a?.stateObj?.state === "on" && t.push({
        text: l.name ?? a.stateObj.attributes.friendly_name ?? l.entity,
        entityId: l.entity
      });
    }
    return this.renderTile({
      icon: t.length ? "mdi:home-account" : "mdi:home-outline",
      color: t.length ? "var(--state-icon-color)" : "var(--state-inactive-color)",
      primary: e.name ?? d(this.hass, "presence.title"),
      mainEntityId: t[0]?.entityId,
      secondary: O([
        ...t.length ? t : [{ text: d(this.hass, "presence.empty", { count: i }) }],
        n ? { text: d(this.hass, "offline.count", { count: n }) } : void 0,
        r.length ? { text: d(this.hass, "list.missing", { count: r.length }) } : void 0
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
Wr([
  b()
], ms.prototype, "_config");
x("horos-presence-tile", ms, {
  type: "horos-presence-tile",
  name: { ru: "Присутствие", en: "Presence" },
  description: {
    ru: "В каких зонах сейчас есть кто-то",
    en: "Which areas have someone in them right now"
  },
  preview: !0,
  suggest: (s, e) => {
    const t = ["occupancy", "presence", "motion"];
    return F(e) !== "binary_sensor" || !t.includes(Z(s, e) ?? "") ? null : U(
      "custom:horos-presence-tile",
      {},
      // One entity per area: otherwise the kitchen gets named three times.
      { areas: zn(s, e, "binary_sensor", t, 12) }
    );
  }
});
var qr = Object.defineProperty, Br = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && qr(e, t, n), n;
};
const Vr = 255;
class ps extends E {
  static {
    this.styles = [W, V];
  }
  contentRows() {
    return Math.ceil((this._config?.lights.length ?? 0) / 2);
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Ii), document.createElement(
      "horos-light-tile-editor"
    );
  }
  static getStubConfig() {
    return { lights: [] };
  }
  setConfig(e) {
    if (!e.lights?.length)
      throw new Error("At least one light is required (lights)");
    this.base = e, this._config = e;
  }
  /** Brightness in per cent, or undefined when the light is off or has none. */
  _brightness(e) {
    if (!e?.stateObj || e.stateObj.state !== "on") return;
    const t = e.stateObj.attributes.brightness;
    return t === void 0 ? void 0 : Math.round(t / Vr * 100);
  }
  render() {
    if (!this._config || !this.hass) return m;
    const e = this._config, t = p(this.hass, e.group), n = e.lights.map((f) => M(f)).map((f) => ({
      item: f,
      role: p(this.hass, f.entity)
    })), i = this.missingRolesWarning([
      t,
      ...n.map((f) => f.role)
    ]);
    if (i) return this.renderWarning(i);
    const o = n.filter((f) => f.role?.stateObj?.state === "on"), l = n.filter((f) => f.role?.unavailable), a = n.length - l.length, c = t ?? o[0]?.role ?? n[0].role, h = t?.stateObj?.attributes.friendly_name, u = n.map(({ item: f, role: y }) => {
      const z = this._brightness(y), w = y?.stateObj?.state === "on", R = Qe(this.hass, y);
      return {
        entityId: f.entity,
        name: f.name ?? te(y?.stateObj?.attributes.friendly_name, h) ?? f.entity,
        // A dimmable light says how bright, a plain one only that it is on.
        text: R ?? (w ? z === void 0 ? d(this.hass, "light.on") : `${z}%` : d(this.hass, "light.off")),
        ink: f.color ?? H(y?.stateObj),
        level: w ? z ?? 100 : 0
      };
    }), _ = this._brightness(c);
    return this.renderTile({
      icon: "mdi:lightbulb-group",
      color: H(c?.stateObj),
      primary: e.name ?? h ?? d(this.hass, "light.title"),
      mainEntityId: c?.entityId,
      defaultIconAction: ce(c?.entityId),
      secondary: O([
        D(this.hass, t),
        // With nothing answering there is no "on out of" to state: the count
        // would be about lights nobody can see.
        a === 0 ? void 0 : {
          text: o.length ? d(this.hass, "light.count", {
            count: o.length,
            total: a
          }) : d(this.hass, "light.allOff")
        },
        l.length ? {
          text: d(this.hass, "offline.count", { count: l.length }),
          entityId: l[0].item.entity
        } : void 0
      ]),
      values: _ === void 0 ? [] : [
        {
          value: String(_),
          unit: "%",
          entityId: c?.entityId,
          icon: be.brightness
        }
      ],
      // The slider is a stock HA feature, and it only makes sense for a group:
      // a single slider cannot mean five different lights.
      ownFeatures: t && e.brightness !== !1 ? [{ type: "light-brightness" }] : void 0,
      customFeatures: K(
        u,
        (f) => this.fireMoreInfo(f)
      )
    });
  }
}
Br([
  b()
], ps.prototype, "_config");
x("horos-light-tile", ps, {
  type: "horos-light-tile",
  name: { ru: "Свет", en: "Lights" },
  description: {
    ru: "Свет комнаты одной плиткой: что горит и насколько ярко",
    en: "A room's lights in one tile: what is on and how bright"
  },
  preview: !0,
  suggest: (s, e) => {
    if (!Q(s, e)) return null;
    const t = rt(s, e, "light");
    return t.length < 2 ? null : U("custom:horos-light-tile", {}, { lights: t });
  }
});
var Kr = Object.defineProperty, Gr = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && Kr(e, t, n), n;
};
const Rt = ["playing", "paused", "buffering"];
class fs extends E {
  static {
    this.styles = [W, V];
  }
  contentRows() {
    return Math.ceil((this._config?.players.length ?? 0) / 2);
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => ji), document.createElement(
      "horos-media-tile-editor"
    );
  }
  static getStubConfig() {
    return { players: [] };
  }
  setConfig(e) {
    if (!e.players?.length)
      throw new Error("At least one player is required (players)");
    this.base = e, this._config = e;
  }
  /** Volume in per cent; HA keeps it as 0..1. */
  _volume(e) {
    const t = e?.stateObj?.attributes.volume_level;
    return t === void 0 ? void 0 : Math.round(t * 100);
  }
  /** What is playing: the title, or whatever the player can name instead. */
  _title(e) {
    const t = e?.stateObj?.attributes;
    if (t)
      return t.media_title ?? t.app_name ?? t.source;
  }
  render() {
    if (!this._config || !this.hass) return m;
    const e = this._config, t = e.players.map((a) => M(a)).map((a) => ({ item: a, role: p(this.hass, a.entity) })), r = this.missingRolesWarning(t.map((a) => a.role));
    if (r) return this.renderWarning(r);
    const n = t.filter(
      (a) => Rt.includes(a.role?.stateObj?.state ?? "")
    ), i = n[0] ?? t[0], o = this._volume(i.role), l = t.map(({ item: a, role: c }) => {
      const h = this._volume(c), u = Rt.includes(c?.stateObj?.state ?? "");
      return {
        entityId: a.entity,
        name: a.name ?? c?.stateObj?.attributes.friendly_name ?? a.entity,
        // The state, not the title: a row is a bar with a word at the end, and
        // a track name is a sentence — it pushed the volume bar off the card.
        // What is playing is named once, in the line above.
        text: c?.stateObj && this.hass ? this.hass.formatEntityState(c.stateObj) : d(this.hass, "value.unknown"),
        ink: a.color ?? H(c?.stateObj),
        level: u ? h ?? 0 : 0
      };
    });
    return this.renderTile({
      icon: "mdi:play-box-multiple",
      color: H(i.role?.stateObj),
      primary: e.name ?? i.role?.stateObj?.attributes.friendly_name ?? d(this.hass, "media.title"),
      mainEntityId: i.role?.entityId,
      defaultIconAction: ce(i.role?.entityId),
      secondary: O([
        D(this.hass, i.role),
        {
          text: n.length ? this._title(i.role) ?? d(this.hass, "media.playing", { count: n.length }) : d(this.hass, "media.idle"),
          entityId: i.role?.entityId
        }
      ]),
      values: o === void 0 ? [] : [
        {
          value: String(o),
          unit: "%",
          entityId: i.role?.entityId,
          icon: be.volume
        }
      ],
      // Playback is a stock HA feature; the buttons are not ours to draw.
      ownFeatures: e.controls === !1 ? void 0 : [{ type: "media-player-playback" }],
      customFeatures: t.length > 1 ? K(l, (a) => this.fireMoreInfo(a)) : void 0
    });
  }
}
Gr([
  b()
], fs.prototype, "_config");
x("horos-media-tile", fs, {
  type: "horos-media-tile",
  name: { ru: "Медиа", en: "Media" },
  description: {
    ru: "Что играет в доме, где и насколько громко",
    en: "What is playing in the house, where, and how loud"
  },
  preview: !0,
  suggest: (s, e) => {
    if (!Q(s, e)) return null;
    const t = rt(s, e, "media_player");
    return t.length < 2 ? null : U("custom:horos-media-tile", {}, { players: t });
  }
});
var Yr = Object.defineProperty, Zr = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && Yr(e, t, n), n;
};
const Ht = ["temperature", "humidity", "power"];
class gs extends E {
  constructor() {
    super(...arguments), this._bigKeys = ["temperature"];
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Mi), document.createElement("horos-ac-tile-editor");
  }
  static getStubConfig() {
    return { climate: "" };
  }
  setConfig(e) {
    if (!e.climate)
      throw new Error("A climate entity is required (climate)");
    this._bigKeys = Y(e.big_values, "temperature", Ht), this.base = e, this._config = e;
  }
  contentRows() {
    return this._config?.controls === !1 ? 0 : 2;
  }
  render() {
    if (!this._config || !this.hass) return m;
    const e = this._config, t = p(this.hass, e.climate), r = Ht.map((a) => ({
      key: a,
      role: p(this.hass, e[a])
    })), n = (e.sensors ?? []).map((a) => M(a)).map((a) => p(this.hass, a.entity)), i = this.missingRolesWarning([
      t,
      ...r.map((a) => a.role),
      ...n
    ]);
    if (i) return this.renderWarning(i);
    const { big: o, rest: l } = B(r, this._bigKeys);
    return this.renderTile({
      icon: "mdi:air-conditioner",
      color: H(t?.stateObj),
      primary: He(e.name, t) ?? d(this.hass, "ac.title"),
      mainEntityId: t?.entityId,
      defaultIconAction: ce(t?.entityId),
      secondary: O([
        D(this.hass, t),
        this.mainStateSegment(t),
        ...l.map((a) => L(this.hass, a.role)),
        ...n.map((a) => L(this.hass, a))
      ]),
      values: this.bigValues(o),
      // Modes and the target temperature are stock features: the climate domain
      // has more shapes than a card should try to draw.
      ownFeatures: e.controls === !1 ? void 0 : [{ type: "climate-hvac-modes" }, { type: "target-temperature" }]
    });
  }
}
Zr([
  b()
], gs.prototype, "_config");
x("horos-ac-tile", gs, {
  type: "horos-ac-tile",
  name: { ru: "Кондиционер", en: "Air conditioner" },
  description: {
    ru: "Климатический прибор, воздух в комнате и цена работы",
    en: "A climate unit, the air in the room, and what running it costs"
  },
  preview: !0,
  suggest: (s, e) => {
    const t = J(s, e), r = we(t, "climate");
    if (!r) return null;
    const n = Q(s, r) ? rt(s, r, "sensor") : [], i = {
      climate: r,
      temperature: N(s, n, "sensor", "temperature"),
      humidity: N(s, n, "sensor", "humidity"),
      power: N(s, t, "sensor", "power")
    };
    return $e(i) < 2 ? null : U("custom:horos-ac-tile", i);
  }
});
function Jr(s, e = {}) {
  if (!s) return [];
  const t = new Set(e.ignore ?? []), r = [];
  for (const [n, i] of Object.entries(s.states)) {
    if (!n.startsWith("update.") || i?.state !== "on" || t.has(n)) continue;
    const o = s.entities?.[n];
    if (o?.hidden) continue;
    const l = o?.device_id ? s.devices?.[o.device_id] : void 0, a = i.attributes.latest_version;
    r.push({
      entityId: n,
      name: l?.name_by_user ?? l?.name ?? i.attributes.title ?? i.attributes.friendly_name ?? n,
      version: a,
      skipped: a !== void 0 && a === i.attributes.skipped_version
    });
  }
  return r.sort((n, i) => n.name.localeCompare(i.name));
}
var Xr = Object.defineProperty, Qr = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && Xr(e, t, n), n;
};
const ei = 4;
class _s extends E {
  static async getConfigElement() {
    return await Promise.resolve().then(() => Ri), document.createElement(
      "horos-updates-tile-editor"
    );
  }
  static getStubConfig() {
    return {};
  }
  setConfig(e) {
    this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return m;
    const e = this._config, t = Jr(this.hass, { ignore: e.ignore }), r = e.include_skipped ? t : t.filter((l) => !l.skipped), n = e.limit ?? ei, i = r.slice(0, n), o = r.length - i.length;
    return this.renderTile({
      icon: r.length ? "mdi:package-up" : "mdi:package-variant-closed-check",
      color: r.length ? "var(--info-color, #2196f3)" : "var(--success-color, #43a047)",
      primary: e.name ?? d(this.hass, "updates.title"),
      mainEntityId: r[0]?.entityId,
      secondary: O(
        r.length ? [
          ...i.map((l) => ({
            text: l.version ? `${l.name} ${l.version}` : l.name,
            entityId: l.entityId
          })),
          o > 0 ? { text: d(this.hass, "offline.more", { count: o }) } : void 0
        ] : [{ text: d(this.hass, "updates.upToDate") }]
      ),
      values: r.length ? [
        {
          value: String(r.length),
          entityId: r[0]?.entityId,
          icon: be.updates
        }
      ] : []
    });
  }
}
Qr([
  b()
], _s.prototype, "_config");
x("horos-updates-tile", _s, {
  type: "horos-updates-tile",
  name: { ru: "Обновления", en: "Updates" },
  description: {
    ru: "Что в доме просит обновления, одной плиткой вместо тридцати",
    en: "What in the house asks to be updated, one tile instead of thirty"
  },
  preview: !0,
  suggest: (s, e) => e.startsWith("update.") ? U("custom:horos-updates-tile", {}) : null
});
var ti = Object.defineProperty, si = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && ti(e, t, n), n;
};
class ys extends E {
  static {
    this.styles = [W, V];
  }
  contentRows() {
    return Math.ceil((this._config?.lists.length ?? 0) / 2);
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Hi), document.createElement(
      "horos-tasks-tile-editor"
    );
  }
  static getStubConfig() {
    return { lists: [] };
  }
  setConfig(e) {
    if (!e.lists?.length)
      throw new Error("At least one list is required (lists)");
    this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return m;
    const e = this._config, t = p(this.hass, e.calendar), r = e.lists.map((c) => M(c)).map((c) => {
      const h = p(this.hass, c.entity);
      return { item: c, role: h, count: q(h) ?? 0 };
    }), n = this.missingRolesWarning([
      t,
      ...r.map((c) => c.role)
    ]);
    if (n) return this.renderWarning(n);
    const i = r.reduce((c, h) => c + h.count, 0), o = Math.max(...r.map((c) => c.count), 1), l = r.filter((c) => c.count > 0).map(({ item: c, role: h, count: u }) => ({
      entityId: c.entity,
      name: c.name ?? h?.stateObj?.attributes.friendly_name ?? c.entity,
      text: String(u),
      ink: c.color ?? "var(--state-icon-color, var(--primary-color))",
      level: u / o * 100
    })), a = t?.stateObj?.attributes.message;
    return this.renderTile({
      icon: i ? "mdi:format-list-checks" : "mdi:check-all",
      color: i ? "var(--state-icon-color, var(--primary-color))" : "var(--success-color, #43a047)",
      primary: e.name ?? d(this.hass, "tasks.title"),
      mainEntityId: r[0]?.item.entity,
      secondary: O([
        D(this.hass, t),
        { text: i ? void 0 : d(this.hass, "tasks.none") },
        t ? {
          text: a ?? d(this.hass, "tasks.noEvents"),
          entityId: t.entityId
        } : void 0
      ]),
      values: i ? [
        {
          value: String(i),
          entityId: r[0]?.item.entity,
          icon: be.tasks
        }
      ] : [],
      customFeatures: l.length ? K(l, (c) => this.fireMoreInfo(c)) : void 0
    });
  }
}
si([
  b()
], ys.prototype, "_config");
x("horos-tasks-tile", ys, {
  type: "horos-tasks-tile",
  name: { ru: "Задачи", en: "Tasks" },
  description: {
    ru: "Сколько дел на каждом списке и что ближайшее в календаре",
    en: "How much is left on each list, and what is coming up next"
  },
  preview: !0,
  suggest: (s, e) => {
    if (!e.startsWith("todo.")) return null;
    const t = Object.keys(s.states).filter((n) => n.startsWith("todo.") && !s.entities?.[n]?.hidden).sort(), r = [e, ...t.filter((n) => n !== e)];
    return r.length < 2 ? null : U("custom:horos-tasks-tile", {}, { lists: r });
  }
});
const ni = "on";
function ri(s) {
  const e = s.alert_when;
  return e === void 0 ? [ni] : Array.isArray(e) ? e : [e];
}
function ii(s, e) {
  return e === void 0 || e === "unavailable" || e === "unknown" ? !1 : ri(s).includes(e);
}
var oi = Object.defineProperty, ai = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && oi(e, t, n), n;
};
const li = 4;
class vs extends E {
  static async getConfigElement() {
    return await Promise.resolve().then(() => Ni), document.createElement(
      "horos-alerts-tile-editor"
    );
  }
  static getStubConfig() {
    return { alerts: [] };
  }
  setConfig(e) {
    if (!e.alerts?.length)
      throw new Error("At least one alert is required (alerts)");
    this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return m;
    const e = this._config, t = e.watch_offline !== !1, r = [], n = [], i = [];
    let o, l = 0;
    for (const _ of e.alerts) {
      const f = M(_), y = p(this.hass, f.entity);
      if (y?.missing) {
        i.push(f.entity);
        continue;
      }
      l += 1;
      const z = f.name ?? y?.stateObj?.attributes.friendly_name ?? f.entity;
      if (y?.unavailable) {
        t && n.push({
          text: d(this.hass, "alerts.offline", { name: z }),
          entityId: f.entity
        });
        continue;
      }
      ii(f, y?.stateObj?.state) && (r.push({ text: z, entityId: f.entity }), o = o ?? (f.color ? Yt(f.color) : void 0));
    }
    const a = [...r, ...n], c = e.limit ?? li, h = a.slice(0, c), u = a.length - h.length;
    return this.renderTile({
      icon: r.length ? "mdi:alert" : n.length ? "mdi:bell-off-outline" : "mdi:bell-check-outline",
      color: o ?? (r.length ? "var(--error-color, #db4437)" : n.length ? "var(--warning-color, #ffa600)" : "var(--success-color, #43a047)"),
      primary: e.name ?? d(this.hass, "alerts.title"),
      mainEntityId: a[0]?.entityId,
      secondary: O([
        ...a.length ? h : [{ text: d(this.hass, "alerts.calm", { count: l }) }],
        u > 0 ? { text: d(this.hass, "offline.more", { count: u }) } : void 0,
        ...i.length ? [{ text: d(this.hass, "list.missing", { count: i.length }) }] : []
      ]),
      values: r.length ? [
        {
          value: String(r.length),
          entityId: r[0]?.entityId,
          icon: "mdi:alert-outline"
        }
      ] : []
    });
  }
}
ai([
  b()
], vs.prototype, "_config");
x("horos-alerts-tile", vs, {
  type: "horos-alerts-tile",
  name: { ru: "Оповещения", en: "Alerts" },
  description: {
    ru: "Всё, о чём стоит сказать только когда оно случилось, одной плиткой",
    en: "Everything worth mentioning only once it happens, in one tile"
  },
  preview: !0,
  suggest: (s, e) => {
    const t = ["problem", "tamper"];
    return F(e) !== "binary_sensor" || !t.includes(Z(s, e) ?? "") ? null : U(
      "custom:horos-alerts-tile",
      {},
      { alerts: Le(s, e, "binary_sensor", t) }
    );
  }
});
var ci = Object.defineProperty, bs = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && ci(e, t, n), n;
};
const We = [
  { key: "dim", icon: "mdi:brightness-4" },
  { key: "bright", icon: "mdi:brightness-7" },
  { key: "warm", icon: "mdi:weather-sunset" },
  { key: "cold", icon: "mdi:snowflake" }
];
class it extends E {
  constructor() {
    super(...arguments), this._controlsReady = !1;
  }
  static {
    this.styles = [
      W,
      Ie`
      /*
       * The sizes are the stock feature's own: hui-card-features sets these
       * variables for the features it hosts, and our row lives outside it.
       */
      .lamp-controls {
        display: flex;
        flex-direction: column;
        gap: var(--ha-space-2, 8px);
        pointer-events: auto;
      }

      ha-control-button-group {
        --control-button-group-spacing: 12px;
        --control-button-group-thickness: 42px;
      }

      ha-control-button-group > ha-control-button {
        flex-basis: 20px;
        --control-button-padding: 0px;
      }

      ha-control-button {
        --control-button-border-radius: 12px;
        --control-button-focus-color: var(--tile-color);
      }

      ha-control-select {
        --control-select-color: var(--tile-color);
        --control-select-padding: 0;
        --control-select-thickness: 42px;
        --control-select-border-radius: 12px;
        --control-select-button-border-radius: 12px;
      }

      /*
       * The row keeps the height a stock feature gives its selector; what
       * shrinks is what goes inside it. At full size an icon over a line of
       * text is 53px of content in a 42px row and the names get clipped, so
       * both are taken down a notch. Size and font are inherited properties,
       * which is why they reach into the selector's shadow from out here.
       */
      .lamp-controls.labelled ha-control-select {
        --mdc-icon-size: 16px;
        font-size: var(--ha-font-size-xs, 11px);
        line-height: 1.1;
      }
    `
    ];
  }
  connectedCallback() {
    super.connectedCallback(), Hn().then((e) => {
      this._controlsReady = e;
    });
  }
  contentRows() {
    const e = this._config;
    if (!e) return 0;
    const t = (We.some(({ key: r }) => e[r]) ? 1 : 0) + (e.presets?.length ? 1 : 0);
    return Math.ceil(t / 2);
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Li), document.createElement(
      "horos-lamp-tile-editor"
    );
  }
  static getStubConfig() {
    return { bright: "", dim: "" };
  }
  setConfig(e) {
    if (!(We.some(({ key: r }) => e[r]) || e.presets?.length || e.power))
      throw new Error(
        "A lamp needs at least one script: bright, dim, warm, cold, power or presets"
      );
    this.base = e, this._config = e;
  }
  /** Runs a script the way a tap action would, confirmations and all. */
  _run(e) {
    this.hass && Vt(
      this,
      this.hass,
      {
        tap_action: {
          action: "perform-action",
          perform_action: "homeassistant.turn_on",
          target: { entity_id: e }
        }
      },
      "tap"
    );
  }
  _stepLabel(e) {
    return d(this.hass, `lamp.${e}`);
  }
  /** The two halves of brightness and of colour, in one stock button group. */
  _renderSteps(e) {
    const t = We.filter(({ key: r }) => e[r]);
    return t.length ? v`
      <ha-control-button-group>
        ${t.map(
      ({ key: r, icon: n }) => v`
            <ha-control-button
              .label=${this._stepLabel(r)}
              @click=${() => this._run(e[r])}
            >
              <ha-icon .icon=${n}></ha-icon>
            </ha-control-button>
          `
    )}
      </ha-control-button-group>
    ` : m;
  }
  /** The looks the lamp can take, as the segmented selector HA uses for modes. */
  _renderPresets(e) {
    if (!e.presets?.length) return m;
    const t = e.presets.map(
      (n) => typeof n == "string" ? { entity: n } : n
    ), r = this.hass?.states[e.preset_state ?? ""]?.state;
    return v`
      <ha-control-select
        .options=${t.map((n) => {
      const i = this.hass?.states[n.entity], o = n.name ?? Qt(i?.attributes.friendly_name) ?? n.entity, l = n.icon ?? i?.attributes.icon;
      return {
        value: n.entity,
        label: o,
        ariaLabel: o,
        icon: l ? v`<ha-icon .icon=${l}></ha-icon>` : void 0
      };
    })}
        .value=${t.find((n) => n.name === r)?.entity ?? r}
        ?hide-option-label=${e.preset_labels === !1}
        @value-changed=${(n) => this._run(n.detail.value)}
      >
      </ha-control-select>
    `;
  }
  render() {
    if (!this._config || !this.hass) return m;
    const e = this._config, t = p(this.hass, e.state), r = (e.sensors ?? []).map((o) => M(o)).map((o) => p(this.hass, o.entity)), n = this.missingRolesWarning([t, ...r]);
    if (n) return this.renderWarning(n);
    const i = e.state?.startsWith("light.");
    return this.renderTile({
      icon: e.icon ?? "mdi:coach-lamp-variant",
      color: t ? H(t.stateObj) : "var(--state-icon-color)",
      primary: e.name ?? d(this.hass, "lamp.title"),
      mainEntityId: t?.entityId,
      // The icon is the lamp's switch: it runs the power script where there is
      // one, and falls back to toggling whatever holds the state.
      defaultIconAction: e.power ? {
        action: "perform-action",
        perform_action: "homeassistant.turn_on",
        target: { entity_id: e.power }
      } : t ? { action: "toggle" } : { action: "none" },
      secondary: O([
        D(this.hass, t),
        this.mainStateSegment(t),
        ...r.map((o) => L(this.hass, o))
      ]),
      // A real light keeps its stock slider: nothing we draw beats it.
      ownFeatures: i && e.brightness !== !1 ? [{ type: "light-brightness" }] : void 0,
      customFeatures: this._controlsReady ? v`<div
            class="lamp-controls ${e.presets?.length && e.preset_labels !== !1 ? "labelled" : ""}"
          >
            ${this._renderSteps(e)}${this._renderPresets(e)}
          </div>` : void 0
    });
  }
}
bs([
  b()
], it.prototype, "_config");
bs([
  b()
], it.prototype, "_controlsReady");
x("horos-lamp-tile", it, {
  type: "horos-lamp-tile",
  name: { ru: "Лампа на скриптах", en: "Script lamp" },
  description: {
    ru: "ИК-лампа или лента: ярче, теплее и режимы — скриптами, но как у лампы",
    en: "An IR lamp or a strip: brighter, warmer and presets, driven by scripts"
  },
  preview: !0
});
function ui(s) {
  if (!s || Xe.has(s.state)) return "offline";
  if (s.state === "off") return "off";
  const e = s.attributes.hvac_action;
  return e === void 0 ? "unknown" : e === "heating" ? "heating" : "idle";
}
function hi(s) {
  return {
    calling: s.filter((e) => e === "heating").length,
    // "unknown" is left out on purpose: a zone that does not report demand
    // must not swell the denominator of "2 of 5 calling".
    reporting: s.filter(
      (e) => e === "heating" || e === "idle" || e === "off"
    ).length,
    offline: s.filter((e) => e === "offline").length
  };
}
var di = Object.defineProperty, mi = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && di(e, t, n), n;
};
const Nt = ["power", "energy"];
class ws extends E {
  constructor() {
    super(...arguments), this._bigKeys = ["power"];
  }
  static {
    this.styles = [W, V];
  }
  contentRows() {
    return Math.ceil((this._config?.zones?.length ?? 0) / 2);
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Fi), document.createElement(
      "horos-heating-tile-editor"
    );
  }
  static getStubConfig() {
    return { zones: [] };
  }
  setConfig(e) {
    if (!e.mode && !e.burner && !e.pump && !e.switch)
      throw new Error(
        "The boiler needs at least one entity: mode, burner, pump or switch"
      );
    this._bigKeys = Y(e.big_values, "power", Nt), this.base = e, this._config = e;
  }
  /** What the row says on the right: where the room is and where it was sent. */
  _zoneText(e, t) {
    if (t === "offline") return Qe(this.hass, e);
    const r = e?.stateObj;
    if (!r) return;
    const n = yt(this.hass, r, "current_temperature"), i = yt(this.hass, r, "temperature");
    if (n && i) {
      const o = i.replace(/^[\d\s\u00a0.,+-]+/, "");
      return `${qt(n, o).value} → ${i}`;
    }
    return n ?? i ?? this.hass?.formatEntityState(r);
  }
  render() {
    if (!this._config || !this.hass) return m;
    const e = this._config, t = p(this.hass, e.mode), r = p(this.hass, e.burner), n = p(this.hass, e.pump), i = p(this.hass, e.switch), o = Nt.map((w) => ({
      key: w,
      role: p(this.hass, e[w])
    })), l = (e.zones ?? []).map((w) => M(w)).map((w) => {
      const R = p(this.hass, w.entity);
      return { item: w, role: R, zone: ui(R?.stateObj) };
    }), a = this.missingRolesWarning([
      t,
      r,
      n,
      i,
      ...o.map((w) => w.role),
      ...l.map((w) => w.role)
    ]);
    if (a) return this.renderWarning(a);
    const c = r?.stateObj?.state === "on", h = n?.stateObj?.state === "on", u = t ?? i ?? r ?? n, { calling: _, reporting: f, offline: y } = hi(
      l.map((w) => w.zone)
    ), z = l.map(({ item: w, role: R, zone: ne }) => ({
      entityId: w.entity,
      name: w.name ?? te(R?.stateObj?.attributes.friendly_name, e.name) ?? w.entity,
      text: this._zoneText(R, ne) ?? "",
      ink: w.color ?? H(R?.stateObj),
      // The bar is the demand, not the temperature: a room either has the
      // boiler working for it or it does not.
      level: ne === "heating" ? 100 : 0,
      alarm: ne === "offline",
      alarmIcon: "mdi:lan-disconnect"
    }));
    return this.renderTile({
      icon: c ? "mdi:fire" : h ? "mdi:pump" : "mdi:water-boiler",
      color: H(c ? r.stateObj : h ? n.stateObj : u?.stateObj),
      primary: e.name ?? d(this.hass, "heating.title"),
      mainEntityId: u?.entityId,
      // The icon is the boiler's own switch where there is one; without it
      // there is nothing on this card that is safe to toggle.
      defaultIconAction: e.switch ? ce(e.switch) : { action: "none" },
      secondary: O([
        D(this.hass, u),
        this.mainStateSegment(u === t ? t : u),
        // Who is asking is the card's whole point, so it is always said. That
        // nobody is asking is only worth a word when the boiler has no mode
        // sensor to say "standby" for itself.
        _ ? {
          text: d(this.hass, "heating.calling", {
            count: _,
            total: f
          })
        } : f && !t ? { text: d(this.hass, "heating.quiet") } : void 0,
        y ? { text: d(this.hass, "offline.count", { count: y }) } : void 0,
        ...B(o, this._bigKeys).rest.map(
          (w) => L(this.hass, w.role)
        )
      ]),
      values: this.bigValues(B(o, this._bigKeys).big),
      customFeatures: z.length ? K(z, (w) => this.fireMoreInfo(w)) : void 0
    });
  }
}
mi([
  b()
], ws.prototype, "_config");
x("horos-heating-tile", ws, {
  type: "horos-heating-tile",
  name: { ru: "Отопление", en: "Heating" },
  description: {
    ru: "Котёл и комнаты, которые просят у него тепла, одной плиткой",
    en: "The boiler and the rooms asking it for heat, in one tile"
  },
  preview: !0
});
console.info(
  "%c HOROS-CARDS %c 0.4.0 ",
  "background:#03a9f4;color:#fff;border-radius:3px 0 0 3px;padding:2px 4px",
  "background:#555;color:#fff;border-radius:0 3px 3px 0;padding:2px 4px"
);
var pi = Object.defineProperty, ot = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && pi(e, t, n), n;
};
class Ue extends ae {
  constructor() {
    super(...arguments), this._computeHelper = (e) => e.name === "color" ? this.pick({
      ru: {
        color: "Неактивное состояние (например, off или closed) окрашено не будет."
      },
      en: {
        color: "Inactive state (for example, off or closed) will not be coloured."
      }
    }).color : void 0, this._computeLabel = (e) => this.labels[e.name] ?? this.pick({ ru: I, en: j })[e.name] ?? e.name;
  }
  setConfig(e) {
    this._config = e;
  }
  /** What to show the form. The config itself by default. */
  get formData() {
    return this._config ?? {};
  }
  /** What to put into the config from the form. */
  fromForm(e) {
    return e;
  }
  /**
   * Labels in the user's language. They are kept as a pair right next to the card
   * rather than in a shared dictionary: the same field is called differently on
   * different cards — "Battery", "Sensor battery", "Main device battery".
   */
  pick(e) {
    return $(this.hass) === "ru" ? e.ru : e.en;
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
    return !this.hass || !this._config ? m : v`
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
ot([
  Re({ attribute: !1 })
], Ue.prototype, "hass");
ot([
  b()
], Ue.prototype, "_config");
class C extends Ue {
  constructor() {
    super(...arguments), this._featuresEditorReady = !1;
  }
  connectedCallback() {
    super.connectedCallback(), Nn().then((e) => {
      this._featuresEditorReady = e;
    });
  }
  /**
   * The form shows the layout as pictures (content_layout) while the config holds
   * a boolean vertical — exactly as in the stock tile's editor.
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
    const { content_layout: t, ...r } = e, n = { ...r };
    return t === "vertical" && (n.vertical = !0), n;
  }
  /** The features section repeats the markup of the stock tile's editor. */
  _renderFeatures() {
    const e = this.entityField ? this._config?.[this.entityField] : void 0;
    if (!e) return m;
    const t = this._config?.features ?? [], r = this.pick({ ru: I, en: j }), n = this.pick({
      ru: { bottom: "Снизу", inline: "В строке" },
      en: { bottom: "Bottom", inline: "Inline" }
    });
    return v`
      <ha-expansion-panel outlined>
        <ha-icon slot="leading-icon" icon="mdi:list-box"></ha-icon>
        <h3 slot="header">${r.features}</h3>
        <div class="content">
          <hui-card-features-editor
            .hass=${this.hass}
            .context=${{ entity_id: e }}
            .features=${t}
            @features-changed=${this._featuresChanged}
          ></hui-card-features-editor>
          ${t.length ? v`
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
              { value: "bottom", label: n.bottom },
              { value: "inline", label: n.inline }
            ]
          }
        }
      }
    ]}
                  .computeLabel=${this._computeLabel}
                  @value-changed=${this._valueChanged}
                ></ha-form>
              ` : m}
        </div>
      </ha-expansion-panel>
    `;
  }
  render() {
    return !this.hass || !this._config ? m : v`
      ${this.renderForm()}
      ${this._featuresEditorReady ? this._renderFeatures() : m}
    `;
  }
}
ot([
  b()
], C.prototype, "_featuresEditorReady");
const T = (s, e, t = []) => ({
  name: "content",
  type: "expandable",
  flatten: !0,
  icon: "mdi:text-short",
  schema: [
    s ? {
      name: "name",
      selector: { entity_name: {} },
      context: { entity: s }
    } : { name: "name", selector: { text: {} } },
    {
      name: "",
      type: "grid",
      schema: [
        {
          name: "icon",
          selector: { icon: {} },
          ...s ? { context: { icon_entity: s } } : {}
        },
        {
          name: "color",
          // include_state is mandatory: without it the value "state" counts as
          // invalid and the field is highlighted as an error.
          selector: { ui_color: { default_color: "state", include_state: !0 } }
        },
        { name: "show_entity_picture", selector: { boolean: {} } },
        { name: "hide_state", selector: { boolean: {} } }
      ]
    },
    ...s ? [
      {
        name: "state_content",
        selector: { ui_state_content: { allow_context: !0 } },
        context: { filter_entity: s }
      },
      { name: "time_format", selector: { ui_time_format: {} } }
    ] : [],
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
}), qe = (s) => s ? { entity_id: s, area_id: "area" } : void 0, P = (s, e) => ({
  name: "interactions",
  type: "expandable",
  flatten: !0,
  icon: "mdi:gesture-tap",
  schema: [
    {
      name: "tap_action",
      selector: { ui_action: { default_action: "more-info" } },
      context: qe(s)
    },
    { name: "", type: "divider" },
    {
      name: "icon_tap_action",
      selector: { ui_action: { default_action: e } },
      context: qe(s)
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
        context: qe(s)
      }))
    }
  ]
}), I = {
  content: "Содержимое",
  state_content: "Что показывать про сущность",
  time_format: "Формат времени",
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
}, j = {
  content: "Content",
  state_content: "State content",
  time_format: "Time format",
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
}, g = (s, e) => ({
  entity: {
    filter: e ? { domain: s, device_class: e } : { domain: s }
  }
}), G = (s, e, t) => ({
  number: { min: s, max: e, mode: "box", unit_of_measurement: t }
}), fi = { text: {} }, se = (s) => ({
  select: { multiple: !0, mode: "list", options: s }
}), ee = { boolean: {} };
class $s extends C {
  get entityField() {
    return "temperature";
  }
  get schema() {
    const e = $(this.hass);
    return [
      {
        name: "temperature",
        required: !0,
        selector: g("sensor", "temperature")
      },
      { name: "humidity", selector: g("sensor", "humidity") },
      {
        name: "illuminance",
        selector: g("sensor", "illuminance")
      },
      { name: "pm25", selector: g("sensor", "pm25") },
      T("temperature", e, [
        {
          name: "big_values",
          selector: se([
            { value: "temperature", label: e === "ru" ? "Температура" : "Temperature" },
            { value: "humidity", label: e === "ru" ? "Влажность" : "Humidity" },
            { value: "illuminance", label: e === "ru" ? "Освещённость" : "Illuminance" },
            { value: "pm25", label: "PM2.5" }
          ])
        }
      ]),
      P("temperature", "none")
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
S("horos-climate-tile-editor", $s);
const gi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosClimateTileEditor: $s
}, Symbol.toStringTag, { value: "Module" }));
class Es extends C {
  get entityField() {
    return "switch";
  }
  get schema() {
    const e = $(this.hass);
    return [
      { name: "switch", required: !0, selector: g("switch") },
      { name: "power", selector: g("sensor", "power") },
      { name: "energy", selector: g("sensor", "energy") },
      { name: "toggle_button", selector: ee },
      T("switch", e, [
        {
          name: "big_values",
          selector: se([
            { value: "power", label: e === "ru" ? "Мощность" : "Power" },
            { value: "energy", label: e === "ru" ? "Энергия" : "Energy" },
            { value: "switch", label: e === "ru" ? "Состояние" : "State" }
          ])
        }
      ]),
      P("switch", "toggle")
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
S("horos-plug-tile-editor", Es);
const _i = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosPlugTileEditor: Es
}, Symbol.toStringTag, { value: "Module" }));
class xs extends C {
  get entityField() {
    return "moisture";
  }
  get schema() {
    const e = $(this.hass);
    return [
      {
        name: "moisture",
        required: !0,
        selector: g("sensor", "moisture")
      },
      {
        name: "temperature",
        selector: g("sensor", "temperature")
      },
      { name: "battery", selector: g("sensor", "battery") },
      { name: "dry_below", selector: G(0, 100, "%") },
      { name: "wet_above", selector: G(0, 100, "%") },
      T("moisture", e, [
        {
          name: "big_values",
          selector: se([
            { value: "moisture", label: e === "ru" ? "Влажность почвы" : "Soil moisture" },
            { value: "temperature", label: e === "ru" ? "Температура почвы" : "Soil temperature" },
            { value: "battery", label: e === "ru" ? "Заряд датчика" : "Sensor battery" }
          ])
        }
      ]),
      P("moisture", "none")
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
S("horos-plant-tile-editor", xs);
const yi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosPlantTileEditor: xs
}, Symbol.toStringTag, { value: "Module" }));
function k(s, e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of s ?? [])
    t.set(typeof r == "string" ? r : r.entity, r);
  return e.map((r) => t.get(r) ?? r);
}
function A(s) {
  return (s ?? []).map(
    (e) => typeof e == "string" ? e : e.entity
  );
}
class Ss extends Ue {
  get schema() {
    return [
      { name: "name", selector: fi },
      { name: "icon", selector: { icon: {} } },
      { name: "columns", selector: G(1, 6) },
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
        ...j,
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
      buttons: A(e.buttons)
    };
  }
  fromForm(e) {
    return {
      ...e,
      buttons: k(
        this._config?.buttons,
        e.buttons ?? []
      )
    };
  }
}
S("horos-buttons-tile-editor", Ss);
const vi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosButtonsTileEditor: Ss
}, Symbol.toStringTag, { value: "Module" }));
class Cs extends C {
  get entityField() {
    return "status";
  }
  get schema() {
    const e = $(this.hass);
    return [
      { name: "icon", selector: { icon: {} } },
      { name: "status", selector: g("sensor") },
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
      },
      T("status", e),
      P("status", "none")
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
        ...j,
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
      cartridges: A(
        e.cartridges
      ),
      sensors: A(e.sensors)
    };
  }
  fromForm(e) {
    return {
      ...e,
      cartridges: k(
        this._config?.cartridges,
        e.cartridges ?? []
      ),
      sensors: k(
        this._config?.sensors,
        e.sensors ?? []
      )
    };
  }
}
S("horos-printer-tile-editor", Cs);
const bi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosPrinterTileEditor: Cs
}, Symbol.toStringTag, { value: "Module" }));
class ks extends C {
  get entityField() {
    return "vacuum";
  }
  get schema() {
    const e = $(this.hass);
    return [
      { name: "vacuum", required: !0, selector: g("vacuum") },
      { name: "battery", selector: g("sensor", "battery") },
      { name: "sensors", selector: { entity: { multiple: !0 } } },
      { name: "consumables", selector: { entity: { multiple: !0 } } },
      { name: "low_below", selector: G(0, 100, "%") },
      T("vacuum", e),
      P("vacuum", "none")
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
        ...j,
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
      sensors: A(e.sensors),
      consumables: A(e.consumables)
    };
  }
  fromForm(e) {
    return {
      ...e,
      sensors: k(
        this._config?.sensors,
        e.sensors ?? []
      ),
      consumables: k(
        this._config?.consumables,
        e.consumables ?? []
      )
    };
  }
}
S("horos-vacuum-tile-editor", ks);
const wi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosVacuumTileEditor: ks
}, Symbol.toStringTag, { value: "Module" }));
class As extends C {
  get entityField() {
  }
  get schema() {
    const e = $(this.hass);
    return [
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
      { name: "low_below", selector: G(0, 100, "%") },
      T(void 0, e),
      P(void 0, "none")
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
        ...j,
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
      batteries: A(e.batteries)
    };
  }
  fromForm(e) {
    return {
      ...e,
      batteries: k(
        this._config?.batteries,
        e.batteries ?? []
      )
    };
  }
}
S("horos-batteries-tile-editor", As);
const $i = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosBatteriesTileEditor: As
}, Symbol.toStringTag, { value: "Module" }));
class Os extends C {
  get entityField() {
  }
  get schema() {
    const e = $(this.hass);
    return [
      {
        name: "sensors",
        required: !0,
        selector: { entity: { multiple: !0, filter: [{ domain: "binary_sensor" }] } }
      },
      T(void 0, e),
      P(void 0, "none")
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
        ...j,
        name: "Name",
        sensors: "Sensors"
      }
    });
  }
  get formData() {
    const e = this._config ?? {};
    return {
      ...e,
      sensors: A(e.sensors)
    };
  }
  fromForm(e) {
    return {
      ...e,
      sensors: k(
        this._config?.sensors,
        e.sensors ?? []
      )
    };
  }
}
S("horos-safety-tile-editor", Os);
const Ei = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosSafetyTileEditor: Os
}, Symbol.toStringTag, { value: "Module" }));
class Ts extends C {
  get entityField() {
    return "status";
  }
  get schema() {
    const e = $(this.hass);
    return [
      { name: "status", selector: { entity: {} } },
      { name: "disk", selector: g("sensor", "data_size") },
      { name: "download", selector: g("sensor", "data_rate") },
      { name: "upload", selector: g("sensor", "data_rate") },
      { name: "services", selector: { entity: { multiple: !0 } } },
      T("status", e),
      P("status", "none")
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
        ...j,
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
      services: A(e.services)
    };
  }
  fromForm(e) {
    return {
      ...e,
      services: k(
        this._config?.services,
        e.services ?? []
      )
    };
  }
}
S("horos-server-tile-editor", Ts);
const xi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosServerTileEditor: Ts
}, Symbol.toStringTag, { value: "Module" }));
class Ps extends C {
  get entityField() {
    return "person";
  }
  get schema() {
    const e = $(this.hass);
    return [
      {
        name: "person",
        required: !0,
        selector: {
          entity: {
            filter: [{ domain: "person" }, { domain: "device_tracker" }]
          }
        }
      },
      { name: "battery", selector: g("sensor", "battery") },
      { name: "location", selector: g("sensor") },
      {
        name: "devices",
        selector: {
          entity: {
            multiple: !0,
            filter: [{ domain: "sensor", device_class: "battery" }]
          }
        }
      },
      T("person", e),
      P("person", "none")
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
        ...j,
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
      devices: A(e.devices)
    };
  }
  fromForm(e) {
    return {
      ...e,
      devices: k(
        this._config?.devices,
        e.devices ?? []
      )
    };
  }
}
S("horos-person-tile-editor", Ps);
const Si = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosPersonTileEditor: Ps
}, Symbol.toStringTag, { value: "Module" }));
class Is extends C {
  get entityField() {
    return "status";
  }
  get schema() {
    const e = $(this.hass);
    return [
      { name: "status", selector: { entity: {} } },
      { name: "cpu", selector: g("sensor") },
      { name: "memory", selector: g("sensor") },
      { name: "gpu", selector: g("sensor") },
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
      T("status", e, [
        {
          name: "big_values",
          selector: se([
            { value: "temperature", label: e === "ru" ? "Самая горячая точка" : "Hottest spot" },
            { value: "cpu", label: e === "ru" ? "Процессор" : "CPU" },
            { value: "memory", label: e === "ru" ? "Память" : "Memory" },
            { value: "gpu", label: e === "ru" ? "Видеокарта" : "GPU" },
            { value: "disk", label: e === "ru" ? "Самый полный диск" : "Fullest disk" }
          ])
        }
      ]),
      P("status", "none")
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
        ...j,
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
      sensors: A(e.sensors),
      alerts: A(e.alerts)
    };
  }
  fromForm(e) {
    return {
      ...e,
      sensors: k(
        this._config?.sensors,
        e.sensors ?? []
      ),
      alerts: k(
        this._config?.alerts,
        e.alerts ?? []
      )
    };
  }
}
S("horos-computer-tile-editor", Is);
const Ci = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosComputerTileEditor: Is
}, Symbol.toStringTag, { value: "Module" }));
class js extends C {
  get entityField() {
    return "appliance";
  }
  get schema() {
    const e = $(this.hass);
    return [
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
      { name: "pm25", selector: g("sensor", "pm25") },
      { name: "humidity", selector: g("sensor", "humidity") },
      { name: "temperature", selector: g("sensor", "temperature") },
      { name: "power", selector: g("sensor", "power") },
      { name: "sensors", selector: { entity: { multiple: !0 } } },
      {
        name: "alerts",
        selector: { entity: { multiple: !0, filter: [{ domain: "binary_sensor" }] } }
      },
      T("appliance", e, [
        {
          name: "big_values",
          selector: se([
            { value: "pm25", label: "PM2.5" },
            { value: "humidity", label: e === "ru" ? "Влажность" : "Humidity" },
            { value: "temperature", label: e === "ru" ? "Температура" : "Temperature" },
            { value: "power", label: e === "ru" ? "Мощность" : "Power" }
          ])
        }
      ]),
      P("appliance", "toggle")
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
        ...j,
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
      sensors: A(e.sensors),
      alerts: A(e.alerts)
    };
  }
  fromForm(e) {
    return {
      ...e,
      sensors: k(
        this._config?.sensors,
        e.sensors ?? []
      ),
      alerts: k(
        this._config?.alerts,
        e.alerts ?? []
      )
    };
  }
}
S("horos-air-tile-editor", js);
const ki = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosAirTileEditor: js
}, Symbol.toStringTag, { value: "Module" }));
class Ms extends C {
  get entityField() {
    return "cover";
  }
  get schema() {
    const e = $(this.hass);
    return [
      { name: "cover", required: !0, selector: g("cover") },
      { name: "position", selector: g("sensor") },
      { name: "illuminance", selector: g("sensor", "illuminance") },
      { name: "battery", selector: g("sensor", "battery") },
      { name: "controls", selector: { boolean: {} } },
      T("cover", e, [
        {
          name: "big_values",
          selector: se([
            { value: "illuminance", label: e === "ru" ? "Освещённость" : "Illuminance" },
            { value: "battery", label: e === "ru" ? "Заряд" : "Battery" }
          ])
        }
      ]),
      P("cover", "none")
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
        ...j,
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
S("horos-cover-tile-editor", Ms);
const Ai = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosCoverTileEditor: Ms
}, Symbol.toStringTag, { value: "Module" }));
class Rs extends C {
  get entityField() {
  }
  get schema() {
    const e = $(this.hass);
    return [
      { name: "limit", selector: G(1, 12) },
      { name: "ignore", selector: { entity: { multiple: !0 } } },
      T(void 0, e),
      P(void 0, "none")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...I,
        limit: "Сколько устройств называть",
        ignore: "Молчание этих — норма"
      },
      en: {
        ...j,
        limit: "How many devices to name",
        ignore: "Silence of these is normal"
      }
    });
  }
}
S("horos-offline-tile-editor", Rs);
const Oi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosOfflineTileEditor: Rs
}, Symbol.toStringTag, { value: "Module" }));
class Hs extends C {
  get entityField() {
    return "total";
  }
  get schema() {
    const e = $(this.hass);
    return [
      { name: "total", selector: g("sensor", "power") },
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
      { name: "limit", selector: G(1, 12) },
      T("total", e),
      P("total", "none")
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
        ...j,
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
      consumers: A(e.consumers)
    };
  }
  fromForm(e) {
    return {
      ...e,
      consumers: k(
        this._config?.consumers,
        e.consumers ?? []
      )
    };
  }
}
S("horos-energy-tile-editor", Hs);
const Ti = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosEnergyTileEditor: Hs
}, Symbol.toStringTag, { value: "Module" }));
class Ns extends C {
  get entityField() {
  }
  get schema() {
    const e = $(this.hass);
    return [
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
      },
      T(void 0, e),
      P(void 0, "none")
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
        ...j,
        name: "Name",
        areas: "Areas"
      }
    });
  }
  get formData() {
    const e = this._config ?? {};
    return {
      ...e,
      areas: A(e.areas)
    };
  }
  fromForm(e) {
    return {
      ...e,
      areas: k(
        this._config?.areas,
        e.areas ?? []
      )
    };
  }
}
S("horos-presence-tile-editor", Ns);
const Pi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosPresenceTileEditor: Ns
}, Symbol.toStringTag, { value: "Module" }));
class Ls extends C {
  get entityField() {
    return "group";
  }
  get schema() {
    const e = $(this.hass);
    return [
      { name: "lights", required: !0, selector: { entity: { multiple: !0, filter: { domain: "light" } } } },
      { name: "group", selector: g("light") },
      { name: "brightness", selector: ee },
      T("group", e),
      P("group", "toggle")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...I,
        name: "Название",
        lights: "Лампы",
        group: "Группа (главная сущность)",
        brightness: "Слайдер яркости группы"
      },
      en: {
        ...j,
        name: "Name",
        lights: "Lights",
        group: "Group (the main entity)",
        brightness: "Brightness slider for the group"
      }
    });
  }
  get formData() {
    const e = this._config ?? {};
    return {
      ...e,
      lights: A(e.lights)
    };
  }
  fromForm(e) {
    return {
      ...e,
      lights: k(
        this._config?.lights,
        e.lights ?? []
      )
    };
  }
}
S("horos-light-tile-editor", Ls);
const Ii = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosLightTileEditor: Ls
}, Symbol.toStringTag, { value: "Module" }));
class Fs extends C {
  get entityField() {
  }
  get schema() {
    const e = $(this.hass);
    return [
      { name: "players", required: !0, selector: { entity: { multiple: !0, filter: { domain: "media_player" } } } },
      { name: "controls", selector: ee },
      T(void 0, e),
      P(void 0, "more-info")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...I,
        name: "Название",
        players: "Проигрыватели",
        controls: "Кнопки управления"
      },
      en: {
        ...j,
        name: "Name",
        players: "Players",
        controls: "Playback buttons"
      }
    });
  }
  get formData() {
    const e = this._config ?? {};
    return {
      ...e,
      players: A(e.players)
    };
  }
  fromForm(e) {
    return {
      ...e,
      players: k(
        this._config?.players,
        e.players ?? []
      )
    };
  }
}
S("horos-media-tile-editor", Fs);
const ji = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosMediaTileEditor: Fs
}, Symbol.toStringTag, { value: "Module" }));
class Us extends C {
  get entityField() {
    return "climate";
  }
  get schema() {
    const e = $(this.hass);
    return [
      { name: "climate", required: !0, selector: g("climate") },
      { name: "temperature", selector: g("sensor", "temperature") },
      { name: "humidity", selector: g("sensor", "humidity") },
      { name: "power", selector: g("sensor", "power") },
      { name: "sensors", selector: { entity: { multiple: !0 } } },
      { name: "controls", selector: ee },
      T("climate", e, [
        {
          name: "big_values",
          selector: se([
            { value: "temperature", label: e === "ru" ? "Температура" : "Temperature" },
            { value: "humidity", label: e === "ru" ? "Влажность" : "Humidity" },
            { value: "power", label: e === "ru" ? "Мощность" : "Power" }
          ])
        }
      ]),
      P("climate", "more-info")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...I,
        name: "Название",
        climate: "Прибор",
        temperature: "Температура в комнате",
        humidity: "Влажность в комнате",
        power: "Мощность",
        sensors: "Что ещё сказать",
        controls: "Режимы и уставка",
        big_values: "Крупно справа (не больше трёх)"
      },
      en: {
        ...j,
        name: "Name",
        climate: "Climate entity",
        temperature: "Room temperature",
        humidity: "Room humidity",
        power: "Power",
        sensors: "What else to show",
        controls: "Modes and target",
        big_values: "Large on the right (up to three)"
      }
    });
  }
  get formData() {
    const e = this._config ?? {};
    return {
      ...e,
      sensors: A(e.sensors)
    };
  }
  fromForm(e) {
    return {
      ...e,
      sensors: k(
        this._config?.sensors,
        e.sensors ?? []
      )
    };
  }
}
S("horos-ac-tile-editor", Us);
const Mi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosAcTileEditor: Us
}, Symbol.toStringTag, { value: "Module" }));
class Ds extends C {
  get entityField() {
  }
  get schema() {
    const e = $(this.hass);
    return [
      { name: "limit", selector: G(1, 20) },
      { name: "include_skipped", selector: ee },
      { name: "ignore", selector: { entity: { multiple: !0, filter: { domain: "update" } } } },
      T(void 0, e),
      P(void 0, "more-info")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...I,
        name: "Название",
        limit: "Сколько называть поимённо",
        include_skipped: "Считать и пропущенные версии",
        ignore: "Не считать"
      },
      en: {
        ...j,
        name: "Name",
        limit: "How many to name",
        include_skipped: "Count skipped versions too",
        ignore: "Do not count"
      }
    });
  }
}
S("horos-updates-tile-editor", Ds);
const Ri = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosUpdatesTileEditor: Ds
}, Symbol.toStringTag, { value: "Module" }));
class zs extends C {
  get entityField() {
  }
  get schema() {
    const e = $(this.hass);
    return [
      { name: "lists", required: !0, selector: { entity: { multiple: !0, filter: { domain: "todo" } } } },
      { name: "calendar", selector: g("calendar") },
      T(void 0, e),
      P(void 0, "more-info")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...I,
        name: "Название",
        lists: "Списки дел",
        calendar: "Календарь"
      },
      en: {
        ...j,
        name: "Name",
        lists: "To-do lists",
        calendar: "Calendar"
      }
    });
  }
  get formData() {
    const e = this._config ?? {};
    return {
      ...e,
      lists: A(e.lists)
    };
  }
  fromForm(e) {
    return {
      ...e,
      lists: k(
        this._config?.lists,
        e.lists ?? []
      )
    };
  }
}
S("horos-tasks-tile-editor", zs);
const Hi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosTasksTileEditor: zs
}, Symbol.toStringTag, { value: "Module" }));
class Ws extends C {
  get entityField() {
  }
  get schema() {
    const e = $(this.hass);
    return [
      { name: "alerts", required: !0, selector: { entity: { multiple: !0 } } },
      { name: "limit", selector: G(1, 20) },
      { name: "watch_offline", selector: ee },
      T(void 0, e),
      P(void 0, "more-info")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...I,
        name: "Название",
        alerts: "Оповещения",
        limit: "Сколько называть поимённо",
        watch_offline: "Считать потерю связи оповещением"
      },
      en: {
        ...j,
        name: "Name",
        alerts: "Alerts",
        limit: "How many to name",
        watch_offline: "Count a lost connection as an alert"
      }
    });
  }
  get formData() {
    const e = this._config ?? {};
    return {
      ...e,
      alerts: A(e.alerts)
    };
  }
  fromForm(e) {
    return {
      ...e,
      alerts: k(
        this._config?.alerts,
        e.alerts ?? []
      )
    };
  }
}
S("horos-alerts-tile-editor", Ws);
const Ni = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosAlertsTileEditor: Ws
}, Symbol.toStringTag, { value: "Module" })), ue = {
  entity: {
    filter: [
      { domain: "script" },
      { domain: "scene" },
      { domain: "button" },
      { domain: "input_button" }
    ]
  }
};
class qs extends C {
  get entityField() {
    return "state";
  }
  get schema() {
    const e = $(this.hass);
    return [
      { name: "state", selector: g("input_boolean") },
      { name: "power", selector: ue },
      { name: "bright", selector: ue },
      { name: "dim", selector: ue },
      { name: "warm", selector: ue },
      { name: "cold", selector: ue },
      {
        name: "presets",
        selector: { entity: { ...ue.entity, multiple: !0 } }
      },
      { name: "preset_state", selector: g("input_select") },
      { name: "sensors", selector: { entity: { multiple: !0 } } },
      { name: "brightness", selector: ee },
      { name: "preset_labels", selector: ee },
      T("state", e),
      P("state", "toggle")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...I,
        name: "Название",
        state: "Где лежит состояние",
        power: "Включить/выключить",
        bright: "Ярче",
        dim: "Тусклее",
        warm: "Теплее",
        cold: "Холоднее",
        presets: "Режимы",
        preset_state: "Где лежит текущий режим",
        sensors: "Что ещё сказать",
        brightness: "Слайдер яркости (для настоящей лампы)",
        preset_labels: "Подписи у режимов"
      },
      en: {
        ...j,
        name: "Name",
        state: "Where the state lives",
        power: "Power on/off",
        bright: "Brighter",
        dim: "Dimmer",
        warm: "Warmer",
        cold: "Colder",
        presets: "Presets",
        preset_state: "Where the current preset lives",
        sensors: "What else to show",
        brightness: "Brightness slider (for a real light)",
        preset_labels: "Names next to the presets"
      }
    });
  }
  get formData() {
    const e = this._config ?? {};
    return {
      ...e,
      presets: A(e.presets),
      sensors: A(e.sensors)
    };
  }
  fromForm(e) {
    return {
      ...e,
      presets: k(
        this._config?.presets,
        e.presets ?? []
      ),
      sensors: k(
        this._config?.sensors,
        e.sensors ?? []
      )
    };
  }
}
S("horos-lamp-tile-editor", qs);
const Li = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosLampTileEditor: qs
}, Symbol.toStringTag, { value: "Module" }));
class Bs extends C {
  get entityField() {
    return "mode";
  }
  get schema() {
    const e = $(this.hass);
    return [
      { name: "mode", selector: g("sensor") },
      {
        name: "burner",
        selector: g("binary_sensor", "heat")
      },
      {
        name: "pump",
        selector: g("binary_sensor", "heat")
      },
      {
        name: "switch",
        selector: { entity: { filter: [{ domain: "switch" }] } }
      },
      { name: "power", selector: g("sensor", "power") },
      { name: "energy", selector: g("sensor", "energy") },
      {
        name: "zones",
        selector: { entity: { multiple: !0, filter: [{ domain: "climate" }] } }
      },
      T("mode", e, [
        {
          name: "big_values",
          selector: se([
            { value: "power", label: e === "ru" ? "Мощность" : "Power" },
            { value: "energy", label: e === "ru" ? "Энергия" : "Energy" }
          ])
        }
      ]),
      P("mode", "more-info")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...I,
        name: "Название",
        mode: "Что котёл делает сейчас",
        burner: "Горелка",
        pump: "Насос",
        switch: "Питание котла",
        power: "Мощность",
        energy: "Энергия",
        zones: "Комнаты",
        big_values: "Крупно справа (не больше трёх)"
      },
      en: {
        ...j,
        name: "Name",
        mode: "What the boiler is doing",
        burner: "Burner",
        pump: "Pump",
        switch: "Power to the boiler",
        power: "Power",
        energy: "Energy",
        zones: "Rooms",
        big_values: "Large on the right (up to three)"
      }
    });
  }
  get formData() {
    const e = this._config ?? {};
    return {
      ...e,
      zones: A(e.zones)
    };
  }
  fromForm(e) {
    return {
      ...e,
      zones: k(
        this._config?.zones,
        e.zones ?? []
      )
    };
  }
}
S("horos-heating-tile-editor", Bs);
const Fi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosHeatingTileEditor: Bs
}, Symbol.toStringTag, { value: "Module" }));
