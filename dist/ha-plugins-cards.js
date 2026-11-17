/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Fe = globalThis, _t = Fe.ShadowRoot && (Fe.ShadyCSS === void 0 || Fe.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, vt = Symbol(), Mt = /* @__PURE__ */ new WeakMap();
let vs = class {
  constructor(e, t, n) {
    if (this._$cssResult$ = !0, n !== vt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (_t && e === void 0) {
      const n = t !== void 0 && t.length === 1;
      n && (e = Mt.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && Mt.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Lr = (s) => new vs(typeof s == "string" ? s : s + "", void 0, vt), ce = (s, ...e) => {
  const t = s.length === 1 ? s[0] : e.reduce((n, r, i) => n + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + s[i + 1], s[0]);
  return new vs(t, s, vt);
}, Hr = (s, e) => {
  if (_t) s.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const n = document.createElement("style"), r = Fe.litNonce;
    r !== void 0 && n.setAttribute("nonce", r), n.textContent = t.cssText, s.appendChild(n);
  }
}, Nt = _t ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const n of e.cssRules) t += n.cssText;
  return Lr(t);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Dr, defineProperty: Ur, getOwnPropertyDescriptor: zr, getOwnPropertyNames: Wr, getOwnPropertySymbols: Br, getPrototypeOf: qr } = Object, qe = globalThis, Ft = qe.trustedTypes, Vr = Ft ? Ft.emptyScript : "", Kr = qe.reactiveElementPolyfillSupport, xe = (s, e) => s, De = { toAttribute(s, e) {
  switch (e) {
    case Boolean:
      s = s ? Vr : null;
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
} }, bt = (s, e) => !Dr(s, e), Lt = { attribute: !0, type: String, converter: De, reflect: !1, useDefault: !1, hasChanged: bt };
Symbol.metadata ??= Symbol("metadata"), qe.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let be = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = Lt) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
      r !== void 0 && Ur(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, t, n) {
    const { get: r, set: i } = zr(this.prototype, e) ?? { get() {
      return this[t];
    }, set(o) {
      this[t] = o;
    } };
    return { get: r, set(o) {
      const l = r?.call(this);
      i?.call(this, o), this.requestUpdate(e, l, n);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Lt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(xe("elementProperties"))) return;
    const e = qr(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(xe("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(xe("properties"))) {
      const t = this.properties, n = [...Wr(t), ...Br(t)];
      for (const r of n) this.createProperty(r, t[r]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [n, r] of t) this.elementProperties.set(n, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, n] of this.elementProperties) {
      const r = this._$Eu(t, n);
      r !== void 0 && this._$Eh.set(r, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const n = new Set(e.flat(1 / 0).reverse());
      for (const r of n) t.unshift(Nt(r));
    } else e !== void 0 && t.push(Nt(e));
    return t;
  }
  static _$Eu(e, t) {
    const n = t.attribute;
    return n === !1 ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
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
    for (const n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Hr(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, t, n) {
    this._$AK(e, n);
  }
  _$ET(e, t) {
    const n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
    if (r !== void 0 && n.reflect === !0) {
      const i = (n.converter?.toAttribute !== void 0 ? n.converter : De).toAttribute(t, n.type);
      this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const n = this.constructor, r = n._$Eh.get(e);
    if (r !== void 0 && this._$Em !== r) {
      const i = n.getPropertyOptions(r), o = typeof i.converter == "function" ? { fromAttribute: i.converter } : i.converter?.fromAttribute !== void 0 ? i.converter : De;
      this._$Em = r;
      const l = o.fromAttribute(t, i.type);
      this[r] = l ?? this._$Ej?.get(r) ?? l, this._$Em = null;
    }
  }
  requestUpdate(e, t, n, r = !1, i) {
    if (e !== void 0) {
      const o = this.constructor;
      if (r === !1 && (i = this[e]), n ??= o.getPropertyOptions(e), !((n.hasChanged ?? bt)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(o._$Eu(e, n)))) return;
      this.C(e, t, n);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: n, reflect: r, wrapped: i }, o) {
    n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, o ?? t ?? this[e]), i !== !0 || o !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), r === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
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
        for (const [r, i] of this._$Ep) this[r] = i;
        this._$Ep = void 0;
      }
      const n = this.constructor.elementProperties;
      if (n.size > 0) for (const [r, i] of n) {
        const { wrapped: o } = i, l = this[r];
        o !== !0 || this._$AL.has(r) || l === void 0 || this.C(r, void 0, i, l);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((n) => n.hostUpdate?.()), this.update(t)) : this._$EM();
    } catch (n) {
      throw e = !1, this._$EM(), n;
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
be.elementStyles = [], be.shadowRootOptions = { mode: "open" }, be[xe("elementProperties")] = /* @__PURE__ */ new Map(), be[xe("finalized")] = /* @__PURE__ */ new Map(), Kr?.({ ReactiveElement: be }), (qe.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const yt = globalThis, Ht = (s) => s, Ue = yt.trustedTypes, Dt = Ue ? Ue.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, bs = "$lit$", oe = `lit$${Math.random().toFixed(9).slice(2)}$`, ys = "?" + oe, Gr = `<${ys}>`, fe = document, Ee = () => fe.createComment(""), ke = (s) => s === null || typeof s != "object" && typeof s != "function", wt = Array.isArray, Yr = (s) => wt(s) || typeof s?.[Symbol.iterator] == "function", tt = `[ 	
\f\r]`, we = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ut = /-->/g, zt = />/g, de = RegExp(`>|${tt}(?:([^\\s"'>=/]+)(${tt}*=${tt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Wt = /'/g, Bt = /"/g, ws = /^(?:script|style|textarea|title)$/i, Xr = (s) => (e, ...t) => ({ _$litType$: s, strings: e, values: t }), v = Xr(1), ge = Symbol.for("lit-noChange"), m = Symbol.for("lit-nothing"), qt = /* @__PURE__ */ new WeakMap(), pe = fe.createTreeWalker(fe, 129);
function $s(s, e) {
  if (!wt(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Dt !== void 0 ? Dt.createHTML(e) : e;
}
const Zr = (s, e) => {
  const t = s.length - 1, n = [];
  let r, i = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = we;
  for (let l = 0; l < t; l++) {
    const a = s[l];
    let c, h, u = -1, g = 0;
    for (; g < a.length && (o.lastIndex = g, h = o.exec(a), h !== null); ) g = o.lastIndex, o === we ? h[1] === "!--" ? o = Ut : h[1] !== void 0 ? o = zt : h[2] !== void 0 ? (ws.test(h[2]) && (r = RegExp("</" + h[2], "g")), o = de) : h[3] !== void 0 && (o = de) : o === de ? h[0] === ">" ? (o = r ?? we, u = -1) : h[1] === void 0 ? u = -2 : (u = o.lastIndex - h[2].length, c = h[1], o = h[3] === void 0 ? de : h[3] === '"' ? Bt : Wt) : o === Bt || o === Wt ? o = de : o === Ut || o === zt ? o = we : (o = de, r = void 0);
    const f = o === de && s[l + 1].startsWith("/>") ? " " : "";
    i += o === we ? a + Gr : u >= 0 ? (n.push(c), a.slice(0, u) + bs + a.slice(u) + oe + f) : a + oe + (u === -2 ? l : f);
  }
  return [$s(s, i + (s[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), n];
};
class Ce {
  constructor({ strings: e, _$litType$: t }, n) {
    let r;
    this.parts = [];
    let i = 0, o = 0;
    const l = e.length - 1, a = this.parts, [c, h] = Zr(e, t);
    if (this.el = Ce.createElement(c, n), pe.currentNode = this.el.content, t === 2 || t === 3) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (r = pe.nextNode()) !== null && a.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const u of r.getAttributeNames()) if (u.endsWith(bs)) {
          const g = h[o++], f = r.getAttribute(u).split(oe), y = /([.?@])?(.*)/.exec(g);
          a.push({ type: 1, index: i, name: y[2], strings: f, ctor: y[1] === "." ? Qr : y[1] === "?" ? en : y[1] === "@" ? tn : Ve }), r.removeAttribute(u);
        } else u.startsWith(oe) && (a.push({ type: 6, index: i }), r.removeAttribute(u));
        if (ws.test(r.tagName)) {
          const u = r.textContent.split(oe), g = u.length - 1;
          if (g > 0) {
            r.textContent = Ue ? Ue.emptyScript : "";
            for (let f = 0; f < g; f++) r.append(u[f], Ee()), pe.nextNode(), a.push({ type: 2, index: ++i });
            r.append(u[g], Ee());
          }
        }
      } else if (r.nodeType === 8) if (r.data === ys) a.push({ type: 2, index: i });
      else {
        let u = -1;
        for (; (u = r.data.indexOf(oe, u + 1)) !== -1; ) a.push({ type: 7, index: i }), u += oe.length - 1;
      }
      i++;
    }
  }
  static createElement(e, t) {
    const n = fe.createElement("template");
    return n.innerHTML = e, n;
  }
}
function ye(s, e, t = s, n) {
  if (e === ge) return e;
  let r = n !== void 0 ? t._$Co?.[n] : t._$Cl;
  const i = ke(e) ? void 0 : e._$litDirective$;
  return r?.constructor !== i && (r?._$AO?.(!1), i === void 0 ? r = void 0 : (r = new i(s), r._$AT(s, t, n)), n !== void 0 ? (t._$Co ??= [])[n] = r : t._$Cl = r), r !== void 0 && (e = ye(s, r._$AS(s, e.values), r, n)), e;
}
class Jr {
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
    const { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? fe).importNode(t, !0);
    pe.currentNode = r;
    let i = pe.nextNode(), o = 0, l = 0, a = n[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let c;
        a.type === 2 ? c = new Se(i, i.nextSibling, this, e) : a.type === 1 ? c = new a.ctor(i, a.name, a.strings, this, e) : a.type === 6 && (c = new sn(i, this, e)), this._$AV.push(c), a = n[++l];
      }
      o !== a?.index && (i = pe.nextNode(), o++);
    }
    return pe.currentNode = fe, r;
  }
  p(e) {
    let t = 0;
    for (const n of this._$AV) n !== void 0 && (n.strings !== void 0 ? (n._$AI(e, n, t), t += n.strings.length - 2) : n._$AI(e[t])), t++;
  }
}
class Se {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, t, n, r) {
    this.type = 2, this._$AH = m, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
    e = ye(this, e, t), ke(e) ? e === m || e == null || e === "" ? (this._$AH !== m && this._$AR(), this._$AH = m) : e !== this._$AH && e !== ge && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Yr(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== m && ke(this._$AH) ? this._$AA.nextSibling.data = e : this.T(fe.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = Ce.createElement($s(n.h, n.h[0]), this.options)), n);
    if (this._$AH?._$AD === r) this._$AH.p(t);
    else {
      const i = new Jr(r, this), o = i.u(this.options);
      i.p(t), this.T(o), this._$AH = i;
    }
  }
  _$AC(e) {
    let t = qt.get(e.strings);
    return t === void 0 && qt.set(e.strings, t = new Ce(e)), t;
  }
  k(e) {
    wt(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let n, r = 0;
    for (const i of e) r === t.length ? t.push(n = new Se(this.O(Ee()), this.O(Ee()), this, this.options)) : n = t[r], n._$AI(i), r++;
    r < t.length && (this._$AR(n && n._$AB.nextSibling, r), t.length = r);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const n = Ht(e).nextSibling;
      Ht(e).remove(), e = n;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class Ve {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, n, r, i) {
    this.type = 1, this._$AH = m, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(new String()), this.strings = n) : this._$AH = m;
  }
  _$AI(e, t = this, n, r) {
    const i = this.strings;
    let o = !1;
    if (i === void 0) e = ye(this, e, t, 0), o = !ke(e) || e !== this._$AH && e !== ge, o && (this._$AH = e);
    else {
      const l = e;
      let a, c;
      for (e = i[0], a = 0; a < i.length - 1; a++) c = ye(this, l[n + a], t, a), c === ge && (c = this._$AH[a]), o ||= !ke(c) || c !== this._$AH[a], c === m ? e = m : e !== m && (e += (c ?? "") + i[a + 1]), this._$AH[a] = c;
    }
    o && !r && this.j(e);
  }
  j(e) {
    e === m ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Qr extends Ve {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === m ? void 0 : e;
  }
}
class en extends Ve {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== m);
  }
}
class tn extends Ve {
  constructor(e, t, n, r, i) {
    super(e, t, n, r, i), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = ye(this, e, t, 0) ?? m) === ge) return;
    const n = this._$AH, r = e === m && n !== m || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== m && (n === m || r);
    r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class sn {
  constructor(e, t, n) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    ye(this, e);
  }
}
const rn = yt.litHtmlPolyfillSupport;
rn?.(Ce, Se), (yt.litHtmlVersions ??= []).push("3.3.3");
const nn = (s, e, t) => {
  const n = t?.renderBefore ?? e;
  let r = n._$litPart$;
  if (r === void 0) {
    const i = t?.renderBefore ?? null;
    n._$litPart$ = r = new Se(e.insertBefore(Ee(), i), i, void 0, t ?? {});
  }
  return r._$AI(s), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $t = globalThis;
let ae = class extends be {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = nn(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return ge;
  }
};
ae._$litElement$ = !0, ae.finalized = !0, $t.litElementHydrateSupport?.({ LitElement: ae });
const on = $t.litElementPolyfillSupport;
on?.({ LitElement: ae });
($t.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const an = { attribute: !0, type: String, converter: De, reflect: !1, hasChanged: bt }, ln = (s = an, e, t) => {
  const { kind: n, metadata: r } = t;
  let i = globalThis.litPropertyMetadata.get(r);
  if (i === void 0 && globalThis.litPropertyMetadata.set(r, i = /* @__PURE__ */ new Map()), n === "setter" && ((s = Object.create(s)).wrapped = !0), i.set(t.name, s), n === "accessor") {
    const { name: o } = t;
    return { set(l) {
      const a = e.get.call(this);
      e.set.call(this, l), this.requestUpdate(o, a, s, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(o, void 0, s, l), l;
    } };
  }
  if (n === "setter") {
    const { name: o } = t;
    return function(l) {
      const a = this[o];
      e.call(this, l), this.requestUpdate(o, a, s, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + n);
};
function V(s) {
  return (e, t) => typeof t == "object" ? ln(s, e, t) : ((n, r, i) => {
    const o = r.hasOwnProperty(i);
    return r.constructor.createProperty(i, n), o ? Object.getOwnPropertyDescriptor(r, i) : void 0;
  })(s, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function b(s) {
  return V({ ...s, state: !0, attribute: !1 });
}
const W = ce`
  :host {
    --tile-color: var(--state-inactive-color, #7b7b7b);
    display: block;
  }

  /*
   * A card takes the height it is given when a height was actually given: rows
   * set by hand rather than left on auto, and something under the line to fill
   * them with. A block host with an automatic height ignores that height
   * outright — a card told to be four rows tall drew 130px inside a 248px slot
   * and left the rest as a hole — and inheriting it is what finally gives
   * ha-card's own height: 100% something to resolve against.
   *
   * On auto the card keeps its natural height even when a taller neighbour
   * makes the grid row taller, exactly as the stock tile does. Filling there
   * looked worse, not better: three rows of heating spread over 350px because
   * the card beside it had a lot to say.
   */
  :host([filled]) {
    height: 100%;
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

  /*
   * Where the spare height goes.
   *
   * ha-tile-container gives its top row flex: 1, so on a card with a fixed
   * height every extra pixel lands in the icon-and-text row — the stock tile at
   * four rows is 248px of a single line. That row is the card's identity and
   * belongs at exactly one layout row; the room underneath is what the rest of
   * the content is for. The row lives in HA's shadow and cannot be restyled
   * from out here, so it is outvoted instead: our half of the card asks for the
   * free space with a growth factor two orders of magnitude larger and the row
   * keeps its 56px minimum plus a rounding error.
   */
  .custom-features,
  hui-card-features[slot="features"] {
    flex: 100 1 auto;
    min-height: 0;
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
    display: flex;
    flex-direction: column;
    padding: 0 var(--ha-space-3, 12px) var(--ha-space-3, 12px);
    pointer-events: auto;
  }

  /* Whatever is inside takes the whole line: rows spread, controls space out. */
  .custom-features > * {
    flex: 1;
    min-height: 0;
  }

  /*
   * The inline place is sized by ha-tile-container — half the card on the grid
   * track, --feature-height of 36px — so all this has to do is centre the
   * control in it and take taps, which the tile's row does not.
   */
  .custom-inline {
    display: flex;
    flex-direction: column;
    justify-content: center;
    pointer-events: auto;
  }

  .warning {
    display: block;
    padding: var(--ha-space-3, 12px);
    color: var(--warning-color, #ffa600);
    font-size: var(--ha-font-size-m, 14px);
  }
`, Ke = /* @__PURE__ */ new Set(["unavailable", "unknown"]), cn = /* @__PURE__ */ new Set([
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
function xs(s) {
  const e = s?.attributes.device_class;
  if (!e || !cn.has(e)) return !1;
  const t = Number(s.state);
  return Number.isFinite(t) && t < 0;
}
const un = " · ";
function p(s, e) {
  if (!e) return;
  const t = s?.states[e];
  return {
    entityId: e,
    stateObj: t,
    missing: !t,
    unavailable: !!t && Ke.has(t.state),
    impossible: xs(t)
  };
}
function Es(s, e) {
  if (!(!s || !e || !e.stateObj || e.missing || e.unavailable) && !e.impossible)
    return s.formatEntityState(e.stateObj);
}
function Vt(s, e, t) {
  const n = e?.attributes[t];
  if (!(n == null || n === ""))
    return s?.formatEntityAttributeValue?.(e, t) ?? String(n);
}
function S(s) {
  return s.filter(
    (e) => !!e && (e.content !== void 0 || (e.text ?? "").trim() !== "")
  );
}
function F(s, e) {
  const t = Es(s, e);
  return t ? { text: t, entityId: e?.entityId } : void 0;
}
function U(s, e) {
  const t = Ge(s, e);
  return t ? { text: t, entityId: e?.entityId } : void 0;
}
function Ge(s, e) {
  if (!(!s || !e?.stateObj || !e.unavailable))
    return s.formatEntityState(e.stateObj);
}
function Y(s) {
  if (!s?.stateObj || s.impossible) return;
  const e = Number(s.stateObj.state);
  return Number.isFinite(e) ? e : void 0;
}
const hn = /* @__PURE__ */ new Set([
  "off",
  "false",
  "no",
  "none",
  "not charging",
  "no charge",
  "uncharged",
  "discharging",
  "full",
  "fully charged",
  "charged",
  // ha-smart-charging's socket sensor, whose vocabulary is closed and is
  // exactly idle / charging / cooldown / sleep / generic. Its own "charging"
  // is the only one of the five that means the current is flowing; without the
  // other four an idle socket would light every bar hanging off it.
  "idle",
  "cooldown",
  "sleep",
  "generic"
]);
function dn(s) {
  if (!s?.stateObj || s.missing || s.unavailable) return !1;
  const e = s.stateObj.state.trim().toLowerCase().replace(/[_-]+/g, " ");
  return !hn.has(e);
}
function Ye(s, e) {
  return s || (e?.stateObj?.attributes.friendly_name ?? e?.entityId ?? "");
}
function xt(s, e) {
  if (!e) return { value: s };
  if (!s.endsWith(e)) return { value: s };
  const t = s.slice(0, s.length - e.length).trimEnd();
  return t ? { value: t, unit: e } : { value: s };
}
const ot = "unavailable", mn = "unknown", pn = "off", fn = /* @__PURE__ */ new Set(["button", "input_button", "scene"]), gn = /* @__PURE__ */ new Set([
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
]), j = (s) => s.substring(0, s.indexOf(".")), ks = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "unknown";
function ze(s, e) {
  const t = j(s.entity_id), n = s.state;
  if (fn.has(t))
    return n !== ot;
  if (n === ot || n === mn || n === pn && t !== "alert")
    return !1;
  switch (t) {
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
const Cs = (s) => s.reduceRight(
  (e, t) => `var(${t}${e ? `, ${e}` : ""})`,
  void 0
), _n = (s) => {
  const e = Number(s);
  if (!isNaN(e))
    return e >= 70 ? "--state-sensor-battery-high-color" : e >= 30 ? "--state-sensor-battery-medium-color" : "--state-sensor-battery-low-color";
};
function vn(s, e) {
  if (!s) return e;
  if (s.state === ot)
    return "var(--state-unavailable-color)";
  const t = j(s.entity_id), n = s.attributes.device_class;
  if (t === "sensor" && n === "battery") {
    const a = _n(s.state);
    if (a) return `var(${a})`;
  }
  if (!gn.has(t))
    return e;
  const r = ze(s), i = ks(s.state), o = r ? "active" : "inactive", l = [];
  return n && l.push(`--state-${t}-${n}-${i}-color`), l.push(
    `--state-${t}-${i}-color`,
    `--state-${t}-${o}-color`,
    `--state-${o}-color`
  ), Cs(l);
}
const st = (s) => Math.round(s).toString(16).padStart(2, "0"), bn = ([s, e, t]) => {
  const n = Math.max(s, e, t), r = n - Math.min(s, e, t), i = r && (n === s ? (e - t) / r : n === e ? 2 + (t - s) / r : 4 + (s - e) / r);
  return [60 * (i < 0 ? i + 6 : i), n && r / n, n];
}, yn = ([s, e, t]) => {
  const n = (r) => {
    const i = (r + s / 60) % 6;
    return t - t * e * Math.max(Math.min(i, 4 - i, 1), 0);
  };
  return [n(5), n(3), n(1)];
};
function wn(s) {
  const e = s.attributes.rgb_color;
  if (!Array.isArray(e) || e.length < 3) return;
  const t = bn(e);
  t[1] < 0.4 && (t[1] < 0.1 ? t[2] = 225 : t[1] = 0.4);
  const [n, r, i] = yn(t);
  return `#${st(n)}${st(r)}${st(i)}`;
}
function N(s) {
  if (!s) return "var(--state-inactive-color)";
  if (j(s.entity_id) === "light" && ze(s)) {
    const t = wn(s);
    if (t) return t;
  }
  const e = vn(s);
  return e || (ze(s) ? "var(--state-icon-color)" : "var(--state-inactive-color)");
}
function me(s) {
  return s !== void 0 && s.action !== "none";
}
const $n = ["closed", "locked", "off"], xn = /* @__PURE__ */ new Set([
  "fan",
  "input_boolean",
  "light",
  "switch",
  "group",
  "automation",
  "humidifier",
  "valve"
]);
function ue(s) {
  if (!s) return { action: "none" };
  const e = j(s);
  return { action: xn.has(e) || ["button", "input_button", "scene"].includes(e) ? "toggle" : "none" };
}
const En = {
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
function kn(s, e) {
  const t = En[s];
  return t ? (e ? t.on : t.off) ?? t.on : e ? "turn_on" : "turn_off";
}
function Cn(s, e) {
  const t = s.states[e];
  if (!t) return;
  const n = j(e), r = n === "group" ? "homeassistant" : n, i = $n.includes(t.state);
  s.callService(r, kn(n, i), {
    entity_id: e
  });
}
function Kt(s, e, t) {
  s.dispatchEvent(
    new CustomEvent(e, { detail: t, bubbles: !0, composed: !0 })
  );
}
function Sn(s, e) {
  e ? window.history.replaceState(null, "", s) : window.history.pushState(null, "", s), window.dispatchEvent(new CustomEvent("location-changed", { detail: {} }));
}
async function An(s, e) {
  if (!e.confirmation) return !0;
  const t = window.loadCardHelpers;
  if (!t) return window.confirm(e.confirmation.text ?? "Are you sure?");
  const n = await t();
  return n.showConfirmationDialog ? n.showConfirmationDialog(s, {
    text: e.confirmation.text,
    title: e.confirmation.title,
    confirmText: e.confirmation.confirm_text,
    dismissText: e.confirmation.dismiss_text
  }) : window.confirm(e.confirmation.text ?? "Are you sure?");
}
async function Ss(s, e, t, n) {
  let r;
  if (n === "double_tap" ? r = t.double_tap_action : n === "hold" ? r = t.hold_action : r = t.tap_action, r || (r = { action: "more-info" }), !!await An(s, r))
    switch (r.action) {
      case "none":
        break;
      case "more-info": {
        const i = r.entity || t.entity;
        i && Kt(s, "hass-more-info", { entityId: i });
        break;
      }
      case "toggle": {
        const i = r.entity || t.entity;
        i && Cn(e, i);
        break;
      }
      case "navigate":
        r.navigation_path && Sn(r.navigation_path, r.navigation_replace);
        break;
      case "url":
        r.url_path && window.open(r.url_path, "_blank", "noreferrer");
        break;
      case "perform-action":
      case "call-service": {
        const i = r.perform_action || r.service;
        if (!i) break;
        const [o, l] = i.split(".", 2);
        e.callService(o, l, {
          ...r.data ?? r.service_data ?? {},
          ...r.target ?? {}
        });
        break;
      }
      case "fire-dom-event":
        Kt(s, "ll-custom", r);
        break;
      default:
        console.warn(
          `horos-cards: action "${r.action}" is not supported`
        );
    }
}
const Tn = 2;
function Gt(s, e) {
  const t = s ?? [];
  if (e !== "inline")
    return { inline: [], below: t, columns: 1 };
  const n = t.slice(1);
  return {
    inline: t.slice(0, 1),
    below: n,
    columns: Math.min(n.length, Tn)
  };
}
function On(s) {
  return Math.ceil(s.below.length / Math.max(s.columns, 1));
}
const Et = 5e3, Yt = [
  "ha-tile-container",
  "ha-tile-icon",
  "ha-tile-info",
  "hui-card-features"
], Xt = [
  "ha-control-button",
  "ha-control-button-group",
  "ha-control-select"
];
let Re, je, Me;
function kt(s, e) {
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
function Ct() {
  return Re || (Re = (async () => Yt.every((e) => customElements.get(e)) ? !0 : (await Pn(), (await Promise.all(
    Yt.map((e) => kt(e, Et))
  )).every(Boolean)))(), Re);
}
function As() {
  return je || (je = (async () => {
    if (Xt.every((n) => customElements.get(n))) return !0;
    await Ct();
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
      Xt.map((n) => kt(n, Et))
    );
    return e?.remove(), t.every(Boolean);
  })(), je);
}
function In() {
  return Me || (Me = (async () => {
    if (customElements.get("hui-card-features-editor")) return !0;
    await Ct();
    const s = customElements.get("hui-tile-card");
    try {
      await s?.getConfigElement?.();
    } catch {
    }
    return kt("hui-card-features-editor", Et);
  })(), Me);
}
const Ae = {
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
}, Rn = {
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
  "weather.noForecast": "прогноза на дни нет",
  "charge.title": "Зарядка",
  "charge.forced": "Принудительно · ещё {minutes} мин",
  "charge.pulse": "Нет данных · импульс",
  "charge.noData": "Нет данных с {time}",
  "charge.charging": "Заряжается до {max}%",
  "charge.waiting": "Включится ниже {min}%",
  "charge.on": "Заряжается",
  "charge.off": "Не заряжается",
  "charge.force": "30 мин",
  "charge.forceLeft": "{minutes} мин",
  "charge.every": "{hours} ч",
  "charge.everyLabel": "Импульс без данных раз в N часов; удерживать — настроить",
  "charge.min": "Мин.",
  "charge.max": "Макс.",
  "greenhouse.title": "Оранжерея",
  "greenhouse.thirsty.one": "{count} из {total} просит воды",
  "greenhouse.thirsty.few": "{count} из {total} просят воды",
  "greenhouse.thirsty.many": "{count} из {total} просят воды",
  "greenhouse.watered.one": "Политы, {count} растение",
  "greenhouse.watered.few": "Политы, {count} растения",
  "greenhouse.watered.many": "Политы, {count} растений",
  "greenhouse.soaked.one": "{count} залит",
  "greenhouse.soaked.few": "{count} залиты",
  "greenhouse.soaked.many": "{count} залито",
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
}, Le = {
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
  "weather.noForecast": "no daily forecast",
  "charge.title": "Charging",
  "charge.forced": "Forced · {minutes} min left",
  "charge.pulse": "No data · pulse",
  "charge.noData": "No data since {time}",
  "charge.charging": "Charging to {max}%",
  "charge.waiting": "Starts below {min}%",
  "charge.on": "Charging",
  "charge.off": "Not charging",
  "charge.force": "30 min",
  "charge.forceLeft": "{minutes} min",
  "charge.every": "{hours} h",
  "charge.everyLabel": "Blind pulse every N hours; hold to adjust",
  "charge.min": "Min",
  "charge.max": "Max",
  "greenhouse.title": "Greenhouse",
  "greenhouse.thirsty.one": "{count} of {total} needs water",
  "greenhouse.thirsty.many": "{count} of {total} need water",
  "greenhouse.watered.one": "Watered, {count} plant",
  "greenhouse.watered.many": "Watered, {count} plants",
  "greenhouse.soaked.one": "{count} overwatered",
  "greenhouse.soaked.many": "{count} overwatered",
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
}, Ts = { ru: Rn, en: Le };
function $(s) {
  const t = (s?.language ?? s?.locale?.language ?? "en").split("-")[0].toLowerCase();
  return t in Ts ? t : "en";
}
function jn(s, e) {
  if (s !== "ru") return e === 1 ? "one" : "many";
  const t = e % 10, n = e % 100;
  return t === 1 && n !== 11 ? "one" : t >= 2 && t <= 4 && (n < 12 || n > 14) ? "few" : "many";
}
function d(s, e, t = {}) {
  const n = $(s), r = Ts[n] ?? Le, i = t.count, o = typeof i == "number" ? `${e}.${jn(n, i)}` : void 0;
  return ((o && (r[o] ?? Le[o])) ?? r[e] ?? Le[e] ?? e).replace(
    /\{(\w+)\}/g,
    (a, c) => c in t ? String(t[c]) : a
  );
}
var Mn = Object.defineProperty, St = (s, e, t, n) => {
  for (var r = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(e, t, r) || r);
  return r && Mn(e, t, r), r;
};
class x extends ae {
  constructor() {
    super(...arguments), this._ready = !1, this.base = {};
  }
  static {
    this.styles = [W];
  }
  /**
   * How much room the content below the line takes, in layout rows: level rows,
   * features, controls of our own. A subclass overrides this if it has any.
   */
  contentRows() {
    return this.fixedRows();
  }
  /**
   * Layout rows for a list of level rows: three of them fit in one, and none of
   * them are there at all when the card's own line is switched off.
   *
   * Three, not two, because that is what a level row actually measures. A
   * layout row gives the content under the line 64px (56 of row plus the 8 of
   * gap it swallows); a row is a 12px line of text and an 8px bar — 14px — and
   * with a 4px gap between them and the stock 12px of padding under the last
   * one three come to 62. Counting two per row asked the grid for a whole
   * spare row and the card then stood in a hole a third of its height.
   */
  levelRows(e) {
    return this.base.levels === !1 ? 0 : Math.ceil(e / 3);
  }
  /**
   * The part of that content which cannot be squeezed.
   *
   * A list of level rows lives with whatever height it is given — it spreads or
   * crowds. A row of buttons or a slider is 42px and stays 42px, so a card that
   * has one must not be allowed to shrink under it. This is what `min_rows`
   * reports, and it is why the two numbers are counted separately.
   */
  fixedRows() {
    return this.featureRows([]);
  }
  /**
   * Rows taken by the features line, counted the way the stock tile counts
   * them. The user's list wins over the card's own, exactly as it does in
   * render, and the layout arithmetic is HA's own.
   */
  featureRows(e, t = !1) {
    const n = this.base.features ?? e;
    if (!n.length) return 0;
    const r = t ? "bottom" : this.base.features_position ?? "bottom";
    return On(Gt(n, r));
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
      // One row for the line plus whatever cannot be squeezed under it.
      min_rows: 1 + this.fixedRows()
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
    const n = t ? {
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
    Ss(this, this.hass, n, e);
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
  mainStateSegment(e, t) {
    if (!e?.stateObj || e.unavailable) return;
    const n = this.base.state_content ?? t;
    return !n && !this.base.time_format ? F(this.hass, e) : {
      entityId: e.entityId,
      content: v`<state-display
        .hass=${this.hass}
        .stateObj=${e.stateObj}
        .content=${n}
        .timeFormat=${this.base.time_format}
      ></state-display>`
    };
  }
  /** A message about entities that were not found, or undefined if all are there. */
  missingRolesWarning(e) {
    const t = e.filter((n) => !!n && n.missing).map((n) => n.entityId);
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
    const n = this.hass?.states[t]?.attributes.friendly_name ?? t;
    return v`<span
      role="button"
      tabindex="0"
      class="clickable"
      title=${n}
      aria-label=${n}
      @click=${(r) => {
      r.stopPropagation(), this.fireMoreInfo(t);
    }}
      @keydown=${(r) => {
      (r.key === "Enter" || r.key === " ") && (r.preventDefault(), r.stopPropagation(), this.fireMoreInfo(t));
    }}
      >${e}</span
    >`;
  }
  renderTile(e) {
    const {
      icon: t,
      color: n,
      primary: r,
      secondary: i,
      mainEntityId: o,
      imageUrl: l,
      defaultIconAction: a,
      values: c,
      ownFeatures: h,
      customFeatures: u,
      customInline: g
    } = e;
    if (this._entityId = o, this._defaultIconAction = a, !this._ready)
      return this.renderWarning(d(this.hass, "internals.failed"));
    const f = this._tileColor(n), y = this.base.icon_tap_action ?? a, D = me(y) || me(this.base.icon_hold_action) || me(this.base.icon_double_tap_action), w = this.base.features ?? h, B = this.base.features_position ?? "bottom", se = this.base.levels === !1 ? void 0 : u, ie = Gt(
      w,
      g ? "bottom" : B
    ), jt = typeof this.base.grid_options?.rows == "number";
    return this.toggleAttribute(
      "filled",
      jt && !!(se || ie.below.length)
    ), v`
      <ha-card style="--tile-color: ${f};">
        <ha-tile-container
          .featurePosition=${g ? "inline" : B}
          .vertical=${!!this.base.vertical}
          .fixedInfoHeight=${this.layout === "grid" && jt}
          .interactive=${!0}
          .actionHandlerOptions=${{
      hasHold: me(this.base.hold_action),
      hasDoubleClick: me(this.base.double_tap_action)
    }}
          @action=${this._handleAction}
        >
          <ha-tile-icon
            slot="icon"
            class=${l ? "image" : ""}
            .interactive=${D}
            .imageUrl=${l}
            .icon=${this.base.icon ?? t}
            .actionHandlerOptions=${{
      hasHold: me(this.base.icon_hold_action),
      hasDoubleClick: me(this.base.icon_double_tap_action)
    }}
            @action=${this._handleIconAction}
          ></ha-tile-icon>

          <div slot="info" class="info ${this.base.vertical ? "vertical" : ""}">
            <ha-tile-info>
              <span slot="primary">${r}</span>
              ${i?.length && !this.base.hide_state ? v`<span slot="secondary"
                    >${i.map(
      (J, et) => v`
                        ${et ? v`<span>${un}</span>` : m}${this.renderClickable(
        J.content ?? J.text,
        J.entityId
      )}
                      `
    )}</span
                  >` : m}
            </ha-tile-info>
            ${c?.length ? v`<div class="values of-${c.length}">
                  ${c.map(
      (J, et) => v`
                      ${et ? v`<span class="values-separator">/</span>` : m}
                      ${this.renderClickable(
        v`${J.icon ? v`<ha-icon
                              class="value-icon"
                              .icon=${J.icon}
                            ></ha-icon>` : m}${J.value}${J.unit ? v`<span class="unit"> ${J.unit}</span>` : m}`,
        J.entityId
      )}
                    `
    )}
                </div>` : m}
          </div>

          ${ie.inline.length ? v`<hui-card-features
                slot="features-inline"
                .hass=${this.hass}
                .context=${{ entity_id: o }}
                .color=${this.base.color}
                .features=${ie.inline}
                .position=${B}
              ></hui-card-features>` : m}
          ${g ? v`<div slot="features-inline" class="custom-inline">
                ${g}
              </div>` : m}
          ${se ? v`<div slot="features" class="custom-features">
                ${se}
              </div>` : m}
          ${ie.below.length ? v`<hui-card-features
                slot="features"
                .columns=${ie.columns}
                .hass=${this.hass}
                .context=${{ entity_id: o }}
                .color=${this.base.color}
                .features=${ie.below}
                .position=${"bottom"}
              ></hui-card-features>` : m}
        </ha-tile-container>
      </ha-card>
    `;
  }
  /**
   * The tile colour, by the stock tile's rule: a colour from the config counts
   * only while the entity is active — an inactive one is grey on the stock tile
   * and has to be grey here. A card assembled from a list of equal entities has
   * nothing to be active, so there its colour is taken at face value.
   */
  _tileColor(e) {
    const t = this._entityId ? this.hass?.states[this._entityId] : void 0;
    return this.base.color && (!t || ze(t)) ? Os(this.base.color) : e ?? "var(--state-inactive-color)";
  }
  /**
   * The values of the right-hand column. `icons` names a value by its role key:
   * without it two percentages in a row are indistinguishable.
   */
  bigValues(e, t = Ae) {
    return e.map((n) => {
      const r = this.formatted(n.role?.stateObj);
      return r ? {
        ...r,
        entityId: n.role?.entityId,
        icon: t[n.key]
      } : void 0;
    }).filter((n) => !!n);
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
    if (!(!this.hass || !e) && !Ke.has(e.state) && !xs(e))
      return xt(
        this.hass.formatEntityState(e),
        e.attributes.unit_of_measurement
      );
  }
}
St([
  V({ attribute: !1 })
], x.prototype, "hass");
St([
  V({ attribute: !1 })
], x.prototype, "layout");
St([
  b()
], x.prototype, "_ready");
function Os(s) {
  return /^(#|rgb|hsl|var\()/.test(s) ? s : s === "state" ? "var(--state-icon-color)" : `var(--${s}-color, var(--state-icon-color))`;
}
const Zt = 3;
function Z(s, e, t) {
  if (!s || s.length === 0)
    return typeof e == "string" ? [e] : [...e];
  if (s.length > Zt)
    throw new Error(
      `At most ${Zt} large values are allowed, got ${s.length}`
    );
  const n = s.filter((i) => !t.includes(i));
  if (n.length)
    throw new Error(
      `Unknown roles in big_values: ${n.join(", ")}. Allowed: ${t.join(", ")}`
    );
  const r = s.filter(
    (i, o) => s.indexOf(i) !== o
  );
  if (r.length)
    throw new Error(`Role listed twice: ${r.join(", ")}`);
  return s;
}
function X(s, e) {
  const t = e.map((r) => s.find((i) => i.key === r)).filter((r) => !!r), n = s.filter((r) => !e.includes(r.key));
  return { big: t, rest: n };
}
let Jt = !1;
function Nn(s) {
  Jt || (Jt = !0, console.warn(
    `horos-cards: card ${s} is already registered. The bundle looks to be attached to the dashboard twice — the copy that loaded first is the one running. Check the dashboard resources.`
  ));
}
function Qt() {
  const s = document.querySelector("home-assistant");
  return $(s?.hass);
}
function E(s, e, t) {
  if (customElements.get(s)) {
    Nn(s);
    return;
  }
  customElements.define(s, e), window.customCards = window.customCards ?? [], window.customCards.push({
    type: t.type,
    preview: t.preview,
    get name() {
      return typeof t.name == "string" ? t.name : t.name[Qt() === "ru" ? "ru" : "en"] ?? t.name.en;
    },
    get description() {
      return typeof t.description == "string" ? t.description : t.description[Qt() === "ru" ? "ru" : "en"] ?? t.description.en;
    },
    getEntitySuggestion: t.suggest
  });
}
function k(s, e) {
  customElements.get(s) || customElements.define(s, e);
}
const At = 20;
function Q(s, e) {
  return s.states[e]?.attributes.device_class;
}
function Xe(s, e) {
  return s.entities?.[e]?.hidden === !0;
}
function re(s, e) {
  const t = s.entities?.[e]?.device_id;
  if (!t || !s.entities) return [e];
  const n = Object.keys(s.entities).filter(
    (r) => r !== e && s.entities?.[r]?.device_id === t && !Xe(s, r) && s.states[r] !== void 0
  );
  return [e, ...n.sort()];
}
function H(s, e, t, ...n) {
  return e.find(
    (r) => j(r) === t && n.includes(Q(s, r) ?? "")
  );
}
function Te(s, ...e) {
  return s.find((t) => e.includes(j(t)));
}
function Oe(s, e, t, n, r = At, i = () => !0) {
  const o = Object.keys(s.states).filter(
    (a) => a !== e && j(a) === t && n.includes(Q(s, a) ?? "") && !Xe(s, a) && i(a)
  ).sort();
  return [...i(e) ? [e] : [], ...o].slice(0, r);
}
function es(s, e) {
  return s.entities?.[e]?.device_id !== void 0;
}
function le(s, e) {
  const t = s.entities?.[e];
  if (t)
    return t.area_id ? t.area_id : t.device_id ? s.devices?.[t.device_id]?.area_id : void 0;
}
function Tt(s, e, t, n = At) {
  const r = le(s, e);
  if (!r) return [];
  const i = Object.keys(s.states).filter(
    (l) => l !== e && j(l) === t && !Xe(s, l) && le(s, l) === r
  ).sort();
  return [...j(e) === t ? [e] : [], ...i].slice(0, n);
}
function Fn(s, e, t, n, r = At) {
  const i = (u) => n.indexOf(Q(s, u) ?? ""), o = Object.keys(s.states).filter(
    (u) => u !== e && j(u) === t && i(u) >= 0 && !Xe(s, u) && le(s, u) !== void 0
  ).sort((u, g) => i(u) - i(g) || u.localeCompare(g)), l = /* @__PURE__ */ new Map(), a = le(s, e);
  a && l.set(a, e);
  for (const u of o) {
    const g = le(s, u);
    l.has(g) || l.set(g, u);
  }
  const h = [...l.values()].filter((u) => u !== e);
  return [e, ...h].slice(0, r);
}
function L(s, e, t = {}) {
  const n = { type: s, ...t };
  for (const [r, i] of Object.entries(e))
    i && (n[r] = i);
  return { config: n };
}
function Pe(s) {
  return Object.values(s).filter(Boolean).length;
}
var Ln = Object.defineProperty, Hn = (s, e, t, n) => {
  for (var r = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(e, t, r) || r);
  return r && Ln(e, t, r), r;
};
const ts = [
  "temperature",
  "humidity",
  "illuminance",
  "pm25"
];
class Ps extends x {
  constructor() {
    super(...arguments), this._bigKeys = ["temperature"];
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Uo), document.createElement(
      "horos-climate-tile-editor"
    );
  }
  static getStubConfig() {
    return { temperature: "", humidity: "" };
  }
  setConfig(e) {
    if (!e.temperature)
      throw new Error("A temperature entity is required (temperature)");
    this._bigKeys = Z(
      e.big_values,
      "temperature",
      ts
    ), this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return m;
    const e = this._config, t = ts.map((l) => ({
      key: l,
      role: p(this.hass, e[l])
    })), n = this.missingRolesWarning(t.map((l) => l.role));
    if (n) return this.renderWarning(n);
    const { big: r, rest: i } = X(t, this._bigKeys), o = t[0].role;
    return this.renderTile({
      icon: "mdi:thermometer",
      color: N(o?.stateObj),
      primary: Ye(e.name, o),
      imageUrl: this.entityImage(o?.stateObj),
      defaultIconAction: ue(o?.entityId),
      secondary: S([
        U(this.hass, o),
        ...i.map((l) => F(this.hass, l.role))
      ]),
      mainEntityId: o?.entityId,
      values: this.bigValues(r)
    });
  }
}
Hn([
  b()
], Ps.prototype, "_config");
E("horos-climate-tile", Ps, {
  type: "horos-climate-tile",
  name: { ru: "Климат комнаты", en: "Room climate" },
  description: {
    ru: "Температура, влажность, освещённость и PM2.5 одной комнаты в одной плитке",
    en: "Temperature, humidity, illuminance and PM2.5 of one room in a single tile"
  },
  preview: !0,
  suggest: (s, e) => {
    if (j(e) !== "sensor") return null;
    const t = re(s, e), n = {
      temperature: H(s, t, "sensor", "temperature"),
      humidity: H(s, t, "sensor", "humidity"),
      illuminance: H(s, t, "sensor", "illuminance"),
      pm25: H(s, t, "sensor", "pm25")
    };
    return !n.temperature || Pe(n) < 2 ? null : L("custom:horos-climate-tile", n);
  }
});
var Dn = Object.defineProperty, Un = (s, e, t, n) => {
  for (var r = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(e, t, r) || r);
  return r && Dn(e, t, r), r;
};
const ss = ["switch", "power", "energy"];
function at(s) {
  return s?.toggle_button ? [{ type: "toggle" }] : [];
}
class Is extends x {
  constructor() {
    super(...arguments), this._bigKeys = ["power"];
  }
  fixedRows() {
    return this.featureRows(at(this._config));
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => zo), document.createElement("horos-plug-tile-editor");
  }
  static getStubConfig() {
    return { switch: "", power: "" };
  }
  setConfig(e) {
    if (!e.switch)
      throw new Error("A switch is required (switch)");
    this._bigKeys = Z(e.big_values, "power", ss), this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return m;
    const e = this._config, t = ss.map((a) => ({
      key: a,
      role: p(this.hass, e[a])
    })), n = this.missingRolesWarning(t.map((a) => a.role));
    if (n) return this.renderWarning(n);
    const { big: r, rest: i } = X(t, this._bigKeys), o = t[0].role, l = o.entityId;
    return this.renderTile({
      icon: "mdi:power-plug",
      color: N(o.stateObj),
      primary: Ye(e.name, o),
      secondary: S([
        // One of the two returns a piece: an available switch gives its state,
        // an unavailable one its unavailability status.
        U(this.hass, o),
        // The switch is the card's main entity, so its state can be shown
        // through state_content, just like on the stock tile.
        ...i.map(
          (a) => a.key === "switch" ? this.mainStateSegment(a.role) : F(this.hass, a.role)
        )
      ]),
      mainEntityId: l,
      imageUrl: this.entityImage(o.stateObj),
      defaultIconAction: ue(l),
      values: this.bigValues(r),
      ownFeatures: at(e)
    });
  }
}
Un([
  b()
], Is.prototype, "_config");
E("horos-plug-tile", Is, {
  type: "horos-plug-tile",
  name: { ru: "Розетка", en: "Smart plug" },
  description: {
    ru: "Выключатель, текущая мощность и накопленная энергия в одной плитке",
    en: "Switch, current power draw and accumulated energy in a single tile"
  },
  preview: !0,
  suggest: (s, e) => {
    const t = re(s, e), n = {
      switch: Te(t, "switch"),
      power: H(s, t, "sensor", "power"),
      energy: H(s, t, "sensor", "energy")
    };
    return !n.switch || Pe(n) < 2 ? null : L("custom:horos-plug-tile", n);
  }
});
const We = 30, Be = 70;
function Rs(s, e, t) {
  return s === void 0 ? "unknown" : s < e ? "dry" : s > t ? "wet" : "ok";
}
const lt = {
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
var Wn = Object.defineProperty, Bn = (s, e, t, n) => {
  for (var r = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(e, t, r) || r);
  return r && Wn(e, t, r), r;
};
const rs = ["moisture", "temperature", "battery"];
function ct(s, e) {
  const t = s?.states[e?.moisture ?? ""]?.state, n = Number(t);
  return t === void 0 || !Number.isFinite(n) ? [] : [{ type: "bar-gauge", min: 0, max: 100 }];
}
class js extends x {
  constructor() {
    super(...arguments), this._bigKeys = ["moisture"];
  }
  fixedRows() {
    return this.featureRows(ct(this.hass, this._config));
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Wo), document.createElement(
      "horos-plant-tile-editor"
    );
  }
  static getStubConfig() {
    return { moisture: "" };
  }
  setConfig(e) {
    if (!e.moisture)
      throw new Error("A soil moisture entity is required (moisture)");
    const t = e.dry_below ?? We, n = e.wet_above ?? Be;
    if (t >= n)
      throw new Error("dry_below must be smaller than wet_above");
    this._bigKeys = Z(e.big_values, "moisture", rs), this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return m;
    const e = this._config, t = rs.map((c) => ({
      key: c,
      role: p(this.hass, e[c])
    })), n = this.missingRolesWarning(t.map((c) => c.role));
    if (n) return this.renderWarning(n);
    const { big: r, rest: i } = X(t, this._bigKeys), o = t[0].role, l = Y(o), a = Rs(
      l,
      e.dry_below ?? We,
      e.wet_above ?? Be
    );
    return this.renderTile({
      icon: zn[a],
      color: lt[a],
      primary: Ye(e.name, o),
      imageUrl: this.entityImage(o?.stateObj),
      defaultIconAction: ue(o?.entityId),
      secondary: S([
        U(this.hass, o),
        ...i.map((c) => F(this.hass, c.role))
      ]),
      mainEntityId: o?.entityId,
      values: this.bigValues(r),
      ownFeatures: ct(this.hass, e)
    });
  }
}
Bn([
  b()
], js.prototype, "_config");
E("horos-plant-tile", js, {
  type: "horos-plant-tile",
  name: { ru: "Растение", en: "Plant" },
  description: {
    ru: "Влажность почвы с порогами сухости, температура почвы и заряд датчика",
    en: "Soil moisture with dryness thresholds, soil temperature and sensor battery"
  },
  preview: !0,
  suggest: (s, e) => {
    if (j(e) !== "sensor" || Q(s, e) !== "moisture")
      return null;
    const t = re(s, e);
    return L("custom:horos-plant-tile", {
      moisture: e,
      temperature: H(s, t, "sensor", "temperature"),
      battery: H(s, t, "sensor", "battery")
    });
  }
});
var qn = Object.defineProperty, Ze = (s, e, t, n) => {
  for (var r = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(e, t, r) || r);
  return r && qn(e, t, r), r;
};
class Ie extends ae {
  constructor() {
    super(...arguments), this._children = [];
  }
  static {
    this.styles = ce`
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
    const t = await e(), n = this.headingConfig();
    this._heading = n ? t.createCardElement(n) : void 0, this._children = this.childConfigs().map(
      (r) => t.createCardElement(r)
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
Ze([
  V({ attribute: !1 })
], Ie.prototype, "hass");
Ze([
  b()
], Ie.prototype, "_heading");
Ze([
  b()
], Ie.prototype, "_children");
Ze([
  b()
], Ie.prototype, "_error");
function Ms(s) {
  if (!s) return;
  const e = s.split(":").pop();
  return e ? e.trim() : s;
}
function Vn(s) {
  return typeof s == "string" ? { entity: s } : s;
}
var Kn = Object.defineProperty, Gn = (s, e, t, n) => {
  for (var r = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(e, t, r) || r);
  return r && Kn(e, t, r), r;
};
const Yn = 3;
class Ns extends Ie {
  static async getConfigElement() {
    return await Promise.resolve().then(() => Bo), document.createElement(
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
    return this._config?.columns ?? Yn;
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
      const t = Vn(e), n = this.hass?.states[t.entity];
      return {
        type: "button",
        entity: t.entity,
        name: t.name ?? Ms(n?.attributes.friendly_name),
        icon: t.icon,
        show_state: !1,
        tap_action: { action: "toggle" }
      };
    }) : [];
  }
}
Gn([
  b()
], Ns.prototype, "_config");
E("horos-buttons-tile", Ns, {
  type: "horos-buttons-tile",
  name: { ru: "Кнопки скриптов", en: "Script buttons" },
  description: {
    ru: "Сетка кнопок, вызывающих скрипты, под общим заголовком",
    en: "A grid of buttons running scripts, under one heading"
  },
  preview: !0
});
const rt = (s) => Math.max(0, Math.min(100, s)), K = ce`
  /*
   * The rows fill whatever height they are given and spread evenly in it —
   * the same thing hui-card-features does with its own spare room, so a list
   * of rows and a stack of features behave alike on a card of a fixed height.
   *
   * Three columns for the whole list, not three parts of each row: the value
   * column is then as wide as the widest value there is, and every bar ends at
   * the same place. Rows that sized their own value drew a ragged right edge —
   * a week of weather whose "11 / 23.7 °C" is a character shorter than its
   * neighbours pushed that day's bar further right than the rest, and six bars
   * meant to be read as one scale no longer shared an end.
   *
   * The value itself is one string against the right edge. Splitting it round
   * its sign to stand the arrows in a line was tried: it left a hole after the
   * sign wherever the halves differed in width, and read worse than arrows a
   * digit apart.
   */
  .levels {
    display: grid;
    grid-template-columns: var(--level-name, 34%) minmax(0, 1fr) auto;
    align-content: space-evenly;
    row-gap: var(--ha-space-1, 4px);
    column-gap: var(--ha-space-2, 8px);
    height: 100%;
    min-height: 0;
  }

  /*
   * A row is its line of text and nothing more — no padding of its own.
   *
   * Three rows have to fit in one layout row, which is 64px of content: 3 * 14
   * of text plus two 4px gaps and the 12px of padding under the last one comes
   * to 62. Padding on the row itself pushed that to 74, and a card told to be
   * two rows tall then had its list spill over the bottom edge — the padding
   * under the last bar disappeared and the bar sat on the card's border.
   *
   * padding: 0 is written out because a button without it takes the browser's
   * own 1px 6px and the bars stop lining up with the texts above.
   */
  .level {
    display: grid;
    grid-column: 1 / -1;
    /* The row borrows the list's columns, so they line up across rows. */
    grid-template-columns: subgrid;
    align-items: center;
    width: 100%;
    padding: 0;
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
   * One width for every row, not auto: otherwise names of different lengths
   * drag the bars around and the list stops reading as one scale. A fraction
   * of the row by default, because a name is as long as the card is wide; a
   * card with short labels sets --level-name to a length of its own.
   */
  .level .name {
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

  /* The row's own glyph is not an alarm and is not painted like one. */
  .level .name ha-icon.mark {
    color: var(--ink);
  }

  /*
   * The bar as in the stock hui-bar-gauge-card-feature, only thinner.
   *
   * The fill is placed on the track rather than sitting before it in the row:
   * a span has to start away from the left edge, and a bar laid out as a box in
   * the line could only grow from it.
   */
  .level .bar {
    position: relative;
    min-width: 0;
    height: 8px;
    border-radius: var(--ha-border-radius-pill, 9999px);
  }

  /*
   * The track is a pill in its own right, for the same reason the fill is: the
   * bar does not clip its children, and a track relying on a clip came out a
   * rectangle with knife-cut ends under rounded fills.
   */
  .level .bar .track {
    position: absolute;
    inset: 0;
    border-radius: var(--ha-border-radius-pill, 9999px);
    background-color: var(--ink);
    opacity: 0.2;
  }

  /*
   * The fill is a pill of its own, not a rectangle the track happens to round
   * off. Clipping alone rounds only the end that touches the track's edge, so
   * a battery bar came out with a knife-cut right end while a weather span next
   * to it was rounded at both — one list of bars, two shapes.
   */
  .level .bar .fill {
    position: absolute;
    top: 0;
    bottom: 0;
    border-radius: var(--ha-border-radius-pill, 9999px);
    background-color: var(--ink);
    transition:
      width 400ms ease-in-out,
      inset-inline-start 400ms ease-in-out;
  }

  /*
   * A span is never thinner than it is tall: a day whose night and afternoon
   * are the same would otherwise have no bar at all. A level starts at zero and
   * has no such floor — an empty tank must be able to show nothing.
   */
  .level .bar .fill.span {
    min-width: 8px;
  }

  /*
   * Charging: a shimmer runs along the fill.
   *
   * Taken as is from ha-smart-charging, which draws its own battery bars on the
   * same dashboards: a soft white band twice the width of the bar, drifting at
   * an even pace. Two plugins of ours must not have two different ways of
   * saying "charging" next to each other. What is deliberately not taken is
   * that card's pulsing thumb at the end of the fill — a level row is a scale
   * to be read, not a slider to be dragged.
   */
  .level .bar .fill.charging {
    background-image: linear-gradient(
      90deg,
      rgb(255 255 255 / 0) 0%,
      rgb(255 255 255 / 0.3) 50%,
      rgb(255 255 255 / 0) 100%
    );
    background-size: 200% 100%;
    animation: level-charging 2s linear infinite;
  }

  @keyframes level-charging {
    from {
      background-position: 200% 0;
    }
    to {
      background-position: -200% 0;
    }
  }

  .level .value {
    min-width: 3.2em;
    text-align: end;
    font-size: var(--ha-font-size-s, 12px);
    color: var(--primary-text-color);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .level.low .value {
    color: var(--error-color, #db4437);
  }

  @media (prefers-reduced-motion: reduce) {
    .level .bar .fill {
      transition: none;
    }

    /* Motion is off, but charging still has to be visible: the band stands still. */
    .level .bar .fill.charging {
      animation: none;
    }
  }
`;
function G(s, e, t) {
  return v`
    <div
      class="levels"
      style=${t?.nameWidth ? `--level-name: ${t.nameWidth};` : m}
    >
      ${s.map(
    (n) => v`
          <button
            class="level ${n.alarm ? "low" : ""}"
            style="--ink: ${n.ink};"
            title="${n.name}: ${n.text}"
            @click=${(r) => {
      r.stopPropagation(), e(n.entityId);
    }}
          >
            <span class="name">
              ${n.alarm ? v`<ha-icon
                    icon=${n.alarmIcon ?? "mdi:alert-circle"}
                  ></ha-icon>` : n.icon ? v`<ha-icon class="mark" icon=${n.icon}></ha-icon>` : m}${n.name}
            </span>
            <span class="bar">
              <span class="track"></span>
              <span
                class="fill ${n.from === void 0 ? "" : "span"} ${n.charging ? "charging" : ""}"
                style="inset-inline-start: ${rt(
      n.from ?? 0
    )}%; width: ${Math.max(
      0,
      rt(n.level) - rt(n.from ?? 0)
    )}%"
              ></span>
            </span>
            <span class="value">${n.text}</span>
          </button>
        `
  )}
    </div>
  `;
}
function he(s, e) {
  if (s) {
    if (e && s.startsWith(e)) {
      const t = s.slice(e.length).trim();
      if (t) return t;
    }
    return s;
  }
}
function Fs(s) {
  return s ? s.replace(/[\s—-]*(battery(\s+level)?|заряд)\s*$/i, "").trim() || s : void 0;
}
function Xn(s) {
  return s ? s.replace(
    /[\s—-]*(soil\s+)?(moisture|влажность(\s+почвы)?)\s*$/i,
    ""
  ).trim() || s : void 0;
}
function _e(s) {
  return s === void 0 ? "var(--state-unavailable-color)" : s >= 70 ? "var(--state-sensor-battery-high-color, #4caf50)" : s >= 30 ? "var(--state-sensor-battery-medium-color, #ffa600)" : "var(--state-sensor-battery-low-color, #db4437)";
}
const Zn = _e;
function Jn(s) {
  return s === void 0 ? "var(--state-unavailable-color)" : s >= 90 ? "var(--error-color, #db4437)" : s >= 80 ? "var(--warning-color, #ffa600)" : "var(--state-icon-color)";
}
function M(s) {
  return typeof s == "string" ? { entity: s } : s;
}
const Qn = [
  [/black|pgbk|_bk(_|$)/i, "black"],
  [/cyan/i, "cyan"],
  [/magenta/i, "purple"],
  [/yellow/i, "yellow"],
  // MC is the maintenance tank, not ink. It gets its own shade, otherwise it is
  // indistinguishable from black: that one is painted in the text colour and
  [/_mc(_|$)|maintenance/i, "blue-grey"]
];
function ei(s) {
  return Qn.find(([t]) => t.test(s))?.[1];
}
function ti(s) {
  return s === "black" ? "var(--primary-text-color)" : /^(#|rgb|hsl|var\()/.test(s) ? s : `var(--${s}-color, var(--state-icon-color))`;
}
const si = he, ns = (s, e) => typeof s == "number" && Number.isFinite(s) ? s : e;
function ri(s, e, t) {
  const n = Number(s);
  if (!Number.isFinite(n)) return;
  const r = ns(e.marker_high_level, 100), i = ns(e.marker_low_level, 0), o = String(e.marker_type ?? "").includes("waste"), l = r > 0 ? Math.max(0, Math.min(100, n / r * 100)) : 0, a = o ? n >= r : n <= (t ?? i);
  return { fill: l, alarm: a, fills: o };
}
var ni = Object.defineProperty, ii = (s, e, t, n) => {
  for (var r = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(e, t, r) || r);
  return r && ni(e, t, r), r;
};
class Ls extends x {
  static {
    this.styles = [W, K];
  }
  /** Level rows under the tile: roughly two per grid row. */
  contentRows() {
    return this.levelRows(
      (this._config?.cartridges.length ?? 0) + (this._config?.sensors?.length ?? 0)
    ) + this.fixedRows();
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => qo), document.createElement(
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
      const n = this.hass.states[t.entity];
      return {
        entityId: t.entity,
        name: t.name ?? si(n?.attributes.friendly_name, e),
        ink: ti(
          t.color ?? ei(t.entity) ?? "grey"
        ),
        marker: n ? ri(
          n.state,
          n.attributes,
          this._config.low_below
        ) : void 0,
        text: n ? this.hass.formatEntityState(n) : "—"
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
    const r = e.filter((a) => a.marker && !a.marker.fills).reduce(
      (a, c) => !a || c.marker.fill < a.marker.fill ? c : a,
      void 0
    ), i = this._config.status ? p(this.hass, this._config.status) : void 0, o = (this._config.sensors ?? []).map((a) => M(a)).map((a) => p(this.hass, a.entity)), l = i?.stateObj;
    return this.renderTile({
      icon: "mdi:printer",
      color: l ? N(l) : "var(--state-icon-color)",
      primary: this._printerName ?? d(this.hass, "printer.title"),
      secondary: S([
        F(this.hass, i),
        ...o.map((a) => F(this.hass, a))
      ]),
      mainEntityId: this._config.status ?? r?.entityId,
      values: r ? [
        {
          value: String(Math.round(r.marker.fill)),
          unit: "%",
          entityId: r.entityId,
          icon: "mdi:water"
        }
      ] : [],
      customFeatures: G(
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
ii([
  b()
], Ls.prototype, "_config");
E("horos-printer-tile", Ls, {
  type: "horos-printer-tile",
  name: { ru: "Принтер", en: "Printer" },
  description: {
    ru: "Уровни чернил и состояние принтера в одной плитке",
    en: "Ink levels and printer status in a single tile"
  },
  preview: !0,
  suggest: (s, e) => {
    const t = re(s, e), n = t.filter(
      (i) => s.states[i]?.attributes.marker_type !== void 0
    );
    if (!n.length) return null;
    const r = t.find(
      (i) => j(i) === "sensor" && !n.includes(i) && Number.isNaN(Number(s.states[i]?.state))
    );
    return L(
      "custom:horos-printer-tile",
      { status: r },
      { cartridges: n }
    );
  }
});
var oi = Object.defineProperty, ai = (s, e, t, n) => {
  for (var r = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(e, t, r) || r);
  return r && oi(e, t, r), r;
};
const li = 20;
class Hs extends x {
  static {
    this.styles = [W, K];
  }
  /** Level rows under the tile: roughly two per grid row. */
  contentRows() {
    return this.levelRows(this._config?.consumables?.length ?? 0) + this.fixedRows();
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Vo), document.createElement(
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
    const e = this._config, t = p(this.hass, e.vacuum), n = p(this.hass, e.battery), r = (e.sensors ?? []).map((c) => M(c)).map((c) => p(this.hass, c.entity)), i = this.missingRolesWarning([t, n, ...r]);
    if (i) return this.renderWarning(i);
    const o = t?.stateObj?.attributes.friendly_name, l = e.low_below ?? li, a = (e.consumables ?? []).map((c) => M(c)).map((c) => {
      const h = p(this.hass, c.entity), u = Y(h) ?? 0, g = c.name ?? he(h?.stateObj?.attributes.friendly_name, o);
      return {
        entityId: c.entity,
        name: g ?? c.entity,
        text: `${u}%`,
        // Painting them in the tile colour is wrong: a docked vacuum's colour
        // is the inactive one and every bar comes out the same grey. We paint
        // by level — a consumable asks the same question a battery does.
        ink: c.color ?? _e(u),
        level: u,
        alarm: u < l
      };
    });
    return this.renderTile({
      icon: "mdi:robot-vacuum",
      color: N(t?.stateObj),
      primary: e.name ?? o ?? d(this.hass, "vacuum.title"),
      mainEntityId: t?.entityId,
      secondary: S([
        U(this.hass, t),
        this.mainStateSegment(t),
        ...r.map((c) => F(this.hass, c))
      ]),
      values: n ? this.bigValues([{ key: "battery", role: n }]) : [],
      customFeatures: a.length ? G(a, (c) => this.fireMoreInfo(c)) : void 0
    });
  }
}
ai([
  b()
], Hs.prototype, "_config");
E("horos-vacuum-tile", Hs, {
  type: "horos-vacuum-tile",
  name: { ru: "Пылесос", en: "Vacuum" },
  description: {
    ru: "Состояние робота, заряд и ресурс расходников в одной плитке",
    en: "Robot status, battery and consumable life in a single tile"
  },
  preview: !0,
  suggest: (s, e) => {
    const t = re(s, e), n = Te(t, "vacuum"), r = H(s, t, "sensor", "battery");
    return !n || !r ? null : L("custom:horos-vacuum-tile", { vacuum: n, battery: r });
  }
});
var ci = Object.defineProperty, ui = (s, e, t, n) => {
  for (var r = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(e, t, r) || r);
  return r && ci(e, t, r), r;
};
const hi = 30;
class Ds extends x {
  static async getConfigElement() {
    return await Promise.resolve().then(() => Ko), document.createElement(
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
    const e = this._config, t = e.low_below ?? hi, n = [], r = [];
    for (const l of e.batteries) {
      const a = M(l), c = p(this.hass, a.entity);
      if (c?.missing) {
        r.push(a.entity);
        continue;
      }
      const h = Y(c);
      h !== void 0 && n.push({
        entityId: a.entity,
        name: a.name ?? Fs(c?.stateObj?.attributes.friendly_name) ?? a.entity,
        level: h
      });
    }
    const i = n.filter((l) => l.level < t).sort((l, a) => l.level - a.level), o = i[0];
    return this.renderTile({
      icon: o ? "mdi:battery-alert-variant-outline" : "mdi:battery",
      color: Zn(o?.level),
      primary: e.name ?? d(this.hass, "batteries.title"),
      mainEntityId: o?.entityId,
      secondary: S([
        ...i.length ? i.map((l) => ({
          text: `${l.name} ${l.level}%`,
          entityId: l.entityId
        })) : [
          {
            text: d(this.hass, "batteries.allFull", {
              count: n.length
            })
          }
        ],
        // A row that disappeared is dropped, but staying silent about it is not
        // an option: a list card must not go dark over one renamed entity, and
        // must not pretend the entity was never there.
        ...r.length ? [{ text: d(this.hass, "list.missing", { count: r.length }) }] : []
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
ui([
  b()
], Ds.prototype, "_config");
E("horos-batteries-tile", Ds, {
  type: "horos-batteries-tile",
  name: { ru: "Батарейки", en: "Batteries" },
  description: {
    ru: "Только садящиеся батарейки, от самой пустой",
    en: "Only the batteries that are running down, emptiest first"
  },
  preview: !0,
  suggest: (s, e) => j(e) !== "sensor" || Q(s, e) !== "battery" ? null : L(
    "custom:horos-batteries-tile",
    {},
    { batteries: Oe(s, e, "sensor", ["battery"]) }
  )
});
var di = Object.defineProperty, mi = (s, e, t, n) => {
  for (var r = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(e, t, r) || r);
  return r && di(e, t, r), r;
};
class Us extends x {
  static async getConfigElement() {
    return await Promise.resolve().then(() => Go), document.createElement(
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
    const e = this._config, t = [], n = [], r = [];
    let i = 0;
    for (const a of e.sensors) {
      const c = M(a), h = p(this.hass, c.entity);
      if (h?.missing) {
        r.push(c.entity);
        continue;
      }
      i += 1;
      const u = c.name ?? h?.stateObj?.attributes.friendly_name ?? c.entity;
      h?.unavailable ? n.push({ text: d(this.hass, "safety.offline", { name: u }), entityId: c.entity }) : h?.stateObj?.state === "on" && t.push({ text: u, entityId: c.entity });
    }
    const o = t.length > 0, l = [...t, ...n];
    return this.renderTile({
      icon: o ? "mdi:shield-alert" : n.length ? "mdi:shield-off-outline" : "mdi:shield-check",
      color: o ? "var(--error-color, #db4437)" : n.length ? "var(--warning-color, #ffa600)" : "var(--success-color, #43a047)",
      primary: e.name ?? d(this.hass, "safety.title"),
      mainEntityId: l[0]?.entityId,
      secondary: S([
        ...l.length ? l : [{ text: d(this.hass, "safety.calm", { count: i }) }],
        ...r.length ? [{ text: d(this.hass, "list.missing", { count: r.length }) }] : []
      ])
    });
  }
}
mi([
  b()
], Us.prototype, "_config");
E("horos-safety-tile", Us, {
  type: "horos-safety-tile",
  name: { ru: "Безопасность", en: "Safety" },
  description: {
    ru: "Протечка, дым, газ — и датчики, потерявшие связь",
    en: "Leak, smoke, gas — and sensors that lost connection"
  },
  preview: !0,
  suggest: (s, e) => {
    const t = ["moisture", "gas", "smoke", "carbon_monoxide", "safety"];
    return j(e) !== "binary_sensor" || !t.includes(Q(s, e) ?? "") ? null : L(
      "custom:horos-safety-tile",
      {},
      { sensors: Oe(s, e, "binary_sensor", t) }
    );
  }
});
var pi = Object.defineProperty, fi = (s, e, t, n) => {
  for (var r = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(e, t, r) || r);
  return r && pi(e, t, r), r;
};
const is = ["disk", "download", "upload"];
class zs extends x {
  constructor() {
    super(...arguments), this._bigKeys = ["disk"];
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Yo), document.createElement(
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
    this._bigKeys = Z(e.big_values, "disk", is), this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return m;
    const e = this._config, t = is.map((a) => ({
      key: a,
      role: p(this.hass, e[a])
    })), n = p(this.hass, e.status), r = (e.services ?? []).map((a) => M(a)).map((a) => p(this.hass, a.entity)), i = this.missingRolesWarning([
      n,
      ...t.map((a) => a.role),
      ...r
    ]);
    if (i) return this.renderWarning(i);
    const { big: o, rest: l } = X(t, this._bigKeys);
    return this.renderTile({
      icon: "mdi:server",
      color: n ? N(n.stateObj) : "var(--state-icon-color)",
      primary: e.name ?? d(this.hass, "server.title"),
      mainEntityId: n?.entityId ?? t[0].role?.entityId,
      secondary: S([
        U(this.hass, n),
        this.mainStateSegment(n),
        ...l.map((a) => {
          const c = F(this.hass, a.role);
          if (!c) return;
          const h = a.key === "download" ? "↓ " : a.key === "upload" ? "↑ " : "";
          return { ...c, text: h + c.text };
        }),
        ...r.map((a) => F(this.hass, a))
      ]),
      values: this.bigValues(o)
    });
  }
}
fi([
  b()
], zs.prototype, "_config");
E("horos-server-tile", zs, {
  type: "horos-server-tile",
  name: { ru: "Домашний сервер", en: "Home server" },
  description: {
    ru: "Диск, скорости и состояние сервисов в одной плитке",
    en: "Disk, speeds and service status in a single tile"
  },
  preview: !0
});
var gi = Object.defineProperty, _i = (s, e, t, n) => {
  for (var r = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(e, t, r) || r);
  return r && gi(e, t, r), r;
};
class Ws extends x {
  static {
    this.styles = [
      W,
      K,
      ce`
      span[slot="secondary"] {
        white-space: normal;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      span[slot="secondary"] .clickable {
        text-align: left;
        display: inline;
      }
    `
    ];
  }
  /** Level rows under the tile: roughly two per grid row. */
  contentRows() {
    return this.levelRows(this._config?.devices?.length ?? 0) + this.fixedRows();
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Xo), document.createElement(
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
    const e = this._config, t = p(this.hass, e.person), n = p(this.hass, e.battery), r = p(this.hass, e.location), i = this.missingRolesWarning([t, n, r]);
    if (i) return this.renderWarning(i);
    const o = (e.devices ?? []).map((l) => M(l)).map((l) => {
      const a = p(this.hass, l.entity), c = Y(a), h = l.name ?? Fs(
        he(
          a?.stateObj?.attributes.friendly_name,
          e.name
        )
      ) ?? l.entity, u = dn(p(this.hass, l.charging));
      return {
        entityId: l.entity,
        name: h,
        text: c === void 0 ? d(this.hass, "value.unknown") : `${c}%`,
        ink: l.color ?? _e(c),
        level: c ?? 0,
        alarm: c !== void 0 && c < 20,
        alarmIcon: "mdi:battery-alert-variant-outline",
        charging: u
      };
    });
    return this.renderTile({
      icon: "mdi:account",
      color: N(t?.stateObj),
      primary: e.name ?? t?.stateObj?.attributes.friendly_name ?? d(this.hass, "person.title"),
      mainEntityId: t?.entityId,
      imageUrl: this.entityImage(t?.stateObj),
      secondary: S([
        U(this.hass, t),
        this.mainStateSegment(t),
        F(this.hass, r)
      ]),
      values: n ? this.bigValues([{ key: "battery", role: n }]) : [],
      customFeatures: o.length ? G(o, (l) => this.fireMoreInfo(l)) : void 0
    });
  }
}
_i([
  b()
], Ws.prototype, "_config");
E("horos-person-tile", Ws, {
  type: "horos-person-tile",
  name: { ru: "Человек", en: "Person" },
  description: {
    ru: "Дома ли он, где именно и заряд его устройств",
    en: "Whether they are home, where exactly, and their devices' battery"
  },
  preview: !0,
  suggest: (s, e) => {
    if (j(e) !== "person") return null;
    const n = (s.states[e]?.attributes.device_trackers ?? []).map((r) => H(s, re(s, r), "sensor", "battery")).find(Boolean);
    return n ? L("custom:horos-person-tile", {
      person: e,
      battery: n
    }) : null;
  }
});
function nt(s, e, t) {
  if (!s || !e?.length) return;
  let n, r;
  for (const i of e) {
    const o = p(s, i), l = Y(o);
    l !== void 0 && (r === void 0 || (t === "max" ? l > r : l < r)) && (n = o, r = l);
  }
  return n ?? p(s, e[0]);
}
var vi = Object.defineProperty, bi = (s, e, t, n) => {
  for (var r = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(e, t, r) || r);
  return r && vi(e, t, r), r;
};
const yi = [
  "temperature",
  "cpu",
  "memory",
  "gpu",
  "disk"
];
class Bs extends x {
  constructor() {
    super(...arguments), this._bigKeys = ["temperature"];
  }
  static {
    this.styles = [W, K];
  }
  /** Level rows under the tile: roughly two per grid row. */
  contentRows() {
    return this.levelRows(4) + this.fixedRows();
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Zo), document.createElement(
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
    this._bigKeys = Z(
      e.big_values,
      "temperature",
      yi
    ), this.base = e, this._config = e;
  }
  /** The card's roles: the lists are already reduced to their extreme sensor. */
  _roles() {
    const e = this._config;
    return [
      {
        key: "temperature",
        role: nt(this.hass, e.temperatures, "max")
      },
      { key: "cpu", role: p(this.hass, e.cpu) },
      { key: "memory", role: p(this.hass, e.memory) },
      { key: "gpu", role: p(this.hass, e.gpu) },
      { key: "disk", role: nt(this.hass, e.disks, "max") }
    ];
  }
  /** The partition with the least free space left. */
  _freeDisk() {
    return nt(this.hass, this._config?.disks_free, "min");
  }
  _levelRow(e, t) {
    if (!t) return;
    const n = Y(t);
    return {
      entityId: t.entityId,
      name: e,
      text: n === void 0 ? d(this.hass, "value.unknown") : `${Math.round(n)}%`,
      ink: Jn(n),
      level: n ?? 0,
      alarm: n !== void 0 && n >= 90,
      alarmIcon: "mdi:alert-circle"
    };
  }
  render() {
    if (!this._config || !this.hass) return m;
    const e = this._config, t = this._roles(), n = p(this.hass, e.status), r = (e.sensors ?? []).map((u) => M(u)).map((u) => p(this.hass, u.entity)), i = this.missingRolesWarning([
      n,
      ...t.map((u) => u.role),
      ...r
    ]);
    if (i) return this.renderWarning(i);
    const o = (e.alerts ?? []).map((u) => M(u)).map((u) => ({ alert: u, role: p(this.hass, u.entity) })).filter(({ role: u }) => u?.stateObj?.state === "on").map(({ alert: u, role: g }) => ({
      text: u.name ?? he(
        g?.stateObj?.attributes.friendly_name,
        e.name
      ) ?? u.entity,
      entityId: u.entity
    })), { big: l } = X(t, this._bigKeys), a = this._freeDisk(), c = Y(a), h = [
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
        ink: _e(c),
        level: c ?? 0,
        alarm: c !== void 0 && c < 10,
        alarmIcon: "mdi:harddisk"
      } : void 0
    ].filter((u) => !!u);
    return this.renderTile({
      icon: "mdi:desktop-tower-monitor",
      color: n ? N(n.stateObj) : "var(--state-icon-color)",
      primary: e.name ?? d(this.hass, "computer.title"),
      mainEntityId: n?.entityId ?? t[0].role?.entityId ?? a?.entityId,
      secondary: S([
        U(this.hass, n),
        ...o,
        ...r.map((u) => F(this.hass, u)),
        // Load and disks are already shown as bars with their own labels.
        ...this._bigKeys.includes("temperature") ? [] : [F(this.hass, t[0].role)]
      ]),
      values: this.bigValues(l),
      customFeatures: h.length ? G(h, (u) => this.fireMoreInfo(u)) : void 0
    });
  }
}
bi([
  b()
], Bs.prototype, "_config");
E("horos-computer-tile", Bs, {
  type: "horos-computer-tile",
  name: { ru: "Компьютер", en: "Computer" },
  description: {
    ru: "Самая горячая точка, загрузка и диски в одной плитке",
    en: "Hottest spot, load and disks in a single tile"
  },
  preview: !0
});
var wi = Object.defineProperty, $i = (s, e, t, n) => {
  for (var r = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(e, t, r) || r);
  return r && wi(e, t, r), r;
};
const os = ["pm25", "humidity", "temperature", "power"];
class qs extends x {
  constructor() {
    super(...arguments), this._bigKeys = ["pm25"];
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Jo), document.createElement("horos-air-tile-editor");
  }
  static getStubConfig() {
    return { appliance: "" };
  }
  setConfig(e) {
    if (!e.appliance)
      throw new Error("An appliance is required (appliance)");
    this._bigKeys = Z(e.big_values, "pm25", os), this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return m;
    const e = this._config, t = p(this.hass, e.appliance), n = os.map((c) => ({
      key: c,
      role: p(this.hass, e[c])
    })), r = (e.sensors ?? []).map((c) => M(c)).map((c) => p(this.hass, c.entity)), i = this.missingRolesWarning([
      t,
      ...n.map((c) => c.role),
      ...r
    ]);
    if (i) return this.renderWarning(i);
    const o = (e.alerts ?? []).map((c) => M(c)).map((c) => ({ alert: c, role: p(this.hass, c.entity) })).filter(({ role: c }) => c?.stateObj?.state === "on").map(({ alert: c, role: h }) => ({
      text: c.name ?? he(
        h?.stateObj?.attributes.friendly_name,
        e.name
      ) ?? c.entity,
      entityId: c.entity
    })), { big: l, rest: a } = X(n, this._bigKeys);
    return this.renderTile({
      icon: e.humidity ? "mdi:air-humidifier" : "mdi:air-filter",
      color: N(t?.stateObj),
      primary: e.name ?? t?.stateObj?.attributes.friendly_name ?? d(this.hass, "air.title"),
      mainEntityId: t?.entityId,
      secondary: S([
        U(this.hass, t),
        ...o,
        this.mainStateSegment(t),
        ...r.map((c) => F(this.hass, c)),
        ...a.map((c) => F(this.hass, c.role))
      ]),
      values: this.bigValues(l)
    });
  }
}
$i([
  b()
], qs.prototype, "_config");
E("horos-air-tile", qs, {
  type: "horos-air-tile",
  name: { ru: "Воздух", en: "Air" },
  description: {
    ru: "Очиститель, рекуператор, увлажнитель — прибор и что с воздухом",
    en: "Purifier, recuperator, humidifier — the appliance and the air"
  },
  preview: !0,
  suggest: (s, e) => {
    const t = re(s, e), n = {
      appliance: Te(t, "fan", "humidifier"),
      pm25: H(s, t, "sensor", "pm25"),
      humidity: H(s, t, "sensor", "humidity"),
      temperature: H(s, t, "sensor", "temperature"),
      power: H(s, t, "sensor", "power")
    };
    return !n.appliance || Pe(n) < 2 ? null : L("custom:horos-air-tile", n);
  }
});
var xi = Object.defineProperty, Ei = (s, e, t, n) => {
  for (var r = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(e, t, r) || r);
  return r && xi(e, t, r), r;
};
const as = ["illuminance", "battery"], ki = 1, Ci = 2, Vs = 4;
function ut(s, e) {
  if (!e || e.controls === !1) return [];
  const t = Number(
    s?.states[e.cover]?.attributes.supported_features ?? 0
  ), n = [];
  return (t & Vs) !== 0 && n.push({ type: "cover-position" }), (t & (ki | Ci)) !== 0 && n.push({ type: "cover-open-close" }), n;
}
class Ks extends x {
  constructor() {
    super(...arguments), this._bigKeys = ["illuminance"];
  }
  static {
    this.styles = [W, K];
  }
  /** One row for our own bar, plus whatever controls sit under it. */
  contentRows() {
    return this.levelRows(1) + this.fixedRows();
  }
  fixedRows() {
    return this.featureRows(ut(this.hass, this._config));
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Qo), document.createElement(
      "horos-cover-tile-editor"
    );
  }
  static getStubConfig() {
    return { cover: "" };
  }
  setConfig(e) {
    if (!e.cover)
      throw new Error("A cover is required (cover)");
    this._bigKeys = Z(e.big_values, "illuminance", as), this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return m;
    const e = this._config, t = p(this.hass, e.cover), n = p(this.hass, e.position), r = as.map((f) => ({
      key: f,
      role: p(this.hass, e[f])
    })), i = this.missingRolesWarning([
      t,
      n,
      ...r.map((f) => f.role)
    ]);
    if (i) return this.renderWarning(i);
    const { big: o, rest: l } = X(r, this._bigKeys), c = (Number(
      t?.stateObj?.attributes.supported_features ?? 0
    ) & Vs) !== 0, h = ut(this.hass, e), u = Y(n), g = n && !c ? [
      {
        entityId: n.entityId,
        name: d(this.hass, "level.open"),
        text: u === void 0 ? d(this.hass, "value.unknown") : `${Math.round(u)}%`,
        ink: _e(u),
        level: u ?? 0
      }
    ] : [];
    return this.renderTile({
      icon: "mdi:curtains",
      color: N(t?.stateObj),
      primary: e.name ?? t?.stateObj?.attributes.friendly_name ?? d(this.hass, "cover.title"),
      mainEntityId: t?.entityId,
      secondary: S([
        U(this.hass, t),
        this.mainStateSegment(t),
        ...l.map((f) => F(this.hass, f.role))
      ]),
      values: this.bigValues(o),
      ownFeatures: h,
      customFeatures: g.length ? G(g, (f) => this.fireMoreInfo(f)) : void 0
    });
  }
}
Ei([
  b()
], Ks.prototype, "_config");
E("horos-cover-tile", Ks, {
  type: "horos-cover-tile",
  name: { ru: "Шторы", en: "Curtains" },
  description: {
    ru: "Насколько открыты, светло ли снаружи и сколько заряда",
    en: "How far open, how bright outside, and battery"
  },
  preview: !0,
  suggest: (s, e) => {
    const t = re(s, e), n = {
      cover: Te(t, "cover"),
      illuminance: H(s, t, "sensor", "illuminance"),
      battery: H(s, t, "sensor", "battery")
    };
    return !n.cover || Pe(n) < 2 ? null : L("custom:horos-cover-tile", n);
  }
});
const Si = [
  "update",
  "select",
  "text",
  "button",
  "number",
  "event",
  "notify"
];
function Ai(s, e = {}) {
  if (!s) return [];
  const t = new Set(e.ignore ?? []), n = new Set(
    e.ignoreDomains ?? Si
  ), r = /* @__PURE__ */ new Map();
  for (const [i, o] of Object.entries(s.states)) {
    if (!o || o.state !== "unavailable" || t.has(i) || n.has(i.split(".")[0])) continue;
    const l = s.entities?.[i];
    if (l?.hidden) continue;
    const a = l?.device_id ? s.devices?.[l.device_id] : void 0, c = a?.name_by_user ?? a?.name ?? o.attributes.friendly_name ?? i, h = l?.device_id ?? i, u = r.get(h);
    u ? u.count += 1 : r.set(h, { name: c, count: 1, entityId: i });
  }
  return [...r.values()].sort(
    (i, o) => o.count - i.count || i.name.localeCompare(o.name)
  );
}
var Ti = Object.defineProperty, Oi = (s, e, t, n) => {
  for (var r = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(e, t, r) || r);
  return r && Ti(e, t, r), r;
};
const Pi = 4;
class Gs extends x {
  static async getConfigElement() {
    return await Promise.resolve().then(() => ea), document.createElement(
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
    const e = this._config, t = Ai(this.hass, {
      ignore: e.ignore,
      ignoreDomains: e.ignore_domains
    }), n = e.limit ?? Pi, r = t.slice(0, n), i = t.length - r.length;
    return this.renderTile({
      icon: t.length ? "mdi:lan-disconnect" : "mdi:lan-check",
      color: t.length ? "var(--warning-color, #ffa600)" : "var(--success-color, #43a047)",
      primary: e.name ?? d(this.hass, "offline.title"),
      mainEntityId: t[0]?.entityId,
      secondary: S(
        t.length ? [
          ...r.map((o) => ({
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
Oi([
  b()
], Gs.prototype, "_config");
E("horos-offline-tile", Gs, {
  type: "horos-offline-tile",
  name: { ru: "Не отвечает", en: "Not responding" },
  description: {
    ru: "Что перестало отвечать, посчитанное по устройствам",
    en: "Devices that went silent, grouped by device"
  },
  preview: !0
});
var Ii = Object.defineProperty, Ri = (s, e, t, n) => {
  for (var r = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(e, t, r) || r);
  return r && Ii(e, t, r), r;
};
const ji = 5;
class Ys extends x {
  static {
    this.styles = [W, K];
  }
  /** Level rows under the tile: roughly two per grid row. */
  contentRows() {
    return this.levelRows(
      Math.min(this._config?.consumers.length ?? 0, this._config?.limit ?? 5)
    ) + this.fixedRows();
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => ta), document.createElement(
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
    const e = this._config, t = p(this.hass, e.total), n = [], r = [], i = [];
    for (const h of e.consumers) {
      const u = M(h), g = p(this.hass, u.entity);
      if (g?.missing) {
        n.push(u.entity);
        continue;
      }
      const f = u.name ?? he(g?.stateObj?.attributes.friendly_name, e.name) ?? u.entity;
      if (g?.unavailable) {
        r.push(f);
        continue;
      }
      const y = Y(g);
      y === void 0 || y <= 0 || i.push({
        watts: y,
        row: {
          entityId: u.entity,
          name: f,
          text: this.hass.formatEntityState(g.stateObj),
          ink: u.color ?? "var(--amber-color, #ffc107)"
        }
      });
    }
    i.sort((h, u) => u.watts - h.watts);
    const o = i.slice(0, e.limit ?? ji), l = o[0]?.watts ?? 0, a = o.map(({ row: h, watts: u }) => ({
      ...h,
      level: l > 0 ? u / l * 100 : 0
    })), c = [
      U(this.hass, t),
      i.length ? { text: d(this.hass, "energy.consuming", { count: i.length }) } : { text: d(this.hass, "energy.idle") },
      r.length ? { text: d(this.hass, "offline.count", { count: r.length }) } : void 0,
      n.length ? { text: d(this.hass, "list.missing", { count: n.length }) } : void 0
    ];
    return this.renderTile({
      icon: "mdi:flash",
      color: "var(--amber-color, #ffc107)",
      primary: e.name ?? d(this.hass, "energy.title"),
      mainEntityId: t?.entityId ?? o[0]?.row.entityId,
      secondary: S([this.mainStateSegment(t), ...c]),
      values: t ? this.bigValues([{ key: "total", role: t }]) : [],
      customFeatures: a.length ? G(a, (h) => this.fireMoreInfo(h)) : void 0
    });
  }
}
Ri([
  b()
], Ys.prototype, "_config");
E("horos-energy-tile", Ys, {
  type: "horos-energy-tile",
  name: { ru: "Энергия", en: "Energy" },
  description: {
    ru: "Кто в доме ест электричество, от самого прожорливого",
    en: "Who in the house draws power, hungriest first"
  },
  preview: !0,
  suggest: (s, e) => {
    if (j(e) !== "sensor" || Q(s, e) !== "power")
      return null;
    const t = Oe(
      s,
      e,
      "sensor",
      ["power"],
      12,
      (n) => es(s, n)
    );
    return t.length ? L(
      "custom:horos-energy-tile",
      { total: es(s, e) ? void 0 : e },
      { consumers: t, limit: 6 }
    ) : null;
  }
});
var Mi = Object.defineProperty, Ni = (s, e, t, n) => {
  for (var r = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(e, t, r) || r);
  return r && Mi(e, t, r), r;
};
class Xs extends x {
  static async getConfigElement() {
    return await Promise.resolve().then(() => sa), document.createElement(
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
    const e = this._config, t = [], n = [];
    let r = 0, i = 0;
    for (const o of e.areas) {
      const l = M(o), a = p(this.hass, l.entity);
      if (a?.missing) {
        n.push(l.entity);
        continue;
      }
      if (i += 1, a?.unavailable) {
        r += 1;
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
      secondary: S([
        ...t.length ? t : [{ text: d(this.hass, "presence.empty", { count: i }) }],
        r ? { text: d(this.hass, "offline.count", { count: r }) } : void 0,
        n.length ? { text: d(this.hass, "list.missing", { count: n.length }) } : void 0
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
Ni([
  b()
], Xs.prototype, "_config");
E("horos-presence-tile", Xs, {
  type: "horos-presence-tile",
  name: { ru: "Присутствие", en: "Presence" },
  description: {
    ru: "В каких зонах сейчас есть кто-то",
    en: "Which areas have someone in them right now"
  },
  preview: !0,
  suggest: (s, e) => {
    const t = ["occupancy", "presence", "motion"];
    return j(e) !== "binary_sensor" || !t.includes(Q(s, e) ?? "") ? null : L(
      "custom:horos-presence-tile",
      {},
      // One entity per area: otherwise the kitchen gets named three times.
      { areas: Fn(s, e, "binary_sensor", t, 12) }
    );
  }
});
var Fi = Object.defineProperty, Li = (s, e, t, n) => {
  for (var r = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(e, t, r) || r);
  return r && Fi(e, t, r), r;
};
const Hi = 255;
function ht(s) {
  return !s?.group || s.brightness === !1 ? [] : [{ type: "light-brightness" }];
}
class Zs extends x {
  static {
    this.styles = [W, K];
  }
  contentRows() {
    return this.levelRows(this._config?.lights.length ?? 0) + this.fixedRows();
  }
  fixedRows() {
    return this.featureRows(ht(this._config));
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => ra), document.createElement(
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
    return t === void 0 ? void 0 : Math.round(t / Hi * 100);
  }
  render() {
    if (!this._config || !this.hass) return m;
    const e = this._config, t = p(this.hass, e.group), r = e.lights.map((f) => M(f)).map((f) => ({
      item: f,
      role: p(this.hass, f.entity)
    })), i = this.missingRolesWarning([
      t,
      ...r.map((f) => f.role)
    ]);
    if (i) return this.renderWarning(i);
    const o = r.filter((f) => f.role?.stateObj?.state === "on"), l = r.filter((f) => f.role?.unavailable), a = r.length - l.length, c = t ?? o[0]?.role ?? r[0].role, h = t?.stateObj?.attributes.friendly_name, u = r.map(({ item: f, role: y }) => {
      const D = this._brightness(y), w = y?.stateObj?.state === "on", B = Ge(this.hass, y);
      return {
        entityId: f.entity,
        name: f.name ?? he(y?.stateObj?.attributes.friendly_name, h) ?? f.entity,
        // A dimmable light says how bright, a plain one only that it is on.
        text: B ?? (w ? D === void 0 ? d(this.hass, "light.on") : `${D}%` : d(this.hass, "light.off")),
        ink: f.color ?? N(y?.stateObj),
        level: w ? D ?? 100 : 0
      };
    }), g = this._brightness(c);
    return this.renderTile({
      icon: "mdi:lightbulb-group",
      color: N(c?.stateObj),
      primary: e.name ?? h ?? d(this.hass, "light.title"),
      mainEntityId: c?.entityId,
      defaultIconAction: ue(c?.entityId),
      secondary: S([
        U(this.hass, t),
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
      values: g === void 0 ? [] : [
        {
          value: String(g),
          unit: "%",
          entityId: c?.entityId,
          icon: Ae.brightness
        }
      ],
      ownFeatures: ht(e),
      customFeatures: G(
        u,
        (f) => this.fireMoreInfo(f)
      )
    });
  }
}
Li([
  b()
], Zs.prototype, "_config");
E("horos-light-tile", Zs, {
  type: "horos-light-tile",
  name: { ru: "Свет", en: "Lights" },
  description: {
    ru: "Свет комнаты одной плиткой: что горит и насколько ярко",
    en: "A room's lights in one tile: what is on and how bright"
  },
  preview: !0,
  suggest: (s, e) => {
    if (!le(s, e)) return null;
    const t = Tt(s, e, "light");
    return t.length < 2 ? null : L("custom:horos-light-tile", {}, { lights: t });
  }
});
var Di = Object.defineProperty, Ui = (s, e, t, n) => {
  for (var r = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(e, t, r) || r);
  return r && Di(e, t, r), r;
};
const ls = ["playing", "paused", "buffering"];
function dt(s) {
  return !s || s.controls === !1 ? [] : [{ type: "media-player-playback" }];
}
class Js extends x {
  static {
    this.styles = [W, K];
  }
  contentRows() {
    return this.levelRows(this._config?.players.length ?? 0) + this.fixedRows();
  }
  fixedRows() {
    return this.featureRows(dt(this._config));
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => na), document.createElement(
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
    const e = this._config, t = e.players.map((a) => M(a)).map((a) => ({ item: a, role: p(this.hass, a.entity) })), n = this.missingRolesWarning(t.map((a) => a.role));
    if (n) return this.renderWarning(n);
    const r = t.filter(
      (a) => ls.includes(a.role?.stateObj?.state ?? "")
    ), i = r[0] ?? t[0], o = this._volume(i.role), l = t.map(({ item: a, role: c }) => {
      const h = this._volume(c), u = ls.includes(c?.stateObj?.state ?? "");
      return {
        entityId: a.entity,
        name: a.name ?? c?.stateObj?.attributes.friendly_name ?? a.entity,
        // The state, not the title: a row is a bar with a word at the end, and
        // a track name is a sentence — it pushed the volume bar off the card.
        // What is playing is named once, in the line above.
        text: c?.stateObj && this.hass ? this.hass.formatEntityState(c.stateObj) : d(this.hass, "value.unknown"),
        ink: a.color ?? N(c?.stateObj),
        level: u ? h ?? 0 : 0
      };
    });
    return this.renderTile({
      icon: "mdi:play-box-multiple",
      color: N(i.role?.stateObj),
      primary: e.name ?? i.role?.stateObj?.attributes.friendly_name ?? d(this.hass, "media.title"),
      mainEntityId: i.role?.entityId,
      defaultIconAction: ue(i.role?.entityId),
      secondary: S([
        U(this.hass, i.role),
        {
          text: r.length ? this._title(i.role) ?? d(this.hass, "media.playing", { count: r.length }) : d(this.hass, "media.idle"),
          entityId: i.role?.entityId
        }
      ]),
      values: o === void 0 ? [] : [
        {
          value: String(o),
          unit: "%",
          entityId: i.role?.entityId,
          icon: Ae.volume
        }
      ],
      ownFeatures: dt(e),
      customFeatures: t.length > 1 ? G(l, (a) => this.fireMoreInfo(a)) : void 0
    });
  }
}
Ui([
  b()
], Js.prototype, "_config");
E("horos-media-tile", Js, {
  type: "horos-media-tile",
  name: { ru: "Медиа", en: "Media" },
  description: {
    ru: "Что играет в доме, где и насколько громко",
    en: "What is playing in the house, where, and how loud"
  },
  preview: !0,
  suggest: (s, e) => {
    if (!le(s, e)) return null;
    const t = Tt(s, e, "media_player");
    return t.length < 2 ? null : L("custom:horos-media-tile", {}, { players: t });
  }
});
var zi = Object.defineProperty, Wi = (s, e, t, n) => {
  for (var r = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(e, t, r) || r);
  return r && zi(e, t, r), r;
};
const cs = ["temperature", "humidity", "power"];
function mt(s) {
  return !s || s.controls === !1 ? [] : [{ type: "target-temperature" }, { type: "climate-hvac-modes" }];
}
class Qs extends x {
  constructor() {
    super(...arguments), this._bigKeys = ["temperature"];
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => ia), document.createElement("horos-ac-tile-editor");
  }
  static getStubConfig() {
    return { climate: "" };
  }
  setConfig(e) {
    if (!e.climate)
      throw new Error("A climate entity is required (climate)");
    const t = e.features_position ?? (e.vertical ? "bottom" : "inline");
    this._bigKeys = Z(
      e.big_values,
      // A large value and an inline control both want the right of the line;
      // the control wins, and the room temperature becomes a word among others.
      t === "inline" ? [] : "temperature",
      cs
    ), this.base = { ...e, features_position: t }, this._config = e;
  }
  fixedRows() {
    return this.featureRows(mt(this._config));
  }
  render() {
    if (!this._config || !this.hass) return m;
    const e = this._config, t = p(this.hass, e.climate), n = cs.map((a) => ({
      key: a,
      role: p(this.hass, e[a])
    })), r = (e.sensors ?? []).map((a) => M(a)).map((a) => p(this.hass, a.entity)), i = this.missingRolesWarning([
      t,
      ...n.map((a) => a.role),
      ...r
    ]);
    if (i) return this.renderWarning(i);
    const { big: o, rest: l } = X(n, this._bigKeys);
    return this.renderTile({
      icon: "mdi:air-conditioner",
      color: N(t?.stateObj),
      primary: Ye(e.name, t) ?? d(this.hass, "ac.title"),
      mainEntityId: t?.entityId,
      defaultIconAction: ue(t?.entityId),
      secondary: S([
        U(this.hass, t),
        this.mainStateSegment(t),
        ...l.map((a) => F(this.hass, a.role)),
        ...r.map((a) => F(this.hass, a))
      ]),
      values: this.bigValues(o),
      ownFeatures: mt(e)
    });
  }
}
Wi([
  b()
], Qs.prototype, "_config");
E("horos-ac-tile", Qs, {
  type: "horos-ac-tile",
  name: { ru: "Кондиционер", en: "Air conditioner" },
  description: {
    ru: "Климатический прибор, воздух в комнате и цена работы",
    en: "A climate unit, the air in the room, and what running it costs"
  },
  preview: !0,
  suggest: (s, e) => {
    const t = re(s, e), n = Te(t, "climate");
    if (!n) return null;
    const r = le(s, n) ? Tt(s, n, "sensor") : [], i = {
      climate: n,
      temperature: H(s, r, "sensor", "temperature"),
      humidity: H(s, r, "sensor", "humidity"),
      power: H(s, t, "sensor", "power")
    };
    return Pe(i) < 2 ? null : L("custom:horos-ac-tile", i);
  }
});
function Bi(s, e = {}) {
  if (!s) return [];
  const t = new Set(e.ignore ?? []), n = [];
  for (const [r, i] of Object.entries(s.states)) {
    if (!r.startsWith("update.") || i?.state !== "on" || t.has(r)) continue;
    const o = s.entities?.[r];
    if (o?.hidden) continue;
    const l = o?.device_id ? s.devices?.[o.device_id] : void 0, a = i.attributes.latest_version;
    n.push({
      entityId: r,
      name: l?.name_by_user ?? l?.name ?? i.attributes.title ?? i.attributes.friendly_name ?? r,
      version: a,
      skipped: a !== void 0 && a === i.attributes.skipped_version
    });
  }
  return n.sort((r, i) => r.name.localeCompare(i.name));
}
var qi = Object.defineProperty, Vi = (s, e, t, n) => {
  for (var r = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(e, t, r) || r);
  return r && qi(e, t, r), r;
};
const Ki = 4;
class er extends x {
  static async getConfigElement() {
    return await Promise.resolve().then(() => oa), document.createElement(
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
    const e = this._config, t = Bi(this.hass, { ignore: e.ignore }), n = e.include_skipped ? t : t.filter((l) => !l.skipped), r = e.limit ?? Ki, i = n.slice(0, r), o = n.length - i.length;
    return this.renderTile({
      icon: n.length ? "mdi:package-up" : "mdi:package-variant-closed-check",
      color: n.length ? "var(--info-color, #2196f3)" : "var(--success-color, #43a047)",
      primary: e.name ?? d(this.hass, "updates.title"),
      mainEntityId: n[0]?.entityId,
      secondary: S(
        n.length ? [
          ...i.map((l) => ({
            text: l.version ? `${l.name} ${l.version}` : l.name,
            entityId: l.entityId
          })),
          o > 0 ? { text: d(this.hass, "offline.more", { count: o }) } : void 0
        ] : [{ text: d(this.hass, "updates.upToDate") }]
      ),
      values: n.length ? [
        {
          value: String(n.length),
          entityId: n[0]?.entityId,
          icon: Ae.updates
        }
      ] : []
    });
  }
}
Vi([
  b()
], er.prototype, "_config");
E("horos-updates-tile", er, {
  type: "horos-updates-tile",
  name: { ru: "Обновления", en: "Updates" },
  description: {
    ru: "Что в доме просит обновления, одной плиткой вместо тридцати",
    en: "What in the house asks to be updated, one tile instead of thirty"
  },
  preview: !0,
  suggest: (s, e) => e.startsWith("update.") ? L("custom:horos-updates-tile", {}) : null
});
var Gi = Object.defineProperty, Yi = (s, e, t, n) => {
  for (var r = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(e, t, r) || r);
  return r && Gi(e, t, r), r;
};
class tr extends x {
  static {
    this.styles = [W, K];
  }
  contentRows() {
    return this.levelRows(this._config?.lists.length ?? 0) + this.fixedRows();
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => aa), document.createElement(
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
    const e = this._config, t = p(this.hass, e.calendar), n = e.lists.map((c) => M(c)).map((c) => {
      const h = p(this.hass, c.entity);
      return { item: c, role: h, count: Y(h) ?? 0 };
    }), r = this.missingRolesWarning([
      t,
      ...n.map((c) => c.role)
    ]);
    if (r) return this.renderWarning(r);
    const i = n.reduce((c, h) => c + h.count, 0), o = Math.max(...n.map((c) => c.count), 1), l = n.filter((c) => c.count > 0).map(({ item: c, role: h, count: u }) => ({
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
      mainEntityId: n[0]?.item.entity,
      secondary: S([
        U(this.hass, t),
        { text: i ? void 0 : d(this.hass, "tasks.none") },
        t ? {
          text: a ?? d(this.hass, "tasks.noEvents"),
          entityId: t.entityId
        } : void 0
      ]),
      values: i ? [
        {
          value: String(i),
          entityId: n[0]?.item.entity,
          icon: Ae.tasks
        }
      ] : [],
      customFeatures: l.length ? G(l, (c) => this.fireMoreInfo(c)) : void 0
    });
  }
}
Yi([
  b()
], tr.prototype, "_config");
E("horos-tasks-tile", tr, {
  type: "horos-tasks-tile",
  name: { ru: "Задачи", en: "Tasks" },
  description: {
    ru: "Сколько дел на каждом списке и что ближайшее в календаре",
    en: "How much is left on each list, and what is coming up next"
  },
  preview: !0,
  suggest: (s, e) => {
    if (!e.startsWith("todo.")) return null;
    const t = Object.keys(s.states).filter((r) => r.startsWith("todo.") && !s.entities?.[r]?.hidden).sort(), n = [e, ...t.filter((r) => r !== e)];
    return n.length < 2 ? null : L("custom:horos-tasks-tile", {}, { lists: n });
  }
});
const Xi = "on";
function Zi(s) {
  const e = s.alert_when;
  return e === void 0 ? [Xi] : Array.isArray(e) ? e : [e];
}
function Ji(s, e) {
  return e === void 0 || e === "unavailable" || e === "unknown" ? !1 : Zi(s).includes(e);
}
var Qi = Object.defineProperty, eo = (s, e, t, n) => {
  for (var r = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(e, t, r) || r);
  return r && Qi(e, t, r), r;
};
const to = 4;
class sr extends x {
  static async getConfigElement() {
    return await Promise.resolve().then(() => la), document.createElement(
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
    const e = this._config, t = e.watch_offline !== !1, n = [], r = [], i = [];
    let o, l = 0;
    for (const g of e.alerts) {
      const f = M(g), y = p(this.hass, f.entity);
      if (y?.missing) {
        i.push(f.entity);
        continue;
      }
      l += 1;
      const D = f.name ?? y?.stateObj?.attributes.friendly_name ?? f.entity;
      if (y?.unavailable) {
        t && r.push({
          text: d(this.hass, "alerts.offline", { name: D }),
          entityId: f.entity
        });
        continue;
      }
      Ji(f, y?.stateObj?.state) && (n.push({ text: D, entityId: f.entity }), o = o ?? (f.color ? Os(f.color) : void 0));
    }
    const a = [...n, ...r], c = e.limit ?? to, h = a.slice(0, c), u = a.length - h.length;
    return this.renderTile({
      icon: n.length ? "mdi:alert" : r.length ? "mdi:bell-off-outline" : "mdi:bell-check-outline",
      color: o ?? (n.length ? "var(--error-color, #db4437)" : r.length ? "var(--warning-color, #ffa600)" : "var(--success-color, #43a047)"),
      primary: e.name ?? d(this.hass, "alerts.title"),
      mainEntityId: a[0]?.entityId,
      secondary: S([
        ...a.length ? h : [{ text: d(this.hass, "alerts.calm", { count: l }) }],
        u > 0 ? { text: d(this.hass, "offline.more", { count: u }) } : void 0,
        ...i.length ? [{ text: d(this.hass, "list.missing", { count: i.length }) }] : []
      ]),
      values: n.length ? [
        {
          value: String(n.length),
          entityId: n[0]?.entityId,
          icon: "mdi:alert-outline"
        }
      ] : []
    });
  }
}
eo([
  b()
], sr.prototype, "_config");
E("horos-alerts-tile", sr, {
  type: "horos-alerts-tile",
  name: { ru: "Оповещения", en: "Alerts" },
  description: {
    ru: "Всё, о чём стоит сказать только когда оно случилось, одной плиткой",
    en: "Everything worth mentioning only once it happens, in one tile"
  },
  preview: !0,
  suggest: (s, e) => {
    const t = ["problem", "tamper"];
    return j(e) !== "binary_sensor" || !t.includes(Q(s, e) ?? "") ? null : L(
      "custom:horos-alerts-tile",
      {},
      { alerts: Oe(s, e, "binary_sensor", t) }
    );
  }
});
var so = Object.defineProperty, rr = (s, e, t, n) => {
  for (var r = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(e, t, r) || r);
  return r && so(e, t, r), r;
};
const Ne = [
  { key: "dim", icon: "mdi:brightness-4" },
  { key: "bright", icon: "mdi:brightness-7" },
  { key: "warm", icon: "mdi:weather-sunset" },
  { key: "cold", icon: "mdi:snowflake" }
];
function pt(s) {
  return !s?.state?.startsWith("light.") || s.brightness === !1 ? [] : [{ type: "light-brightness" }];
}
class Ot extends x {
  constructor() {
    super(...arguments), this._controlsReady = !1;
  }
  static {
    this.styles = [
      W,
      ce`
      /*
       * The sizes are the stock feature's own, taken from the same variables
       * hui-card-features sets for the features it hosts — our row lives
       * outside it, and a row of lamp buttons must not be a different height
       * from a row of climate buttons on the card next to it.
       *
       * Spare height spreads between the rows rather than growing them: a
       * button is 42px on every card, whatever the card was told to be.
       */
      .lamp-controls {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        gap: var(--ha-card-feature-gap, 12px);
        pointer-events: auto;
      }

      ha-control-select {
        --control-select-color: var(--tile-color);
        --control-select-padding: 0;
        --control-select-thickness: var(--feature-height, 42px);
        --control-select-border-radius: 12px;
        --control-select-button-border-radius: 12px;
      }

      /*
       * The selector keeps the height a stock inline feature gets; what
       * shrinks is what goes inside it. At full size an icon over a line of
       * text is 53px of content in a 36px place and the names get clipped, so
       * both are taken down a notch. Size and font are inherited properties,
       * which is why they reach into the selector's shadow from out here.
       */
      .presets.labelled {
        --mdc-icon-size: 16px;
        font-size: var(--ha-font-size-xs, 11px);
        line-height: 1.1;
      }
    `
    ];
  }
  connectedCallback() {
    super.connectedCallback(), As().then((e) => {
      this._controlsReady = e;
    });
  }
  /**
   * The row of steps is one layout row, the same as a stock feature: it is
   * 42px whatever happens, so the card must ask for the room and must not be
   * squeezed under it. The presets cost no row: they sit in the tile's own line,
   * where a stock inline feature would, and push the stock features below.
   */
  fixedRows() {
    const e = this._config;
    return e ? (Ne.some(({ key: n }) => e[n]) ? 1 : 0) + this.featureRows(pt(e), !!e.presets?.length) : 0;
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => ca), document.createElement(
      "horos-lamp-tile-editor"
    );
  }
  static getStubConfig() {
    return { bright: "", dim: "" };
  }
  setConfig(e) {
    if (!(Ne.some(({ key: n }) => e[n]) || e.presets?.length || e.power))
      throw new Error(
        "A lamp needs at least one script: bright, dim, warm, cold, power or presets"
      );
    this.base = e, this._config = e;
  }
  /** Runs a script the way a tap action would, confirmations and all. */
  _run(e) {
    this.hass && Ss(
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
    const t = Ne.filter(({ key: n }) => e[n]);
    return t.length ? v`
      <ha-control-select
        .options=${t.map(({ key: n, icon: r }) => ({
      value: e[n],
      ariaLabel: this._stepLabel(n),
      icon: v`<ha-icon .icon=${r}></ha-icon>`
    }))}
        .value=${void 0}
        hide-option-label
        @value-changed=${(n) => {
      this._run(n.detail.value), n.target.value = void 0;
    }}
      ></ha-control-select>
    ` : m;
  }
  /** The looks the lamp can take, as the segmented selector HA uses for modes. */
  _renderPresets(e) {
    if (!e.presets?.length) return m;
    const t = e.presets.map(
      (r) => typeof r == "string" ? { entity: r } : r
    ), n = e.preset_state ? this.hass?.states[e.preset_state]?.state : void 0;
    return v`
      <ha-control-select
        class="presets ${e.preset_labels !== !1 ? "labelled" : ""}"
        .options=${t.map((r) => {
      const i = this.hass?.states[r.entity], o = r.name ?? Ms(i?.attributes.friendly_name) ?? r.entity, l = r.icon ?? i?.attributes.icon;
      return {
        value: r.entity,
        label: o,
        ariaLabel: o,
        icon: l ? v`<ha-icon .icon=${l}></ha-icon>` : void 0
      };
    })}
        .value=${n ? t.find((r) => r.name === n)?.entity ?? n : void 0}
        ?hide-option-label=${e.preset_labels === !1}
        @value-changed=${(r) => {
      this._run(r.detail.value), e.preset_state || (r.target.value = void 0);
    }}
      >
      </ha-control-select>
    `;
  }
  render() {
    if (!this._config || !this.hass) return m;
    const e = this._config, t = p(this.hass, e.state), n = (e.sensors ?? []).map((i) => M(i)).map((i) => p(this.hass, i.entity)), r = this.missingRolesWarning([t, ...n]);
    return r ? this.renderWarning(r) : this.renderTile({
      icon: e.icon ?? "mdi:coach-lamp-variant",
      color: t ? N(t.stateObj) : "var(--state-icon-color)",
      primary: e.name ?? d(this.hass, "lamp.title"),
      mainEntityId: t?.entityId,
      // The icon is the lamp's switch: it runs the power script where there is
      // one, and falls back to toggling whatever holds the state.
      defaultIconAction: e.power ? {
        action: "perform-action",
        perform_action: "homeassistant.turn_on",
        target: { entity_id: e.power }
      } : t ? { action: "toggle" } : { action: "none" },
      secondary: S([
        U(this.hass, t),
        this.mainStateSegment(t),
        ...n.map((i) => F(this.hass, i))
      ]),
      ownFeatures: pt(e),
      customFeatures: this._controlsReady && Ne.some(({ key: i }) => e[i]) ? v`<div class="lamp-controls">${this._renderSteps(e)}</div>` : void 0,
      customInline: this._controlsReady && e.presets?.length ? this._renderPresets(e) : void 0
    });
  }
}
rr([
  b()
], Ot.prototype, "_config");
rr([
  b()
], Ot.prototype, "_controlsReady");
E("horos-lamp-tile", Ot, {
  type: "horos-lamp-tile",
  name: { ru: "Лампа на скриптах", en: "Script lamp" },
  description: {
    ru: "ИК-лампа или лента: ярче, теплее и режимы — скриптами, но как у лампы",
    en: "An IR lamp or a strip: brighter, warmer and presets, driven by scripts"
  },
  preview: !0
});
function ro(s) {
  if (!s || Ke.has(s.state)) return "offline";
  if (s.state === "off") return "off";
  const e = s.attributes.hvac_action;
  return e === void 0 ? "unknown" : e === "heating" ? "heating" : "idle";
}
function no(s) {
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
var io = Object.defineProperty, oo = (s, e, t, n) => {
  for (var r = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(e, t, r) || r);
  return r && io(e, t, r), r;
};
const us = ["power", "energy"];
class nr extends x {
  constructor() {
    super(...arguments), this._bigKeys = ["power"];
  }
  static {
    this.styles = [W, K];
  }
  contentRows() {
    return this.levelRows(this._config?.zones?.length ?? 0) + this.fixedRows();
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => ua), document.createElement(
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
    this._bigKeys = Z(e.big_values, "power", us), this.base = e, this._config = e;
  }
  /** What the row says on the right: where the room is and where it was sent. */
  _zoneText(e, t) {
    if (t === "offline") return Ge(this.hass, e);
    const n = e?.stateObj;
    if (!n) return;
    const r = Vt(this.hass, n, "current_temperature"), i = Vt(this.hass, n, "temperature");
    if (r && i) {
      const o = i.replace(/^[\d\s\u00a0.,+-]+/, "");
      return `${xt(r, o).value} → ${i}`;
    }
    return r ?? i ?? this.hass?.formatEntityState(n);
  }
  render() {
    if (!this._config || !this.hass) return m;
    const e = this._config, t = p(this.hass, e.mode), n = p(this.hass, e.burner), r = p(this.hass, e.pump), i = p(this.hass, e.switch), o = us.map((w) => ({
      key: w,
      role: p(this.hass, e[w])
    })), l = (e.zones ?? []).map((w) => M(w)).map((w) => {
      const B = p(this.hass, w.entity);
      return { item: w, role: B, zone: ro(B?.stateObj) };
    }), a = this.missingRolesWarning([
      t,
      n,
      r,
      i,
      ...o.map((w) => w.role),
      ...l.map((w) => w.role)
    ]);
    if (a) return this.renderWarning(a);
    const c = n?.stateObj?.state === "on", h = r?.stateObj?.state === "on", u = t ?? i ?? n ?? r, { calling: g, reporting: f, offline: y } = no(
      l.map((w) => w.zone)
    ), D = l.map(({ item: w, role: B, zone: se }) => ({
      entityId: w.entity,
      name: w.name ?? he(B?.stateObj?.attributes.friendly_name, e.name) ?? w.entity,
      text: this._zoneText(B, se) ?? "",
      ink: w.color ?? N(B?.stateObj),
      // The bar is the demand, not the temperature: a room either has the
      // boiler working for it or it does not.
      level: se === "heating" ? 100 : 0,
      alarm: se === "offline",
      alarmIcon: "mdi:lan-disconnect"
    }));
    return this.renderTile({
      icon: c ? "mdi:fire" : h ? "mdi:pump" : "mdi:water-boiler",
      color: N(c ? n.stateObj : h ? r.stateObj : u?.stateObj),
      primary: e.name ?? d(this.hass, "heating.title"),
      mainEntityId: u?.entityId,
      // The icon is the boiler's own switch where there is one; without it
      // there is nothing on this card that is safe to toggle.
      defaultIconAction: e.switch ? ue(e.switch) : { action: "none" },
      secondary: S([
        U(this.hass, u),
        this.mainStateSegment(u === t ? t : u),
        // Who is asking is the card's whole point, so it is always said. That
        // nobody is asking is only worth a word when the boiler has no mode
        // sensor to say "standby" for itself.
        g ? {
          text: d(this.hass, "heating.calling", {
            count: g,
            total: f
          })
        } : f && !t ? { text: d(this.hass, "heating.quiet") } : void 0,
        y ? { text: d(this.hass, "offline.count", { count: y }) } : void 0,
        ...X(o, this._bigKeys).rest.map(
          (w) => F(this.hass, w.role)
        )
      ]),
      values: this.bigValues(X(o, this._bigKeys).big),
      customFeatures: D.length ? G(D, (w) => this.fireMoreInfo(w)) : void 0
    });
  }
}
oo([
  b()
], nr.prototype, "_config");
E("horos-heating-tile", nr, {
  type: "horos-heating-tile",
  name: { ru: "Отопление", en: "Heating" },
  description: {
    ru: "Котёл и комнаты, которые просят у него тепла, одной плиткой",
    en: "The boiler and the rooms asking it for heat, in one tile"
  },
  preview: !0
});
function ao(s) {
  const e = { thirsty: 0, soaked: 0, reporting: 0, offline: 0 };
  for (const t of s) {
    if (t.offline) {
      e.offline += 1;
      continue;
    }
    t.status !== "unknown" && (e.reporting += 1, t.status === "dry" && (e.thirsty += 1), t.status === "wet" && (e.soaked += 1));
  }
  return e;
}
function lo(s) {
  return s.thirsty ? "dry" : s.soaked ? "wet" : s.reporting ? "ok" : "unknown";
}
const co = {
  dry: "mdi:watering-can",
  ok: "mdi:greenhouse",
  wet: "mdi:water-alert",
  unknown: "mdi:greenhouse"
};
var uo = Object.defineProperty, ho = (s, e, t, n) => {
  for (var r = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(e, t, r) || r);
  return r && uo(e, t, r), r;
};
const hs = [
  "temperature",
  "humidity",
  "illuminance"
];
class ir extends x {
  constructor() {
    super(...arguments), this._bigKeys = ["temperature"];
  }
  static {
    this.styles = [W, K];
  }
  contentRows() {
    return this.levelRows(this._config?.plants?.length ?? 0) + this.fixedRows();
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => ha), document.createElement(
      "horos-greenhouse-tile-editor"
    );
  }
  static getStubConfig() {
    return { plants: [] };
  }
  setConfig(e) {
    if (!e.plants?.length)
      throw new Error("At least one plant is required (plants)");
    const t = e.dry_below ?? We, n = e.wet_above ?? Be;
    if (t >= n)
      throw new Error("dry_below must be smaller than wet_above");
    this._bigKeys = Z(
      e.big_values,
      "temperature",
      hs
    ), this.base = e, this._config = e;
  }
  render() {
    if (!this._config || !this.hass) return m;
    const e = this._config, t = hs.map((h) => ({
      key: h,
      role: p(this.hass, e[h])
    })), n = [], r = [], i = [];
    for (const h of e.plants) {
      const u = M(h), g = p(this.hass, u.entity);
      if (g?.missing) {
        i.push(u.entity);
        continue;
      }
      const f = Y(g), y = Rs(
        f,
        u.dry_below ?? e.dry_below ?? We,
        u.wet_above ?? e.wet_above ?? Be
      ), D = !!g?.unavailable;
      r.push({ status: y, offline: D }), n.push({
        entityId: u.entity,
        name: u.name ?? Xn(g?.stateObj?.attributes.friendly_name) ?? u.entity,
        text: Ge(this.hass, g) ?? Es(this.hass, g) ?? d(this.hass, "value.unknown"),
        ink: u.color ?? lt[y],
        // A silent sensor gets an empty bar, not a full one: an empty bar reads
        // as "nothing is known here", a full one as "soaked".
        level: f ?? 0,
        // Dry is the one that needs a hand today. Soaked shows in the colour.
        alarm: D || y === "dry",
        alarmIcon: D ? "mdi:lan-disconnect" : "mdi:water-off"
      });
    }
    const o = ao(r), l = lo(o), { big: a, rest: c } = X(t, this._bigKeys);
    return this.renderTile({
      icon: co[l],
      color: lt[l],
      primary: e.name ?? d(this.hass, "greenhouse.title"),
      // The card is about the set, so it has no main entity to act on: the
      // driest plant is the one thing worth opening from here.
      mainEntityId: n.find((h) => h.alarm)?.entityId,
      secondary: S([
        o.thirsty ? {
          text: d(this.hass, "greenhouse.thirsty", {
            count: o.thirsty,
            total: o.reporting
          })
        } : o.reporting ? {
          text: d(this.hass, "greenhouse.watered", {
            count: o.reporting
          })
        } : void 0,
        o.soaked ? { text: d(this.hass, "greenhouse.soaked", { count: o.soaked }) } : void 0,
        o.offline ? { text: d(this.hass, "offline.count", { count: o.offline }) } : void 0,
        i.length ? { text: d(this.hass, "list.missing", { count: i.length }) } : void 0,
        ...c.map((h) => F(this.hass, h.role))
      ]),
      values: this.bigValues(a),
      customFeatures: n.length ? G(n, (h) => this.fireMoreInfo(h)) : void 0
    });
  }
}
ho([
  b()
], ir.prototype, "_config");
E("horos-greenhouse-tile", ir, {
  type: "horos-greenhouse-tile",
  name: { ru: "Оранжерея", en: "Greenhouse" },
  description: {
    ru: "Все растения полосками влажности почвы и воздух, которым они дышат",
    en: "Every plant as a bar of soil moisture, and the air they share"
  },
  preview: !0,
  suggest: (s, e) => {
    if (j(e) !== "sensor" || Q(s, e) !== "moisture")
      return null;
    const t = Oe(s, e, "sensor", ["moisture"]);
    return t.length < 2 ? null : L("custom:horos-greenhouse-tile", {}, { plants: t });
  }
});
const mo = {
  "clear-night": "mdi:weather-night",
  cloudy: "mdi:weather-cloudy",
  exceptional: "mdi:alert-circle-outline",
  fog: "mdi:weather-fog",
  hail: "mdi:weather-hail",
  lightning: "mdi:weather-lightning",
  "lightning-rainy": "mdi:weather-lightning-rainy",
  partlycloudy: "mdi:weather-partly-cloudy",
  pouring: "mdi:weather-pouring",
  rainy: "mdi:weather-rainy",
  snowy: "mdi:weather-snowy",
  "snowy-rainy": "mdi:weather-snowy-rainy",
  sunny: "mdi:weather-sunny",
  windy: "mdi:weather-windy",
  "windy-variant": "mdi:weather-windy-variant"
}, po = "mdi:weather-partly-cloudy";
function ds(s) {
  return s && mo[s] || po;
}
function fo(s) {
  return s ? Cs([
    `--state-weather-${ks(s)}-color`,
    "--state-weather-active-color",
    "--state-active-color"
  ]) ?? "var(--state-icon-color)" : "var(--state-inactive-color)";
}
const go = {
  temperature: "mdi:thermometer",
  apparent_temperature: "mdi:thermometer",
  dew_point: "mdi:thermometer-water",
  humidity: "mdi:water-percent",
  pressure: "mdi:gauge",
  wind_speed: "mdi:weather-windy",
  cloud_coverage: "mdi:weather-cloudy",
  uv_index: "mdi:sun-wireless",
  visibility: "mdi:weather-fog",
  precipitation: "mdi:weather-rainy",
  precipitation_probability: "mdi:weather-rainy"
}, _o = [
  "temperature",
  "apparent_temperature",
  "dew_point",
  "humidity",
  "pressure",
  "wind_speed",
  "cloud_coverage",
  "uv_index",
  "visibility"
], vo = {
  temperature: "temperature_unit",
  templow: "temperature_unit",
  apparent_temperature: "temperature_unit",
  dew_point: "temperature_unit",
  pressure: "pressure_unit",
  wind_speed: "wind_speed_unit",
  wind_gust_speed: "wind_speed_unit",
  visibility: "visibility_unit",
  precipitation: "precipitation_unit"
}, or = /* @__PURE__ */ new Set([
  "humidity",
  "cloud_coverage",
  "precipitation_probability"
]);
function bo(s, e) {
  if (or.has(e)) return "%";
  const t = vo[e];
  if (!t) return;
  const n = s?.attributes[t];
  return typeof n == "string" ? n : void 0;
}
const yo = 1;
function ms(s) {
  return ((Number(s?.attributes.supported_features) || 0) & yo) !== 0;
}
const ft = [
  "temperature",
  "precipitation",
  "precipitation_probability",
  "humidity",
  "wind_speed"
], gt = (s) => typeof s == "number" && Number.isFinite(s) ? s : void 0;
function wo(s, e) {
  if (e === "temperature") return $o(s);
  const t = s.map((i) => gt(i[e])), n = t.filter((i) => i !== void 0), r = or.has(e) ? 100 : n.length ? Math.max(...n) : 0;
  return t.map((i) => i === void 0 ? { level: 0 } : r <= 0 ? { level: 0, high: i } : { level: Math.min(100, i / r * 100), high: i });
}
function $o(s) {
  const e = s.map((l) => gt(l.temperature)), t = s.map((l, a) => gt(l.templow) ?? e[a]), n = [...e, ...t].filter(
    (l) => l !== void 0
  );
  if (!n.length) return s.map(() => ({ level: 0 }));
  const r = Math.min(...n), o = Math.max(...n) - r;
  return s.map((l, a) => {
    const c = e[a], h = t[a];
    return c === void 0 || h === void 0 ? { level: 0 } : o <= 0 ? { from: 0, level: 100, low: h, high: c } : {
      from: (h - r) / o * 100,
      level: (c - r) / o * 100,
      low: h,
      high: c
    };
  });
}
var xo = Object.defineProperty, ar = (s, e, t, n) => {
  for (var r = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(e, t, r) || r);
  return r && xo(e, t, r), r;
};
const Eo = 7, ps = 14, ko = ["humidity", "wind_speed"], fs = ["temperature", "humidity"], Co = "3.75em";
class Pt extends x {
  constructor() {
    super(...arguments), this._bigKeys = fs;
  }
  static {
    this.styles = [W, K];
  }
  contentRows() {
    return this.levelRows(this._days().length || this._wanted()) + this.fixedRows();
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => ma), document.createElement(
      "horos-weather-tile-editor"
    );
  }
  static getStubConfig() {
    return { weather: "" };
  }
  setConfig(e) {
    if (!e.weather)
      throw new Error("A weather entity is required (weather)");
    if (e.days !== void 0 && (!Number.isInteger(e.days) || e.days < 1 || e.days > ps))
      throw new Error(`days must be a whole number between 1 and ${ps}`);
    if (e.bar && !ft.includes(e.bar))
      throw new Error(
        `Unknown bar: ${e.bar}. Allowed: ${ft.join(", ")}`
      );
    this._bigKeys = Z(
      e.big_values,
      fs,
      _o
    ), this.base = e, this._config = e;
  }
  // ---- the forecast subscription --------------------------------------
  connectedCallback() {
    super.connectedCallback(), this._subscribe();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._unsubscribe();
  }
  updated(e) {
    super.updated(e), (e.has("_config") || !this._subscribed) && this._subscribe();
  }
  _unsubscribe() {
    this._subscribed?.then((e) => e()).catch(() => {
    }), this._subscribed = void 0, this._subscribedTo = void 0;
  }
  _subscribe() {
    const e = this._config?.weather;
    if (this._subscribed && this._subscribedTo === e) return;
    this._unsubscribe();
    const t = e ? this.hass?.states[e] : void 0;
    if (!this.isConnected || !this.hass?.connection || !e || !t || !ms(t))
      return;
    this._subscribedTo = e;
    const n = this.hass.connection.subscribeMessage(
      (r) => {
        this._forecast = r.forecast ?? [];
      },
      {
        type: "weather/subscribe_forecast",
        forecast_type: "daily",
        entity_id: e
      }
    );
    this._subscribed = n, n.catch(() => {
      this._subscribed === n && this._unsubscribe();
    });
  }
  // ---- rendering -------------------------------------------------------
  _wanted() {
    return this._config?.days ?? Eo;
  }
  /** The days actually drawn: what was asked for, or what the forecast has. */
  _days() {
    return (this._forecast ?? []).slice(0, this._wanted());
  }
  /** The weekday label, in the user's own language. */
  _weekday(e) {
    const t = new Date(e);
    return Number.isNaN(t.getTime()) ? e : new Intl.DateTimeFormat($(this.hass), {
      weekday: "short"
    }).format(t);
  }
  /** An attribute value with its unit split off, ready for a large value. */
  _attribute(e, t, n) {
    const r = n ?? e.attributes[t];
    if (r == null) return;
    const i = bo(e, t), o = this.hass?.formatEntityAttributeValue?.(e, t, n) ?? `${r}${i ? ` ${i}` : ""}`;
    return xt(o, i);
  }
  /**
   * What is written on the right of a row.
   *
   * A temperature row names both ends of its span: the night without a unit,
   * the afternoon with one. A slash between them, not the arrow the heating
   * card uses — there an arrow is the truth, the room is on its way to the
   * target; here both numbers are simply the day, and the arrow read as if the
   * morning were heading for the afternoon. Everything else is one reading.
   */
  _rowText(e, t, n) {
    if (n.high === void 0) return d(this.hass, "value.unknown");
    const r = this._attribute(
      e,
      t === "temperature" ? "temperature" : t,
      n.high
    );
    if (!r) return d(this.hass, "value.unknown");
    const i = `${r.value}${r.unit ? ` ${r.unit}` : ""}`;
    if (t !== "temperature" || n.low === void 0 || n.low === n.high)
      return i;
    const o = this._attribute(e, "templow", n.low);
    return o ? `${o.value} / ${i}` : i;
  }
  render() {
    if (!this._config || !this.hass) return m;
    const e = this._config, t = p(this.hass, e.weather);
    if (t?.missing)
      return this.renderWarning(
        d(this.hass, "entity.missing.one", { list: e.weather })
      );
    const n = t.stateObj, r = e.bar ?? "temperature", i = this._days(), o = wo(i, r), l = i.map((h, u) => ({
      entityId: e.weather,
      name: this._weekday(h.datetime),
      text: this._rowText(n, r, o[u]),
      ink: fo(h.condition),
      icon: ds(h.condition),
      from: o[u].from,
      level: o[u].level
    })), a = [
      "state",
      ...ko.filter(
        (h) => !this._bigKeys.includes(h) && n.attributes[h] !== void 0 && n.attributes[h] !== null
      )
    ], c = [];
    for (const h of this._bigKeys) {
      const u = this._attribute(n, h);
      u && c.push({
        ...u,
        entityId: e.weather,
        icon: go[h]
      });
    }
    return this.renderTile({
      icon: ds(n.state),
      color: N(n),
      primary: e.name ?? n.attributes.friendly_name ?? e.weather,
      mainEntityId: e.weather,
      secondary: S([
        U(this.hass, t),
        this.mainStateSegment(t, a),
        // A forecast the integration does not offer is worth saying out loud:
        // the card is otherwise a tile with an empty half.
        ms(n) ? void 0 : { text: d(this.hass, "weather.noForecast") }
      ]),
      values: c,
      customFeatures: l.length ? G(l, (h) => this.fireMoreInfo(h), {
        nameWidth: Co
      }) : void 0
    });
  }
}
ar([
  b()
], Pt.prototype, "_config");
ar([
  b()
], Pt.prototype, "_forecast");
E("horos-weather-tile", Pt, {
  type: "horos-weather-tile",
  name: { ru: "Погода", en: "Weather" },
  description: {
    ru: "Погода на сегодня в строке и неделя полосками температуры",
    en: "Today on the line and the week as bars of temperature"
  },
  preview: !0,
  suggest: (s, e) => j(e) !== "weather" ? null : L("custom:horos-weather-tile", { weather: e })
});
function lr(s, e) {
  for (const t of e) {
    const n = s.states[t]?.state;
    if (n === void 0 || n.trim() === "") continue;
    const r = Number(n);
    if (Number.isFinite(r)) return { entityId: t, level: r };
  }
  return {};
}
function cr(s, e) {
  let t;
  for (const n of e) {
    const r = s.states[n], i = r?.last_reported ?? r?.last_updated ?? r?.last_changed;
    if (!i) continue;
    const o = Date.parse(i);
    Number.isFinite(o) && (t === void 0 || o > t) && (t = o);
  }
  return t === void 0 ? void 0 : new Date(t);
}
function So(s, e, t, n, r) {
  if (lr(s, e).level === void 0) return !1;
  if (t === void 0) return !0;
  const i = r ?? cr(s, e);
  return !!i && (n.getTime() - i.getTime()) / 1e3 < t;
}
function Ao(s, e) {
  const t = s ? Date.parse(s) : NaN;
  return Number.isFinite(t) ? Math.max(0, Math.ceil((t - e.getTime()) / 6e4)) : 0;
}
const gs = (s) => String(s).padStart(2, "0");
function To(s) {
  if (s.forced)
    return { key: "charge.forced", params: { minutes: s.minutesLeft } };
  if (!s.fresh) {
    if (s.on && s.pulse) return { key: "charge.pulse", params: {} };
    const e = s.since;
    return {
      key: "charge.noData",
      params: {
        time: e ? `${gs(e.getHours())}:${gs(e.getMinutes())}` : "—"
      }
    };
  }
  if (s.on !== void 0)
    return s.on ? s.max === void 0 ? { key: "charge.on", params: {} } : { key: "charge.charging", params: { max: s.max } } : s.min === void 0 ? { key: "charge.off", params: {} } : { key: "charge.waiting", params: { min: s.min } };
}
function Oo(s, e, t, n, r, i) {
  const o = n > 0 ? n : 1;
  let l = Math.round(e / o) * o;
  return t !== void 0 && (l = s === "min" ? Math.min(l, t - o) : Math.max(l, t + o)), l = Math.min(i, Math.max(r, l)), Number(l.toFixed(6));
}
function Po(s) {
  return `{% set _ = now() %}{{ expand(${JSON.stringify(s)}) | map(attribute='last_reported') | map('as_timestamp') | max | default('') }}`;
}
function Io(s, e, t, n) {
  if (s === void 0) return t;
  const r = s + (e > 0 ? e : 1);
  return r > n ? t : Number(r.toFixed(6));
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ro = { ATTRIBUTE: 1 }, jo = (s) => (...e) => ({ _$litDirective$: s, values: e });
let Mo = class {
  constructor(e) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(e, t, n) {
    this._$Ct = e, this._$AM = t, this._$Ci = n;
  }
  _$AS(e, t) {
    return this.update(e, t);
  }
  update(e, t) {
    return this.render(...t);
  }
};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ur = "important", No = " !" + ur, $e = jo(class extends Mo {
  constructor(s) {
    if (super(s), s.type !== Ro.ATTRIBUTE || s.name !== "style" || s.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
  }
  render(s) {
    return Object.keys(s).reduce((e, t) => {
      const n = s[t];
      return n == null ? e : e + `${t = t.includes("-") ? t : t.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${n};`;
    }, "");
  }
  update(s, [e]) {
    const { style: t } = s.element;
    if (this.ft === void 0) return this.ft = new Set(Object.keys(e)), this.render(e);
    for (const n of this.ft) e[n] == null && (this.ft.delete(n), n.includes("-") ? t.removeProperty(n) : t[n] = null);
    for (const n in e) {
      const r = e[n];
      if (r != null) {
        this.ft.add(n);
        const i = typeof r == "string" && r.endsWith(No);
        n.includes("-") || i ? t.setProperty(n, i ? r.slice(0, -11) : r, i ? ur : "") : t[n] = r;
      }
    }
    return ge;
  }
});
var Fo = Object.defineProperty, ne = (s, e, t, n) => {
  for (var r = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(e, t, r) || r);
  return r && Fo(e, t, r), r;
};
class ee extends ae {
  constructor() {
    super(...arguments), this.step = 1, this.lo = 0, this.hi = 100, this.charging = !1, this.trackWidth = 0;
  }
  connectedCallback() {
    super.connectedCallback(), !(typeof ResizeObserver > "u") && (this._resize = new ResizeObserver((e) => {
      this.trackWidth = e[0]?.contentRect.width ?? 0;
    }), this._resize.observe(this));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._resize?.disconnect(), this._resize = void 0;
  }
  static {
    this.styles = ce`
    :host {
      display: block;
      height: var(--feature-height, 42px);
    }

    .track {
      position: relative;
      height: 100%;
      border-radius: var(--feature-border-radius, 12px);
      overflow: hidden;
      touch-action: none;
    }

    /* The empty part of the scale, tinted with the fill's own colour as level bars are. */
    .track::before {
      content: "";
      position: absolute;
      inset: 0;
      background-color: var(--ink);
      opacity: 0.2;
    }

    .fill {
      position: absolute;
      inset-block: 0;
      inset-inline-start: 0;
      background-color: var(--ink);
      transition: width 400ms ease-in-out;
    }

    /*
     * Charging: the shimmer of levels.ts, copied value for value. It is the
     * household's one way of saying "charging" (ha-smart-charging draws the same);
     * keep the two in step.
     */
    .fill.charging {
      background-image: linear-gradient(
        90deg,
        rgb(255 255 255 / 0) 0%,
        rgb(255 255 255 / 0.3) 50%,
        rgb(255 255 255 / 0) 100%
      );
      background-size: 200% 100%;
      animation: level-charging 2s linear infinite;
    }

    @keyframes level-charging {
      from {
        background-position: 200% 0;
      }
      to {
        background-position: -200% 0;
      }
    }

    /* The band the automation leaves alone. */
    .band {
      position: absolute;
      inset-block: 0;
      background-color: var(--primary-text-color);
      opacity: 0.08;
      pointer-events: none;
    }

    /*
     * A handle: a wide transparent hit area (a 6px pill is too thin for a
     * finger) around a visible pill.
     */
    .handle {
      position: absolute;
      inset-block: 0;
      width: 24px;
      transform: translateX(-50%);
      cursor: ew-resize;
      outline: none;
    }

    .handle::after {
      content: "";
      position: absolute;
      inset-block: 25%;
      inset-inline-start: 9px;
      width: 6px;
      border-radius: var(--ha-border-radius-pill, 9999px);
      background-color: var(--primary-text-color);
    }

    .handle:focus-visible::after {
      box-shadow: 0 0 0 2px var(--primary-color);
    }

    .label {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      font-size: var(--ha-font-size-s, 12px);
      font-variant-numeric: tabular-nums;
      color: var(--primary-text-color);
      pointer-events: none;
      white-space: nowrap;
    }

    /*
     * Inside the band, where the ends of the scale cannot cut them off; when the
     * band is too narrow for two numbers they step outside the handles instead.
     */
    .label.min {
      transform: translate(10px, -50%);
    }

    .label.max {
      transform: translate(calc(-100% - 10px), -50%);
    }

    .label.min.outside {
      transform: translate(calc(-100% - 10px), -50%);
    }

    .label.max.outside {
      transform: translate(10px, -50%);
    }

    @media (prefers-reduced-motion: reduce) {
      .fill {
        transition: none;
      }

      .fill.charging {
        animation: none;
      }
    }
  `;
  }
  _value(e) {
    return this._drag?.which === e ? this._drag.value : this[e];
  }
  _other(e) {
    return this._value(e === "min" ? "max" : "min");
  }
  _clamp(e, t) {
    return Oo(e, t, this._other(e), this.step, this.lo, this.hi);
  }
  _emit(e, t) {
    t !== this[e] && this.dispatchEvent(
      new CustomEvent("limit-change", {
        detail: { which: e, value: t },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _onKey(e, t) {
    const n = t.key === "ArrowRight" || t.key === "ArrowUp" ? this.step : t.key === "ArrowLeft" || t.key === "ArrowDown" ? -this.step : 0, r = this[e];
    !n || r === void 0 || (t.preventDefault(), this._emit(e, this._clamp(e, r + n)));
  }
  _valueAt(e) {
    const n = this.shadowRoot.querySelector(".track").getBoundingClientRect(), r = n.width ? (e.clientX - n.left) / n.width : 0;
    return Math.min(1, Math.max(0, r)) * 100;
  }
  _onDown(e, t) {
    this[e] !== void 0 && (t.stopPropagation(), t.currentTarget.setPointerCapture(t.pointerId), this._drag = { which: e, value: this[e] });
  }
  _onMove(e, t) {
    this._drag?.which === e && (this._drag = { which: e, value: this._clamp(e, this._valueAt(t)) });
  }
  _onUp(e, t) {
    if (this._drag?.which !== e) return;
    t.stopPropagation();
    const { value: n } = this._drag;
    this._drag = void 0, this._emit(e, n);
  }
  /**
   * Whether the two numbers fit between the handles: each is about 2.5em of
   * text plus the 10px gap to its handle. Unknown width counts as fitting.
   */
  _labelsOutside() {
    const e = this._value("min"), t = this._value("max");
    return !this.trackWidth || e === void 0 || t === void 0 ? !1 : (t - e) / 100 * this.trackWidth < 64;
  }
  _handle(e, t) {
    const n = this._value(e);
    if (n === void 0) return m;
    const r = `${Math.min(100, Math.max(0, n))}%`;
    return v`
      <div
        class="handle ${e}"
        role="slider"
        tabindex="0"
        aria-label=${e}
        aria-valuemin=${this.lo}
        aria-valuemax=${this.hi}
        aria-valuenow=${n}
        style=${$e({ left: r })}
        @keydown=${(i) => this._onKey(e, i)}
        @pointerdown=${(i) => this._onDown(e, i)}
        @pointermove=${(i) => this._onMove(e, i)}
        @pointerup=${(i) => this._onUp(e, i)}
        @pointercancel=${() => this._drag = void 0}
        @click=${(i) => i.stopPropagation()}
      ></div>
      <span class="label ${e} ${t ? "outside" : ""}" style=${$e({ left: r })}
        >${n}</span
      >
    `;
  }
  render() {
    const e = this.level, t = this._value("min"), n = this._value("max"), r = this._labelsOutside();
    return v`
      <div class="track" style=${$e({ "--ink": _e(e) })}>
        <div
          class="fill ${this.charging ? "charging" : ""}"
          style=${$e({ width: `${Math.min(100, Math.max(0, e ?? 0))}%` })}
        ></div>
        ${t !== void 0 && n !== void 0 ? v`<div
              class="band"
              style=${$e({ left: `${t}%`, width: `${n - t}%` })}
            ></div>` : m}
        ${this._handle("min", r)} ${this._handle("max", r)}
      </div>
    `;
  }
}
ne([
  V({ type: Number })
], ee.prototype, "level");
ne([
  V({ type: Number })
], ee.prototype, "min");
ne([
  V({ type: Number })
], ee.prototype, "max");
ne([
  V({ type: Number })
], ee.prototype, "step");
ne([
  V({ type: Number })
], ee.prototype, "lo");
ne([
  V({ type: Number })
], ee.prototype, "hi");
ne([
  V({ type: Boolean })
], ee.prototype, "charging");
ne([
  b()
], ee.prototype, "trackWidth");
ne([
  b()
], ee.prototype, "_drag");
customElements.get("horos-charge-range") || customElements.define("horos-charge-range", ee);
var Lo = Object.defineProperty, It = (s, e, t, n) => {
  for (var r = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(e, t, r) || r);
  return r && Lo(e, t, r), r;
};
const He = (s) => (Array.isArray(s.battery) ? s.battery : [s.battery]).filter(
  (e) => typeof e == "string" && e !== ""
);
class Je extends x {
  constructor() {
    super(...arguments), this._controlsReady = !1, this._held = !1;
  }
  static {
    this.styles = [
      W,
      ce`
      .charge-line {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: var(--ha-card-feature-gap, 12px);
      }

      horos-charge-range {
        flex: 1 1 0;
        min-width: 0;
      }

      ha-control-button {
        flex: none;
        width: auto;
        min-width: var(--feature-height, 42px);
        height: var(--feature-height, 42px);
        --control-button-border-radius: var(--feature-border-radius, 12px);
        --control-button-padding: 0 var(--ha-space-3, 12px);
        --control-button-background-color: var(--tile-color);
        --control-button-icon-color: var(--tile-color);
        font-size: var(--ha-font-size-s, 12px);
      }

      ha-control-button.active {
        --control-button-background-color: var(--state-active-color, #ffc107);
        --control-button-icon-color: var(--state-active-color, #ffc107);
        --control-button-background-opacity: 0.3;
      }

      .force {
        display: flex;
        align-items: center;
        gap: var(--ha-space-1, 4px);
        white-space: nowrap;
        font-variant-numeric: tabular-nums;
      }

      .force ha-icon {
        --mdc-icon-size: 18px;
      }
    `
    ];
  }
  _subscribeReported() {
    const e = this._config, t = this.hass?.connection;
    this._unsubscribe || !e?.stale_after || !t || !this.isConnected || (this._unsubscribe = t.subscribeMessage(
      (n) => {
        const r = Number(n.result);
        this._reported = n.result !== "" && Number.isFinite(r) ? new Date(r * 1e3) : void 0;
      },
      { type: "render_template", template: Po(He(e)) }
    ).catch(() => (this._unsubscribe = void 0, async () => {
    })));
  }
  _unsubscribeReported() {
    this._unsubscribe?.then((e) => e()).catch(() => {
    }), this._unsubscribe = void 0, this._reported = void 0;
  }
  updated(e) {
    super.updated?.(e), this._subscribeReported();
  }
  connectedCallback() {
    super.connectedCallback(), As().then((e) => {
      this._controlsReady = e;
    }), this._tick = setInterval(() => this.requestUpdate(), 3e4);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._tick && clearInterval(this._tick), this._tick = void 0, this._unsubscribeReported();
  }
  contentRows() {
    return 1;
  }
  fixedRows() {
    return 1;
  }
  getGridOptions() {
    return { ...super.getGridOptions(), columns: 12, rows: 2, min_rows: 2 };
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => pa), document.createElement("horos-charge-tile-editor");
  }
  static getStubConfig() {
    return { battery: [], switch: "", min: "", max: "" };
  }
  setConfig(e) {
    if (!He(e).length) throw new Error("A battery sensor is required (battery)");
    const { features: t, levels: n, ...r } = e;
    this.base = r, this._unsubscribeReported(), this._config = e;
  }
  _number(e, t) {
    const n = e ? this.hass?.states[e] : void 0;
    if (!n) return;
    const r = t ? n.attributes[t] : n.state;
    if (r == null || Ke.has(String(r)))
      return;
    const i = Number(r);
    return Number.isFinite(i) ? i : void 0;
  }
  _setLimit(e) {
    const t = this._config;
    if (!t || !this.hass) return;
    const n = t[e.detail.which];
    n && this.hass.callService(n.split(".")[0], "set_value", {
      entity_id: n,
      value: e.detail.value
    }).catch(() => {
    });
  }
  _periodDown() {
    this._held = !1, clearTimeout(this._holdTimer), this._holdTimer = setTimeout(() => {
      this._held = !0, this._config?.pulse_every && this.fireMoreInfo(this._config.pulse_every);
    }, 500);
  }
  _periodUp() {
    clearTimeout(this._holdTimer);
  }
  _periodTap(e) {
    if (e.stopPropagation(), this._held) {
      this._held = !1;
      return;
    }
    const t = this._config?.pulse_every;
    if (!t || !this.hass) return;
    const n = Io(
      this._number(t),
      this._number(t, "step") ?? 1,
      this._number(t, "min") ?? 1,
      this._number(t, "max") ?? 48
    );
    this.hass.callService(t.split(".")[0], "set_value", { entity_id: t, value: n }).catch(() => {
    });
  }
  _toggleForce(e) {
    e.stopPropagation();
    const t = this._config?.force;
    if (!t || !this.hass) return;
    const n = this.hass.states[t]?.state === "active";
    this.hass.callService("timer", n ? "cancel" : "start", { entity_id: t });
  }
  render() {
    if (!this._config || !this.hass) return m;
    const e = this._config, t = this.hass, n = He(e), r = /* @__PURE__ */ new Date(), i = p(t, e.switch), o = this.missingRolesWarning([
      i,
      p(t, e.min),
      p(t, e.max),
      p(t, e.force),
      p(t, e.pulse_every),
      // A battery list is fine with one of its sensors gone, not with all.
      n.every((ie) => !t.states[ie]) ? p(t, n[0]) : void 0
    ]);
    if (o) return this.renderWarning(o);
    const { entityId: l, level: a } = lr(t, n), c = l ?? n[0], h = i ? i.stateObj?.state === "on" : void 0, u = e.force ? t.states[e.force] : void 0, g = u?.state === "active", f = Ao(u?.attributes.finishes_at, r), y = this._number(e.min), D = this._number(e.max), w = To({
      forced: g,
      minutesLeft: f,
      fresh: So(t, n, e.stale_after, r, this._reported),
      on: h,
      pulse: !!e.pulse_every,
      min: y,
      max: D,
      since: this._reported ?? cr(t, n)
    }), B = t.states[c], se = this.renderTile({
      icon: "mdi:watch",
      // Lit while the port is on; the battery itself is always "active". With
      // no port there is nothing to be on, and the icon takes the battery colour.
      color: i ? h ? N(i.stateObj) : "var(--state-inactive-color)" : _e(a),
      primary: e.name ?? B?.attributes.friendly_name ?? d(t, "charge.title"),
      secondary: S([
        U(t, i) ?? (w ? {
          text: d(t, w.key, w.params),
          entityId: g ? e.force : e.switch ?? c
        } : void 0)
      ]),
      mainEntityId: c,
      // With a port the icon switches it by hand — the card works without the
      // automation too. The action names the port itself: the card's main
      // entity is the battery, and a toggle aimed at a sensor does nothing.
      defaultIconAction: e.switch ? { action: "toggle", entity: e.switch } : ue(c),
      values: a === void 0 ? [] : [{ value: String(Math.round(a)), unit: "%", entityId: c }],
      customFeatures: v`<div class="charge-line">
        <horos-charge-range
          .level=${a}
          .min=${y}
          .max=${D}
          .step=${this._number(e.min, "step") ?? 1}
          .lo=${this._number(e.min, "min") ?? 0}
          .hi=${this._number(e.max, "max") ?? 100}
          .charging=${h ?? !1}
          @limit-change=${this._setLimit}
        ></horos-charge-range>
        ${e.pulse_every && this._controlsReady ? v`<ha-control-button
              .label=${d(t, "charge.everyLabel")}
              title=${d(t, "charge.everyLabel")}
              @pointerdown=${this._periodDown}
              @pointerup=${this._periodUp}
              @pointercancel=${this._periodUp}
              @pointerleave=${this._periodUp}
              @click=${this._periodTap}
            >
              <span class="force">
                <ha-icon icon="mdi:timer-sync-outline"></ha-icon>
                ${d(t, "charge.every", {
        hours: this._number(e.pulse_every) ?? "—"
      })}
              </span>
            </ha-control-button>` : m}
        ${e.force && this._controlsReady ? v`<ha-control-button
              class=${g ? "active" : ""}
              .label=${d(t, "charge.force")}
              @click=${this._toggleForce}
            >
              <span class="force">
                <ha-icon icon="mdi:lightning-bolt"></ha-icon>
                ${g ? d(t, "charge.forceLeft", { minutes: f }) : d(t, "charge.force")}
              </span>
            </ha-control-button>` : m}
      </div>`
    });
    return this.toggleAttribute("filled", !0), se;
  }
}
It([
  b()
], Je.prototype, "_config");
It([
  b()
], Je.prototype, "_controlsReady");
It([
  b()
], Je.prototype, "_reported");
E("horos-charge-tile", Je, {
  type: "horos-charge-tile",
  name: { ru: "Зарядка", en: "Charge" },
  description: {
    ru: "Заряд, пределы зарядки и принудительная зарядка одного устройства",
    en: "Battery, charging limits and a forced charge for one device"
  },
  preview: !1
});
console.info(
  "%c HOROS-CARDS %c 0.7.0 ",
  "background:#03a9f4;color:#fff;border-radius:3px 0 0 3px;padding:2px 4px",
  "background:#555;color:#fff;border-radius:0 3px 3px 0;padding:2px 4px"
);
var Ho = Object.defineProperty, Rt = (s, e, t, n) => {
  for (var r = void 0, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(e, t, r) || r);
  return r && Ho(e, t, r), r;
};
class Qe extends ae {
  constructor() {
    super(...arguments), this._computeHelper = (e) => e.name === "color" ? this.pick({
      ru: {
        color: "Неактивное состояние (например, off или closed) окрашено не будет."
      },
      en: {
        color: "Inactive state (for example, off or closed) will not be coloured."
      }
    }).color : void 0, this._computeLabel = (e) => this.labels[e.name] ?? this.pick({ ru: O, en: P })[e.name] ?? e.name;
  }
  static {
    this.styles = ce`
    ha-form {
      display: block;
      margin-bottom: var(--ha-space-6, 24px);
    }

    ha-expansion-panel {
      display: block;
      --expansion-panel-content-padding: 0;
      border-radius: var(--ha-border-radius-md, 12px);
      --ha-card-border-radius: var(--ha-border-radius-md, 12px);
    }

    ha-expansion-panel .content {
      padding: var(--ha-space-3, 12px);
    }

    ha-expansion-panel > *[slot="header"] {
      margin: 0;
      font-size: inherit;
      font-weight: inherit;
    }

    ha-expansion-panel ha-icon,
    ha-expansion-panel ha-svg-icon {
      color: var(--secondary-text-color);
    }

    /* The features position selector sits inside the panel, not after it. */
    .features-form {
      margin-top: var(--ha-space-6, 24px);
      margin-bottom: 0;
    }
  `;
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
Rt([
  V({ attribute: !1 })
], Qe.prototype, "hass");
Rt([
  b()
], Qe.prototype, "_config");
class C extends Qe {
  constructor() {
    super(...arguments), this._featuresEditorReady = !1;
  }
  connectedCallback() {
    super.connectedCallback(), In().then((e) => {
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
  /**
   * What the card puts under the line when the config says nothing about it.
   * The editor shows those as the current list — that is what makes them
   * switchable: a card's own controls are removed the same way a stock feature
   * is, and there is no second switch for them anywhere else.
   */
  defaultFeatures() {
    return [];
  }
  /** Where the card puts its features when the config says nothing. */
  defaultFeaturesPosition() {
    return "bottom";
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
  /**
   * A feature with settings of its own — a gauge's bounds, the list of modes —
   * is edited in a sub-view of the card dialog. The dialog opens it in response
   * to `edit-sub-element`; without this the pencil on a feature does nothing.
   */
  _editFeature(e) {
    e.stopPropagation();
    const t = e.detail.subElementConfig?.index;
    if (t === void 0) return;
    const n = this._config?.features ?? this.defaultFeatures();
    this.dispatchEvent(
      new CustomEvent("edit-sub-element", {
        detail: {
          type: "feature",
          config: n[t],
          context: { entity_id: this.featuresEntity },
          saveConfig: (r) => {
            const i = [...n];
            i[t] = r, this.dispatchEvent(
              new CustomEvent("config-changed", {
                detail: { config: { ...this._config, features: i } },
                bubbles: !0,
                composed: !0
              })
            );
          }
        },
        bubbles: !0,
        composed: !0
      })
    );
  }
  fromForm(e) {
    const { content_layout: t, ...n } = e, r = { ...n };
    return t === "vertical" && (r.vertical = !0), r;
  }
  /** The features section repeats the markup of the stock tile's editor. */
  /**
   * The entity the features act on. Usually the card's main one; a card built
   * from a list of equal entities has to name one itself, or the panel has
   * nothing to address the features to and stays hidden.
   */
  get featuresEntity() {
    return this.entityField ? this._config?.[this.entityField] : void 0;
  }
  _renderFeatures() {
    const e = this.featuresEntity;
    if (!e) return m;
    const t = this._config?.features ?? this.defaultFeatures(), n = this.pick({ ru: O, en: P }), r = this.pick({
      ru: {
        bottom: "Снизу",
        bottom_description: "Все features друг под другом",
        inline: "В строке",
        inline_description: "Features в две колонки, начиная со строки с названием",
        helper_vertical: "При вертикальном содержимом всегда отображаются снизу"
      },
      en: {
        bottom: "Bottom",
        bottom_description: "Displays all features stacked",
        inline: "Inline",
        inline_description: "Displays features in two columns, starting next to the name",
        helper_vertical: "Always displayed at the bottom if the content layout is vertical"
      }
    }), i = (a, c) => this.hass?.localize(`ui.panel.lovelace.editor.card.tile.${a}`) || c, o = !!this._config?.vertical, l = {
      ...this._config,
      features_position: o ? "bottom" : this._config?.features_position ?? this.defaultFeaturesPosition()
    };
    return v`
      <ha-expansion-panel outlined>
        <ha-icon slot="leading-icon" icon="mdi:list-box"></ha-icon>
        <h3 slot="header">${n.features}</h3>
        <div class="content">
          <hui-card-features-editor
            .hass=${this.hass}
            .context=${{ entity_id: e }}
            .features=${t}
            @features-changed=${this._featuresChanged}
            @edit-detail-element=${this._editFeature}
          ></hui-card-features-editor>
          ${t.length ? v`
                <ha-form
                  class="features-form"
                  .hass=${this.hass}
                  .data=${l}
                  .schema=${[
      {
        name: "features_position",
        required: !0,
        selector: {
          select: {
            mode: "box",
            options: ["bottom", "inline"].map(
              (a) => ({
                value: a,
                label: i(
                  `features_position_options.${a}`,
                  r[a]
                ),
                description: i(
                  `features_position_options.${a}_description`,
                  r[`${a}_description`]
                ),
                image: {
                  src: `/static/images/form/tile_features_position_${a}.svg`,
                  src_dark: `/static/images/form/tile_features_position_${a}_dark.svg`,
                  flip_rtl: !0
                },
                disabled: o && a === "inline"
              })
            )
          }
        }
      }
    ]}
                  .computeLabel=${this._computeLabel}
                  .computeHelper=${() => o ? i(
      "features_position_helper_vertical",
      r.helper_vertical
    ) : void 0}
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
Rt([
  b()
], C.prototype, "_featuresEditorReady");
const A = (s, e, t = []) => ({
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
}), it = (s) => s ? { entity_id: s, area_id: "area" } : void 0, T = (s, e) => ({
  name: "interactions",
  type: "expandable",
  flatten: !0,
  icon: "mdi:gesture-tap",
  schema: [
    {
      name: "tap_action",
      selector: { ui_action: { default_action: "more-info" } },
      context: it(s)
    },
    { name: "", type: "divider" },
    {
      name: "icon_tap_action",
      selector: { ui_action: { default_action: e } },
      context: it(s)
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
        context: it(s)
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
}, P = {
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
}, _ = (s, e) => ({
  entity: {
    filter: e ? { domain: s, device_class: e } : { domain: s }
  }
}), q = (s, e, t) => ({
  number: { min: s, max: e, mode: "box", unit_of_measurement: t }
}), Do = { text: {} }, te = (s) => ({
  select: { multiple: !0, mode: "list", options: s }
}), z = { boolean: {} };
class hr extends C {
  get entityField() {
    return "temperature";
  }
  get schema() {
    const e = $(this.hass);
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
      A("temperature", e, [
        {
          name: "big_values",
          selector: te([
            { value: "temperature", label: e === "ru" ? "Температура" : "Temperature" },
            { value: "humidity", label: e === "ru" ? "Влажность" : "Humidity" },
            { value: "illuminance", label: e === "ru" ? "Освещённость" : "Illuminance" },
            { value: "pm25", label: "PM2.5" }
          ])
        }
      ]),
      T("temperature", "none")
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
k("horos-climate-tile-editor", hr);
const Uo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosClimateTileEditor: hr
}, Symbol.toStringTag, { value: "Module" }));
class dr extends C {
  get entityField() {
    return "switch";
  }
  get schema() {
    const e = $(this.hass);
    return [
      { name: "switch", required: !0, selector: _("switch") },
      { name: "power", selector: _("sensor", "power") },
      { name: "energy", selector: _("sensor", "energy") },
      A("switch", e, [
        {
          name: "big_values",
          selector: te([
            { value: "power", label: e === "ru" ? "Мощность" : "Power" },
            { value: "energy", label: e === "ru" ? "Энергия" : "Energy" },
            { value: "switch", label: e === "ru" ? "Состояние" : "State" }
          ])
        }
      ]),
      T("switch", "toggle")
    ];
  }
  defaultFeatures() {
    const e = this._config;
    return at(e);
  }
  get labels() {
    return this.pick({
      ru: {
        name: "Название",
        switch: "Выключатель",
        power: "Мощность",
        energy: "Энергия",
        big_values: "Крупно справа (не больше двух)"
      },
      en: {
        name: "Name",
        switch: "Switch",
        power: "Power",
        energy: "Energy",
        big_values: "Large on the right (up to two)"
      }
    });
  }
}
k("horos-plug-tile-editor", dr);
const zo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosPlugTileEditor: dr
}, Symbol.toStringTag, { value: "Module" }));
class mr extends C {
  get entityField() {
    return "moisture";
  }
  get schema() {
    const e = $(this.hass);
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
      { name: "dry_below", selector: q(0, 100, "%") },
      { name: "wet_above", selector: q(0, 100, "%") },
      A("moisture", e, [
        {
          name: "big_values",
          selector: te([
            { value: "moisture", label: e === "ru" ? "Влажность почвы" : "Soil moisture" },
            { value: "temperature", label: e === "ru" ? "Температура почвы" : "Soil temperature" },
            { value: "battery", label: e === "ru" ? "Заряд датчика" : "Sensor battery" }
          ])
        }
      ]),
      T("moisture", "none")
    ];
  }
  defaultFeatures() {
    const e = this._config;
    return ct(this.hass, e);
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
k("horos-plant-tile-editor", mr);
const Wo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosPlantTileEditor: mr
}, Symbol.toStringTag, { value: "Module" }));
function R(s, e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of s ?? [])
    t.set(typeof n == "string" ? n : n.entity, n);
  return e.map((n) => t.get(n) ?? n);
}
function I(s) {
  return (s ?? []).map(
    (e) => typeof e == "string" ? e : e.entity
  );
}
class pr extends Qe {
  get schema() {
    return [
      { name: "name", selector: Do },
      { name: "icon", selector: { icon: {} } },
      { name: "columns", selector: q(1, 6) },
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
        ...P,
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
      buttons: I(e.buttons)
    };
  }
  fromForm(e) {
    return {
      ...e,
      buttons: R(
        this._config?.buttons,
        e.buttons ?? []
      )
    };
  }
}
k("horos-buttons-tile-editor", pr);
const Bo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosButtonsTileEditor: pr
}, Symbol.toStringTag, { value: "Module" }));
class fr extends C {
  get entityField() {
    return "status";
  }
  get schema() {
    const e = $(this.hass);
    return [
      { name: "icon", selector: { icon: {} } },
      { name: "status", selector: _("sensor") },
      {
        name: "cartridges",
        required: !0,
        selector: {
          entity: { multiple: !0, filter: [{ domain: "sensor" }] }
        }
      },
      {
        name: "low_below",
        selector: {
          number: { min: 0, max: 100, mode: "box", unit_of_measurement: "%" }
        }
      },
      {
        name: "sensors",
        selector: { entity: { multiple: !0 } }
      },
      A("status", e, [
        { name: "levels", selector: z }
      ]),
      T("status", "none")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...O,
        levels: "Строки уровней",
        name: "Название принтера",
        status: "Состояние принтера",
        cartridges: "Картриджи",
        low_below: "Мало чернил ниже",
        sensors: "Прочее про принтер"
      },
      en: {
        ...P,
        levels: "Level rows",
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
      cartridges: I(e.cartridges),
      sensors: I(e.sensors)
    };
  }
  fromForm(e) {
    return {
      ...e,
      cartridges: R(
        this._config?.cartridges,
        e.cartridges ?? []
      ),
      sensors: R(
        this._config?.sensors,
        e.sensors ?? []
      )
    };
  }
}
k("horos-printer-tile-editor", fr);
const qo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosPrinterTileEditor: fr
}, Symbol.toStringTag, { value: "Module" }));
class gr extends C {
  get entityField() {
    return "vacuum";
  }
  get schema() {
    const e = $(this.hass);
    return [
      { name: "vacuum", required: !0, selector: _("vacuum") },
      { name: "battery", selector: _("sensor", "battery") },
      { name: "sensors", selector: { entity: { multiple: !0 } } },
      { name: "consumables", selector: { entity: { multiple: !0 } } },
      { name: "low_below", selector: q(0, 100, "%") },
      A("vacuum", e, [
        { name: "levels", selector: z }
      ]),
      T("vacuum", "none")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...O,
        levels: "Строки уровней",
        name: "Название",
        vacuum: "Пылесос",
        battery: "Заряд",
        sensors: "Что ещё сказать",
        consumables: "Расходники",
        low_below: "Просит замены ниже"
      },
      en: {
        ...P,
        levels: "Level rows",
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
      sensors: I(e.sensors),
      consumables: I(e.consumables)
    };
  }
  fromForm(e) {
    return {
      ...e,
      sensors: R(
        this._config?.sensors,
        e.sensors ?? []
      ),
      consumables: R(
        this._config?.consumables,
        e.consumables ?? []
      )
    };
  }
}
k("horos-vacuum-tile-editor", gr);
const Vo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosVacuumTileEditor: gr
}, Symbol.toStringTag, { value: "Module" }));
class _r extends C {
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
      { name: "low_below", selector: q(0, 100, "%") },
      A(void 0, e),
      T(void 0, "none")
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
        ...P,
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
      batteries: I(e.batteries)
    };
  }
  fromForm(e) {
    return {
      ...e,
      batteries: R(
        this._config?.batteries,
        e.batteries ?? []
      )
    };
  }
}
k("horos-batteries-tile-editor", _r);
const Ko = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosBatteriesTileEditor: _r
}, Symbol.toStringTag, { value: "Module" }));
class vr extends C {
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
      A(void 0, e),
      T(void 0, "none")
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
        ...P,
        name: "Name",
        sensors: "Sensors"
      }
    });
  }
  get formData() {
    const e = this._config ?? {};
    return {
      ...e,
      sensors: I(e.sensors)
    };
  }
  fromForm(e) {
    return {
      ...e,
      sensors: R(
        this._config?.sensors,
        e.sensors ?? []
      )
    };
  }
}
k("horos-safety-tile-editor", vr);
const Go = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosSafetyTileEditor: vr
}, Symbol.toStringTag, { value: "Module" }));
class br extends C {
  get entityField() {
    return "status";
  }
  get schema() {
    const e = $(this.hass);
    return [
      { name: "status", selector: { entity: {} } },
      { name: "disk", selector: _("sensor", "data_size") },
      { name: "download", selector: _("sensor", "data_rate") },
      { name: "upload", selector: _("sensor", "data_rate") },
      { name: "services", selector: { entity: { multiple: !0 } } },
      A("status", e),
      T("status", "none")
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
        ...P,
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
      services: I(e.services)
    };
  }
  fromForm(e) {
    return {
      ...e,
      services: R(
        this._config?.services,
        e.services ?? []
      )
    };
  }
}
k("horos-server-tile-editor", br);
const Yo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosServerTileEditor: br
}, Symbol.toStringTag, { value: "Module" }));
class yr extends C {
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
      },
      A("person", e, [
        { name: "levels", selector: z }
      ]),
      T("person", "none")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...O,
        levels: "Строки устройств",
        name: "Имя",
        person: "Человек",
        battery: "Заряд основного устройства",
        location: "Где именно",
        devices: "Остальные устройства"
      },
      en: {
        ...P,
        levels: "Device rows",
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
      devices: I(e.devices)
    };
  }
  fromForm(e) {
    return {
      ...e,
      devices: R(
        this._config?.devices,
        e.devices ?? []
      )
    };
  }
}
k("horos-person-tile-editor", yr);
const Xo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosPersonTileEditor: yr
}, Symbol.toStringTag, { value: "Module" }));
class wr extends C {
  get entityField() {
    return "status";
  }
  get schema() {
    const e = $(this.hass);
    return [
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
        selector: {
          entity: { multiple: !0, filter: [{ domain: "binary_sensor" }] }
        }
      },
      A("status", e, [
        {
          name: "big_values",
          selector: te([
            {
              value: "temperature",
              label: e === "ru" ? "Самая горячая точка" : "Hottest spot"
            },
            { value: "cpu", label: e === "ru" ? "Процессор" : "CPU" },
            { value: "memory", label: e === "ru" ? "Память" : "Memory" },
            { value: "gpu", label: e === "ru" ? "Видеокарта" : "GPU" },
            {
              value: "disk",
              label: e === "ru" ? "Самый полный диск" : "Fullest disk"
            }
          ])
        },
        { name: "levels", selector: z }
      ]),
      T("status", "none")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...O,
        levels: "Строки нагрузки",
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
        ...P,
        levels: "Load rows",
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
      sensors: I(e.sensors),
      alerts: I(e.alerts)
    };
  }
  fromForm(e) {
    return {
      ...e,
      sensors: R(
        this._config?.sensors,
        e.sensors ?? []
      ),
      alerts: R(
        this._config?.alerts,
        e.alerts ?? []
      )
    };
  }
}
k("horos-computer-tile-editor", wr);
const Zo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosComputerTileEditor: wr
}, Symbol.toStringTag, { value: "Module" }));
class $r extends C {
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
      { name: "pm25", selector: _("sensor", "pm25") },
      { name: "humidity", selector: _("sensor", "humidity") },
      { name: "temperature", selector: _("sensor", "temperature") },
      { name: "power", selector: _("sensor", "power") },
      { name: "sensors", selector: { entity: { multiple: !0 } } },
      {
        name: "alerts",
        selector: { entity: { multiple: !0, filter: [{ domain: "binary_sensor" }] } }
      },
      A("appliance", e, [
        {
          name: "big_values",
          selector: te([
            { value: "pm25", label: "PM2.5" },
            { value: "humidity", label: e === "ru" ? "Влажность" : "Humidity" },
            { value: "temperature", label: e === "ru" ? "Температура" : "Temperature" },
            { value: "power", label: e === "ru" ? "Мощность" : "Power" }
          ])
        }
      ]),
      T("appliance", "toggle")
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
        ...P,
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
      sensors: I(e.sensors),
      alerts: I(e.alerts)
    };
  }
  fromForm(e) {
    return {
      ...e,
      sensors: R(
        this._config?.sensors,
        e.sensors ?? []
      ),
      alerts: R(
        this._config?.alerts,
        e.alerts ?? []
      )
    };
  }
}
k("horos-air-tile-editor", $r);
const Jo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosAirTileEditor: $r
}, Symbol.toStringTag, { value: "Module" }));
class xr extends C {
  get entityField() {
    return "cover";
  }
  get schema() {
    const e = $(this.hass);
    return [
      { name: "cover", required: !0, selector: _("cover") },
      { name: "position", selector: _("sensor") },
      {
        name: "illuminance",
        selector: _("sensor", "illuminance")
      },
      { name: "battery", selector: _("sensor", "battery") },
      A("cover", e, [
        {
          name: "big_values",
          selector: te([
            {
              value: "illuminance",
              label: e === "ru" ? "Освещённость" : "Illuminance"
            },
            { value: "battery", label: e === "ru" ? "Заряд" : "Battery" }
          ])
        },
        { name: "levels", selector: z }
      ]),
      T("cover", "none")
    ];
  }
  defaultFeatures() {
    const e = this._config;
    return ut(this.hass, e);
  }
  get labels() {
    return this.pick({
      ru: {
        ...O,
        levels: "Строка положения",
        name: "Название",
        cover: "Штора",
        position: "Насколько открыто",
        illuminance: "Освещённость",
        battery: "Заряд",
        big_values: "Крупно справа (не больше трёх)"
      },
      en: {
        ...P,
        levels: "Position row",
        name: "Name",
        cover: "Cover",
        position: "Position",
        illuminance: "Illuminance",
        battery: "Battery",
        big_values: "Large on the right (up to three)"
      }
    });
  }
}
k("horos-cover-tile-editor", xr);
const Qo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosCoverTileEditor: xr
}, Symbol.toStringTag, { value: "Module" }));
class Er extends C {
  get entityField() {
  }
  get schema() {
    const e = $(this.hass);
    return [
      { name: "limit", selector: q(1, 12) },
      { name: "ignore", selector: { entity: { multiple: !0 } } },
      A(void 0, e),
      T(void 0, "none")
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
        ...P,
        limit: "How many devices to name",
        ignore: "Silence of these is normal"
      }
    });
  }
}
k("horos-offline-tile-editor", Er);
const ea = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosOfflineTileEditor: Er
}, Symbol.toStringTag, { value: "Module" }));
class kr extends C {
  get entityField() {
    return "total";
  }
  get schema() {
    const e = $(this.hass);
    return [
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
      { name: "limit", selector: q(1, 12) },
      A("total", e, [
        { name: "levels", selector: z }
      ]),
      T("total", "none")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...O,
        levels: "Строки потребителей",
        name: "Название",
        total: "Общая мощность",
        consumers: "Потребители",
        limit: "Сколько показывать"
      },
      en: {
        ...P,
        levels: "Consumer rows",
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
      consumers: I(e.consumers)
    };
  }
  fromForm(e) {
    return {
      ...e,
      consumers: R(
        this._config?.consumers,
        e.consumers ?? []
      )
    };
  }
}
k("horos-energy-tile-editor", kr);
const ta = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosEnergyTileEditor: kr
}, Symbol.toStringTag, { value: "Module" }));
class Cr extends C {
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
      A(void 0, e),
      T(void 0, "none")
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
        ...P,
        name: "Name",
        areas: "Areas"
      }
    });
  }
  get formData() {
    const e = this._config ?? {};
    return {
      ...e,
      areas: I(e.areas)
    };
  }
  fromForm(e) {
    return {
      ...e,
      areas: R(
        this._config?.areas,
        e.areas ?? []
      )
    };
  }
}
k("horos-presence-tile-editor", Cr);
const sa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosPresenceTileEditor: Cr
}, Symbol.toStringTag, { value: "Module" }));
class Sr extends C {
  get entityField() {
    return "group";
  }
  get schema() {
    const e = $(this.hass);
    return [
      {
        name: "lights",
        required: !0,
        selector: { entity: { multiple: !0, filter: { domain: "light" } } }
      },
      { name: "group", selector: _("light") },
      A("group", e, [
        { name: "levels", selector: z }
      ]),
      T("group", "toggle")
    ];
  }
  defaultFeatures() {
    const e = this._config;
    return ht(e);
  }
  get labels() {
    return this.pick({
      ru: {
        ...O,
        levels: "Строки ламп",
        name: "Название",
        lights: "Лампы",
        group: "Группа (главная сущность)"
      },
      en: {
        ...P,
        levels: "Light rows",
        name: "Name",
        lights: "Lights",
        group: "Group (the main entity)"
      }
    });
  }
  get formData() {
    const e = this._config ?? {};
    return {
      ...e,
      lights: I(e.lights)
    };
  }
  fromForm(e) {
    return {
      ...e,
      lights: R(
        this._config?.lights,
        e.lights ?? []
      )
    };
  }
}
k("horos-light-tile-editor", Sr);
const ra = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosLightTileEditor: Sr
}, Symbol.toStringTag, { value: "Module" }));
class Ar extends C {
  get entityField() {
  }
  get schema() {
    const e = $(this.hass);
    return [
      {
        name: "players",
        required: !0,
        selector: {
          entity: { multiple: !0, filter: { domain: "media_player" } }
        }
      },
      A(void 0, e, [
        { name: "levels", selector: z }
      ]),
      T(void 0, "more-info")
    ];
  }
  /** The playback buttons act on the first player in the list. */
  get featuresEntity() {
    const e = this._config?.players ?? [];
    return I(e)[0];
  }
  defaultFeatures() {
    const e = this._config;
    return dt(e);
  }
  get labels() {
    return this.pick({
      ru: {
        ...O,
        levels: "Строки плееров",
        name: "Название",
        players: "Проигрыватели"
      },
      en: {
        ...P,
        levels: "Player rows",
        name: "Name",
        players: "Players"
      }
    });
  }
  get formData() {
    const e = this._config ?? {};
    return {
      ...e,
      players: I(e.players)
    };
  }
  fromForm(e) {
    return {
      ...e,
      players: R(
        this._config?.players,
        e.players ?? []
      )
    };
  }
}
k("horos-media-tile-editor", Ar);
const na = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosMediaTileEditor: Ar
}, Symbol.toStringTag, { value: "Module" }));
class Tr extends C {
  get entityField() {
    return "climate";
  }
  get schema() {
    const e = $(this.hass);
    return [
      { name: "climate", required: !0, selector: _("climate") },
      { name: "temperature", selector: _("sensor", "temperature") },
      { name: "humidity", selector: _("sensor", "humidity") },
      { name: "power", selector: _("sensor", "power") },
      { name: "sensors", selector: { entity: { multiple: !0 } } },
      A("climate", e, [
        {
          name: "big_values",
          selector: te([
            { value: "temperature", label: e === "ru" ? "Температура" : "Temperature" },
            { value: "humidity", label: e === "ru" ? "Влажность" : "Humidity" },
            { value: "power", label: e === "ru" ? "Мощность" : "Power" }
          ])
        }
      ]),
      T("climate", "more-info")
    ];
  }
  defaultFeatures() {
    const e = this._config;
    return mt(e);
  }
  defaultFeaturesPosition() {
    return "inline";
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
        big_values: "Крупно справа (не больше трёх)"
      },
      en: {
        ...P,
        name: "Name",
        climate: "Climate entity",
        temperature: "Room temperature",
        humidity: "Room humidity",
        power: "Power",
        sensors: "What else to show",
        big_values: "Large on the right (up to three)"
      }
    });
  }
  get formData() {
    const e = this._config ?? {};
    return {
      ...e,
      sensors: I(e.sensors)
    };
  }
  fromForm(e) {
    return {
      ...e,
      sensors: R(
        this._config?.sensors,
        e.sensors ?? []
      )
    };
  }
}
k("horos-ac-tile-editor", Tr);
const ia = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosAcTileEditor: Tr
}, Symbol.toStringTag, { value: "Module" }));
class Or extends C {
  get entityField() {
  }
  get schema() {
    const e = $(this.hass);
    return [
      { name: "limit", selector: q(1, 20) },
      { name: "include_skipped", selector: z },
      { name: "ignore", selector: { entity: { multiple: !0, filter: { domain: "update" } } } },
      A(void 0, e),
      T(void 0, "more-info")
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
        ...P,
        name: "Name",
        limit: "How many to name",
        include_skipped: "Count skipped versions too",
        ignore: "Do not count"
      }
    });
  }
}
k("horos-updates-tile-editor", Or);
const oa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosUpdatesTileEditor: Or
}, Symbol.toStringTag, { value: "Module" }));
class Pr extends C {
  get entityField() {
  }
  get schema() {
    const e = $(this.hass);
    return [
      {
        name: "lists",
        required: !0,
        selector: { entity: { multiple: !0, filter: { domain: "todo" } } }
      },
      { name: "calendar", selector: _("calendar") },
      A(void 0, e, [
        { name: "levels", selector: z }
      ]),
      T(void 0, "more-info")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...O,
        levels: "Строки списков",
        name: "Название",
        lists: "Списки дел",
        calendar: "Календарь"
      },
      en: {
        ...P,
        levels: "List rows",
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
      lists: I(e.lists)
    };
  }
  fromForm(e) {
    return {
      ...e,
      lists: R(
        this._config?.lists,
        e.lists ?? []
      )
    };
  }
}
k("horos-tasks-tile-editor", Pr);
const aa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosTasksTileEditor: Pr
}, Symbol.toStringTag, { value: "Module" }));
class Ir extends C {
  get entityField() {
  }
  get schema() {
    const e = $(this.hass);
    return [
      { name: "alerts", required: !0, selector: { entity: { multiple: !0 } } },
      { name: "limit", selector: q(1, 20) },
      { name: "watch_offline", selector: z },
      A(void 0, e),
      T(void 0, "more-info")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...O,
        name: "Название",
        alerts: "Оповещения",
        limit: "Сколько называть поимённо",
        watch_offline: "Считать потерю связи оповещением"
      },
      en: {
        ...P,
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
      alerts: I(e.alerts)
    };
  }
  fromForm(e) {
    return {
      ...e,
      alerts: R(
        this._config?.alerts,
        e.alerts ?? []
      )
    };
  }
}
k("horos-alerts-tile-editor", Ir);
const la = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosAlertsTileEditor: Ir
}, Symbol.toStringTag, { value: "Module" })), ve = {
  entity: {
    filter: [
      { domain: "script" },
      { domain: "scene" },
      { domain: "button" },
      { domain: "input_button" }
    ]
  }
};
class Rr extends C {
  get entityField() {
    return "state";
  }
  get schema() {
    const e = $(this.hass);
    return [
      { name: "state", selector: _("input_boolean") },
      { name: "power", selector: ve },
      { name: "bright", selector: ve },
      { name: "dim", selector: ve },
      { name: "warm", selector: ve },
      { name: "cold", selector: ve },
      {
        name: "presets",
        selector: { entity: { ...ve.entity, multiple: !0 } }
      },
      { name: "preset_state", selector: _("input_select") },
      { name: "sensors", selector: { entity: { multiple: !0 } } },
      { name: "preset_labels", selector: z },
      A("state", e, [
        { name: "levels", selector: z }
      ]),
      T("state", "toggle")
    ];
  }
  defaultFeatures() {
    const e = this._config;
    return pt(e);
  }
  get labels() {
    return this.pick({
      ru: {
        ...O,
        levels: "Кнопки и режимы",
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
        preset_labels: "Подписи у режимов"
      },
      en: {
        ...P,
        levels: "Buttons and presets",
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
        preset_labels: "Names next to the presets"
      }
    });
  }
  get formData() {
    const e = this._config ?? {};
    return {
      ...e,
      presets: I(e.presets),
      sensors: I(e.sensors)
    };
  }
  fromForm(e) {
    return {
      ...e,
      presets: R(
        this._config?.presets,
        e.presets ?? []
      ),
      sensors: R(
        this._config?.sensors,
        e.sensors ?? []
      )
    };
  }
}
k("horos-lamp-tile-editor", Rr);
const ca = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosLampTileEditor: Rr
}, Symbol.toStringTag, { value: "Module" }));
class jr extends C {
  get entityField() {
    return "mode";
  }
  get schema() {
    const e = $(this.hass);
    return [
      { name: "mode", selector: _("sensor") },
      {
        name: "burner",
        selector: _("binary_sensor", "heat")
      },
      {
        name: "pump",
        selector: _("binary_sensor", "heat")
      },
      {
        name: "switch",
        selector: { entity: { filter: [{ domain: "switch" }] } }
      },
      { name: "power", selector: _("sensor", "power") },
      { name: "energy", selector: _("sensor", "energy") },
      {
        name: "zones",
        selector: {
          entity: { multiple: !0, filter: [{ domain: "climate" }] }
        }
      },
      A("mode", e, [
        {
          name: "big_values",
          selector: te([
            { value: "power", label: e === "ru" ? "Мощность" : "Power" },
            { value: "energy", label: e === "ru" ? "Энергия" : "Energy" }
          ])
        },
        { name: "levels", selector: z }
      ]),
      T("mode", "more-info")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...O,
        levels: "Строки комнат",
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
        ...P,
        levels: "Room rows",
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
      zones: I(e.zones)
    };
  }
  fromForm(e) {
    return {
      ...e,
      zones: R(
        this._config?.zones,
        e.zones ?? []
      )
    };
  }
}
k("horos-heating-tile-editor", jr);
const ua = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosHeatingTileEditor: jr
}, Symbol.toStringTag, { value: "Module" }));
class Mr extends C {
  get entityField() {
  }
  get schema() {
    const e = $(this.hass);
    return [
      {
        name: "plants",
        required: !0,
        selector: {
          entity: {
            multiple: !0,
            filter: [{ domain: "sensor", device_class: "moisture" }]
          }
        }
      },
      {
        name: "",
        type: "grid",
        schema: [
          { name: "dry_below", selector: q(0, 100, "%") },
          { name: "wet_above", selector: q(0, 100, "%") }
        ]
      },
      {
        name: "temperature",
        selector: _("sensor", "temperature")
      },
      { name: "humidity", selector: _("sensor", "humidity") },
      {
        name: "illuminance",
        selector: _("sensor", "illuminance")
      },
      A(void 0, e, [
        {
          name: "big_values",
          selector: te([
            {
              value: "temperature",
              label: e === "ru" ? "Температура воздуха" : "Air temperature"
            },
            {
              value: "humidity",
              label: e === "ru" ? "Влажность воздуха" : "Air humidity"
            },
            {
              value: "illuminance",
              label: e === "ru" ? "Освещённость" : "Light"
            }
          ])
        },
        { name: "levels", selector: z }
      ]),
      T(void 0, "none")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...O,
        name: "Название",
        plants: "Растения",
        levels: "Строки растений",
        dry_below: "Ниже этого — сухо",
        wet_above: "Выше этого — залито",
        temperature: "Температура воздуха",
        humidity: "Влажность воздуха",
        illuminance: "Освещённость",
        big_values: "Крупно справа (не больше трёх)"
      },
      en: {
        ...P,
        name: "Name",
        plants: "Plants",
        levels: "Plant rows",
        dry_below: "Dry below",
        wet_above: "Wet above",
        temperature: "Air temperature",
        humidity: "Air humidity",
        illuminance: "Light",
        big_values: "Large on the right (up to three)"
      }
    });
  }
  get formData() {
    const e = this._config ?? {};
    return {
      ...e,
      plants: I(e.plants)
    };
  }
  fromForm(e) {
    return {
      ...e,
      // The thresholds a plant was given by hand in YAML survive a pick here.
      plants: R(
        this._config?.plants,
        e.plants ?? []
      )
    };
  }
}
k("horos-greenhouse-tile-editor", Mr);
const ha = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosGreenhouseTileEditor: Mr
}, Symbol.toStringTag, { value: "Module" })), da = {
  temperature: { ru: "Температура, от ночи до дня", en: "Temperature, night to day" },
  precipitation: { ru: "Осадки", en: "Precipitation" },
  precipitation_probability: { ru: "Вероятность осадков", en: "Chance of rain" },
  humidity: { ru: "Влажность", en: "Humidity" },
  wind_speed: { ru: "Ветер", en: "Wind" }
}, _s = {
  temperature: { ru: "Температура", en: "Temperature" },
  apparent_temperature: { ru: "Ощущается как", en: "Feels like" },
  dew_point: { ru: "Точка росы", en: "Dew point" },
  humidity: { ru: "Влажность", en: "Humidity" },
  pressure: { ru: "Давление", en: "Pressure" },
  wind_speed: { ru: "Ветер", en: "Wind" },
  cloud_coverage: { ru: "Облачность", en: "Cloud coverage" },
  uv_index: { ru: "УФ-индекс", en: "UV index" },
  visibility: { ru: "Видимость", en: "Visibility" }
};
class Nr extends C {
  get entityField() {
    return "weather";
  }
  get schema() {
    const e = $(this.hass) === "ru" ? "ru" : "en";
    return [
      {
        name: "weather",
        required: !0,
        selector: { entity: { filter: [{ domain: "weather" }] } }
      },
      {
        name: "",
        type: "grid",
        schema: [
          { name: "days", selector: q(1, 14) },
          {
            name: "bar",
            selector: {
              select: {
                mode: "dropdown",
                options: ft.map((t) => ({
                  value: t,
                  label: da[t][e]
                }))
              }
            }
          }
        ]
      },
      A("weather", $(this.hass), [
        {
          name: "big_values",
          selector: te(
            Object.keys(_s).map((t) => ({
              value: t,
              label: _s[t][e]
            }))
          )
        },
        { name: "levels", selector: z }
      ]),
      T("weather", "more-info")
    ];
  }
  get labels() {
    return this.pick({
      ru: {
        ...O,
        name: "Название",
        weather: "Погода",
        days: "Дней в прогнозе",
        bar: "Что показывают полоски",
        levels: "Строки прогноза",
        big_values: "Крупно справа (не больше трёх)"
      },
      en: {
        ...P,
        name: "Name",
        weather: "Weather",
        days: "Days in the forecast",
        bar: "What the bars measure",
        levels: "Forecast rows",
        big_values: "Large on the right (up to three)"
      }
    });
  }
}
k("horos-weather-tile-editor", Nr);
const ma = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosWeatherTileEditor: Nr
}, Symbol.toStringTag, { value: "Module" }));
class Fr extends C {
  /**
   * No main entity for the features panel: the control line is the card's own
   * and is not removable (see the card).
   */
  get entityField() {
  }
  get schema() {
    const e = $(this.hass), t = {
      entity: { filter: [{ domain: "input_number" }, { domain: "number" }] }
    };
    return [
      {
        name: "battery",
        required: !0,
        selector: {
          entity: {
            multiple: !0,
            filter: [{ domain: "sensor", device_class: "battery" }]
          }
        }
      },
      { name: "switch", selector: _("switch") },
      { name: "min", selector: t },
      { name: "max", selector: t },
      { name: "force", selector: _("timer") },
      { name: "pulse_every", selector: _("input_number") },
      { name: "stale_after", selector: q(0, 86400, "s") },
      A(void 0, e),
      T(void 0, "more-info")
    ];
  }
  /** The form always edits a list, whatever the YAML holds. */
  get formData() {
    const e = super.formData;
    return {
      ...e,
      battery: He(e)
    };
  }
  get labels() {
    return this.pick({
      ru: {
        ...O,
        name: "Название",
        battery: "Заряд (первый числовой)",
        switch: "Порт зарядки",
        min: "Нижний предел",
        max: "Верхний предел",
        force: "Таймер принудительной зарядки",
        pulse_every: "Период импульса без данных, ч",
        stale_after: "Нет данных через, секунд"
      },
      en: {
        ...P,
        name: "Name",
        battery: "Battery (first numeric)",
        switch: "Charger port",
        min: "Lower limit",
        max: "Upper limit",
        force: "Forced charge timer",
        pulse_every: "Blind pulse period, h",
        stale_after: "No data after, seconds"
      }
    });
  }
}
k("horos-charge-tile-editor", Fr);
const pa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HorosChargeTileEditor: Fr
}, Symbol.toStringTag, { value: "Module" }));
