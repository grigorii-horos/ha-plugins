/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ee = globalThis, Fe = Ee.ShadowRoot && (Ee.ShadyCSS === void 0 || Ee.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, De = Symbol(), Xe = /* @__PURE__ */ new WeakMap();
let Ct = class {
  constructor(e, t, r) {
    if (this._$cssResult$ = !0, r !== De) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (Fe && e === void 0) {
      const r = t !== void 0 && t.length === 1;
      r && (e = Xe.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && Xe.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const ks = (s) => new Ct(typeof s == "string" ? s : s + "", void 0, De), ze = (s, ...e) => {
  const t = s.length === 1 ? s[0] : e.reduce((r, n, i) => r + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + s[i + 1], s[0]);
  return new Ct(t, s, De);
}, As = (s, e) => {
  if (Fe) s.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const r = document.createElement("style"), n = Ee.litNonce;
    n !== void 0 && r.setAttribute("nonce", n), r.textContent = t.cssText, s.appendChild(r);
  }
}, Qe = Fe ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const r of e.cssRules) t += r.cssText;
  return ks(t);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Os, defineProperty: Ts, getOwnPropertyDescriptor: Ps, getOwnPropertyNames: Is, getOwnPropertySymbols: js, getPrototypeOf: Ms } = Object, ke = globalThis, et = ke.trustedTypes, Rs = et ? et.emptyScript : "", Hs = ke.reactiveElementPolyfillSupport, ue = (s, e) => s, xe = { toAttribute(s, e) {
  switch (e) {
    case Boolean:
      s = s ? Rs : null;
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
} }, We = (s, e) => !Os(s, e), tt = { attribute: !0, type: String, converter: xe, reflect: !1, useDefault: !1, hasChanged: We };
Symbol.metadata ??= Symbol("metadata"), ke.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let ie = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = tt) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const r = Symbol(), n = this.getPropertyDescriptor(e, r, t);
      n !== void 0 && Ts(this.prototype, e, n);
    }
  }
  static getPropertyDescriptor(e, t, r) {
    const { get: n, set: i } = Ps(this.prototype, e) ?? { get() {
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
    return this.elementProperties.get(e) ?? tt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(ue("elementProperties"))) return;
    const e = Ms(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(ue("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(ue("properties"))) {
      const t = this.properties, r = [...Is(t), ...js(t)];
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
      for (const n of r) t.unshift(Qe(n));
    } else e !== void 0 && t.push(Qe(e));
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
    return As(e, this.constructor.elementStyles), e;
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
      const i = (r.converter?.toAttribute !== void 0 ? r.converter : xe).toAttribute(t, r.type);
      this._$Em = e, i == null ? this.removeAttribute(n) : this.setAttribute(n, i), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const r = this.constructor, n = r._$Eh.get(e);
    if (n !== void 0 && this._$Em !== n) {
      const i = r.getPropertyOptions(n), o = typeof i.converter == "function" ? { fromAttribute: i.converter } : i.converter?.fromAttribute !== void 0 ? i.converter : xe;
      this._$Em = n;
      const l = o.fromAttribute(t, i.type);
      this[n] = l ?? this._$Ej?.get(n) ?? l, this._$Em = null;
    }
  }
  requestUpdate(e, t, r, n = !1, i) {
    if (e !== void 0) {
      const o = this.constructor;
      if (n === !1 && (i = this[e]), r ??= o.getPropertyOptions(e), !((r.hasChanged ?? We)(i, t) || r.useDefault && r.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(o._$Eu(e, r)))) return;
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
ie.elementStyles = [], ie.shadowRootOptions = { mode: "open" }, ie[ue("elementProperties")] = /* @__PURE__ */ new Map(), ie[ue("finalized")] = /* @__PURE__ */ new Map(), Hs?.({ ReactiveElement: ie }), (ke.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Be = globalThis, st = (s) => s, Ce = Be.trustedTypes, nt = Ce ? Ce.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, kt = "$lit$", V = `lit$${Math.random().toFixed(9).slice(2)}$`, At = "?" + V, Ns = `<${At}>`, se = document, he = () => se.createComment(""), de = (s) => s === null || typeof s != "object" && typeof s != "function", qe = Array.isArray, Us = (s) => qe(s) || typeof s?.[Symbol.iterator] == "function", He = `[ 	
\f\r]`, ce = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, rt = /-->/g, it = />/g, X = RegExp(`>|${He}(?:([^\\s"'>=/]+)(${He}*=${He}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ot = /'/g, at = /"/g, Ot = /^(?:script|style|textarea|title)$/i, Ls = (s) => (e, ...t) => ({ _$litType$: s, strings: e, values: t }), v = Ls(1), oe = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), lt = /* @__PURE__ */ new WeakMap(), ee = se.createTreeWalker(se, 129);
function Tt(s, e) {
  if (!qe(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return nt !== void 0 ? nt.createHTML(e) : e;
}
const Fs = (s, e) => {
  const t = s.length - 1, r = [];
  let n, i = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = ce;
  for (let l = 0; l < t; l++) {
    const a = s[l];
    let c, h, u = -1, f = 0;
    for (; f < a.length && (o.lastIndex = f, h = o.exec(a), h !== null); ) f = o.lastIndex, o === ce ? h[1] === "!--" ? o = rt : h[1] !== void 0 ? o = it : h[2] !== void 0 ? (Ot.test(h[2]) && (n = RegExp("</" + h[2], "g")), o = X) : h[3] !== void 0 && (o = X) : o === X ? h[0] === ">" ? (o = n ?? ce, u = -1) : h[1] === void 0 ? u = -2 : (u = o.lastIndex - h[2].length, c = h[1], o = h[3] === void 0 ? X : h[3] === '"' ? at : ot) : o === at || o === ot ? o = X : o === rt || o === it ? o = ce : (o = X, n = void 0);
    const x = o === X && s[l + 1].startsWith("/>") ? " " : "";
    i += o === ce ? a + Ns : u >= 0 ? (r.push(c), a.slice(0, u) + kt + a.slice(u) + V + x) : a + V + (u === -2 ? l : x);
  }
  return [Tt(s, i + (s[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), r];
};
class me {
  constructor({ strings: e, _$litType$: t }, r) {
    let n;
    this.parts = [];
    let i = 0, o = 0;
    const l = e.length - 1, a = this.parts, [c, h] = Fs(e, t);
    if (this.el = me.createElement(c, r), ee.currentNode = this.el.content, t === 2 || t === 3) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (n = ee.nextNode()) !== null && a.length < l; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const u of n.getAttributeNames()) if (u.endsWith(kt)) {
          const f = h[o++], x = n.getAttribute(u).split(V), b = /([.?@])?(.*)/.exec(f);
          a.push({ type: 1, index: i, name: b[2], strings: x, ctor: b[1] === "." ? zs : b[1] === "?" ? Ws : b[1] === "@" ? Bs : Ae }), n.removeAttribute(u);
        } else u.startsWith(V) && (a.push({ type: 6, index: i }), n.removeAttribute(u));
        if (Ot.test(n.tagName)) {
          const u = n.textContent.split(V), f = u.length - 1;
          if (f > 0) {
            n.textContent = Ce ? Ce.emptyScript : "";
            for (let x = 0; x < f; x++) n.append(u[x], he()), ee.nextNode(), a.push({ type: 2, index: ++i });
            n.append(u[f], he());
          }
        }
      } else if (n.nodeType === 8) if (n.data === At) a.push({ type: 2, index: i });
      else {
        let u = -1;
        for (; (u = n.data.indexOf(V, u + 1)) !== -1; ) a.push({ type: 7, index: i }), u += V.length - 1;
      }
      i++;
    }
  }
  static createElement(e, t) {
    const r = se.createElement("template");
    return r.innerHTML = e, r;
  }
}
function ae(s, e, t = s, r) {
  if (e === oe) return e;
  let n = r !== void 0 ? t._$Co?.[r] : t._$Cl;
  const i = de(e) ? void 0 : e._$litDirective$;
  return n?.constructor !== i && (n?._$AO?.(!1), i === void 0 ? n = void 0 : (n = new i(s), n._$AT(s, t, r)), r !== void 0 ? (t._$Co ??= [])[r] = n : t._$Cl = n), n !== void 0 && (e = ae(s, n._$AS(s, e.values), n, r)), e;
}
class Ds {
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
    const { el: { content: t }, parts: r } = this._$AD, n = (e?.creationScope ?? se).importNode(t, !0);
    ee.currentNode = n;
    let i = ee.nextNode(), o = 0, l = 0, a = r[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let c;
        a.type === 2 ? c = new pe(i, i.nextSibling, this, e) : a.type === 1 ? c = new a.ctor(i, a.name, a.strings, this, e) : a.type === 6 && (c = new qs(i, this, e)), this._$AV.push(c), a = r[++l];
      }
      o !== a?.index && (i = ee.nextNode(), o++);
    }
    return ee.currentNode = se, n;
  }
  p(e) {
    let t = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, t), t += r.strings.length - 2) : r._$AI(e[t])), t++;
  }
}
class pe {
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
    e = ae(this, e, t), de(e) ? e === d || e == null || e === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : e !== this._$AH && e !== oe && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Us(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== d && de(this._$AH) ? this._$AA.nextSibling.data = e : this.T(se.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: r } = e, n = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = me.createElement(Tt(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === n) this._$AH.p(t);
    else {
      const i = new Ds(n, this), o = i.u(this.options);
      i.p(t), this.T(o), this._$AH = i;
    }
  }
  _$AC(e) {
    let t = lt.get(e.strings);
    return t === void 0 && lt.set(e.strings, t = new me(e)), t;
  }
  k(e) {
    qe(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let r, n = 0;
    for (const i of e) n === t.length ? t.push(r = new pe(this.O(he()), this.O(he()), this, this.options)) : r = t[n], r._$AI(i), n++;
    n < t.length && (this._$AR(r && r._$AB.nextSibling, n), t.length = n);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const r = st(e).nextSibling;
      st(e).remove(), e = r;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class Ae {
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
    if (i === void 0) e = ae(this, e, t, 0), o = !de(e) || e !== this._$AH && e !== oe, o && (this._$AH = e);
    else {
      const l = e;
      let a, c;
      for (e = i[0], a = 0; a < i.length - 1; a++) c = ae(this, l[r + a], t, a), c === oe && (c = this._$AH[a]), o ||= !de(c) || c !== this._$AH[a], c === d ? e = d : e !== d && (e += (c ?? "") + i[a + 1]), this._$AH[a] = c;
    }
    o && !n && this.j(e);
  }
  j(e) {
    e === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class zs extends Ae {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === d ? void 0 : e;
  }
}
class Ws extends Ae {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== d);
  }
}
class Bs extends Ae {
  constructor(e, t, r, n, i) {
    super(e, t, r, n, i), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = ae(this, e, t, 0) ?? d) === oe) return;
    const r = this._$AH, n = e === d && r !== d || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, i = e !== d && (r === d || n);
    n && this.element.removeEventListener(this.name, this, r), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class qs {
  constructor(e, t, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    ae(this, e);
  }
}
const Vs = Be.litHtmlPolyfillSupport;
Vs?.(me, pe), (Be.litHtmlVersions ??= []).push("3.3.3");
const Ks = (s, e, t) => {
  const r = t?.renderBefore ?? e;
  let n = r._$litPart$;
  if (n === void 0) {
    const i = t?.renderBefore ?? null;
    r._$litPart$ = n = new pe(e.insertBefore(he(), i), i, void 0, t ?? {});
  }
  return n._$AI(s), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ve = globalThis;
class te extends ie {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ks(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return oe;
  }
}
te._$litElement$ = !0, te.finalized = !0, Ve.litElementHydrateSupport?.({ LitElement: te });
const Gs = Ve.litElementPolyfillSupport;
Gs?.({ LitElement: te });
(Ve.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ys = { attribute: !0, type: String, converter: xe, reflect: !1, hasChanged: We }, Zs = (s = Ys, e, t) => {
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
function Oe(s) {
  return (e, t) => typeof t == "object" ? Zs(s, e, t) : ((r, n, i) => {
    const o = n.hasOwnProperty(i);
    return n.constructor.createProperty(i, r), o ? Object.getOwnPropertyDescriptor(n, i) : void 0;
  })(s, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function _(s) {
  return Oe({ ...s, state: !0, attribute: !1 });
}
const z = ze`
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
`, Pt = /* @__PURE__ */ new Set(["unavailable", "unknown"]), Js = " · ";
function p(s, e) {
  if (!e) return;
  const t = s?.states[e];
  return {
    entityId: e,
    stateObj: t,
    missing: !t,
    unavailable: !!t && Pt.has(t.state)
  };
}
function Xs(s, e) {
  if (!(!s || !e || !e.stateObj || e.missing || e.unavailable))
    return s.formatEntityState(e.stateObj);
}
function C(s) {
  return s.filter(
    (e) => !!e && (e.content !== void 0 || (e.text ?? "").trim() !== "")
  );
}
function H(s, e) {
  const t = Xs(s, e);
  return t ? { text: t, entityId: e?.entityId } : void 0;
}
function L(s, e) {
  const t = Qs(s, e);
  return t ? { text: t, entityId: e?.entityId } : void 0;
}
function Qs(s, e) {
  if (!(!s || !e?.stateObj || !e.unavailable))
    return s.formatEntityState(e.stateObj);
}
function F(s) {
  if (!s?.stateObj) return;
  const e = Number(s.stateObj.state);
  return Number.isFinite(e) ? e : void 0;
}
function Te(s, e) {
  return s || (e?.stateObj?.attributes.friendly_name ?? e?.entityId ?? "");
}
function en(s, e) {
  if (!e) return { value: s };
  if (!s.endsWith(e)) return { value: s };
  const t = s.slice(0, s.length - e.length).trimEnd();
  return t ? { value: t, unit: e } : { value: s };
}
const Le = "unavailable", tn = "unknown", sn = "off", nn = /* @__PURE__ */ new Set(["button", "input_button", "scene"]), rn = /* @__PURE__ */ new Set([
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
]), M = (s) => s.substring(0, s.indexOf(".")), on = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "unknown";
function It(s, e) {
  const t = M(s.entity_id), r = s.state;
  if (nn.has(t))
    return r !== Le;
  if (r === Le || r === tn || r === sn && t !== "alert")
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
const an = (s) => s.reduceRight(
  (e, t) => `var(${t}${e ? `, ${e}` : ""})`,
  void 0
), ln = (s) => {
  const e = Number(s);
  if (!isNaN(e))
    return e >= 70 ? "--state-sensor-battery-high-color" : e >= 30 ? "--state-sensor-battery-medium-color" : "--state-sensor-battery-low-color";
};
function cn(s, e) {
  if (!s) return e;
  if (s.state === Le)
    return "var(--state-unavailable-color)";
  const t = M(s.entity_id), r = s.attributes.device_class;
  if (t === "sensor" && r === "battery") {
    const a = ln(s.state);
    if (a) return `var(${a})`;
  }
  if (!rn.has(t))
    return e;
  const n = It(s), i = on(s.state), o = n ? "active" : "inactive", l = [];
  return r && l.push(`--state-${t}-${r}-${i}-color`), l.push(
    `--state-${t}-${i}-color`,
    `--state-${t}-${o}-color`,
    `--state-${o}-color`
  ), an(l);
}
function U(s) {
  if (!s) return "var(--state-inactive-color)";
  const e = cn(s);
  return e || (It(s) ? "var(--state-icon-color)" : "var(--state-inactive-color)");
}
function Q(s) {
  return s !== void 0 && s.action !== "none";
}
const un = ["closed", "locked", "off"], hn = /* @__PURE__ */ new Set([
  "fan",
  "input_boolean",
  "light",
  "switch",
  "group",
  "automation",
  "humidifier",
  "valve"
]);
function le(s) {
  if (!s) return { action: "none" };
  const e = M(s);
  return { action: hn.has(e) || ["button", "input_button", "scene"].includes(e) ? "toggle" : "none" };
}
const dn = {
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
function mn(s, e) {
  const t = dn[s];
  return t ? (e ? t.on : t.off) ?? t.on : e ? "turn_on" : "turn_off";
}
function pn(s, e) {
  const t = s.states[e];
  if (!t) return;
  const r = M(e), n = r === "group" ? "homeassistant" : r, i = un.includes(t.state);
  s.callService(n, mn(r, i), {
    entity_id: e
  });
}
function ct(s, e, t) {
  s.dispatchEvent(
    new CustomEvent(e, { detail: t, bubbles: !0, composed: !0 })
  );
}
function fn(s, e) {
  e ? window.history.replaceState(null, "", s) : window.history.pushState(null, "", s), window.dispatchEvent(new CustomEvent("location-changed", { detail: {} }));
}
async function gn(s, e) {
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
async function _n(s, e, t, r) {
  let n;
  if (r === "double_tap" ? n = t.double_tap_action : r === "hold" ? n = t.hold_action : n = t.tap_action, n || (n = { action: "more-info" }), !!await gn(s, n))
    switch (n.action) {
      case "none":
        break;
      case "more-info": {
        const i = n.entity || t.entity;
        i && ct(s, "hass-more-info", { entityId: i });
        break;
      }
      case "toggle": {
        const i = n.entity || t.entity;
        i && pn(e, i);
        break;
      }
      case "navigate":
        n.navigation_path && fn(n.navigation_path, n.navigation_replace);
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
        ct(s, "ll-custom", n);
        break;
      default:
        console.warn(
          `horos-cards: action "${n.action}" is not supported`
        );
    }
}
const jt = 5e3, ut = [
  "ha-tile-container",
  "ha-tile-icon",
  "ha-tile-info",
  "hui-card-features"
];
let we, $e;
function Mt(s, e) {
  return customElements.get(s) ? Promise.resolve(!0) : Promise.race([
    customElements.whenDefined(s).then(() => !0),
    new Promise((t) => setTimeout(() => t(!1), e))
  ]);
}
async function vn() {
  const s = window.loadCardHelpers;
  if (s)
    try {
      (await s()).createCardElement?.({ type: "tile", entity: "sun.sun" });
    } catch {
    }
}
function Rt() {
  return we || (we = (async () => ut.every((e) => customElements.get(e)) ? !0 : (await vn(), (await Promise.all(
    ut.map((e) => Mt(e, jt))
  )).every(Boolean)))(), we);
}
function yn() {
  return $e || ($e = (async () => {
    if (customElements.get("hui-card-features-editor")) return !0;
    await Rt();
    const s = customElements.get("hui-tile-card");
    try {
      await s?.getConfigElement?.();
    } catch {
    }
    return Mt("hui-card-features-editor", jt);
  })(), $e);
}
const fe = {
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
}, bn = {
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
}, Se = {
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
}, Ht = { ru: bn, en: Se };
function y(s) {
  const t = (s?.language ?? s?.locale?.language ?? "en").split("-")[0].toLowerCase();
  return t in Ht ? t : "en";
}
function wn(s, e) {
  if (s !== "ru") return e === 1 ? "one" : "many";
  const t = e % 10, r = e % 100;
  return t === 1 && r !== 11 ? "one" : t >= 2 && t <= 4 && (r < 12 || r > 14) ? "few" : "many";
}
function m(s, e, t = {}) {
  const r = y(s), n = Ht[r] ?? Se, i = t.count, o = typeof i == "number" ? `${e}.${wn(r, i)}` : void 0;
  return ((o && (n[o] ?? Se[o])) ?? n[e] ?? Se[e] ?? e).replace(
    /\{(\w+)\}/g,
    (a, c) => c in t ? String(t[c]) : a
  );
}
var $n = Object.defineProperty, Nt = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && $n(e, t, n), n;
};
class w extends te {
  constructor() {
    super(...arguments), this._ready = !1, this.base = {};
  }
  static {
    this.styles = [z];
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
    super.connectedCallback(), Rt().then((e) => {
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
    _n(this, this.hass, r, e);
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
      return !this.base.state_content && !this.base.time_format ? H(this.hass, e) : {
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
      return this.renderWarning(m(this.hass, "internals.failed"));
    const f = this.base.color ? En(this.base.color) : r ?? "var(--state-inactive-color)", x = this.base.icon_tap_action ?? a, b = Q(x) || Q(this.base.icon_hold_action) || Q(this.base.icon_double_tap_action), Je = this.base.features?.length ? this.base.features : h, Me = this.base.features_position ?? "bottom";
    return v`
      <ha-card style="--tile-color: ${f};">
        <ha-tile-container
          .featurePosition=${Me}
          .vertical=${!!this.base.vertical}
          .interactive=${!0}
          .actionHandlerOptions=${{
      hasHold: Q(this.base.hold_action),
      hasDoubleClick: Q(this.base.double_tap_action)
    }}
          @action=${this._handleAction}
        >
          <ha-tile-icon
            slot="icon"
            class=${l ? "image" : ""}
            .interactive=${b}
            .imageUrl=${l}
            .icon=${this.base.icon ?? t}
            .actionHandlerOptions=${{
      hasHold: Q(this.base.icon_hold_action),
      hasDoubleClick: Q(this.base.icon_double_tap_action)
    }}
            @action=${this._handleIconAction}
          ></ha-tile-icon>

          <div slot="info" class="info ${this.base.vertical ? "vertical" : ""}">
            <ha-tile-info>
              <span slot="primary">${n}</span>
              ${i?.length && !this.base.hide_state ? v`<span slot="secondary"
                    >${i.map(
      (D, Re) => v`
                        ${Re ? v`<span>${Js}</span>` : d}${this.renderClickable(
        D.content ?? D.text,
        D.entityId
      )}
                      `
    )}</span
                  >` : d}
            </ha-tile-info>
            ${c?.length ? v`<div class="values of-${c.length}">
                  ${c.map(
      (D, Re) => v`
                      ${Re ? v`<span class="values-separator">/</span>` : d}
                      ${this.renderClickable(
        v`${D.icon ? v`<ha-icon
                              class="value-icon"
                              .icon=${D.icon}
                            ></ha-icon>` : d}${D.value}${D.unit ? v`<span class="unit"> ${D.unit}</span>` : d}`,
        D.entityId
      )}
                    `
    )}
                </div>` : d}
          </div>

          ${u ? v`<div slot="features" class="custom-features">
                ${u}
              </div>` : d}
          ${Je?.length ? v`<hui-card-features
                slot=${Me === "inline" ? "features-inline" : "features"}
                .hass=${this.hass}
                .context=${{ entity_id: o }}
                .features=${Je}
                .position=${Me}
              ></hui-card-features>` : d}
        </ha-tile-container>
      </ha-card>
    `;
  }
  /**
   * The values of the right-hand column. `icons` names a value by its role key:
   * without it two percentages in a row are indistinguishable.
   */
  bigValues(e, t = fe) {
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
    if (!(!this.hass || !e) && !Pt.has(e.state))
      return en(
        this.hass.formatEntityState(e),
        e.attributes.unit_of_measurement
      );
  }
}
Nt([
  Oe({ attribute: !1 })
], w.prototype, "hass");
Nt([
  _()
], w.prototype, "_ready");
function En(s) {
  return /^(#|rgb|hsl|var\()/.test(s) ? s : s === "state" ? "var(--state-icon-color)" : `var(--${s}-color, var(--state-icon-color))`;
}
const ht = 3;
function Y(s, e, t) {
  if (!s || s.length === 0) return [e];
  if (s.length > ht)
    throw new Error(
      `At most ${ht} large values are allowed, got ${s.length}`
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
function Z(s, e) {
  const t = e.map((n) => s.find((i) => i.key === n)).filter((n) => !!n), r = s.filter((n) => !e.includes(n.key));
  return { big: t, rest: r };
}
let dt = !1;
function Sn(s) {
  dt || (dt = !0, console.warn(
    `horos-cards: card ${s} is already registered. The bundle looks to be attached to the dashboard twice — the copy that loaded first is the one running. Check the dashboard resources.`
  ));
}
function mt() {
  const s = document.querySelector("home-assistant");
  return y(s?.hass);
}
function $(s, e, t) {
  if (customElements.get(s)) {
    Sn(s);
    return;
  }
  customElements.define(s, e), window.customCards = window.customCards ?? [], window.customCards.push({
    type: t.type,
    preview: t.preview,
    get name() {
      return t.name[mt() === "ru" ? "ru" : "en"];
    },
    get description() {
      return t.description[mt() === "ru" ? "ru" : "en"];
    },
    getEntitySuggestion: t.suggest
  });
}
function E(s, e) {
  customElements.get(s) || customElements.define(s, e);
}
const Ke = 20;
function J(s, e) {
  return s.states[e]?.attributes.device_class;
}
function Pe(s, e) {
  return s.entities?.[e]?.hidden === !0;
}
function W(s, e) {
  const t = s.entities?.[e]?.device_id;
  if (!t || !s.entities) return [e];
  const r = Object.keys(s.entities).filter(
    (n) => n !== e && s.entities?.[n]?.device_id === t && !Pe(s, n) && s.states[n] !== void 0
  );
  return [e, ...r.sort()];
}
function P(s, e, t, ...r) {
  return e.find(
    (n) => M(n) === t && r.includes(J(s, n) ?? "")
  );
}
function ge(s, ...e) {
  return s.find((t) => e.includes(M(t)));
}
function Ge(s, e, t, r, n = Ke, i = () => !0) {
  const o = Object.keys(s.states).filter(
    (a) => a !== e && M(a) === t && r.includes(J(s, a) ?? "") && !Pe(s, a) && i(a)
  ).sort();
  return [...i(e) ? [e] : [], ...o].slice(0, n);
}
function pt(s, e) {
  return s.entities?.[e]?.device_id !== void 0;
}
function K(s, e) {
  const t = s.entities?.[e];
  if (t)
    return t.area_id ? t.area_id : t.device_id ? s.devices?.[t.device_id]?.area_id : void 0;
}
function Ye(s, e, t, r = Ke) {
  const n = K(s, e);
  if (!n) return [];
  const i = Object.keys(s.states).filter(
    (l) => l !== e && M(l) === t && !Pe(s, l) && K(s, l) === n
  ).sort();
  return [...M(e) === t ? [e] : [], ...i].slice(0, r);
}
function xn(s, e, t, r, n = Ke) {
  const i = (u) => r.indexOf(J(s, u) ?? ""), o = Object.keys(s.states).filter(
    (u) => u !== e && M(u) === t && i(u) >= 0 && !Pe(s, u) && K(s, u) !== void 0
  ).sort((u, f) => i(u) - i(f) || u.localeCompare(f)), l = /* @__PURE__ */ new Map(), a = K(s, e);
  a && l.set(a, e);
  for (const u of o) {
    const f = K(s, u);
    l.has(f) || l.set(f, u);
  }
  const h = [...l.values()].filter((u) => u !== e);
  return [e, ...h].slice(0, n);
}
function N(s, e, t = {}) {
  const r = { type: s, ...t };
  for (const [n, i] of Object.entries(e))
    i && (r[n] = i);
  return { config: r };
}
function _e(s) {
  return Object.values(s).filter(Boolean).length;
}
var Cn = Object.defineProperty, kn = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && Cn(e, t, n), n;
};
const ft = [
  "temperature",
  "humidity",
  "illuminance",
  "pm25"
];
class Ut extends w {
  constructor() {
    super(...arguments), this._bigKeys = ["temperature"];
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Wr), document.createElement(
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
      ft
    ), this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return d;
    const e = this._config, t = ft.map((l) => ({
      key: l,
      role: p(this.hass, e[l])
    })), r = this.missingRolesWarning(t.map((l) => l.role));
    if (r) return this.renderWarning(r);
    const { big: n, rest: i } = Z(t, this._bigKeys), o = t[0].role;
    return this.renderTile({
      icon: "mdi:thermometer",
      color: U(o?.stateObj),
      primary: Te(e.name, o),
      imageUrl: this.entityImage(o?.stateObj),
      defaultIconAction: le(o?.entityId),
      secondary: C([
        L(this.hass, o),
        ...i.map((l) => H(this.hass, l.role))
      ]),
      mainEntityId: o?.entityId,
      values: this.bigValues(n)
    });
  }
}
kn([
  _()
], Ut.prototype, "_config");
$("horos-climate-tile", Ut, {
  type: "horos-climate-tile",
  name: { ru: "Климат комнаты", en: "Room climate" },
  description: {
    ru: "Температура, влажность, освещённость и PM2.5 одной комнаты в одной плитке",
    en: "Temperature, humidity, illuminance and PM2.5 of one room in a single tile"
  },
  preview: !0,
  suggest: (s, e) => {
    if (M(e) !== "sensor") return null;
    const t = W(s, e), r = {
      temperature: P(s, t, "sensor", "temperature"),
      humidity: P(s, t, "sensor", "humidity"),
      illuminance: P(s, t, "sensor", "illuminance"),
      pm25: P(s, t, "sensor", "pm25")
    };
    return !r.temperature || _e(r) < 2 ? null : N("custom:horos-climate-tile", r);
  }
});
var An = Object.defineProperty, On = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && An(e, t, n), n;
};
const gt = ["switch", "power", "energy"];
class Lt extends w {
  constructor() {
    super(...arguments), this._bigKeys = ["power"];
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Br), document.createElement("horos-plug-tile-editor");
  }
  static getStubConfig() {
    return { switch: "", power: "" };
  }
  setConfig(e) {
    if (!e.switch)
      throw new Error("A switch is required (switch)");
    this._bigKeys = Y(e.big_values, "power", gt), this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return d;
    const e = this._config, t = gt.map((a) => ({
      key: a,
      role: p(this.hass, e[a])
    })), r = this.missingRolesWarning(t.map((a) => a.role));
    if (r) return this.renderWarning(r);
    const { big: n, rest: i } = Z(t, this._bigKeys), o = t[0].role, l = o.entityId;
    return this.renderTile({
      icon: "mdi:power-plug",
      color: U(o.stateObj),
      primary: Te(e.name, o),
      secondary: C([
        // One of the two returns a piece: an available switch gives its state,
        // an unavailable one its unavailability status.
        L(this.hass, o),
        // The switch is the card's main entity, so its state can be shown
        // through state_content, just like on the stock tile.
        ...i.map(
          (a) => a.key === "switch" ? this.mainStateSegment(a.role) : H(this.hass, a.role)
        )
      ]),
      mainEntityId: l,
      imageUrl: this.entityImage(o.stateObj),
      defaultIconAction: le(l),
      values: this.bigValues(n),
      // The button is a stock HA feature; there is no markup of our own left for it.
      ownFeatures: e.toggle_button ? [{ type: "toggle" }] : void 0
    });
  }
}
On([
  _()
], Lt.prototype, "_config");
$("horos-plug-tile", Lt, {
  type: "horos-plug-tile",
  name: { ru: "Розетка", en: "Smart plug" },
  description: {
    ru: "Выключатель, текущая мощность и накопленная энергия в одной плитке",
    en: "Switch, current power draw and accumulated energy in a single tile"
  },
  preview: !0,
  suggest: (s, e) => {
    const t = W(s, e), r = {
      switch: ge(t, "switch"),
      power: P(s, t, "sensor", "power"),
      energy: P(s, t, "sensor", "energy")
    };
    return !r.switch || _e(r) < 2 ? null : N("custom:horos-plug-tile", r);
  }
});
const _t = 30, vt = 70;
function Tn(s, e, t) {
  return s === void 0 ? "unknown" : s < e ? "dry" : s > t ? "wet" : "ok";
}
const Pn = {
  dry: "var(--warning-color)",
  ok: "var(--success-color)",
  wet: "var(--info-color)",
  unknown: "var(--state-inactive-color)"
}, In = {
  dry: "mdi:water-off",
  ok: "mdi:sprout",
  wet: "mdi:water-alert",
  unknown: "mdi:sprout"
};
var jn = Object.defineProperty, Mn = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && jn(e, t, n), n;
};
const yt = ["moisture", "temperature", "battery"];
class Ft extends w {
  constructor() {
    super(...arguments), this._bigKeys = ["moisture"];
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => qr), document.createElement(
      "horos-plant-tile-editor"
    );
  }
  static getStubConfig() {
    return { moisture: "" };
  }
  setConfig(e) {
    if (!e.moisture)
      throw new Error("A soil moisture entity is required (moisture)");
    const t = e.dry_below ?? _t, r = e.wet_above ?? vt;
    if (t >= r)
      throw new Error("dry_below must be smaller than wet_above");
    this._bigKeys = Y(e.big_values, "moisture", yt), this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return d;
    const e = this._config, t = yt.map((c) => ({
      key: c,
      role: p(this.hass, e[c])
    })), r = this.missingRolesWarning(t.map((c) => c.role));
    if (r) return this.renderWarning(r);
    const { big: n, rest: i } = Z(t, this._bigKeys), o = t[0].role, l = F(o), a = Tn(
      l,
      e.dry_below ?? _t,
      e.wet_above ?? vt
    );
    return this.renderTile({
      icon: In[a],
      color: Pn[a],
      primary: Te(e.name, o),
      imageUrl: this.entityImage(o?.stateObj),
      defaultIconAction: le(o?.entityId),
      secondary: C([
        L(this.hass, o),
        ...i.map((c) => H(this.hass, c.role))
      ]),
      mainEntityId: o?.entityId,
      values: this.bigValues(n),
      // The gauge is a stock HA feature, not a bar of our own. It takes its
      // colour from --tile-color, that is, from our dryness thresholds.
      ownFeatures: l === void 0 ? void 0 : [{ type: "bar-gauge", min: 0, max: 100 }]
    });
  }
}
Mn([
  _()
], Ft.prototype, "_config");
$("horos-plant-tile", Ft, {
  type: "horos-plant-tile",
  name: { ru: "Растение", en: "Plant" },
  description: {
    ru: "Влажность почвы с порогами сухости, температура почвы и заряд датчика",
    en: "Soil moisture with dryness thresholds, soil temperature and sensor battery"
  },
  preview: !0,
  suggest: (s, e) => {
    if (M(e) !== "sensor" || J(s, e) !== "moisture")
      return null;
    const t = W(s, e);
    return N("custom:horos-plant-tile", {
      moisture: e,
      temperature: P(s, t, "sensor", "temperature"),
      battery: P(s, t, "sensor", "battery")
    });
  }
});
var Rn = Object.defineProperty, Ie = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && Rn(e, t, n), n;
};
class ve extends te {
  constructor() {
    super(...arguments), this._children = [];
  }
  static {
    this.styles = ze`
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
      ${this._heading ? v`<div class="heading">${this._heading}</div>` : d}
      <div class="grid" style="--columns: ${this.columns()}">
        ${this._children}
      </div>
    ` : d;
  }
}
Ie([
  Oe({ attribute: !1 })
], ve.prototype, "hass");
Ie([
  _()
], ve.prototype, "_heading");
Ie([
  _()
], ve.prototype, "_children");
Ie([
  _()
], ve.prototype, "_error");
function Hn(s) {
  if (!s) return;
  const e = s.split(":").pop();
  return e ? e.trim() : s;
}
function Nn(s) {
  return typeof s == "string" ? { entity: s } : s;
}
var Un = Object.defineProperty, Ln = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && Un(e, t, n), n;
};
const Fn = 3;
class Dt extends ve {
  static async getConfigElement() {
    return await Promise.resolve().then(() => Vr), document.createElement(
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
    return this._config?.columns ?? Fn;
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
      const t = Nn(e), r = this.hass?.states[t.entity];
      return {
        type: "button",
        entity: t.entity,
        name: t.name ?? Hn(r?.attributes.friendly_name),
        icon: t.icon,
        show_state: !1,
        tap_action: { action: "toggle" }
      };
    }) : [];
  }
}
Ln([
  _()
], Dt.prototype, "_config");
$("horos-buttons-tile", Dt, {
  type: "horos-buttons-tile",
  name: { ru: "Кнопки скриптов", en: "Script buttons" },
  description: {
    ru: "Сетка кнопок, вызывающих скрипты, под общим заголовком",
    en: "A grid of buttons running scripts, under one heading"
  },
  preview: !0
});
const B = ze`
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
function q(s, e) {
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
function ne(s, e) {
  if (s) {
    if (e && s.startsWith(e)) {
      const t = s.slice(e.length).trim();
      if (t) return t;
    }
    return s;
  }
}
function zt(s) {
  return s ? s.replace(/[\s—-]*(battery(\s+level)?|заряд)\s*$/i, "").trim() || s : void 0;
}
function ye(s) {
  return s === void 0 ? "var(--state-unavailable-color)" : s >= 70 ? "var(--state-sensor-battery-high-color, #4caf50)" : s >= 30 ? "var(--state-sensor-battery-medium-color, #ffa600)" : "var(--state-sensor-battery-low-color, #db4437)";
}
const Dn = ye;
function zn(s) {
  return s === void 0 ? "var(--state-unavailable-color)" : s >= 90 ? "var(--error-color, #db4437)" : s >= 80 ? "var(--warning-color, #ffa600)" : "var(--state-icon-color)";
}
function R(s) {
  return typeof s == "string" ? { entity: s } : s;
}
const Wn = [
  [/black|pgbk|_bk(_|$)/i, "black"],
  [/cyan/i, "cyan"],
  [/magenta/i, "purple"],
  [/yellow/i, "yellow"],
  // MC is the maintenance tank, not ink. It gets its own shade, otherwise it is
  // indistinguishable from black: that one is painted in the text colour and
  [/_mc(_|$)|maintenance/i, "blue-grey"]
];
function Bn(s) {
  return Wn.find(([t]) => t.test(s))?.[1];
}
function qn(s) {
  return s === "black" ? "var(--primary-text-color)" : /^(#|rgb|hsl|var\()/.test(s) ? s : `var(--${s}-color, var(--state-icon-color))`;
}
const Vn = ne, bt = (s, e) => typeof s == "number" && Number.isFinite(s) ? s : e;
function Kn(s, e, t) {
  const r = Number(s);
  if (!Number.isFinite(r)) return;
  const n = bt(e.marker_high_level, 100), i = bt(e.marker_low_level, 0), o = String(e.marker_type ?? "").includes("waste"), l = n > 0 ? Math.max(0, Math.min(100, r / n * 100)) : 0, a = o ? r >= n : r <= (t ?? i);
  return { fill: l, alarm: a, fills: o };
}
var Gn = Object.defineProperty, Yn = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && Gn(e, t, n), n;
};
class Wt extends w {
  static {
    this.styles = [z, B];
  }
  /** Level rows under the tile: roughly two per grid row. */
  contentRows() {
    return Math.ceil(((this._config?.cartridges.length ?? 0) + (this._config?.sensors?.length ?? 0)) / 2);
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Kr), document.createElement(
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
    return this._config.cartridges.map((t) => R(t)).map((t) => {
      const r = this.hass.states[t.entity];
      return {
        entityId: t.entity,
        name: t.name ?? Vn(r?.attributes.friendly_name, e),
        ink: qn(
          t.color ?? Bn(t.entity) ?? "grey"
        ),
        marker: r ? Kn(
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
      (a, c) => !a || c.marker.fill < a.marker.fill ? c : a,
      void 0
    ), i = this._config.status ? p(this.hass, this._config.status) : void 0, o = (this._config.sensors ?? []).map((a) => R(a)).map((a) => p(this.hass, a.entity)), l = i?.stateObj;
    return this.renderTile({
      icon: "mdi:printer",
      color: l ? U(l) : "var(--state-icon-color)",
      primary: this._printerName ?? m(this.hass, "printer.title"),
      secondary: C([
        H(this.hass, i),
        ...o.map((a) => H(this.hass, a))
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
      customFeatures: q(
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
Yn([
  _()
], Wt.prototype, "_config");
$("horos-printer-tile", Wt, {
  type: "horos-printer-tile",
  name: { ru: "Принтер", en: "Printer" },
  description: {
    ru: "Уровни чернил и состояние принтера в одной плитке",
    en: "Ink levels and printer status in a single tile"
  },
  preview: !0,
  suggest: (s, e) => {
    const t = W(s, e), r = t.filter(
      (i) => s.states[i]?.attributes.marker_type !== void 0
    );
    if (!r.length) return null;
    const n = t.find(
      (i) => M(i) === "sensor" && !r.includes(i) && Number.isNaN(Number(s.states[i]?.state))
    );
    return N(
      "custom:horos-printer-tile",
      { status: n },
      { cartridges: r }
    );
  }
});
var Zn = Object.defineProperty, Jn = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && Zn(e, t, n), n;
};
const Xn = 20;
class Bt extends w {
  static {
    this.styles = [z, B];
  }
  /** Level rows under the tile: roughly two per grid row. */
  contentRows() {
    return Math.ceil((this._config?.consumables?.length ?? 0) / 2);
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Gr), document.createElement(
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
    const e = this._config, t = p(this.hass, e.vacuum), r = p(this.hass, e.battery), n = (e.sensors ?? []).map((c) => R(c)).map((c) => p(this.hass, c.entity)), i = this.missingRolesWarning([t, r, ...n]);
    if (i) return this.renderWarning(i);
    const o = t?.stateObj?.attributes.friendly_name, l = e.low_below ?? Xn, a = (e.consumables ?? []).map((c) => R(c)).map((c) => {
      const h = p(this.hass, c.entity), u = F(h) ?? 0, f = c.name ?? ne(h?.stateObj?.attributes.friendly_name, o);
      return {
        entityId: c.entity,
        name: f ?? c.entity,
        text: `${u}%`,
        // Painting them in the tile colour is wrong: a docked vacuum's colour
        // is the inactive one and every bar comes out the same grey. We paint
        // by level — a consumable asks the same question a battery does.
        ink: c.color ?? ye(u),
        level: u,
        alarm: u < l
      };
    });
    return this.renderTile({
      icon: "mdi:robot-vacuum",
      color: U(t?.stateObj),
      primary: e.name ?? o ?? m(this.hass, "vacuum.title"),
      mainEntityId: t?.entityId,
      secondary: C([
        L(this.hass, t),
        this.mainStateSegment(t),
        ...n.map((c) => H(this.hass, c))
      ]),
      values: r ? this.bigValues([{ key: "battery", role: r }]) : [],
      customFeatures: a.length ? q(a, (c) => this.fireMoreInfo(c)) : void 0
    });
  }
}
Jn([
  _()
], Bt.prototype, "_config");
$("horos-vacuum-tile", Bt, {
  type: "horos-vacuum-tile",
  name: { ru: "Пылесос", en: "Vacuum" },
  description: {
    ru: "Состояние робота, заряд и ресурс расходников в одной плитке",
    en: "Robot status, battery and consumable life in a single tile"
  },
  preview: !0,
  suggest: (s, e) => {
    const t = W(s, e), r = ge(t, "vacuum"), n = P(s, t, "sensor", "battery");
    return !r || !n ? null : N("custom:horos-vacuum-tile", { vacuum: r, battery: n });
  }
});
var Qn = Object.defineProperty, er = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && Qn(e, t, n), n;
};
const tr = 30;
class qt extends w {
  static async getConfigElement() {
    return await Promise.resolve().then(() => Yr), document.createElement(
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
    const e = this._config, t = e.low_below ?? tr, r = [], n = [];
    for (const l of e.batteries) {
      const a = R(l), c = p(this.hass, a.entity);
      if (c?.missing) {
        n.push(a.entity);
        continue;
      }
      const h = F(c);
      h !== void 0 && r.push({
        entityId: a.entity,
        name: a.name ?? zt(c?.stateObj?.attributes.friendly_name) ?? a.entity,
        level: h
      });
    }
    const i = r.filter((l) => l.level < t).sort((l, a) => l.level - a.level), o = i[0];
    return this.renderTile({
      icon: o ? "mdi:battery-alert-variant-outline" : "mdi:battery",
      color: Dn(o?.level),
      primary: e.name ?? m(this.hass, "batteries.title"),
      mainEntityId: o?.entityId,
      secondary: C([
        ...i.length ? i.map((l) => ({
          text: `${l.name} ${l.level}%`,
          entityId: l.entityId
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
er([
  _()
], qt.prototype, "_config");
$("horos-batteries-tile", qt, {
  type: "horos-batteries-tile",
  name: { ru: "Батарейки", en: "Batteries" },
  description: {
    ru: "Только садящиеся батарейки, от самой пустой",
    en: "Only the batteries that are running down, emptiest first"
  },
  preview: !0,
  suggest: (s, e) => M(e) !== "sensor" || J(s, e) !== "battery" ? null : N(
    "custom:horos-batteries-tile",
    {},
    { batteries: Ge(s, e, "sensor", ["battery"]) }
  )
});
var sr = Object.defineProperty, nr = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && sr(e, t, n), n;
};
class Vt extends w {
  static async getConfigElement() {
    return await Promise.resolve().then(() => Zr), document.createElement(
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
      const c = R(a), h = p(this.hass, c.entity);
      if (h?.missing) {
        n.push(c.entity);
        continue;
      }
      i += 1;
      const u = c.name ?? h?.stateObj?.attributes.friendly_name ?? c.entity;
      h?.unavailable ? r.push({ text: m(this.hass, "safety.offline", { name: u }), entityId: c.entity }) : h?.stateObj?.state === "on" && t.push({ text: u, entityId: c.entity });
    }
    const o = t.length > 0, l = [...t, ...r];
    return this.renderTile({
      icon: o ? "mdi:shield-alert" : r.length ? "mdi:shield-off-outline" : "mdi:shield-check",
      color: o ? "var(--error-color, #db4437)" : r.length ? "var(--warning-color, #ffa600)" : "var(--success-color, #43a047)",
      primary: e.name ?? m(this.hass, "safety.title"),
      mainEntityId: l[0]?.entityId,
      secondary: C([
        ...l.length ? l : [{ text: m(this.hass, "safety.calm", { count: i }) }],
        ...n.length ? [{ text: m(this.hass, "list.missing", { count: n.length }) }] : []
      ])
    });
  }
}
nr([
  _()
], Vt.prototype, "_config");
$("horos-safety-tile", Vt, {
  type: "horos-safety-tile",
  name: { ru: "Безопасность", en: "Safety" },
  description: {
    ru: "Протечка, дым, газ — и датчики, потерявшие связь",
    en: "Leak, smoke, gas — and sensors that lost connection"
  },
  preview: !0,
  suggest: (s, e) => {
    const t = ["moisture", "gas", "smoke", "carbon_monoxide", "safety"];
    return M(e) !== "binary_sensor" || !t.includes(J(s, e) ?? "") ? null : N(
      "custom:horos-safety-tile",
      {},
      { sensors: Ge(s, e, "binary_sensor", t) }
    );
  }
});
var rr = Object.defineProperty, ir = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && rr(e, t, n), n;
};
const wt = ["disk", "download", "upload"];
class Kt extends w {
  constructor() {
    super(...arguments), this._bigKeys = ["disk"];
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Jr), document.createElement(
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
    this._bigKeys = Y(e.big_values, "disk", wt), this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return d;
    const e = this._config, t = wt.map((a) => ({
      key: a,
      role: p(this.hass, e[a])
    })), r = p(this.hass, e.status), n = (e.services ?? []).map((a) => R(a)).map((a) => p(this.hass, a.entity)), i = this.missingRolesWarning([
      r,
      ...t.map((a) => a.role),
      ...n
    ]);
    if (i) return this.renderWarning(i);
    const { big: o, rest: l } = Z(t, this._bigKeys);
    return this.renderTile({
      icon: "mdi:server",
      color: r ? U(r.stateObj) : "var(--state-icon-color)",
      primary: e.name ?? m(this.hass, "server.title"),
      mainEntityId: r?.entityId ?? t[0].role?.entityId,
      secondary: C([
        L(this.hass, r),
        this.mainStateSegment(r),
        ...l.map((a) => {
          const c = H(this.hass, a.role);
          if (!c) return;
          const h = a.key === "download" ? "↓ " : a.key === "upload" ? "↑ " : "";
          return { ...c, text: h + c.text };
        }),
        ...n.map((a) => H(this.hass, a))
      ]),
      values: this.bigValues(o)
    });
  }
}
ir([
  _()
], Kt.prototype, "_config");
$("horos-server-tile", Kt, {
  type: "horos-server-tile",
  name: { ru: "Домашний сервер", en: "Home server" },
  description: {
    ru: "Диск, скорости и состояние сервисов в одной плитке",
    en: "Disk, speeds and service status in a single tile"
  },
  preview: !0
});
var or = Object.defineProperty, ar = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && or(e, t, n), n;
};
class Gt extends w {
  static {
    this.styles = [z, B];
  }
  /** Level rows under the tile: roughly two per grid row. */
  contentRows() {
    return Math.ceil((this._config?.devices?.length ?? 0) / 2);
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Xr), document.createElement(
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
    const o = (e.devices ?? []).map((l) => R(l)).map((l) => {
      const a = p(this.hass, l.entity), c = F(a), h = l.name ?? zt(
        ne(
          a?.stateObj?.attributes.friendly_name,
          e.name
        )
      ) ?? l.entity;
      return {
        entityId: l.entity,
        name: h,
        text: c === void 0 ? m(this.hass, "value.unknown") : `${c}%`,
        ink: l.color ?? ye(c),
        level: c ?? 0,
        alarm: c !== void 0 && c < 20,
        alarmIcon: "mdi:battery-alert-variant-outline"
      };
    });
    return this.renderTile({
      icon: "mdi:account",
      color: U(t?.stateObj),
      primary: e.name ?? t?.stateObj?.attributes.friendly_name ?? m(this.hass, "person.title"),
      mainEntityId: t?.entityId,
      imageUrl: this.entityImage(t?.stateObj),
      secondary: C([
        L(this.hass, t),
        this.mainStateSegment(t),
        H(this.hass, n)
      ]),
      values: r ? this.bigValues([{ key: "battery", role: r }]) : [],
      customFeatures: o.length ? q(o, (l) => this.fireMoreInfo(l)) : void 0
    });
  }
}
ar([
  _()
], Gt.prototype, "_config");
$("horos-person-tile", Gt, {
  type: "horos-person-tile",
  name: { ru: "Человек", en: "Person" },
  description: {
    ru: "Дома ли он, где именно и заряд его устройств",
    en: "Whether they are home, where exactly, and their devices' battery"
  },
  preview: !0,
  suggest: (s, e) => {
    if (M(e) !== "person") return null;
    const r = (s.states[e]?.attributes.device_trackers ?? []).map((n) => P(s, W(s, n), "sensor", "battery")).find(Boolean);
    return r ? N("custom:horos-person-tile", {
      person: e,
      battery: r
    }) : null;
  }
});
function Ne(s, e, t) {
  if (!s || !e?.length) return;
  let r, n;
  for (const i of e) {
    const o = p(s, i), l = F(o);
    l !== void 0 && (n === void 0 || (t === "max" ? l > n : l < n)) && (r = o, n = l);
  }
  return r ?? p(s, e[0]);
}
var lr = Object.defineProperty, cr = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && lr(e, t, n), n;
};
const ur = [
  "temperature",
  "cpu",
  "memory",
  "gpu",
  "disk"
];
class Yt extends w {
  constructor() {
    super(...arguments), this._bigKeys = ["temperature"];
  }
  static {
    this.styles = [z, B];
  }
  /** Level rows under the tile: roughly two per grid row. */
  contentRows() {
    return Math.ceil(4 / 2);
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Qr), document.createElement(
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
      ur
    ), this.base = e, this._config = e;
  }
  /** The card's roles: the lists are already reduced to their extreme sensor. */
  _roles() {
    const e = this._config;
    return [
      {
        key: "temperature",
        role: Ne(this.hass, e.temperatures, "max")
      },
      { key: "cpu", role: p(this.hass, e.cpu) },
      { key: "memory", role: p(this.hass, e.memory) },
      { key: "gpu", role: p(this.hass, e.gpu) },
      { key: "disk", role: Ne(this.hass, e.disks, "max") }
    ];
  }
  /** The partition with the least free space left. */
  _freeDisk() {
    return Ne(this.hass, this._config?.disks_free, "min");
  }
  _levelRow(e, t) {
    if (!t) return;
    const r = F(t);
    return {
      entityId: t.entityId,
      name: e,
      text: r === void 0 ? m(this.hass, "value.unknown") : `${Math.round(r)}%`,
      ink: zn(r),
      level: r ?? 0,
      alarm: r !== void 0 && r >= 90,
      alarmIcon: "mdi:alert-circle"
    };
  }
  render() {
    if (!this._config || !this.hass) return d;
    const e = this._config, t = this._roles(), r = p(this.hass, e.status), n = (e.sensors ?? []).map((u) => R(u)).map((u) => p(this.hass, u.entity)), i = this.missingRolesWarning([
      r,
      ...t.map((u) => u.role),
      ...n
    ]);
    if (i) return this.renderWarning(i);
    const o = (e.alerts ?? []).map((u) => R(u)).map((u) => ({ alert: u, role: p(this.hass, u.entity) })).filter(({ role: u }) => u?.stateObj?.state === "on").map(({ alert: u, role: f }) => ({
      text: u.name ?? ne(
        f?.stateObj?.attributes.friendly_name,
        e.name
      ) ?? u.entity,
      entityId: u.entity
    })), { big: l } = Z(t, this._bigKeys), a = this._freeDisk(), c = F(a), h = [
      this._levelRow(m(this.hass, "level.cpu"), t[1].role),
      this._levelRow(m(this.hass, "level.memory"), t[2].role),
      this._levelRow(m(this.hass, "level.gpu"), t[3].role),
      this._levelRow(m(this.hass, "level.disk"), t[4].role),
      // Free space is a resource that runs out, so both the colour and the alarm
      // here behave like a battery's, not like load's.
      a ? {
        entityId: a.entityId,
        name: m(this.hass, "level.diskFree"),
        text: c === void 0 ? m(this.hass, "value.unknown") : `${Math.round(c)}%`,
        ink: ye(c),
        level: c ?? 0,
        alarm: c !== void 0 && c < 10,
        alarmIcon: "mdi:harddisk"
      } : void 0
    ].filter((u) => !!u);
    return this.renderTile({
      icon: "mdi:desktop-tower-monitor",
      color: r ? U(r.stateObj) : "var(--state-icon-color)",
      primary: e.name ?? m(this.hass, "computer.title"),
      mainEntityId: r?.entityId ?? t[0].role?.entityId ?? a?.entityId,
      secondary: C([
        L(this.hass, r),
        ...o,
        ...n.map((u) => H(this.hass, u)),
        // Load and disks are already shown as bars with their own labels.
        ...this._bigKeys.includes("temperature") ? [] : [H(this.hass, t[0].role)]
      ]),
      values: this.bigValues(l),
      customFeatures: h.length ? q(h, (u) => this.fireMoreInfo(u)) : void 0
    });
  }
}
cr([
  _()
], Yt.prototype, "_config");
$("horos-computer-tile", Yt, {
  type: "horos-computer-tile",
  name: { ru: "Компьютер", en: "Computer" },
  description: {
    ru: "Самая горячая точка, загрузка и диски в одной плитке",
    en: "Hottest spot, load and disks in a single tile"
  },
  preview: !0
});
var hr = Object.defineProperty, dr = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && hr(e, t, n), n;
};
const $t = ["pm25", "humidity", "temperature", "power"];
class Zt extends w {
  constructor() {
    super(...arguments), this._bigKeys = ["pm25"];
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => ei), document.createElement("horos-air-tile-editor");
  }
  static getStubConfig() {
    return { appliance: "" };
  }
  setConfig(e) {
    if (!e.appliance)
      throw new Error("An appliance is required (appliance)");
    this._bigKeys = Y(e.big_values, "pm25", $t), this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return d;
    const e = this._config, t = p(this.hass, e.appliance), r = $t.map((c) => {
      const h = p(this.hass, e[c]);
      if (c === "pm25") {
        const u = F(h);
        if (u !== void 0 && u < 0) return { key: c, role: void 0 };
      }
      return { key: c, role: h };
    }), n = (e.sensors ?? []).map((c) => R(c)).map((c) => p(this.hass, c.entity)), i = this.missingRolesWarning([
      t,
      ...r.map((c) => c.role),
      ...n
    ]);
    if (i) return this.renderWarning(i);
    const o = (e.alerts ?? []).map((c) => R(c)).map((c) => ({ alert: c, role: p(this.hass, c.entity) })).filter(({ role: c }) => c?.stateObj?.state === "on").map(({ alert: c, role: h }) => ({
      text: c.name ?? ne(
        h?.stateObj?.attributes.friendly_name,
        e.name
      ) ?? c.entity,
      entityId: c.entity
    })), { big: l, rest: a } = Z(r, this._bigKeys);
    return this.renderTile({
      icon: e.humidity ? "mdi:air-humidifier" : "mdi:air-filter",
      color: U(t?.stateObj),
      primary: e.name ?? t?.stateObj?.attributes.friendly_name ?? m(this.hass, "air.title"),
      mainEntityId: t?.entityId,
      secondary: C([
        L(this.hass, t),
        ...o,
        this.mainStateSegment(t),
        ...n.map((c) => H(this.hass, c)),
        ...a.map((c) => H(this.hass, c.role))
      ]),
      values: this.bigValues(l)
    });
  }
}
dr([
  _()
], Zt.prototype, "_config");
$("horos-air-tile", Zt, {
  type: "horos-air-tile",
  name: { ru: "Воздух", en: "Air" },
  description: {
    ru: "Очиститель, рекуператор, увлажнитель — прибор и что с воздухом",
    en: "Purifier, recuperator, humidifier — the appliance and the air"
  },
  preview: !0,
  suggest: (s, e) => {
    const t = W(s, e), r = {
      appliance: ge(t, "fan", "humidifier"),
      pm25: P(s, t, "sensor", "pm25"),
      humidity: P(s, t, "sensor", "humidity"),
      temperature: P(s, t, "sensor", "temperature"),
      power: P(s, t, "sensor", "power")
    };
    return !r.appliance || _e(r) < 2 ? null : N("custom:horos-air-tile", r);
  }
});
var mr = Object.defineProperty, pr = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && mr(e, t, n), n;
};
const Et = ["illuminance", "battery"], fr = 1, gr = 2, _r = 4;
class Jt extends w {
  constructor() {
    super(...arguments), this._bigKeys = ["illuminance"];
  }
  static {
    this.styles = [z, B];
  }
  /** Level rows under the tile: roughly two per grid row. */
  contentRows() {
    return Math.ceil(2 / 2);
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => ti), document.createElement(
      "horos-cover-tile-editor"
    );
  }
  static getStubConfig() {
    return { cover: "" };
  }
  setConfig(e) {
    if (!e.cover)
      throw new Error("A cover is required (cover)");
    this._bigKeys = Y(e.big_values, "illuminance", Et), this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return d;
    const e = this._config, t = p(this.hass, e.cover), r = p(this.hass, e.position), n = Et.map((b) => ({
      key: b,
      role: p(this.hass, e[b])
    })), i = this.missingRolesWarning([
      t,
      r,
      ...n.map((b) => b.role)
    ]);
    if (i) return this.renderWarning(i);
    const { big: o, rest: l } = Z(n, this._bigKeys), a = Number(
      t?.stateObj?.attributes.supported_features ?? 0
    ), c = (a & _r) !== 0, h = (a & (fr | gr)) !== 0, u = [];
    e.controls !== !1 && (c && u.push({ type: "cover-position" }), h && u.push({ type: "cover-open-close" }));
    const f = F(r), x = r && !c ? [
      {
        entityId: r.entityId,
        name: m(this.hass, "level.open"),
        text: f === void 0 ? m(this.hass, "value.unknown") : `${Math.round(f)}%`,
        ink: ye(f),
        level: f ?? 0
      }
    ] : [];
    return this.renderTile({
      icon: "mdi:curtains",
      color: U(t?.stateObj),
      primary: e.name ?? t?.stateObj?.attributes.friendly_name ?? m(this.hass, "cover.title"),
      mainEntityId: t?.entityId,
      secondary: C([
        L(this.hass, t),
        this.mainStateSegment(t),
        ...l.map((b) => H(this.hass, b.role))
      ]),
      values: this.bigValues(o),
      ownFeatures: u.length ? u : void 0,
      customFeatures: x.length ? q(x, (b) => this.fireMoreInfo(b)) : void 0
    });
  }
}
pr([
  _()
], Jt.prototype, "_config");
$("horos-cover-tile", Jt, {
  type: "horos-cover-tile",
  name: { ru: "Шторы", en: "Curtains" },
  description: {
    ru: "Насколько открыты, светло ли снаружи и сколько заряда",
    en: "How far open, how bright outside, and battery"
  },
  preview: !0,
  suggest: (s, e) => {
    const t = W(s, e), r = {
      cover: ge(t, "cover"),
      illuminance: P(s, t, "sensor", "illuminance"),
      battery: P(s, t, "sensor", "battery")
    };
    return !r.cover || _e(r) < 2 ? null : N("custom:horos-cover-tile", r);
  }
});
const vr = [
  "update",
  "select",
  "text",
  "button",
  "number",
  "event",
  "notify"
];
function yr(s, e = {}) {
  if (!s) return [];
  const t = new Set(e.ignore ?? []), r = new Set(
    e.ignoreDomains ?? vr
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
var br = Object.defineProperty, wr = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && br(e, t, n), n;
};
const $r = 4;
class Xt extends w {
  static async getConfigElement() {
    return await Promise.resolve().then(() => si), document.createElement(
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
    const e = this._config, t = yr(this.hass, {
      ignore: e.ignore,
      ignoreDomains: e.ignore_domains
    }), r = e.limit ?? $r, n = t.slice(0, r), i = t.length - n.length;
    return this.renderTile({
      icon: t.length ? "mdi:lan-disconnect" : "mdi:lan-check",
      color: t.length ? "var(--warning-color, #ffa600)" : "var(--success-color, #43a047)",
      primary: e.name ?? m(this.hass, "offline.title"),
      mainEntityId: t[0]?.entityId,
      secondary: C(
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
wr([
  _()
], Xt.prototype, "_config");
$("horos-offline-tile", Xt, {
  type: "horos-offline-tile",
  name: { ru: "Не отвечает", en: "Not responding" },
  description: {
    ru: "Что перестало отвечать, посчитанное по устройствам",
    en: "Devices that went silent, grouped by device"
  },
  preview: !0
});
var Er = Object.defineProperty, Sr = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && Er(e, t, n), n;
};
const xr = 5;
class Qt extends w {
  static {
    this.styles = [z, B];
  }
  /** Level rows under the tile: roughly two per grid row. */
  contentRows() {
    return Math.ceil(Math.min(this._config?.consumers.length ?? 0, this._config?.limit ?? 5) / 2);
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => ni), document.createElement(
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
      const u = R(h), f = p(this.hass, u.entity);
      if (f?.missing) {
        r.push(u.entity);
        continue;
      }
      const x = u.name ?? ne(f?.stateObj?.attributes.friendly_name, e.name) ?? u.entity;
      if (f?.unavailable) {
        n.push(x);
        continue;
      }
      const b = F(f);
      b === void 0 || b <= 0 || i.push({
        watts: b,
        row: {
          entityId: u.entity,
          name: x,
          text: this.hass.formatEntityState(f.stateObj),
          ink: u.color ?? "var(--amber-color, #ffc107)"
        }
      });
    }
    i.sort((h, u) => u.watts - h.watts);
    const o = i.slice(0, e.limit ?? xr), l = o[0]?.watts ?? 0, a = o.map(({ row: h, watts: u }) => ({
      ...h,
      level: l > 0 ? u / l * 100 : 0
    })), c = [
      L(this.hass, t),
      i.length ? { text: m(this.hass, "energy.consuming", { count: i.length }) } : { text: m(this.hass, "energy.idle") },
      n.length ? { text: m(this.hass, "offline.count", { count: n.length }) } : void 0,
      r.length ? { text: m(this.hass, "list.missing", { count: r.length }) } : void 0
    ];
    return this.renderTile({
      icon: "mdi:flash",
      color: "var(--amber-color, #ffc107)",
      primary: e.name ?? m(this.hass, "energy.title"),
      mainEntityId: t?.entityId ?? o[0]?.row.entityId,
      secondary: C([this.mainStateSegment(t), ...c]),
      values: t ? this.bigValues([{ key: "total", role: t }]) : [],
      customFeatures: a.length ? q(a, (h) => this.fireMoreInfo(h)) : void 0
    });
  }
}
Sr([
  _()
], Qt.prototype, "_config");
$("horos-energy-tile", Qt, {
  type: "horos-energy-tile",
  name: { ru: "Энергия", en: "Energy" },
  description: {
    ru: "Кто в доме ест электричество, от самого прожорливого",
    en: "Who in the house draws power, hungriest first"
  },
  preview: !0,
  suggest: (s, e) => {
    if (M(e) !== "sensor" || J(s, e) !== "power")
      return null;
    const t = Ge(
      s,
      e,
      "sensor",
      ["power"],
      12,
      (r) => pt(s, r)
    );
    return t.length ? N(
      "custom:horos-energy-tile",
      { total: pt(s, e) ? void 0 : e },
      { consumers: t, limit: 6 }
    ) : null;
  }
});
var Cr = Object.defineProperty, kr = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && Cr(e, t, n), n;
};
class es extends w {
  static async getConfigElement() {
    return await Promise.resolve().then(() => ri), document.createElement(
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
      const l = R(o), a = p(this.hass, l.entity);
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
      primary: e.name ?? m(this.hass, "presence.title"),
      mainEntityId: t[0]?.entityId,
      secondary: C([
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
kr([
  _()
], es.prototype, "_config");
$("horos-presence-tile", es, {
  type: "horos-presence-tile",
  name: { ru: "Присутствие", en: "Presence" },
  description: {
    ru: "В каких зонах сейчас есть кто-то",
    en: "Which areas have someone in them right now"
  },
  preview: !0,
  suggest: (s, e) => {
    const t = ["occupancy", "presence", "motion"];
    return M(e) !== "binary_sensor" || !t.includes(J(s, e) ?? "") ? null : N(
      "custom:horos-presence-tile",
      {},
      // One entity per area: otherwise the kitchen gets named three times.
      { areas: xn(s, e, "binary_sensor", t, 12) }
    );
  }
});
var Ar = Object.defineProperty, Or = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && Ar(e, t, n), n;
};
const Tr = 255;
class ts extends w {
  static {
    this.styles = [z, B];
  }
  contentRows() {
    return Math.ceil((this._config?.lights.length ?? 0) / 2);
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => ii), document.createElement(
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
    return t === void 0 ? void 0 : Math.round(t / Tr * 100);
  }
  render() {
    if (!this._config || !this.hass) return d;
    const e = this._config, t = p(this.hass, e.group), n = e.lights.map((u) => R(u)).map((u) => ({
      item: u,
      role: p(this.hass, u.entity)
    })), i = this.missingRolesWarning([
      t,
      ...n.map((u) => u.role)
    ]);
    if (i) return this.renderWarning(i);
    const o = n.filter((u) => u.role?.stateObj?.state === "on"), l = t ?? o[0]?.role ?? n[0].role, a = t?.stateObj?.attributes.friendly_name, c = n.map(({ item: u, role: f }) => {
      const x = this._brightness(f), b = f?.stateObj?.state === "on";
      return {
        entityId: u.entity,
        name: u.name ?? ne(f?.stateObj?.attributes.friendly_name, a) ?? u.entity,
        // A dimmable light says how bright, a plain one only that it is on.
        text: b ? x === void 0 ? m(this.hass, "light.on") : `${x}%` : m(this.hass, "light.off"),
        ink: u.color ?? U(f?.stateObj),
        level: b ? x ?? 100 : 0
      };
    }), h = this._brightness(l);
    return this.renderTile({
      icon: "mdi:lightbulb-group",
      color: U(l?.stateObj),
      primary: e.name ?? a ?? m(this.hass, "light.title"),
      mainEntityId: l?.entityId,
      defaultIconAction: le(l?.entityId),
      secondary: C([
        L(this.hass, t),
        {
          text: o.length ? m(this.hass, "light.count", {
            count: o.length,
            total: n.length
          }) : m(this.hass, "light.allOff")
        }
      ]),
      values: h === void 0 ? [] : [
        {
          value: String(h),
          unit: "%",
          entityId: l?.entityId,
          icon: fe.brightness
        }
      ],
      // The slider is a stock HA feature, and it only makes sense for a group:
      // a single slider cannot mean five different lights.
      ownFeatures: t && e.brightness !== !1 ? [{ type: "light-brightness" }] : void 0,
      customFeatures: q(
        c,
        (u) => this.fireMoreInfo(u)
      )
    });
  }
}
Or([
  _()
], ts.prototype, "_config");
$("horos-light-tile", ts, {
  type: "horos-light-tile",
  name: { ru: "Свет", en: "Lights" },
  description: {
    ru: "Свет комнаты одной плиткой: что горит и насколько ярко",
    en: "A room's lights in one tile: what is on and how bright"
  },
  preview: !0,
  suggest: (s, e) => {
    if (!K(s, e)) return null;
    const t = Ye(s, e, "light");
    return t.length < 2 ? null : N("custom:horos-light-tile", {}, { lights: t });
  }
});
var Pr = Object.defineProperty, Ir = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && Pr(e, t, n), n;
};
const St = ["playing", "paused", "buffering"];
class ss extends w {
  static {
    this.styles = [z, B];
  }
  contentRows() {
    return Math.ceil((this._config?.players.length ?? 0) / 2);
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => oi), document.createElement(
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
    if (!this._config || !this.hass) return d;
    const e = this._config, t = e.players.map((a) => R(a)).map((a) => ({ item: a, role: p(this.hass, a.entity) })), r = this.missingRolesWarning(t.map((a) => a.role));
    if (r) return this.renderWarning(r);
    const n = t.filter(
      (a) => St.includes(a.role?.stateObj?.state ?? "")
    ), i = n[0] ?? t[0], o = this._volume(i.role), l = t.map(({ item: a, role: c }) => {
      const h = this._volume(c), u = St.includes(c?.stateObj?.state ?? "");
      return {
        entityId: a.entity,
        name: a.name ?? c?.stateObj?.attributes.friendly_name ?? a.entity,
        // The state, not the title: a row is a bar with a word at the end, and
        // a track name is a sentence — it pushed the volume bar off the card.
        // What is playing is named once, in the line above.
        text: c?.stateObj && this.hass ? this.hass.formatEntityState(c.stateObj) : m(this.hass, "value.unknown"),
        ink: a.color ?? U(c?.stateObj),
        level: u ? h ?? 0 : 0
      };
    });
    return this.renderTile({
      icon: "mdi:play-box-multiple",
      color: U(i.role?.stateObj),
      primary: e.name ?? i.role?.stateObj?.attributes.friendly_name ?? m(this.hass, "media.title"),
      mainEntityId: i.role?.entityId,
      defaultIconAction: le(i.role?.entityId),
      secondary: C([
        L(this.hass, i.role),
        {
          text: n.length ? this._title(i.role) ?? m(this.hass, "media.playing", { count: n.length }) : m(this.hass, "media.idle"),
          entityId: i.role?.entityId
        }
      ]),
      values: o === void 0 ? [] : [
        {
          value: String(o),
          unit: "%",
          entityId: i.role?.entityId,
          icon: fe.volume
        }
      ],
      // Playback is a stock HA feature; the buttons are not ours to draw.
      ownFeatures: e.controls === !1 ? void 0 : [{ type: "media-player-playback" }],
      customFeatures: t.length > 1 ? q(l, (a) => this.fireMoreInfo(a)) : void 0
    });
  }
}
Ir([
  _()
], ss.prototype, "_config");
$("horos-media-tile", ss, {
  type: "horos-media-tile",
  name: { ru: "Медиа", en: "Media" },
  description: {
    ru: "Что играет в доме, где и насколько громко",
    en: "What is playing in the house, where, and how loud"
  },
  preview: !0,
  suggest: (s, e) => {
    if (!K(s, e)) return null;
    const t = Ye(s, e, "media_player");
    return t.length < 2 ? null : N("custom:horos-media-tile", {}, { players: t });
  }
});
var jr = Object.defineProperty, Mr = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && jr(e, t, n), n;
};
const xt = ["temperature", "humidity", "power"];
class ns extends w {
  constructor() {
    super(...arguments), this._bigKeys = ["temperature"];
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => ai), document.createElement("horos-ac-tile-editor");
  }
  static getStubConfig() {
    return { climate: "" };
  }
  setConfig(e) {
    if (!e.climate)
      throw new Error("A climate entity is required (climate)");
    this._bigKeys = Y(e.big_values, "temperature", xt), this.base = e, this._config = e;
  }
  contentRows() {
    return this._config?.controls === !1 ? 0 : 2;
  }
  render() {
    if (!this._config || !this.hass) return d;
    const e = this._config, t = p(this.hass, e.climate), r = xt.map((a) => ({
      key: a,
      role: p(this.hass, e[a])
    })), n = (e.sensors ?? []).map((a) => R(a)).map((a) => p(this.hass, a.entity)), i = this.missingRolesWarning([
      t,
      ...r.map((a) => a.role),
      ...n
    ]);
    if (i) return this.renderWarning(i);
    const { big: o, rest: l } = Z(r, this._bigKeys);
    return this.renderTile({
      icon: "mdi:air-conditioner",
      color: U(t?.stateObj),
      primary: Te(e.name, t) ?? m(this.hass, "ac.title"),
      mainEntityId: t?.entityId,
      defaultIconAction: le(t?.entityId),
      secondary: C([
        L(this.hass, t),
        this.mainStateSegment(t),
        ...l.map((a) => H(this.hass, a.role)),
        ...n.map((a) => H(this.hass, a))
      ]),
      values: this.bigValues(o),
      // Modes and the target temperature are stock features: the climate domain
      // has more shapes than a card should try to draw.
      ownFeatures: e.controls === !1 ? void 0 : [{ type: "climate-hvac-modes" }, { type: "target-temperature" }]
    });
  }
}
Mr([
  _()
], ns.prototype, "_config");
$("horos-ac-tile", ns, {
  type: "horos-ac-tile",
  name: { ru: "Кондиционер", en: "Air conditioner" },
  description: {
    ru: "Климатический прибор, воздух в комнате и цена работы",
    en: "A climate unit, the air in the room, and what running it costs"
  },
  preview: !0,
  suggest: (s, e) => {
    const t = W(s, e), r = ge(t, "climate");
    if (!r) return null;
    const n = K(s, r) ? Ye(s, r, "sensor") : [], i = {
      climate: r,
      temperature: P(s, n, "sensor", "temperature"),
      humidity: P(s, n, "sensor", "humidity"),
      power: P(s, t, "sensor", "power")
    };
    return _e(i) < 2 ? null : N("custom:horos-ac-tile", i);
  }
});
function Rr(s, e = {}) {
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
var Hr = Object.defineProperty, Nr = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && Hr(e, t, n), n;
};
const Ur = 4;
class rs extends w {
  static async getConfigElement() {
    return await Promise.resolve().then(() => li), document.createElement(
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
    if (!this._config || !this.hass) return d;
    const e = this._config, t = Rr(this.hass, { ignore: e.ignore }), r = e.include_skipped ? t : t.filter((l) => !l.skipped), n = e.limit ?? Ur, i = r.slice(0, n), o = r.length - i.length;
    return this.renderTile({
      icon: r.length ? "mdi:package-up" : "mdi:package-variant-closed-check",
      color: r.length ? "var(--info-color, #2196f3)" : "var(--success-color, #43a047)",
      primary: e.name ?? m(this.hass, "updates.title"),
      mainEntityId: r[0]?.entityId,
      secondary: C(
        r.length ? [
          ...i.map((l) => ({
            text: l.version ? `${l.name} ${l.version}` : l.name,
            entityId: l.entityId
          })),
          o > 0 ? { text: m(this.hass, "offline.more", { count: o }) } : void 0
        ] : [{ text: m(this.hass, "updates.upToDate") }]
      ),
      values: r.length ? [
        {
          value: String(r.length),
          entityId: r[0]?.entityId,
          icon: fe.updates
        }
      ] : []
    });
  }
}
Nr([
  _()
], rs.prototype, "_config");
$("horos-updates-tile", rs, {
  type: "horos-updates-tile",
  name: { ru: "Обновления", en: "Updates" },
  description: {
    ru: "Что в доме просит обновления, одной плиткой вместо тридцати",
    en: "What in the house asks to be updated, one tile instead of thirty"
  },
  preview: !0,
  suggest: (s, e) => e.startsWith("update.") ? N("custom:horos-updates-tile", {}) : null
});
var Lr = Object.defineProperty, Fr = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && Lr(e, t, n), n;
};
class is extends w {
  static {
    this.styles = [z, B];
  }
  contentRows() {
    return Math.ceil((this._config?.lists.length ?? 0) / 2);
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => ci), document.createElement(
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
    if (!this._config || !this.hass) return d;
    const e = this._config, t = p(this.hass, e.calendar), r = e.lists.map((c) => R(c)).map((c) => {
      const h = p(this.hass, c.entity);
      return { item: c, role: h, count: F(h) ?? 0 };
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
      primary: e.name ?? m(this.hass, "tasks.title"),
      mainEntityId: r[0]?.item.entity,
      secondary: C([
        L(this.hass, t),
        { text: i ? void 0 : m(this.hass, "tasks.none") },
        t ? {
          text: a ?? m(this.hass, "tasks.noEvents"),
          entityId: t.entityId
        } : void 0
      ]),
      values: i ? [
        {
          value: String(i),
          entityId: r[0]?.item.entity,
          icon: fe.tasks
        }
      ] : [],
      customFeatures: l.length ? q(l, (c) => this.fireMoreInfo(c)) : void 0
    });
  }
}
Fr([
  _()
], is.prototype, "_config");
$("horos-tasks-tile", is, {
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
    return r.length < 2 ? null : N("custom:horos-tasks-tile", {}, { lists: r });
  }
});
console.info(
  "%c HOROS-CARDS %c 0.2.0 ",
  "background:#03a9f4;color:#fff;border-radius:3px 0 0 3px;padding:2px 4px",
  "background:#555;color:#fff;border-radius:0 3px 3px 0;padding:2px 4px"
);
var Dr = Object.defineProperty, Ze = (s, e, t, r) => {
  for (var n = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (n = o(e, t, n) || n);
  return n && Dr(e, t, n), n;
};
class je extends te {
  constructor() {
    super(...arguments), this._computeHelper = (e) => e.name === "color" ? this.pick({
      ru: {
        color: "Неактивное состояние (например, off или closed) окрашено не будет."
      },
      en: {
        color: "Inactive state (for example, off or closed) will not be coloured."
      }
    }).color : void 0, this._computeLabel = (e) => this.labels[e.name] ?? this.pick({ ru: O, en: T })[e.name] ?? e.name;
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
    return y(this.hass) === "ru" ? e.ru : e.en;
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
    return !this.hass || !this._config ? d : v`
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
  Oe({ attribute: !1 })
], je.prototype, "hass");
Ze([
  _()
], je.prototype, "_config");
class S extends je {
  constructor() {
    super(...arguments), this._featuresEditorReady = !1;
  }
  connectedCallback() {
    super.connectedCallback(), yn().then((e) => {
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
    const t = this._config?.features ?? [], r = this.pick({ ru: O, en: T }), n = this.pick({
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
              ` : d}
        </div>
      </ha-expansion-panel>
    `;
  }
  render() {
    return !this.hass || !this._config ? d : v`
      ${this.renderForm()}
      ${this._featuresEditorReady ? this._renderFeatures() : d}
    `;
  }
}
Ze([
  _()
], S.prototype, "_featuresEditorReady");
const k = (s, e, t = []) => ({
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
}), Ue = (s) => s ? { entity_id: s, area_id: "area" } : void 0, A = (s, e) => ({
  name: "interactions",
  type: "expandable",
  flatten: !0,
  icon: "mdi:gesture-tap",
  schema: [
    {
      name: "tap_action",
      selector: { ui_action: { default_action: "more-info" } },
      context: Ue(s)
    },
    { name: "", type: "divider" },
    {
      name: "icon_tap_action",
      selector: { ui_action: { default_action: e } },
      context: Ue(s)
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
        context: Ue(s)
      }))
    }
  ]
}), O = {
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
}, T = {
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
}), zr = { text: {} }, re = (s) => ({
  select: { multiple: !0, mode: "list", options: s }
}), be = { boolean: {} };
class os extends S {
  get entityField() {
    return "temperature";
  }
  get schema() {
    const e = y(this.hass);
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
      k("temperature", e, [
        {
          name: "big_values",
          selector: re([
            { value: "temperature", label: e === "ru" ? "Температура" : "Temperature" },
            { value: "humidity", label: e === "ru" ? "Влажность" : "Humidity" },
            { value: "illuminance", label: e === "ru" ? "Освещённость" : "Illuminance" },
            { value: "pm25", label: "PM2.5" }
          ])
        }
      ]),
      A("temperature", "none")
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
E("horos-climate-tile-editor", os);
const Wr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosClimateTileEditor: os
}, Symbol.toStringTag, { value: "Module" }));
class as extends S {
  get entityField() {
    return "switch";
  }
  get schema() {
    const e = y(this.hass);
    return [
      { name: "switch", required: !0, selector: g("switch") },
      { name: "power", selector: g("sensor", "power") },
      { name: "energy", selector: g("sensor", "energy") },
      { name: "toggle_button", selector: be },
      k("switch", e, [
        {
          name: "big_values",
          selector: re([
            { value: "power", label: e === "ru" ? "Мощность" : "Power" },
            { value: "energy", label: e === "ru" ? "Энергия" : "Energy" },
            { value: "switch", label: e === "ru" ? "Состояние" : "State" }
          ])
        }
      ]),
      A("switch", "toggle")
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
E("horos-plug-tile-editor", as);
const Br = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosPlugTileEditor: as
}, Symbol.toStringTag, { value: "Module" }));
class ls extends S {
  get entityField() {
    return "moisture";
  }
  get schema() {
    const e = y(this.hass);
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
      k("moisture", e, [
        {
          name: "big_values",
          selector: re([
            { value: "moisture", label: e === "ru" ? "Влажность почвы" : "Soil moisture" },
            { value: "temperature", label: e === "ru" ? "Температура почвы" : "Soil temperature" },
            { value: "battery", label: e === "ru" ? "Заряд датчика" : "Sensor battery" }
          ])
        }
      ]),
      A("moisture", "none")
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
E("horos-plant-tile-editor", ls);
const qr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosPlantTileEditor: ls
}, Symbol.toStringTag, { value: "Module" }));
function I(s, e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of s ?? [])
    t.set(typeof r == "string" ? r : r.entity, r);
  return e.map((r) => t.get(r) ?? r);
}
function j(s) {
  return (s ?? []).map(
    (e) => typeof e == "string" ? e : e.entity
  );
}
class cs extends je {
  get schema() {
    return [
      { name: "name", selector: zr },
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
        ...O,
        name: "Заголовок",
        columns: "Кнопок в ряд",
        buttons: "Кнопки"
      },
      en: {
        ...T,
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
      buttons: j(e.buttons)
    };
  }
  fromForm(e) {
    return {
      ...e,
      buttons: I(
        this._config?.buttons,
        e.buttons ?? []
      )
    };
  }
}
E("horos-buttons-tile-editor", cs);
const Vr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosButtonsTileEditor: cs
}, Symbol.toStringTag, { value: "Module" }));
class us extends S {
  get entityField() {
    return "status";
  }
  get schema() {
    const e = y(this.hass);
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
      k("status", e),
      A("status", "none")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...O,
        name: "Название принтера",
        status: "Состояние принтера",
        cartridges: "Картриджи",
        low_below: "Мало чернил ниже",
        sensors: "Прочее про принтер"
      },
      en: {
        ...T,
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
      cartridges: j(
        e.cartridges
      ),
      sensors: j(e.sensors)
    };
  }
  fromForm(e) {
    return {
      ...e,
      cartridges: I(
        this._config?.cartridges,
        e.cartridges ?? []
      ),
      sensors: I(
        this._config?.sensors,
        e.sensors ?? []
      )
    };
  }
}
E("horos-printer-tile-editor", us);
const Kr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosPrinterTileEditor: us
}, Symbol.toStringTag, { value: "Module" }));
class hs extends S {
  get entityField() {
    return "vacuum";
  }
  get schema() {
    const e = y(this.hass);
    return [
      { name: "vacuum", required: !0, selector: g("vacuum") },
      { name: "battery", selector: g("sensor", "battery") },
      { name: "sensors", selector: { entity: { multiple: !0 } } },
      { name: "consumables", selector: { entity: { multiple: !0 } } },
      { name: "low_below", selector: G(0, 100, "%") },
      k("vacuum", e),
      A("vacuum", "none")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...O,
        name: "Название",
        vacuum: "Пылесос",
        battery: "Заряд",
        sensors: "Что ещё сказать",
        consumables: "Расходники",
        low_below: "Просит замены ниже"
      },
      en: {
        ...T,
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
      sensors: j(e.sensors),
      consumables: j(e.consumables)
    };
  }
  fromForm(e) {
    return {
      ...e,
      sensors: I(
        this._config?.sensors,
        e.sensors ?? []
      ),
      consumables: I(
        this._config?.consumables,
        e.consumables ?? []
      )
    };
  }
}
E("horos-vacuum-tile-editor", hs);
const Gr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosVacuumTileEditor: hs
}, Symbol.toStringTag, { value: "Module" }));
class ds extends S {
  get entityField() {
  }
  get schema() {
    const e = y(this.hass);
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
      k(void 0, e),
      A(void 0, "none")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...O,
        name: "Название",
        batteries: "Батарейки",
        low_below: "Показывать ниже"
      },
      en: {
        ...T,
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
      batteries: j(e.batteries)
    };
  }
  fromForm(e) {
    return {
      ...e,
      batteries: I(
        this._config?.batteries,
        e.batteries ?? []
      )
    };
  }
}
E("horos-batteries-tile-editor", ds);
const Yr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosBatteriesTileEditor: ds
}, Symbol.toStringTag, { value: "Module" }));
class ms extends S {
  get entityField() {
  }
  get schema() {
    const e = y(this.hass);
    return [
      {
        name: "sensors",
        required: !0,
        selector: { entity: { multiple: !0, filter: [{ domain: "binary_sensor" }] } }
      },
      k(void 0, e),
      A(void 0, "none")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...O,
        name: "Название",
        sensors: "Датчики"
      },
      en: {
        ...T,
        name: "Name",
        sensors: "Sensors"
      }
    });
  }
  get formData() {
    const e = this._config ?? {};
    return {
      ...e,
      sensors: j(e.sensors)
    };
  }
  fromForm(e) {
    return {
      ...e,
      sensors: I(
        this._config?.sensors,
        e.sensors ?? []
      )
    };
  }
}
E("horos-safety-tile-editor", ms);
const Zr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosSafetyTileEditor: ms
}, Symbol.toStringTag, { value: "Module" }));
class ps extends S {
  get entityField() {
    return "status";
  }
  get schema() {
    const e = y(this.hass);
    return [
      { name: "status", selector: { entity: {} } },
      { name: "disk", selector: g("sensor", "data_size") },
      { name: "download", selector: g("sensor", "data_rate") },
      { name: "upload", selector: g("sensor", "data_rate") },
      { name: "services", selector: { entity: { multiple: !0 } } },
      k("status", e),
      A("status", "none")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...O,
        name: "Название",
        status: "Состояние",
        disk: "Свободное место",
        download: "Скорость приёма",
        upload: "Скорость отдачи",
        services: "Что ещё сказать"
      },
      en: {
        ...T,
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
      services: j(e.services)
    };
  }
  fromForm(e) {
    return {
      ...e,
      services: I(
        this._config?.services,
        e.services ?? []
      )
    };
  }
}
E("horos-server-tile-editor", ps);
const Jr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosServerTileEditor: ps
}, Symbol.toStringTag, { value: "Module" }));
class fs extends S {
  get entityField() {
    return "person";
  }
  get schema() {
    const e = y(this.hass);
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
      k("person", e),
      A("person", "none")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...O,
        name: "Имя",
        person: "Человек",
        battery: "Заряд основного устройства",
        location: "Где именно",
        devices: "Остальные устройства"
      },
      en: {
        ...T,
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
      devices: j(e.devices)
    };
  }
  fromForm(e) {
    return {
      ...e,
      devices: I(
        this._config?.devices,
        e.devices ?? []
      )
    };
  }
}
E("horos-person-tile-editor", fs);
const Xr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosPersonTileEditor: fs
}, Symbol.toStringTag, { value: "Module" }));
class gs extends S {
  get entityField() {
    return "status";
  }
  get schema() {
    const e = y(this.hass);
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
      k("status", e, [
        {
          name: "big_values",
          selector: re([
            { value: "temperature", label: e === "ru" ? "Самая горячая точка" : "Hottest spot" },
            { value: "cpu", label: e === "ru" ? "Процессор" : "CPU" },
            { value: "memory", label: e === "ru" ? "Память" : "Memory" },
            { value: "gpu", label: e === "ru" ? "Видеокарта" : "GPU" },
            { value: "disk", label: e === "ru" ? "Самый полный диск" : "Fullest disk" }
          ])
        }
      ]),
      A("status", "none")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...O,
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
        ...T,
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
      sensors: j(e.sensors),
      alerts: j(e.alerts)
    };
  }
  fromForm(e) {
    return {
      ...e,
      sensors: I(
        this._config?.sensors,
        e.sensors ?? []
      ),
      alerts: I(
        this._config?.alerts,
        e.alerts ?? []
      )
    };
  }
}
E("horos-computer-tile-editor", gs);
const Qr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosComputerTileEditor: gs
}, Symbol.toStringTag, { value: "Module" }));
class _s extends S {
  get entityField() {
    return "appliance";
  }
  get schema() {
    const e = y(this.hass);
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
      k("appliance", e, [
        {
          name: "big_values",
          selector: re([
            { value: "pm25", label: "PM2.5" },
            { value: "humidity", label: e === "ru" ? "Влажность" : "Humidity" },
            { value: "temperature", label: e === "ru" ? "Температура" : "Temperature" },
            { value: "power", label: e === "ru" ? "Мощность" : "Power" }
          ])
        }
      ]),
      A("appliance", "toggle")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...O,
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
        ...T,
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
      sensors: j(e.sensors),
      alerts: j(e.alerts)
    };
  }
  fromForm(e) {
    return {
      ...e,
      sensors: I(
        this._config?.sensors,
        e.sensors ?? []
      ),
      alerts: I(
        this._config?.alerts,
        e.alerts ?? []
      )
    };
  }
}
E("horos-air-tile-editor", _s);
const ei = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosAirTileEditor: _s
}, Symbol.toStringTag, { value: "Module" }));
class vs extends S {
  get entityField() {
    return "cover";
  }
  get schema() {
    const e = y(this.hass);
    return [
      { name: "cover", required: !0, selector: g("cover") },
      { name: "position", selector: g("sensor") },
      { name: "illuminance", selector: g("sensor", "illuminance") },
      { name: "battery", selector: g("sensor", "battery") },
      { name: "controls", selector: { boolean: {} } },
      k("cover", e, [
        {
          name: "big_values",
          selector: re([
            { value: "illuminance", label: e === "ru" ? "Освещённость" : "Illuminance" },
            { value: "battery", label: e === "ru" ? "Заряд" : "Battery" }
          ])
        }
      ]),
      A("cover", "none")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...O,
        name: "Название",
        cover: "Штора",
        position: "Насколько открыто",
        illuminance: "Освещённость",
        battery: "Заряд",
        controls: "Кнопки управления",
        big_values: "Крупно справа (не больше трёх)"
      },
      en: {
        ...T,
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
E("horos-cover-tile-editor", vs);
const ti = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosCoverTileEditor: vs
}, Symbol.toStringTag, { value: "Module" }));
class ys extends S {
  get entityField() {
  }
  get schema() {
    const e = y(this.hass);
    return [
      { name: "limit", selector: G(1, 12) },
      { name: "ignore", selector: { entity: { multiple: !0 } } },
      k(void 0, e),
      A(void 0, "none")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...O,
        limit: "Сколько устройств называть",
        ignore: "Молчание этих — норма"
      },
      en: {
        ...T,
        limit: "How many devices to name",
        ignore: "Silence of these is normal"
      }
    });
  }
}
E("horos-offline-tile-editor", ys);
const si = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosOfflineTileEditor: ys
}, Symbol.toStringTag, { value: "Module" }));
class bs extends S {
  get entityField() {
    return "total";
  }
  get schema() {
    const e = y(this.hass);
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
      k("total", e),
      A("total", "none")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...O,
        name: "Название",
        total: "Общая мощность",
        consumers: "Потребители",
        limit: "Сколько показывать"
      },
      en: {
        ...T,
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
      consumers: j(e.consumers)
    };
  }
  fromForm(e) {
    return {
      ...e,
      consumers: I(
        this._config?.consumers,
        e.consumers ?? []
      )
    };
  }
}
E("horos-energy-tile-editor", bs);
const ni = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosEnergyTileEditor: bs
}, Symbol.toStringTag, { value: "Module" }));
class ws extends S {
  get entityField() {
  }
  get schema() {
    const e = y(this.hass);
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
      k(void 0, e),
      A(void 0, "none")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...O,
        name: "Название",
        areas: "Зоны"
      },
      en: {
        ...T,
        name: "Name",
        areas: "Areas"
      }
    });
  }
  get formData() {
    const e = this._config ?? {};
    return {
      ...e,
      areas: j(e.areas)
    };
  }
  fromForm(e) {
    return {
      ...e,
      areas: I(
        this._config?.areas,
        e.areas ?? []
      )
    };
  }
}
E("horos-presence-tile-editor", ws);
const ri = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosPresenceTileEditor: ws
}, Symbol.toStringTag, { value: "Module" }));
class $s extends S {
  get entityField() {
    return "group";
  }
  get schema() {
    const e = y(this.hass);
    return [
      { name: "lights", required: !0, selector: { entity: { multiple: !0, filter: { domain: "light" } } } },
      { name: "group", selector: g("light") },
      { name: "brightness", selector: be },
      k("group", e),
      A("group", "toggle")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...O,
        name: "Название",
        lights: "Лампы",
        group: "Группа (главная сущность)",
        brightness: "Слайдер яркости группы"
      },
      en: {
        ...T,
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
      lights: j(e.lights)
    };
  }
  fromForm(e) {
    return {
      ...e,
      lights: I(
        this._config?.lights,
        e.lights ?? []
      )
    };
  }
}
E("horos-light-tile-editor", $s);
const ii = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosLightTileEditor: $s
}, Symbol.toStringTag, { value: "Module" }));
class Es extends S {
  get entityField() {
  }
  get schema() {
    const e = y(this.hass);
    return [
      { name: "players", required: !0, selector: { entity: { multiple: !0, filter: { domain: "media_player" } } } },
      { name: "controls", selector: be },
      k(void 0, e),
      A(void 0, "more-info")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...O,
        name: "Название",
        players: "Проигрыватели",
        controls: "Кнопки управления"
      },
      en: {
        ...T,
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
      players: j(e.players)
    };
  }
  fromForm(e) {
    return {
      ...e,
      players: I(
        this._config?.players,
        e.players ?? []
      )
    };
  }
}
E("horos-media-tile-editor", Es);
const oi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosMediaTileEditor: Es
}, Symbol.toStringTag, { value: "Module" }));
class Ss extends S {
  get entityField() {
    return "climate";
  }
  get schema() {
    const e = y(this.hass);
    return [
      { name: "climate", required: !0, selector: g("climate") },
      { name: "temperature", selector: g("sensor", "temperature") },
      { name: "humidity", selector: g("sensor", "humidity") },
      { name: "power", selector: g("sensor", "power") },
      { name: "sensors", selector: { entity: { multiple: !0 } } },
      { name: "controls", selector: be },
      k("climate", e, [
        {
          name: "big_values",
          selector: re([
            { value: "temperature", label: e === "ru" ? "Температура" : "Temperature" },
            { value: "humidity", label: e === "ru" ? "Влажность" : "Humidity" },
            { value: "power", label: e === "ru" ? "Мощность" : "Power" }
          ])
        }
      ]),
      A("climate", "more-info")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...O,
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
        ...T,
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
      sensors: j(e.sensors)
    };
  }
  fromForm(e) {
    return {
      ...e,
      sensors: I(
        this._config?.sensors,
        e.sensors ?? []
      )
    };
  }
}
E("horos-ac-tile-editor", Ss);
const ai = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosAcTileEditor: Ss
}, Symbol.toStringTag, { value: "Module" }));
class xs extends S {
  get entityField() {
  }
  get schema() {
    const e = y(this.hass);
    return [
      { name: "limit", selector: G(1, 20) },
      { name: "include_skipped", selector: be },
      { name: "ignore", selector: { entity: { multiple: !0, filter: { domain: "update" } } } },
      k(void 0, e),
      A(void 0, "more-info")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...O,
        name: "Название",
        limit: "Сколько называть поимённо",
        include_skipped: "Считать и пропущенные версии",
        ignore: "Не считать"
      },
      en: {
        ...T,
        name: "Name",
        limit: "How many to name",
        include_skipped: "Count skipped versions too",
        ignore: "Do not count"
      }
    });
  }
}
E("horos-updates-tile-editor", xs);
const li = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosUpdatesTileEditor: xs
}, Symbol.toStringTag, { value: "Module" }));
class Cs extends S {
  get entityField() {
  }
  get schema() {
    const e = y(this.hass);
    return [
      { name: "lists", required: !0, selector: { entity: { multiple: !0, filter: { domain: "todo" } } } },
      { name: "calendar", selector: g("calendar") },
      k(void 0, e),
      A(void 0, "more-info")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...O,
        name: "Название",
        lists: "Списки дел",
        calendar: "Календарь"
      },
      en: {
        ...T,
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
      lists: j(e.lists)
    };
  }
  fromForm(e) {
    return {
      ...e,
      lists: I(
        this._config?.lists,
        e.lists ?? []
      )
    };
  }
}
E("horos-tasks-tile-editor", Cs);
const ci = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosTasksTileEditor: Cs
}, Symbol.toStringTag, { value: "Module" }));
