function _defineProperty(t, a, e) {
    return a in t ? Object.defineProperty(t, a, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[a] = e, t;
}

var app = getApp();

Page({
    data: {
        hideLoading: !1,
        goodsDetail: {},
        shopNum: 0,
        hideShopPopup: !0,
        buyNumber: 0,
        buyNumMin: 1,
        buyNumMax: 0,
        themeColor: "#f44",
        themeSubColor: "#ff976a",
        backgroundColor: "#f8f8f8",
        shop_server_url: "",
        shop_service: "",
        propertyIds: "",
        propertyNames: "",
        canSubmit: !1,
        shopCarInfo: {},
        maskShow: "none",
        isOfficialAccount: 0,
        isWechatReview: 0,
        diyForm: []
    },
    onLoad: function(e) {
        var i = this;
        if (app.utils.util.isEmpty(e.id)) {
            var t = app.utils.util.parseUrlString(decodeURIComponent(e.scene));
            e.id = t.id, t.agent_id && (e.agent_id = t.agent_id);
        }
        app.utils.common.getUserInfo(function(a) {
            if (a) app.utils.common.getSettings(function(t) {
                app.utils.common.setCustomNavigationBar(t), app.utils.common.setCustomTabBar(i, t), 
                i.setData({
                    userInfo: a,
                    shop_service: t.shop_service,
                    shop_server_url: t.shop_server_url,
                    goodsId: e.id,
                    isOfficialAccount: t.is_official_account,
                    isWechatReview: t.is_wechat_review,
                    themeColor: t.theme_color ? t.theme_color : "#f44",
                    themeSubColor: t.theme_sub_color ? t.theme_sub_color : "#ff976a",
                    backgroundColor: t.background_color ? t.background_color : "#f8f8f8"
                });
            }), wx.getStorage({
                key: "shopCarInfo",
                success: function(t) {
                    i.setData({
                        shopCarInfo: t.data,
                        shopNum: parseInt(t.data.shopNum)
                    });
                }
            }), i.getGoodsDetail(e.id), i.getCommissionAgent(), e.agent_id && i.handleCommissionMember(e.agent_id); else {
                var t = "/zxsite_shop/start/start?url=/zxsite_shop/goods-details/index&type=redirect&id=" + e.id;
                e.agent_id && (t += "&agent_id=" + e.agent_id), wx.redirectTo({
                    url: t
                });
            }
        });
    },
    getGoodsDetail: function(t) {
        var d = this;
        app.util.request({
            url: "entry/wxapp/credit-shop-goods-detail",
            data: {
                m: "zxsite_shop",
                id: t
            },
            success: function(t) {
                if (!app.utils.util.isEmpty(t.data.data.diy_form_fields)) for (var a = 0, e = t.data.data.diy_form_fields.length; a < e; ++a) {
                    var i = t.data.data.diy_form_fields[a];
                    if (3 == i.type) i.item = i.value.split("|"), i.value = ""; else if (4 == i.type) {
                        var o = i.value.split("|");
                        i.item = [], i.value = "";
                        for (var s = 0; s < o.length; ++s) i.item.push({
                            value: o[s],
                            checked: !1
                        });
                    }
                    d.data.diyForm.push(i);
                }
                d.setData({
                    goodsDetail: t.data.data,
                    buyNumMax: t.data.data.stores,
                    buyNumber: 0 < t.data.data.stores ? 1 : 0,
                    diyForm: d.data.diyForm,
                    hideLoading: !0
                }), app.WxParse.wxParse("article", "html", t.data.data.content, d, 5);
            }
        });
    },
    goHome: function() {
        wx.reLaunch({
            url: "/packages/credit-shop/index/index"
        });
    },
    tobuy: function() {
        this.bindGuiGeTap();
    },
    bindGuiGeTap: function() {
        this.setData({
            hideShopPopup: !1
        });
    },
    closePopupTap: function() {
        this.setData({
            hideShopPopup: !0
        });
    },
    numJianTap: function() {
        if (this.data.buyNumber > this.data.buyNumMin) {
            var t = this.data.buyNumber;
            t--, this.setData({
                buyNumber: t
            });
        }
    },
    numJiaTap: function() {
        if (this.data.buyNumber < this.data.buyNumMax) {
            var t = this.data.buyNumber;
            t++, this.setData({
                buyNumber: t
            });
        }
    },
    numChanageTap: function(t) {
        if (!app.utils.util.isEmpty(t.detail.value)) {
            var a = parseInt(t.detail.value);
            a < this.data.buyNumMin ? this.setData({
                buyNumber: this.data.buyNumMin
            }) : a > this.data.buyNumMax ? this.setData({
                buyNumber: this.data.buyNumMax
            }) : this.setData({
                buyNumber: a
            });
        }
    },
    buyNow: function() {
        if (!app.utils.util.isEmpty(this.data.goodsDetail.diy_form_fields)) for (var t = 0, a = this.data.diyForm.length; t < a; ++t) if (1 == this.data.diyForm[t].required && app.utils.util.isEmpty(this.data.diyForm[t].value)) return void wx.showToast({
            title: "请" + (1 == this.data.diyForm[t].type || 2 == this.data.diyForm[t].type ? "填写" : "选择") + this.data.diyForm[t].name,
            icon: "none",
            duration: 2e3
        });
        if (this.data.buyNumber < 1) wx.showToast({
            title: "兑换数量不能为0",
            icon: "none",
            duration: 2e3
        }); else {
            var e = this.buliduBuyNowInfo();
            wx.setStorage({
                key: "buyNowInfo",
                data: e
            }), this.closePopupTap(), wx.navigateTo({
                url: "/packages/credit-shop/order-confirm/index"
            });
        }
    },
    buliduBuyNowInfo: function() {
        var t = this.data.goodsDetail;
        t.number = this.data.buyNumber, t.diy_form = "";
        for (var a = 0, e = this.data.diyForm.length; a < e; ++a) 0 < a && (t.diy_form += " "), 
        t.diy_form += this.data.diyForm[a].name + ":" + this.data.diyForm[a].value;
        return t;
    },
    onShareAppMessage: function(t) {
        var a = "/packages/credit-shop/goods-detail/index?id=" + this.data.goodsDetail.id;
        return this.data.agent && (a += "&agent_id=" + this.data.agent.id), {
            title: this.data.goodsDetail.title,
            path: a,
            imageUrl: this.data.goodsDetail.share_image_url ? this.data.goodsDetail.share_image_url : this.data.goodsDetail.cover,
            success: function(t) {},
            fail: function(t) {}
        };
    },
    toServerUrl: function(t) {
        wx.navigateTo({
            url: "/zxsite_shop/web-view/index?linkUrl=" + encodeURIComponent(t.currentTarget.dataset.link)
        });
    },
    showMask: function(t) {
        this.setData({
            maskShow: "block"
        });
    },
    openGeneratePage: function() {
        this.setData({
            maskShow: "none"
        }), wx.navigateTo({
            url: "/zxsite_shop/generating-poster/index?from=goodsDetail&id=" + this.data.goodsDetail.id
        });
    },
    cancelMask: function() {
        this.setData({
            maskShow: "none"
        });
    },
    getCommissionAgent: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/commission-agent",
            data: {
                m: "zxsite_shop",
                status: 5
            },
            showLoading: !1,
            success: function(t) {
                a.setData({
                    agent: t.data.data
                });
            }
        });
    },
    handleCommissionMember: function(t) {
        app.util.request(_defineProperty({
            url: "entry/wxapp/commission-member-create",
            data: {
                m: "zxsite_shop"
            },
            showLoading: !1
        }, "data", {
            agent_id: t
        }));
    },
    bindTextInput: function(t) {
        this.data.diyForm[t.currentTarget.dataset.index].value = t.detail.value, this.setData({
            diyForm: this.data.diyForm
        });
    },
    bindRadioTap: function(t) {
        this.data.diyForm[t.currentTarget.dataset.index].value = t.currentTarget.dataset.value, 
        this.setData({
            diyForm: this.data.diyForm
        });
    },
    bindCheckBoxTap: function(t) {
        for (var a = this.data.diyForm[t.currentTarget.dataset.index].item, e = "", i = 0, o = a.length; i < o; ++i) a[i].value == t.currentTarget.dataset.value.value && (a[i].checked = !t.currentTarget.dataset.value.checked), 
        a[i].checked && (0 < i && (e += ","), e += a[i].value);
        this.data.diyForm[t.currentTarget.dataset.index].value = e, this.setData({
            diyForm: this.data.diyForm
        });
    },
    bindDateChange: function(t) {
        this.data.diyForm[t.currentTarget.dataset.index].value = t.detail.value, this.setData({
            diyForm: this.data.diyForm
        });
    },
    bindTimeChange: function(t) {
        this.data.diyForm[t.currentTarget.dataset.index].value = t.detail.value, this.setData({
            diyForm: this.data.diyForm
        });
    }
});