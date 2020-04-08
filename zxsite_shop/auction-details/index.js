var app = getApp(), common = require("../../utils/common.js"), util = require("../../utils/util.js"), WxParse = require("../../wxParse/wxParse.js");

Page({
    data: {
        hideLoading: !1,
        autoplay: !0,
        goodsDetail: {},
        swiperSwitchName: "picture",
        hasMoreSelect: !1,
        selectSize: "选择：",
        addPrice: 0,
        shopNum: 0,
        hideShopPopup: !0,
        buyNumber: 1,
        buyNumMin: 1,
        buyNumMax: 1,
        themeColor: "#f44",
        themeSubColor: "#ff976a",
        backgroundColor: "#f8f8f8",
        shop_server_url: "",
        shop_service: "",
        propertyIds: "",
        propertyNames: "",
        canSubmit: !1,
        goodsCover: "",
        auctionId: 0,
        isWinner: !1,
        maskShow: "none",
        isOfficialAccount: 0,
        isWechatReview: 0,
        textAuction: "拍卖",
        textPrice: "一口价",
        textStartPrice: "起拍价",
        textAddPrice: "加价幅度",
        textDeposit: "保证金",
        textDelay: "延时周期",
        textInstruction: "拍品介绍",
        textFail: "未拍中",
        textSuccess: "已拍中"
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
                    auctionId: e.id,
                    isOfficialAccount: t.is_official_account,
                    isWechatReview: t.is_wechat_review,
                    themeColor: t.theme_color ? t.theme_color : "#f44",
                    themeSubColor: t.theme_sub_color ? t.theme_sub_color : "#ff976a",
                    backgroundColor: t.background_color ? t.background_color : "#f8f8f8",
                    textAuction: t.auction_text ? t.auction_text : "拍卖",
                    textPrice: t.auction_text_price ? t.auction_text_price : "一口价",
                    textStartPrice: t.auction_text_start_price ? t.auction_text_start_price : "起拍价",
                    textAddPrice: t.auction_text_add_price ? t.auction_text_add_price : "加价幅度",
                    textDeposit: t.auction_text_deposit ? t.auction_text_deposit : "保证金",
                    textDelay: t.auction_text_delay ? t.auction_text_delay : "延时周期",
                    textInstruction: t.auction_text_instruction ? t.auction_text_instruction : "拍品介绍",
                    textFail: t.auction_text_fail ? t.auction_text_fail : "未拍中",
                    textSuccess: t.auction_text_success ? t.auction_text_success : "已拍中"
                }), wx.setNavigationBarTitle({
                    title: i.data.textAuction + "商品详情"
                });
            }), i.getAuctionDetail(e.id), i.getAuctionProcessList(e.id), i.getCommissionAgent(), 
            e.agent_id && i.handleCommissionMember(e.agent_id), wx.getStorage({
                key: "shopCarInfo",
                success: function(t) {
                    i.setData({
                        shopCarInfo: t.data,
                        shopNum: parseInt(t.data.shopNum)
                    });
                }
            }); else {
                var t = "/zxsite_shop/start/start?url=/zxsite_shop/auction-details/index&id=" + e.id;
                e.agent_id && (t += "&agent_id=" + e.agent_id), wx.redirectTo({
                    url: t
                });
            }
        });
    },
    getAuctionDetail: function(i) {
        var o = this;
        app.util.request({
            url: "entry/wxapp/auction-detail",
            data: {
                id: i
            },
            success: function(t) {
                var a = "";
                if (!util.isEmpty(t.data.data.properties) && 0 < t.data.data.properties.length) {
                    for (var e = 0; e < t.data.data.properties.length; e++) a = a + " " + t.data.data.properties[e].name;
                    o.data.selectSize = "选择:", o.setData({
                        hasMoreSelect: !0,
                        selectSize: o.data.selectSize + a
                    });
                }
                o.setData({
                    goodsDetail: t.data.data,
                    swiperSwitchName: t.data.data.video_url ? "video" : "picture",
                    addPrice: parseFloat(parseFloat(t.data.data.current_price) + parseFloat(t.data.data.add_price)).toFixed(2),
                    goodsCover: t.data.data.cover,
                    hideLoading: !0,
                    autoplay: !t.data.data.video_url
                }), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh(), wx.hideLoading(), WxParse.wxParse("article", "html", t.data.data.content, o, 5), 
                t.data.data.is_winner && o.setData({
                    isWinner: t.data.data.is_winner,
                    payableAmount: parseFloat(t.data.data.current_price) > parseFloat(t.data.data.amount) ? parseFloat(parseFloat(t.data.data.current_price) - parseFloat(t.data.data.amount)).toFixed(2) : "0.00"
                }), o.countdown(), app.util.request({
                    url: "entry/wxapp/member-action",
                    data: {
                        type: 1,
                        path: "zxsite_shop/auction-details/index?id=" + i,
                        description: "拍卖[" + t.data.data.goods_title + "]"
                    },
                    showLoading: !1
                });
            }
        });
    },
    getAuctionProcessList: function(t) {
        var a = this;
        app.util.request({
            url: "entry/wxapp/auction-process",
            data: {
                id: t
            },
            success: function(t) {
                t.data.data && a.setData({
                    auctionProcess: t.data.data
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
    goHome: function() {
        wx.reLaunch({
            url: "/zxsite_shop/index/index"
        });
    },
    toBuy: function(t) {
        this.bindGuiGeTap(t);
    },
    toOrder: function(t) {
        if (1 == t.currentTarget.dataset.orderStatus) wx.navigateTo({
            url: "/zxsite_shop/order-list/index?currentType=1"
        }); else {
            var a = t.currentTarget.dataset.orderId;
            wx.navigateTo({
                url: "/zxsite_shop/order-details/index?id=" + a
            });
        }
    },
    bindGuiGeTap: function(t) {
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
                buyNumber: t,
                addPrice: parseFloat(parseFloat(this.data.goodsDetail.current_price) + parseFloat(this.data.goodsDetail.add_price) * t).toFixed(2)
            });
        }
    },
    numJiaTap: function() {
        if (!this.data.isWinner) {
            var t = this.data.buyNumber;
            t++, this.setData({
                buyNumber: t,
                addPrice: parseFloat(parseFloat(this.data.goodsDetail.current_price) + parseFloat(this.data.goodsDetail.add_price) * t).toFixed(2)
            });
        }
    },
    numChanageTap: function(t) {
        if (!util.isEmpty(t.detail.value)) {
            var a = parseInt(t.detail.value);
            a < this.data.buyNumMin ? this.setData({
                buyNumber: this.data.buyNumMin,
                addPrice: parseFloat(parseFloat(this.data.goodsDetail.current_price) + parseFloat(this.data.goodsDetail.add_price) * this.data.buyNumMin).toFixed(2)
            }) : this.data.isWinner ? this.setData({
                buyNumber: this.data.buyNumMax,
                addPrice: parseFloat(parseFloat(this.data.goodsDetail.current_price) + parseFloat(this.data.goodsDetail.add_price) * this.data.buyNumMax).toFixed(2)
            }) : this.setData({
                buyNumber: a,
                addPrice: parseFloat(parseFloat(this.data.goodsDetail.current_price) + parseFloat(this.data.goodsDetail.add_price) * a).toFixed(2)
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
                id: e.data.goodsDetail.goods_id,
                property_ids: r
            },
            success: function(t) {
                e.setData({
                    propertyIds: r,
                    propertyNames: d,
                    goodsCover: t.data.data.cover ? t.data.data.cover : a.currentTarget.dataset.goodscover
                });
            }
        }), this.setData({
            goodsDetail: e.data.goodsDetail,
            canSubmit: u
        });
    },
    buyNow: function(t) {
        if (this.data.isWinner) {
            if (!util.isEmpty(this.data.goodsDetail.properties) && 0 < this.data.goodsDetail.properties.length && !this.data.canSubmit) return this.data.canSubmit || wx.showToast({
                title: "请选择商品规格",
                icon: "none",
                duration: 2e3
            }), this.bindGuiGeTap(), void wx.showToast({
                title: "请先选择规格尺寸",
                icon: "none",
                duration: 2e3
            });
            if (this.data.buyNumber < 1) return void wx.showToast({
                title: "购买数量不能为0",
                icon: "none",
                duration: 2e3
            });
            var a = this.buliduBuyNowInfo();
            wx.setStorage({
                key: "buyNowInfo",
                data: a
            }), this.closePopupTap(), wx.navigateTo({
                url: "/zxsite_shop/to-pay-order/index?orderType=buyNow"
            });
        } else {
            var e = this;
            app.util.request({
                url: "entry/wxapp/auction-participant",
                data: {
                    auction_id: this.data.goodsDetail.id,
                    amount: this.data.addPrice,
                    form_id: t.detail.formId
                },
                method: "POST",
                success: function(t) {
                    e.closePopupTap(), e.getAuctionDetail(e.data.goodsDetail.id), e.getAuctionProcessList(e.data.goodsDetail.id);
                }
            });
        }
    },
    buliduBuyNowInfo: function() {
        var t = {};
        t.id = this.data.goodsDetail.id, t.categoryId = this.data.goodsDetail.category_id, 
        t.barCode = this.data.goodsDetail.bar_code, t.cover = this.data.goodsCover, t.pictures = this.data.goodsDetail.pictures, 
        t.title = this.data.goodsDetail.goods_title, t.subTitle = this.data.goodsDetail.sub_title, 
        t.type = this.data.goodsDetail.type, t.propertyIds = this.data.propertyIds, t.propertyNames = this.data.propertyNames, 
        t.price = this.data.payableAmount, t.left = "", t.active = !0, t.number = this.data.buyNumber, 
        t.template_id = this.data.goodsDetail.template_id, t.freight = this.data.goodsDetail.freight, 
        t.weight = this.data.goodsDetail.weight, t.is_cash = this.data.goodsDetail.is_cash, 
        t.integralGive = this.data.goodsDetail.integral_give, t.auctionId = this.data.goodsDetail.id;
        var a = {};
        return a.shopNum || (a.shopNum = 0), a.shopList || (a.shopList = []), a.shopList.push(t), 
        a;
    },
    onShareAppMessage: function() {
        var t = "/zxsite_shop/auction-details/index?id=" + this.data.auctionId;
        return this.data.agent && (t += "&agent_id=" + this.data.agent.id), {
            title: this.data.goodsDetail.goods_title,
            path: t,
            imageUrl: this.data.goodsDetail.share_image_url ? this.data.goodsDetail.share_image_url : this.data.goodsDetail.cover,
            success: function(t) {},
            fail: function(t) {}
        };
    },
    onPullDownRefresh: function() {
        app.util.showLoading(), wx.showNavigationBarLoading(), this.getAuctionDetail(this.data.goodsDetail.id), 
        this.getAuctionProcessList(this.data.goodsDetail.id), wx.getStorage({
            key: "shopCarInfo",
            success: function(t) {
                self.setData({
                    shopCarInfo: t.data,
                    shopNum: parseInt(t.data.shopNum)
                });
            }
        });
    },
    countdown: function() {
        var t = new Date().getTime(), a = 0 == this.data.goodsDetail.time_status ? new Date(1e3 * this.data.goodsDetail.start_time).getTime() : new Date(1e3 * this.data.goodsDetail.end_time).getTime(), e = this.countdownCompute(t, a);
        this.data.goodsDetail.countdown = this.timeFormat(e.day) + "天" + this.timeFormat(e.hou) + "时" + this.timeFormat(e.min) + "分" + this.timeFormat(e.sec) + "秒", 
        this.setData({
            goodsDetail: this.data.goodsDetail
        }), setTimeout(this.countdown, 1e3);
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
        }, this.data.goodsDetail.time_status = 0 == this.data.goodsDetail.time_status ? 1 : 2, 
        this.setData({
            goodsDetail: this.data.goodsDetail
        });
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
        }), wx.navigateTo({
            url: "/zxsite_shop/generating-poster/index?from=auctionDetail&id=" + this.data.auctionId
        });
    },
    cancelMask: function() {
        this.setData({
            maskShow: "none"
        });
    },
    toDeposit: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/auction-order-create",
            data: {
                auction_id: this.data.goodsDetail.id,
                amount: this.data.goodsDetail.deposit
            },
            method: "POST",
            success: function(t) {
                var a = t.data.data.id;
                app.util.request({
                    url: "entry/wxapp/auction-order-pay",
                    data: {
                        id: a
                    },
                    success: function(t) {
                        t.data && t.data.data && wx.requestPayment({
                            timeStamp: t.data.data.timeStamp,
                            nonceStr: t.data.data.nonceStr,
                            package: t.data.data.package,
                            signType: t.data.data.signType,
                            paySign: t.data.data.paySign,
                            success: function(t) {
                                app.util.request({
                                    url: "entry/wxapp/payment-result",
                                    data: {
                                        id: a,
                                        type: "auction"
                                    },
                                    success: function(t) {
                                        e.getAuctionDetail(e.data.goodsDetail.id);
                                    }
                                });
                            },
                            fail: function(t) {
                                e.data.forbidhandle = !1, "requestPayment:fail cancel" != t.errMsg && wx.showModal({
                                    title: "提示",
                                    content: "支付失败，错误信息:" + t.errMsg,
                                    showCancel: !1
                                });
                            }
                        });
                    }
                });
            }
        });
    },
    setAuctionRemind: function(t) {
        var a = this, e = t.currentTarget.dataset.auction_id;
        app.util.request({
            url: "entry/wxapp/auction-remind",
            showLoading: !1,
            data: {
                auction_id: e,
                form_id: t.detail.formId
            },
            success: function(t) {
                wx.showToast({
                    title: "设置提醒成功",
                    icon: "success",
                    duration: 2e3
                }), a.getAuctionDetail(a.data.goodsDetail.id);
            }
        });
    },
    cancelAuctionRemind: function(t) {
        var a = this, e = t.currentTarget.dataset.auction_remind_id;
        app.util.request({
            url: "entry/wxapp/auction-cancle-remind",
            showLoading: !1,
            data: {
                auction_remind_id: e
            },
            success: function(t) {
                wx.showToast({
                    title: "取消提醒成功",
                    icon: "success",
                    duration: 2e3
                }), a.getAuctionDetail(a.data.goodsDetail.id);
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
    onPreviewSwiperImage: function(t) {
        wx.previewImage({
            urls: this.data.goodsDetail.pictures,
            current: t.currentTarget.dataset.image
        });
    }
});