var app = getApp(), WxParse = require("../../wxParse/wxParse.js"), common = require("../../utils/common.js"), util = require("../../utils/util.js");

Page({
    data: {},
    onLoad: function(a) {
        var e = this;
        common.getSettings(function(t) {
            common.setCustomNavigationBar(t), common.setCustomTabBar(e, t);
        }), app.util.request({
            url: "entry/wxapp/notice-detail",
            cachetime: "30",
            data: {
                id: a.id
            },
            success: function(t) {
                e.setData({
                    notice: t.data.data
                }), WxParse.wxParse("article", "html", t.data.data.content, e, 10), app.util.request({
                    url: "entry/wxapp/member-action",
                    data: {
                        type: 1,
                        path: "zxsite_shop/notice/show?id=" + a.id,
                        description: "公告[" + t.data.data.title + "]"
                    },
                    showLoading: !1
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});