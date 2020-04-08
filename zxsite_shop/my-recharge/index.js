var app = getApp(), common = require("../../utils/common.js"), util = require("../../utils/util.js");

Page({
    data: {
        themeColor: "#f44",
        backgroundColor: "#f8f8f8",
        page: 1,
        total: 1,
        orderList: [],
        loadingMoreHidden: !0
    },
    cancelOrderTap: function(t) {
        var a = this, e = t.currentTarget.dataset.id;
        wx.showModal({
            title: "确定要取消该订单吗？",
            content: "",
            success: function(t) {
                t.confirm && app.util.request({
                    url: "entry/wxapp/recharge-order-status",
                    data: {
                        order_id: e,
                        status: 0
                    },
                    success: function(t) {
                        a.onShow();
                    }
                });
            }
        });
    },
    toPayTap: function(t) {
        var a = this, e = t.currentTarget.dataset.id;
        0 < t.currentTarget.dataset.money ? app.util.request({
            url: "entry/wxapp/recharge-order-pay",
            data: {
                id: e
            },
            success: function(t) {
                t.data && t.data.data && wx.requestPayment({
                    timeStamp: t.data.data.timeStamp,
                    nonceStr: t.data.data.nonceStr,
                    package: t.data.data.package,
                    signType: t.data.data.signType,
                    paySign: t.data.data.paySign,
                    success: function(t) {
                        app.util.request({
                            url: "entry/wxapp/payment-result",
                            data: {
                                id: e,
                                type: "recharge"
                            }
                        });
                    },
                    fail: function(t) {
                        "requestPayment:fail cancel" != t.errMsg && wx.showModal({
                            title: "提示",
                            content: "支付失败，错误信息:" + t.errMsg,
                            showCancel: !1,
                            complete: function() {
                                a.onShow();
                            }
                        });
                    }
                });
            }
        }) : app.util.request({
            url: "entry/wxapp/recharge-order-status",
            data: {
                order_id: e,
                status: 2
            },
            success: function(t) {
                a.onShow();
            }
        });
    },
    onLoad: function(t) {
        var a = this;
        common.getUserInfo(function(t) {
            t ? common.getSettings(function(t) {
                common.setCustomNavigationBar(t), common.setCustomTabBar(a, t), a.setData({
                    themeColor: t.theme_color ? t.theme_color : "#f44",
                    backgroundColor: t.background_color ? t.background_color : "#f8f8f8"
                });
            }) : wx.redirectTo({
                url: "/zxsite_shop/start/start?url=/zxsite_shop/my-recharge/index"
            });
        });
    },
    onReady: function() {},
    getOrderList: function(a) {
        var e = this, o = this.data.orderList;
        a <= this.data.total ? app.util.request({
            url: "entry/wxapp/recharge-order-list",
            data: {
                page: a
            },
            success: function(t) {
                0 < t.data.data.total ? (o = 1 < a ? o.concat(t.data.data.list) : t.data.data.list, 
                e.setData({
                    orderList: o,
                    page: parseInt(a) + 1,
                    total: t.data.data.total
                })) : e.setData({
                    orderList: null
                }), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            }
        }) : e.setData({
            loadingMoreHidden: !1
        });
    },
    onShow: function() {
        this.getOrderList(1);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        this.getOrderList(1);
    },
    onReachBottom: function() {
        this.getOrderList(this.data.page);
    }
});