var app = getApp(), common = require("../../utils/common.js"), util = require("../../utils/util.js");

Page({
    data: {
        themeColor: "#f44",
        backgroundColor: "#f8f8f8",
        rechargeList: []
    },
    onLoad: function(e) {
        var t = this;
        common.getUserInfo(function(e) {
            e ? (common.getSettings(function(e) {
                common.setCustomNavigationBar(e), common.setCustomTabBar(t, e), t.setData({
                    themeColor: e.theme_color ? e.theme_color : "#f44",
                    backgroundColor: e.background_color ? e.background_color : "#f8f8f8",
                    banner: e.recharge_banner
                });
            }), app.util.request({
                url: "entry/wxapp/recharge-list",
                cachetime: "30",
                success: function(e) {
                    t.setData({
                        rechargeList: e.data.data
                    });
                }
            })) : wx.redirectTo({
                url: "/zxsite_shop/start/start?url=/zxsite_shop/recharge/index"
            });
        });
    },
    rechargeSelect: function(e) {
        this.setData({
            selectIndex: e.currentTarget.dataset.index
        });
    },
    toRecharge: function() {
        var e = this;
        e.data.hasOwnProperty("selectIndex") ? app.util.request({
            url: "entry/wxapp/recharge-order-create",
            data: {
                amount: e.data.rechargeList[e.data.selectIndex].enough
            },
            method: "POST",
            success: function(e) {
                var t = e.data.data.id;
                app.util.request({
                    url: "entry/wxapp/recharge-order-pay",
                    data: {
                        id: t
                    },
                    success: function(e) {
                        e.data && e.data.data && wx.requestPayment({
                            timeStamp: e.data.data.timeStamp,
                            nonceStr: e.data.data.nonceStr,
                            package: e.data.data.package,
                            signType: e.data.data.signType,
                            paySign: e.data.data.paySign,
                            success: function(e) {
                                wx.showToast({
                                    title: "充值成功",
                                    icon: "success",
                                    duration: 2e3
                                }), setTimeout(function() {
                                    wx.navigateBack();
                                }, 2e3), app.util.request({
                                    url: "entry/wxapp/payment-result",
                                    data: {
                                        id: t,
                                        type: "recharge"
                                    }
                                });
                            },
                            fail: function(e) {
                                "requestPayment:fail cancel" != e.errMsg && wx.showModal({
                                    title: "提示",
                                    content: "支付失败，错误信息:" + e.errMsg,
                                    showCancel: !1
                                });
                            }
                        });
                    }
                });
            }
        }) : wx.showToast({
            title: "请选择充值金额",
            icon: "none",
            duration: 3e3
        });
    },
    toBalanceLog: function() {
        wx.navigateTo({
            url: "/zxsite_shop/balance-log/index"
        });
    },
    toRechargeOrder: function() {
        wx.navigateTo({
            url: "/zxsite_shop/my-recharge/index"
        });
    }
});