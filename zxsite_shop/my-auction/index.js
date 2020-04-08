var app = getApp(), common = require("../../utils/common.js"), util = require("../../utils/util.js");

Page({
    data: {
        themeColor: "#f44",
        backgroundColor: "#f8f8f8",
        statusType: [ "全部", "待付款", "拍卖中", "未拍中", "已拍中", "已完成" ],
        currentType: 0,
        tabClass: [ "", "", "", "", "", "" ],
        textAuction: "拍卖",
        textProcess: "拍卖中",
        textFail: "未拍中",
        textSuccess: "已拍中",
        textDeposit: "保证金"
    },
    statusTap: function(t) {
        var a = t.currentTarget.dataset.index;
        this.data.currentType = a, this.setData({
            currentType: a
        }), this.onShow();
    },
    toPayTap: function(t) {
        var a = this, e = t.currentTarget.dataset.id;
        app.util.request({
            url: "entry/wxapp/auction-order-pay",
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
                                type: "auction"
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
        });
    },
    toPlaceOrderTap: function(t) {
        wx.navigateTo({
            url: "/zxsite_shop/auction-details/index?id=" + t.currentTarget.dataset.auctionId + "&auction_order_id=" + t.currentTarget.dataset.id
        });
    },
    onLoad: function(a) {
        var e = this;
        common.getUserInfo(function(t) {
            t ? (common.getSettings(function(t) {
                common.setCustomNavigationBar(t), common.setCustomTabBar(e, t), e.setData({
                    themeColor: t.theme_color ? t.theme_color : "#f44",
                    backgroundColor: t.background_color ? t.background_color : "#f8f8f8",
                    textAuction: t.auction_text ? t.auction_text : "拍卖",
                    textProcess: t.auction_text_process ? t.auction_text_process : "拍卖中",
                    textFail: t.auction_text_fail ? t.auction_text_fail : "未拍中",
                    textSuccess: t.auction_text_success ? t.auction_text_success : "已拍中",
                    textDeposit: t.auction_text_deposit ? t.auction_text_deposit : "保证金",
                    statusType: [ "全部", "待付款", t.auction_text_process ? t.auction_text_process : "拍卖中", t.auction_text_fail ? t.auction_text_fail : "未拍中", t.auction_text_success ? t.auction_text_success : "已拍中", "已完成" ]
                }), wx.setNavigationBarTitle({
                    title: "我的" + e.data.textAuction
                });
            }), util.isEmpty(a.currentType) || this.setData({
                currentType: a.currentType
            })) : wx.redirectTo({
                url: "/zxsite_shop/start/start?url=/zxsite_shop/my-auction/index"
            });
        });
    },
    onReady: function() {},
    getOrderList: function() {
        wx.showLoading();
        this.data.defaultFilmingTime;
        var a = this, t = {};
        0 < a.data.currentType && (t.status = a.data.currentType), app.util.request({
            url: "entry/wxapp/auction-order-list",
            data: t,
            success: function(t) {
                wx.hideLoading(), 0 < t.data.data.order.length ? a.setData({
                    orderList: t.data.data.order,
                    currentTime: t.data.data.time
                }) : a.setData({
                    orderList: null
                });
            }
        });
    },
    getOrderStatistics: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/auction-order-statistics",
            success: function(t) {
                var a = e.data.tabClass;
                0 < t.data.data.count_no_pay ? a[1] = "red-dot" : a[1] = "", 0 < t.data.data.count_process ? a[2] = "red-dot" : a[2] = "", 
                0 < t.data.data.count_fail ? a[3] = "red-dot" : a[3] = "", 0 < t.data.data.count_win ? a[4] = "red-dot" : a[4] = "", 
                0 < t.data.data.count_done ? a[5] = "red-dot" : a[5] = "", e.setData({
                    tabClass: a
                });
            }
        });
    },
    gotoAuctionDetail: function(t) {
        wx.navigateTo({
            url: "/zxsite_shop/auction-details/index?id=" + t.currentTarget.dataset.auctionId
        });
    },
    onShow: function() {
        wx.getStorageSync("userInfo") ? (this.getOrderList(), this.getOrderStatistics()) : wx.redirectTo({
            url: "/zxsite_shop/start/start?url=/zxsite_shop/my-auction/index&type=redirect"
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});