var app = getApp(), common = require("../../utils/common.js"), util = require("../../utils/util.js");

Page({
    data: {
        id: 0,
        backgroundColor: "#f8f8f8",
        diyForm: []
    },
    onLoad: function(t) {
        var a = this;
        common.getSettings(function(t) {
            common.setCustomNavigationBar(t), common.setCustomTabBar(a, t), a.setData({
                backgroundColor: t.background_color ? t.background_color : "#f8f8f8"
            });
        });
        var e = t.id;
        this.setData({
            id: e
        }), this.getReputationList();
    },
    getReputationList: function() {
        app.util.request({
            url: "entry/wxapp/reputationList",
            data: {
                goods_id: 1
            },
            showLoading: !1,
            success: function(t) {}
        });
    },
    onShow: function() {
        var r = this;
        app.util.request({
            url: "entry/wxapp/order-detail",
            data: {
                id: r.data.id
            },
            success: function(t) {
                t.data.data.pay_amount = parseFloat(parseFloat(t.data.data.total_amount) - parseFloat(t.data.data.deduction_balance)).toFixed(2), 
                r.data.diyForm = [];
                for (var a = 0, e = t.data.data.goods.length; a < e; ++a) if (!util.isEmpty(t.data.data.goods[a].diy_form)) for (var o = t.data.data.goods[a].diy_form.split(";"), i = 0; i < o.length; i++) {
                    var d = o[i].split("|"), n = {
                        name: d[0],
                        value: d[1]
                    };
                    -1 != n.value.indexOf("http") ? (n.item = n.value.split(","), n.type = "image") : n.type = "text", 
                    r.data.diyForm.push(n);
                }
                r.setData({
                    orderDetail: t.data.data,
                    diyForm: r.data.diyForm
                });
            }
        });
    },
    confirmBtnTap: function(t) {
        var a = this;
        wx.showModal({
            title: "确认您已收到商品？",
            content: "",
            success: function(t) {
                t.confirm && (wx.showLoading(), app.util.request({
                    url: "entry/wxapp/order-status",
                    data: {
                        order_id: a.data.id,
                        status: 4
                    },
                    success: function(t) {
                        wx.hideLoading(), a.onShow();
                    }
                }));
            }
        });
    },
    refundBtnTap: function(t) {
        wx.navigateTo({
            url: "/zxsite_shop/order-refund/index?id=" + this.data.id
        });
    },
    submitReputation: function(t) {
        for (var a = this, e = "[", o = 0; o < a.data.orderDetail.goods.length; ++o) {
            var i = t.detail.value["orderGoodsId" + o], d = "";
            0 < o && (d = ","), e += d += '{"goods_id":' + t.detail.value["goodsId" + o] + ',"number":' + t.detail.value["number" + o] + ',"integral_give":' + t.detail.value["integralGive" + o] + ',"order_goods_id":' + i + ',"reputation":"' + t.detail.value["goodReputation" + o] + '","content":"' + t.detail.value["goodReputationContent" + o] + '"}';
        }
        e += "]", wx.showLoading(), app.util.request({
            url: "entry/wxapp/order-reputation",
            method: "POST",
            data: {
                order_id: a.data.id,
                goods_reputations_json_str: e
            },
            success: function(t) {
                wx.hideLoading(), a.onShow();
            }
        });
    },
    gotoGoodsDetail: function(t) {
        1 == t.currentTarget.dataset.auction ? wx.navigateTo({
            url: "/zxsite_shop/auction-details/index?id=" + t.currentTarget.dataset.goodsid
        }) : 1 == t.currentTarget.dataset.groups ? wx.navigateTo({
            url: "/zxsite_shop/groups-details/index?id=" + t.currentTarget.dataset.goodsid
        }) : wx.navigateTo({
            url: "/zxsite_shop/goods-details/index?id=" + t.currentTarget.dataset.goodsid
        });
    },
    logisticsBtnTap: function(t) {
        wx.navigateTo({
            url: "/zxsite_shop/order-refund/index?id=" + this.data.id
        });
    },
    cancelBtnTap: function(t) {
        var a = this;
        wx.showModal({
            title: "确认要取消退换？",
            content: "",
            success: function(t) {
                t.confirm && (wx.showLoading(), app.util.request({
                    url: "entry/wxapp/order-refund",
                    data: {
                        order_id: a.data.id,
                        cancel: !0
                    },
                    success: function(t) {
                        wx.hideLoading(), a.onShow();
                    }
                }));
            }
        });
    },
    bindPreviewImage: function(t) {
        wx.previewImage({
            urls: [ t.currentTarget.dataset.src ]
        });
    },
    onOpenStoreLoaction: function(t) {
        util.isEmpty(this.data.orderDetail.store_id) || app.util.request({
            url: "entry/wxapp/store-detail",
            data: {
                id: this.data.orderDetail.store_id
            },
            success: function(t) {
                var a = Number(t.data.data.latitude), e = Number(t.data.data.longitude), o = t.data.data.name, i = t.data.data.address;
                wx.getLocation({
                    type: "gcj02",
                    success: function(t) {
                        wx.openLocation({
                            latitude: a,
                            longitude: e,
                            name: o,
                            address: i
                        });
                    }
                });
            }
        });
    }
});