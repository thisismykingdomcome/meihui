var app = getApp();

Page({
    data: {
        id: 0,
        backgroundColor: "#f8f8f8"
    },
    onLoad: function(a) {
        var t = this;
        app.utils.common.getSettings(function(a) {
            app.utils.common.setCustomNavigationBar(a), app.utils.common.setCustomTabBar(t, a), 
            t.setData({
                backgroundColor: a.background_color ? a.background_color : "#f8f8f8"
            });
        });
        var o = a.id;
        this.setData({
            id: o
        });
    },
    onShow: function() {
        var t = this;
        wx.showLoading(), app.util.request({
            url: "entry/wxapp/credit-shop-order-detail",
            data: {
                m: "zxsite_shop",
                id: t.data.id
            },
            success: function(a) {
                wx.hideLoading(), a.data.data.need_credit = a.data.data.goods.credit * a.data.data.goods.number, 
                a.data.data.pay_amount = parseFloat(parseFloat(a.data.data.total_amount) - parseFloat(a.data.data.deduction_balance)).toFixed(2), 
                t.setData({
                    orderDetail: a.data.data
                });
            }
        });
    },
    confirmBtnTap: function(a) {
        var t = this;
        wx.showModal({
            title: "确认您已收到商品？",
            content: "",
            success: function(a) {
                a.confirm && (wx.showLoading(), app.util.request({
                    url: "entry/wxapp/credit-shop-order-status",
                    data: {
                        m: "zxsite_shop",
                        order_id: t.data.id,
                        status: 4
                    },
                    success: function(a) {
                        wx.hideLoading(), t.onShow();
                    }
                }));
            }
        });
    },
    gotoGoodsDetail: function(a) {
        wx.navigateTo({
            url: "/packages/credit-shop/goods-detail/index?id=" + a.currentTarget.dataset.goodsId
        });
    }
});