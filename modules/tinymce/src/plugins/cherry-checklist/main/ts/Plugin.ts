/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */

import PluginManager from 'tinymce/core/api/PluginManager';
import { isLinkUneditable } from '../../../link/main/ts/core/Utils';

export default () => {
  const t = window;
  function n() {}
  function d(n) {
    return function () {
      return n;
    };
  }
  function e() {
    return c;
  }
  let r; const i = d(!1); const u = d(!0); var c = (r = {
    fold(n, e) {
      return n();
    },
    is: i,
    isSome: i,
    isNone: u,
    getOr: f,
    getOrThunk: s,
    getOrDie(n) {
      throw new Error(n || 'error: getOrDie called on none.');
    },
    getOrNull: d(null),
    getOrUndefined: d(void 0),
    or: f,
    orThunk: s,
    map: e,
    each: n,
    bind: e,
    exists: i,
    forall: u,
    filter: e,
    equals: o,
    equals_: o,
    toArray() {
      return [];
    },
    toString: d('none()')
  },
  Object.freeze && Object.freeze(r),
  r);
  function o(n) {
    return n.isNone();
  }
  function s(n) {
    return n();
  }
  function f(n) {
    return n;
  }
  function g(e) {
    return function (n) {
      return (function (n) {
        if (null === n) {
          return 'null';
        }
        const e = typeof n;
        return 'object' == e && (Array.prototype.isPrototypeOf(n) || n.constructor && 'Array' === n.constructor.name) ? 'array' : 'object' == e && (String.prototype.isPrototypeOf(n) || n.constructor && 'String' === n.constructor.name) ? 'string' : e;
      }(n)) === e;
    };
  }
  function p(n, e) {
    return -1 < (function (n, e) {
      return en.call(n, e);
    }(n, e));
  }
  function N(n, e) {
    for (var r = n.length, t = new Array(r), o = 0; o < r; o++) {
      const i = n[o];
      t[o] = e(i, o);
    }
    return t;
  }
  function O(n, e) {
    for (let r = 0, t = n.length; r < t; r++) {
      e(n[r], r);
    }
  }
  function w(n) {
    return n.dom().nodeName.toLowerCase();
  }
  function x(n, e, r) {
    if (!(K(r) || J(r) || Z(r))) {
      throw t.console.error('Invalid call to Attr.set. Key ', e, ':: Value ', r, ':: Element ', n),
      new Error('Attribute value was not simple');
    }
    n.setAttribute(e, `${r}`);
  }
  function T(n, e, r) {
    x(n.dom(), e, r);
  }
  function E(n, e) {
    const r = n.dom();
    // @ts-ignore
    !(function (n, e) {
      for (let r = W(n), t = 0, o = r.length; t < o; t++) {
        const i = r[t];
        e(n[i], i);
      }
    }(e, (n, e) => {
      x(r, e, n);
    }));
  }
  function S(n, e) {
    n.dom().removeAttribute(e);
  }
  function k(n) {
    return (function (n, e, r) {
      return O(n, (n) => {
        r = e(r, n);
      }),
      r;
    }(n.dom().attributes, (n, e) => (n[e.name] = e.value,
    n), {}));
  }
  function D(n, e) {
    const r = (function (n, e) {
      const r = n.dom().getAttribute(e);
      return null === r ? void 0 : r;
    }(n, e));
    return void 0 === r || '' === r ? [] : r.split(' ');
  }
  function y(n) {
    return void 0 !== n.dom().classList;
  }
  function b(n) {
    return D(n, 'class');
  }
  function C(n, e) {
    return (function (n, e, r) {
      const t = D(n, e).concat([r]);
      return T(n, e, t.join(' ')),
      !0;
    }(n, 'class', e));
  }
  function L(n, e) {
    return (function (n, e, r) {
      const t = (function (n, e) {
        for (var r = [], t = 0, o = n.length; t < o; t++) {
          const i = n[t];
          // @ts-ignore
          e(i, t) && r.push(i);
        }
        return r;
      }(D(n, e), n => n !== r));
      return 0 < t.length ? T(n, e, t.join(' ')) : S(n, e),
      !1;
    }(n, 'class', e));
  }
  function A(n, e) {
    y(n) ? n.dom().classList.add(e) : C(n, e);
  }
  function _(n, e) {
    y(n) ? n.dom().classList.remove(e) : L(n, e),
    (function (n) {
      0 === (y(n) ? n.dom().classList : b(n)).length && S(n, 'class');
    }(n));
  }
  function M(n, e) {
    return y(n) ? n.dom().classList.toggle(e) : (function (n, e) {
      return p(b(n), e) ? L(n, e) : C(n, e);
    }(n, e));
  }
  function R(n, e) {
    return y(n) && n.dom().classList.contains(e);
  }
  function j(n, e) {
    const r = (function (n, e) {
      for (let r = 0; r < n.length; r++) {
        const t = n[r];
        if (t.test(e)) {
          return t;
        }
      }
    }(n, e));
    if (!r) {
      return {
        major: 0,
        minor: 0
      };
    }
    function t(n) {
      return Number(e.replace(r, `$${n}`));
    }
    return an(t(1), t(2));
  }
  function P(n, e) {
    return function () {
      return e === n;
    };
  }
  function B(n, e) {
    return function () {
      return e === n;
    };
  }
  function F(n, e) {
    const r = String(e).toLowerCase();
    return (function (n, e) {
      for (let r = 0, t = n.length; r < t; r++) {
        const o = n[r];
        // @ts-ignore
        if (e(o, r)) {
          return H.some(o);
        }
      }
      return H.none();
    }(n, n => n.search(r)));
  }
  function U(n, e) {
    return -1 !== n.indexOf(e);
  }
  function X(e) {
    return function (n) {
      return U(n, e);
    };
  }
  function q(n, e) {
    const r = n.dom();
    if (r.nodeType !== Ln) {
      return !1;
    }
    const t = r;
    if (void 0 !== t.matches) {
      return t.matches(e);
    }
    if (void 0 !== t.msMatchesSelector) {
      return t.msMatchesSelector(e);
    }
    if (void 0 !== t.webkitMatchesSelector) {
      return t.webkitMatchesSelector(e);
    }
    if (void 0 !== t.mozMatchesSelector) {
      return t.mozMatchesSelector(e);
    }
    throw new Error('Browser lacks native selectors');
  }
  function V(n, e) {
    // @ts-ignore
    const r = void 0 === e ? t.document : e.dom();
    return (function (n) {
      return n.nodeType !== Ln && n.nodeType !== An || 0 === n.childElementCount;
    }(r)) ? [] : N(r.querySelectorAll(n), Cn.fromDom);
  }
  let Y; var z = function (r) {
    function n() {
      return o;
    }
    function e(n) {
      return n(r);
    }
    const t = d(r);
    var o = {
      fold(n, e) {
        return e(r);
      },
      is(n) {
        return r === n;
      },
      isSome: u,
      isNone: i,
      getOr: t,
      getOrThunk: t,
      getOrDie: t,
      getOrNull: t,
      getOrUndefined: t,
      or: n,
      orThunk: n,
      map(n) {
        return z(n(r));
      },
      each(n) {
        n(r);
      },
      bind: e,
      exists: e,
      forall: e,
      filter(n) {
        return n(r) ? o : c;
      },
      toArray() {
        return [r];
      },
      toString() {
        return `some(${r})`;
      },
      equals(n) {
        return n.is(r);
      },
      equals_(n, e) {
        return n.fold(i, n => e(r, n));
      }
    };
    return o;
  }; var H = {
    some: z,
    none: e,
    from(n) {
      return null == n ? c : z(n);
    }
  }; var W = Object.keys; const G = Object.hasOwnProperty; const $ = function (n, e) {
    return G.call(n, e);
  }; var K = g('string'); var J = g('boolean'); const Q = g('function'); var Z = g('number'); var en = Array.prototype.indexOf; const rn = (Q(Array.from) && Array.from,
  t.Node.ATTRIBUTE_NODE,
  t.Node.CDATA_SECTION_NODE,
  t.Node.COMMENT_NODE,
  t.Node.DOCUMENT_NODE); const tn = (t.Node.DOCUMENT_TYPE_NODE,
  t.Node.DOCUMENT_FRAGMENT_NODE,
  t.Node.ELEMENT_NODE); const on = t.Node.TEXT_NODE; const un = (t.Node.PROCESSING_INSTRUCTION_NODE,
  t.Node.ENTITY_REFERENCE_NODE,
  t.Node.ENTITY_NODE,
  t.Node.NOTATION_NODE,
  void 0 !== t.window ? t.window : Function('return this;')(),
  Y = on,
  function (n) {
    return (function (n) {
      return n.dom().nodeType;
    }(n)) === Y;
  }
  );
  var sn = function (n) {
    function e() {
      return r;
    }
    var r = n;
    return {
      get: e,
      set(n) {
        r = n;
      },
      clone() {
        return sn(e());
      }
    };
  }; const fn = function () {
    return an(0, 0);
  }; var an = function (n, e) {
    return {
      major: n,
      minor: e
    };
  }; const ln = {
    nu: an,
    detect(n, e) {
      const r = String(e).toLowerCase();
      return 0 === n.length ? fn() : j(n, r);
    },
    unknown: fn
  }; const dn = 'Firefox'; const mn = function (n) {
    const e = n.current;
    return {
      current: e,
      version: n.version,
      isEdge: P('Edge', e),
      isChrome: P('Chrome', e),
      isIE: P('IE', e),
      isOpera: P('Opera', e),
      isFirefox: P(dn, e),
      isSafari: P('Safari', e)
    };
  }; const vn = {
    unknown() {
      return mn({
        current: void 0,
        version: ln.unknown()
      });
    },
    nu: mn,
    edge: d('Edge'),
    chrome: d('Chrome'),
    ie: d('IE'),
    opera: d('Opera'),
    firefox: d(dn),
    safari: d('Safari')
  }; const hn = 'Windows'; const gn = 'Android'; const pn = 'Solaris'; const Nn = 'FreeBSD'; const On = function (n) {
    const e = n.current;
    return {
      current: e,
      version: n.version,
      isWindows: B(hn, e),
      isiOS: B('iOS', e),
      isAndroid: B(gn, e),
      isOSX: B('OSX', e),
      isLinux: B('Linux', e),
      isSolaris: B(pn, e),
      isFreeBSD: B(Nn, e)
    };
  }; const wn = {
    unknown() {
      return On({
        current: void 0,
        version: ln.unknown()
      });
    },
    nu: On,
    windows: d(hn),
    ios: d('iOS'),
    android: d(gn),
    linux: d('Linux'),
    osx: d('OSX'),
    solaris: d(pn),
    freebsd: d(Nn)
  }; const xn = function (n, r) {
    return F(n, r).map((n) => {
      const e = ln.detect(n.versionRegexes, r);
      return {
        current: n.name,
        version: e
      };
    });
  }; const Tn = function (n, r) {
    return F(n, r).map((n) => {
      const e = ln.detect(n.versionRegexes, r);
      return {
        current: n.name,
        version: e
      };
    });
  }; const En = /.*?version\/\ ?([0-9]+)\.([0-9]+).*/; const Sn = [{
    name: 'Edge',
    versionRegexes: [/.*?edge\/ ?([0-9]+)\.([0-9]+)$/],
    search(n) {
      return U(n, 'edge/') && U(n, 'chrome') && U(n, 'safari') && U(n, 'applewebkit');
    }
  }, {
    name: 'Chrome',
    versionRegexes: [/.*?chrome\/([0-9]+)\.([0-9]+).*/, En],
    search(n) {
      return U(n, 'chrome') && !U(n, 'chromeframe');
    }
  }, {
    name: 'IE',
    versionRegexes: [/.*?msie\ ?([0-9]+)\.([0-9]+).*/, /.*?rv:([0-9]+)\.([0-9]+).*/],
    search(n) {
      return U(n, 'msie') || U(n, 'trident');
    }
  }, {
    name: 'Opera',
    versionRegexes: [En, /.*?opera\/([0-9]+)\.([0-9]+).*/],
    search: X('opera')
  }, {
    name: 'Firefox',
    versionRegexes: [/.*?firefox\/\ ?([0-9]+)\.([0-9]+).*/],
    search: X('firefox')
  }, {
    name: 'Safari',
    versionRegexes: [En, /.*?cpu os ([0-9]+)_([0-9]+).*/],
    search(n) {
      return (U(n, 'safari') || U(n, 'mobile/')) && U(n, 'applewebkit');
    }
  }]; const kn = [{
    name: 'Windows',
    search: X('win'),
    versionRegexes: [/.*?windows\ nt\ ?([0-9]+)\.([0-9]+).*/]
  }, {
    name: 'iOS',
    search(n) {
      return U(n, 'iphone') || U(n, 'ipad');
    },
    versionRegexes: [/.*?version\/\ ?([0-9]+)\.([0-9]+).*/, /.*cpu os ([0-9]+)_([0-9]+).*/, /.*cpu iphone os ([0-9]+)_([0-9]+).*/]
  }, {
    name: 'Android',
    search: X('android'),
    versionRegexes: [/.*?android\ ?([0-9]+)\.([0-9]+).*/]
  }, {
    name: 'OSX',
    search: X('os x'),
    versionRegexes: [/.*?os\ x\ ?([0-9]+)_([0-9]+).*/]
  }, {
    name: 'Linux',
    search: X('linux'),
    versionRegexes: []
  }, {
    name: 'Solaris',
    search: X('sunos'),
    versionRegexes: []
  }, {
    name: 'FreeBSD',
    search: X('freebsd'),
    versionRegexes: []
  }]; const Dn = {
    browsers: d(Sn),
    oses: d(kn)
  }; const yn = sn(function (n, e) {
    const r = Dn.browsers();
    const t = Dn.oses();
    const o = xn(r, n).fold(vn.unknown, vn.nu);
    const i = Tn(t, n).fold(wn.unknown, wn.nu);
    return {
      browser: o,
      os: i,
      deviceType: (function (n, e, r, t) {
        const o = n.isiOS() && !0 === /ipad/i.test(r);
        const i = n.isiOS() && !o;
        const u = n.isiOS() || n.isAndroid();
        const c = u || t('(pointer:coarse)');
        const s = o || !i && u && t('(min-device-width:768px)');
        const f = i || u && !s;
        const a = e.isSafari() && n.isiOS() && !1 === /safari/i.test(r);
        const l = !f && !s && !a;
        return {
          isiPad: d(o),
          isiPhone: d(i),
          isTablet: d(s),
          isPhone: d(f),
          isTouch: d(c),
          isAndroid: n.isAndroid,
          isiOS: n.isiOS,
          isWebView: d(a),
          isDesktop: d(l)
        };
      }(i, o, n, e))
    };
  }(t.navigator.userAgent, n => t.window.matchMedia(n).matches)); const bn = function (n) {
    if (null == n) {
      throw new Error('Node cannot be null or undefined');
    }
    return {
      dom: d(n)
    };
  }; var Cn = {
    fromHtml(n, e) {
      const r = (e || t.document).createElement('div');
      if (r.innerHTML = n,
      !r.hasChildNodes() || 1 < r.childNodes.length) {
        throw t.console.error('HTML does not have a single root node', n),
        new Error('HTML must have a single root node');
      }
      return bn(r.childNodes[0]);
    },
    fromTag(n, e) {
      const r = (e || t.document).createElement(n);
      return bn(r);
    },
    fromText(n, e) {
      const r = (e || t.document).createTextNode(n);
      return bn(r);
    },
    fromDom: bn,
    fromPoint(n, e, r) {
      const t = n.dom();
      return H.from(t.elementFromPoint(e, r)).map(bn);
    }
  }; var Ln = tn; var An = rn;
  yn.get().browser.isIE();
  function _n(n, e, r, t, o) {
    return n(r, t) ? H.some(r) : Q(o) && o(r) ? H.none() : e(r, t, o);
  }
  function Mn(n, e, r) {
    for (let t = n.dom(), o = Q(r) ? r : d(!1); t.parentNode;) {
      t = t.parentNode;
      const i = Cn.fromDom(t);
      if (e(i)) {
        return H.some(i);
      }
      if (o(i)) {
        break;
      }
    }
    return H.none();
  }
  function Rn(n) {
    return H.from(n.dom().parentNode).map(Cn.fromDom);
  }
  function In(n) {
    return N(n.dom().childNodes, Cn.fromDom);
  }
  function jn(n) {
    return (function (n, e) {
      const r = n.dom().childNodes;
      return H.from(r[e]).map(Cn.fromDom);
    }(n, 0));
  }
  function Pn(n, e) {
    const r = (function (n, e) {
      // @ts-ignore
      const r = Cn.fromTag(e);
      const t = k(n);
      return E(r, t),
      r;
    }(n, e));
    return (function (e, r) {
      Rn(e).each((n) => {
        n.dom().insertBefore(r.dom(), e.dom());
      });
    }(n, r)),
    (function (e, n) {
      O(n, (n) => {
        // @ts-ignore
        !(function (n, e) {
          n.dom().appendChild(e.dom());
        }(e, n));
      });
    }(r, In(n))),
    (function (n) {
      const e = n.dom();
      null !== e.parentNode && e.parentNode.removeChild(e);
    }(n)),
    r;
  }
  function Bn(n, e, r) {
    return Mn(n, n => q(n, e), r);
  }
  function Fn(i) {
    function u(n) {
      return 'ol' === w(n) || 'ul' === w(n);
    }
    function n() {
      ((function (n, e, r) {
        return _n((n, e) => e(n), Mn, n, e, r);
      })(Cn.fromDom(i.selection.getNode()), u)).fold(() => {
        if (isLinkUneditable(i, [ 'card' ])) {
          return;
        }
        i.execCommand('InsertUnorderedList', !1, {
          'list-attributes': {
            class: 'tox-checklist'
          }
        });
      }, (e) => {
        i.undoManager.transact(() => {
          if (R(e, 'tox-checklist')) {
            i.execCommand('RemoveList');
          } else {
            const n = Pn(e, 'ul');
            A(n, 'tox-checklist');
          }
        });
      });
    }
    i.ui.registry.addToggleButton('ch-checklist', {
      icon: 'checklist',
      tooltip: 'Insert Checklist',
      onAction: n,
      onSetup(e) {
        function r(n) {
          return (function (n, e) {
            return n.dom() === e.dom();
          }(n, o)) || u(n);
        }
        function t(n) {
          return e.setActive(!i.readonly && (function (n, e, r) {
            return _n(q, Bn, n, e, r);
          }(Cn.fromDom(n), '.tox-checklist', r)).isSome());
        }
        function n(n) {
          return t(n.element);
        }
        var o = Cn.fromDom(i.getBody());
        return i.on('NodeChange', n),
        t(i.selection.getNode()),
        function () {
          return i.off('NodeChange', n);
        };
      }
    }),
    i.ui.registry.addMenuItem('ch-checklist', {
      icon: 'checklist',
      text: 'Checklist',
      onAction: n
    });
  }
  // @ts-ignore
  !(function (...args) {
    for (let n = [], e = 0; e < arguments.length; e++) {
      n[e] = arguments[e];
    }
  }('element', 'offset'));
  function Un(n, e) {
    return void 0 !== n ? n : void 0 !== e ? e : 0;
  }
  function Xn(n) {
    return 'li' === w(n) && (function (n) {
      return Rn(n).filter(n => 'ul' === w(n) && R(n, 'tox-checklist'))
        .isSome();
    }(n));
  }
  function qn(n, e) {
    return H.from(n).filter(Xn)
      .exists(n => e < (function (n) {
        const e = n.dom().ownerDocument;
        const r = e.body;
        const t = e.defaultView;
        const o = e.documentElement;
        if (r === n.dom()) {
          return $n(r.offsetLeft, r.offsetTop);
        }
        const i = Un(t.pageYOffset, o.scrollTop);
        const u = Un(t.pageXOffset, o.scrollLeft);
        const c = Un(o.clientTop, r.clientTop);
        const s = Un(o.clientLeft, r.clientLeft);
        return Kn(n).translate(u - s, i - c);
      }(n)).left());
  }
  function Vn(n) {
    return M(n, 'tox-checklist--checked');
  }
  function Yn(n) {
    return p(['ul', 'ol', 'dl'], w(n));
  }
  function zn(n) {
    return H.from(n).filter(n => R(n, 'tox-checklist'))
      .bind(jn)
      .map((n) => {
        'li' === w(n) && jn(n).exists(n => 'ul' === w(n)) && A(n, 'tox-checklist--hidden');
      }),
    n;
  }
  function Hn(n) {
    n.on('ListMutation', (n) => {
      const e = H.from(n.element).map(Cn.fromDom);
      'IndentList' === n.action || 'OutdentList' === n.action ? e.map(zn).map(n => O((function (n, e) {
        return V(e, n);
      }(n, 'ul')), n => zn(n))) : 'ToggleUlList' !== n.action && 'ToggleOlList' !== n.action && 'ToggleDLList' !== n.action || e.filter(Yn).map((n) => {
        _(n, 'tox-checklist'),
        O(In(n), n => _(n, 'tox-checklist--checked'));
      });
    });
  }
  function Wn(n) {
    n.on('init', () => {
      !(function (n, e) {
        return $(n, e) ? H.from(n[e]) : H.none();
      }(n.plugins, 'lists')).isNone() || n.windowManager.alert('Please use the Checklist Plugin together with the Lists plugin.');
    }),
    Hn(n),
    Fn(n),
    (function (e) {
      e.shortcuts.add('meta+13', 'Check checklist item', () => {
        const n = e.selection.getSelectedBlocks();
        O(n, (n) => {
          const e = Cn.fromDom(n);
          Xn(e) && Vn(e);
        });
      });
    }(n)),
    (function (r) {
      const t = sn(H.none());
      r.on('mousedown touchstart', (n) => {
        const e = Cn.fromDom(n.target);
        !(function (e, n) {
          return n.exists(n => 'touchstart' === n.type && 'mousedown' === e.type && e.timeStamp - n.timeStamp < 250);
        }(n, t.get())) && qn(e, (function (n) {
          return (function (n) {
            return 'touchstart' === n.type;
          }(n)) ? n.touches[0].clientX : n.clientX;
        }(n))) && (t.set(H.some(n)),
        r.undoManager.transact(() => {
          n.preventDefault(),
          Vn(e);
        }));
      });
    }(n));
  }
  var Gn = function (r, t) {
    return {
      left: d(r),
      top: d(t),
      translate(n, e) {
        return Gn(r + n, t + e);
      }
    };
  };
  var $n = Gn;
  var Kn = function (n) {
    const e = n.dom();
    const r = e.ownerDocument.body;
    return r === e ? $n(r.offsetLeft, r.offsetTop) : (function (n) {
      const e = un(n) ? n.dom().parentNode : n.dom();
      return null != e && e.ownerDocument.body.contains(e);
    }(n)) ? (function (n) {
        const e = n.getBoundingClientRect();
        return $n(e.left, e.top);
      }(e)) : $n(0, 0);
  };
  PluginManager.add('cherry-checklist', Wn);
};
