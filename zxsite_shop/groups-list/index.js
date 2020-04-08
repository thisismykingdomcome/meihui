var app = getApp(), common = require("../../utils/common.js"), util = require("../../utils/util.js");

Page({
    data: {
        indicatorDots: !0,
        interval: 3e3,
        duration: 1e3,
        userInfo: {},
        scrollTop: "0",
        loadingMoreHidden: !0,
        themeColor: "#f44",
        backgroundColor: "#f8f8f8"
    },
    onLoad: function(o) {
        var n = this;
        common.getUserInfo(function(t) {
            if (t) common.getSettings(function(t) {
                common.setCustomNavigationBar(t), common.setCustomTabBar(n, t), n.setData({
                    themeColor: t.theme_color ? t.theme_color : "#f44",
                    backgroundColor: t.background_color ? t.background_color : "#f8f8f8",
                    banner: t.groups_banner ? t.groups_banner : "http://qn.zxsite.cn/zxsite_shop/groups-banner.jpg"
                }), n.getCommissionAgent(), o.agent_id && n.handleCommissionMember(o.agent_id);
            }); else {
                var e = "/zxsite_shop/start/start?url=/zxsite_shop/groups-list/index";
                o.agent_id && (e += "&agent_id=" + o.agent_id), wx.redirectTo({
                    url: e
                });
            }
        });
    },
    onShow: function() {
        this.getGroups();
    },
    onReady: function() {},
    getGroups: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/groups-list",
            data: {
                groups_more: 1
            },
            success: function(t) {
                0 < t.data.data.length && e.setData({
                    groupsList: t.data.data,
                    loadingMoreHidden: !1
                });
            }
        });
    },
    toGroupsDetailsTap: function(t) {
        wx.navigateTo({
            url: "/zxsite_shop/groups-details/index?id=" + t.currentTarget.dataset.id
        });
    },
    onShareAppMessage: function() {
        var t = "/zxsite_shop/groups-list/index";
        return this.data.agent && (t += "&agent_id=" + this.data.agent.id), {
            title: "拼团专区——" + wx.getStorageSync("settings").shop_name,
            path: t,
            success: function(t) {},
            fail: function(t) {}
        };
    },
    getCommissionAgent: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/commission-agent",
            showLoading: !1,
            data: {
                status: 5
            },
            success: function(t) {
                e.setData({
                    agent: t.data.data
                });
            }
        });
    },
    handleCommissionMember: function(t) {
        app.util.request({
            url: "entry/wxapp/commission-member-create",
            showLoading: !1,
            data: {
                agent_id: t
            }
        });
    }
});