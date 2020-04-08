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
        all_reputation: 0,
        statusType: [ "商品详情", "商品评价" ],
        goodsLabel: {},
        goodsCover: "",
        reputation: {},
        maskShow: "none",
        isOfficialAccount: 0,
        isShowReputation: 1,
        isWechatReview: 0,
        diyForm: [],
        ladderPercent: 0
    },
    onLoad: function(e) {
        var i = this;
        if (util.isEmpty(e.id)) {
            var t = util.parseUrlString(decodeURIComponent(e.scene));
            e.id = t.id, t.g && (e.groupsOrderId = t.g), t.a && (e.agent_id = t.a);
        }
        e.groupsOrderId && i.setData({
            groupsOrderId: e.groupsOrderId
        }), common.getUserInfo(function(a) {
            if (a) common.getSettings(function(t) {
                common.setCustomNavigationBar(t), common.setCustomTabBar(i, t), i.setData({
                    userInfo: a,
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
            }), i.getGroupDetail(e.id), i.getCommissionAgent(), e.agent_id && i.handleCommissionMember(e.agent_id); else {
                var t = "/zxsite_shop/start/start?url=/zxsite_shop/groups-details/index&type=redirect&id=" + e.id;
                e.groupsOrderId && (t += "&groupsOrderId=" + e.groupsOrderId), e.agent_id && (t += "&agent_id=" + e.agent_id), 
                wx.redirectTo({
                    url: t
                });
            }
        });
    },
    handleLadderProcess: function() {
        for (var t = this.data.goodsDetail.ladder, a = this.data.groupsParticipate.person_number - this.data.groupsParticipate.wait_number, e = 0, i = 0, r = 0; r < t.length; r++) if (t[r].number > a) {
            i = r;
            break;
        }
        r == t.length && (i = r);
        for (var o = 0; o < i; o++) t[o].active = !0;
        e = 0 == i ? .5 / t.length * 100 : t[i - 1].number < a ? (i + .5) / t.length * 100 : i / t.length * 100, 
        this.setData({
            ladderPercent: e,
            "goodsDetail.ladder": t
        });
    },
    getGroupDetail: function(n) {
        var u = this;
        app.util.request({
            url: "entry/wxapp/groups-detail",
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
                        selectSizePrice: 1 == t.data.data.is_ladder ? t.data.data.price_max : t.data.data.price
                    });
                }
                if (!util.isEmpty(t.data.data.diy_form_fields)) for (var i = 0, r = t.data.data.diy_form_fields.length; i < r; ++i) {
                    var o = t.data.data.diy_form_fields[i];
                    if (3 == o.type) o.item = o.value.split("|"), o.value = ""; else if (4 == o.type) {
                        var s = o.value.split("|");
                        o.item = [], o.value = "";
                        for (var d = 0; d < s.length; ++d) o.item.push({
                            value: s[d],
                            checked: !1
                        });
                    } else 7 == o.type && (o.item = []);
                    u.data.diyForm.push(o);
                }
                u.setData({
                    goodsDetail: t.data.data,
                    swiperSwitchName: t.data.data.video_url ? "video" : "picture",
                    selectSizePrice: 1 == t.data.data.is_ladder ? t.data.data.price_max : t.data.data.price,
                    buyNumMax: t.data.data.stores > t.data.data.buy_num_max ? t.data.data.buy_num_max : t.data.data.stores,
                    buyNumber: 0 < t.data.data.stores ? 1 : 0,
                    currentType: 0,
                    all_reputation: t.data.data.all_reputation,
                    goodsLabel: t.data.data.goods_label,
                    goodsCover: t.data.data.cover,
                    diyForm: u.data.diyForm,
                    hideLoading: !0,
                    autoplay: !t.data.data.video_url
                }), WxParse.wxParse("article", "html", t.data.data.content, u, 5), u.data.groupsOrderId ? app.util.request({
                    url: "entry/wxapp/groups-participate",
                    data: {
                        id: u.data.groupsOrderId
                    },
                    success: function(t) {
                        u.setData({
                            groupsParticipate: t.data.data
                        }), 1 == u.data.goodsDetail.is_ladder && u.handleLadderProcess(), u.countdown();
                    }
                }) : app.util.request({
                    url: "entry/wxapp/groups-process",
                    data: {
                        id: u.data.goodsDetail.id
                    },
                    success: function(t) {
                        u.setData({
                            groupsProcess: t.data.data,
                            groupsProcessCount: t.data.data.length
                        }), u.countdown();
                    }
                }), app.util.request({
                    url: "entry/wxapp/member-action",
                    data: {
                        type: 1,
                        path: "zxsite_shop/groups-details/index?id=" + n,
                        description: "拼团[" + t.data.data.goods_title + "]"
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
        var a = this.data.goodsDetail.goods_id;
        0 == t.currentTarget.dataset.index ? this.getGroupDetail(this.data.goodsDetail.id) : this.getReputationList(a);
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
    tobuy: function(t) {
        this.bindGuiGeTap(t);
    },
    bindGuiGeTap: function(t) {
        this.setData({
            hideShopPopup: !1,
            selectGroupsOrderId: t.currentTarget.dataset.groupsorderid ? t.currentTarget.dataset.groupsorderid : null
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
        var r = e.data.goodsDetail.properties.length, o = 0, s = "", d = "";
        for (i = 0; i < e.data.goodsDetail.properties.length; i++) {
            t = e.data.goodsDetail.properties[i].childs;
            for (var n = 0; n < t.length; n++) t[n].active && (o++, "" != s && (s += ","), s = s + e.data.goodsDetail.properties[i].id + ":" + t[n].id, 
            d = d + e.data.goodsDetail.properties[i].name + ":" + t[n].name + "  ");
        }
        var u = !1;
        r == o && (u = !0), u && app.util.request({
            url: "entry/wxapp/goods-price",
            data: {
                id: e.data.goodsDetail.goods_id,
                property_ids: s
            },
            success: function(t) {
                e.setData({
                    selectSizePrice: 1 == e.data.goodsDetail.is_ladder ? e.data.goodsDetail.price_max : e.data.goodsDetail.price,
                    propertyIds: s,
                    propertyNames: d,
                    buyNumMax: t.data.data.stores > e.data.goodsDetail.buy_num_max ? e.data.goodsDetail.buy_num_max : t.data.data.stores,
                    buyNumber: 0 < t.data.data.stores ? 1 : 0,
                    goodsCover: t.data.data.cover ? t.data.data.cover : a.currentTarget.dataset.goodscover
                });
            }
        }), this.setData({
            goodsDetail: e.data.goodsDetail,
            canSubmit: u
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
    buliduBuyNowInfo: function() {
        var t = {};
        t.id = this.data.goodsDetail.id, t.categoryId = this.data.goodsDetail.category_id, 
        t.barCode = this.data.goodsDetail.bar_code, t.cover = this.data.goodsCover, t.pictures = this.data.goodsDetail.pictures, 
        t.title = this.data.goodsDetail.goods_title, t.subTitle = this.data.goodsDetail.sub_title, 
        t.type = this.data.goodsDetail.type, t.propertyIds = this.data.propertyIds, t.propertyNames = this.data.propertyNames, 
        t.price = this.data.selectSizePrice, t.marketPrice = this.data.goodsDetail.market_price, 
        t.left = "", t.active = !0, t.number = this.data.buyNumber, t.template_id = this.data.goodsDetail.template_id, 
        t.freight = this.data.goodsDetail.freight, t.weight = this.data.goodsDetail.weight, 
        t.is_cash = this.data.goodsDetail.is_cash, t.groupsId = this.data.goodsDetail.id, 
        t.diyForm = "";
        for (var a = 0, e = this.data.diyForm.length; a < e; ++a) 0 < a && (t.diyForm += ";"), 
        7 == this.data.diyForm[a].type && (this.data.diyForm[a].value = this.data.diyForm[a].item.join(",")), 
        t.diyForm += this.data.diyForm[a].name + "|" + this.data.diyForm[a].value;
        var i = {};
        return i.shopNum || (i.shopNum = 0), i.shopList || (i.shopList = []), i.shopList.push(t), 
        this.data.selectGroupsOrderId && (i.groupsOrderId = this.data.selectGroupsOrderId), 
        i;
    },
    onShareAppMessage: function() {
        var t = "/zxsite_shop/groups-details/index?id=" + this.data.goodsDetail.id;
        return this.data.groupsOrderId && (t += "&groupsOrderId=" + this.data.groupsOrderId), 
        this.data.agent && (t += "&agent_id=" + this.data.agent.id), {
            title: this.data.goodsDetail.goods_title,
            path: t,
            imageUrl: this.data.goodsDetail.share_image_url ? this.data.goodsDetail.share_image_url : this.data.goodsDetail.cover,
            success: function(t) {},
            fail: function(t) {}
        };
    },
    countdown: function() {
        var i = this, r = new Date().getTime(), t = new Date(1e3 * this.data.goodsDetail.end_time).getTime(), a = this.countdownCompute(r, t);
        if (this.data.goodsDetail.countdown = this.timeFormat(a.day) + "天" + this.timeFormat(a.hou) + "时" + this.timeFormat(a.min) + "分" + this.timeFormat(a.sec) + "秒", 
        this.setData({
            goodsDetail: this.data.goodsDetail
        }), this.data.groupsOrderId) {
            var e = new Date(1e3 * (parseInt(this.data.groupsParticipate.process_time) + parseInt(3600 * this.data.groupsParticipate.timeout_hours))).getTime();
            a = this.countdownCompute(r, e), this.data.groupsParticipate.countdown = this.timeFormat(a.hou) + ":" + this.timeFormat(a.min) + ":" + this.timeFormat(a.sec), 
            this.setData({
                groupsParticipate: this.data.groupsParticipate
            });
        }
        0 < this.data.groupsProcessCount && (this.data.groupsProcess.forEach(function(t) {
            var a = new Date(1e3 * (parseInt(t.process_time) + parseInt(3600 * t.timeout_hours))).getTime(), e = i.countdownCompute(r, a);
            t.countdown = i.timeFormat(e.hou) + ":" + i.timeFormat(e.min) + ":" + i.timeFormat(e.sec);
        }), this.setData({
            groupsProcess: this.data.groupsProcess
        })), setTimeout(this.countdown, 1e3);
    },
    countdownCompute: function(t, a) {
        var e = null;
        if (0 < a - t) {
            var i = (a - t) / 1e3;
            e = {
                day: parseInt(i / 86400),
                hou: parseInt(i % 86400 / 3600),
                min: parseInt(i % 86400 % 3600 / 60),
                sec: parseInt(i % 86400 % 3600 % 60)
            };
        } else e = {
            day: 0,
            hou: 0,
            min: 0,
            sec: 0
        };
        return e;
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
        });
        var t = "/zxsite_shop/generating-poster/index?from=groupsDetail&id=" + this.data.goodsDetail.id;
        this.data.groupsOrderId && (t += "&groupsOrderId=" + this.data.groupsOrderId), wx.navigateTo({
            url: t
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
        for (var a = t.currentTarget.dataset.index, e = this.data.diyForm[t.currentTarget.dataset.index].item, i = "", r = 0, o = e.length; r < o; ++r) {
            if (e[r].value == t.currentTarget.dataset.value.value) {
                var s = "diyForm[" + a + "].item[" + r + "].checked";
                this.setData(_defineProperty({}, s, !t.currentTarget.dataset.value.checked));
            }
            e[r].checked && (util.isEmpty(i) || (i += ","), i += e[r].value);
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
    bindChooseImage: function(r) {
        var o = this, e = app.util.url("entry/wxapp/upload", {
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
                        var e = r.currentTarget.dataset.index;
                        o.data.diyForm[e].item.push(a.data.url);
                        var i = "diyForm[" + e + "].item";
                        o.setData(_defineProperty({}, i, o.data.diyForm[e].item));
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