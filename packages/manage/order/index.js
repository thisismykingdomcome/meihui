var app = getApp();

Page({
    data: {
        themeColor: "#f44",
        backgroundColor: "#f8f8f8",
        status: 0,
        page: 1,
        total: 1,
        orderList: [],
        expressList: [],
        expressText: "请选择",
        expressIndex: 0,
        loadingMoreHidden: !0,
        order: {},
        orderIndex: 0,
        searchKey: "",
        searchValue: ""
    },
    onLoad: function(t) {
        if (wx.getStorageSync("userInfo")) {
            var a = this;
            app.utils.util.isEmpty(t.status) || (this.data.status = t.status, this.setData({
                statusActive: 7 == t.status ? 5 : t.status
            })), app.util.request({
                url: "entry/wxapp/manage-express",
                showLoading: !1,
                data: {
                    m: "zxsite_shop",
                    op: "all"
                },
                success: function(t) {
                    a.setData({
                        expressList: t.data.data
                    });
                }
            }), this.getOrderList();
        } else wx.redirectTo({
            url: "/zxsite_shop/start/start?url=/packages/manage/order/index&type=redirect&status=" + t.status
        });
    },
    onTabChange: function(t) {
        this.data.page = 1, this.data.status = 5 == t.detail.index ? 7 : t.detail.index, 
        this.setData({
            orderList: [],
            loadingMoreHidden: !0
        }), this.getOrderList();
    },
    getOrderList: function() {
        var e = this, s = this.data.orderList;
        if (this.data.page <= this.data.total || 1 == this.data.page) {
            var t = {
                m: "zxsite_shop",
                op: "index",
                page: this.data.page
            };
            0 < this.data.status && (t.status = this.data.status), app.utils.util.isEmpty(e.data.searchKey) || app.utils.util.isEmpty(e.data.searchValue) || (t.key = e.data.searchKey, 
            t.value = e.data.searchValue), app.util.request({
                url: "entry/wxapp/manage-order",
                data: t,
                success: function(t) {
                    var a = t.data.data.list;
                    s = 1 < e.data.page ? s.concat(a) : a, e.setData({
                        orderList: s,
                        page: parseInt(e.data.page) + 1,
                        total: t.data.data.total,
                        loadingMoreHidden: e.data.pagepage < t.data.data.total
                    }), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
                }
            });
        } else e.setData({
            loadingMoreHidden: !1
        });
    },
    onRefreshData: function() {
        this.data.page = 1, this.getOrderList();
    },
    onPullDownRefresh: function() {
        this.data.page = 1, this.getOrderList();
    },
    onReachBottom: function() {
        this.getOrderList();
    },
    onDetail: function(t) {
        wx.navigateTo({
            url: "detail?id=" + t.currentTarget.dataset.id
        });
    },
    onPrice: function(t) {
        this.data.orderIndex = t.currentTarget.dataset.index, this.setData({
            priceDialogShow: !0,
            order: {
                id: this.data.orderList[this.data.orderIndex].id,
                amount: this.data.orderList[this.data.orderIndex].amount,
                freight: this.data.orderList[this.data.orderIndex].freight
            }
        });
    },
    onAmountChange: function(t) {
        this.data.order.amount = t.detail;
    },
    onPriceDialogCancel: function(t) {},
    onPriceDialogConfirm: function(t) {
        var a = this;
        app.util.request({
            url: "entry/wxapp/manage-order",
            data: {
                m: "zxsite_shop",
                op: "price",
                id: this.data.order.id,
                amount: this.data.order.amount
            },
            success: function(t) {
                a.data.orderList[a.data.orderIndex].amount = parseFloat(a.data.order.amount).toFixed(2), 
                a.data.orderList[a.data.orderIndex].total_amount = parseFloat(parseFloat(a.data.order.amount) + parseFloat(a.data.order.freight)).toFixed(2), 
                a.setData({
                    orderList: a.data.orderList
                }), wx.showToast({
                    title: t.data.message,
                    icon: "none",
                    duration: 2e3
                });
            }
        });
    },
    onPay: function(a) {
        var e = this;
        this.data.orderIndex = a.currentTarget.dataset.index, wx.showModal({
            title: "提示",
            content: "已其他方式支付，直接设置为已支付？",
            success: function(t) {
                t.confirm && app.util.request({
                    url: "entry/wxapp/manage-order",
                    data: {
                        m: "zxsite_shop",
                        op: "pay",
                        id: a.currentTarget.dataset.id
                    },
                    success: function(t) {
                        0 == e.data.status ? (e.data.orderList[e.data.orderIndex].status = 2, e.data.orderList[e.data.orderIndex].status_text = "待发货") : e.data.orderList.splice(e.data.orderIndex, 1), 
                        e.setData({
                            orderList: e.data.orderList
                        }), wx.showToast({
                            title: t.data.message,
                            icon: "none",
                            duration: 2e3
                        });
                    }
                });
            }
        });
    },
    onShipping: function(t) {
        this.data.orderIndex = t.currentTarget.dataset.index, this.data.order = {
            id: this.data.orderList[this.data.orderIndex].id,
            sn: this.data.orderList[this.data.orderIndex].sn,
            pay_type: this.data.orderList[this.data.orderIndex].pay_type,
            name: this.data.orderList[this.data.orderIndex].name,
            mobile: this.data.orderList[this.data.orderIndex].mobile,
            province: this.data.orderList[this.data.orderIndex].province,
            city: this.data.orderList[this.data.orderIndex].city,
            district: this.data.orderList[this.data.orderIndex].district,
            address: this.data.orderList[this.data.orderIndex].address,
            shipping_id: "",
            shipping: "",
            shipping_com: "",
            shipping_kdniao: "",
            shipping_sn: ""
        }, this.setData({
            shippingDialogShow: !0,
            expressIndex: 0,
            expressText: "请选择",
            order: this.data.order
        });
    },
    onShippingDialogCancel: function(t) {},
    onShippingDialogConfirm: function(t) {
        var a = this;
        app.utils.util.isEmpty(this.data.order.shipping) ? wx.showToast({
            title: "物流公司不能为空",
            icon: "none",
            duration: 2e3
        }) : app.util.request({
            url: "entry/wxapp/manage-order",
            data: Object.assign({
                m: "zxsite_shop",
                op: "shipping"
            }, this.data.order),
            success: function(t) {
                0 == a.data.status ? (a.data.orderList[a.data.orderIndex].status = 3, a.data.orderList[a.data.orderIndex].status_text = "待收货") : a.data.orderList.splice(a.data.orderIndex, 1), 
                a.setData({
                    orderList: a.data.orderList
                }), wx.showToast({
                    title: t.data.message,
                    icon: "none",
                    duration: 2e3
                });
            }
        });
    },
    onExpressPickerChange: function(t) {
        var a = t.detail.value;
        this.data.order.shipping_id = this.data.expressList[a].id, this.data.order.shipping = this.data.expressList[a].name, 
        this.data.order.shipping_com = this.data.expressList[a].express, this.data.order.shipping_kdniao = this.data.expressList[a].kdniao, 
        this.setData({
            expressIndex: a,
            expressText: this.data.expressList[a].name,
            order: this.data.order
        });
    },
    onKdniaoShipping: function(t) {
        var a = this;
        app.util.request({
            url: "entry/wxapp/manage-order",
            data: Object.assign({
                m: "zxsite_shop",
                op: "kdniao-eorder"
            }, this.data.order),
            success: function(t) {
                a.data.order.shipping_sn = t.data.data, a.setData({
                    order: a.data.order
                });
            }
        });
    },
    onScanShipping: function(t) {
        var a = this;
        wx.scanCode({
            success: function(t) {
                a.data.order.shipping_sn = t.result, a.setData({
                    order: a.data.order
                });
            }
        });
    },
    onFieldChange: function(t) {
        "shipping_sn" == t.currentTarget.id ? this.data.order.shipping_sn = t.detail : "shipping_remark" == t.currentTarget.id && (this.data.order.shipping_remark = t.detail);
    },
    onRefundRecord: function(t) {
        wx.navigateTo({
            url: "refund-record?id=" + t.currentTarget.dataset.id
        });
    },
    onRefundItem: function(t) {
        wx.navigateTo({
            url: "refund-item?id=" + t.currentTarget.dataset.id
        });
    },
    onClose: function(a) {
        var e = this;
        this.data.orderIndex = a.currentTarget.dataset.index, wx.showModal({
            title: "提示",
            content: "确认关闭此订单吗？",
            success: function(t) {
                t.confirm && app.util.request({
                    url: "entry/wxapp/manage-order",
                    data: {
                        m: "zxsite_shop",
                        op: "close",
                        id: a.currentTarget.dataset.id
                    },
                    success: function(t) {
                        0 == e.data.status ? (e.data.orderList[e.data.orderIndex].status = 0, e.data.orderList[e.data.orderIndex].status_text = "已关闭") : e.data.orderList.splice(e.data.orderIndex, 1), 
                        e.setData({
                            orderList: e.data.orderList
                        }), wx.showToast({
                            title: t.data.message,
                            icon: "none",
                            duration: 2e3
                        });
                    }
                });
            }
        });
    },
    onDelete: function(a) {
        var e = this;
        this.data.orderIndex = a.currentTarget.dataset.index, wx.showModal({
            title: "提示",
            content: "确认删除此订单吗？",
            success: function(t) {
                t.confirm && app.util.request({
                    url: "entry/wxapp/manage-order",
                    data: {
                        m: "zxsite_shop",
                        op: "delete",
                        id: a.currentTarget.dataset.id
                    },
                    success: function(t) {
                        e.data.orderList.splice(e.data.orderIndex, 1), e.setData({
                            orderList: e.data.orderList
                        }), wx.showToast({
                            title: t.data.message,
                            icon: "none",
                            duration: 2e3
                        });
                    }
                });
            }
        });
    },
    onSearch: function(t) {
        this.setData({
            searchKey: "sn",
            searchValue: t.detail
        }), this.data.page = 1, this.getOrderList();
    },
    onSearchCancel: function() {
        this.setData({
            searchKey: "",
            searchValue: ""
        }), this.data.page = 1, this.getOrderList();
    }
});