var app = getApp(), common = require("../../utils/common.js"), util = require("../../utils/util.js");

Page({
    data: {
        couponList: [],
        backgroundColor: "#f8f8f8"
    },
    onLoad: function() {
        var a = this;
        common.getUserInfo(function(t) {
            t ? (common.getSettings(function(t) {
                common.setCustomNavigationBar(t), common.setCustomTabBar(a, t), a.setData({
                    backgroundColor: t.background_color ? t.background_color : "#f8f8f8"
                });
            }), a.getUserCoupons()) : wx.redirectTo({
                url: "/zxsite_shop/start/start?url=/zxsite_shop/my-coupon/index"
            });
        });
    },
    getUserCoupons: function() {
        var s = this;
        app.util.request({
            url: "entry/wxapp/coupon-user",
            success: function(t) {
                for (var a = 0; a < t.data.data.length; ++a) 0 == t.data.data[a].fecth_status ? (t.data.data[a].fecth_status = "failure", 
                t.data.data[a].fecth_status_str = "已过期") : 1 == t.data.data[a].fecth_status ? (t.data.data[a].fecth_status = "normal", 
                t.data.data[a].fecth_status_str = "未使用") : 2 == t.data.data[a].fecth_status && (t.data.data[a].fecth_status = "used", 
                t.data.data[a].fecth_status_str = "已使用");
                s.setData({
                    couponList: t.data.data
                });
            }
        });
    },
    toBuy: function() {
        wx.reLaunch({
            url: "/zxsite_shop/index/index"
        });
    }
});