var app = getApp(), common = require("../../utils/common.js"), util = require("../../utils/util.js");

Page({
    data: {
        themeColor: "",
        remind: "加载中",
        angle: 0,
        diyPage: {},
        canIUse: wx.canIUse("open-data")
    },
    onLoad: function(t) {
        var i = this;
        util.isEmpty(t.url) ? common.getUserInfo(function(t) {
            t ? wx.redirectTo({
                url: "/zxsite_shop/index/index"
            }) : i.data.url = "/zxsite_shop/index/index";
        }) : (this.data.url = t.url, t.id && (this.data.id = t.id), t.uid && (this.data.uid = t.uid), 
        t.status && (this.data.status = t.status), t.seckill_id && (this.data.seckill_id = t.seckill_id), 
        t.seckillDate && (this.data.seckillDate = t.seckillDate), t.time && (this.data.time = t.time), 
        t.groupsOrderId && (this.data.groupsOrderId = t.groupsOrderId), t.agent_id && (this.data.agent_id = t.agent_id)), 
        common.getSettings(function(e) {
            common.setCustomNavigationBar(e), app.util.request({
                url: "entry/wxapp/diy-page",
                data: {
                    type: 3
                },
                showLoading: !1,
                success: function(t) {
                    var a = e.shop_name;
                    t.data.data ? (i.setData({
                        diyPage: t.data.data,
                        themeColor: e.theme_color ? e.theme_color : "#f44",
                        backgroundColor: t.data.data.background_color ? t.data.data.background_color : e.theme_color,
                        backgroundImage: t.data.data.share_image ? t.data.data.share_image : ""
                    }), wx.setNavigationBarColor({
                        frontColor: "black" == t.data.data.title_bar_color ? "#000000" : "#ffffff",
                        backgroundColor: t.data.data.title_bar_background_color ? t.data.data.title_bar_background_color : "#f8f8f8"
                    }), t.data.data.title && (a = t.data.data.title)) : i.setData({
                        themeColor: e.theme_color ? e.theme_color : "#f44"
                    }), wx.setNavigationBarTitle({
                        title: a
                    });
                }
            });
        });
    },
    onReady: function() {
        var e = this;
        setTimeout(function() {
            e.setData({
                remind: ""
            });
        }, 1e3), wx.onAccelerometerChange(function(t) {
            var a = -(30 * t.x).toFixed(1);
            14 < a ? a = 14 : a < -14 && (a = -14), e.data.angle !== a && e.setData({
                angle: a
            });
        });
    },
    updateUserInfo: function(t) {
        var e = this;
        -1 < t.detail.errMsg.indexOf("ok") ? app.util.getUserInfo(function(t) {
            var a = e.data.url + "?id=" + e.data.id;
            util.isEmpty(e.data.uid) || (a += "&uid=" + e.data.uid), util.isEmpty(e.data.status) || (a += "&status=" + e.data.status), 
            util.isEmpty(e.data.seckillDate) || (a += "&seckillDate=" + e.data.seckillDate), 
            util.isEmpty(e.data.seckill_id) || (a += "&seckill_id=" + e.data.seckill_id), util.isEmpty(e.data.time) || (a += "&time=" + e.data.time), 
            util.isEmpty(e.data.groupsOrderId) || (a += "&groupsOrderId=" + e.data.groupsOrderId), 
            util.isEmpty(e.data.agent_id) || (a += "&agent_id=" + e.data.agent_id), wx.redirectTo({
                url: a
            });
        }, t.detail) : wx.showToast({
            title: wx.getStorageSync("settings").shop_name + "仅需要您的公开信息（昵称、头像），请放心授权",
            icon: "none",
            duration: 3e3
          }), wx.redirectTo({
            url: "/zxsite_shop/index/index"
          });
    }
});