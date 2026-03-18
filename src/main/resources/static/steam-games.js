const H = globalThis, W = H.ShadowRoot && (H.ShadyCSS === void 0 || H.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Q = /* @__PURE__ */ Symbol(), Z = /* @__PURE__ */ new WeakMap();
let ne = class {
  constructor(e, t, i) {
    if (this._$cssResult$ = !0, i !== Q) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (W && e === void 0) {
      const i = t !== void 0 && t.length === 1;
      i && (e = Z.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && Z.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const pe = (s) => new ne(typeof s == "string" ? s : s + "", void 0, Q), ue = (s, ...e) => {
  const t = s.length === 1 ? s[0] : e.reduce((i, r, o) => i + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + s[o + 1], s[0]);
  return new ne(t, s, Q);
}, me = (s, e) => {
  if (W) s.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const i = document.createElement("style"), r = H.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = t.cssText, s.appendChild(i);
  }
}, X = W ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const i of e.cssRules) t += i.cssText;
  return pe(t);
})(s) : s;
const { is: fe, defineProperty: ge, getOwnPropertyDescriptor: ve, getOwnPropertyNames: be, getOwnPropertySymbols: ye, getPrototypeOf: $e } = Object, I = globalThis, J = I.trustedTypes, we = J ? J.emptyScript : "", xe = I.reactiveElementPolyfillSupport, P = (s, e) => s, R = { toAttribute(s, e) {
  switch (e) {
    case Boolean:
      s = s ? we : null;
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
} }, q = (s, e) => !fe(s, e), Y = { attribute: !0, type: String, converter: R, reflect: !1, useDefault: !1, hasChanged: q };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), I.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let S = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = Y) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const i = /* @__PURE__ */ Symbol(), r = this.getPropertyDescriptor(e, i, t);
      r !== void 0 && ge(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, t, i) {
    const { get: r, set: o } = ve(this.prototype, e) ?? { get() {
      return this[t];
    }, set(a) {
      this[t] = a;
    } };
    return { get: r, set(a) {
      const l = r?.call(this);
      o?.call(this, a), this.requestUpdate(e, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Y;
  }
  static _$Ei() {
    if (this.hasOwnProperty(P("elementProperties"))) return;
    const e = $e(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(P("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(P("properties"))) {
      const t = this.properties, i = [...be(t), ...ye(t)];
      for (const r of i) this.createProperty(r, t[r]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [i, r] of t) this.elementProperties.set(i, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, i] of this.elementProperties) {
      const r = this._$Eu(t, i);
      r !== void 0 && this._$Eh.set(r, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const r of i) t.unshift(X(r));
    } else e !== void 0 && t.push(X(e));
    return t;
  }
  static _$Eu(e, t) {
    const i = t.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof e == "string" ? e.toLowerCase() : void 0;
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
    for (const i of t.keys()) this.hasOwnProperty(i) && (e.set(i, this[i]), delete this[i]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return me(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, t, i) {
    this._$AK(e, i);
  }
  _$ET(e, t) {
    const i = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, i);
    if (r !== void 0 && i.reflect === !0) {
      const o = (i.converter?.toAttribute !== void 0 ? i.converter : R).toAttribute(t, i.type);
      this._$Em = e, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const i = this.constructor, r = i._$Eh.get(e);
    if (r !== void 0 && this._$Em !== r) {
      const o = i.getPropertyOptions(r), a = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : R;
      this._$Em = r;
      const l = a.fromAttribute(t, o.type);
      this[r] = l ?? this._$Ej?.get(r) ?? l, this._$Em = null;
    }
  }
  requestUpdate(e, t, i, r = !1, o) {
    if (e !== void 0) {
      const a = this.constructor;
      if (r === !1 && (o = this[e]), i ??= a.getPropertyOptions(e), !((i.hasChanged ?? q)(o, t) || i.useDefault && i.reflect && o === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, i)))) return;
      this.C(e, t, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: i, reflect: r, wrapped: o }, a) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), o !== !0 || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (t = void 0), this._$AL.set(e, t)), r === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
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
        for (const [r, o] of this._$Ep) this[r] = o;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [r, o] of i) {
        const { wrapped: a } = o, l = this[r];
        a !== !0 || this._$AL.has(r) || l === void 0 || this.C(r, void 0, o, l);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(t)) : this._$EM();
    } catch (i) {
      throw e = !1, this._$EM(), i;
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
S.elementStyles = [], S.shadowRootOptions = { mode: "open" }, S[P("elementProperties")] = /* @__PURE__ */ new Map(), S[P("finalized")] = /* @__PURE__ */ new Map(), xe?.({ ReactiveElement: S }), (I.reactiveElementVersions ??= []).push("2.1.2");
const F = globalThis, ee = (s) => s, D = F.trustedTypes, te = D ? D.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, le = "$lit$", b = `lit$${Math.random().toFixed(9).slice(2)}$`, de = "?" + b, _e = `<${de}>`, _ = document, O = () => _.createComment(""), T = (s) => s === null || typeof s != "object" && typeof s != "function", V = Array.isArray, Ae = (s) => V(s) || typeof s?.[Symbol.iterator] == "function", G = `[ 	
\f\r]`, k = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, se = /-->/g, ie = />/g, w = RegExp(`>|${G}(?:([^\\s"'>=/]+)(${G}*=${G}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), re = /'/g, oe = /"/g, ce = /^(?:script|style|textarea|title)$/i, Se = (s) => (e, ...t) => ({ _$litType$: s, strings: e, values: t }), u = Se(1), C = /* @__PURE__ */ Symbol.for("lit-noChange"), h = /* @__PURE__ */ Symbol.for("lit-nothing"), ae = /* @__PURE__ */ new WeakMap(), x = _.createTreeWalker(_, 129);
function he(s, e) {
  if (!V(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return te !== void 0 ? te.createHTML(e) : e;
}
const Ce = (s, e) => {
  const t = s.length - 1, i = [];
  let r, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", a = k;
  for (let l = 0; l < t; l++) {
    const n = s[l];
    let c, m, d = -1, g = 0;
    for (; g < n.length && (a.lastIndex = g, m = a.exec(n), m !== null); ) g = a.lastIndex, a === k ? m[1] === "!--" ? a = se : m[1] !== void 0 ? a = ie : m[2] !== void 0 ? (ce.test(m[2]) && (r = RegExp("</" + m[2], "g")), a = w) : m[3] !== void 0 && (a = w) : a === w ? m[0] === ">" ? (a = r ?? k, d = -1) : m[1] === void 0 ? d = -2 : (d = a.lastIndex - m[2].length, c = m[1], a = m[3] === void 0 ? w : m[3] === '"' ? oe : re) : a === oe || a === re ? a = w : a === se || a === ie ? a = k : (a = w, r = void 0);
    const v = a === w && s[l + 1].startsWith("/>") ? " " : "";
    o += a === k ? n + _e : d >= 0 ? (i.push(c), n.slice(0, d) + le + n.slice(d) + b + v) : n + b + (d === -2 ? l : v);
  }
  return [he(s, o + (s[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class U {
  constructor({ strings: e, _$litType$: t }, i) {
    let r;
    this.parts = [];
    let o = 0, a = 0;
    const l = e.length - 1, n = this.parts, [c, m] = Ce(e, t);
    if (this.el = U.createElement(c, i), x.currentNode = this.el.content, t === 2 || t === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (r = x.nextNode()) !== null && n.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const d of r.getAttributeNames()) if (d.endsWith(le)) {
          const g = m[a++], v = r.getAttribute(d).split(b), N = /([.?@])?(.*)/.exec(g);
          n.push({ type: 1, index: o, name: N[2], strings: v, ctor: N[1] === "." ? ke : N[1] === "?" ? Pe : N[1] === "@" ? Me : B }), r.removeAttribute(d);
        } else d.startsWith(b) && (n.push({ type: 6, index: o }), r.removeAttribute(d));
        if (ce.test(r.tagName)) {
          const d = r.textContent.split(b), g = d.length - 1;
          if (g > 0) {
            r.textContent = D ? D.emptyScript : "";
            for (let v = 0; v < g; v++) r.append(d[v], O()), x.nextNode(), n.push({ type: 2, index: ++o });
            r.append(d[g], O());
          }
        }
      } else if (r.nodeType === 8) if (r.data === de) n.push({ type: 2, index: o });
      else {
        let d = -1;
        for (; (d = r.data.indexOf(b, d + 1)) !== -1; ) n.push({ type: 7, index: o }), d += b.length - 1;
      }
      o++;
    }
  }
  static createElement(e, t) {
    const i = _.createElement("template");
    return i.innerHTML = e, i;
  }
}
function E(s, e, t = s, i) {
  if (e === C) return e;
  let r = i !== void 0 ? t._$Co?.[i] : t._$Cl;
  const o = T(e) ? void 0 : e._$litDirective$;
  return r?.constructor !== o && (r?._$AO?.(!1), o === void 0 ? r = void 0 : (r = new o(s), r._$AT(s, t, i)), i !== void 0 ? (t._$Co ??= [])[i] = r : t._$Cl = r), r !== void 0 && (e = E(s, r._$AS(s, e.values), r, i)), e;
}
class Ee {
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
    const { el: { content: t }, parts: i } = this._$AD, r = (e?.creationScope ?? _).importNode(t, !0);
    x.currentNode = r;
    let o = x.nextNode(), a = 0, l = 0, n = i[0];
    for (; n !== void 0; ) {
      if (a === n.index) {
        let c;
        n.type === 2 ? c = new L(o, o.nextSibling, this, e) : n.type === 1 ? c = new n.ctor(o, n.name, n.strings, this, e) : n.type === 6 && (c = new Oe(o, this, e)), this._$AV.push(c), n = i[++l];
      }
      a !== n?.index && (o = x.nextNode(), a++);
    }
    return x.currentNode = _, r;
  }
  p(e) {
    let t = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, t), t += i.strings.length - 2) : i._$AI(e[t])), t++;
  }
}
class L {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, t, i, r) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = i, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
    e = E(this, e, t), T(e) ? e === h || e == null || e === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : e !== this._$AH && e !== C && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Ae(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== h && T(this._$AH) ? this._$AA.nextSibling.data = e : this.T(_.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: i } = e, r = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = U.createElement(he(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === r) this._$AH.p(t);
    else {
      const o = new Ee(r, this), a = o.u(this.options);
      o.p(t), this.T(a), this._$AH = o;
    }
  }
  _$AC(e) {
    let t = ae.get(e.strings);
    return t === void 0 && ae.set(e.strings, t = new U(e)), t;
  }
  k(e) {
    V(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let i, r = 0;
    for (const o of e) r === t.length ? t.push(i = new L(this.O(O()), this.O(O()), this, this.options)) : i = t[r], i._$AI(o), r++;
    r < t.length && (this._$AR(i && i._$AB.nextSibling, r), t.length = r);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const i = ee(e).nextSibling;
      ee(e).remove(), e = i;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class B {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, i, r, o) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = h;
  }
  _$AI(e, t = this, i, r) {
    const o = this.strings;
    let a = !1;
    if (o === void 0) e = E(this, e, t, 0), a = !T(e) || e !== this._$AH && e !== C, a && (this._$AH = e);
    else {
      const l = e;
      let n, c;
      for (e = o[0], n = 0; n < o.length - 1; n++) c = E(this, l[i + n], t, n), c === C && (c = this._$AH[n]), a ||= !T(c) || c !== this._$AH[n], c === h ? e = h : e !== h && (e += (c ?? "") + o[n + 1]), this._$AH[n] = c;
    }
    a && !r && this.j(e);
  }
  j(e) {
    e === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class ke extends B {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === h ? void 0 : e;
  }
}
class Pe extends B {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== h);
  }
}
class Me extends B {
  constructor(e, t, i, r, o) {
    super(e, t, i, r, o), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = E(this, e, t, 0) ?? h) === C) return;
    const i = this._$AH, r = e === h && i !== h || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, o = e !== h && (i === h || r);
    r && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Oe {
  constructor(e, t, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    E(this, e);
  }
}
const Te = F.litHtmlPolyfillSupport;
Te?.(U, L), (F.litHtmlVersions ??= []).push("3.3.2");
const Ue = (s, e, t) => {
  const i = t?.renderBefore ?? e;
  let r = i._$litPart$;
  if (r === void 0) {
    const o = t?.renderBefore ?? null;
    i._$litPart$ = r = new L(e.insertBefore(O(), o), o, void 0, t ?? {});
  }
  return r._$AI(s), r;
};
const K = globalThis;
class M extends S {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ue(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return C;
  }
}
M._$litElement$ = !0, M.finalized = !0, K.litElementHydrateSupport?.({ LitElement: M });
const Le = K.litElementPolyfillSupport;
Le?.({ LitElement: M });
(K.litElementVersions ??= []).push("4.2.2");
const Ne = (s) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(s, e);
  }) : customElements.define(s, e);
};
const ze = { attribute: !0, type: String, converter: R, reflect: !1, hasChanged: q }, He = (s = ze, e, t) => {
  const { kind: i, metadata: r } = t;
  let o = globalThis.litPropertyMetadata.get(r);
  if (o === void 0 && globalThis.litPropertyMetadata.set(r, o = /* @__PURE__ */ new Map()), i === "setter" && ((s = Object.create(s)).wrapped = !0), o.set(t.name, s), i === "accessor") {
    const { name: a } = t;
    return { set(l) {
      const n = e.get.call(this);
      e.set.call(this, l), this.requestUpdate(a, n, s, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(a, void 0, s, l), l;
    } };
  }
  if (i === "setter") {
    const { name: a } = t;
    return function(l) {
      const n = this[a];
      e.call(this, l), this.requestUpdate(a, n, s, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function y(s) {
  return (e, t) => typeof t == "object" ? He(s, e, t) : ((i, r, o) => {
    const a = r.hasOwnProperty(o);
    return r.constructor.createProperty(o, i), a ? Object.getOwnPropertyDescriptor(r, o) : void 0;
  })(s, e, t);
}
function $(s) {
  return y({ ...s, state: !0, attribute: !1 });
}
function Re() {
  return window.__STEAMVIEW_API_BASE__ || "/apis/api.steamview.halo.run/v1alpha1/games";
}
function z(s) {
  const e = Math.max(0, Math.floor(s || 0)), t = Math.floor(e / 60), i = e % 60;
  return t <= 0 ? `${i} 分钟` : i <= 0 ? `${t} 小时` : `${t} 小时 ${i} 分钟`;
}
function De(s, e) {
  if (e > 0) {
    const t = new Date(e * 1e3);
    if (!Number.isNaN(t.getTime()))
      return t.toLocaleDateString("zh-CN");
  }
  return s || "从未游玩";
}
function Ie(s) {
  if (!s)
    return "-";
  const e = new Date(s);
  return Number.isNaN(e.getTime()) ? s : e.toLocaleString("zh-CN", { hour12: !1 });
}
function Be(s, e) {
  const t = [...s];
  switch (e) {
    case "name":
      return t.sort((i, r) => i.name.localeCompare(r.name, "zh-CN"));
    case "totalTime":
      return t.sort((i, r) => r.totalTime - i.totalTime);
    case "lastPlayed":
      return t.sort((i, r) => r.lastPlayedAt - i.lastPlayedAt);
    default:
      return t.sort((i, r) => r.twoWeekTime - i.twoWeekTime);
  }
}
const j = {
  games: [],
  stats: {
    totalGames: 0,
    totalTime: 0,
    twoWeekTime: 0,
    activeGames: 0
  },
  player: {
    steamId: "",
    personaName: "",
    profileUrl: "",
    avatar: "",
    avatarMedium: "",
    avatarFull: "",
    level: 0,
    badgeCount: 0,
    playerXp: 0,
    xpToNextLevel: void 0,
    badges: []
  },
  lastUpdated: ""
};
async function Ge(s) {
  const e = (s || Re()).trim();
  if (!e)
    return j;
  const t = await fetch(e, { credentials: "omit" });
  if (!t.ok)
    throw new Error(`获取 Steam 游戏失败: HTTP ${t.status}`);
  const i = await t.json();
  return {
    games: Array.isArray(i.games) ? i.games : [],
    stats: i.stats || j.stats,
    player: i.player || j.player,
    lastUpdated: i.lastUpdated || ""
  };
}
const je = ue`
  :host {
    --font-body: 'Avenir Next', 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans SC', sans-serif;

    --bg-page: #f4f5f7;
    --bg-page-alt: #eceef1;
    --surface: #ffffff;
    --surface-strong: #ffffff;
    --surface-muted: #f3f4f6;

    --border: #d2d6dd;
    --text: #121417;
    --text-subtle: #5e646d;
    --accent: #16181b;
    --accent-strong: #000000;
    --success: #1c2026;
    --danger: #c3484b;

    --shadow-soft: 0 2px 10px rgba(0, 0, 0, 0.06);
    --shadow-card: 0 4px 16px rgba(0, 0, 0, 0.08);

    --radius-xl: 16px;
    --radius-lg: 12px;
    --radius-md: 10px;
    --radius-sm: 8px;

    color: var(--text);
    color-scheme: light;
    display: block;
    font-family: var(--font-body);
    -webkit-tap-highlight-color: rgba(22, 24, 27, 0.22);
  }

  :host([data-color-scheme='dark']) {
    --bg-page: #07080a;
    --bg-page-alt: #0d0f12;
    --surface: #121417;
    --surface-strong: #101215;
    --surface-muted: #181b20;

    --border: #2b3037;
    --text: #f1f3f6;
    --text-subtle: #a1a7b0;
    --accent: #dde2e9;
    --accent-strong: #ffffff;
    --success: #d6dce4;
    --danger: #ff9ca0;

    --shadow-soft: 0 3px 12px rgba(0, 0, 0, 0.28);
    --shadow-card: 0 6px 20px rgba(0, 0, 0, 0.34);
    color-scheme: dark;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  .shell {
    min-height: 100vh;
    background: var(--bg-page);
    padding: max(18px, env(safe-area-inset-top)) 14px max(30px, env(safe-area-inset-bottom));
  }

  :host([embedded]) .shell {
    min-height: auto;
    padding: 8px;
  }

  .container {
    margin: 0 auto;
    max-width: 1360px;
    position: relative;
  }

  :host([embedded]) .container {
    max-width: none;
  }

  .overview {
    margin-top: 2px;
  }

  .profile-panel {
    background: var(--surface-strong);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-soft);
    min-width: 0;
    padding: 12px 14px;
  }

  .profile-head {
    align-items: center;
    display: flex;
    gap: 12px;
    min-width: 0;
  }

  .profile-avatar {
    border: 1px solid var(--border);
    border-radius: 50%;
    flex-shrink: 0;
    height: 62px;
    object-fit: cover;
    width: 62px;
  }

  .profile-avatar-fallback {
    align-items: center;
    background: color-mix(in srgb, var(--accent) 18%, var(--surface-strong));
    display: inline-flex;
    font-size: 1.2rem;
    font-weight: 760;
    justify-content: center;
    text-transform: uppercase;
  }

  .profile-main {
    min-width: 0;
  }

  .profile-name {
    font-size: 1.26rem;
    font-weight: 720;
    margin: 0;
    overflow-wrap: anywhere;
  }

  .profile-link {
    color: var(--accent-strong);
    display: inline-block;
    font-size: 0.92rem;
    margin-top: 4px;
    text-decoration: none;
  }

  .profile-link:hover {
    text-decoration: underline;
  }

  .profile-metrics {
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    margin: 12px 0 0;
  }

  .metric-chip {
    background: var(--surface-muted);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    min-width: 0;
    padding: 7px 9px;
  }

  .metric-chip dt {
    align-items: center;
    color: var(--text-subtle);
    display: flex;
    font-size: 0.74rem;
    gap: 6px;
    margin: 0;
  }

  .metric-icon {
    align-items: center;
    background: color-mix(in srgb, var(--text) 9%, transparent);
    border-radius: 6px;
    color: var(--text);
    display: inline-flex;
    font-size: 0.68rem;
    height: 16px;
    justify-content: center;
    width: 16px;
  }

  .metric-chip dd {
    font-size: 1rem;
    font-weight: 680;
    line-height: 1.25;
    margin: 4px 0 0;
    overflow-wrap: anywhere;
  }

  .metric-chip:nth-child(5),
  .metric-chip:nth-child(6),
  .metric-chip:nth-child(7) {
    grid-column: span 1;
  }

  .metric-chip:nth-child(7) {
    grid-column: 3 / span 1;
  }

  .metric-chip:nth-child(4) dd,
  .metric-chip:nth-child(7) dd {
    font-variant-numeric: tabular-nums;
  }

  .metric-chip:nth-child(5) dd,
  .metric-chip:nth-child(6) dd {
    font-size: 0.94rem;
  }

  .toolbar {
    align-items: center;
    display: grid;
    gap: 8px;
    grid-template-columns: 1fr auto;
    margin-top: 10px;
  }

  .field {
    min-width: 0;
  }

  .toolbar-actions {
    align-items: center;
    display: flex;
    gap: 8px;
  }

  .field-sort select {
    min-width: 190px;
  }

  .list-meta {
    color: var(--text-subtle);
    display: flex;
    flex-wrap: wrap;
    font-size: 0.82rem;
    gap: 6px 10px;
    justify-content: space-between;
    margin-top: 2px;
  }

  input,
  select,
  button {
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    color: var(--text);
    font-size: 0.92rem;
    min-height: 42px;
  }

  input,
  select {
    background: var(--surface-strong);
    padding: 0 12px;
    width: 100%;
  }

  button {
    background: var(--surface-strong);
    cursor: pointer;
    font-weight: 650;
    padding: 0 14px;
    transition: border-color 150ms ease, background-color 150ms ease, transform 150ms ease;
  }

  .refresh-btn {
    background: var(--text);
    border-color: var(--text);
    color: #fff;
  }

  :host([data-color-scheme='dark']) .refresh-btn {
    background: #f1f3f6;
    border-color: #f1f3f6;
    color: #0f1216;
  }

  button:hover {
    background: var(--surface-muted);
    border-color: color-mix(in srgb, var(--text) 22%, var(--border));
  }

  .refresh-btn:hover {
    background: color-mix(in srgb, var(--text) 84%, #fff);
    border-color: color-mix(in srgb, var(--text) 84%, #fff);
    color: #fff;
  }

  :host([data-color-scheme='dark']) .refresh-btn:hover {
    background: #ffffff;
    border-color: #ffffff;
    color: #07080a;
  }

  input:focus-visible,
  select:focus-visible,
  button:focus-visible,
  a:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--accent-strong) 86%, transparent);
    outline-offset: 2px;
  }

  .game-waterfall {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-top: 12px;
  }

  .game-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-card);
    overflow: hidden;
    transition: border-color 150ms ease, box-shadow 150ms ease;
    width: 100%;
  }

  .game-card:hover {
    border-color: color-mix(in srgb, var(--text) 22%, var(--border));
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  }

  .cover-link {
    display: block;
  }

  .game-cover {
    aspect-ratio: 460 / 215;
    background: var(--surface-muted);
    display: block;
    height: auto;
    object-fit: cover;
    width: 100%;
  }

  .game-body {
    min-width: 0;
    padding: 12px;
  }

  .game-head {
    align-items: start;
    display: flex;
    gap: 10px;
    justify-content: space-between;
  }

  .game-name {
    display: -webkit-box;
    font-size: 0.98rem;
    line-height: 1.35;
    margin: 0;
    min-width: 0;
    overflow-wrap: anywhere;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    min-height: 2.7em;
  }

  .game-meta {
    color: var(--text-subtle);
    display: flex;
    flex-wrap: wrap;
    font-size: 0.75rem;
    gap: 4px 10px;
    justify-content: space-between;
    margin: 8px 0 0;
  }

  .metric-block {
    margin-top: 10px;
  }

  .metric-row {
    display: flex;
    font-size: 0.8rem;
    justify-content: space-between;
  }

  .metric-row span:first-child {
    color: var(--text-subtle);
  }

  .progress {
    background: color-mix(in srgb, var(--text) 10%, transparent);
    border-radius: 999px;
    height: 6px;
    margin-top: 7px;
    overflow: hidden;
  }

  .progress > i {
    background: var(--accent);
    display: block;
    height: 100%;
  }

  .progress-two-week > i {
    background: var(--accent-strong);
  }

  .active-tag {
    background: color-mix(in srgb, var(--text) 7%, transparent);
    border: 1px solid color-mix(in srgb, var(--text) 16%, transparent);
    border-radius: 999px;
    display: inline-block;
    font-size: 0.7rem;
    padding: 2px 8px;
    white-space: nowrap;
  }

  .load-zone {
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 8px;
  }

  .load-sentinel {
    height: 1px;
    width: 100%;
  }

  .loading-hint {
    color: var(--text-subtle);
    font-size: 0.78rem;
    margin: 0;
    text-align: center;
  }

  .loading-hint.done {
    margin-top: 10px;
  }

  .state {
    background: var(--surface-strong);
    border: 1px dashed color-mix(in srgb, var(--border) 88%, var(--text) 12%);
    border-radius: var(--radius-md);
    margin-top: 14px;
    padding: 22px 16px;
    text-align: center;
  }

  .state h3 {
    margin: 0;
  }

  .state p {
    color: var(--text-subtle);
    margin: 8px auto 0;
    max-width: 60ch;
    overflow-wrap: anywhere;
  }

  .state.error {
    border-color: color-mix(in srgb, var(--danger) 56%, var(--border));
    color: var(--danger);
  }

  .spinner {
    animation: spin 900ms linear infinite;
    border: 3px solid color-mix(in srgb, var(--text) 14%, transparent);
    border-top-color: var(--text);
    border-radius: 50%;
    height: 30px;
    margin: 0 auto 10px;
    width: 30px;
  }

  .sr-only {
    border: 0;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 1320px) {
    .game-waterfall {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (max-width: 1100px) {
    .profile-metrics {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (max-width: 900px) {
    .game-waterfall {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 760px) {
    .toolbar {
      grid-template-columns: 1fr;
    }

    .toolbar-actions {
      width: 100%;
    }

    .toolbar-actions > .field,
    .toolbar-actions > .refresh-btn {
      flex: 1 1 auto;
    }

    .field-sort select {
      min-width: 0;
      width: 100%;
    }

    .profile-metrics {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 520px) {
    .shell {
      padding-left: 10px;
      padding-right: 10px;
    }

    .profile-metrics {
      grid-template-columns: 1fr;
    }

    .game-waterfall {
      grid-template-columns: 1fr;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0ms !important;
      scroll-behavior: auto !important;
      transition-duration: 0ms !important;
    }
  }
`;
var We = Object.defineProperty, Qe = Object.getOwnPropertyDescriptor, f = (s, e, t, i) => {
  for (var r = i > 1 ? void 0 : i ? Qe(e, t) : e, o = s.length - 1, a; o >= 0; o--)
    (a = s[o]) && (r = (i ? a(e, t, r) : a(r)) || r);
  return i && r && We(e, t, r), r;
};
const A = 12;
let p = class extends M {
  constructor() {
    super(...arguments), this.apiBase = "", this.title = "Steam 游戏展柜", this.subtitle = "最近游玩、总时长与活跃状态", this.mode = "all", this.appId = "", this.showProfile = !0, this.embedded = !1, this.games = [], this.loading = !1, this.error = "", this.sortBy = "totalTime", this.keyword = "", this.visibleCount = A, this.lastUpdated = "", this.player = null, this.colorSchemeMode = "auto", this.mediaQuery = null, this.colorSchemeObserver = null, this.autoLoadObserver = null, this.handleMediaChange = () => {
      this.colorSchemeMode === "auto" && this.syncColorSchemeFromDocument();
    }, this.handleDomReady = () => {
      !this.colorSchemeObserver || !document.body || (this.colorSchemeObserver.observe(document.body, {
        attributes: !0,
        attributeFilter: ["class", "data-color-scheme"]
      }), this.syncColorSchemeFromDocument());
    }, this.handleAutoLoadIntersection = (s) => {
      s.some((e) => e.isIntersecting) && this.loadMore();
    };
  }
  connectedCallback() {
    super.connectedCallback(), this.setupColorSchemeSync(), this.setupAutoLoadObserver(), this.hydrateQueryState(), this.visibleCount = A, this.loadGames();
  }
  disconnectedCallback() {
    this.teardownColorSchemeSync(), this.teardownAutoLoadObserver(), super.disconnectedCallback();
  }
  updated(s) {
    this.bindAutoLoadSentinel();
  }
  setupAutoLoadObserver() {
    typeof window > "u" || typeof IntersectionObserver > "u" || (this.autoLoadObserver = new IntersectionObserver(this.handleAutoLoadIntersection, {
      root: null,
      rootMargin: "280px 0px",
      threshold: 0.01
    }));
  }
  teardownAutoLoadObserver() {
    this.autoLoadObserver && (this.autoLoadObserver.disconnect(), this.autoLoadObserver = null);
  }
  bindAutoLoadSentinel() {
    if (!this.autoLoadObserver || (this.autoLoadObserver.disconnect(), this.mode === "single" || this.loading || this.error || this.visibleGames.length >= this.filteredGames.length))
      return;
    const s = this.renderRoot.querySelector(".load-sentinel");
    s && this.autoLoadObserver.observe(s);
  }
  setupColorSchemeSync() {
    typeof window > "u" || typeof document > "u" || (this.mediaQuery = window.matchMedia("(prefers-color-scheme: dark)"), typeof this.mediaQuery.addEventListener == "function" ? this.mediaQuery.addEventListener("change", this.handleMediaChange) : this.mediaQuery.addListener(this.handleMediaChange), this.colorSchemeObserver = new MutationObserver(() => this.syncColorSchemeFromDocument()), this.colorSchemeObserver.observe(document.documentElement, {
      attributes: !0,
      attributeFilter: ["class", "data-color-scheme"]
    }), document.body ? this.colorSchemeObserver.observe(document.body, {
      attributes: !0,
      attributeFilter: ["class", "data-color-scheme"]
    }) : window.addEventListener("DOMContentLoaded", this.handleDomReady, { once: !0 }), this.syncColorSchemeFromDocument());
  }
  teardownColorSchemeSync() {
    typeof window < "u" && window.removeEventListener("DOMContentLoaded", this.handleDomReady), this.mediaQuery && (typeof this.mediaQuery.removeEventListener == "function" ? this.mediaQuery.removeEventListener("change", this.handleMediaChange) : this.mediaQuery.removeListener(this.handleMediaChange)), this.colorSchemeObserver && this.colorSchemeObserver.disconnect(), this.mediaQuery = null, this.colorSchemeObserver = null;
  }
  syncColorSchemeFromDocument() {
    const s = this.readColorSchemeMode(document.body) ?? this.readColorSchemeMode(document.documentElement) ?? "auto", e = s === "auto" ? this.mediaQuery?.matches ? "dark" : "light" : s;
    this.colorSchemeMode = s, this.setAttribute("data-color-scheme", e);
  }
  readColorSchemeMode(s) {
    if (!s)
      return null;
    const e = (s.getAttribute("data-color-scheme") || "").trim().toLowerCase(), t = this.readClassColorSchemeMode(s);
    return e === "dark" || t === "dark" ? "dark" : e === "light" || t === "light" ? "light" : e === "auto" || t === "auto" ? "auto" : null;
  }
  readClassColorSchemeMode(s) {
    return s.classList.contains("color-scheme-dark") || s.classList.contains("dark") ? "dark" : s.classList.contains("color-scheme-light") || s.classList.contains("light") ? "light" : s.classList.contains("color-scheme-auto") ? "auto" : null;
  }
  hydrateQueryState() {
    if (this.mode === "single")
      return;
    const s = new URLSearchParams(window.location.search), e = s.get("q"), t = s.get("sort");
    e && (this.keyword = e), t && this.isSortKey(t) && (this.sortBy = t);
  }
  isSortKey(s) {
    return s === "twoWeekTime" || s === "totalTime" || s === "name" || s === "lastPlayed";
  }
  syncQueryState() {
    if (this.mode === "single" || this.embedded)
      return;
    const s = new URL(window.location.href);
    this.keyword ? s.searchParams.set("q", this.keyword) : s.searchParams.delete("q"), this.sortBy !== "totalTime" ? s.searchParams.set("sort", this.sortBy) : s.searchParams.delete("sort"), window.history.replaceState(null, "", s.toString());
  }
  async loadGames() {
    this.loading = !0, this.error = "";
    try {
      const s = await Ge(this.apiBase);
      this.games = s.games.filter((e) => !e.hidden), this.player = s.player || null, this.lastUpdated = s.lastUpdated, this.visibleCount = A;
    } catch (s) {
      this.error = s instanceof Error ? s.message : "加载失败，请稍后重试", this.games = [], this.player = null;
    } finally {
      this.loading = !1;
    }
  }
  onSearchInput(s) {
    this.keyword = s.target.value, this.visibleCount = A, this.syncQueryState();
  }
  onSortChange(s) {
    const e = s.target.value;
    this.isSortKey(e) && (this.sortBy = e, this.visibleCount = A, this.syncQueryState());
  }
  loadMore() {
    if (this.loading)
      return;
    const s = A;
    this.visibleCount = Math.min(this.visibleCount + s, this.filteredGames.length);
  }
  get filteredGames() {
    const s = this.mode === "single" ? this.games.filter((i) => i.appId === this.appId) : this.games;
    if (this.mode === "single")
      return s;
    const e = Be(s, this.sortBy), t = this.keyword.trim().toLowerCase();
    return t ? e.filter((i) => i.name.toLowerCase().includes(t) || i.appId.includes(t)) : e;
  }
  get visibleGames() {
    return this.filteredGames.slice(0, this.visibleCount);
  }
  get summary() {
    const s = this.filteredGames, e = s.reduce((r, o) => r + o.totalTime, 0), t = s.reduce((r, o) => r + o.twoWeekTime, 0), i = s.filter((r) => r.active || r.twoWeekTime > 0).length;
    return {
      gameCount: s.length,
      totalTime: e,
      twoWeekTime: t,
      activeGames: i
    };
  }
  renderProfile(s) {
    const e = this.player, t = e?.profileUrl || "", i = e?.avatarFull || e?.avatarMedium || e?.avatar || "", r = e?.personaName || "Steam 玩家", o = e?.level || 0, a = e?.badgeCount || 0;
    return u`
      <aside class="profile-panel" aria-label="玩家资料面板">
        <div class="profile-head">
          ${i ? u`<img class="profile-avatar" src=${i} alt=${r} width="72" height="72" />` : u`<div class="profile-avatar profile-avatar-fallback" aria-hidden="true">${r[0] || "S"}</div>`}
          <div class="profile-main">
            <p class="profile-name">${r}</p>
            ${t ? u`
                  <a class="profile-link" href=${t} target="_blank" rel="noopener noreferrer">
                    打开 Steam 主页
                  </a>
                ` : null}
          </div>
        </div>

        <dl class="profile-metrics profile-metrics-main">
          <div class="metric-chip">
            <dt><span class="metric-icon" aria-hidden="true">⬢</span>等级</dt>
            <dd>Lv.${o}</dd>
          </div>
          <div class="metric-chip">
            <dt><span class="metric-icon" aria-hidden="true">◇</span>徽章</dt>
            <dd>${a}</dd>
          </div>
          <div class="metric-chip">
            <dt><span class="metric-icon" aria-hidden="true">✦</span>总 XP</dt>
            <dd>${e?.playerXp || 0}</dd>
          </div>
          <div class="metric-chip">
            <dt><span class="metric-icon" aria-hidden="true">⌗</span>游戏</dt>
            <dd>${s.gameCount}</dd>
          </div>
          <div class="metric-chip">
            <dt><span class="metric-icon" aria-hidden="true">◷</span>总时长</dt>
            <dd>${z(s.totalTime)}</dd>
          </div>
          <div class="metric-chip">
            <dt><span class="metric-icon" aria-hidden="true">◶</span>两周</dt>
            <dd>${z(s.twoWeekTime)}</dd>
          </div>
          <div class="metric-chip">
            <dt><span class="metric-icon" aria-hidden="true">●</span>活跃</dt>
            <dd>${s.activeGames}</dd>
          </div>
        </dl>
      </aside>
    `;
  }
  renderState() {
    return this.loading ? u`
        <div class="state" role="status" aria-live="polite">
          <div class="spinner" aria-hidden="true"></div>
          <h3>正在加载数据</h3>
          <p>正在拉取游戏列表和玩家资料，请稍候…</p>
        </div>
      ` : this.error ? u`
        <div class="state error" role="alert">
          <h3>加载失败</h3>
          <p>${this.error}</p>
          <button type="button" @click=${this.loadGames}>重试</button>
        </div>
      ` : null;
  }
  render() {
    const s = this.renderState(), e = this.summary, t = this.mode === "single", i = !t && this.visibleGames.length < this.filteredGames.length, r = t || this.showProfile;
    return u`
      <main class="shell">
        <div class="container">
          <h1 class="sr-only">${this.title}</h1>
          <p class="sr-only">${this.subtitle}</p>

          ${r ? u`<section class="overview" aria-label="关键指标与玩家资料">${this.renderProfile(e)}</section>` : null}

          ${s || u`
                ${t ? u`
                      <section class="toolbar" aria-label="操作栏">
                        <div class="toolbar-actions">
                          <button type="button" class="refresh-btn" @click=${this.loadGames}>刷新</button>
                        </div>
                      </section>
                    ` : u`
                      <section class="toolbar" aria-label="筛选与排序">
                        <label class="field field-search">
                          <span class="sr-only">搜索游戏</span>
                          <input
                            type="search"
                            name="game-search"
                            aria-controls="steam-games-list"
                            .value=${this.keyword}
                            autocomplete="off"
                            spellcheck="false"
                            placeholder="搜索游戏名称或 App ID"
                            @input=${this.onSearchInput}
                          />
                        </label>

                        <div class="toolbar-actions">
                          <label class="field field-sort">
                            <span class="sr-only">排序方式</span>
                            <select name="game-sort" @change=${this.onSortChange}>
                              <option value="totalTime" ?selected=${this.sortBy === "totalTime"}>总时长优先</option>
                              <option value="twoWeekTime" ?selected=${this.sortBy === "twoWeekTime"}>两周时长优先</option>
                              <option value="lastPlayed" ?selected=${this.sortBy === "lastPlayed"}>最近游玩优先</option>
                              <option value="name" ?selected=${this.sortBy === "name"}>名称 A-Z</option>
                            </select>
                          </label>
                          <button type="button" class="refresh-btn" @click=${this.loadGames}>刷新</button>
                        </div>
                      </section>
                    `}

                <div class="list-meta">
                  <span>展示 ${this.visibleGames.length} / ${this.filteredGames.length} 个游戏</span>
                  <span>${t ? `单游戏模式 ${this.appId || ""}` : `最近更新 ${Ie(this.lastUpdated)}`}</span>
                </div>

                ${this.filteredGames.length === 0 ? u`
                      <div class="state">
                        <h3>${t ? "未找到指定游戏" : "暂无可展示游戏"}</h3>
                        <p>${t ? "请确认 App ID 是否正确，或稍后刷新数据。" : "请检查 Steam 配置，或稍后刷新数据。"}</p>
                      </div>
                    ` : u`
                      <section id="steam-games-list" class="game-waterfall" aria-label="Steam 游戏瀑布流列表">
                        ${this.visibleGames.map(
      (o, a) => u`
                            <article class="game-card">
                              <a
                                class="cover-link"
                                href=${`https://store.steampowered.com/app/${o.appId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label=${`在 Steam 商店打开 ${o.name}`}
                              >
                                <img
                                  class="game-cover"
                                  src=${o.coverUrl}
                                  alt=${o.name}
                                  width="460"
                                  height="215"
                                  loading=${a < 6 ? "eager" : "lazy"}
                                  fetchpriority=${a < 3 ? "high" : "auto"}
                                />
                              </a>

                              <div class="game-body">
                                <div class="game-head">
                                  <h2 class="game-name">${o.name}</h2>
                                  ${o.active || o.twoWeekTime > 0 ? u`<span class="active-tag">活跃</span>` : null}
                                </div>

                                <p class="game-meta">
                                  <span>App ${o.appId}</span>
                                  <span>${De(o.lastPlayed, o.lastPlayedAt)}</span>
                                </p>

                                <div class="metric-block">
                                  <div class="metric-row">
                                    <span>总时长</span>
                                    <span>${z(o.totalTime)}</span>
                                  </div>
                                  <div class="progress" aria-hidden="true">
                                    <i style="width:${Math.max(0, Math.min(100, o.totalPercent))}%"></i>
                                  </div>
                                </div>

                                <div class="metric-block">
                                  <div class="metric-row">
                                    <span>最近两周</span>
                                    <span>${z(o.twoWeekTime)}</span>
                                  </div>
                                  <div class="progress progress-two-week" aria-hidden="true">
                                    <i style="width:${Math.max(0, Math.min(100, o.twoWeekPercent))}%"></i>
                                  </div>
                                </div>
                              </div>
                            </article>
                          `
    )}
                      </section>

                      ${i ? u`
                            <div class="load-zone" aria-hidden="true">
                              <div class="load-sentinel"></div>
                              <p class="loading-hint">下拉自动加载更多</p>
                            </div>
                          ` : u`<p class="loading-hint done">已全部加载</p>`}
                    `}
              `}

          <div class="sr-only" aria-live="polite">
            ${this.loading ? "正在加载数据" : this.error ? `加载失败：${this.error}` : `已加载 ${this.filteredGames.length} 个游戏`}
          </div>
        </div>
      </main>
    `;
  }
};
p.styles = je;
f([
  y({ type: String, attribute: "api-base" })
], p.prototype, "apiBase", 2);
f([
  y({ type: String })
], p.prototype, "title", 2);
f([
  y({ type: String })
], p.prototype, "subtitle", 2);
f([
  y({ type: String })
], p.prototype, "mode", 2);
f([
  y({ type: String, attribute: "app-id" })
], p.prototype, "appId", 2);
f([
  y({ type: Boolean, attribute: "show-profile" })
], p.prototype, "showProfile", 2);
f([
  y({ type: Boolean, reflect: !0 })
], p.prototype, "embedded", 2);
f([
  $()
], p.prototype, "games", 2);
f([
  $()
], p.prototype, "loading", 2);
f([
  $()
], p.prototype, "error", 2);
f([
  $()
], p.prototype, "sortBy", 2);
f([
  $()
], p.prototype, "keyword", 2);
f([
  $()
], p.prototype, "visibleCount", 2);
f([
  $()
], p.prototype, "lastUpdated", 2);
f([
  $()
], p.prototype, "player", 2);
p = f([
  Ne("steam-games-view")
], p);
export {
  p as SteamGamesView
};
