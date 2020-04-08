var app = getApp(), common = require("../../utils/common.js"), util = require("../../utils/util.js");

Page({
    data: {
        scrollTop: "0",
        couponList: [],
        backgroundColor: "#f8f8f8"
    },
    onLoad: function() {
        var a = this;
        common.getUserInfo(function(t) {
            t ? common.getSettings(function(t) {
                common.setCustomNavigationBar(t), common.setCustomTabBar(a, t), a.setData({
                    backgroundColor: t.background_color ? t.background_color : "#f8f8f8"
                });
            }) : wx.redirectTo({
                url: "/zxsite_shop/start/start?url=/zxsite_shop/coupon-list/index"
            });
        });
    },
    onShow: function() {
        this.getCoupon();
    },
    onPullDownRefresh: function() {
        var t = this;
        wx.showNavigationBarLoading(), setTimeout(function() {
            t.getCoupon(), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
        }, 1e3), wx.stopPullDownRefresh();
    },
    getCoupon: function() {
        var o = this;
        app.util.request({
            url: "entry/wxapp/coupon-list",
            success: function(t) {
                for (var a = 0; a < t.data.data.length; ++a) util.isEmpty(t.data.data[a].get_time) && parseInt(t.data.data[a].get_limit) > parseInt(t.data.data[a].user_get_total) ? (t.data.data[a].fecth_status = "normal", 
                t.data.data[a].disabled = !1) : (t.data.data[a].fecth_status = "used", t.data.data[a].disabled = !0);
                o.setData({
                    couponList: t.data.data
                });
            }
        });
    },
    fecthCoupon: function(t) {
        var o = this, e = t.currentTarget.dataset.id;
        o.data.couponList[t.currentTarget.dataset.listindex].fecth_status = "used", o.data.couponList[t.currentTarget.dataset.listindex].disabled = !0, 
        o.setData({
            couponList: o.data.couponList
        }), app.util.request({
            url: "entry/wxapp/coupon-fetch",
            data: {
                id: e,
                form_id: t.detail.formId
            },
            success: function(t) {
                for (var a = 0; a < o.data.couponList.length; ++a) if (o.data.couponList[a].id == e) {
                    o.data.couponList[a].get_time = t.data.data.get_time;
                    break;
                }
                o.setData({
                    couponList: o.data.couponList
                });
            }
        });
    }
});