var app = getApp();

Page({
    data: {
        themeColor: "#f44",
        posterShow: 1,
        rankingShow: 1,
        backgroundColor: "#ffffff",
        textCenter: "分销中心",
        textCharge: "佣金",
        textWithdraw: "提现",
        textCommissionCharge: "分销佣金",
        textCommissionOrder: "分销订单",
        textChild: "下线",
        textUnion: "元"
    },
    onLoad: function(t) {
        var i = this;
        app.utils.common.getUserInfo(function(t) {
            t ? app.utils.common.getSettings(function(t) {
                app.utils.common.setCustomNavigationBar(t), app.utils.common.setCustomTabBar(i, t), 
                i.setData({
                    themeColor: t.theme_color ? t.theme_color : "#f44",
                    posterShow: t.commission_poster_show ? t.commission_poster_show : 1,
                    rankingShow: t.commission_ranking_show ? t.commission_ranking_show : 1,
                    textCenter: t.commission_text_center ? t.commission_text_center : "分销中心",
                    textCharge: t.commission_text_charge ? t.commission_text_charge : "佣金",
                    textWithdraw: t.commission_text_withdraw ? t.commission_text_withdraw : "提现",
                    textCommissionCharge: t.commission_text_commission_charge ? t.commission_text_commission_charge : "分销佣金",
                    textCommissionOrder: t.commission_text_commission_order ? t.commission_text_commission_order : "分销订单",
                    textChild: t.commission_text_child ? t.commission_text_child : "下线",
                    textUnion: t.commission_text_union ? t.commission_text_union : "元"
                }), wx.setNavigationBarTitle({
                    title: i.data.textCenter
                }), i.getStatistics();
            }) : wx.redirectTo({
                url: "/zxsite_shop/start/start?url=/packages/commission/index/index"
            });
        });
    },
    getStatistics: function() {
        var i = this;
        app.util.request({
            url: "entry/wxapp/commission-index",
            data: {
                m: "zxsite_shop"
            },
            success: function(t) {
                wx.hideNavigationBarLoading(), wx.stopPullDownRefresh(), t.data.data ? 5 == t.data.data.status ? i.setData({
                    agent: t.data.data
                }) : wx.redirectTo({
                    url: "../apply/waiting"
                }) : wx.redirectTo({
                    url: "../apply/index"
                });
            }
        });
    },
    onRefreshData: function() {
        this.getStatistics();
    },
    onPullDownRefresh: function() {
        this.getStatistics();
    },
    onApply: function() {
        wx.navigateTo({
            url: "../withdraw/apply"
        });
    }
});