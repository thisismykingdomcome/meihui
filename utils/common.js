var _util = require("util"), _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(t) {
    return t && t.__esModule ? t : {
        default: t
    };
}

function updateTabBarCartBadge() {
    var t = wx.getStorageSync("shopCarInfo");
    0 < t.shopNum ? wx.setTabBarBadge({
        index: 2,
        text: parseInt(t.shopNum).toString()
    }) : wx.removeTabBarBadge({
        index: 2
    });
}

function setCustomNavigationBar(t) {
    if (t) {
        var e = _util2.default.isEmpty(t.navigation_bar_text_style) ? "#000000" : t.navigation_bar_text_style, a = _util2.default.isEmpty(t.navigation_bar_background_color) ? "#ffffff" : t.navigation_bar_background_color;
        "#ffffff" == e && "#ffffff" == a || wx.setNavigationBarColor({
            frontColor: e,
            backgroundColor: a
        });
    }
}

function setCustomTabBar(t, e, a) {
    var f = t, o = getApp().tabBar;
    if (e) if (_util2.default.isEmpty(e.tab_bar_color) || (o.color = e.tab_bar_color), 
    _util2.default.isEmpty(e.tab_bar_selected_color) || (o.selectedColor = e.tab_bar_selected_color), 
    _util2.default.isEmpty(e.tab_bar_border_style) || (o.borderStyle = e.tab_bar_border_style), 
    _util2.default.isEmpty(e.tab_bar_background_color) || (o.backgroundColor = e.tab_bar_background_color), 
    0 < e.tab_bar.length) o.list = e.tab_bar; else {
        for (var r = [ "000000", "434343", "666666", "b7b7b7", "cccccc", "d9d9d9", "efefef", "f3f3f3", "ffffff", "980000", "ff0000", "ff9900", "ffff00", "00ff00", "00ffff", "4a86e8", "0000ff", "9900ff", "ff00ff", "e6b8af", "f4cccc", "fce5cd", "fff2cc", "d9ead3", "d0e0e3", "c9daf8", "cfe2f3", "d9d2e9", "ead1dc", "dd7e6b", "ea9999", "f9cb9c", "ffe599", "b6d7a8", "a2c4c9", "a4c2f4", "9fc5e8", "b4a7d6", "d5a6bd", "cc4125", "e06666", "f6b26b", "ffd966", "93c47d", "76a5af", "6d9eeb", "6fa8dc", "8e7cc3", "c27ba0", "a61c00", "cc0000", "e69138", "f1c232", "6aa84f", "45818e", "3c78d8", "3c78d8", "0c343d", "1c4587", "3d85c6", "4c1130", "5b0f00", "7f6000", "134f5c", "274e13", "351c75", "674ea7", "741b47", "783f04", "1155cc", "20124d", "38761d", "073763", "85200c", "660000", "990000", "a64d79", "b45f06", "bf9000" ], c = o.color.slice(1), n = !1, i = 0; i < r.length; ++i) if (c === r[i]) {
            n = !0;
            break;
        }
        var s = o.selectedColor.slice(1), l = !1;
        for (i = 0; i < r.length; ++i) if (s === r[i]) {
            l = !0;
            break;
        }
        var d = n ? "/images/nav/theme/" + c : "/images/nav", u = l ? "/images/nav/theme/" + s : "/images/nav";
        o.list = [ {
            pagePath: "/zxsite_shop/index/index",
            iconPath: d + "/home-off.png",
            selectedIconPath: u + "/home-on.png",
            text: "首页"
        }, {
            pagePath: "/zxsite_shop/goods-category/index",
            iconPath: d + "/category-off.png",
            selectedIconPath: u + "/category-on.png",
            text: "分类"
        }, {
            pagePath: "/zxsite_shop/shop-cart/index",
            iconPath: d + "/cart-off.png",
            selectedIconPath: u + "/cart-on.png",
            text: "购物车"
        }, {
            pagePath: "/zxsite_shop/my/index",
            iconPath: d + "/my-off.png",
            selectedIconPath: u + "/my-on.png",
            text: "我的"
        } ];
    }
    var g = !1, b = _util2.default.isEmpty(a) ? f.__route__ : a;
    for (var _ in o.list) o.list[_].pageUrl = _util2.default.isEmpty(a) ? o.list[_].pagePath.replace(/(\?|#)[^"]*/g, "") : o.list[_].pagePath, 
    g = g || o.list[_].pageUrl == "/" + b;
    g && f.setData({
        tabBar: o,
        "tabBar.thisurl": b,
        tabBarExist: g
    });
}

function getUserInfo(e) {
  var c = getCurrentPages();
  c = c[0].route;
  console.log(c)
  console.log(c[0].route)
    var a = wx.getStorageSync("userInfo");
  a || c == 'zxsite_shop/my/index' ? "function" == typeof e && e(a) : wx.getSetting({
        success: function(t) {
            t.authSetting["scope.userInfo"] ? getApp().util.getUserInfo(function(t) {
                "function" == typeof e && e(t);
            }) : "function" == typeof e && e(c =='zxsite_shop/my/index'?a:t);
        }
    });
}

function getSettings(e) {
    var a = _util2.default.getStorageSync("settings");
    a ? "function" == typeof e && e(a) : getApp().util.request({
        url: "entry/wxapp/settings",
        data: {
            m: "zxsite_shop"
        },
        success: function(t) {
            a = t.data.data, _util2.default.setStorageSync("settings", a), "function" == typeof e && e(a);
        },
        fail: function(t) {
            wx.showModal({
                title: "系统信息",
                content: t.errMsg,
                showCancel: !1
            });
        }
    });
}

module.exports = {
    updateTabBarCartBadge: updateTabBarCartBadge,
    setCustomNavigationBar: setCustomNavigationBar,
    setCustomTabBar: setCustomTabBar,
    getUserInfo: getUserInfo,
    getSettings: getSettings
};