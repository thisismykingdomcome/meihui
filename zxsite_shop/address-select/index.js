var app = getApp(), common = require("../../utils/common.js"), util = require("../../utils/util.js");

Page({
    data: {
        addressList: [],
        backgroundColor: "#f8f8f8",
        source: ""
    },
    addAddess: function() {
        wx.navigateTo({
            url: "/zxsite_shop/address-add/index"
        });
    },
    editAddess: function(t) {
        wx.navigateTo({
            url: "/zxsite_shop/address-add/index?id=" + t.currentTarget.dataset.id
        });
    },
    onLoad: function(t) {
        var a = this;
        common.getSettings(function(t) {
            common.setCustomNavigationBar(t), common.setCustomTabBar(a, t), a.setData({
                backgroundColor: t.background_color ? t.background_color : "#f8f8f8"
            });
        }), t.source && a.setData({
            source: t.source
        });
    },
    onShow: function() {
        this.initShippingAddress();
    },
    initShippingAddress: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/shipping-list",
            success: function(t) {
                a.setData({
                    addressList: t.data.data
                });
            }
        });
    },
    radioChange: function(t) {
        var a = this;
        t.currentTarget.dataset.id;
        app.util.request({
            url: "entry/wxapp/shipping-set-default",
            data: {
                id: t.currentTarget.dataset.id
            },
            success: function(t) {
                "fillOrder" == a.data.source ? wx.navigateBack({}) : a.onShow();
            }
        });
    }
});