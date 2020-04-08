var app = getApp();

Page({
    data: {
        themeColor: "#f44",
        backgroundColor: "#ffffff"
    },
    onLoad: function(t) {
        wx.getStorageSync("userInfo") ? this.getStatistics() : wx.redirectTo({
            url: "/zxsite_shop/start/start?url=/packages/manage/index/index&type=redirect"
        });
    },
    getStatistics: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/manage-index",
            data: {
                m: "zxsite_shop",
                op: "index"
            },
            success: function(t) {
                e.setData({
                    statistics: t.data.data
                }), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            }
        });
    },
    onVerify: function() {
        wx.scanCode({
            success: function(t) {
                if (t.result.indexOf("|")) {
                    var e = t.result.split("|");
                    app.util.request({
                        url: "entry/wxapp/manage-order",
                        data: {
                            m: "zxsite_shop",
                            op: "verify-code-check",
                            sn: e[0],
                            verify_code: e[1]
                        },
                        success: function(t) {
                            wx.navigateTo({
                                url: "../order/detail?id=" + t.data.data.id + "&verify_code=" + e[1]
                            });
                        }
                    });
                } else wx.showToast({
                    title: "非法二维码",
                    icon: "none",
                    duration: 2e3
                });
            }
        });
    },
    onShortcutOrder: function(t) {
        wx.navigateTo({
            url: "../order/index?status=" + t.currentTarget.dataset.status
        });
    },
    onPullDownRefresh: function() {
        this.getStatistics();
    }
});