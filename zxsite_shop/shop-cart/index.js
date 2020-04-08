var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t;
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
}, app = getApp(), common = require("../../utils/common.js"), util = require("../../utils/util.js");

Page({
    data: {
        goodsList: {
            shopName: "",
            saveHidden: !0,
            totalPrice: 0,
            allSelect: !0,
            noSelect: !1,
            list: []
        },
        delBtnWidth: 120
    },
    getEleWidth: function(t) {
        try {
            var e = wx.getSystemInfoSync().windowWidth, i = 375 / (t / 2);
            return Math.floor(e / i);
        } catch (t) {
            return !1;
        }
    },
    initEleWidth: function() {
        var t = this.getEleWidth(this.data.delBtnWidth);
        this.setData({
            delBtnWidth: t
        });
    },
    onLoad: function() {
        this.initEleWidth(), this.onShow();
        var i = this;
        common.getSettings(function(t) {
            common.setCustomNavigationBar(t), common.setCustomTabBar(i, t);
            var e = i.data.goodsList;
            e.tabBarExist = i.data.tabBarExist, i.setData({
                goodsList: e
            }), t && i.setData({
                themeColor: t.theme_color ? t.theme_color : "#f44",
                backgroundColor: t.background_color ? t.background_color : "#f8f8f8"
            });
        });
    },
    onShow: function() {
        var t = [], e = wx.getStorageSync("shopCarInfo");
        e && e.shopList && (t = e.shopList), this.data.goodsList.list = t, this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), t), 
        common.updateTabBarCartBadge();
    },
    toIndexPage: function() {
        wx.reLaunch({
            url: "/zxsite_shop/index/index"
        });
    },
    touchS: function(t) {
        1 == t.touches.length && this.setData({
            startX: t.touches[0].clientX
        });
    },
    touchM: function(t) {
        var e = t.currentTarget.dataset.index;
        if (1 == t.touches.length) {
            var i = t.touches[0].clientX, a = this.data.startX - i, s = this.data.delBtnWidth, o = "";
            0 == a || a < 0 ? o = "margin-left:0px" : 0 < a && (o = "margin-left:-" + a + "px", 
            s <= a && (o = "left:-" + s + "px"));
            var n = this.data.goodsList.list;
            "" != e && null != e && (n[parseInt(e)].left = o, this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), n));
        }
    },
    touchE: function(t) {
        var e = t.currentTarget.dataset.index;
        if (1 == t.changedTouches.length) {
            var i = t.changedTouches[0].clientX, a = this.data.startX - i, s = this.data.delBtnWidth, o = s / 2 < a ? "margin-left:-" + s + "px" : "margin-left:0px", n = this.data.goodsList.list;
            "" !== e && null != e && (n[parseInt(e)].left = o, this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), n));
        }
    },
    delItem: function(t) {
        var e = t.currentTarget.dataset.index, i = this.data.goodsList.list;
        i.splice(e, 1), this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), i);
    },
    selectTap: function(t) {
        var e = t.currentTarget.dataset.index, i = this.data.goodsList.list;
        "" !== e && null != e && (i[parseInt(e)].active = !i[parseInt(e)].active, this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), i));
    },
    totalPrice: function() {
        for (var t = this.data.goodsList.list, e = 0, i = 0; i < t.length; i++) {
            var a = t[i];
            a.active && (e += parseFloat(a.price) * a.number);
        }
        return e = parseFloat(e).toFixed(2);
    },
    allSelect: function() {
        for (var t = this.data.goodsList.list, e = !1, i = 0; i < t.length; i++) {
            if (!t[i].active) {
                e = !1;
                break;
            }
            e = !0;
        }
        return e;
    },
    noSelect: function() {
        for (var t = this.data.goodsList.list, e = 0, i = 0; i < t.length; i++) {
            t[i].active || e++;
        }
        return e == t.length;
    },
    setGoodsList: function(t, e, i, a, s) {
        var o = {
            shopName: wx.getStorageSync("settings").shop_name,
            saveHidden: t,
            totalPrice: e,
            allSelect: i,
            noSelect: a,
            list: s
        }, n = wx.getStorageSync("settings");
        util.isEmpty(n.theme_color) || (o.themeColor = n.theme_color), this.setData({
            goodsList: o
        });
        var r = {}, l = 0;
        r.shopList = s;
        for (var d = 0; d < s.length; d++) l += s[d].number;
        r.shopNum = l, wx.setStorage({
            key: "shopCarInfo",
            data: r,
            success: function() {
                common.updateTabBarCartBadge();
            }
        });
    },
    bindAllSelect: function() {
        var t = this.data.goodsList.allSelect, e = this.data.goodsList.list;
        if (t) for (var i = 0; i < e.length; i++) {
            e[i].active = !1;
        } else for (i = 0; i < e.length; i++) {
            e[i].active = !0;
        }
        this.setGoodsList(this.getSaveHide(), this.totalPrice(), !t, this.noSelect(), e);
    },
    jiaBtnTap: function(t) {
        var e = t.currentTarget.dataset.index, i = this.data.goodsList.list;
        "" !== e && null != e && (i[parseInt(e)].number++, this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), i));
    },
    jianBtnTap: function(t) {
        var e = t.currentTarget.dataset.index, i = this.data.goodsList.list;
        "" !== e && null != e && 1 < i[parseInt(e)].number && (i[parseInt(e)].number--, 
        this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), i));
    },
    numberChangeTap: function(t) {
        if (!util.isEmpty(t.detail.value)) {
            var e = 0 == parseInt(t.detail.value) ? 1 : parseInt(t.detail.value), i = t.currentTarget.dataset.index, a = this.data.goodsList.list;
            "" !== i && null != i && (a[parseInt(i)].number = e, this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), a));
        }
    },
    blurNumber: function(t) {
        if (util.isEmpty(t.detail.value)) {
            var e = t.currentTarget.dataset.index, i = this.data.goodsList.list;
            "" !== e && null != e && (i[parseInt(e)].number = 1, this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), i));
        }
    },
    editTap: function() {
        for (var t = this.data.goodsList.list, e = 0; e < t.length; e++) {
            t[e].active = !1;
        }
        this.setGoodsList(!this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), t);
    },
    saveTap: function() {
        for (var t = this.data.goodsList.list, e = 0; e < t.length; e++) {
            t[e].active = !0;
        }
        this.setGoodsList(!this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), t);
    },
    getSaveHide: function() {
        return this.data.goodsList.saveHidden;
    },
    deleteSelected: function() {
        var t = this.data.goodsList.list;
        t = t.filter(function(t) {
            return !t.active;
        }), this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), t);
    },
    toPayOrder: function() {
        var i = this;
        if (!this.data.goodsList.noSelect) {
            var a = [], t = wx.getStorageSync("shopCarInfo");
            if (t && t.shopList && (a = t.shopList.filter(function(t) {
                return t.active;
            })), 0 != a.length) for (var s = !1, o = 0, n = a.length, e = function(t) {
                if (s) return {
                    v: void 0
                };
                var e = a[t];
                util.isEmpty(e.propertyIds) ? app.util.request({
                    url: "entry/wxapp/goods-detail",
                    data: {
                        id: e.id
                    },
                    success: function(t) {
                        return !util.isEmpty(t.data.data.properties) && 0 < t.data.data.properties.length ? (wx.showToast({
                            title: t.data.data.title + " 商品已失效，请重新购买",
                            icon: "none",
                            duration: 2e3
                        }), void (s = !0)) : t.data.data.stores < e.number ? (wx.showToast({
                            title: t.data.data.title + " 库存不足，请重新购买",
                            icon: "none",
                            duration: 2e3
                        }), void (s = !0)) : t.data.data.price != e.price ? (wx.showToast({
                            title: t.data.data.title + " 价格有调整，请重新购买",
                            icon: "none",
                            duration: 2e3
                        }), void (s = !0)) : void (n == ++o && i.navigateToPayOrder());
                    }
                }) : app.util.request({
                    url: "entry/wxapp/goods-price",
                    data: {
                        id: e.id,
                        property_ids: e.propertyIds
                    },
                    success: function(t) {
                        return t.data.data.stores < e.number ? (wx.showToast({
                            title: e.title + " 库存不足，请重新购买",
                            icon: "none",
                            duration: 2e3
                        }), void (s = !0)) : t.data.data.price != e.price ? (wx.showToast({
                            title: e.title + " 价格有调整，请重新购买",
                            icon: "none",
                            duration: 2e3
                        }), void (s = !0)) : void (n == ++o && i.navigateToPayOrder());
                    }
                });
            }, r = 0; r < a.length; r++) {
                var l = e(r);
                if ("object" === (void 0 === l ? "undefined" : _typeof(l))) return l.v;
            }
        }
    },
    navigateToPayOrder: function() {
        wx.navigateTo({
            url: "/zxsite_shop/to-pay-order/index"
        });
    }
});