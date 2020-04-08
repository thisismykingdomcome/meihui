var app = getApp();

Page({
    data: {
        themeColor: "#f44",
        backgroundColor: "#ffffff",
        textCharge: "佣金",
        textUnion: "元"
    },
    onLoad: function(t) {
        var e = this;
        app.utils.common.getUserInfo(function(t) {
            t ? app.utils.common.getSettings(function(t) {
                e.setData({
                    themeColor: t.theme_color ? t.theme_color : "#f44",
                    textCharge: t.commission_text_charge ? t.commission_text_charge : "佣金",
                    textUnion: t.commission_text_union ? t.commission_text_union : "元"
                }), wx.setNavigationBarTitle({
                    title: e.data.textCharge + "排行榜"
                }), e.getRanking();
            }) : wx.redirectTo({
                url: "/zxsite_shop/start/start?url=/packages/commission/index/index"
            });
        });
    },
    getRanking: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/commission-ranking",
            data: {
                m: "zxsite_shop"
            },
            success: function(t) {
                e.setData({
                    ranking: t.data.data
                }), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            }
        });
    },
    onRefreshData: function() {
        this.getRanking();
    },
    onPullDownRefresh: function() {
        this.getRanking();
    }
});