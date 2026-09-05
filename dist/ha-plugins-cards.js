/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _e = globalThis, Re = _e.ShadowRoot && (_e.ShadyCSS === void 0 || _e.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, He = Symbol(), Ve = /* @__PURE__ */ new WeakMap();
let _t = class {
  constructor(e, t, r) {
    if (this._$cssResult$ = !0, r !== He) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (Re && e === void 0) {
      const r = t !== void 0 && t.length === 1;
      r && (e = Ve.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && Ve.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const cs = (s) => new _t(typeof s == "string" ? s : s + "", void 0, He), Ne = (s, ...e) => {
  const t = s.length === 1 ? s[0] : e.reduce((r, n, i) => r + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + s[i + 1], s[0]);
  return new _t(t, s, He);
}, us = (s, e) => {
  if (Re) s.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const r = document.createElement("style"), n = _e.litNonce;
    n !== void 0 && r.setAttribute("nonce", n), r.textContent = t.cssText, s.appendChild(r);
  }
}, Ke = Re ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const r of e.cssRules) t += r.cssText;
  return cs(t);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: hs, defineProperty: ds, getOwnPropertyDescriptor: ms, getOwnPropertyNames: ps, getOwnPropertySymbols: fs, getPrototypeOf: gs } = Object, we = globalThis, Ge = we.trustedTypes, _s = Ge ? Ge.emptyScript : "", vs = we.reactiveElementPolyfillSupport, le = (s, e) => s, ye = { toAttribute(s, e) {
  switch (e) {
    case Boolean:
      s = s ? _s : null;
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
} }, Ue = (s, e) => !hs(s, e), Ye = { attribute: !0, type: String, converter: ye, reflect: !1, useDefault: !1, hasChanged: Ue };
Symbol.metadata ??= Symbol("metadata"), we.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let ee = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = Ye) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const r = Symbol(), n = this.getPropertyDescriptor(e, r, t);
      n !== void 0 && ds(this.prototype, e, n);
    }
  }
  static getPropertyDescriptor(e, t, r) {
    const { get: n, set: i } = ms(this.prototype, e) ?? { get() {
      return this[t];
    }, set(o) {
      this[t] = o;
    } };
    return { get: n, set(o) {
      const c = n?.call(this);
      i?.call(this, o), this.requestUpdate(e, c, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Ye;
  }
  static _$Ei() {
    if (this.hasOwnProperty(le("elementProperties"))) return;
    const e = gs(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(le("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(le("properties"))) {
      const t = this.properties, r = [...ps(t), ...fs(t)];
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
      for (const n of r) t.unshift(Ke(n));
    } else e !== void 0 && t.push(Ke(e));
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
    return us(e, this.constructor.elementStyles), e;
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
      const i = (r.converter?.toAttribute !== void 0 ? r.converter : ye).toAttribute(t, r.type);
      this._$Em = e, i == null ? this.removeAttribute(n) : this.setAttribute(n, i), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const r = this.constructor, n = r._$Eh.get(e);
    if (n !== void 0 && this._$Em !== n) {
      const i = r.getPropertyOptions(n), o = typeof i.converter == "function" ? { fromAttribute: i.converter } : i.converter?.fromAttribute !== void 0 ? i.converter : ye;
      this._$Em = n;
      const c = o.fromAttribute(t, i.type);
      this[n] = c ?? this._$Ej?.get(n) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, t, r, n = !1, i) {
    if (e !== void 0) {
      const o = this.constructor;
      if (n === !1 && (i = this[e]), r ??= o.getPropertyOptions(e), !((r.hasChanged ?? Ue)(i, t) || r.useDefault && r.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(o._$Eu(e, r)))) return;
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
        const { wrapped: o } = i, c = this[n];
        o !== !0 || this._$AL.has(n) || c === void 0 || this.C(n, void 0, i, c);
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
ee.elementStyles = [], ee.shadowRootOptions = { mode: "open" }, ee[le("elementProperties")] = /* @__PURE__ */ new Map(), ee[le("finalized")] = /* @__PURE__ */ new Map(), vs?.({ ReactiveElement: ee }), (we.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Le = globalThis, Ze = (s) => s, be = Le.trustedTypes, Je = be ? be.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, vt = "$lit$", z = `lit$${Math.random().toFixed(9).slice(2)}$`, yt = "?" + z, ys = `<${yt}>`, G = document, ce = () => G.createComment(""), ue = (s) => s === null || typeof s != "object" && typeof s != "function", De = Array.isArray, bs = (s) => De(s) || typeof s?.[Symbol.iterator] == "function", Te = `[ 	
\f\r]`, ae = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Qe = /-->/g, Xe = />/g, W = RegExp(`>|${Te}(?:([^\\s"'>=/]+)(${Te}*=${Te}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), et = /'/g, tt = /"/g, bt = /^(?:script|style|textarea|title)$/i, ws = (s) => (e, ...t) => ({ _$litType$: s, strings: e, values: t }), _ = ws(1), te = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), st = /* @__PURE__ */ new WeakMap(), V = G.createTreeWalker(G, 129);
function wt(s, e) {
  if (!De(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Je !== void 0 ? Je.createHTML(e) : e;
}
const $s = (s, e) => {
  const t = s.length - 1, r = [];
  let n, i = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = ae;
  for (let c = 0; c < t; c++) {
    const a = s[c];
    let l, h, u = -1, g = 0;
    for (; g < a.length && (o.lastIndex = g, h = o.exec(a), h !== null); ) g = o.lastIndex, o === ae ? h[1] === "!--" ? o = Qe : h[1] !== void 0 ? o = Xe : h[2] !== void 0 ? (bt.test(h[2]) && (n = RegExp("</" + h[2], "g")), o = W) : h[3] !== void 0 && (o = W) : o === W ? h[0] === ">" ? (o = n ?? ae, u = -1) : h[1] === void 0 ? u = -2 : (u = o.lastIndex - h[2].length, l = h[1], o = h[3] === void 0 ? W : h[3] === '"' ? tt : et) : o === tt || o === et ? o = W : o === Qe || o === Xe ? o = ae : (o = W, n = void 0);
    const $ = o === W && s[c + 1].startsWith("/>") ? " " : "";
    i += o === ae ? a + ys : u >= 0 ? (r.push(l), a.slice(0, u) + vt + a.slice(u) + z + $) : a + z + (u === -2 ? c : $);
  }
  return [wt(s, i + (s[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), r];
};
class he {
  constructor({ strings: e, _$litType$: t }, r) {
    let n;
    this.parts = [];
    let i = 0, o = 0;
    const c = e.length - 1, a = this.parts, [l, h] = $s(e, t);
    if (this.el = he.createElement(l, r), V.currentNode = this.el.content, t === 2 || t === 3) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (n = V.nextNode()) !== null && a.length < c; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const u of n.getAttributeNames()) if (u.endsWith(vt)) {
          const g = h[o++], $ = n.getAttribute(u).split(z), y = /([.?@])?(.*)/.exec(g);
          a.push({ type: 1, index: i, name: y[2], strings: $, ctor: y[1] === "." ? Ss : y[1] === "?" ? xs : y[1] === "@" ? Cs : $e }), n.removeAttribute(u);
        } else u.startsWith(z) && (a.push({ type: 6, index: i }), n.removeAttribute(u));
        if (bt.test(n.tagName)) {
          const u = n.textContent.split(z), g = u.length - 1;
          if (g > 0) {
            n.textContent = be ? be.emptyScript : "";
            for (let $ = 0; $ < g; $++) n.append(u[$], ce()), V.nextNode(), a.push({ type: 2, index: ++i });
            n.append(u[g], ce());
          }
        }
      } else if (n.nodeType === 8) if (n.data === yt) a.push({ type: 2, index: i });
      else {
        let u = -1;
        for (; (u = n.data.indexOf(z, u + 1)) !== -1; ) a.push({ type: 7, index: i }), u += z.length - 1;
      }
      i++;
    }
  }
  static createElement(e, t) {
    const r = G.createElement("template");
    return r.innerHTML = e, r;
  }
}
function se(s, e, t = s, r) {
  if (e === te) return e;
  let n = r !== void 0 ? t._$Co?.[r] : t._$Cl;
  const i = ue(e) ? void 0 : e._$litDirective$;
  return n?.constructor !== i && (n?._$AO?.(!1), i === void 0 ? n = void 0 : (n = new i(s), n._$AT(s, t, r)), r !== void 0 ? (t._$Co ??= [])[r] = n : t._$Cl = n), n !== void 0 && (e = se(s, n._$AS(s, e.values), n, r)), e;
}
class Es {
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
    const { el: { content: t }, parts: r } = this._$AD, n = (e?.creationScope ?? G).importNode(t, !0);
    V.currentNode = n;
    let i = V.nextNode(), o = 0, c = 0, a = r[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let l;
        a.type === 2 ? l = new de(i, i.nextSibling, this, e) : a.type === 1 ? l = new a.ctor(i, a.name, a.strings, this, e) : a.type === 6 && (l = new As(i, this, e)), this._$AV.push(l), a = r[++c];
      }
      o !== a?.index && (i = V.nextNode(), o++);
    }
    return V.currentNode = G, n;
  }
  p(e) {
    let t = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, t), t += r.strings.length - 2) : r._$AI(e[t])), t++;
  }
}
class de {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, t, r, n) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = r, this.options = n, this._$Cv = n?.isConnected ?? !0;
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
    e = se(this, e, t), ue(e) ? e === d || e == null || e === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : e !== this._$AH && e !== te && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : bs(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== d && ue(this._$AH) ? this._$AA.nextSibling.data = e : this.T(G.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: r } = e, n = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = he.createElement(wt(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === n) this._$AH.p(t);
    else {
      const i = new Es(n, this), o = i.u(this.options);
      i.p(t), this.T(o), this._$AH = i;
    }
  }
  _$AC(e) {
    let t = st.get(e.strings);
    return t === void 0 && st.set(e.strings, t = new he(e)), t;
  }
  k(e) {
    De(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let r, n = 0;
    for (const i of e) n === t.length ? t.push(r = new de(this.O(ce()), this.O(ce()), this, this.options)) : r = t[n], r._$AI(i), n++;
    n < t.length && (this._$AR(r && r._$AB.nextSibling, n), t.length = n);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const r = Ze(e).nextSibling;
      Ze(e).remove(), e = r;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class $e {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, r, n, i) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = e, this.name = t, this._$AM = n, this.options = i, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = d;
  }
  _$AI(e, t = this, r, n) {
    const i = this.strings;
    let o = !1;
    if (i === void 0) e = se(this, e, t, 0), o = !ue(e) || e !== this._$AH && e !== te, o && (this._$AH = e);
    else {
      const c = e;
      let a, l;
      for (e = i[0], a = 0; a < i.length - 1; a++) l = se(this, c[r + a], t, a), l === te && (l = this._$AH[a]), o ||= !ue(l) || l !== this._$AH[a], l === d ? e = d : e !== d && (e += (l ?? "") + i[a + 1]), this._$AH[a] = l;
    }
    o && !n && this.j(e);
  }
  j(e) {
    e === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Ss extends $e {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === d ? void 0 : e;
  }
}
class xs extends $e {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== d);
  }
}
class Cs extends $e {
  constructor(e, t, r, n, i) {
    super(e, t, r, n, i), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = se(this, e, t, 0) ?? d) === te) return;
    const r = this._$AH, n = e === d && r !== d || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, i = e !== d && (r === d || n);
    n && this.element.removeEventListener(this.name, this, r), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class As {
  constructor(e, t, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    se(this, e);
  }
}
const Os = Le.litHtmlPolyfillSupport;
Os?.(he, de), (Le.litHtmlVersions ??= []).push("3.3.3");
const ks = (s, e, t) => {
  const r = t?.renderBefore ?? e;
  let n = r._$litPart$;
  if (n === void 0) {
    const i = t?.renderBefore ?? null;
    r._$litPart$ = n = new de(e.insertBefore(ce(), i), i, void 0, t ?? {});
  }
  return n._$AI(s), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Fe = globalThis;
class K extends ee {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = ks(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return te;
  }
}
K._$litElement$ = !0, K.finalized = !0, Fe.litElementHydrateSupport?.({ LitElement: K });
const Ps = Fe.litElementPolyfillSupport;
Ps?.({ LitElement: K });
(Fe.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ts = { attribute: !0, type: String, converter: ye, reflect: !1, hasChanged: Ue }, Is = (s = Ts, e, t) => {
  const { kind: r, metadata: n } = t;
  let i = globalThis.litPropertyMetadata.get(n);
  if (i === void 0 && globalThis.litPropertyMetadata.set(n, i = /* @__PURE__ */ new Map()), r === "setter" && ((s = Object.create(s)).wrapped = !0), i.set(t.name, s), r === "accessor") {
    const { name: o } = t;
    return { set(c) {
      const a = e.get.call(this);
      e.set.call(this, c), this.requestUpdate(o, a, s, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(o, void 0, s, c), c;
    } };
  }
  if (r === "setter") {
    const { name: o } = t;
    return function(c) {
      const a = this[o];
      e.call(this, c), this.requestUpdate(o, a, s, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function Ee(s) {
  return (e, t) => typeof t == "object" ? Is(s, e, t) : ((r, n, i) => {
    const o = n.hasOwnProperty(i);
    return n.constructor.createProperty(i, r), o ? Object.getOwnPropertyDescriptor(n, i) : void 0;
  })(s, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function v(s) {
  return Ee({ ...s, state: !0, attribute: !1 });
}
const Z = Ne`
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
`, $t = /* @__PURE__ */ new Set(["unavailable", "unknown"]), Ms = " · ";
function p(s, e) {
  if (!e) return;
  const t = s?.states[e];
  return {
    entityId: e,
    stateObj: t,
    missing: !t,
    unavailable: !!t && $t.has(t.state)
  };
}
function js(s, e) {
  if (!(!s || !e || !e.stateObj || e.missing || e.unavailable))
    return s.formatEntityState(e.stateObj);
}
function P(s) {
  return s.filter(
    (e) => !!e && (e.content !== void 0 || (e.text ?? "").trim() !== "")
  );
}
function A(s, e) {
  const t = js(s, e);
  return t ? { text: t, entityId: e?.entityId } : void 0;
}
function D(s, e) {
  const t = Rs(s, e);
  return t ? { text: t, entityId: e?.entityId } : void 0;
}
function Rs(s, e) {
  if (!(!s || !e?.stateObj || !e.unavailable))
    return s.formatEntityState(e.stateObj);
}
function L(s) {
  if (!s?.stateObj) return;
  const e = Number(s.stateObj.state);
  return Number.isFinite(e) ? e : void 0;
}
function ze(s, e) {
  return s || (e?.stateObj?.attributes.friendly_name ?? e?.entityId ?? "");
}
function Hs(s, e) {
  if (!e) return { value: s };
  if (!s.endsWith(e)) return { value: s };
  const t = s.slice(0, s.length - e.length).trimEnd();
  return t ? { value: t, unit: e } : { value: s };
}
const je = "unavailable", Ns = "unknown", Us = "off", Ls = /* @__PURE__ */ new Set(["button", "input_button", "scene"]), Ds = /* @__PURE__ */ new Set([
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
]), T = (s) => s.substring(0, s.indexOf(".")), Fs = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "unknown";
function Et(s, e) {
  const t = T(s.entity_id), r = s.state;
  if (Ls.has(t))
    return r !== je;
  if (r === je || r === Ns || r === Us && t !== "alert")
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
const zs = (s) => s.reduceRight(
  (e, t) => `var(${t}${e ? `, ${e}` : ""})`,
  void 0
), Bs = (s) => {
  const e = Number(s);
  if (!isNaN(e))
    return e >= 70 ? "--state-sensor-battery-high-color" : e >= 30 ? "--state-sensor-battery-medium-color" : "--state-sensor-battery-low-color";
};
function Ws(s, e) {
  if (!s) return e;
  if (s.state === je)
    return "var(--state-unavailable-color)";
  const t = T(s.entity_id), r = s.attributes.device_class;
  if (t === "sensor" && r === "battery") {
    const a = Bs(s.state);
    if (a) return `var(${a})`;
  }
  if (!Ds.has(t))
    return e;
  const n = Et(s), i = Fs(s.state), o = n ? "active" : "inactive", c = [];
  return r && c.push(`--state-${t}-${r}-${i}-color`), c.push(
    `--state-${t}-${i}-color`,
    `--state-${t}-${o}-color`,
    `--state-${o}-color`
  ), zs(c);
}
function F(s) {
  if (!s) return "var(--state-inactive-color)";
  const e = Ws(s);
  return e || (Et(s) ? "var(--state-icon-color)" : "var(--state-inactive-color)");
}
function q(s) {
  return s !== void 0 && s.action !== "none";
}
const qs = ["closed", "locked", "off"], Vs = /* @__PURE__ */ new Set([
  "fan",
  "input_boolean",
  "light",
  "switch",
  "group",
  "automation",
  "humidifier",
  "valve"
]);
function Be(s) {
  if (!s) return { action: "none" };
  const e = T(s);
  return { action: Vs.has(e) || ["button", "input_button", "scene"].includes(e) ? "toggle" : "none" };
}
const Ks = {
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
function Gs(s, e) {
  const t = Ks[s];
  return t ? (e ? t.on : t.off) ?? t.on : e ? "turn_on" : "turn_off";
}
function Ys(s, e) {
  const t = s.states[e];
  if (!t) return;
  const r = T(e), n = r === "group" ? "homeassistant" : r, i = qs.includes(t.state);
  s.callService(n, Gs(r, i), {
    entity_id: e
  });
}
function nt(s, e, t) {
  s.dispatchEvent(
    new CustomEvent(e, { detail: t, bubbles: !0, composed: !0 })
  );
}
function Zs(s, e) {
  e ? window.history.replaceState(null, "", s) : window.history.pushState(null, "", s), window.dispatchEvent(new CustomEvent("location-changed", { detail: {} }));
}
async function Js(s, e) {
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
async function Qs(s, e, t, r) {
  let n;
  if (r === "double_tap" ? n = t.double_tap_action : r === "hold" ? n = t.hold_action : n = t.tap_action, n || (n = { action: "more-info" }), !!await Js(s, n))
    switch (n.action) {
      case "none":
        break;
      case "more-info": {
        const i = n.entity || t.entity;
        i && nt(s, "hass-more-info", { entityId: i });
        break;
      }
      case "toggle": {
        const i = n.entity || t.entity;
        i && Ys(e, i);
        break;
      }
      case "navigate":
        n.navigation_path && Zs(n.navigation_path, n.navigation_replace);
        break;
      case "url":
        n.url_path && window.open(n.url_path, "_blank", "noreferrer");
        break;
      case "perform-action":
      case "call-service": {
        const i = n.perform_action || n.service;
        if (!i) break;
        const [o, c] = i.split(".", 2);
        e.callService(o, c, {
          ...n.data ?? n.service_data ?? {},
          ...n.target ?? {}
        });
        break;
      }
      case "fire-dom-event":
        nt(s, "ll-custom", n);
        break;
      default:
        console.warn(
          `horos-cards: action "${n.action}" is not supported`
        );
    }
}
const St = 5e3, rt = [
  "ha-tile-container",
  "ha-tile-icon",
  "ha-tile-info",
  "hui-card-features"
];
let fe, ge;
function xt(s, e) {
  return customElements.get(s) ? Promise.resolve(!0) : Promise.race([
    customElements.whenDefined(s).then(() => !0),
    new Promise((t) => setTimeout(() => t(!1), e))
  ]);
}
async function Xs() {
  const s = window.loadCardHelpers;
  if (s)
    try {
      (await s()).createCardElement?.({ type: "tile", entity: "sun.sun" });
    } catch {
    }
}
function Ct() {
  return fe || (fe = (async () => rt.every((e) => customElements.get(e)) ? !0 : (await Xs(), (await Promise.all(
    rt.map((e) => xt(e, St))
  )).every(Boolean)))(), fe);
}
function en() {
  return ge || (ge = (async () => {
    if (customElements.get("hui-card-features-editor")) return !0;
    await Ct();
    const s = customElements.get("hui-tile-card");
    try {
      await s?.getConfigElement?.();
    } catch {
    }
    return xt("hui-card-features-editor", St);
  })(), ge);
}
const tn = {
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
}, sn = {
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
}, ve = {
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
}, At = { ru: sn, en: ve };
function b(s) {
  const t = (s?.language ?? s?.locale?.language ?? "en").split("-")[0].toLowerCase();
  return t in At ? t : "en";
}
function nn(s, e) {
  if (s !== "ru") return e === 1 ? "one" : "many";
  const t = e % 10, r = e % 100;
  return t === 1 && r !== 11 ? "one" : t >= 2 && t <= 4 && (r < 12 || r > 14) ? "few" : "many";
}
function m(s, e, t = {}) {
  const r = b(s), n = At[r] ?? ve, i = t.count, o = typeof i == "number" ? `${e}.${nn(r, i)}` : void 0;
  return ((o && (n[o] ?? ve[o])) ?? n[e] ?? ve[e] ?? e).replace(
    /\{(\w+)\}/g,
    (a, l) => l in t ? String(t[l]) : a
  );
}
var rn = Object.defineProperty, Ot = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && rn(e, t, n), n;
};
class w extends K {
  constructor() {
    super(...arguments), this._ready = !1, this.base = {};
  }
  static {
    this.styles = [Z];
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
    super.connectedCallback(), Ct().then((e) => {
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
    Qs(this, this.hass, r, e);
  }
  // ---- rendering -------------------------------------------------------
  /** A banner instead of the card: the config is invalid or the entity is gone. */
  renderWarning(e) {
    return _`<ha-card><div class="warning">${e}</div></ha-card>`;
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
      return !this.base.state_content && !this.base.time_format ? A(this.hass, e) : {
        entityId: e.entityId,
        content: _`<state-display
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
      return m(
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
    if (!t) return _`<span>${e}</span>`;
    const r = this.hass?.states[t]?.attributes.friendly_name ?? t;
    return _`<button
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
      imageUrl: c,
      defaultIconAction: a,
      values: l,
      ownFeatures: h,
      customFeatures: u
    } = e;
    if (this._entityId = o, this._defaultIconAction = a, !this._ready)
      return this.renderWarning(m(this.hass, "internals.failed"));
    const g = this.base.color ? on(this.base.color) : r ?? "var(--state-inactive-color)", $ = this.base.icon_tap_action ?? a, y = q($) || q(this.base.icon_hold_action) || q(this.base.icon_double_tap_action), qe = this.base.features?.length ? this.base.features : h, ke = this.base.features_position ?? "bottom";
    return _`
      <ha-card style="--tile-color: ${g};">
        <ha-tile-container
          .featurePosition=${ke}
          .vertical=${!!this.base.vertical}
          .interactive=${!0}
          .actionHandlerOptions=${{
      hasHold: q(this.base.hold_action),
      hasDoubleClick: q(this.base.double_tap_action)
    }}
          @action=${this._handleAction}
        >
          <ha-tile-icon
            slot="icon"
            class=${c ? "image" : ""}
            .interactive=${y}
            .imageUrl=${c}
            .icon=${this.base.icon ?? t}
            .actionHandlerOptions=${{
      hasHold: q(this.base.icon_hold_action),
      hasDoubleClick: q(this.base.icon_double_tap_action)
    }}
            @action=${this._handleIconAction}
          ></ha-tile-icon>

          <div slot="info" class="info ${this.base.vertical ? "vertical" : ""}">
            <ha-tile-info>
              <span slot="primary">${n}</span>
              ${i?.length && !this.base.hide_state ? _`<span slot="secondary"
                    >${i.map(
      (U, Pe) => _`
                        ${Pe ? _`<span>${Ms}</span>` : d}${this.renderClickable(
        U.content ?? U.text,
        U.entityId
      )}
                      `
    )}</span
                  >` : d}
            </ha-tile-info>
            ${l?.length ? _`<div class="values of-${l.length}">
                  ${l.map(
      (U, Pe) => _`
                      ${Pe ? _`<span class="values-separator">/</span>` : d}
                      ${this.renderClickable(
        _`${U.icon ? _`<ha-icon
                              class="value-icon"
                              .icon=${U.icon}
                            ></ha-icon>` : d}${U.value}${U.unit ? _`<span class="unit"> ${U.unit}</span>` : d}`,
        U.entityId
      )}
                    `
    )}
                </div>` : d}
          </div>

          ${u ? _`<div slot="features" class="custom-features">
                ${u}
              </div>` : d}
          ${qe?.length ? _`<hui-card-features
                slot=${ke === "inline" ? "features-inline" : "features"}
                .hass=${this.hass}
                .context=${{ entity_id: o }}
                .features=${qe}
                .position=${ke}
              ></hui-card-features>` : d}
        </ha-tile-container>
      </ha-card>
    `;
  }
  /**
   * The values of the right-hand column. `icons` names a value by its role key:
   * without it two percentages in a row are indistinguishable.
   */
  bigValues(e, t = tn) {
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
    if (!(!this.hass || !e) && !$t.has(e.state))
      return Hs(
        this.hass.formatEntityState(e),
        e.attributes.unit_of_measurement
      );
  }
}
Ot([
  Ee({ attribute: !1 })
], w.prototype, "hass");
Ot([
  v()
], w.prototype, "_ready");
function on(s) {
  return /^(#|rgb|hsl|var\()/.test(s) ? s : s === "state" ? "var(--state-icon-color)" : `var(--${s}-color, var(--state-icon-color))`;
}
const it = 3;
function J(s, e, t) {
  if (!s || s.length === 0) return [e];
  if (s.length > it)
    throw new Error(
      `At most ${it} large values are allowed, got ${s.length}`
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
function Q(s, e) {
  const t = e.map((n) => s.find((i) => i.key === n)).filter((n) => !!n), r = s.filter((n) => !e.includes(n.key));
  return { big: t, rest: r };
}
let ot = !1;
function an(s) {
  ot || (ot = !0, console.warn(
    `horos-cards: card ${s} is already registered. The bundle looks to be attached to the dashboard twice — the copy that loaded first is the one running. Check the dashboard resources.`
  ));
}
function at() {
  const s = document.querySelector("home-assistant");
  return b(s?.hass);
}
function S(s, e, t) {
  if (customElements.get(s)) {
    an(s);
    return;
  }
  customElements.define(s, e), window.customCards = window.customCards ?? [], window.customCards.push({
    type: t.type,
    preview: t.preview,
    get name() {
      return t.name[at() === "ru" ? "ru" : "en"];
    },
    get description() {
      return t.description[at() === "ru" ? "ru" : "en"];
    },
    getEntitySuggestion: t.suggest
  });
}
function x(s, e) {
  customElements.get(s) || customElements.define(s, e);
}
const ln = 20;
function X(s, e) {
  return s.states[e]?.attributes.device_class;
}
function kt(s, e) {
  return s.entities?.[e]?.hidden === !0;
}
function B(s, e) {
  const t = s.entities?.[e]?.device_id;
  if (!t || !s.entities) return [e];
  const r = Object.keys(s.entities).filter(
    (n) => n !== e && s.entities?.[n]?.device_id === t && !kt(s, n) && s.states[n] !== void 0
  );
  return [e, ...r.sort()];
}
function E(s, e, t, ...r) {
  return e.find(
    (n) => T(n) === t && r.includes(X(s, n) ?? "")
  );
}
function Se(s, ...e) {
  return s.find((t) => e.includes(T(t)));
}
function xe(s, e, t, r, n = ln) {
  const i = Object.keys(s.states).filter(
    (o) => o !== e && T(o) === t && r.includes(X(s, o) ?? "") && !kt(s, o)
  ).sort();
  return [e, ...i].slice(0, n);
}
function N(s, e, t = {}) {
  const r = { type: s, ...t };
  for (const [n, i] of Object.entries(e))
    i && (r[n] = i);
  return { config: r };
}
function Ce(s) {
  return Object.values(s).filter(Boolean).length;
}
var cn = Object.defineProperty, un = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && cn(e, t, n), n;
};
const lt = [
  "temperature",
  "humidity",
  "illuminance",
  "pm25"
];
class Pt extends w {
  constructor() {
    super(...arguments), this._bigKeys = ["temperature"];
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => pr), document.createElement(
      "horos-climate-tile-editor"
    );
  }
  static getStubConfig() {
    return { temperature: "", humidity: "" };
  }
  setConfig(e) {
    if (!e.temperature)
      throw new Error("A temperature entity is required (temperature)");
    this._bigKeys = J(
      e.big_values,
      "temperature",
      lt
    ), this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return d;
    const e = this._config, t = lt.map((c) => ({
      key: c,
      role: p(this.hass, e[c])
    })), r = this.missingRolesWarning(t.map((c) => c.role));
    if (r) return this.renderWarning(r);
    const { big: n, rest: i } = Q(t, this._bigKeys), o = t[0].role;
    return this.renderTile({
      icon: "mdi:thermometer",
      color: F(o?.stateObj),
      primary: ze(e.name, o),
      imageUrl: this.entityImage(o?.stateObj),
      defaultIconAction: Be(o?.entityId),
      secondary: P([
        D(this.hass, o),
        ...i.map((c) => A(this.hass, c.role))
      ]),
      mainEntityId: o?.entityId,
      values: this.bigValues(n)
    });
  }
}
un([
  v()
], Pt.prototype, "_config");
S("horos-climate-tile", Pt, {
  type: "horos-climate-tile",
  name: { ru: "Климат комнаты", en: "Room climate" },
  description: {
    ru: "Температура, влажность, освещённость и PM2.5 одной комнаты в одной плитке",
    en: "Temperature, humidity, illuminance and PM2.5 of one room in a single tile"
  },
  preview: !0,
  suggest: (s, e) => {
    if (T(e) !== "sensor") return null;
    const t = B(s, e), r = {
      temperature: E(s, t, "sensor", "temperature"),
      humidity: E(s, t, "sensor", "humidity"),
      illuminance: E(s, t, "sensor", "illuminance"),
      pm25: E(s, t, "sensor", "pm25")
    };
    return !r.temperature || Ce(r) < 2 ? null : N("custom:horos-climate-tile", r);
  }
});
var hn = Object.defineProperty, dn = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && hn(e, t, n), n;
};
const ct = ["switch", "power", "energy"];
class Tt extends w {
  constructor() {
    super(...arguments), this._bigKeys = ["power"];
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => fr), document.createElement("horos-plug-tile-editor");
  }
  static getStubConfig() {
    return { switch: "", power: "" };
  }
  setConfig(e) {
    if (!e.switch)
      throw new Error("A switch is required (switch)");
    this._bigKeys = J(e.big_values, "power", ct), this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return d;
    const e = this._config, t = ct.map((a) => ({
      key: a,
      role: p(this.hass, e[a])
    })), r = this.missingRolesWarning(t.map((a) => a.role));
    if (r) return this.renderWarning(r);
    const { big: n, rest: i } = Q(t, this._bigKeys), o = t[0].role, c = o.entityId;
    return this.renderTile({
      icon: "mdi:power-plug",
      color: F(o.stateObj),
      primary: ze(e.name, o),
      secondary: P([
        // One of the two returns a piece: an available switch gives its state,
        // an unavailable one its unavailability status.
        D(this.hass, o),
        // The switch is the card's main entity, so its state can be shown
        // through state_content, just like on the stock tile.
        ...i.map(
          (a) => a.key === "switch" ? this.mainStateSegment(a.role) : A(this.hass, a.role)
        )
      ]),
      mainEntityId: c,
      imageUrl: this.entityImage(o.stateObj),
      defaultIconAction: Be(c),
      values: this.bigValues(n),
      // The button is a stock HA feature; there is no markup of our own left for it.
      ownFeatures: e.toggle_button ? [{ type: "toggle" }] : void 0
    });
  }
}
dn([
  v()
], Tt.prototype, "_config");
S("horos-plug-tile", Tt, {
  type: "horos-plug-tile",
  name: { ru: "Розетка", en: "Smart plug" },
  description: {
    ru: "Выключатель, текущая мощность и накопленная энергия в одной плитке",
    en: "Switch, current power draw and accumulated energy in a single tile"
  },
  preview: !0,
  suggest: (s, e) => {
    const t = B(s, e), r = {
      switch: Se(t, "switch"),
      power: E(s, t, "sensor", "power"),
      energy: E(s, t, "sensor", "energy")
    };
    return !r.switch || Ce(r) < 2 ? null : N("custom:horos-plug-tile", r);
  }
});
const ut = 30, ht = 70;
function mn(s, e, t) {
  return s === void 0 ? "unknown" : s < e ? "dry" : s > t ? "wet" : "ok";
}
const pn = {
  dry: "var(--warning-color)",
  ok: "var(--success-color)",
  wet: "var(--info-color)",
  unknown: "var(--state-inactive-color)"
}, fn = {
  dry: "mdi:water-off",
  ok: "mdi:sprout",
  wet: "mdi:water-alert",
  unknown: "mdi:sprout"
};
var gn = Object.defineProperty, _n = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && gn(e, t, n), n;
};
const dt = ["moisture", "temperature", "battery"];
class It extends w {
  constructor() {
    super(...arguments), this._bigKeys = ["moisture"];
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => gr), document.createElement(
      "horos-plant-tile-editor"
    );
  }
  static getStubConfig() {
    return { moisture: "" };
  }
  setConfig(e) {
    if (!e.moisture)
      throw new Error("A soil moisture entity is required (moisture)");
    const t = e.dry_below ?? ut, r = e.wet_above ?? ht;
    if (t >= r)
      throw new Error("dry_below must be smaller than wet_above");
    this._bigKeys = J(e.big_values, "moisture", dt), this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return d;
    const e = this._config, t = dt.map((l) => ({
      key: l,
      role: p(this.hass, e[l])
    })), r = this.missingRolesWarning(t.map((l) => l.role));
    if (r) return this.renderWarning(r);
    const { big: n, rest: i } = Q(t, this._bigKeys), o = t[0].role, c = L(o), a = mn(
      c,
      e.dry_below ?? ut,
      e.wet_above ?? ht
    );
    return this.renderTile({
      icon: fn[a],
      color: pn[a],
      primary: ze(e.name, o),
      imageUrl: this.entityImage(o?.stateObj),
      defaultIconAction: Be(o?.entityId),
      secondary: P([
        D(this.hass, o),
        ...i.map((l) => A(this.hass, l.role))
      ]),
      mainEntityId: o?.entityId,
      values: this.bigValues(n),
      // The gauge is a stock HA feature, not a bar of our own. It takes its
      // colour from --tile-color, that is, from our dryness thresholds.
      ownFeatures: c === void 0 ? void 0 : [{ type: "bar-gauge", min: 0, max: 100 }]
    });
  }
}
_n([
  v()
], It.prototype, "_config");
S("horos-plant-tile", It, {
  type: "horos-plant-tile",
  name: { ru: "Растение", en: "Plant" },
  description: {
    ru: "Влажность почвы с порогами сухости, температура почвы и заряд датчика",
    en: "Soil moisture with dryness thresholds, soil temperature and sensor battery"
  },
  preview: !0,
  suggest: (s, e) => {
    if (T(e) !== "sensor" || X(s, e) !== "moisture")
      return null;
    const t = B(s, e);
    return N("custom:horos-plant-tile", {
      moisture: e,
      temperature: E(s, t, "sensor", "temperature"),
      battery: E(s, t, "sensor", "battery")
    });
  }
});
var vn = Object.defineProperty, Ae = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && vn(e, t, n), n;
};
class me extends K {
  constructor() {
    super(...arguments), this._children = [];
  }
  static {
    this.styles = Ne`
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
    return this._error ? _`<ha-card><div class="warning">${this._error}</div></ha-card>` : this._children.length ? _`
      ${this._heading ? _`<div class="heading">${this._heading}</div>` : d}
      <div class="grid" style="--columns: ${this.columns()}">
        ${this._children}
      </div>
    ` : d;
  }
}
Ae([
  Ee({ attribute: !1 })
], me.prototype, "hass");
Ae([
  v()
], me.prototype, "_heading");
Ae([
  v()
], me.prototype, "_children");
Ae([
  v()
], me.prototype, "_error");
function yn(s) {
  if (!s) return;
  const e = s.split(":").pop();
  return e ? e.trim() : s;
}
function bn(s) {
  return typeof s == "string" ? { entity: s } : s;
}
var wn = Object.defineProperty, $n = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && wn(e, t, n), n;
};
const En = 3;
class Mt extends me {
  static async getConfigElement() {
    return await Promise.resolve().then(() => _r), document.createElement(
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
    return this._config?.columns ?? En;
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
      const t = bn(e), r = this.hass?.states[t.entity];
      return {
        type: "button",
        entity: t.entity,
        name: t.name ?? yn(r?.attributes.friendly_name),
        icon: t.icon,
        show_state: !1,
        tap_action: { action: "toggle" }
      };
    }) : [];
  }
}
$n([
  v()
], Mt.prototype, "_config");
S("horos-buttons-tile", Mt, {
  type: "horos-buttons-tile",
  name: { ru: "Кнопки скриптов", en: "Script buttons" },
  description: {
    ru: "Сетка кнопок, вызывающих скрипты, под общим заголовком",
    en: "A grid of buttons running scripts, under one heading"
  },
  preview: !0
});
const ne = Ne`
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
function re(s, e) {
  return _`
    <div class="levels">
      ${s.map(
    (t) => _`
          <button
            class="level ${t.alarm ? "low" : ""}"
            style="--ink: ${t.ink};"
            title="${t.name}: ${t.text}"
            @click=${(r) => {
      r.stopPropagation(), e(t.entityId);
    }}
          >
            <span class="name">
              ${t.alarm ? _`<ha-icon
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
function ie(s, e) {
  if (s) {
    if (e && s.startsWith(e)) {
      const t = s.slice(e.length).trim();
      if (t) return t;
    }
    return s;
  }
}
function jt(s) {
  return s ? s.replace(/[\s—-]*(battery(\s+level)?|заряд)\s*$/i, "").trim() || s : void 0;
}
function pe(s) {
  return s === void 0 ? "var(--state-unavailable-color)" : s >= 70 ? "var(--state-sensor-battery-high-color, #4caf50)" : s >= 30 ? "var(--state-sensor-battery-medium-color, #ffa600)" : "var(--state-sensor-battery-low-color, #db4437)";
}
const Sn = pe;
function xn(s) {
  return s === void 0 ? "var(--state-unavailable-color)" : s >= 90 ? "var(--error-color, #db4437)" : s >= 80 ? "var(--warning-color, #ffa600)" : "var(--state-icon-color)";
}
function H(s) {
  return typeof s == "string" ? { entity: s } : s;
}
const Cn = [
  [/black|pgbk|_bk(_|$)/i, "black"],
  [/cyan/i, "cyan"],
  [/magenta/i, "purple"],
  [/yellow/i, "yellow"],
  // MC is the maintenance tank, not ink. It gets its own shade, otherwise it is
  // indistinguishable from black: that one is painted in the text colour and
  [/_mc(_|$)|maintenance/i, "blue-grey"]
];
function An(s) {
  return Cn.find(([t]) => t.test(s))?.[1];
}
function On(s) {
  return s === "black" ? "var(--primary-text-color)" : /^(#|rgb|hsl|var\()/.test(s) ? s : `var(--${s}-color, var(--state-icon-color))`;
}
const kn = ie, mt = (s, e) => typeof s == "number" && Number.isFinite(s) ? s : e;
function Pn(s, e, t) {
  const r = Number(s);
  if (!Number.isFinite(r)) return;
  const n = mt(e.marker_high_level, 100), i = mt(e.marker_low_level, 0), o = String(e.marker_type ?? "").includes("waste"), c = n > 0 ? Math.max(0, Math.min(100, r / n * 100)) : 0, a = o ? r >= n : r <= (t ?? i);
  return { fill: c, alarm: a, fills: o };
}
var Tn = Object.defineProperty, In = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && Tn(e, t, n), n;
};
class Rt extends w {
  static {
    this.styles = [Z, ne];
  }
  /** Level rows under the tile: roughly two per grid row. */
  contentRows() {
    return Math.ceil(((this._config?.cartridges.length ?? 0) + (this._config?.sensors?.length ?? 0)) / 2);
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => vr), document.createElement(
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
    return this._config.cartridges.map((t) => H(t)).map((t) => {
      const r = this.hass.states[t.entity];
      return {
        entityId: t.entity,
        name: t.name ?? kn(r?.attributes.friendly_name, e),
        ink: On(
          t.color ?? An(t.entity) ?? "grey"
        ),
        marker: r ? Pn(
          r.state,
          r.attributes,
          this._config.low_below
        ) : void 0,
        text: r ? this.hass.formatEntityState(r) : "—"
      };
    });
  }
  render() {
    if (!this._config || !this.hass) return d;
    const e = this._tanks(), t = e.filter((a) => !a.marker && a.text === "—");
    if (t.length)
      return this.renderWarning(
        `Entities not found: ${t.map((a) => a.entityId).join(", ")}`
      );
    const n = e.filter((a) => a.marker && !a.marker.fills).reduce(
      (a, l) => !a || l.marker.fill < a.marker.fill ? l : a,
      void 0
    ), i = this._config.status ? p(this.hass, this._config.status) : void 0, o = (this._config.sensors ?? []).map((a) => H(a)).map((a) => p(this.hass, a.entity)), c = i?.stateObj;
    return this.renderTile({
      icon: "mdi:printer",
      color: c ? F(c) : "var(--state-icon-color)",
      primary: this._printerName ?? m(this.hass, "printer.title"),
      secondary: P([
        A(this.hass, i),
        ...o.map((a) => A(this.hass, a))
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
      customFeatures: re(
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
In([
  v()
], Rt.prototype, "_config");
S("horos-printer-tile", Rt, {
  type: "horos-printer-tile",
  name: { ru: "Принтер", en: "Printer" },
  description: {
    ru: "Уровни чернил и состояние принтера в одной плитке",
    en: "Ink levels and printer status in a single tile"
  },
  preview: !0,
  suggest: (s, e) => {
    const t = B(s, e), r = t.filter(
      (i) => s.states[i]?.attributes.marker_type !== void 0
    );
    if (!r.length) return null;
    const n = t.find(
      (i) => T(i) === "sensor" && !r.includes(i) && Number.isNaN(Number(s.states[i]?.state))
    );
    return N(
      "custom:horos-printer-tile",
      { status: n },
      { cartridges: r }
    );
  }
});
var Mn = Object.defineProperty, jn = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && Mn(e, t, n), n;
};
const Rn = 20;
class Ht extends w {
  static {
    this.styles = [Z, ne];
  }
  /** Level rows under the tile: roughly two per grid row. */
  contentRows() {
    return Math.ceil((this._config?.consumables?.length ?? 0) / 2);
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => yr), document.createElement(
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
    if (!this._config || !this.hass) return d;
    const e = this._config, t = p(this.hass, e.vacuum), r = p(this.hass, e.battery), n = (e.sensors ?? []).map((l) => H(l)).map((l) => p(this.hass, l.entity)), i = this.missingRolesWarning([t, r, ...n]);
    if (i) return this.renderWarning(i);
    const o = t?.stateObj?.attributes.friendly_name, c = e.low_below ?? Rn, a = (e.consumables ?? []).map((l) => H(l)).map((l) => {
      const h = p(this.hass, l.entity), u = L(h) ?? 0, g = l.name ?? ie(h?.stateObj?.attributes.friendly_name, o);
      return {
        entityId: l.entity,
        name: g ?? l.entity,
        text: `${u}%`,
        // Painting them in the tile colour is wrong: a docked vacuum's colour
        // is the inactive one and every bar comes out the same grey. We paint
        // by level — a consumable asks the same question a battery does.
        ink: l.color ?? pe(u),
        level: u,
        alarm: u < c
      };
    });
    return this.renderTile({
      icon: "mdi:robot-vacuum",
      color: F(t?.stateObj),
      primary: e.name ?? o ?? m(this.hass, "vacuum.title"),
      mainEntityId: t?.entityId,
      secondary: P([
        D(this.hass, t),
        this.mainStateSegment(t),
        ...n.map((l) => A(this.hass, l))
      ]),
      values: r ? this.bigValues([{ key: "battery", role: r }]) : [],
      customFeatures: a.length ? re(a, (l) => this.fireMoreInfo(l)) : void 0
    });
  }
}
jn([
  v()
], Ht.prototype, "_config");
S("horos-vacuum-tile", Ht, {
  type: "horos-vacuum-tile",
  name: { ru: "Пылесос", en: "Vacuum" },
  description: {
    ru: "Состояние робота, заряд и ресурс расходников в одной плитке",
    en: "Robot status, battery and consumable life in a single tile"
  },
  preview: !0,
  suggest: (s, e) => {
    const t = B(s, e), r = Se(t, "vacuum"), n = E(s, t, "sensor", "battery");
    return !r || !n ? null : N("custom:horos-vacuum-tile", { vacuum: r, battery: n });
  }
});
var Hn = Object.defineProperty, Nn = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && Hn(e, t, n), n;
};
const Un = 30;
class Nt extends w {
  static async getConfigElement() {
    return await Promise.resolve().then(() => br), document.createElement(
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
    if (!this._config || !this.hass) return d;
    const e = this._config, t = e.low_below ?? Un, r = [], n = [];
    for (const c of e.batteries) {
      const a = H(c), l = p(this.hass, a.entity);
      if (l?.missing) {
        n.push(a.entity);
        continue;
      }
      const h = L(l);
      h !== void 0 && r.push({
        entityId: a.entity,
        name: a.name ?? jt(l?.stateObj?.attributes.friendly_name) ?? a.entity,
        level: h
      });
    }
    const i = r.filter((c) => c.level < t).sort((c, a) => c.level - a.level), o = i[0];
    return this.renderTile({
      icon: o ? "mdi:battery-alert-variant-outline" : "mdi:battery",
      color: Sn(o?.level),
      primary: e.name ?? m(this.hass, "batteries.title"),
      mainEntityId: o?.entityId,
      secondary: P([
        ...i.length ? i.map((c) => ({
          text: `${c.name} ${c.level}%`,
          entityId: c.entityId
        })) : [
          {
            text: m(this.hass, "batteries.allFull", {
              count: r.length
            })
          }
        ],
        // A row that disappeared is dropped, but staying silent about it is not
        // an option: a list card must not go dark over one renamed entity, and
        // must not pretend the entity was never there.
        ...n.length ? [{ text: m(this.hass, "list.missing", { count: n.length }) }] : []
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
Nn([
  v()
], Nt.prototype, "_config");
S("horos-batteries-tile", Nt, {
  type: "horos-batteries-tile",
  name: { ru: "Батарейки", en: "Batteries" },
  description: {
    ru: "Только садящиеся батарейки, от самой пустой",
    en: "Only the batteries that are running down, emptiest first"
  },
  preview: !0,
  suggest: (s, e) => T(e) !== "sensor" || X(s, e) !== "battery" ? null : N(
    "custom:horos-batteries-tile",
    {},
    { batteries: xe(s, e, "sensor", ["battery"]) }
  )
});
var Ln = Object.defineProperty, Dn = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && Ln(e, t, n), n;
};
class Ut extends w {
  static async getConfigElement() {
    return await Promise.resolve().then(() => wr), document.createElement(
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
    if (!this._config || !this.hass) return d;
    const e = this._config, t = [], r = [], n = [];
    let i = 0;
    for (const a of e.sensors) {
      const l = H(a), h = p(this.hass, l.entity);
      if (h?.missing) {
        n.push(l.entity);
        continue;
      }
      i += 1;
      const u = l.name ?? h?.stateObj?.attributes.friendly_name ?? l.entity;
      h?.unavailable ? r.push({ text: m(this.hass, "safety.offline", { name: u }), entityId: l.entity }) : h?.stateObj?.state === "on" && t.push({ text: u, entityId: l.entity });
    }
    const o = t.length > 0, c = [...t, ...r];
    return this.renderTile({
      icon: o ? "mdi:shield-alert" : r.length ? "mdi:shield-off-outline" : "mdi:shield-check",
      color: o ? "var(--error-color, #db4437)" : r.length ? "var(--warning-color, #ffa600)" : "var(--success-color, #43a047)",
      primary: e.name ?? m(this.hass, "safety.title"),
      mainEntityId: c[0]?.entityId,
      secondary: P([
        ...c.length ? c : [{ text: m(this.hass, "safety.calm", { count: i }) }],
        ...n.length ? [{ text: m(this.hass, "list.missing", { count: n.length }) }] : []
      ])
    });
  }
}
Dn([
  v()
], Ut.prototype, "_config");
S("horos-safety-tile", Ut, {
  type: "horos-safety-tile",
  name: { ru: "Безопасность", en: "Safety" },
  description: {
    ru: "Протечка, дым, газ — и датчики, потерявшие связь",
    en: "Leak, smoke, gas — and sensors that lost connection"
  },
  preview: !0,
  suggest: (s, e) => {
    const t = ["moisture", "gas", "smoke", "carbon_monoxide", "safety"];
    return T(e) !== "binary_sensor" || !t.includes(X(s, e) ?? "") ? null : N(
      "custom:horos-safety-tile",
      {},
      { sensors: xe(s, e, "binary_sensor", t) }
    );
  }
});
var Fn = Object.defineProperty, zn = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && Fn(e, t, n), n;
};
const pt = ["disk", "download", "upload"];
class Lt extends w {
  constructor() {
    super(...arguments), this._bigKeys = ["disk"];
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => $r), document.createElement(
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
    this._bigKeys = J(e.big_values, "disk", pt), this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return d;
    const e = this._config, t = pt.map((a) => ({
      key: a,
      role: p(this.hass, e[a])
    })), r = p(this.hass, e.status), n = (e.services ?? []).map((a) => H(a)).map((a) => p(this.hass, a.entity)), i = this.missingRolesWarning([
      r,
      ...t.map((a) => a.role),
      ...n
    ]);
    if (i) return this.renderWarning(i);
    const { big: o, rest: c } = Q(t, this._bigKeys);
    return this.renderTile({
      icon: "mdi:server",
      color: r ? F(r.stateObj) : "var(--state-icon-color)",
      primary: e.name ?? m(this.hass, "server.title"),
      mainEntityId: r?.entityId ?? t[0].role?.entityId,
      secondary: P([
        D(this.hass, r),
        this.mainStateSegment(r),
        ...c.map((a) => {
          const l = A(this.hass, a.role);
          if (!l) return;
          const h = a.key === "download" ? "↓ " : a.key === "upload" ? "↑ " : "";
          return { ...l, text: h + l.text };
        }),
        ...n.map((a) => A(this.hass, a))
      ]),
      values: this.bigValues(o)
    });
  }
}
zn([
  v()
], Lt.prototype, "_config");
S("horos-server-tile", Lt, {
  type: "horos-server-tile",
  name: { ru: "Домашний сервер", en: "Home server" },
  description: {
    ru: "Диск, скорости и состояние сервисов в одной плитке",
    en: "Disk, speeds and service status in a single tile"
  },
  preview: !0
});
var Bn = Object.defineProperty, Wn = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && Bn(e, t, n), n;
};
class Dt extends w {
  static {
    this.styles = [Z, ne];
  }
  /** Level rows under the tile: roughly two per grid row. */
  contentRows() {
    return Math.ceil((this._config?.devices?.length ?? 0) / 2);
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Er), document.createElement(
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
    if (!this._config || !this.hass) return d;
    const e = this._config, t = p(this.hass, e.person), r = p(this.hass, e.battery), n = p(this.hass, e.location), i = this.missingRolesWarning([t, r, n]);
    if (i) return this.renderWarning(i);
    const o = (e.devices ?? []).map((c) => H(c)).map((c) => {
      const a = p(this.hass, c.entity), l = L(a), h = c.name ?? jt(
        ie(
          a?.stateObj?.attributes.friendly_name,
          e.name
        )
      ) ?? c.entity;
      return {
        entityId: c.entity,
        name: h,
        text: l === void 0 ? m(this.hass, "value.unknown") : `${l}%`,
        ink: c.color ?? pe(l),
        level: l ?? 0,
        alarm: l !== void 0 && l < 20,
        alarmIcon: "mdi:battery-alert-variant-outline"
      };
    });
    return this.renderTile({
      icon: "mdi:account",
      color: F(t?.stateObj),
      primary: e.name ?? t?.stateObj?.attributes.friendly_name ?? m(this.hass, "person.title"),
      mainEntityId: t?.entityId,
      imageUrl: this.entityImage(t?.stateObj),
      secondary: P([
        D(this.hass, t),
        this.mainStateSegment(t),
        A(this.hass, n)
      ]),
      values: r ? this.bigValues([{ key: "battery", role: r }]) : [],
      customFeatures: o.length ? re(o, (c) => this.fireMoreInfo(c)) : void 0
    });
  }
}
Wn([
  v()
], Dt.prototype, "_config");
S("horos-person-tile", Dt, {
  type: "horos-person-tile",
  name: { ru: "Человек", en: "Person" },
  description: {
    ru: "Дома ли он, где именно и заряд его устройств",
    en: "Whether they are home, where exactly, and their devices' battery"
  },
  preview: !0,
  suggest: (s, e) => {
    if (T(e) !== "person") return null;
    const r = (s.states[e]?.attributes.device_trackers ?? []).map((n) => E(s, B(s, n), "sensor", "battery")).find(Boolean);
    return r ? N("custom:horos-person-tile", {
      person: e,
      battery: r
    }) : null;
  }
});
function Ie(s, e, t) {
  if (!s || !e?.length) return;
  let r, n;
  for (const i of e) {
    const o = p(s, i), c = L(o);
    c !== void 0 && (n === void 0 || (t === "max" ? c > n : c < n)) && (r = o, n = c);
  }
  return r ?? p(s, e[0]);
}
var qn = Object.defineProperty, Vn = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && qn(e, t, n), n;
};
const Kn = [
  "temperature",
  "cpu",
  "memory",
  "gpu",
  "disk"
];
class Ft extends w {
  constructor() {
    super(...arguments), this._bigKeys = ["temperature"];
  }
  static {
    this.styles = [Z, ne];
  }
  /** Level rows under the tile: roughly two per grid row. */
  contentRows() {
    return Math.ceil(4 / 2);
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Sr), document.createElement(
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
    this._bigKeys = J(
      e.big_values,
      "temperature",
      Kn
    ), this.base = e, this._config = e;
  }
  /** The card's roles: the lists are already reduced to their extreme sensor. */
  _roles() {
    const e = this._config;
    return [
      {
        key: "temperature",
        role: Ie(this.hass, e.temperatures, "max")
      },
      { key: "cpu", role: p(this.hass, e.cpu) },
      { key: "memory", role: p(this.hass, e.memory) },
      { key: "gpu", role: p(this.hass, e.gpu) },
      { key: "disk", role: Ie(this.hass, e.disks, "max") }
    ];
  }
  /** The partition with the least free space left. */
  _freeDisk() {
    return Ie(this.hass, this._config?.disks_free, "min");
  }
  _levelRow(e, t) {
    if (!t) return;
    const r = L(t);
    return {
      entityId: t.entityId,
      name: e,
      text: r === void 0 ? m(this.hass, "value.unknown") : `${Math.round(r)}%`,
      ink: xn(r),
      level: r ?? 0,
      alarm: r !== void 0 && r >= 90,
      alarmIcon: "mdi:alert-circle"
    };
  }
  render() {
    if (!this._config || !this.hass) return d;
    const e = this._config, t = this._roles(), r = p(this.hass, e.status), n = (e.sensors ?? []).map((u) => H(u)).map((u) => p(this.hass, u.entity)), i = this.missingRolesWarning([
      r,
      ...t.map((u) => u.role),
      ...n
    ]);
    if (i) return this.renderWarning(i);
    const o = (e.alerts ?? []).map((u) => H(u)).map((u) => ({ alert: u, role: p(this.hass, u.entity) })).filter(({ role: u }) => u?.stateObj?.state === "on").map(({ alert: u, role: g }) => ({
      text: u.name ?? ie(
        g?.stateObj?.attributes.friendly_name,
        e.name
      ) ?? u.entity,
      entityId: u.entity
    })), { big: c } = Q(t, this._bigKeys), a = this._freeDisk(), l = L(a), h = [
      this._levelRow(m(this.hass, "level.cpu"), t[1].role),
      this._levelRow(m(this.hass, "level.memory"), t[2].role),
      this._levelRow(m(this.hass, "level.gpu"), t[3].role),
      this._levelRow(m(this.hass, "level.disk"), t[4].role),
      // Free space is a resource that runs out, so both the colour and the alarm
      // here behave like a battery's, not like load's.
      a ? {
        entityId: a.entityId,
        name: m(this.hass, "level.diskFree"),
        text: l === void 0 ? m(this.hass, "value.unknown") : `${Math.round(l)}%`,
        ink: pe(l),
        level: l ?? 0,
        alarm: l !== void 0 && l < 10,
        alarmIcon: "mdi:harddisk"
      } : void 0
    ].filter((u) => !!u);
    return this.renderTile({
      icon: "mdi:desktop-tower-monitor",
      color: r ? F(r.stateObj) : "var(--state-icon-color)",
      primary: e.name ?? m(this.hass, "computer.title"),
      mainEntityId: r?.entityId ?? t[0].role?.entityId ?? a?.entityId,
      secondary: P([
        D(this.hass, r),
        ...o,
        ...n.map((u) => A(this.hass, u)),
        // Load and disks are already shown as bars with their own labels.
        ...this._bigKeys.includes("temperature") ? [] : [A(this.hass, t[0].role)]
      ]),
      values: this.bigValues(c),
      customFeatures: h.length ? re(h, (u) => this.fireMoreInfo(u)) : void 0
    });
  }
}
Vn([
  v()
], Ft.prototype, "_config");
S("horos-computer-tile", Ft, {
  type: "horos-computer-tile",
  name: { ru: "Компьютер", en: "Computer" },
  description: {
    ru: "Самая горячая точка, загрузка и диски в одной плитке",
    en: "Hottest spot, load and disks in a single tile"
  },
  preview: !0
});
var Gn = Object.defineProperty, Yn = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && Gn(e, t, n), n;
};
const ft = ["pm25", "humidity", "temperature", "power"];
class zt extends w {
  constructor() {
    super(...arguments), this._bigKeys = ["pm25"];
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => xr), document.createElement("horos-air-tile-editor");
  }
  static getStubConfig() {
    return { appliance: "" };
  }
  setConfig(e) {
    if (!e.appliance)
      throw new Error("An appliance is required (appliance)");
    this._bigKeys = J(e.big_values, "pm25", ft), this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return d;
    const e = this._config, t = p(this.hass, e.appliance), r = ft.map((l) => {
      const h = p(this.hass, e[l]);
      if (l === "pm25") {
        const u = L(h);
        if (u !== void 0 && u < 0) return { key: l, role: void 0 };
      }
      return { key: l, role: h };
    }), n = (e.sensors ?? []).map((l) => H(l)).map((l) => p(this.hass, l.entity)), i = this.missingRolesWarning([
      t,
      ...r.map((l) => l.role),
      ...n
    ]);
    if (i) return this.renderWarning(i);
    const o = (e.alerts ?? []).map((l) => H(l)).map((l) => ({ alert: l, role: p(this.hass, l.entity) })).filter(({ role: l }) => l?.stateObj?.state === "on").map(({ alert: l, role: h }) => ({
      text: l.name ?? ie(
        h?.stateObj?.attributes.friendly_name,
        e.name
      ) ?? l.entity,
      entityId: l.entity
    })), { big: c, rest: a } = Q(r, this._bigKeys);
    return this.renderTile({
      icon: e.humidity ? "mdi:air-humidifier" : "mdi:air-filter",
      color: F(t?.stateObj),
      primary: e.name ?? t?.stateObj?.attributes.friendly_name ?? m(this.hass, "air.title"),
      mainEntityId: t?.entityId,
      secondary: P([
        D(this.hass, t),
        ...o,
        this.mainStateSegment(t),
        ...n.map((l) => A(this.hass, l)),
        ...a.map((l) => A(this.hass, l.role))
      ]),
      values: this.bigValues(c)
    });
  }
}
Yn([
  v()
], zt.prototype, "_config");
S("horos-air-tile", zt, {
  type: "horos-air-tile",
  name: { ru: "Воздух", en: "Air" },
  description: {
    ru: "Очиститель, рекуператор, увлажнитель — прибор и что с воздухом",
    en: "Purifier, recuperator, humidifier — the appliance and the air"
  },
  preview: !0,
  suggest: (s, e) => {
    const t = B(s, e), r = {
      appliance: Se(t, "fan", "humidifier"),
      pm25: E(s, t, "sensor", "pm25"),
      humidity: E(s, t, "sensor", "humidity"),
      temperature: E(s, t, "sensor", "temperature"),
      power: E(s, t, "sensor", "power")
    };
    return !r.appliance || Ce(r) < 2 ? null : N("custom:horos-air-tile", r);
  }
});
var Zn = Object.defineProperty, Jn = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && Zn(e, t, n), n;
};
const gt = ["illuminance", "battery"], Qn = 1, Xn = 2, er = 4;
class Bt extends w {
  constructor() {
    super(...arguments), this._bigKeys = ["illuminance"];
  }
  static {
    this.styles = [Z, ne];
  }
  /** Level rows under the tile: roughly two per grid row. */
  contentRows() {
    return Math.ceil(2 / 2);
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Cr), document.createElement(
      "horos-cover-tile-editor"
    );
  }
  static getStubConfig() {
    return { cover: "" };
  }
  setConfig(e) {
    if (!e.cover)
      throw new Error("A cover is required (cover)");
    this._bigKeys = J(e.big_values, "illuminance", gt), this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return d;
    const e = this._config, t = p(this.hass, e.cover), r = p(this.hass, e.position), n = gt.map((y) => ({
      key: y,
      role: p(this.hass, e[y])
    })), i = this.missingRolesWarning([
      t,
      r,
      ...n.map((y) => y.role)
    ]);
    if (i) return this.renderWarning(i);
    const { big: o, rest: c } = Q(n, this._bigKeys), a = Number(
      t?.stateObj?.attributes.supported_features ?? 0
    ), l = (a & er) !== 0, h = (a & (Qn | Xn)) !== 0, u = [];
    e.controls !== !1 && (l && u.push({ type: "cover-position" }), h && u.push({ type: "cover-open-close" }));
    const g = L(r), $ = r && !l ? [
      {
        entityId: r.entityId,
        name: m(this.hass, "level.open"),
        text: g === void 0 ? m(this.hass, "value.unknown") : `${Math.round(g)}%`,
        ink: pe(g),
        level: g ?? 0
      }
    ] : [];
    return this.renderTile({
      icon: "mdi:curtains",
      color: F(t?.stateObj),
      primary: e.name ?? t?.stateObj?.attributes.friendly_name ?? m(this.hass, "cover.title"),
      mainEntityId: t?.entityId,
      secondary: P([
        D(this.hass, t),
        this.mainStateSegment(t),
        ...c.map((y) => A(this.hass, y.role))
      ]),
      values: this.bigValues(o),
      ownFeatures: u.length ? u : void 0,
      customFeatures: $.length ? re($, (y) => this.fireMoreInfo(y)) : void 0
    });
  }
}
Jn([
  v()
], Bt.prototype, "_config");
S("horos-cover-tile", Bt, {
  type: "horos-cover-tile",
  name: { ru: "Шторы", en: "Curtains" },
  description: {
    ru: "Насколько открыты, светло ли снаружи и сколько заряда",
    en: "How far open, how bright outside, and battery"
  },
  preview: !0,
  suggest: (s, e) => {
    const t = B(s, e), r = {
      cover: Se(t, "cover"),
      illuminance: E(s, t, "sensor", "illuminance"),
      battery: E(s, t, "sensor", "battery")
    };
    return !r.cover || Ce(r) < 2 ? null : N("custom:horos-cover-tile", r);
  }
});
const tr = [
  "update",
  "select",
  "text",
  "button",
  "number",
  "event",
  "notify"
];
function sr(s, e = {}) {
  if (!s) return [];
  const t = new Set(e.ignore ?? []), r = new Set(
    e.ignoreDomains ?? tr
  ), n = /* @__PURE__ */ new Map();
  for (const [i, o] of Object.entries(s.states)) {
    if (!o || o.state !== "unavailable" || t.has(i) || r.has(i.split(".")[0])) continue;
    const c = s.entities?.[i];
    if (c?.hidden) continue;
    const a = c?.device_id ? s.devices?.[c.device_id] : void 0, l = a?.name_by_user ?? a?.name ?? o.attributes.friendly_name ?? i, h = c?.device_id ?? i, u = n.get(h);
    u ? u.count += 1 : n.set(h, { name: l, count: 1, entityId: i });
  }
  return [...n.values()].sort(
    (i, o) => o.count - i.count || i.name.localeCompare(o.name)
  );
}
var nr = Object.defineProperty, rr = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && nr(e, t, n), n;
};
const ir = 4;
class Wt extends w {
  static async getConfigElement() {
    return await Promise.resolve().then(() => Ar), document.createElement(
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
    if (!this._config || !this.hass) return d;
    const e = this._config, t = sr(this.hass, {
      ignore: e.ignore,
      ignoreDomains: e.ignore_domains
    }), r = e.limit ?? ir, n = t.slice(0, r), i = t.length - n.length;
    return this.renderTile({
      icon: t.length ? "mdi:lan-disconnect" : "mdi:lan-check",
      color: t.length ? "var(--warning-color, #ffa600)" : "var(--success-color, #43a047)",
      primary: e.name ?? m(this.hass, "offline.title"),
      mainEntityId: t[0]?.entityId,
      secondary: P(
        t.length ? [
          ...n.map((o) => ({
            text: o.count > 1 ? `${o.name} (${o.count})` : o.name,
            entityId: o.entityId
          })),
          i > 0 ? { text: m(this.hass, "offline.more", { count: i }) } : void 0
        ] : [{ text: m(this.hass, "offline.allAnswer") }]
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
rr([
  v()
], Wt.prototype, "_config");
S("horos-offline-tile", Wt, {
  type: "horos-offline-tile",
  name: { ru: "Не отвечает", en: "Not responding" },
  description: {
    ru: "Что перестало отвечать, посчитанное по устройствам",
    en: "Devices that went silent, grouped by device"
  },
  preview: !0
});
var or = Object.defineProperty, ar = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && or(e, t, n), n;
};
const lr = 5;
class qt extends w {
  static {
    this.styles = [Z, ne];
  }
  /** Level rows under the tile: roughly two per grid row. */
  contentRows() {
    return Math.ceil(Math.min(this._config?.consumers.length ?? 0, this._config?.limit ?? 5) / 2);
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Or), document.createElement(
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
    if (!this._config || !this.hass) return d;
    const e = this._config, t = p(this.hass, e.total), r = [], n = [], i = [];
    for (const h of e.consumers) {
      const u = H(h), g = p(this.hass, u.entity);
      if (g?.missing) {
        r.push(u.entity);
        continue;
      }
      const $ = u.name ?? ie(g?.stateObj?.attributes.friendly_name, e.name) ?? u.entity;
      if (g?.unavailable) {
        n.push($);
        continue;
      }
      const y = L(g);
      y === void 0 || y <= 0 || i.push({
        watts: y,
        row: {
          entityId: u.entity,
          name: $,
          text: this.hass.formatEntityState(g.stateObj),
          ink: u.color ?? "var(--amber-color, #ffc107)"
        }
      });
    }
    i.sort((h, u) => u.watts - h.watts);
    const o = i.slice(0, e.limit ?? lr), c = o[0]?.watts ?? 0, a = o.map(({ row: h, watts: u }) => ({
      ...h,
      level: c > 0 ? u / c * 100 : 0
    })), l = [
      D(this.hass, t),
      i.length ? { text: m(this.hass, "energy.consuming", { count: i.length }) } : { text: m(this.hass, "energy.idle") },
      n.length ? { text: m(this.hass, "offline.count", { count: n.length }) } : void 0,
      r.length ? { text: m(this.hass, "list.missing", { count: r.length }) } : void 0
    ];
    return this.renderTile({
      icon: "mdi:flash",
      color: "var(--amber-color, #ffc107)",
      primary: e.name ?? m(this.hass, "energy.title"),
      mainEntityId: t?.entityId ?? o[0]?.row.entityId,
      secondary: P([this.mainStateSegment(t), ...l]),
      values: t ? this.bigValues([{ key: "total", role: t }]) : [],
      customFeatures: a.length ? re(a, (h) => this.fireMoreInfo(h)) : void 0
    });
  }
}
ar([
  v()
], qt.prototype, "_config");
S("horos-energy-tile", qt, {
  type: "horos-energy-tile",
  name: { ru: "Энергия", en: "Energy" },
  description: {
    ru: "Кто в доме ест электричество, от самого прожорливого",
    en: "Who in the house draws power, hungriest first"
  },
  preview: !0,
  suggest: (s, e) => T(e) !== "sensor" || X(s, e) !== "power" ? null : N(
    "custom:horos-energy-tile",
    {},
    {
      consumers: xe(s, e, "sensor", ["power"], 12),
      limit: 6
    }
  )
});
var cr = Object.defineProperty, ur = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && cr(e, t, n), n;
};
class Vt extends w {
  static async getConfigElement() {
    return await Promise.resolve().then(() => kr), document.createElement(
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
    if (!this._config || !this.hass) return d;
    const e = this._config, t = [], r = [];
    let n = 0, i = 0;
    for (const o of e.areas) {
      const c = H(o), a = p(this.hass, c.entity);
      if (a?.missing) {
        r.push(c.entity);
        continue;
      }
      if (i += 1, a?.unavailable) {
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
      primary: e.name ?? m(this.hass, "presence.title"),
      mainEntityId: t[0]?.entityId,
      secondary: P([
        ...t.length ? t : [{ text: m(this.hass, "presence.empty", { count: i }) }],
        n ? { text: m(this.hass, "offline.count", { count: n }) } : void 0,
        r.length ? { text: m(this.hass, "list.missing", { count: r.length }) } : void 0
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
ur([
  v()
], Vt.prototype, "_config");
S("horos-presence-tile", Vt, {
  type: "horos-presence-tile",
  name: { ru: "Присутствие", en: "Presence" },
  description: {
    ru: "В каких зонах сейчас есть кто-то",
    en: "Which areas have someone in them right now"
  },
  preview: !0,
  suggest: (s, e) => {
    const t = ["occupancy", "presence", "motion"];
    return T(e) !== "binary_sensor" || !t.includes(X(s, e) ?? "") ? null : N(
      "custom:horos-presence-tile",
      {},
      { areas: xe(s, e, "binary_sensor", t, 12) }
    );
  }
});
console.info(
  "%c HOROS-CARDS %c 0.1.0 ",
  "background:#03a9f4;color:#fff;border-radius:3px 0 0 3px;padding:2px 4px",
  "background:#555;color:#fff;border-radius:0 3px 3px 0;padding:2px 4px"
);
var hr = Object.defineProperty, We = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && hr(e, t, n), n;
};
class Oe extends K {
  constructor() {
    super(...arguments), this._computeHelper = (e) => e.name === "color" ? this.pick({
      ru: {
        color: "Неактивное состояние (например, off или closed) окрашено не будет."
      },
      en: {
        color: "Inactive state (for example, off or closed) will not be coloured."
      }
    }).color : void 0, this._computeLabel = (e) => this.labels[e.name] ?? this.pick({ ru: j, en: R })[e.name] ?? e.name;
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
    return b(this.hass) === "ru" ? e.ru : e.en;
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
    return !this.hass || !this._config ? d : _`
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
We([
  Ee({ attribute: !1 })
], Oe.prototype, "hass");
We([
  v()
], Oe.prototype, "_config");
class C extends Oe {
  constructor() {
    super(...arguments), this._featuresEditorReady = !1;
  }
  connectedCallback() {
    super.connectedCallback(), en().then((e) => {
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
    if (!e) return d;
    const t = this._config?.features ?? [], r = this.pick({ ru: j, en: R }), n = this.pick({
      ru: { bottom: "Снизу", inline: "В строке" },
      en: { bottom: "Bottom", inline: "Inline" }
    });
    return _`
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
          ${t.length ? _`
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
              ` : d}
        </div>
      </ha-expansion-panel>
    `;
  }
  render() {
    return !this.hass || !this._config ? d : _`
      ${this.renderForm()}
      ${this._featuresEditorReady ? this._renderFeatures() : d}
    `;
  }
}
We([
  v()
], C.prototype, "_featuresEditorReady");
const I = (s, e, t = []) => ({
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
}), Me = (s) => s ? { entity_id: s, area_id: "area" } : void 0, M = (s, e) => ({
  name: "interactions",
  type: "expandable",
  flatten: !0,
  icon: "mdi:gesture-tap",
  schema: [
    {
      name: "tap_action",
      selector: { ui_action: { default_action: "more-info" } },
      context: Me(s)
    },
    { name: "", type: "divider" },
    {
      name: "icon_tap_action",
      selector: { ui_action: { default_action: e } },
      context: Me(s)
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
        context: Me(s)
      }))
    }
  ]
}), j = {
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
}, R = {
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
}, f = (s, e) => ({
  entity: {
    filter: e ? { domain: s, device_class: e } : { domain: s }
  }
}), Y = (s, e, t) => ({
  number: { min: s, max: e, mode: "box", unit_of_measurement: t }
}), dr = { text: {} }, oe = (s) => ({
  select: { multiple: !0, mode: "list", options: s }
}), mr = { boolean: {} };
class Kt extends C {
  get entityField() {
    return "temperature";
  }
  get schema() {
    const e = b(this.hass);
    return [
      {
        name: "temperature",
        required: !0,
        selector: f("sensor", "temperature")
      },
      { name: "humidity", selector: f("sensor", "humidity") },
      {
        name: "illuminance",
        selector: f("sensor", "illuminance")
      },
      { name: "pm25", selector: f("sensor", "pm25") },
      I("temperature", e, [
        {
          name: "big_values",
          selector: oe([
            { value: "temperature", label: e === "ru" ? "Температура" : "Temperature" },
            { value: "humidity", label: e === "ru" ? "Влажность" : "Humidity" },
            { value: "illuminance", label: e === "ru" ? "Освещённость" : "Illuminance" },
            { value: "pm25", label: "PM2.5" }
          ])
        }
      ]),
      M("temperature", "none")
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
x("horos-climate-tile-editor", Kt);
const pr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosClimateTileEditor: Kt
}, Symbol.toStringTag, { value: "Module" }));
class Gt extends C {
  get entityField() {
    return "switch";
  }
  get schema() {
    const e = b(this.hass);
    return [
      { name: "switch", required: !0, selector: f("switch") },
      { name: "power", selector: f("sensor", "power") },
      { name: "energy", selector: f("sensor", "energy") },
      { name: "toggle_button", selector: mr },
      I("switch", e, [
        {
          name: "big_values",
          selector: oe([
            { value: "power", label: e === "ru" ? "Мощность" : "Power" },
            { value: "energy", label: e === "ru" ? "Энергия" : "Energy" },
            { value: "switch", label: e === "ru" ? "Состояние" : "State" }
          ])
        }
      ]),
      M("switch", "toggle")
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
x("horos-plug-tile-editor", Gt);
const fr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosPlugTileEditor: Gt
}, Symbol.toStringTag, { value: "Module" }));
class Yt extends C {
  get entityField() {
    return "moisture";
  }
  get schema() {
    const e = b(this.hass);
    return [
      {
        name: "moisture",
        required: !0,
        selector: f("sensor", "moisture")
      },
      {
        name: "temperature",
        selector: f("sensor", "temperature")
      },
      { name: "battery", selector: f("sensor", "battery") },
      { name: "dry_below", selector: Y(0, 100, "%") },
      { name: "wet_above", selector: Y(0, 100, "%") },
      I("moisture", e, [
        {
          name: "big_values",
          selector: oe([
            { value: "moisture", label: e === "ru" ? "Влажность почвы" : "Soil moisture" },
            { value: "temperature", label: e === "ru" ? "Температура почвы" : "Soil temperature" },
            { value: "battery", label: e === "ru" ? "Заряд датчика" : "Sensor battery" }
          ])
        }
      ]),
      M("moisture", "none")
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
x("horos-plant-tile-editor", Yt);
const gr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosPlantTileEditor: Yt
}, Symbol.toStringTag, { value: "Module" }));
function O(s, e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of s ?? [])
    t.set(typeof r == "string" ? r : r.entity, r);
  return e.map((r) => t.get(r) ?? r);
}
function k(s) {
  return (s ?? []).map(
    (e) => typeof e == "string" ? e : e.entity
  );
}
class Zt extends Oe {
  get schema() {
    return [
      { name: "name", selector: dr },
      { name: "icon", selector: { icon: {} } },
      { name: "columns", selector: Y(1, 6) },
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
        ...j,
        name: "Заголовок",
        columns: "Кнопок в ряд",
        buttons: "Кнопки"
      },
      en: {
        ...R,
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
      buttons: k(e.buttons)
    };
  }
  fromForm(e) {
    return {
      ...e,
      buttons: O(
        this._config?.buttons,
        e.buttons ?? []
      )
    };
  }
}
x("horos-buttons-tile-editor", Zt);
const _r = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosButtonsTileEditor: Zt
}, Symbol.toStringTag, { value: "Module" }));
class Jt extends C {
  get entityField() {
    return "status";
  }
  get schema() {
    const e = b(this.hass);
    return [
      { name: "icon", selector: { icon: {} } },
      { name: "status", selector: f("sensor") },
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
      I("status", e),
      M("status", "none")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...j,
        name: "Название принтера",
        status: "Состояние принтера",
        cartridges: "Картриджи",
        low_below: "Мало чернил ниже",
        sensors: "Прочее про принтер"
      },
      en: {
        ...R,
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
      cartridges: k(
        e.cartridges
      ),
      sensors: k(e.sensors)
    };
  }
  fromForm(e) {
    return {
      ...e,
      cartridges: O(
        this._config?.cartridges,
        e.cartridges ?? []
      ),
      sensors: O(
        this._config?.sensors,
        e.sensors ?? []
      )
    };
  }
}
x("horos-printer-tile-editor", Jt);
const vr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosPrinterTileEditor: Jt
}, Symbol.toStringTag, { value: "Module" }));
class Qt extends C {
  get entityField() {
    return "vacuum";
  }
  get schema() {
    const e = b(this.hass);
    return [
      { name: "vacuum", required: !0, selector: f("vacuum") },
      { name: "battery", selector: f("sensor", "battery") },
      { name: "sensors", selector: { entity: { multiple: !0 } } },
      { name: "consumables", selector: { entity: { multiple: !0 } } },
      { name: "low_below", selector: Y(0, 100, "%") },
      I("vacuum", e),
      M("vacuum", "none")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...j,
        name: "Название",
        vacuum: "Пылесос",
        battery: "Заряд",
        sensors: "Что ещё сказать",
        consumables: "Расходники",
        low_below: "Просит замены ниже"
      },
      en: {
        ...R,
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
      sensors: k(e.sensors),
      consumables: k(e.consumables)
    };
  }
  fromForm(e) {
    return {
      ...e,
      sensors: O(
        this._config?.sensors,
        e.sensors ?? []
      ),
      consumables: O(
        this._config?.consumables,
        e.consumables ?? []
      )
    };
  }
}
x("horos-vacuum-tile-editor", Qt);
const yr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosVacuumTileEditor: Qt
}, Symbol.toStringTag, { value: "Module" }));
class Xt extends C {
  get entityField() {
  }
  get schema() {
    const e = b(this.hass);
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
      { name: "low_below", selector: Y(0, 100, "%") },
      I(void 0, e),
      M(void 0, "none")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...j,
        name: "Название",
        batteries: "Батарейки",
        low_below: "Показывать ниже"
      },
      en: {
        ...R,
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
      batteries: k(e.batteries)
    };
  }
  fromForm(e) {
    return {
      ...e,
      batteries: O(
        this._config?.batteries,
        e.batteries ?? []
      )
    };
  }
}
x("horos-batteries-tile-editor", Xt);
const br = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosBatteriesTileEditor: Xt
}, Symbol.toStringTag, { value: "Module" }));
class es extends C {
  get entityField() {
  }
  get schema() {
    const e = b(this.hass);
    return [
      {
        name: "sensors",
        required: !0,
        selector: { entity: { multiple: !0, filter: [{ domain: "binary_sensor" }] } }
      },
      I(void 0, e),
      M(void 0, "none")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...j,
        name: "Название",
        sensors: "Датчики"
      },
      en: {
        ...R,
        name: "Name",
        sensors: "Sensors"
      }
    });
  }
  get formData() {
    const e = this._config ?? {};
    return {
      ...e,
      sensors: k(e.sensors)
    };
  }
  fromForm(e) {
    return {
      ...e,
      sensors: O(
        this._config?.sensors,
        e.sensors ?? []
      )
    };
  }
}
x("horos-safety-tile-editor", es);
const wr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosSafetyTileEditor: es
}, Symbol.toStringTag, { value: "Module" }));
class ts extends C {
  get entityField() {
    return "status";
  }
  get schema() {
    const e = b(this.hass);
    return [
      { name: "status", selector: { entity: {} } },
      { name: "disk", selector: f("sensor", "data_size") },
      { name: "download", selector: f("sensor", "data_rate") },
      { name: "upload", selector: f("sensor", "data_rate") },
      { name: "services", selector: { entity: { multiple: !0 } } },
      I("status", e),
      M("status", "none")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...j,
        name: "Название",
        status: "Состояние",
        disk: "Свободное место",
        download: "Скорость приёма",
        upload: "Скорость отдачи",
        services: "Что ещё сказать"
      },
      en: {
        ...R,
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
      services: k(e.services)
    };
  }
  fromForm(e) {
    return {
      ...e,
      services: O(
        this._config?.services,
        e.services ?? []
      )
    };
  }
}
x("horos-server-tile-editor", ts);
const $r = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosServerTileEditor: ts
}, Symbol.toStringTag, { value: "Module" }));
class ss extends C {
  get entityField() {
    return "person";
  }
  get schema() {
    const e = b(this.hass);
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
      { name: "battery", selector: f("sensor", "battery") },
      { name: "location", selector: f("sensor") },
      {
        name: "devices",
        selector: {
          entity: {
            multiple: !0,
            filter: [{ domain: "sensor", device_class: "battery" }]
          }
        }
      },
      I("person", e),
      M("person", "none")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...j,
        name: "Имя",
        person: "Человек",
        battery: "Заряд основного устройства",
        location: "Где именно",
        devices: "Остальные устройства"
      },
      en: {
        ...R,
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
      devices: k(e.devices)
    };
  }
  fromForm(e) {
    return {
      ...e,
      devices: O(
        this._config?.devices,
        e.devices ?? []
      )
    };
  }
}
x("horos-person-tile-editor", ss);
const Er = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosPersonTileEditor: ss
}, Symbol.toStringTag, { value: "Module" }));
class ns extends C {
  get entityField() {
    return "status";
  }
  get schema() {
    const e = b(this.hass);
    return [
      { name: "status", selector: { entity: {} } },
      { name: "cpu", selector: f("sensor") },
      { name: "memory", selector: f("sensor") },
      { name: "gpu", selector: f("sensor") },
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
      I("status", e, [
        {
          name: "big_values",
          selector: oe([
            { value: "temperature", label: e === "ru" ? "Самая горячая точка" : "Hottest spot" },
            { value: "cpu", label: e === "ru" ? "Процессор" : "CPU" },
            { value: "memory", label: e === "ru" ? "Память" : "Memory" },
            { value: "gpu", label: e === "ru" ? "Видеокарта" : "GPU" },
            { value: "disk", label: e === "ru" ? "Самый полный диск" : "Fullest disk" }
          ])
        }
      ]),
      M("status", "none")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...j,
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
        ...R,
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
      sensors: k(e.sensors),
      alerts: k(e.alerts)
    };
  }
  fromForm(e) {
    return {
      ...e,
      sensors: O(
        this._config?.sensors,
        e.sensors ?? []
      ),
      alerts: O(
        this._config?.alerts,
        e.alerts ?? []
      )
    };
  }
}
x("horos-computer-tile-editor", ns);
const Sr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosComputerTileEditor: ns
}, Symbol.toStringTag, { value: "Module" }));
class rs extends C {
  get entityField() {
    return "appliance";
  }
  get schema() {
    const e = b(this.hass);
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
      { name: "pm25", selector: f("sensor", "pm25") },
      { name: "humidity", selector: f("sensor", "humidity") },
      { name: "temperature", selector: f("sensor", "temperature") },
      { name: "power", selector: f("sensor", "power") },
      { name: "sensors", selector: { entity: { multiple: !0 } } },
      {
        name: "alerts",
        selector: { entity: { multiple: !0, filter: [{ domain: "binary_sensor" }] } }
      },
      I("appliance", e, [
        {
          name: "big_values",
          selector: oe([
            { value: "pm25", label: "PM2.5" },
            { value: "humidity", label: e === "ru" ? "Влажность" : "Humidity" },
            { value: "temperature", label: e === "ru" ? "Температура" : "Temperature" },
            { value: "power", label: e === "ru" ? "Мощность" : "Power" }
          ])
        }
      ]),
      M("appliance", "toggle")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...j,
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
        ...R,
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
      sensors: k(e.sensors),
      alerts: k(e.alerts)
    };
  }
  fromForm(e) {
    return {
      ...e,
      sensors: O(
        this._config?.sensors,
        e.sensors ?? []
      ),
      alerts: O(
        this._config?.alerts,
        e.alerts ?? []
      )
    };
  }
}
x("horos-air-tile-editor", rs);
const xr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosAirTileEditor: rs
}, Symbol.toStringTag, { value: "Module" }));
class is extends C {
  get entityField() {
    return "cover";
  }
  get schema() {
    const e = b(this.hass);
    return [
      { name: "cover", required: !0, selector: f("cover") },
      { name: "position", selector: f("sensor") },
      { name: "illuminance", selector: f("sensor", "illuminance") },
      { name: "battery", selector: f("sensor", "battery") },
      { name: "controls", selector: { boolean: {} } },
      I("cover", e, [
        {
          name: "big_values",
          selector: oe([
            { value: "illuminance", label: e === "ru" ? "Освещённость" : "Illuminance" },
            { value: "battery", label: e === "ru" ? "Заряд" : "Battery" }
          ])
        }
      ]),
      M("cover", "none")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...j,
        name: "Название",
        cover: "Штора",
        position: "Насколько открыто",
        illuminance: "Освещённость",
        battery: "Заряд",
        controls: "Кнопки управления",
        big_values: "Крупно справа (не больше трёх)"
      },
      en: {
        ...R,
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
x("horos-cover-tile-editor", is);
const Cr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosCoverTileEditor: is
}, Symbol.toStringTag, { value: "Module" }));
class os extends C {
  get entityField() {
  }
  get schema() {
    const e = b(this.hass);
    return [
      { name: "limit", selector: Y(1, 12) },
      { name: "ignore", selector: { entity: { multiple: !0 } } },
      I(void 0, e),
      M(void 0, "none")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...j,
        limit: "Сколько устройств называть",
        ignore: "Молчание этих — норма"
      },
      en: {
        ...R,
        limit: "How many devices to name",
        ignore: "Silence of these is normal"
      }
    });
  }
}
x("horos-offline-tile-editor", os);
const Ar = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosOfflineTileEditor: os
}, Symbol.toStringTag, { value: "Module" }));
class as extends C {
  get entityField() {
    return "total";
  }
  get schema() {
    const e = b(this.hass);
    return [
      { name: "total", selector: f("sensor", "power") },
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
      { name: "limit", selector: Y(1, 12) },
      I("total", e),
      M("total", "none")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...j,
        name: "Название",
        total: "Общая мощность",
        consumers: "Потребители",
        limit: "Сколько показывать"
      },
      en: {
        ...R,
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
      consumers: k(e.consumers)
    };
  }
  fromForm(e) {
    return {
      ...e,
      consumers: O(
        this._config?.consumers,
        e.consumers ?? []
      )
    };
  }
}
x("horos-energy-tile-editor", as);
const Or = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosEnergyTileEditor: as
}, Symbol.toStringTag, { value: "Module" }));
class ls extends C {
  get entityField() {
  }
  get schema() {
    const e = b(this.hass);
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
      I(void 0, e),
      M(void 0, "none")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...j,
        name: "Название",
        areas: "Зоны"
      },
      en: {
        ...R,
        name: "Name",
        areas: "Areas"
      }
    });
  }
  get formData() {
    const e = this._config ?? {};
    return {
      ...e,
      areas: k(e.areas)
    };
  }
  fromForm(e) {
    return {
      ...e,
      areas: O(
        this._config?.areas,
        e.areas ?? []
      )
    };
  }
}
x("horos-presence-tile-editor", ls);
const kr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosPresenceTileEditor: ls
}, Symbol.toStringTag, { value: "Module" }));
