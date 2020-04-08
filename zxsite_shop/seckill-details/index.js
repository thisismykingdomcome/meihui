function _defineProperty(t, e, a) {
    return e in t ? Object.defineProperty(t, e, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = a, t;
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
        time: "",
        seckillStatus: "",
        isOfficialAccount: 0,
        isShowReputation: 1,
        isWechatReview: 0,
        diyForm: []
    },
    onLoad: function(a) {
        var i = this;
        if (util.isEmpty(a.seckill_id)) {
            var t = util.parseUrlString(decodeURIComponent(a.scene));
            a.seckill_id = t.i, a.seckillDate = t.d, a.time = t.t, t.a && (a.agent_id = t.a);
        }
        i.setData({
            seckillDate: a.seckillDate,
            time: a.time,
            seckill_id: a.seckill_id
        }), common.getUserInfo(function(e) {
            if (e) common.getSettings(function(t) {
                common.setCustomNavigationBar(t), common.setCustomTabBar(i, t), i.setData({
                    userInfo: e,
                    shop_service: t.shop_service,
                    shop_server_url: t.shop_server_url,
                    isOfficialAccount: t.is_official_account,
                    isShowReputation: t.is_show_reputation,
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
            }), i.getGoodsDetail(a.seckill_id, a.seckillDate, a.time), i.getCommissionAgent(), 
            a.agent_id && i.handleCommissionMember(a.agent_id); else {
                var t = "/zxsite_shop/start/start?url=/zxsite_shop/seckill-details/index&type=redirect&seckill_id=" + a.seckill_id + "&seckillDate=" + a.seckillDate + "&time=" + a.time;
                a.agent_id && (t += "&agent_id=" + a.agent_id), wx.redirectTo({
                    url: t
                });
            }
        });
    },
    getGoodsDetail: function(n, l, u) {
        var c = this;
        app.util.request({
            url: "entry/wxapp/goods-detail",
            data: {
                seckill_id: n,
                seckillDate: l,
                seckillTime: u
            },
            success: function(t) {
                var e = "";
                if (!util.isEmpty(t.data.data.properties) && 0 < t.data.data.properties.length) {
                    for (var a = 0; a < t.data.data.properties.length; a++) e = e + " " + t.data.data.properties[a].name;
                    c.data.selectSize = "选择:", c.setData({
                        hasMoreSelect: !0,
                        selectSize: c.data.selectSize + e,
                        selectSizePrice: t.data.data.price
                    });
                }
                if (!util.isEmpty(t.data.data.diy_form_fields)) for (var i = 0, s = t.data.data.diy_form_fields.length; i < s; ++i) {
                    var o = t.data.data.diy_form_fields[i];
                    if (3 == o.type) o.item = o.value.split("|"), o.value = ""; else if (4 == o.type) {
                        var r = o.value.split("|");
                        o.item = [], o.value = "";
                        for (var d = 0; d < r.length; ++d) o.item.push({
                            value: r[d],
                            checked: !1
                        });
                    } else 7 == o.type && (o.item = []);
                    c.data.diyForm.push(o);
                }
                t.data.data.seckillDate = l, t.data.data.seckill_id = n, c.setData({
                    goodsTimeStatus: t.data.data.activityInfo,
                    goodsDetail: t.data.data,
                    swiperSwitchName: t.data.data.video_url ? "video" : "picture",
                    selectSizePrice: t.data.data.price,
                    buyNumMax: t.data.data.stores,
                    buyNumber: 0 < t.data.data.stores ? 1 : 0,
                    currentType: 0,
                    all_reputation: t.data.data.all_reputation,
                    goodsLabel: t.data.data.goods_label,
                    goodsCover: t.data.data.cover,
                    diyForm: c.data.diyForm,
                    hideLoading: !0,
                    autoplay: !t.data.data.video_url
                }), WxParse.wxParse("article", "html", t.data.data.content, c, 5), 1 == t.data.data.activityInfo && 0 < t.data.data.seckill_surplus && (c.setData({
                    shopType: "tobuy",
                    buyNumMax: 1
                }), c.countDown()), app.util.request({
                    url: "entry/wxapp/member-action",
                    data: {
                        type: 1,
                        path: "zxsite_shop/seckill-details/index?seckill_id=" + n + "&seckillDate=" + l + "&time=" + u,
                        description: "秒杀[" + t.data.data.title + "]"
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
        var e = wx.createVideoContext("video");
        "video" == t.currentTarget.dataset.name ? e.play() : e.pause();
    },
    onVideoError: function(t) {
        console.log(t);
    },
    statusTap: function(t) {
        var e = t.currentTarget.dataset.goodsId;
        0 == t.currentTarget.dataset.index ? this.getGoodsDetail(this.data.seckill_id, this.data.seckillDate, this.data.time) : this.getReputationList(e);
    },
    getReputationList: function(t) {
        var e = this;
        app.util.request({
            url: "entry/wxapp/reputation-list",
            data: {
                goods_id: t
            },
            success: function(t) {
                t.data.data ? e.setData({
                    reputation: t.data.data,
                    currentType: 1
                }) : e.setData({
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
            var e = parseInt(t.detail.value);
            e < this.data.buyNumMin ? this.setData({
                buyNumber: this.data.buyNumMin
            }) : e > this.data.buyNumMax ? this.setData({
                buyNumber: this.data.buyNumMax
            }) : this.setData({
                buyNumber: e
            });
        }
    },
    labelItemTap: function(e) {
        for (var a = this, t = a.data.goodsDetail.properties[e.currentTarget.dataset.propertyindex].childs, i = 0; i < t.length; i++) a.data.goodsDetail.properties[e.currentTarget.dataset.propertyindex].childs[i].active = !1;
        a.data.goodsDetail.properties[e.currentTarget.dataset.propertyindex].childs[e.currentTarget.dataset.propertychildindex].active = !0;
        var s = a.data.goodsDetail.properties.length, o = 0, r = "", d = "";
        for (i = 0; i < a.data.goodsDetail.properties.length; i++) {
            t = a.data.goodsDetail.properties[i].childs;
            for (var n = 0; n < t.length; n++) t[n].active && (o++, "" != r && (r += ","), r = r + a.data.goodsDetail.properties[i].id + ":" + t[n].id, 
            d = d + a.data.goodsDetail.properties[i].name + ":" + t[n].name + "  ");
        }
        var l = !1;
        s == o && (l = !0), l && app.util.request({
            url: "entry/wxapp/goods-price",
            data: {
                id: a.data.goodsDetail.id,
                property_ids: r
            },
            success: function(t) {
                t.data.data.stores = 1, a.setData({
                    selectSizePrice: t.data.data.price,
                    propertyIds: r,
                    propertyNames: d,
                    buyNumMax: t.data.data.stores,
                    buyNumber: 0 < t.data.data.stores ? 1 : 0,
                    goodsCover: t.data.data.cover ? t.data.data.cover : e.currentTarget.dataset.goodscover
                });
            }
        }), this.setData({
            goodsDetail: a.data.goodsDetail,
            canSubmit: l
        });
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
        if (!util.isEmpty(this.data.goodsDetail.diy_form_fields)) for (var t = 0, e = this.data.diyForm.length; t < e; ++t) {
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
            var a = this.buliduBuyNowInfo();
            wx.setStorage({
                key: "buyNowInfo",
                data: a
            }), this.closePopupTap(), wx.navigateTo({
                url: "/zxsite_shop/to-pay-order/index?orderType=buyNow"
            });
        }
    },
    buliduBuyNowInfo: function() {
        var t = {};
        t.id = this.data.goodsDetail.id, t.categoryId = this.data.goodsDetail.category_id, 
        t.barCode = this.data.goodsDetail.bar_code, t.cover = this.data.goodsDetail.cover, 
        t.pictures = this.data.goodsDetail.pictures, t.title = this.data.goodsDetail.title, 
        t.subTitle = this.data.goodsDetail.sub_title, t.type = this.data.goodsDetail.type, 
        t.propertyIds = this.data.propertyIds, t.propertyNames = this.data.propertyNames, 
        t.price = this.data.goodsDetail.seckill_price, t.isSeckill = 1, t.marketPrice = this.data.goodsDetail.market_price, 
        t.left = "", t.active = !0, t.number = this.data.buyNumber, t.template_id = this.data.goodsDetail.template_id, 
        t.freight = this.data.goodsDetail.freight, t.weight = this.data.goodsDetail.weight, 
        t.is_cash = this.data.goodsDetail.is_cash, t.diyForm = "";
        for (var e = 0, a = this.data.diyForm.length; e < a; ++e) 0 < e && (t.diyForm += ";"), 
        7 == this.data.diyForm[e].type && (this.data.diyForm[e].value = this.data.diyForm[e].item.join(",")), 
        t.diyForm += this.data.diyForm[e].name + "|" + this.data.diyForm[e].value;
        var i = {};
        return i.shopNum || (i.shopNum = 0), i.shopList || (i.shopList = []), i.shopList.push(t), 
        i;
    },
    onShareAppMessage: function() {
        var t = "/zxsite_shop/seckill-details/index?seckill_id=" + this.data.seckill_id + "&seckillDate=" + this.data.seckillDate + "&time=" + this.data.time;
        return this.data.agent && (t += "&agent_id=" + this.data.agent.id), {
            title: this.data.goodsDetail.title,
            path: t,
            imageUrl: this.data.goodsDetail.share_image_url ? this.data.goodsDetail.share_image_url : this.data.goodsDetail.cover,
            success: function(t) {},
            fail: function(t) {}
        };
    },
    countDown: function() {
        var t = new Date(), e = t.getTime(), a = (new Date(t.getFullYear(), t.getMonth() + 1, t.getDate(), t.getHours(), 59, 59).getTime() - e) / 1e3, i = parseInt(a % 86400 % 3600 / 60), s = parseInt(a % 86400 % 3600 % 60);
        this.data.goodsDetail.countdown = this.timeFormat(i) + "分" + this.timeFormat(s) + "秒", 
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
            url: "/zxsite_shop/generating-poster/index?id=" + this.data.goodsDetail.id + "&from=seckillDetail&seckillId=" + this.data.seckill_id + "&seckillDate=" + this.data.seckillDate + "&time=" + this.data.time
        });
    },
    cancelMask: function() {
        this.setData({
            maskShow: "none"
        });
    },
    setSeckillRemind: function(t) {
        var e = this, a = t.currentTarget.dataset.seckillId, i = t.currentTarget.dataset.seckillDate, s = t.currentTarget.dataset.time;
        app.util.request({
            url: "entry/wxapp/seckill-remind",
            showLoading: !1,
            data: {
                seckill_id: a,
                form_id: t.detail.formId,
                time: s,
                seckill_date: i
            },
            success: function(t) {
                wx.showToast({
                    title: "设置成功",
                    icon: "success",
                    duration: 2e3
                }), e.data.goodsDetail.remind = 1, e.data.goodsDetail.seckill_remind_id = t.data.data.remind_id, 
                e.setData({
                    goodsDetail: e.data.goodsDetail
                });
            }
        });
    },
    cancelSeckillRemind: function(t) {
        var e = this, a = t.currentTarget.dataset.seckillRemindId;
        app.util.request({
            url: "entry/wxapp/seckill-cancle-remind",
            showLoading: !1,
            data: {
                seckill_remind_id: a
            },
            success: function(t) {
                wx.showToast({
                    title: "取消成功",
                    icon: "success",
                    duration: 2e3
                }), e.data.goodsDetail.remind = 0, e.setData({
                    goodsDetail: e.data.goodsDetail
                });
            }
        });
    },
    getCommissionAgent: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/commission-agent",
            showLoading: !1,
            data: {
                status: 5
            },
            success: function(t) {
                e.setData({
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
        var e = "diyForm[" + t.currentTarget.dataset.index + "].value";
        this.setData(_defineProperty({}, e, t.detail.value));
    },
    bindRadioTap: function(t) {
        var e = "diyForm[" + t.currentTarget.dataset.index + "].value";
        this.setData(_defineProperty({}, e, t.currentTarget.dataset.value));
    },
    bindCheckBoxTap: function(t) {
        for (var e = t.currentTarget.dataset.index, a = this.data.diyForm[t.currentTarget.dataset.index].item, i = "", s = 0, o = a.length; s < o; ++s) {
            if (a[s].value == t.currentTarget.dataset.value.value) {
                var r = "diyForm[" + e + "].item[" + s + "].checked";
                this.setData(_defineProperty({}, r, !t.currentTarget.dataset.value.checked));
            }
            a[s].checked && (util.isEmpty(i) || (i += ","), i += a[s].value);
        }
        this.data.diyForm[e].value = i;
    },
    bindDateChange: function(t) {
        var e = "diyForm[" + t.currentTarget.dataset.index + "].value";
        this.setData(_defineProperty({}, e, t.detail.value));
    },
    bindTimeChange: function(t) {
        var e = "diyForm[" + t.currentTarget.dataset.index + "].value";
        this.setData(_defineProperty({}, e, t.detail.value));
    },
    bindChooseImage: function(s) {
        var o = this, a = app.util.url("entry/wxapp/upload", {
            m: "zxsite_shop"
        });
        wx.chooseImage({
            count: 1,
            sizeType: [ "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(t) {
                app.util.showLoading();
                var e = t.tempFilePaths[0];
                wx.uploadFile({
                    url: a,
                    filePath: e,
                    name: "upfile",
                    formData: {},
                    success: function(t) {
                        var e = JSON.parse(t.data);
                        wx.hideNavigationBarLoading(), wx.hideLoading();
                        var a = s.currentTarget.dataset.index;
                        o.data.diyForm[a].item.push(e.data.url);
                        var i = "diyForm[" + a + "].item";
                        o.setData(_defineProperty({}, i, o.data.diyForm[a].item));
                    },
                    fail: function(t) {
                        wx.hideNavigationBarLoading(), wx.hideLoading(), app.util.message(t, null, "error");
                    }
                });
            }
        });
    },
    bindDeleteImage: function(t) {
        var e = t.currentTarget.dataset.index;
        this.data.diyForm[e].item.splice(t.currentTarget.dataset.imageIndex, 1);
        var a = "diyForm[" + e + "].item";
        this.setData(_defineProperty({}, a, this.data.diyForm[e].item));
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