var app = getApp();

Page({
    data: {
        themeColor: "#f44",
        backgroundColor: "#ffffff",
        refundList: []
    },
    onLoad: function(t) {
        if (wx.getStorageSync("userInfo")) {
            var e = this;
            app.util.request({
                url: "entry/wxapp/manage-order",
                data: {
                    m: "zxsite_shop",
                    op: "refund-record",
                    id: t.id
                },
                success: function(t) {
                    e.setData({
                        refundList: t.data.data
                    });
                }
            });
        } else wx.redirectTo({
            url: "/zxsite_shop/start/start?url=/packages/manage/order/refund-record&type=redirect&id=" + t.id
        });
    },
    onRefund: function(r) {
        var d = this;
        app.util.request({
            url: "entry/wxapp/manage-order",
            data: {
                m: "zxsite_shop",
                op: "refund",
                id: r.currentTarget.id
            },
            success: function(t) {
                for (var e = 0, a = d.data.refundList.length; e < a; ++e) if (r.currentTarget.id == d.data.refundList[e].id) {
                    d.data.refundList[e].status = 0;
                    break;
                }
                d.setData({
                    refundList: t.data.data
                }), wx.showToast({
                    title: t.data.message,
                    icon: "none",
                    duration: 2e3
                });
            }
        });
    }
});