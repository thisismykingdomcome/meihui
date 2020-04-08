var app = getApp(), common = require("../../utils/common.js"), util = require("../../utils/util.js");

Page({
    data: {
        themeColor: "#f44",
        backgroundColor: "#f8f8f8",
        statusType: [ "全部", "增加", "减少" ],
        currentType: 0,
        tabClass: [ "", "", "" ],
        page: 1,
        total: 1,
        integralList: [],
        loadingMoreHidden: !0
    },
    onLoad: function(t) {
        var a = this;
        common.getUserInfo(function(t) {
            t ? (common.getSettings(function(t) {
                common.setCustomNavigationBar(t), common.setCustomTabBar(a, t), a.setData({
                    themeColor: t.theme_color ? t.theme_color : "#f44",
                    backgroundColor: t.background_color ? t.background_color : "#f8f8f8"
                });
            }), a.getBalanceList(1)) : wx.redirectTo({
                url: "/zxsite_shop/start/start?url=/zxsite_shop/integral-log/index"
            });
        });
    },
    statusTap: function(t) {
        var a = t.currentTarget.dataset.index;
        this.setData({
            currentType: a
        }), this.getBalanceList(1);
    },
    getBalanceList: function(a) {
        var e = this, o = this.data.integralList;
        a <= this.data.total ? app.util.request({
            url: "entry/wxapp/integral-log",
            data: {
                type: e.data.currentType,
                page: a
            },
            success: function(t) {
                0 < t.data.data.total ? (o = 1 < a ? o.concat(t.data.data.list) : t.data.data.list, 
                e.setData({
                    integralList: o,
                    page: parseInt(a) + 1,
                    total: t.data.data.total
                })) : e.setData({
                    integralList: null
                }), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            }
        }) : e.setData({
            loadingMoreHidden: !1
        });
    },
    onPullDownRefresh: function() {
        this.getBalanceList(1);
    },
    onReachBottom: function() {
        this.getBalanceList(this.data.page);
    }
});