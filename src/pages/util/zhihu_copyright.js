//
 {
   1156: function(e, t, n) {
  "use strict";
  function a(e) {
      var t = (/mac os x/i.test(navigator.userAgent) ? "⌘" : "Ctrl") + "+C";
      return e.replace(/#{\s*key\s*}/g, t)
  }
  function r(e, t) {
      var n, r, s, l, u, c, d = !1;
      t || (t = {}),
      n = t.debug || !1;
      try {
          s = o(),
          l = document.createRange(),
          u = document.getSelection(),
          c = document.createElement("span"),
          c.textContent = e,
          c.style.all = "unset",
          c.style.position = "fixed",
          c.style.top = 0,
          c.style.clip = "rect(0, 0, 0, 0)",
          c.style.whiteSpace = "pre",
          c.style.webkitUserSelect = "text",
          c.style.MozUserSelect = "text",
          c.style.msUserSelect = "text",
          c.style.userSelect = "text",
          document.body.appendChild(c),
          l.selectNode(c),
          u.addRange(l);
          if (!document.execCommand("copy"))
              throw new Error("copy command was unsuccessful");
          d = !0
      } catch (o) {
          n && console.error("unable to copy using execCommand: ", o),
          n && console.warn("trying IE specific stuff");
          try {
              window.clipboardData.setData("text", e),
              d = !0
          } catch (o) {
              n && console.error("unable to copy using clipboardData: ", o),
              n && console.error("falling back to prompt"),
              r = a("message"in t ? t.message : i),
              window.prompt(r, e)
          }
      } finally {
          u && ("function" == typeof u.removeRange ? u.removeRange(l) : u.removeAllRanges()),
          c && document.body.removeChild(c),
          s()
      }
      return d
  }
  var o = n(1157)
    , i = "Copy to clipboard: #{key}, Enter";
  e.exports = r
}
}
// 工具
I = function(e) {
    function t() {
        a(this, t);
        var e = r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
        return e.state = {
                tipShown: !1,
                tipContent: "",
                tipX: 0,
                tipY: 0,
                tipPosition: "bottom"
            },
            e.handleMouseDown = e.handleMouseDown.bind(e),
            e.handleCopy = e.handleCopy.bind(e),
            e.handleTipClose = e.handleTipClose.bind(e),
            e.rightClickX = -1,
            e.rightClickY = -1,
            e
    }
    return o(t, e),
        R(t, [{
            key: "getRange",
            value: function(e) {
                if (e && e.rangeCount > 0)
                    return e.getRangeAt(0)
            }
        }, {
            key: "getExtraCopyright",
            value: function(e, t, n) {
                var a = ["作者：" + t, "链接：" + e, "来源：知乎", "著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。"],
                    r = ["", ""];
                return a = n ? a.concat(r) : r.concat(a)
            }
        }, {
            key: "getCopyText",
            value: function(e, t, n, a) {
                var r = this.getExtraCopyright(t, n, a).join("\n");
                return a ? r + e : e + r
            }
        }, {
            key: "getRangeHtml",
            value: function(e) {
                var t = document.createElement("div");
                return t.appendChild(e.cloneContents()),
                    t.outerHTML
            }
        }, {
            key: "getCopyHtml",
            value: function(e, t, n, a) {
                var r = this.getExtraCopyright(t, n, a).join("<br />");
                return "<div>" + (a ? r + e : e + r) + "</div>"
            }
        }, {
            key: "randomRange",
            value: function(e, t) {
                return Math.floor(Math.random() * (t - e) + e)
            }
        }, {
            key: "addCopyright",
            value: function(e, t, n) {
                if (window.getSelection) {
                    var a = window.getSelection(),
                        r = this.getRange(a),
                        o = r.toString().trim(),
                        i = this.getRangeHtml(r);
                    if (o && !(o.length < 128)) {
                        var s = o.length >= 512,
                            l = this.getCopyHtml(i, t, n, s),
                            u = this.getCopyText(o, t, n, s),
                            c = e.nativeEvent.clipboardData;
                        if ("object" === (void 0 === c ? "undefined" : N(c))) {
                            if (c.setData("text/html", '<meta charset="utf-8">' + l),
                                c.setData("text/plain", u),
                                c.getData("text/plain") && c.getData("text/plain").length > 0)
                                return void e.preventDefault()
                        }
                        var d = document.createElement("div");
                        d.innerHTML = l;
                        var m = d.firstChild;
                        m.style.position = "fixed",
                            m.style.left = "-9999px",
                            document.body.appendChild(m),
                            a.selectAllChildren(m),
                            setTimeout(function() {
                                document.body.removeChild(m),
                                    a.removeAllRanges(),
                                    a.addRange(r)
                            }, 200)
                    }
                }
            }
        }, {
            key: "showTip",
            value: function(e, t) {
                if (window.getSelection) {
                    var n = window.getSelection(),
                        a = this.getRange(n),
                        r = a.toString().trim(),
                        o = this.randomRange(44, 66);
                    if (!(r.length <= o)) {
                        e.preventDefault(),
                            e.stopPropagation();
                        var i = a.getBoundingClientRect(),
                            s = window.pageYOffset,
                            l = this.rightClickX,
                            u = this.rightClickY,
                            c = void 0,
                            d = "bottom";
                        if (-1 !== u)
                            c = u + 3;
                        else {
                            var m = this.props.viewPort,
                                p = i.top + s,
                                f = i.bottom + s,
                                h = s + m.top + 52,
                                _ = s + m.bottom - 52;
                            f < h ? c = h - 52 : f < _ ? c = f : (d = "top",
                                c = p > h && p < _ ? p : _ + 52)
                        }
                        var y = -1 !== l ? l + 3 : i.left + (i.right - i.left) / 2 - 12;
                        this.setState({
                                tipShown: !0,
                                tipContent: t,
                                tipX: y,
                                tipY: c,
                                tipPosition: d
                            }),
                            this.rightClickX = -1,
                            this.rightClickY = -1
                    }
                }
            }
        }, {
            key: "handleTipClose",
            value: function() {
                this.setState({
                    tipShown: !1
                })
            }
        }, {
            key: "handleCopy",
            value: function(e) {
                var t = this.context.currentUser,
                    n = this.props.data,
                    a = n.author,
                    r = n.type,
                    o = n.id,
                    i = n.question,
                    s = n.reshipmentSettings,
                    l = n.relationship;
                l = void 0 === l ? {} : l;
                var u = l.isAuthorized,
                    c = "";
                if ("article" === r ? c = "https://zhuanlan.zhihu.com/p/" + o : "answer" === r && (c = "https://www.zhihu.com/question/" + i.id + "/answer/" + o), !t || t.urlToken !== a.urlToken)
                    switch (s) {
                        case "disallowed":
                            this.showTip(e, v.a.createElement("a", {
                                href: "https://www.zhihu.com/terms#sec-licence-6"
                            }, "禁止转载"));
                            break;
                        case "need_payment":
                            if (!u) {
                                this.showTip(e, v.a.createElement("a", {
                                    href: "https://www.zhihu.com/copyright/apply?answer=" + o
                                }, "申请转载"));
                                break
                            }
                            this.showTip(e, "已获授权，复制成功");
                        default:
                            this.addCopyright(e, c, a.name)
                    }
            }
        }, {
            key: "handleMouseDown",
            value: function(e) {
                3 === e.nativeEvent.which && (this.rightClickX = e.pageX,
                    this.rightClickY = e.pageY)
            }
        }, {
            key: "render",
            value: function() {
                var e = this.props,
                    t = e.onRef,
                    n = e.tag,
                    a = e.html,
                    r = e.children,
                    o = e.onClick,
                    i = e.className,
                    s = e.itemProp,
                    l = e.style,
                    u = e.prefix,
                    c = this.state,
                    d = c.tipShown,
                    m = c.tipContent,
                    p = c.tipX,
                    f = c.tipY,
                    h = c.tipPosition;
                return v.a.createElement("div", {
                    ref: t,
                    onClick: o,
                    className: i,
                    style: l
                }, u, v.a.createElement(H.a, {
                    itemProp: s,
                    tag: n,
                    html: a,
                    onCopy: this.handleCopy,
                    onMouseDown: this.handleMouseDown,
                    className: "CopyrightRichText-richText"
                }), r, v.a.createElement(x.a, {
                    shown: d,
                    timeout: 1e4,
                    hideOnClick: !0,
                    onClose: this.handleTipClose,
                    x: p,
                    y: f,
                    position: h,
                    content: m,
                    className: "CopyrightRichText-tooltip"
                }))
            }
        }]),
        t
}(y.Component);