var app = getApp();

Page({
    data: {},
    onLoad: function(t) {
        var a = this;
        app.utils.common.getUserInfo(function(t) {
            t ? app.utils.common.getSettings(function(t) {
                app.utils.common.setCustomNavigationBar(t), app.utils.common.setCustomTabBar(a, t, "packages/commission/index/index"), 
                a.setData({
                    themeColor: t.theme_color ? t.theme_color : "#f44"
                }), a.getAgent();
            }) : wx.redirectTo({
                url: "/zxsite_shop/start/start?url=/packages/commission/apply/waiting"
            });
        });
    },
    getAgent: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/commission-agent",
            showLoading: !1,
            data: {
                m: "zxsite_shop"
            },
            success: function(t) {
                t.data.data ? (a.setData({
                    agent: t.data.data
                }), 0 == t.data.data.status ? wx.setNavigationBarTitle({
                    title: "申请不通过"
                }) : 1 == t.data.data.status ? wx.setNavigationBarTitle({
                    title: "申请成功"
                }) : 2 == t.data.data.status && wx.setNavigationBarTitle({
                    title: "分销商被撤销"
                })) : wx.redirectTo({
                    url: "index"
                });
            }
        });
    },
    onBack: function() {
        wx.navigateBack({
            delta: 2
        });
    }
});