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
        statusType: [ "拍卖中", "未开始", "已结束" ],
        currentType: 0,
        backgroundColor: "#f8f8f8",
        textAuction: "拍卖",
        textCurrentPrice: "当前价",
        textCompletePrice: "拍中价",
        textProcess: "拍卖中"
    },
    onLoad: function(a) {
        var i = this;
        common.getUserInfo(function(t) {
            if (t) common.getSettings(function(t) {
                common.setCustomNavigationBar(t), common.setCustomTabBar(i, t), i.setData({
                    themeColor: t.theme_color ? t.theme_color : "#f44",
                    backgroundColor: t.background_color ? t.background_color : "#f8f8f8",
                    banner: t.auction_banner ? t.auction_banner : "http://qn.zxsite.cn/zxsite_shop/auction-banner.jpg",
                    textAuction: t.auction_text ? t.auction_text : "拍卖",
                    textCurrentPrice: t.auction_text_current_price ? t.auction_text_current_price : "当前价",
                    textCompletePrice: t.auction_text_complete_price ? t.auction_text_complete_price : "拍中价",
                    textProcess: t.auction_text_process ? t.auction_text_process : "拍卖中",
                    statusType: [ t.auction_text_process ? t.auction_text_process : "拍卖中", "未开始", "已结束" ]
                }), wx.setNavigationBarTitle({
                    title: i.data.textAuction + "专区"
                }), i.getCommissionAgent(), a.agent_id && i.handleCommissionMember(a.agent_id);
            }); else {
                var e = "/zxsite_shop/start/start?url=/zxsite_shop/auction-list/index";
                a.agent_id && (e += "&agent_id=" + a.agent_id), wx.redirectTo({
                    url: e
                });
            }
        });
    },
    onShow: function() {
        this.getAuction(this.data.currentType);
    },
    onReady: function() {},
    getAuction: function(t) {
        var e = this;
        app.util.request({
            url: "entry/wxapp/auction-list",
            data: {
                auction_more: 1,
                tab_index: t
            },
            success: function(t) {
                e.setAuctionRemind(t.data.data);
            }
        });
    },
    statusTap: function(t) {
        var e = t.currentTarget.dataset.index;
        this.data.currentType = e, this.setData({
            currentType: e,
            auctionList: []
        }), this.getAuction(e);
    },
    toAuctionDetailsTap: function(t) {
        wx.navigateTo({
            url: "/zxsite_shop/auction-details/index?id=" + t.currentTarget.dataset.id
        });
    },
    onShareAppMessage: function() {
        var t = "/zxsite_shop/auction-list/index";
        return this.data.agent && (t += "&agent_id=" + this.data.agent.id), {
            title: "拍卖专区——" + wx.getStorageSync("settings").shop_name,
            path: t,
            success: function(t) {},
            fail: function(t) {}
        };
    },
    setRemind: function(t) {
        var e = this, a = t.currentTarget.dataset.auction_id, i = t.currentTarget.dataset.index;
        app.util.request({
            url: "entry/wxapp/auction-remind",
            showLoading: !1,
            data: {
                auction_id: a,
                form_id: t.detail.formId
            },
            success: function(t) {
                wx.showToast({
                    title: "设置成功",
                    icon: "success",
                    duration: 2e3
                }), e.data.auctionList[i].remind_id = t.data.data.remind_id, e.data.auctionList[i].remind = 1, 
                e.setData({
                    auctionList: e.data.auctionList
                });
            }
        });
    },
    setAuctionRemind: function(e) {
        var a = this, i = wx.getStorageSync("userInfo");
        app.util.request({
            url: "entry/wxapp/auction-remind-list",
            showLoading: !1,
            success: function(t) {
                0 < t.data.data.length && e.forEach(function(e) {
                    t.data.data.forEach(function(t) {
                        t.auction_id == e.id && t.uid == i.memberInfo.uid && t.begin_date == e.start_time && (e.remind = 1, 
                        e.remind_id = t.id);
                    });
                }), a.setData({
                    auctionList: e,
                    loadingMoreHidden: !1
                });
            }
        });
    },
    cancleRemind: function(t) {
        var e = this, a = t.currentTarget.dataset.auction_remind_id, i = t.currentTarget.dataset.index;
        app.util.request({
            url: "entry/wxapp/auction-cancle-remind",
            showLoading: !1,
            data: {
                auction_remind_id: a
            },
            success: function(t) {
                wx.showToast({
                    title: "取消成功",
                    icon: "success",
                    duration: 2e3
                }), e.data.auctionList[i].remind = 0, e.setData({
                    auctionList: e.data.auctionList
                });
            }
        });
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