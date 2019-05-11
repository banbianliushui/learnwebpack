/** 
 * 1. color.less  <link rel="stylesheet/less" type="text/css" href="/color.less">
 * 2.如果切换默认色，加载less如果没加载（https://cdnjs.cloudflare.com/ajax/libs/less.js/3.9.0/less.js）
 * 
 *  Object(l.loadScript)("https://gw.alipayobjects.com/os/lib/less.js/3.8.1/less.min.js").then(function() {
                    n.lessLoaded = !0,
                    t()
                }))
var t = function() {
                    var t = n.props.intl.messages;
                    window.less.modifyVars({
                        "@primary-color": e
                    }).then(function() {
                        a.Icon.setTwoToneColor({
                            primaryColor: e
                        }),
                        a.message.success(t["app.footer.primary-color-changed"]),
                        n.setState({
                            color: e
                        })
                    })
                };
    3.用变量去初始化color.less 中的样式
 *  */
