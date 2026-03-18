(function(d,v){typeof exports=="object"&&typeof module<"u"?v(exports):typeof define=="function"&&define.amd?define(["exports"],v):(d=typeof globalThis<"u"?globalThis:d||self,v(d.SteamGamesView={}))})(this,(function(d){"use strict";const v=globalThis,B=v.ShadowRoot&&(v.ShadyCSS===void 0||v.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,j=Symbol(),Z=new WeakMap;let X=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==j)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(B&&e===void 0){const s=t!==void 0&&t.length===1;s&&(e=Z.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&Z.set(t,e))}return e}toString(){return this.cssText}};const pe=r=>new X(typeof r=="string"?r:r+"",void 0,j),ue=(r,...e)=>{const t=r.length===1?r[0]:e.reduce((s,i,a)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[a+1],r[0]);return new X(t,r,j)},me=(r,e)=>{if(B)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const s=document.createElement("style"),i=v.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,r.appendChild(s)}},J=B?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return pe(t)})(r):r;const{is:fe,defineProperty:ge,getOwnPropertyDescriptor:ve,getOwnPropertyNames:be,getOwnPropertySymbols:ye,getPrototypeOf:$e}=Object,N=globalThis,Y=N.trustedTypes,we=Y?Y.emptyScript:"",xe=N.reactiveElementPolyfillSupport,P=(r,e)=>r,z={toAttribute(r,e){switch(e){case Boolean:r=r?we:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch{t=null}}return t}},V=(r,e)=>!fe(r,e),ee={attribute:!0,type:String,converter:z,reflect:!1,useDefault:!1,hasChanged:V};Symbol.metadata??=Symbol("metadata"),N.litPropertyMetadata??=new WeakMap;let A=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=ee){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&ge(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){const{get:i,set:a}=ve(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:i,set(o){const l=i?.call(this);a?.call(this,o),this.requestUpdate(e,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ee}static _$Ei(){if(this.hasOwnProperty(P("elementProperties")))return;const e=$e(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(P("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(P("properties"))){const t=this.properties,s=[...be(t),...ye(t)];for(const i of s)this.createProperty(i,t[i])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const i of s)t.unshift(J(i))}else e!==void 0&&t.push(J(e));return t}static _$Eu(e,t){const s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return me(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){const s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){const a=(s.converter?.toAttribute!==void 0?s.converter:z).toAttribute(t,s.type);this._$Em=e,a==null?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(e,t){const s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){const a=s.getPropertyOptions(i),o=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:z;this._$Em=i;const l=o.fromAttribute(t,a.type);this[i]=l??this._$Ej?.get(i)??l,this._$Em=null}}requestUpdate(e,t,s,i=!1,a){if(e!==void 0){const o=this.constructor;if(i===!1&&(a=this[e]),s??=o.getPropertyOptions(e),!((s.hasChanged??V)(a,t)||s.useDefault&&s.reflect&&a===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:a},o){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),a!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[i,a]of this._$Ep)this[i]=a;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[i,a]of s){const{wrapped:o}=a,l=this[i];o!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,a,l)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[P("elementProperties")]=new Map,A[P("finalized")]=new Map,xe?.({ReactiveElement:A}),(N.reactiveElementVersions??=[]).push("2.1.2");const W=globalThis,te=r=>r,H=W.trustedTypes,se=H?H.createPolicy("lit-html",{createHTML:r=>r}):void 0,ie="$lit$",b=`lit$${Math.random().toFixed(9).slice(2)}$`,re="?"+b,_e=`<${re}>`,x=document,M=()=>x.createComment(""),O=r=>r===null||typeof r!="object"&&typeof r!="function",Q=Array.isArray,Se=r=>Q(r)||typeof r?.[Symbol.iterator]=="function",q=`[ 	
\f\r]`,T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ae=/-->/g,oe=/>/g,_=RegExp(`>|${q}(?:([^\\s"'>=/]+)(${q}*=${q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ne=/'/g,le=/"/g,de=/^(?:script|style|textarea|title)$/i,Ae=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),u=Ae(1),C=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),ce=new WeakMap,S=x.createTreeWalker(x,129);function he(r,e){if(!Q(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return se!==void 0?se.createHTML(e):e}const Ce=(r,e)=>{const t=r.length-1,s=[];let i,a=e===2?"<svg>":e===3?"<math>":"",o=T;for(let l=0;l<t;l++){const n=r[l];let p,f,c=-1,g=0;for(;g<n.length&&(o.lastIndex=g,f=o.exec(n),f!==null);)g=o.lastIndex,o===T?f[1]==="!--"?o=ae:f[1]!==void 0?o=oe:f[2]!==void 0?(de.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=_):f[3]!==void 0&&(o=_):o===_?f[0]===">"?(o=i??T,c=-1):f[1]===void 0?c=-2:(c=o.lastIndex-f[2].length,p=f[1],o=f[3]===void 0?_:f[3]==='"'?le:ne):o===le||o===ne?o=_:o===ae||o===oe?o=T:(o=_,i=void 0);const w=o===_&&r[l+1].startsWith("/>")?" ":"";a+=o===T?n+_e:c>=0?(s.push(p),n.slice(0,c)+ie+n.slice(c)+b+w):n+b+(c===-2?l:w)}return[he(r,a+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]};class U{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let a=0,o=0;const l=e.length-1,n=this.parts,[p,f]=Ce(e,t);if(this.el=U.createElement(p,s),S.currentNode=this.el.content,t===2||t===3){const c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(i=S.nextNode())!==null&&n.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const c of i.getAttributeNames())if(c.endsWith(ie)){const g=f[o++],w=i.getAttribute(c).split(b),I=/([.?@])?(.*)/.exec(g);n.push({type:1,index:a,name:I[2],strings:w,ctor:I[1]==="."?ke:I[1]==="?"?Pe:I[1]==="@"?Me:R}),i.removeAttribute(c)}else c.startsWith(b)&&(n.push({type:6,index:a}),i.removeAttribute(c));if(de.test(i.tagName)){const c=i.textContent.split(b),g=c.length-1;if(g>0){i.textContent=H?H.emptyScript:"";for(let w=0;w<g;w++)i.append(c[w],M()),S.nextNode(),n.push({type:2,index:++a});i.append(c[g],M())}}}else if(i.nodeType===8)if(i.data===re)n.push({type:2,index:a});else{let c=-1;for(;(c=i.data.indexOf(b,c+1))!==-1;)n.push({type:7,index:a}),c+=b.length-1}a++}}static createElement(e,t){const s=x.createElement("template");return s.innerHTML=e,s}}function E(r,e,t=r,s){if(e===C)return e;let i=s!==void 0?t._$Co?.[s]:t._$Cl;const a=O(e)?void 0:e._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(r),i._$AT(r,t,s)),s!==void 0?(t._$Co??=[])[s]=i:t._$Cl=i),i!==void 0&&(e=E(r,i._$AS(r,e.values),i,s)),e}class Ee{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??x).importNode(t,!0);S.currentNode=i;let a=S.nextNode(),o=0,l=0,n=s[0];for(;n!==void 0;){if(o===n.index){let p;n.type===2?p=new L(a,a.nextSibling,this,e):n.type===1?p=new n.ctor(a,n.name,n.strings,this,e):n.type===6&&(p=new Oe(a,this,e)),this._$AV.push(p),n=s[++l]}o!==n?.index&&(a=S.nextNode(),o++)}return S.currentNode=x,i}p(e){let t=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class L{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=E(this,e,t),O(e)?e===h||e==null||e===""?(this._$AH!==h&&this._$AR(),this._$AH=h):e!==this._$AH&&e!==C&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Se(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==h&&O(this._$AH)?this._$AA.nextSibling.data=e:this.T(x.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=U.createElement(he(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{const a=new Ee(i,this),o=a.u(this.options);a.p(t),this.T(o),this._$AH=a}}_$AC(e){let t=ce.get(e.strings);return t===void 0&&ce.set(e.strings,t=new U(e)),t}k(e){Q(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,i=0;for(const a of e)i===t.length?t.push(s=new L(this.O(M()),this.O(M()),this,this.options)):s=t[i],s._$AI(a),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const s=te(e).nextSibling;te(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}}class R{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,a){this.type=1,this._$AH=h,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=a,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=h}_$AI(e,t=this,s,i){const a=this.strings;let o=!1;if(a===void 0)e=E(this,e,t,0),o=!O(e)||e!==this._$AH&&e!==C,o&&(this._$AH=e);else{const l=e;let n,p;for(e=a[0],n=0;n<a.length-1;n++)p=E(this,l[s+n],t,n),p===C&&(p=this._$AH[n]),o||=!O(p)||p!==this._$AH[n],p===h?e=h:e!==h&&(e+=(p??"")+a[n+1]),this._$AH[n]=p}o&&!i&&this.j(e)}j(e){e===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ke extends R{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===h?void 0:e}}class Pe extends R{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==h)}}class Me extends R{constructor(e,t,s,i,a){super(e,t,s,i,a),this.type=5}_$AI(e,t=this){if((e=E(this,e,t,0)??h)===C)return;const s=this._$AH,i=e===h&&s!==h||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,a=e!==h&&(s===h||i);i&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class Oe{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){E(this,e)}}const Te=W.litHtmlPolyfillSupport;Te?.(U,L),(W.litHtmlVersions??=[]).push("3.3.2");const Ue=(r,e,t)=>{const s=t?.renderBefore??e;let i=s._$litPart$;if(i===void 0){const a=t?.renderBefore??null;s._$litPart$=i=new L(e.insertBefore(M(),a),a,void 0,t??{})}return i._$AI(r),i};const F=globalThis;class G extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ue(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return C}}G._$litElement$=!0,G.finalized=!0,F.litElementHydrateSupport?.({LitElement:G});const Le=F.litElementPolyfillSupport;Le?.({LitElement:G}),(F.litElementVersions??=[]).push("4.2.2");const Ge=r=>(e,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(r,e)}):customElements.define(r,e)};const Ne={attribute:!0,type:String,converter:z,reflect:!1,hasChanged:V},ze=(r=Ne,e,t)=>{const{kind:s,metadata:i}=t;let a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),s==="setter"&&((r=Object.create(r)).wrapped=!0),a.set(t.name,r),s==="accessor"){const{name:o}=t;return{set(l){const n=e.get.call(this);e.set.call(this,l),this.requestUpdate(o,n,r,!0,l)},init(l){return l!==void 0&&this.C(o,void 0,r,l),l}}}if(s==="setter"){const{name:o}=t;return function(l){const n=this[o];e.call(this,l),this.requestUpdate(o,n,r,!0,l)}}throw Error("Unsupported decorator location: "+s)};function y(r){return(e,t)=>typeof t=="object"?ze(r,e,t):((s,i,a)=>{const o=i.hasOwnProperty(a);return i.constructor.createProperty(a,s),o?Object.getOwnPropertyDescriptor(i,a):void 0})(r,e,t)}function $(r){return y({...r,state:!0,attribute:!1})}function He(){return window.__STEAMVIEW_API_BASE__||"/apis/api.steamview.halo.run/v1alpha1/games"}function D(r){const e=Math.max(0,Math.floor(r||0)),t=Math.floor(e/60),s=e%60;return t<=0?`${s} 分钟`:s<=0?`${t} 小时`:`${t} 小时 ${s} 分钟`}function Re(r,e){if(e>0){const t=new Date(e*1e3);if(!Number.isNaN(t.getTime()))return t.toLocaleDateString("zh-CN")}return r||"从未游玩"}function De(r){if(!r)return"-";const e=new Date(r);return Number.isNaN(e.getTime())?r:e.toLocaleString("zh-CN",{hour12:!1})}function Ie(r,e){const t=[...r];switch(e){case"name":return t.sort((s,i)=>s.name.localeCompare(i.name,"zh-CN"));case"totalTime":return t.sort((s,i)=>i.totalTime-s.totalTime);case"lastPlayed":return t.sort((s,i)=>i.lastPlayedAt-s.lastPlayedAt);default:return t.sort((s,i)=>i.twoWeekTime-s.twoWeekTime)}}const K={games:[],stats:{totalGames:0,totalTime:0,twoWeekTime:0,activeGames:0},player:{steamId:"",personaName:"",profileUrl:"",avatar:"",avatarMedium:"",avatarFull:"",level:0,badgeCount:0,playerXp:0,xpToNextLevel:void 0,badges:[]},lastUpdated:""};async function Be(r){const e=(r||He()).trim();if(!e)return K;const t=await fetch(e,{credentials:"omit"});if(!t.ok)throw new Error(`获取 Steam 游戏失败: HTTP ${t.status}`);const s=await t.json();return{games:Array.isArray(s.games)?s.games:[],stats:s.stats||K.stats,player:s.player||K.player,lastUpdated:s.lastUpdated||""}}const je=ue`
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
`;var Ve=Object.defineProperty,We=Object.getOwnPropertyDescriptor,m=(r,e,t,s)=>{for(var i=s>1?void 0:s?We(e,t):e,a=r.length-1,o;a>=0;a--)(o=r[a])&&(i=(s?o(e,t,i):o(i))||i);return s&&i&&Ve(e,t,i),i};const k=12;d.SteamGamesView=class extends G{constructor(){super(...arguments),this.apiBase="",this.title="Steam 游戏展柜",this.subtitle="最近游玩、总时长与活跃状态",this.mode="all",this.appId="",this.showProfile=!0,this.embedded=!1,this.games=[],this.loading=!1,this.error="",this.sortBy="totalTime",this.keyword="",this.visibleCount=k,this.lastUpdated="",this.player=null,this.colorSchemeMode="auto",this.mediaQuery=null,this.colorSchemeObserver=null,this.autoLoadObserver=null,this.handleMediaChange=()=>{this.colorSchemeMode==="auto"&&this.syncColorSchemeFromDocument()},this.handleDomReady=()=>{!this.colorSchemeObserver||!document.body||(this.colorSchemeObserver.observe(document.body,{attributes:!0,attributeFilter:["class","data-color-scheme"]}),this.syncColorSchemeFromDocument())},this.handleAutoLoadIntersection=e=>{e.some(t=>t.isIntersecting)&&this.loadMore()}}connectedCallback(){super.connectedCallback(),this.setupColorSchemeSync(),this.setupAutoLoadObserver(),this.hydrateQueryState(),this.visibleCount=k,this.loadGames()}disconnectedCallback(){this.teardownColorSchemeSync(),this.teardownAutoLoadObserver(),super.disconnectedCallback()}updated(e){this.bindAutoLoadSentinel()}setupAutoLoadObserver(){typeof window>"u"||typeof IntersectionObserver>"u"||(this.autoLoadObserver=new IntersectionObserver(this.handleAutoLoadIntersection,{root:null,rootMargin:"280px 0px",threshold:.01}))}teardownAutoLoadObserver(){this.autoLoadObserver&&(this.autoLoadObserver.disconnect(),this.autoLoadObserver=null)}bindAutoLoadSentinel(){if(!this.autoLoadObserver||(this.autoLoadObserver.disconnect(),this.mode==="single"||this.loading||this.error||this.visibleGames.length>=this.filteredGames.length))return;const e=this.renderRoot.querySelector(".load-sentinel");e&&this.autoLoadObserver.observe(e)}setupColorSchemeSync(){typeof window>"u"||typeof document>"u"||(this.mediaQuery=window.matchMedia("(prefers-color-scheme: dark)"),typeof this.mediaQuery.addEventListener=="function"?this.mediaQuery.addEventListener("change",this.handleMediaChange):this.mediaQuery.addListener(this.handleMediaChange),this.colorSchemeObserver=new MutationObserver(()=>this.syncColorSchemeFromDocument()),this.colorSchemeObserver.observe(document.documentElement,{attributes:!0,attributeFilter:["class","data-color-scheme"]}),document.body?this.colorSchemeObserver.observe(document.body,{attributes:!0,attributeFilter:["class","data-color-scheme"]}):window.addEventListener("DOMContentLoaded",this.handleDomReady,{once:!0}),this.syncColorSchemeFromDocument())}teardownColorSchemeSync(){typeof window<"u"&&window.removeEventListener("DOMContentLoaded",this.handleDomReady),this.mediaQuery&&(typeof this.mediaQuery.removeEventListener=="function"?this.mediaQuery.removeEventListener("change",this.handleMediaChange):this.mediaQuery.removeListener(this.handleMediaChange)),this.colorSchemeObserver&&this.colorSchemeObserver.disconnect(),this.mediaQuery=null,this.colorSchemeObserver=null}syncColorSchemeFromDocument(){const e=this.readColorSchemeMode(document.body)??this.readColorSchemeMode(document.documentElement)??"auto",t=e==="auto"?this.mediaQuery?.matches?"dark":"light":e;this.colorSchemeMode=e,this.setAttribute("data-color-scheme",t)}readColorSchemeMode(e){if(!e)return null;const t=(e.getAttribute("data-color-scheme")||"").trim().toLowerCase(),s=this.readClassColorSchemeMode(e);return t==="dark"||s==="dark"?"dark":t==="light"||s==="light"?"light":t==="auto"||s==="auto"?"auto":null}readClassColorSchemeMode(e){return e.classList.contains("color-scheme-dark")||e.classList.contains("dark")?"dark":e.classList.contains("color-scheme-light")||e.classList.contains("light")?"light":e.classList.contains("color-scheme-auto")?"auto":null}hydrateQueryState(){if(this.mode==="single")return;const e=new URLSearchParams(window.location.search),t=e.get("q"),s=e.get("sort");t&&(this.keyword=t),s&&this.isSortKey(s)&&(this.sortBy=s)}isSortKey(e){return e==="twoWeekTime"||e==="totalTime"||e==="name"||e==="lastPlayed"}syncQueryState(){if(this.mode==="single"||this.embedded)return;const e=new URL(window.location.href);this.keyword?e.searchParams.set("q",this.keyword):e.searchParams.delete("q"),this.sortBy!=="totalTime"?e.searchParams.set("sort",this.sortBy):e.searchParams.delete("sort"),window.history.replaceState(null,"",e.toString())}async loadGames(){this.loading=!0,this.error="";try{const e=await Be(this.apiBase);this.games=e.games.filter(t=>!t.hidden),this.player=e.player||null,this.lastUpdated=e.lastUpdated,this.visibleCount=k}catch(e){this.error=e instanceof Error?e.message:"加载失败，请稍后重试",this.games=[],this.player=null}finally{this.loading=!1}}onSearchInput(e){this.keyword=e.target.value,this.visibleCount=k,this.syncQueryState()}onSortChange(e){const t=e.target.value;this.isSortKey(t)&&(this.sortBy=t,this.visibleCount=k,this.syncQueryState())}loadMore(){if(this.loading)return;const e=k;this.visibleCount=Math.min(this.visibleCount+e,this.filteredGames.length)}get filteredGames(){const e=this.mode==="single"?this.games.filter(i=>i.appId===this.appId):this.games;if(this.mode==="single")return e;const t=Ie(e,this.sortBy),s=this.keyword.trim().toLowerCase();return s?t.filter(i=>i.name.toLowerCase().includes(s)||i.appId.includes(s)):t}get visibleGames(){return this.filteredGames.slice(0,this.visibleCount)}get summary(){const e=this.filteredGames,t=e.reduce((a,o)=>a+o.totalTime,0),s=e.reduce((a,o)=>a+o.twoWeekTime,0),i=e.filter(a=>a.active||a.twoWeekTime>0).length;return{gameCount:e.length,totalTime:t,twoWeekTime:s,activeGames:i}}renderProfile(e){const t=this.player,s=t?.profileUrl||"",i=t?.avatarFull||t?.avatarMedium||t?.avatar||"",a=t?.personaName||"Steam 玩家",o=t?.level||0,l=t?.badgeCount||0;return u`
      <aside class="profile-panel" aria-label="玩家资料面板">
        <div class="profile-head">
          ${i?u`<img class="profile-avatar" src=${i} alt=${a} width="72" height="72" />`:u`<div class="profile-avatar profile-avatar-fallback" aria-hidden="true">${a[0]||"S"}</div>`}
          <div class="profile-main">
            <p class="profile-name">${a}</p>
            ${s?u`
                  <a class="profile-link" href=${s} target="_blank" rel="noopener noreferrer">
                    打开 Steam 主页
                  </a>
                `:null}
          </div>
        </div>

        <dl class="profile-metrics profile-metrics-main">
          <div class="metric-chip">
            <dt><span class="metric-icon" aria-hidden="true">⬢</span>等级</dt>
            <dd>Lv.${o}</dd>
          </div>
          <div class="metric-chip">
            <dt><span class="metric-icon" aria-hidden="true">◇</span>徽章</dt>
            <dd>${l}</dd>
          </div>
          <div class="metric-chip">
            <dt><span class="metric-icon" aria-hidden="true">✦</span>总 XP</dt>
            <dd>${t?.playerXp||0}</dd>
          </div>
          <div class="metric-chip">
            <dt><span class="metric-icon" aria-hidden="true">⌗</span>游戏</dt>
            <dd>${e.gameCount}</dd>
          </div>
          <div class="metric-chip">
            <dt><span class="metric-icon" aria-hidden="true">◷</span>总时长</dt>
            <dd>${D(e.totalTime)}</dd>
          </div>
          <div class="metric-chip">
            <dt><span class="metric-icon" aria-hidden="true">◶</span>两周</dt>
            <dd>${D(e.twoWeekTime)}</dd>
          </div>
          <div class="metric-chip">
            <dt><span class="metric-icon" aria-hidden="true">●</span>活跃</dt>
            <dd>${e.activeGames}</dd>
          </div>
        </dl>
      </aside>
    `}renderState(){return this.loading?u`
        <div class="state" role="status" aria-live="polite">
          <div class="spinner" aria-hidden="true"></div>
          <h3>正在加载数据</h3>
          <p>正在拉取游戏列表和玩家资料，请稍候…</p>
        </div>
      `:this.error?u`
        <div class="state error" role="alert">
          <h3>加载失败</h3>
          <p>${this.error}</p>
          <button type="button" @click=${this.loadGames}>重试</button>
        </div>
      `:null}render(){const e=this.renderState(),t=this.summary,s=this.mode==="single",i=!s&&this.visibleGames.length<this.filteredGames.length,a=s||this.showProfile;return u`
      <main class="shell">
        <div class="container">
          <h1 class="sr-only">${this.title}</h1>
          <p class="sr-only">${this.subtitle}</p>

          ${a?u`<section class="overview" aria-label="关键指标与玩家资料">${this.renderProfile(t)}</section>`:null}

          ${e||u`
                ${s?u`
                      <section class="toolbar" aria-label="操作栏">
                        <div class="toolbar-actions">
                          <button type="button" class="refresh-btn" @click=${this.loadGames}>刷新</button>
                        </div>
                      </section>
                    `:u`
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
                              <option value="totalTime" ?selected=${this.sortBy==="totalTime"}>总时长优先</option>
                              <option value="twoWeekTime" ?selected=${this.sortBy==="twoWeekTime"}>两周时长优先</option>
                              <option value="lastPlayed" ?selected=${this.sortBy==="lastPlayed"}>最近游玩优先</option>
                              <option value="name" ?selected=${this.sortBy==="name"}>名称 A-Z</option>
                            </select>
                          </label>
                          <button type="button" class="refresh-btn" @click=${this.loadGames}>刷新</button>
                        </div>
                      </section>
                    `}

                <div class="list-meta">
                  <span>展示 ${this.visibleGames.length} / ${this.filteredGames.length} 个游戏</span>
                  <span>${s?`单游戏模式 ${this.appId||""}`:`最近更新 ${De(this.lastUpdated)}`}</span>
                </div>

                ${this.filteredGames.length===0?u`
                      <div class="state">
                        <h3>${s?"未找到指定游戏":"暂无可展示游戏"}</h3>
                        <p>${s?"请确认 App ID 是否正确，或稍后刷新数据。":"请检查 Steam 配置，或稍后刷新数据。"}</p>
                      </div>
                    `:u`
                      <section id="steam-games-list" class="game-waterfall" aria-label="Steam 游戏瀑布流列表">
                        ${this.visibleGames.map((o,l)=>u`
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
                                  loading=${l<6?"eager":"lazy"}
                                  fetchpriority=${l<3?"high":"auto"}
                                />
                              </a>

                              <div class="game-body">
                                <div class="game-head">
                                  <h2 class="game-name">${o.name}</h2>
                                  ${o.active||o.twoWeekTime>0?u`<span class="active-tag">活跃</span>`:null}
                                </div>

                                <p class="game-meta">
                                  <span>App ${o.appId}</span>
                                  <span>${Re(o.lastPlayed,o.lastPlayedAt)}</span>
                                </p>

                                <div class="metric-block">
                                  <div class="metric-row">
                                    <span>总时长</span>
                                    <span>${D(o.totalTime)}</span>
                                  </div>
                                  <div class="progress" aria-hidden="true">
                                    <i style="width:${Math.max(0,Math.min(100,o.totalPercent))}%"></i>
                                  </div>
                                </div>

                                <div class="metric-block">
                                  <div class="metric-row">
                                    <span>最近两周</span>
                                    <span>${D(o.twoWeekTime)}</span>
                                  </div>
                                  <div class="progress progress-two-week" aria-hidden="true">
                                    <i style="width:${Math.max(0,Math.min(100,o.twoWeekPercent))}%"></i>
                                  </div>
                                </div>
                              </div>
                            </article>
                          `)}
                      </section>

                      ${i?u`
                            <div class="load-zone" aria-hidden="true">
                              <div class="load-sentinel"></div>
                              <p class="loading-hint">下拉自动加载更多</p>
                            </div>
                          `:u`<p class="loading-hint done">已全部加载</p>`}
                    `}
              `}

          <div class="sr-only" aria-live="polite">
            ${this.loading?"正在加载数据":this.error?`加载失败：${this.error}`:`已加载 ${this.filteredGames.length} 个游戏`}
          </div>
        </div>
      </main>
    `}},d.SteamGamesView.styles=je,m([y({type:String,attribute:"api-base"})],d.SteamGamesView.prototype,"apiBase",2),m([y({type:String})],d.SteamGamesView.prototype,"title",2),m([y({type:String})],d.SteamGamesView.prototype,"subtitle",2),m([y({type:String})],d.SteamGamesView.prototype,"mode",2),m([y({type:String,attribute:"app-id"})],d.SteamGamesView.prototype,"appId",2),m([y({type:Boolean,attribute:"show-profile"})],d.SteamGamesView.prototype,"showProfile",2),m([y({type:Boolean,reflect:!0})],d.SteamGamesView.prototype,"embedded",2),m([$()],d.SteamGamesView.prototype,"games",2),m([$()],d.SteamGamesView.prototype,"loading",2),m([$()],d.SteamGamesView.prototype,"error",2),m([$()],d.SteamGamesView.prototype,"sortBy",2),m([$()],d.SteamGamesView.prototype,"keyword",2),m([$()],d.SteamGamesView.prototype,"visibleCount",2),m([$()],d.SteamGamesView.prototype,"lastUpdated",2),m([$()],d.SteamGamesView.prototype,"player",2),d.SteamGamesView=m([Ge("steam-games-view")],d.SteamGamesView),Object.defineProperty(d,Symbol.toStringTag,{value:"Module"})}));
