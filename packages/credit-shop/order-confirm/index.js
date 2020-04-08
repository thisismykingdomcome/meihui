var app = getApp();

Page({
    data: {
        themeColor: "#f44",
        backgroundColor: "#f8f8f8",
        goods: {},
        isNeedLogistics: !1,
        allGoodsPrice: 0,
        freightPrice: 0,
        allGoodsAndFreightPrice: 0,
        needCredit: 0,
        needMoney: 0,
        orderType: "",
        forbidOrder: !0,
        memberBalance: 0,
        deductionBalance: 0,
        selPayTypeIndex: 0,
        payTypeList: [ {
            id: 1,
            name: "在线支付"
        } ],
        selPayType: "在线支付",
        currentPayType: {
            id: 1,
            name: "在线支付"
        },
        settings: [],
        sendType: [],
        currentSendType: 1,
        name: "",
        mobile: ""
    },
    onShow: function() {
        var t = this, e = wx.getStorageSync("buyNowInfo");
        1 == e.is_cash && this.data.payTypeList.length < 2 && this.data.payTypeList.push({
            id: 2,
            name: "货到付款"
        }), this.setData({
            goods: e,
            needCredit: e.credit * e.number,
            needMoney: parseFloat(e.money * e.number).toFixed(2),
            freightPrice: 0,
            forbidOrder: !0,
            payTypeList: this.data.payTypeList
        }), app.util.getUserInfo(function(e) {
            t.initShipping();
        }), app.util.request({
            url: "entry/wxapp/get-member-info",
            data: {
                m: "zxsite_shop"
            },
            success: function(e) {
                e.data.data && t.setData({
                    mobile: e.data.data.mobile,
                    name: e.data.data.realname
                });
            }
        });
    },
    onLoad: function(e) {
        var t = wx.getStorageSync("settings");
        app.utils.common.setCustomNavigationBar(t), app.utils.util.isEmpty(t.theme_color) || this.setData({
            themeColor: t.theme_color
        }), app.utils.util.isEmpty(t.background_color) || this.setData({
            backgroundColor: t.background_color
        }), 1 == t.send_type || 1 == t.overseas_agency ? this.data.sendType = [ {
            name: "快递配送",
            type: 1
        } ] : 2 == t.send_type ? (this.data.sendType = [ {
            name: "到店取货",
            type: 2
        } ], this.setData({
            currentSendType: 2
        })) : 3 == t.send_type && (this.data.sendType = [ {
            name: "快递配送",
            type: 1
        }, {
            name: "到店取货",
            type: 2
        } ]), this.setData({
            sendType: this.data.sendType,
            settings: t
        }), app.utils.util.isEmpty(e.orderType) || this.setData({
            orderType: e.orderType
        });
    },
    createOrder: function(i) {
        wx.showLoading();
        var d = this, e = "";
        if (i && (e = i.detail.value.remark), !d.data.curAddressData && d.data.isNeedLogistics && 1 == d.data.currentSendType) return wx.hideLoading(), 
        void wx.showToast({
            title: "请先设置您的收货地址",
            icon: "none",
            duration: 2e3
        });
        var t = Object.assign({
            m: "zxsite_shop",
            remark: e,
            send_type: this.data.currentSendType
        }, this.data.goods);
        if (d.data.curAddressData && (t.province = d.data.curAddressData.province, t.city = d.data.curAddressData.city, 
        t.district = d.data.curAddressData.district), 0 == d.data.isNeedLogistics && (t.send_type = 1), 
        d.data.isNeedLogistics && i) {
            if (!d.data.freightPrice) return wx.hideLoading(), void wx.showToast({
                title: "无法获取配送方式",
                icon: "none",
                duration: 2e3
            });
            if (1 == this.data.currentSendType) t.address = d.data.curAddressData.address, t.name = d.data.curAddressData.name, 
            t.mobile = d.data.curAddressData.mobile; else if (t.mobile = i.detail.value.mobile, 
            t.name = i.detail.value.name, t.province = "", t.city = "", t.district = "", t.shop_address = this.data.settings.address, 
            t.shop_name = this.data.settings.shop_name, t.shop_telphone = this.data.settings.shop_telphone, 
            !t.mobile || !t.name) return void wx.showToast({
                title: "姓名、电话不能为空",
                icon: "none",
                duration: 2e3
            });
            if (1 == wx.getStorageSync("settings").overseas_agency) {
                if (app.utils.util.isEmpty(d.data.curAddressData.identity_code) || app.utils.util.isEmpty(d.data.curAddressData.identity_photo_front) || util.isEmpty(d.data.curAddressData.identity_photo_back)) return wx.hideLoading(), 
                void wx.showToast({
                    title: "请完善收货地址中身份证信息",
                    icon: "none",
                    duration: 2e3
                });
                t.identity_code = d.data.curAddressData.identity_code, t.identity_photo_front = d.data.curAddressData.identity_photo_front, 
                t.identity_photo_back = d.data.curAddressData.identity_photo_back;
            }
        }
        !i || 2 != this.data.currentSendType || (t.mobile = i.detail.value.mobile, t.name = i.detail.value.name, 
        t.province = "", t.city = "", t.district = "", t.shop_address = this.data.settings.address, 
        t.shop_name = this.data.settings.shop_name, t.shop_telphone = this.data.settings.shop_telphone, 
        t.mobile && t.name) ? (i ? (t.amount = d.data.allGoodsPrice, 1 == this.data.currentSendType ? t.freight = d.data.freightPrice : t.freight = 0, 
        t.pay_type = d.data.currentPayType.id, t.form_id = i.detail.formId) : t.calculate = !0, 
        app.util.request({
            url: "entry/wxapp/credit-shop-order-create",
            data: t,
            method: "POST",
            success: function(e) {
                if (wx.hideLoading(), !i) {
                    d.setData({
                        isNeedLogistics: e.data.data.is_need_logistics,
                        allGoodsPrice: parseFloat(e.data.data.amount).toFixed(2),
                        freightPrice: parseFloat(e.data.data.freight).toFixed(2),
                        memberBalance: parseFloat(e.data.data.balance).toFixed(2),
                        forbidOrder: !1
                    });
                    var t = e.data.data.amount;
                    1 == d.data.currentSendType && (t += parseFloat(e.data.data.freight));
                    var a = d.data.memberBalance > t ? t : d.data.memberBalance;
                    return t -= parseFloat(a), void d.setData({
                        allGoodsAndFreightPrice: parseFloat(t).toFixed(2),
                        deductionBalance: parseFloat(a).toFixed(2)
                    });
                }
                wx.redirectTo({
                    url: "/packages/credit-shop/order-list/index"
                });
            }
        })) : wx.showToast({
            title: "姓名、电话不能为空",
            icon: "none",
            duration: 2e3
        });
    },
    initShipping: function() {
        var t = this;
        app.util.request({
            url: "entry/wxapp/shipping-default",
            data: {
                m: "zxsite_shop"
            },
            success: function(e) {
                e.data.data ? t.setData({
                    curAddressData: e.data.data
                }) : t.setData({
                    curAddressData: null
                }), t.createOrder();
            }
        });
    },
    addAddress: function() {
        wx.navigateTo({
            url: "/zxsite_shop/address-add/index?source=fillOrder"
        });
    },
    selectAddress: function() {
        wx.navigateTo({
            url: "/zxsite_shop/address-select/index?source=fillOrder"
        });
    },
    bindChangePayType: function(e) {
        var t = e.detail.value;
        this.data.selPayTypeIndex != t && this.setData({
            selPayType: this.data.payTypeList[t].name,
            selPayTypeIndex: t,
            currentPayType: this.data.payTypeList[t],
            allGoodsAndFreightPrice: 2 == this.data.payTypeList[t].id ? parseFloat(parseFloat(this.data.allGoodsAndFreightPrice) + parseFloat(this.data.deductionBalance)).toFixed(2) : parseFloat(parseFloat(this.data.allGoodsAndFreightPrice) - parseFloat(this.data.deductionBalance)).toFixed(2)
        });
    },
    bindChangeSendType: function(e) {
        this.setData({
            currentSendType: e.currentTarget.dataset.type,
            freightPrice: 0,
            forbidOrder: !0
        }), this.createOrder();
    },
    showMap: function() {
        wx.navigateTo({
            url: "/zxsite_shop/about-us/index"
        });
    }
});