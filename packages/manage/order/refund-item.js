var app = getApp();

Page({
    data: {
        themeColor: "#f44",
        backgroundColor: "#ffffff",
        refundStatusActionsShow: !1,
        refundStatusActions: [ {
            name: "同意",
            value: 2
        }, {
            name: "拒绝",
            value: 3
        } ]
    },
    onLoad: function(t) {
        if (wx.getStorageSync("userInfo")) {
            var e = this;
            app.util.request({
                url: "entry/wxapp/manage-order",
                data: {
                    m: "zxsite_shop",
                    op: "refund-item",
                    id: t.id
                },
                success: function(t) {
                    e.setData({
                        refundItem: t.data.data
                    });
                }
            });
        } else wx.redirectTo({
            url: "/zxsite_shop/start/start?url=/packages/manage/order/refund-item&type=redirect&id=" + t.id
        });
    },
    onSubmit: function(t) {
        2 != this.data.refundItem.status && 3 != this.data.refundItem.status ? wx.showToast({
            title: "请选择处理结果",
            icon: "none",
            duration: 2e3
        }) : app.util.request({
            url: "entry/wxapp/manage-order",
            data: Object.assign({
                m: "zxsite_shop",
                op: "refund-op"
            }, this.data.refundItem),
            success: function(t) {
                var e = getCurrentPages();
                e[e.length - 2].onRefreshData(), wx.showToast({
                    title: t.data.message,
                    icon: "none",
                    duration: 2e3
                }), setTimeout(function() {
                    wx.navigateBack({});
                }, 2e3);
            }
        });
    },
    onRefundStatusClick: function(t) {
        this.setData({
            refundStatusActionsShow: !0
        });
    },
    onRefundStatusActionsSelect: function(t) {
        this.data.refundItem.status = t.detail.value, this.data.refundItem.status_text = 2 == t.detail.value ? "同意" : "拒绝", 
        this.setData({
            refundStatusActionsShow: !1,
            refundItem: this.data.refundItem
        }), console.log(this.data.refundItem);
    },
    onRefundStatusActionsCancel: function(t) {
        this.setData({
            refundStatusActionsShow: !1
        });
    }
});