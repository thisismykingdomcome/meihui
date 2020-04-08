var app = getApp();

Page({
    data: {
        themeColor: "#f44",
        backgroundColor: "#f8f8f8",
        statusType: [ "全部", "待付款", "待使用", "待评价", "退/换货" ],
        currentType: 0,
        tabClass: [ "", "", "", "", "" ],
        requestNeed: 2,
        requestDone: 0,
        page: 1,
        total: 1,
        orderList: [],
        loadingMoreHidden: !0
    },
    statusTap: function(t) {
        var a = t.currentTarget.dataset.index;
        this.setData({
            currentType: a
        }), this.getOrderList(1), this.getOrderStatistics();
    },
    orderDetail: function(t) {
        var a = t.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/zxsite_shop/order-details/index?id=" + a
        });
    },
    cancelOrderTap: function(t) {
        var a = this, e = t.currentTarget.dataset.id;
        wx.showModal({
            title: "确定要取消该订单吗？",
            content: "",
            success: function(t) {
                t.confirm && (wx.showLoading(), app.util.request({
                    url: "entry/wxapp/order-status",
                    data: {
                        m: "zxsite_shop",
                        order_id: e,
                        status: 0
                    },
                    success: function(t) {
                        wx.hideLoading(), a.onShow();
                    }
                }));
            }
        });
    },
    toPayTap: function(t) {
        var a = this, e = t.currentTarget.dataset.id;
        0 < t.currentTarget.dataset.money ? app.util.request({
            url: "entry/wxapp/pay",
            data: {
                m: "zxsite_shop",
                id: e,
                fee: t.currentTarget.dataset.money
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
                                m: "zxsite_shop",
                                id: e,
                                type: "order"
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
            url: "entry/wxapp/order-status",
            data: {
                m: "zxsite_shop",
                order_id: e,
                status: 2
            },
            success: function(t) {
                a.onShow();
            }
        });
    },
    toShareTap: function(t) {
        wx.navigateTo({
            url: "/zxsite_shop/groups-details/index?id=" + t.currentTarget.dataset.groupsid + "&groupsOrderId=" + t.currentTarget.dataset.groupsorderid
        });
    },
    onLoad: function(a) {
        var e = this;
        app.utils.common.getUserInfo(function(t) {
            t ? (app.utils.common.getSettings(function(t) {
                app.utils.common.setCustomNavigationBar(t), app.utils.common.setCustomTabBar(e, t), 
                e.setData({
                    themeColor: t.theme_color ? t.theme_color : "#f44",
                    backgroundColor: t.background_color ? t.background_color : "#f8f8f8"
                });
            }), app.utils.util.isEmpty(a.currentType) || e.setData({
                currentType: a.currentType
            })) : wx.redirectTo({
                url: "/zxsite_shop/start/start?url=/zxsite_shop/order-list/index"
            });
        });
    },
    onReady: function() {},
    getOrderList: function(e) {
        var r = this, t = {}, o = this.data.orderList;
        0 < r.data.currentType && (t.status = 3 <= r.data.currentType ? r.data.currentType + 1 : r.data.currentType), 
        e <= this.data.total ? (t.page = e, app.util.request({
            url: "entry/wxapp/book-order-list",
            showLoading: !1,
            data: Object.assign({
                m: "zxsite_shop"
            }, t),
            success: function(t) {
                if (wx.hideLoading(), 0 < t.data.data.total) {
                    var a = t.data.data.order;
                    o = 1 < e ? o.concat(a) : a, r.setData({
                        orderList: o,
                        page: parseInt(e) + 1,
                        total: t.data.data.total
                    });
                } else r.setData({
                    orderList: null
                });
                r.data.requestDone++, r.data.requestDone >= r.data.requestNeed && (wx.hideNavigationBarLoading(), 
                wx.stopPullDownRefresh(), wx.hideLoading());
            }
        })) : r.setData({
            loadingMoreHidden: !1
        });
    },
    getOrderStatistics: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/book-order-statistics",
            data: {
                m: "zxsite_shop"
            },
            showLoading: !1,
            success: function(t) {
                var a = e.data.tabClass;
                0 < t.data.data.count_no_pay ? a[1] = "red-dot" : a[1] = "", 0 < t.data.data.count_no_transfer ? a[2] = "red-dot" : a[2] = "", 
                0 < t.data.data.count_no_reputation ? a[3] = "red-dot" : a[3] = "", 0 < t.data.data.count_refund ? a[4] = "red-dot" : a[4] = "", 
                e.setData({
                    tabClass: a
                }), e.data.requestDone++, e.data.requestDone >= e.data.requestNeed && (wx.hideNavigationBarLoading(), 
                wx.stopPullDownRefresh(), wx.hideLoading());
            }
        });
    },
    onShow: function() {
        app.util.showLoading(), this.getOrderList(1), this.getOrderStatistics();
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        app.util.showLoading(), wx.showNavigationBarLoading(), this.data.requestDone = 0, 
        this.getOrderList(1), this.getOrderStatistics();
    },
    onReachBottom: function() {
        this.data.requestDone--, this.getOrderList(this.data.page);
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
    }
});