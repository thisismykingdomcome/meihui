var app = getApp(), common = require("../../utils/common.js"), util = require("../../utils/util.js");

Page({
    data: {
        themeColor: "#f44",
        backgroundColor: "#ffffff",
        settings: []
    },
    onLoad: function() {
        var o = this;
        common.getSettings(function(t) {
            common.setCustomNavigationBar(t), common.setCustomTabBar(o, t), o.setData({
                themeColor: t.theme_color ? t.theme_color : "#f44",
                backgroundColor: t.background_color ? t.background_color : "#f8f8f8",
                settings: t
            });
        });
    },
    toTelphone: function(t) {
        wx.makePhoneCall({
            phoneNumber: t.currentTarget.dataset.content
        });
    },
    toSetClipboard: function(t) {
        wx.setClipboardData({
            data: t.currentTarget.dataset.content,
            success: function(t) {
                wx.showToast({
                    title: "复制成功",
                    icon: "success",
                    duration: 2e3
                });
            }
        });
    },
    toWebView: function(t) {
        wx.navigateTo({
            url: "/zxsite_shop/web-view/index?linkUrl=" + encodeURIComponent(t.currentTarget.dataset.content)
        });
    }
});