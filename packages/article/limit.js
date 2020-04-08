var app = getApp();

Page({
    data: {
        themeColor: "#f44",
        limitText: "您的等级无权访问",
        limitLink: "/zxsite_shop/index/index"
    },
    onLoad: function(o) {
        var n = this;
        app.utils.common.getSettings(function(t) {
            var i = decodeURIComponent(o.limit_text), e = decodeURIComponent(o.limit_link);
            n.setData({
                themeColor: t.theme_color ? t.theme_color : "#f44",
                limitText: i || "您的等级无权访问",
                limitLink: e || "/zxsite_shop/index/index"
            });
        });
    },
    onConfirm: function() {
        wx.redirectTo({
            url: this.data.limitLink
        });
    }
});