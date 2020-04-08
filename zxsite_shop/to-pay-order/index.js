var app = getApp(), common = require("../../utils/common.js"), util = require("../../utils/util.js");

Page({
    data: {
        themeColor: "#f44",
        backgroundColor: "#f8f8f8",
        goodsList: [],
        isNeedLogistics: !1,
        isBook: !1,
        allGoodsPrice: 0,
        freightPrice: 0,
        deliveryType: 0,
        allGoodsAndFreightPrice: 0,
        goodsJsonStr: "",
        orderType: "",
        hasCoupon: !1,
        forbidOrder: !0,
        selCoupon: "请选择优惠券",
        selCouponIndex: 0,
        couponList: [],
        couponCount: 0,
        currentCoupon: null,
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
        settings: {},
        shopStore: {},
        isSelectStore: !0,
        sendType: [],
        currentSendType: 1,
        name: "",
        mobile: ""
    },
    onShow: function() {
        var e = this, t = [];
        if ("buyNow" == e.data.orderType) {
            var a = wx.getStorageSync("buyNowInfo");
            a && a.shopList && (t = a.shopList), a && a.groupsOrderId && e.setData({
                groupsOrderId: a.groupsOrderId
            });
        } else if ("quick" == e.data.orderType) {
            (i = wx.getStorageSync("quick-cart")) && i.shopList && (t = i.shopList.filter(function(t) {
                return t.active;
            }));
        } else {
            var i;
            (i = wx.getStorageSync("shopCarInfo")) && i.shopList && (t = i.shopList.filter(function(t) {
                return t.active;
            }));
        }
        e.setData({
            goodsList: t,
            selCoupon: "请选择优惠券",
            selCouponIndex: 0,
            currentCoupon: null,
            freightPrice: 0,
            deliveryType: 0,
            hasCoupon: !1,
            forbidOrder: !0
        }), app.util.getUserInfo(function(t) {
            e.initShipping();
        }), app.util.request({
            url: "entry/wxapp/get-member-info",
            showLoading: !1,
            success: function(t) {
                t.data.data && e.setData({
                    mobile: t.data.data.mobile,
                    name: t.data.data.realname
                });
            }
        });
        var o = wx.getStorageSync("shopStore");
        2 != this.data.settings.send_type && 3 != this.data.settings.send_type || o ? e.setData({
            shopStore: o
        }) : app.util.request({
            url: "entry/wxapp/store-list",
            showLoading: !1,
            success: function(t) {
                1 == t.data.data.length && (o = {
                    id: t.data.data[0].id,
                    name: t.data.data[0].name,
                    telephone: t.data.data[0].telephone,
                    address: t.data.data[0].address,
                    latitude: t.data.data[0].latitude,
                    longitude: t.data.data[0].longitude
                }, e.setData({
                    shopStore: o,
                    isSelectStore: !1
                }));
            }
        });
    },
    onLoad: function(t) {
        var e = wx.getStorageSync("settings");
        if (common.setCustomNavigationBar(e), util.isEmpty(e.theme_color) || this.setData({
            themeColor: e.theme_color
        }), util.isEmpty(e.background_color) || this.setData({
            backgroundColor: e.background_color
        }), 1 == e.send_type || 1 == e.overseas_agency) {
            var a = "快递配送";
            1 == e.city_express_enabled && (a = "同城配送"), this.data.sendType = [ {
                name: a,
                type: 1
            } ];
        } else if (2 == e.send_type) this.data.sendType = [ {
            name: "到店取货",
            type: 2
        } ], this.setData({
            currentSendType: 2
        }); else if (3 == e.send_type) {
            var i = "快递配送";
            1 == e.city_express_enabled && (i = "同城配送"), this.data.sendType = [ {
                name: i,
                type: 1
            }, {
                name: "到店取货",
                type: 2
            } ];
        }
        this.setData({
            sendType: this.data.sendType,
            settings: e
        }), util.isEmpty(t.orderType) || this.setData({
            orderType: t.orderType
        });
    },
    createOrder: function(n) {
        wx.showLoading();
        var p = this, t = "";
        if (n && (t = n.detail.value.remark), !p.data.curAddressData && p.data.isNeedLogistics && 1 == p.data.currentSendType) return wx.hideLoading(), 
        void wx.showToast({
            title: "请先设置您的收货地址",
            icon: "none",
            duration: 2e3
        });
        if ((!p.data.shopStore.name || !p.data.shopStore.telephone || !p.data.shopStore.address) && (p.data.isNeedLogistics && 2 == p.data.currentSendType || p.data.isBook)) return wx.hideLoading(), 
        void wx.showToast({
            title: "请先选择取货门店",
            icon: "none",
            duration: 2e3
        });
        var e = {
            goods_json_str: p.data.goodsJsonStr,
            remark: t,
            send_type: this.data.currentSendType
        };
        if (p.data.curAddressData && p.data.isNeedLogistics && 1 == p.data.currentSendType && (e.province = p.data.curAddressData.province, 
        e.city = p.data.curAddressData.city, e.district = p.data.curAddressData.district, 
        1 == p.data.settings.city_express_enabled)) {
            if (util.isEmpty(p.data.curAddressData.latitude) || util.isEmpty(p.data.curAddressData.longitude)) return wx.hideLoading(), 
            void wx.showToast({
                title: "请完善收货地址中位置",
                icon: "none",
                duration: 2e3
            });
            e.latitude = p.data.curAddressData.latitude, e.longitude = p.data.curAddressData.longitude;
        }
        if (p.data.groupsOrderId && (e.groups_order_id = p.data.groupsOrderId), 0 == p.data.isNeedLogistics && (e.send_type = 1), 
        p.data.isNeedLogistics && n) {
            if (!p.data.freightPrice) return wx.hideLoading(), void wx.showToast({
                title: "无法获取配送方式",
                icon: "none",
                duration: 2e3
            });
            if (1 == this.data.currentSendType) e.address = p.data.curAddressData.address, e.name = p.data.curAddressData.name, 
            e.mobile = p.data.curAddressData.mobile; else if (e.mobile = n.detail.value.mobile, 
            e.name = n.detail.value.name, e.province = "", e.city = "", e.district = "", e.shop_address = this.data.shopStore.address, 
            e.shop_name = this.data.shopStore.name, e.shop_telphone = this.data.shopStore.telephone, 
            e.store_id = this.data.shopStore.id, !e.mobile || !e.name) return void wx.showToast({
                title: "姓名、电话不能为空",
                icon: "none",
                duration: 2e3
            });
            if (1 == wx.getStorageSync("settings").overseas_agency) {
                if (util.isEmpty(p.data.curAddressData.identity_code) || util.isEmpty(p.data.curAddressData.identity_photo_front) || util.isEmpty(p.data.curAddressData.identity_photo_back)) return wx.hideLoading(), 
                void wx.showToast({
                    title: "请完善收货地址中身份证信息",
                    icon: "none",
                    duration: 2e3
                });
                e.identity_code = p.data.curAddressData.identity_code, e.identity_photo_front = p.data.curAddressData.identity_photo_front, 
                e.identity_photo_back = p.data.curAddressData.identity_photo_back;
            }
        }
        !p.data.isBook || !n || (e.mobile = n.detail.value.mobile, e.name = n.detail.value.name, 
        e.province = "", e.city = "", e.district = "", e.shop_address = this.data.shopStore.address, 
        e.shop_name = this.data.shopStore.name, e.shop_telphone = this.data.shopStore.telephone, 
        e.store_id = this.data.shopStore.id, e.mobile && e.name) ? (n ? (e.amount = p.data.allGoodsPrice, 
        1 == this.data.currentSendType ? e.freight = p.data.freightPrice : e.freight = 0, 
        e.pay_type = p.data.currentPayType.id, p.data.currentCoupon && (e.fetch_id = p.data.currentCoupon.fetch_id), 
        e.form_id = n.detail.formId) : e.calculate = !0, app.util.request({
            url: "entry/wxapp/order-create",
            data: e,
            method: "POST",
            success: function(t) {
                if (wx.hideLoading(), n && "buyNow" != p.data.orderType) if ("quick" == p.data.orderType) wx.removeStorageSync("quick-cart"); else {
                    for (var e = wx.getStorageSync("shopCarInfo").shopList, a = e.length - 1; 0 <= a; --a) for (var i = 0; i < p.data.goodsList.length; ++i) if (e[a].id == p.data.goodsList[i].id && e[a].propertyIds == p.data.goodsList[i].propertyIds) {
                        e.splice(a, 1);
                        break;
                    }
                    var o = {}, s = 0;
                    o.shopList = e;
                    for (a = 0; a < e.length; a++) s += e[a].number;
                    o.shopNum = s, wx.setStorageSync("shopCarInfo", o);
                }
                if (!n) {
                    p.setData({
                        isNeedLogistics: t.data.data.is_need_logistics,
                        allGoodsPrice: parseFloat(t.data.data.amount).toFixed(2),
                        freightPrice: parseFloat(t.data.data.freight).toFixed(2),
                        deliveryType: t.data.data.delivery_type,
                        forbidOrder: !1
                    }), p.data.memberBalance = parseFloat(t.data.data.balance).toFixed(2);
                    var d = t.data.data.amount;
                    1 == p.data.currentSendType && (d += parseFloat(t.data.data.freight));
                    var r = p.data.memberBalance > d ? d : p.data.memberBalance;
                    return d -= parseFloat(r), p.setData({
                        allGoodsAndFreightPrice: parseFloat(d).toFixed(2),
                        deductionBalance: parseFloat(r).toFixed(2)
                    }), void p.getUserCoupons();
                }
                p.data.isBook ? wx.redirectTo({
                    url: "/packages/book/order/index"
                }) : wx.redirectTo({
                    url: "/zxsite_shop/order-list/index"
                });
            }
        })) : wx.showToast({
            title: "姓名、电话不能为空",
            icon: "none",
            duration: 2e3
        });
    },
    initShipping: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/shipping-default",
            success: function(t) {
                t.data.data ? e.setData({
                    curAddressData: t.data.data
                }) : e.setData({
                    curAddressData: null
                }), e.processFreight();
            }
        });
    },
    processFreight: function() {
        for (var t = this, e = this.data.goodsList, a = "[", i = !1, o = 0, s = !0, d = !1, r = 0; r < e.length; r++) {
            var n = e[r];
            1 == n.type && (i = !0), 0 == n.is_cash && (s = !1), 3 == n.type && (d = !0), o += n.price * n.number;
            var p = "";
            0 < r && (p = ","), p += '{"id":' + n.id + ',"categories":"' + n.categoryId + '","title":"' + n.title + '", "type":' + n.type + ',"cover":"' + n.cover + '","number":' + n.number + ',"property_ids":"' + n.propertyIds + '","property_names":"' + n.propertyNames + '", "price":' + n.price + ', "template_id":' + n.template_id + ', "weight":' + n.weight, 
            util.isEmpty(n.integralGive) || (p += ', "integral_give":' + n.integralGive), util.isEmpty(n.diyForm) || (p += ', "diy_form":"' + n.diyForm + '"'), 
            util.isEmpty(n.subTitle) || (p += ', "sub_title":"' + n.subTitle + '"'), util.isEmpty(n.barCode) || (p += ', "bar_code":"' + n.barCode + '"'), 
            util.isEmpty(n.marketPrice) || (p += ', "market_price":"' + n.marketPrice + '"'), 
            0 < n.pictures.length && (p += ', "pictures":"' + n.pictures.join(",") + '"'), util.isEmpty(n.isSeckill) || (p += ', "is_seckill":' + n.isSeckill), 
            util.isEmpty(n.groupsId) || (p += ', "groups_id":' + n.groupsId), util.isEmpty(n.auctionId) || (p += ', "auction_id":' + n.auctionId), 
            a += p += "}";
        }
        a += "]", t.data.goodsJsonStr = a, t.setData({
            isNeedLogistics: i,
            isBook: d,
            allGoodsAndFreightPrice: parseFloat(o).toFixed(2)
        }), s && t.data.payTypeList.length < 2 && (t.data.payTypeList.push({
            id: 2,
            name: "货到付款"
        }), t.setData({
            payTypeList: t.data.payTypeList
        })), t.createOrder();
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
    getUserCoupons: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/coupon-user",
            data: {
                status: 1
            },
            success: function(t) {
                a.data.couponList = [ {
                    name: "不使用优惠券"
                } ];
                for (var e = 0; e < t.data.data.length; ++e) parseFloat(t.data.data[e].enough) <= parseFloat(a.data.allGoodsPrice) && (1 == t.data.data[e].back_type ? t.data.data[e].name = t.data.data[e].deduct + "元  " + t.data.data[e].name : t.data.data[e].name = t.data.data[e].discount + "折  " + t.data.data[e].name, 
                a.data.couponList.push(t.data.data[e]));
                1 < a.data.couponList.length && a.setData({
                    hasCoupon: !0,
                    couponList: a.data.couponList,
                    couponCount: a.data.couponList.length - 1
                });
            }
        });
    },
    bindChangeCoupon: function(t) {
        var e = t.detail.value;
        if (0 == e) {
            var a = this.data.allGoodsPrice;
            1 == this.data.currentSendType && (a += parseFloat(this.data.freightPrice));
            var i = this.data.memberBalance > a ? a : this.data.memberBalance;
            return a -= parseFloat(i), void this.setData({
                selCoupon: "请选择优惠券",
                selCouponIndex: e,
                currentCoupon: null,
                allGoodsAndFreightPrice: parseFloat(a).toFixed(2),
                deductionBalance: parseFloat(i).toFixed(2)
            });
        }
        if (this.setData({
            selCoupon: this.data.couponList[e].name,
            selCouponIndex: e,
            currentCoupon: this.data.couponList[e]
        }), 1 == this.data.couponList[e].back_type) a = parseFloat(this.data.allGoodsPrice) - parseFloat(this.data.couponList[e].deduct); else a = parseFloat(this.data.allGoodsPrice) * (parseFloat(this.data.couponList[e].discount) / 10);
        1 == this.data.currentSendType && (a += parseFloat(this.data.freightPrice));
        i = this.data.memberBalance > a ? a : this.data.memberBalance;
        a -= parseFloat(i), this.setData({
            allGoodsAndFreightPrice: parseFloat(a).toFixed(2),
            deductionBalance: parseFloat(i).toFixed(2)
        });
    },
    bindChangePayType: function(t) {
        var e = t.detail.value;
        this.data.selPayTypeIndex != e && this.setData({
            selPayType: this.data.payTypeList[e].name,
            selPayTypeIndex: e,
            currentPayType: this.data.payTypeList[e],
            allGoodsAndFreightPrice: 2 == this.data.payTypeList[e].id ? parseFloat(parseFloat(this.data.allGoodsAndFreightPrice) + parseFloat(this.data.deductionBalance)).toFixed(2) : parseFloat(parseFloat(this.data.allGoodsAndFreightPrice) - parseFloat(this.data.deductionBalance)).toFixed(2)
        });
    },
    bindChangeSendType: function(t) {
        this.setData({
            currentSendType: t.currentTarget.dataset.type,
            selCoupon: "请选择优惠券",
            selCouponIndex: 0,
            currentCoupon: null,
            freightPrice: 0,
            deliveryType: 0,
            hasCoupon: !1,
            forbidOrder: !0
        }), this.createOrder();
    },
    onShopStoreTap: function() {
        this.data.isSelectStore ? wx.navigateTo({
            url: "/packages/store/index/index"
        }) : wx.openLocation({
            latitude: parseFloat(this.data.shopStore.latitude),
            longitude: parseFloat(this.data.shopStore.longitude),
            name: this.data.shopStore.shop_name,
            address: this.data.shopStore.address,
            scale: 13
        });
    },
    onCityExpressAreaTap: function() {
        wx.navigateTo({
            url: "/packages/city-express/area/index"
        });
    }
});