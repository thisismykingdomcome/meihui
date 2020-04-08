var app = getApp();

Page({
    data: {
        themeColor: "#f44",
        backgroundColor: "#f8f8f8",
        statusType: [ "全部", "未结算", "已结算" ],
        currentType: 0,
        status: 0,
        page: 1,
        total: 1,
        orderList: [],
        loadingMoreHidden: !0,
        textCharge: "佣金",
        textCommissionOrder: "分销订单",
        textFirstChild: "一级下线",
        textSecondChild: "二级下线",
        textThirdChild: "三级下线",
        textUnion: "元"
    },
    onLoad: function(t) {
        var e = this;
        app.utils.common.getUserInfo(function(t) {
            t ? app.utils.common.getSettings(function(t) {
                e.setData({
                    themeColor: t.theme_color ? t.theme_color : "#f44",
                    textCharge: t.commission_text_charge ? t.commission_text_charge : "佣金",
                    textCommissionOrder: t.commission_text_commission_order ? t.commission_text_commission_order : "分销订单",
                    textFirstChild: t.commission_text_first_child ? t.commission_text_first_child : "一级下线",
                    textSecondChild: t.commission_text_second_child ? t.commission_text_second_child : "二级下线",
                    textThirdChild: t.commission_text_third_child ? t.commission_text_third_child : "三级下线",
                    textUnion: t.commission_text_union ? t.commission_text_union : "元"
                }), wx.setNavigationBarTitle({
                    title: e.data.textCommissionOrder
                }), e.getOrderList();
            }) : wx.redirectTo({
                url: "/zxsite_shop/start/start?url=/packages/commission/order/index"
            });
        });
    },
    statusTap: function(t) {
        var e = t.currentTarget.dataset.index;
        this.data.page = 1, this.data.status = 2 == e ? 5 : e, this.setData({
            currentType: t.currentTarget.dataset.index
        }), this.getOrderList();
    },
    getOrderList: function() {
        var i = this, a = this.data.orderList;
        if (this.data.page <= this.data.total || 1 == this.data.page) {
            var t = {
                m: "zxsite_shop",
                page: this.data.page
            };
            0 < this.data.status && (t.status = this.data.status), app.util.request({
                url: "entry/wxapp/commission-order",
                data: t,
                success: function(t) {
                    var e = t.data.data.list;
                    a = 1 < i.data.page ? a.concat(e) : e, i.setData({
                        orderList: a,
                        page: parseInt(i.data.page) + 1,
                        total: t.data.data.total,
                        loadingMoreHidden: i.data.pagepage < t.data.data.total
                    }), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
                }
            });
        } else i.setData({
            loadingMoreHidden: !1
        });
    },
    onPullDownRefresh: function() {
        this.data.page = 1, this.getOrderList();
    },
    onReachBottom: function() {
        this.getOrderList();
    }
});