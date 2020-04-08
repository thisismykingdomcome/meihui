function _defineProperty(t, a, e) {
    return a in t ? Object.defineProperty(t, a, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[a] = e, t;
}

var app = getApp(), common = require("../../utils/common.js"), util = require("../../utils/util.js"), WxParse = require("../../wxParse/wxParse.js");

Page({
    data: {
        hideLoading: !1,
        autoplay: !0,
        goodsDetail: {},
        swiperSwitchName: "picture",
        hasMoreSelect: !1,
        selectSize: "选择：",
        selectSizePrice: 0,
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
        shopType: "addShopCar",
        reputation: {},
        statusType: [ "商品详情", "商品评价" ],
        currentType: 0,
        all_reputation: 0,
        goodsLabel: {},
        goodsCover: "",
        maskShow: "none",
        isOfficialAccount: 0,
        isShowReputation: 1,
        isWechatReview: 0,
        diyForm: [],
        textCharge: "佣金",
        textUnion: "元"
    },
    onLoad: function(e) {
        var i = this;
        if (util.isEmpty(e.id)) {
            var t = util.parseUrlString(decodeURIComponent(e.scene));
            e.id = t.id, t.a && (e.agent_id = t.a);
        }
        common.getUserInfo(function(a) {
            if (a) common.getSettings(function(t) {
                common.setCustomNavigationBar(t), common.setCustomTabBar(i, t), i.setData({
                    userInfo: a,
                    shop_service: t.shop_service,
                    shop_server_url: t.shop_server_url,
                    goodsId: e.id,
                    isOfficialAccount: t.is_official_account,
                    isShowReputation: t.is_show_reputation,
                    isWechatReview: t.is_wechat_review,
                    themeColor: t.theme_color ? t.theme_color : "#f44",
                    themeSubColor: t.theme_sub_color ? t.theme_sub_color : "#ff976a",
                    backgroundColor: t.background_color ? t.background_color : "#f8f8f8",
                    textCharge: t.commission_text_charge ? t.commission_text_charge : "佣金",
                    textUnion: t.commission_text_union ? t.commission_text_union : "元"
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
    getGoodsDetail: function(n) {
        var u = this;
        app.util.request({
            url: "entry/wxapp/goods-detail",
            data: {
                id: n
            },
            success: function(t) {
                var a = "";
                if (!util.isEmpty(t.data.data.properties) && 0 < t.data.data.properties.length) {
                    for (var e = 0; e < t.data.data.properties.length; e++) a = a + " " + t.data.data.properties[e].name;
                    u.data.selectSize = "选择:", u.setData({
                        hasMoreSelect: !0,
                        selectSize: u.data.selectSize + a,
                        selectSizePrice: t.data.data.price
                    });
                }
                if (!util.isEmpty(t.data.data.diy_form_fields)) for (var i = 0, o = t.data.data.diy_form_fields.length; i < o; ++i) {
                    var s = t.data.data.diy_form_fields[i];
                    if (3 == s.type) s.item = s.value.split("|"), s.value = ""; else if (4 == s.type) {
                        var r = s.value.split("|");
                        s.item = [], s.value = "";
                        for (var d = 0; d < r.length; ++d) s.item.push({
                            value: r[d],
                            checked: !1
                        });
                    } else 7 == s.type && (s.item = []);
                    u.data.diyForm.push(s);
                }
                u.setData({
                    goodsDetail: t.data.data,
                    swiperSwitchName: t.data.data.video_url ? "video" : "picture",
                    selectSizePrice: t.data.data.price,
                    buyNumMax: t.data.data.stores,
                    buyNumber: 0 < t.data.data.stores ? 1 : 0,
                    currentType: 0,
                    all_reputation: t.data.data.all_reputation,
                    goodsLabel: t.data.data.goods_label,
                    goodsCover: t.data.data.cover,
                    diyForm: u.data.diyForm,
                    hideLoading: !0,
                    autoplay: !t.data.data.video_url
                }), WxParse.wxParse("article", "html", t.data.data.content, u, 5), 1 == t.data.data.seckill_status && 0 < t.data.data.seckill_surplus && (u.setData({
                    shopType: "tobuy",
                    buyNumMax: 1
                }), u.countDown()), app.util.request({
                    url: "entry/wxapp/member-action",
                    data: {
                        type: 1,
                        path: "zxsite_shop/goods-details/index?id=" + n,
                        description: "商品[" + t.data.data.title + "]"
                    },
                    showLoading: !1
                });
            }
        });
    },
    onSwiperSwitch: function(t) {
        this.setData({
            swiperSwitchName: t.currentTarget.dataset.name,
            autoplay: "video" != t.currentTarget.dataset.name
        });
        var a = wx.createVideoContext("video");
        "video" == t.currentTarget.dataset.name ? a.play() : a.pause();
    },
    onVideoError: function(t) {
        console.log(t);
    },
    statusTap: function(t) {
        var a = this.data.goodsDetail.id;
        0 == t.currentTarget.dataset.index ? this.getGoodsDetail(a) : this.getReputationList(a);
    },
    getReputationList: function(t) {
        var a = this;
        app.util.request({
            url: "entry/wxapp/reputation-list",
            data: {
                goods_id: t
            },
            success: function(t) {
                t.data.data ? a.setData({
                    reputation: t.data.data,
                    currentType: 1
                }) : a.setData({
                    reputation: [],
                    currentType: 1
                });
            }
        });
    },
    goShopCar: function() {
        wx.navigateTo({
            url: "/zxsite_shop/shop-cart/index"
        });
    },
    goHome: function() {
        wx.reLaunch({
            url: "/zxsite_shop/index/index"
        });
    },
    toAddShopCar: function() {
        this.setData({
            shopType: "addShopCar"
        }), this.bindGuiGeTap();
    },
    tobuy: function() {
        this.setData({
            shopType: "tobuy"
        }), this.bindGuiGeTap();
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
        if (!util.isEmpty(t.detail.value)) {
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
    labelItemTap: function(a) {
        for (var e = this, t = e.data.goodsDetail.properties[a.currentTarget.dataset.propertyindex].childs, i = 0; i < t.length; i++) e.data.goodsDetail.properties[a.currentTarget.dataset.propertyindex].childs[i].active = !1;
        e.data.goodsDetail.properties[a.currentTarget.dataset.propertyindex].childs[a.currentTarget.dataset.propertychildindex].active = !0;
        var o = e.data.goodsDetail.properties.length, s = 0, r = "", d = "";
        for (i = 0; i < e.data.goodsDetail.properties.length; i++) {
            t = e.data.goodsDetail.properties[i].childs;
            for (var n = 0; n < t.length; n++) t[n].active && (s++, "" != r && (r += ","), r = r + e.data.goodsDetail.properties[i].id + ":" + t[n].id, 
            d = d + e.data.goodsDetail.properties[i].name + ":" + t[n].name + "  ");
        }
        var u = !1;
        o == s && (u = !0), u && app.util.request({
            url: "entry/wxapp/goods-price",
            data: {
                id: e.data.goodsDetail.id,
                property_ids: r
            },
            success: function(t) {
                1 == e.data.goodsDetail.seckill_status && 0 < e.data.goodsDetail.seckill_surplus && (t.data.data.stores = 1), 
                e.setData({
                    selectSizePrice: t.data.data.price,
                    propertyIds: r,
                    propertyNames: d,
                    buyNumMax: t.data.data.stores,
                    buyNumber: 0 < t.data.data.stores ? 1 : 0,
                    goodsCover: t.data.data.cover ? t.data.data.cover : a.currentTarget.dataset.goodscover
                }), t.data.data.original_price && e.setData(_defineProperty({}, "goodsDetail.original_price", t.data.data.original_price));
            }
        }), this.setData({
            goodsDetail: e.data.goodsDetail,
            canSubmit: u
        });
    },
    addShopCar: function() {
        if (!util.isEmpty(this.data.goodsDetail.properties) && 0 < this.data.goodsDetail.properties.length && !this.data.canSubmit) return this.data.canSubmit || wx.showToast({
            title: "请选择商品规格",
            icon: "none",
            duration: 2e3
        }), void this.bindGuiGeTap();
        if (!util.isEmpty(this.data.goodsDetail.diy_form_fields)) for (var t = 0, a = this.data.diyForm.length; t < a; ++t) {
            if (1 == this.data.diyForm[t].required && util.isEmpty(this.data.diyForm[t].value)) return void wx.showToast({
                title: "请" + (1 == this.data.diyForm[t].type || 2 == this.data.diyForm[t].type ? "填写" : "选择") + this.data.diyForm[t].name,
                icon: "none",
                duration: 2e3
            });
            if (7 == this.data.diyForm[t].type && 1 == this.data.diyForm[t].required && 0 == this.data.diyForm[t].item.length) return void wx.showToast({
                title: "请上传" + this.data.diyForm[t].name,
                icon: "none",
                duration: 2e3
            });
        }
        if (this.data.buyNumber < 1) wx.showToast({
            title: "购买数量不能为0",
            icon: "none",
            duration: 2e3
        }); else {
            var e = this.bulidShopCarInfo();
            this.setData({
                shopCarInfo: e,
                shopNum: e.shopNum
            }), wx.setStorage({
                key: "shopCarInfo",
                data: e
            }), this.closePopupTap(), wx.showToast({
                title: "加入购物车成功",
                icon: "success",
                duration: 2e3
            }), 0 < e.shopNum && wx.setTabBarBadge({
                index: 1,
                text: e.shopNum.toString()
            }), app.util.request({
                url: "entry/wxapp/wow-cart-import",
                showLoading: !1,
                data: {
                    shop_cart_map: e.shopList[e.shopList.length - 1]
                }
            });
        }
    },
    buyNow: function() {
        if (!util.isEmpty(this.data.goodsDetail.properties) && 0 < this.data.goodsDetail.properties.length && !this.data.canSubmit) return this.data.canSubmit || wx.showToast({
            title: "请选择商品规格",
            icon: "none",
            duration: 2e3
        }), this.bindGuiGeTap(), void wx.showToast({
            title: "请先选择规格尺寸",
            icon: "none",
            duration: 2e3
        });
        if (!util.isEmpty(this.data.goodsDetail.diy_form_fields)) for (var t = 0, a = this.data.diyForm.length; t < a; ++t) {
            if (1 == this.data.diyForm[t].required && util.isEmpty(this.data.diyForm[t].value)) return void wx.showToast({
                title: "请" + (1 == this.data.diyForm[t].type || 2 == this.data.diyForm[t].type ? "填写" : "选择") + this.data.diyForm[t].name,
                icon: "none",
                duration: 2e3
            });
            if (7 == this.data.diyForm[t].type && 1 == this.data.diyForm[t].required && 0 == this.data.diyForm[t].item.length) return void wx.showToast({
                title: "请上传" + this.data.diyForm[t].name,
                icon: "none",
                duration: 2e3
            });
        }
        if (this.data.buyNumber < 1) wx.showToast({
            title: "购买数量不能为0",
            icon: "none",
            duration: 2e3
        }); else {
            var e = this.buliduBuyNowInfo();
            wx.setStorage({
                key: "buyNowInfo",
                data: e
            }), this.closePopupTap(), wx.navigateTo({
                url: "/zxsite_shop/to-pay-order/index?orderType=buyNow"
            });
        }
    },
    bulidShopCarInfo: function() {
        var t = {};
        t.id = this.data.goodsDetail.id, t.categoryId = this.data.goodsDetail.category_id, 
        t.barCode = this.data.goodsDetail.bar_code, t.cover = this.data.goodsCover, t.pictures = this.data.goodsDetail.pictures, 
        t.title = this.data.goodsDetail.title, t.subTitle = this.data.goodsDetail.sub_title, 
        t.type = this.data.goodsDetail.type, t.propertyIds = this.data.propertyIds, t.propertyNames = this.data.propertyNames, 
        t.isSeckill = 0, t.price = this.data.selectSizePrice, t.marketPrice = this.data.goodsDetail.market_price, 
        t.left = "", t.active = !0, t.number = this.data.buyNumber, t.template_id = this.data.goodsDetail.template_id, 
        t.freight = this.data.goodsDetail.freight, t.weight = this.data.goodsDetail.weight, 
        t.is_cash = this.data.goodsDetail.is_cash, t.integralGive = this.data.goodsDetail.integral_give, 
        t.diyForm = "";
        for (var a = 0, e = this.data.diyForm.length; a < e; ++a) 0 < a && (t.diyForm += ";"), 
        7 == this.data.diyForm[a].type && (this.data.diyForm[a].value = this.data.diyForm[a].item.join()), 
        t.diyForm += this.data.diyForm[a].name + "|" + this.data.diyForm[a].value;
        var i = this.data.shopCarInfo;
        i.shopNum || (i.shopNum = 0), i.shopList || (i.shopList = []);
        for (var o = -1, s = 0; s < i.shopList.length; s++) {
            var r = i.shopList[s];
            if (r.id == t.id && r.propertyIds == t.propertyIds) {
                o = s, t.number = parseInt(t.number) + parseInt(r.number);
                break;
            }
        }
        return i.shopNum = parseInt(i.shopNum) + parseInt(this.data.buyNumber), -1 < o ? i.shopList.splice(o, 1, t) : i.shopList.push(t), 
        i;
    },
    buliduBuyNowInfo: function() {
        var t = {};
        t.id = this.data.goodsDetail.id, t.categoryId = this.data.goodsDetail.category_id, 
        t.barCode = this.data.goodsDetail.bar_code, t.cover = this.data.goodsCover, t.pictures = this.data.goodsDetail.pictures, 
        t.title = this.data.goodsDetail.title, t.subTitle = this.data.goodsDetail.sub_title, 
        t.type = this.data.goodsDetail.type, t.propertyIds = this.data.propertyIds, t.propertyNames = this.data.propertyNames, 
        1 == this.data.goodsDetail.seckill_status && 0 < this.data.goodsDetail.seckill_surplus ? (t.price = this.data.goodsDetail.seckill_price, 
        t.isSeckill = 1) : (t.price = this.data.selectSizePrice, t.isSeckill = 0), t.marketPrice = this.data.goodsDetail.market_price, 
        t.left = "", t.active = !0, t.number = this.data.buyNumber, t.template_id = this.data.goodsDetail.template_id, 
        t.freight = this.data.goodsDetail.freight, t.weight = this.data.goodsDetail.weight, 
        t.is_cash = this.data.goodsDetail.is_cash, t.integralGive = this.data.goodsDetail.integral_give, 
        t.diyForm = "";
        for (var a = 0, e = this.data.diyForm.length; a < e; ++a) 0 < a && (t.diyForm += ";"), 
        7 == this.data.diyForm[a].type && (this.data.diyForm[a].value = this.data.diyForm[a].item.join(",")), 
        t.diyForm += this.data.diyForm[a].name + "|" + this.data.diyForm[a].value;
        var i = {};
        return i.shopNum || (i.shopNum = 0), i.shopList || (i.shopList = []), i.shopList.push(t), 
        i;
    },
    onShareAppMessage: function(t) {
        var a = "/zxsite_shop/goods-details/index?id=" + this.data.goodsDetail.id;
        return this.data.agent && (a += "&agent_id=" + this.data.agent.id), {
            title: this.data.goodsDetail.title,
            path: a,
            imageUrl: this.data.goodsDetail.share_image_url ? this.data.goodsDetail.share_image_url : this.data.goodsDetail.cover,
            success: function(t) {},
            fail: function(t) {}
        };
    },
    countDown: function() {
        var t = new Date(), a = t.getTime(), e = (new Date(t.getFullYear(), t.getMonth() + 1, t.getDate(), t.getHours(), 59, 59).getTime() - a) / 1e3, i = parseInt(e % 86400 % 3600 / 60), o = parseInt(e % 86400 % 3600 % 60);
        this.data.goodsDetail.countdown = this.timeFormat(i) + "分" + this.timeFormat(o) + "秒", 
        this.setData({
            goodsDetail: this.data.goodsDetail
        }), setTimeout(this.countDown, 1e3);
    },
    timeFormat: function(t) {
        return t < 10 ? "0" + t : t;
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
    onCopyText: function() {
        var a = this;
        wx.setClipboardData({
            data: this.data.goodsDetail.copy_text,
            success: function(t) {
                a.setData({
                    maskShow: "none"
                });
            }
        });
    },
    getCommissionAgent: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/commission-agent",
            showLoading: !1,
            data: {
                status: 5
            },
            success: function(t) {
                a.setData({
                    agent: t.data.data
                });
            }
        });
    },
    handleCommissionMember: function(t) {
        app.util.request({
            url: "entry/wxapp/commission-member-create",
            showLoading: !1,
            data: {
                agent_id: t
            }
        });
    },
    bindTextInput: function(t) {
        var a = "diyForm[" + t.currentTarget.dataset.index + "].value";
        this.setData(_defineProperty({}, a, t.detail.value));
    },
    bindRadioTap: function(t) {
        var a = "diyForm[" + t.currentTarget.dataset.index + "].value";
        this.setData(_defineProperty({}, a, t.currentTarget.dataset.value));
    },
    bindCheckBoxTap: function(t) {
        for (var a = t.currentTarget.dataset.index, e = this.data.diyForm[t.currentTarget.dataset.index].item, i = "", o = 0, s = e.length; o < s; ++o) {
            if (e[o].value == t.currentTarget.dataset.value.value) {
                var r = "diyForm[" + a + "].item[" + o + "].checked";
                this.setData(_defineProperty({}, r, !t.currentTarget.dataset.value.checked));
            }
            e[o].checked && (util.isEmpty(i) || (i += ","), i += e[o].value);
        }
        this.data.diyForm[a].value = i;
    },
    bindDateChange: function(t) {
        var a = "diyForm[" + t.currentTarget.dataset.index + "].value";
        this.setData(_defineProperty({}, a, t.detail.value));
    },
    bindTimeChange: function(t) {
        var a = "diyForm[" + t.currentTarget.dataset.index + "].value";
        this.setData(_defineProperty({}, a, t.detail.value));
    },
    bindChooseImage: function(o) {
        var s = this, e = app.util.url("entry/wxapp/upload", {
            m: "zxsite_shop"
        });
        wx.chooseImage({
            count: 1,
            sizeType: [ "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(t) {
                app.util.showLoading();
                var a = t.tempFilePaths[0];
                wx.uploadFile({
                    url: e,
                    filePath: a,
                    name: "upfile",
                    formData: {},
                    success: function(t) {
                        var a = JSON.parse(t.data);
                        wx.hideNavigationBarLoading(), wx.hideLoading();
                        var e = o.currentTarget.dataset.index;
                        s.data.diyForm[e].item.push(a.data.url);
                        var i = "diyForm[" + e + "].item";
                        s.setData(_defineProperty({}, i, s.data.diyForm[e].item));
                    },
                    fail: function(t) {
                        wx.hideNavigationBarLoading(), wx.hideLoading(), app.util.message(t, null, "error");
                    }
                });
            }
        });
    },
    bindDeleteImage: function(t) {
        var a = t.currentTarget.dataset.index;
        this.data.diyForm[a].item.splice(t.currentTarget.dataset.imageIndex, 1);
        var e = "diyForm[" + a + "].item";
        this.setData(_defineProperty({}, e, this.data.diyForm[a].item));
    },
    bindPreviewImage: function(t) {
        wx.previewImage({
            urls: [ t.currentTarget.dataset.src ]
        });
    },
    onPreviewSwiperImage: function(t) {
        wx.previewImage({
            urls: this.data.goodsDetail.pictures,
            current: t.currentTarget.dataset.image
        });
    }
});