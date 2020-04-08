var app = getApp(), common = require("../../utils/common.js"), util = require("../../utils/util.js");

Page({
    data: {
        canIUse: wx.canIUse("open-data"),
        hideLoading: !1,
        statusType: [ "全部", "待付款", "待发货", "待收货", "待评价", "退/换货" ],
        tabClass: [ "", "", "", "", "", "" ],
        member: {
            credit1: 0,
            credit2: "0.00"
        },
        textAuction: "拍卖",
        diyPage: {},
        loadImageError: !1
    },
    onLoad: function() {
        var t = this;
        common.getSettings(function(a) {
            common.setCustomNavigationBar(a), common.setCustomTabBar(t, a), a && t.setData({
                themeColor: a.theme_color ? a.theme_color : "#f44",
                backgroundColor: a.theme_color ? a.theme_color : "#f8f8f8",
                settings: a,
                textAuction: a.auction_text ? a.auction_text : "拍卖"
            });
        });
    },
    getMemberDetail: function() {
        var t = this;
        app.util.request({
            url: "entry/wxapp/member-detail",
            success: function(a) {
                a.data.data.credit1 = parseFloat(a.data.data.credit1).toFixed(0), t.setData({
                    member: a.data.data
                });
            }
        });
    },
    getOrderStatistics: function() {
        var n = this;
        app.util.request({
            url: "entry/wxapp/order-statistics",
            success: function(a) {
                var t = n.data.tabClass;
                if (0 < a.data.data.count_no_pay ? t[1] = "red-dot" : t[1] = "", 0 < a.data.data.count_no_transfer ? t[2] = "red-dot" : t[2] = "", 
                0 < a.data.data.count_no_confirm ? t[3] = "red-dot" : t[3] = "", 0 < a.data.data.count_no_reputation ? t[4] = "red-dot" : t[4] = "", 
                0 < a.data.data.count_refund ? t[5] = "red-dot" : t[5] = "", n.setData({
                    tabClass: t
                }), n.data.diyPage.design) for (var e = 0, o = n.data.diyPage.design.length; e < o; ++e) if ("icon-group" == n.data.diyPage.design[e].name) for (var d = 0; d < n.data.diyPage.design[e].data.list.length; ++d) "/zxsite_shop/order-list/index?currentType=1" == n.data.diyPage.design[e].data.list[d].url && 0 < a.data.data.count_no_pay ? n.data.diyPage.design[e].data.list[d].info = 99 < a.data.data.count_no_pay ? "99+" : a.data.data.count_no_pay : "/zxsite_shop/order-list/index?currentType=2" == n.data.diyPage.design[e].data.list[d].url && 0 < a.data.data.count_no_transfer ? n.data.diyPage.design[e].data.list[d].info = 99 < a.data.data.count_no_transfer ? "99+" : a.data.data.count_no_transfer : "/zxsite_shop/order-list/index?currentType=3" == n.data.diyPage.design[e].data.list[d].url && 0 < a.data.data.count_no_confirm ? n.data.diyPage.design[e].data.list[d].info = 99 < a.data.data.count_no_confirm ? "99+" : a.data.data.count_no_confirm : "/zxsite_shop/order-list/index?currentType=4" == n.data.diyPage.design[e].data.list[d].url && 0 < a.data.data.count_no_reputation ? n.data.diyPage.design[e].data.list[d].info = 99 < a.data.data.count_no_reputation ? "99+" : a.data.data.count_no_reputation : "/zxsite_shop/order-list/index?currentType=5" == n.data.diyPage.design[e].data.list[d].url && 0 < a.data.data.count_refund && (n.data.diyPage.design[e].data.list[d].info = 99 < a.data.data.count_refund ? "99+" : a.data.data.count_refund);
                n.setData({
                    diyPage: n.data.diyPage,
                    hideLoading: !0
                });
            }
        });
    },
    onShow: function() {
        var t = this;
        common.getUserInfo(function(a) {
            a ? (common.updateTabBarCartBadge(), t.getDiyPageList()) : wx.redirectTo({
                url: "/zxsite_shop/start/start?url=/zxsite_shop/my/index&type=tab"
            });
        });
    },
    getDiyPageList: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/diy-page",
            data: {
                type: 4
            },
            showLoading: !1,
            success: function(a) {
                e.setData({
                    backgroundColor: a.data.data.background_color ? a.data.data.background_color : e.data.backgroundColor
                });
                var t = "我的";
                a.data.data && (e.data.diyPage = a.data.data, a.data.data.title && (t = a.data.data.title), 
                wx.setNavigationBarColor({
                    frontColor: "black" == a.data.data.title_bar_color ? "#000000" : "#ffffff",
                    backgroundColor: a.data.data.title_bar_background_color ? a.data.data.title_bar_background_color : "#f8f8f8"
                }), wx.setBackgroundColor({
                    backgroundColor: e.data.backgroundColor
                })), wx.setNavigationBarTitle({
                    title: t
                }), e.getMemberDetail(), e.getOrderStatistics();
            }
        });
    },
    aboutUs: function() {
        wx.showModal({
            title: this.data.settings.shop_name,
            content: this.data.settings.shop_instruction,
            showCancel: !1
        });
    },
    userinfoLevelDesc: function() {
        wx.showModal({
            title: "说明",
            content: this.data.member.level_desc,
            showCancel: !1
        });
    },
    toRecharge: function() {
        wx.navigateTo({
            url: "/zxsite_shop/recharge/index"
        });
    },
    toIntegralLog: function() {
        wx.navigateTo({
            url: "/zxsite_shop/integral-log/index"
        });
    },
    withdraw: function() {
        wx.navigateTo({
            url: "/zxsite_shop/withdraw/index"
        });
    },
    swiperchange: function(a) {
        this.setData({
            swiperCurrent: a.detail.current
        });
    },
    onGoodsDetailTap: function(a) {
        wx.navigateTo({
            url: "/zxsite_shop/goods-details/index?id=" + a.currentTarget.dataset.id
        });
    },
    toNavigationTap: function(a) {
        1 == a.currentTarget.dataset.type ? wx.navigateTo({
            url: a.currentTarget.dataset.url
        }) : 2 == a.currentTarget.dataset.type ? wx.navigateTo({
            url: "/zxsite_shop/web-view/index?linkUrl=" + encodeURIComponent(a.currentTarget.dataset.url)
        }) : wx.navigateTo({
            url: a.currentTarget.dataset.url
        });
    },
    loadImageError: function(a) {
        this.setData({
            loadImageError: !0
        });
    }
});