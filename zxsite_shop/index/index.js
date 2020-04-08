function _defineProperty(t, a, e) {
    return a in t ? Object.defineProperty(t, a, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[a] = e, t;
}

var app = getApp(), common = require("../../utils/common.js"), util = require("../../utils/util.js");

Page({
    data: {
        hideLoading: !1,
        autoplay: !0,
        interval: 3e3,
        duration: 1e3,
        userInfo: {},
        swiperCurrent: 0,
        selectCurrent: 0,
        categories: [],
        activeCategoryId: 0,
        goodsList: [],
        goodsRecommendList: [],
        scrollTop: "0",
        loadingMoreHidden: !0,
        searchInput: "",
        telephone: "",
        shop_server_url: "",
        requestNeed: 9,
        requestDone: 0,
        page: 1,
        total: 1,
        allGoods: [],
        videoUrl: "",
        audioUrl: "",
        isOfficialAccount: 0,
        diyPage: {},
        diyFormIndex: -1,
        diyFormField: [],
        designList: [],
        loadImageError: !1,
        loadImageTime: 0,
        textAuction: "",
        textCurrentPrice: "",
        textCompletePrice: "",
        textCharge: "",
        textUnion: "",
        isCollectTip: 1,
        textCollectTip: "",
        homeShopStoreShow: 0,
        shopStore: {}
    },
    swiperchange: function(t) {
        this.setData({
            swiperCurrent: t.detail.current
        });
    },
    swiperTap: function(t) {
        0 == t.currentTarget.dataset.linkType ? wx.navigateTo({
            url: t.currentTarget.dataset.linkUrl
        }) : 1 == t.currentTarget.dataset.linkType ? wx.navigateTo({
            url: "/zxsite_shop/goods-details/index?id=" + t.currentTarget.dataset.linkUrl
        }) : 2 == t.currentTarget.dataset.linkType && wx.navigateTo({
            url: "/zxsite_shop/web-view/index?linkUrl=" + encodeURIComponent(t.currentTarget.dataset.linkUrl)
        });
    },
    onGoodsDetailTap: function(t) {
        wx.navigateTo({
            url: "/zxsite_shop/goods-details/index?id=" + t.currentTarget.dataset.id
        });
    },
    toNavigationTap: function(t) {
        1 == t.currentTarget.dataset.type ? wx.navigateTo({
            url: t.currentTarget.dataset.url
        }) : 2 == t.currentTarget.dataset.type ? wx.navigateTo({
            url: "/zxsite_shop/web-view/index?linkUrl=" + encodeURIComponent(t.currentTarget.dataset.url)
        }) : wx.navigateTo({
            url: t.currentTarget.dataset.url
        });
    },
    toSeckillDetailsTap: function(t) {
        wx.navigateTo({
            url: "/zxsite_shop/seckill-details/index?id=" + t.currentTarget.dataset.id + "&seckill_id=" + t.currentTarget.dataset.seckillId + "&seckillDate=" + t.currentTarget.dataset.seckillDate + "&time=" + t.currentTarget.dataset.time
        });
    },
    toGroupsDetailsTap: function(t) {
        wx.navigateTo({
            url: "/zxsite_shop/groups-details/index?id=" + t.currentTarget.dataset.id
        });
    },
    toAuctionDetailsTap: function(t) {
        wx.navigateTo({
            url: "/zxsite_shop/auction-details/index?id=" + t.currentTarget.dataset.id
        });
    },
    onLoad: function(e) {
        var i = this;
        if (util.isEmpty(e.agent_id)) {
            var t = util.parseUrlString(decodeURIComponent(e.scene));
            t.agent_id && (e.agent_id = t.agent_id);
        }
        common.getUserInfo(function(a) {
            if (a) common.getSettings(function(t) {
                common.setCustomNavigationBar(t), common.setCustomTabBar(i, t), i.setData({
                    userInfo: a,
                    shopName: t.shop_name,
                    shopService: t.shop_service,
                    shopServiceTelphone: t.shop_service_telphone,
                    telephone: t.shop_telphone,
                    shopServerUrl: t.shop_server_url,
                    shopTelphoneIcon: t.shop_telphone_icon ? t.shop_telphone_icon : "http://qn.zxsite.cn/zxsite_shop/telphone-service-3.png",
                    shopServiceIcon: t.shop_service_icon ? t.shop_service_icon : "http://qn.zxsite.cn/zxsite_shop/customer-service-3.png",
                    lineNumber: t.home_navigation_line_number ? t.home_navigation_line_number : 5,
                    audioUrl: t.audio_url,
                    videoUrl: t.video_url,
                    isOfficialAccount: t.is_official_account,
                    themeColor: t.theme_color ? t.theme_color : "#f44",
                    navigationBarBackgroundColor: t.navigation_bar_background_color ? t.navigation_bar_background_color : "#ffffff",
                    backgroundColor: t.background_color ? t.background_color : "#f8f8f8",
                    textAuction: t.auction_text ? t.auction_text : "拍卖",
                    textCurrentPrice: t.auction_text_current_price ? t.auction_text_current_price : "当前价",
                    textCompletePrice: t.auction_text_complete_price ? t.auction_text_complete_price : "拍中价",
                    textCharge: t.commission_text_charge ? t.commission_text_charge : "佣金",
                    textUnion: t.commission_text_union ? t.commission_text_union : "元",
                    isCollectTip: t.is_collect_tip,
                    textCollectTip: t.collect_tip_text ? t.collect_tip_text : "微信首页下拉即可快速访问店铺",
                    homeShopStoreShow: t.home_shop_store_show
                }), 1 == t.home_shop_store_show && i.getShopStore();
            }), i.data.requestDone = 0, app.util.showLoading(), i.getDiyPageList(), i.getCommissionAgent(), 
            e.agent_id && i.handleCommissionMember(e.agent_id), app.util.request({
                url: "entry/wxapp/member-action",
                data: {
                    type: 1,
                    path: "zxsite_shop/index/index",
                    description: "商城首页"
                },
                showLoading: !1
            }); else {
                var t = "/zxsite_shop/start/start?url=/zxsite_shop/index/index";
                e.agent_id && (t += "&agent_id=" + e.agent_id), wx.redirectTo({
                    url: t
                });
            }
        });
    },
    onReady: function(t) {
        if (!util.isEmpty(this.data.audioUrl)) {
            var a = wx.getBackgroundAudioManager();
            a.title = this.data.shopName, a.src = this.data.audioUrl, this.setData({
                playStatus: !0
            });
        }
    },
    setPlayStatus: function(t) {
        var a = wx.getBackgroundAudioManager();
        if (1 == (e = t.currentTarget.dataset.playStatus)) {
            a.pause();
            var e = !1;
        } else a.play(), e = !0;
        this.setData({
            playStatus: e
        });
    },
    onPullDownRefresh: function() {
        app.util.showLoading(), wx.showNavigationBarLoading(), this.getDiyPageList();
    },
    onShow: function() {
        common.updateTabBarCartBadge(), 1 == this.data.homeShopStoreShow && this.getShopStore();
    },
    getDesignList: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/design",
            data: {
                page: "index"
            },
            showLoading: !1,
            success: function(t) {
                var a = new Date();
                e.setData({
                    designList: t.data.data,
                    loadImageTime: e.data.loadImageError ? a.getTime() : e.data.loadImageTime,
                    loadImageError: !1,
                    hideLoading: !0
                });
            }
        });
    },
    getDiyPageList: function() {
        var o = this;
        app.util.request({
            url: "entry/wxapp/diy-page",
            data: {
                type: 1
            },
            showLoading: !1,
            success: function(t) {
                var a = new Date();
                if (!util.isEmpty(t.data.data.design)) for (var e = 0, i = t.data.data.design.length; e < i; ++e) if ("form" == t.data.data.design[e].name) {
                    o.data.diyFormIndex = e;
                    t.data.data.design[e].data.list;
                    o.data.diyFormField = JSON.parse(JSON.stringify(t.data.data.design[e].data.list));
                    break;
                }
                o.setData({
                    diyPage: t.data.data,
                    diyFormIndex: o.data.diyFormIndex,
                    diyFormField: o.data.diyFormField,
                    navigationBarBackgroundColor: t.data.data.title_bar_background_color ? t.data.data.title_bar_background_color : o.data.navigationBarBackgroundColor,
                    backgroundColor: t.data.data.background_color ? t.data.data.background_color : o.data.backgroundColor,
                    backgroundImage: t.data.data.background_image ? t.data.data.background_image : "",
                    loadImageTime: o.data.loadImageError ? a.getTime() : o.data.loadImageTime,
                    loadImageError: !1,
                    hideLoading: !0
                }), t.data.data.id ? (wx.setNavigationBarTitle({
                    title: t.data.data.title ? t.data.data.title : o.data.shopName
                }), wx.setNavigationBarColor({
                    frontColor: "black" == t.data.data.title_bar_color ? "#000000" : "#ffffff",
                    backgroundColor: t.data.data.title_bar_background_color ? t.data.data.title_bar_background_color : "#f8f8f8"
                }), wx.setBackgroundColor({
                    backgroundColor: o.data.backgroundColor
                }), o.getSeckillRemind(), o.getAuctionRemind(), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh(), 
                wx.hideLoading()) : (wx.setNavigationBarTitle({
                    title: o.data.shopName
                }), o.data.requestDone = 0, o.getCarousel(), o.getNavigation(), o.getNotice(), o.getGoodsList(1), 
                o.getGoodsRecommendList(), o.getCoupon(), o.getTodaySeckill(), o.getGroups(), o.getAuction());
            }
        });
    },
    getGoodsList: function(e) {
        var i = this, o = this.data.allGoods;
        e <= this.data.total || 1 == e ? (1 < e && (app.util.showLoading(), this.data.requestDone -= 1), 
        app.util.request({
            url: "entry/wxapp/goods-list",
            showLoading: !1,
            data: {
                page: e
            },
            success: function(t) {
                var a = t.data.data.goods;
                o = 1 < e ? o.concat(a) : a, i.setData({
                    goodsList: o,
                    allGoods: o,
                    page: parseInt(e) + 1,
                    total: t.data.data.total
                }), i.data.requestDone++, i.data.requestDone >= i.data.requestNeed && (wx.hideNavigationBarLoading(), 
                wx.stopPullDownRefresh(), wx.hideLoading());
            }
        })) : i.setData({
            loadingMoreHidden: !1
        });
    },
    getCarousel: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/carousel",
            showLoading: !1,
            success: function(t) {
                a.setData({
                    banners: t.data.data
                }), a.data.requestDone++, a.data.requestDone >= a.data.requestNeed && (wx.hideNavigationBarLoading(), 
                wx.stopPullDownRefresh(), wx.hideLoading());
            }
        });
    },
    getCoupon: function() {
        var i = this;
        app.util.request({
            url: "entry/wxapp/coupon-list",
            showLoading: !1,
            success: function(t) {
                for (var a = 0; a < t.data.data.length; ++a) {
                    util.isEmpty(t.data.data[a].get_time) && parseInt(t.data.data[a].get_limit) > parseInt(t.data.data[a].user_get_total) ? (t.data.data[a].background = "http://qn.zxsite.cn/zxsite_shop/coupon-index-bg-2.png", 
                    t.data.data[a].disabled = !1) : (t.data.data[a].background = "http://qn.zxsite.cn/zxsite_shop/coupon-index-disabled-bg-2.png", 
                    t.data.data[a].disabled = !0);
                    var e = t.data.data[a].deduct;
                    t.data.data[a].numLength = e.toString().length;
                }
                i.setData({
                    couponList: t.data.data
                }), i.data.requestDone++, i.data.requestDone >= i.data.requestNeed && (wx.hideNavigationBarLoading(), 
                wx.stopPullDownRefresh(), wx.hideLoading());
            }
        });
    },
    getGoodsRecommendList: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/recommend-list",
            showLoading: !1,
            success: function(t) {
                0 < t.data.data.length && a.setData({
                    goodsRecommendList: t.data.data,
                    loadingMoreHidden: !1
                }), a.data.requestDone++, a.data.requestDone >= a.data.requestNeed && (wx.hideNavigationBarLoading(), 
                wx.stopPullDownRefresh(), wx.hideLoading());
            }
        });
    },
    fecthCoupon: function(t) {
        var a = this, i = t.currentTarget.dataset.id;
        app.util.request({
            url: "entry/wxapp/coupon-fetch",
            data: {
                id: i,
                form_id: t.detail.formId
            },
            success: function(e) {
                a.data.diyPage.id ? (a.data.diyPage.design.forEach(function(a) {
                    "coupon" == a.name && a.data.list.forEach(function(t) {
                        i == t.id && (t.get_time = e.data.data.get_time, t.background = util.isEmpty(a.style.disabledBackground) ? "http://qn.zxsite.cn/zxsite_shop/coupon-index-disabled-bg-2.png" : a.style.disabledBackground, 
                        t.disabled = !0);
                    });
                }), a.setData({
                    diyPage: a.data.diyPage
                })) : (a.data.couponList[t.currentTarget.dataset.index].get_time = e.data.data.get_time, 
                a.data.couponList[t.currentTarget.dataset.index].background = "http://qn.zxsite.cn/zxsite_shop/coupon-index-disabled-bg-2.png", 
                a.data.couponList[t.currentTarget.dataset.index].disabled = !0, a.setData({
                    couponList: a.data.couponList
                }));
            }
        });
    },
    getTodaySeckill: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/seckill-list",
            showLoading: !1,
            success: function(t) {
                0 < t.data.data.length ? (a.setData({
                    seckillList: t.data.data
                }), a.getSeckillRemind()) : a.setData({
                    seckillShowList: []
                }), a.data.requestDone++, a.data.requestDone >= a.data.requestNeed && (wx.hideNavigationBarLoading(), 
                wx.stopPullDownRefresh(), wx.hideLoading());
            }
        });
    },
    getGroups: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/groups-list",
            showLoading: !1,
            success: function(t) {
                0 < t.data.data.length ? a.setData({
                    groupsList: t.data.data
                }) : a.setData({
                    groupsList: ""
                }), a.data.requestDone++, a.data.requestDone >= a.data.requestNeed && (wx.hideNavigationBarLoading(), 
                wx.stopPullDownRefresh(), wx.hideLoading());
            }
        });
    },
    getAuction: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/auction-list",
            showLoading: !1,
            success: function(t) {
                0 < t.data.data.length ? (a.setData({
                    auctionList: t.data.data
                }), a.getAuctionRemind()) : a.setData({
                    auctionShowList: ""
                }), a.data.requestDone++, a.data.requestDone >= a.data.requestNeed && (wx.hideNavigationBarLoading(), 
                wx.stopPullDownRefresh(), wx.hideLoading());
            }
        });
    },
    getSeckillRemind: function() {
        var i = this;
        app.util.request({
            url: "entry/wxapp/seckill-remind-list",
            showLoading: !1,
            success: function(e) {
                i.data.diyPage.id ? (0 < e.data.data.length && (i.data.diyPage.design.forEach(function(t) {
                    "seckill" == t.name && t.data.list.forEach(function(a) {
                        e.data.data.forEach(function(t) {
                            t.seckill_id == a.seckill_id && t.uid == i.data.userInfo.memberInfo.uid && t.begin_date == a.date && t.begin_time == a.time && (a.remind = 1, 
                            a.remind_id = t.id);
                        });
                    });
                }), i.setData({
                    diyPage: i.data.diyPage
                })), i.countDownDiy()) : (0 < e.data.data.length && i.data.seckillList.forEach(function(a) {
                    e.data.data.forEach(function(t) {
                        t.seckill_id == a.seckill_id && t.uid == i.data.userInfo.memberInfo.uid && t.begin_date == a.seckillDate && t.begin_time == a.time && (a.remind = 1, 
                        a.remind_id = t.id);
                    });
                }), i.setData({
                    seckillShowList: i.data.seckillList
                }), i.countDown());
            }
        });
    },
    countDown: function() {
        var c = this, l = new Date(), g = l.getTime(), p = [];
        this.data.seckillShowList.forEach(function(t) {
            var a = new Date(l.getFullYear(), l.getMonth(), l.getDate(), t.time, 59, 59), e = a.getTime();
            if (0 <= e - g && a.getHours() == l.getHours()) {
                var i = (e - g) / 1e3, o = parseInt(i % 86400 % 3600 / 60), n = parseInt(i % 86400 % 3600 % 60);
                t.countdown = c.timeFormat(o) + "分" + c.timeFormat(n) + "秒", t.seckill_status = 1, 
                p.push(t);
            } else if (0 <= e - g && a.getHours() != l.getHours()) {
                var d = a.getHours() - l.getHours() - 1, s = (e - g) / 1e3, r = parseInt(s % 86400 % 3600 / 60), u = parseInt(s % 86400 % 3600 % 60);
                t.countdown = d + "时" + c.timeFormat(r) + "分" + c.timeFormat(u) + "秒", t.seckill_status = 2, 
                p.push(t);
            } else t.countdown = "00分00秒", t.seckill_status = 3;
        }), this.setData({
            seckillShowList: p.sort(this.compare("id")).sort(this.compare("time")).concat([].sort(this.compare("id")).sort(this.compare("time")))
        }), setTimeout(this.countDown, 1e3);
    },
    countDownDiy: function() {
        for (var r = this, t = 0, a = this.data.diyPage.design.length; t < a; ++t) {
            var u, c, e;
            if ("seckill" == this.data.diyPage.design[t].name) !function() {
                var s = new Date().getTime();
                u = [], c = [], e = [], r.data.diyPage.design[t].data.list.forEach(function(t) {
                    var a = new Date(1e3 * t.date), e = new Date(a.getFullYear(), a.getMonth(), a.getDate(), t.time, 59, 59).getTime(), i = Math.floor((e - s) / 864e5), o = Math.floor((e - s) % 864e5 / 36e5), n = Math.floor((e - s) % 36e5 / 6e4), d = Math.round((e - s) % 6e4 / 1e3);
                    i <= 0 && o <= 0 && 0 < n ? (t.countdown = r.timeFormat(n) + "分" + r.timeFormat(d) + "秒", 
                    t.seckill_status = 1, u.push(t), c.push(t)) : 0 < i || i <= 0 && 0 < o ? (t.countdown = i <= 0 ? "" : r.timeFormat(i) + "天", 
                    t.countdown += r.timeFormat(o - 1) + "时" + r.timeFormat(n) + "分" + r.timeFormat(d) + "秒", 
                    t.seckill_status = 2, u.push(t), c.push(t)) : (t.countdown = "00分00秒", t.seckill_status = 3);
                }), 1 == r.data.diyPage.design[t].data.source ? r.data.diyPage.design[t].data.list = u : r.data.diyPage.design[t].data.list = c.sort(r.compare("id")).sort(r.compare("time")).concat(e.sort(r.compare("id")).sort(r.compare("time")));
            }();
        }
        this.setData({
            diyPage: this.data.diyPage
        }), setTimeout(this.countDownDiy, 1e3);
    },
    timeFormat: function(t) {
        return t < 10 ? "0" + t : t;
    },
    compare: function(o) {
        return function(t, a) {
            var e = t[o], i = a[o];
            return isNaN(Number(e)) || isNaN(Number(i)) || (e = Number(e), i = Number(i)), e < i ? -1 : i < e ? 1 : 0;
        };
    },
    onShareAppMessage: function() {
        var t = "/zxsite_shop/index/index";
        return this.data.agent && (t += "?agent_id=" + this.data.agent.id), {
            title: this.data.diyPage.share_profile ? this.data.diyPage.share_profile : wx.getStorageSync("settings").shop_name + "——" + wx.getStorageSync("settings").shop_share_profile,
            path: t,
            imageUrl: this.data.diyPage.share_image ? this.data.diyPage.share_image : wx.getStorageSync("settings").shop_share_image,
            success: function(t) {},
            fail: function(t) {}
        };
    },
    getNavigation: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/navigation-list",
            showLoading: !1,
            success: function(t) {
                0 < t.data.data.length && a.setData({
                    navigationList: t.data.data
                }), a.data.requestDone++, a.data.requestDone >= a.data.requestNeed && (wx.hideNavigationBarLoading(), 
                wx.stopPullDownRefresh(), wx.hideLoading());
            }
        });
    },
    getNotice: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/notice-list",
            showLoading: !1,
            success: function(t) {
                0 < t.data.data.length && a.setData({
                    noticeList: t.data.data
                }), a.data.requestDone++, a.data.requestDone >= a.data.requestNeed && (wx.hideNavigationBarLoading(), 
                wx.stopPullDownRefresh(), wx.hideLoading());
            }
        });
    },
    getShopStore: function() {
        var a = this;
        wx.getStorage({
            key: "shopStore",
            success: function(t) {
                a.setData({
                    shopStore: t.data
                });
            },
            fail: function() {
                wx.getLocation({
                    type: "wgs84",
                    success: function(t) {
                        app.util.request({
                            url: "entry/wxapp/store-list",
                            data: {
                                latitude: t.latitude,
                                longitude: t.longitude
                            },
                            showLoading: !1,
                            success: function(t) {
                                1 < t.data.data.length && a.setData({
                                    shopStore: t.data.data[0]
                                });
                            }
                        });
                    }
                });
            }
        });
    },
    listenerSearchInput: function(t) {
        this.setData({
            searchInput: t.detail.value
        });
    },
    toSearch: function() {
        wx.navigateTo({
            url: "/zxsite_shop/search-result/index?keyword=" + this.data.searchInput
        });
    },
    toTelphone: function() {
        wx.makePhoneCall({
            phoneNumber: wx.getStorageSync("settings").shop_telphone
        });
    },
    toServerUrl: function(t) {
        wx.navigateTo({
            url: "/zxsite_shop/web-view/index?linkUrl=" + encodeURIComponent(t.currentTarget.dataset.link)
        });
    },
    setSeckillRemind: function(t) {
        var e = this, i = t.currentTarget.dataset.seckillId, o = t.currentTarget.dataset.seckillDate, n = t.currentTarget.dataset.time, d = t.currentTarget.dataset.index;
        app.util.request({
            url: "entry/wxapp/seckill-remind",
            showLoading: !1,
            data: {
                seckill_id: i,
                form_id: t.detail.formId,
                seckill_date: o,
                time: n
            },
            success: function(a) {
                wx.showToast({
                    title: "设置成功",
                    icon: "success",
                    duration: 2e3
                }), e.data.diyPage.id ? (e.data.diyPage.design.forEach(function(t) {
                    "seckill" == t.name && t.data.list.forEach(function(t) {
                        i == t.seckill_id && o == t.date && n == t.time && (t.remind = 1, t.remind_id = a.data.data.remind_id);
                    });
                }), e.setData({
                    diyPage: e.data.diyPage
                })) : (e.data.seckillShowList[d].remind_id = a.data.data.remind_id, e.data.seckillShowList[d].remind = 1, 
                e.setData({
                    seckillShowList: e.data.seckillShowList
                }));
            }
        });
    },
    cancleSeckillRemind: function(t) {
        var a = this, e = t.currentTarget.dataset.seckillRemindId, i = t.currentTarget.dataset.index;
        app.util.request({
            url: "entry/wxapp/seckill-cancle-remind",
            showLoading: !1,
            data: {
                seckill_remind_id: e
            },
            success: function(t) {
                wx.showToast({
                    title: "取消成功",
                    icon: "success",
                    duration: 2e3
                }), a.data.diyPage.id ? (a.data.diyPage.design.forEach(function(t) {
                    "seckill" == t.name && t.data.list.forEach(function(t) {
                        e == t.remind_id && (t.remind = 0);
                    });
                }), a.setData({
                    diyPage: a.data.diyPage
                })) : (a.data.seckillShowList[i].remind = 0, a.setData({
                    seckillShowList: a.data.seckillShowList
                }));
            }
        });
    },
    toSeckillList: function(t) {
        wx.navigateTo({
            url: "/zxsite_shop/seckill-list/index"
        });
    },
    toGroupsList: function(t) {
        wx.navigateTo({
            url: "/zxsite_shop/groups-list/index"
        });
    },
    toAuctionList: function(t) {
        wx.navigateTo({
            url: "/zxsite_shop/auction-list/index"
        });
    },
    onReachBottom: function() {
        this.data.diyPage.id || this.getGoodsList(this.data.page);
    },
    setAuctionRemind: function(t) {
        var e = this, i = t.currentTarget.dataset.auctionId, o = t.currentTarget.dataset.index;
        app.util.request({
            url: "entry/wxapp/auction-remind",
            showLoading: !1,
            data: {
                auction_id: i,
                form_id: t.detail.formId
            },
            success: function(a) {
                wx.showToast({
                    title: "设置成功",
                    icon: "success",
                    duration: 2e3
                }), e.data.diyPage.id ? (e.data.diyPage.design.forEach(function(t) {
                    "auction" == t.name && t.data.list.forEach(function(t) {
                        i == t.id && (t.remind = 1, t.remind_id = a.data.data.remind_id);
                    });
                }), e.setData({
                    diyPage: e.data.diyPage
                })) : (e.data.auctionList[o].remind_id = a.data.data.remind_id, e.data.auctionList[o].remind = 1, 
                e.setData({
                    auctionShowList: e.data.auctionList
                }));
            }
        });
    },
    getAuctionRemind: function() {
        var i = this;
        app.util.request({
            url: "entry/wxapp/auction-remind-list",
            showLoading: !1,
            success: function(e) {
                0 < e.data.data.length ? i.data.diyPage.id ? (i.data.diyPage.design.forEach(function(t) {
                    "auction" == t.name && t.data.list.forEach(function(a) {
                        e.data.data.forEach(function(t) {
                            t.auction_id == a.id && t.uid == i.data.userInfo.memberInfo.uid && (a.remind = 1, 
                            a.remind_id = t.id);
                        });
                    });
                }), i.setData({
                    diyPage: i.data.diyPage
                })) : (i.data.auctionList.forEach(function(a) {
                    e.data.data.forEach(function(t) {
                        t.auction_id == a.id && t.uid == i.data.userInfo.memberInfo.uid && (a.remind = 1, 
                        a.remind_id = t.id);
                    });
                }), i.setData({
                    auctionShowList: i.data.auctionList
                })) : i.setData({
                    auctionShowList: i.data.auctionList
                });
            }
        });
    },
    cancleAuctionRemind: function(t) {
        var a = this, e = t.currentTarget.dataset.auctionRemindId, i = t.currentTarget.dataset.index;
        app.util.request({
            url: "entry/wxapp/auction-cancle-remind",
            showLoading: !1,
            data: {
                auction_remind_id: e
            },
            success: function(t) {
                wx.showToast({
                    title: "取消成功",
                    icon: "success",
                    duration: 2e3
                }), a.data.diyPage.id ? (a.data.diyPage.design.forEach(function(t) {
                    "auction" == t.name && t.data.list.forEach(function(t) {
                        e == t.remind_id && (t.remind = 0);
                    });
                }), a.setData({
                    diyPage: a.data.diyPage
                })) : (a.data.auctionShowList[i].remind = 0, a.setData({
                    auctionShowList: a.data.auctionShowList
                }));
            }
        });
    },
    onArticleDetailTap: function(t) {
        wx.navigateTo({
            url: "/packages/article/detail?id=" + t.currentTarget.dataset.id
        });
    },
    bindFormTextInput: function(t) {
        var a = t.currentTarget.dataset.index;
        this.data.diyFormField[a].value = t.detail.value;
    },
    bindFormRadioTap: function(t) {
        var a = "diyFormField[" + t.currentTarget.dataset.index + "].value";
        this.setData(_defineProperty({}, a, t.currentTarget.dataset.value));
    },
    bindFormCheckBoxTap: function(t) {
        for (var a = t.currentTarget.dataset.index, e = this.data.diyFormField[a].item, i = "", o = 0, n = e.length; o < n; ++o) {
            if (e[o].value == t.currentTarget.dataset.value.value) {
                var d = "diyFormField[" + a + "].item[" + o + "].checked";
                this.setData(_defineProperty({}, d, !t.currentTarget.dataset.value.checked));
            }
            e[o].checked && (util.isEmpty(i) || (i += ","), i += e[o].value);
        }
        this.data.diyFormField[a].value = i;
    },
    bindFormDateChange: function(t) {
        var a = "diyFormField[" + t.currentTarget.dataset.index + "].value";
        this.setData(_defineProperty({}, a, t.detail.value));
    },
    bindFormTimeChange: function(t) {
        var a = "diyFormField[" + t.currentTarget.dataset.index + "].value";
        this.setData(_defineProperty({}, a, t.detail.value));
    },
    bindChooseImage: function(o) {
        var n = this, e = app.util.url("entry/wxapp/upload", {
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
                        n.data.diyFormField[e].item.push(a.data.url);
                        var i = "diyFormField[" + e + "].item";
                        n.setData(_defineProperty({}, i, n.data.diyFormField[e].item));
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
        this.data.diyFormField[a].item.splice(t.currentTarget.dataset.imageIndex, 1);
        var e = "diyFormField[" + a + "].item";
        this.setData(_defineProperty({}, e, this.data.diyFormField[a].item));
    },
    bindPreviewImage: function(t) {
        wx.previewImage({
            urls: [ t.currentTarget.dataset.src ]
        });
    },
    bindFormSubmit: function(t) {
        for (var a = this.data.diyFormIndex, e = [], i = 0, o = this.data.diyFormField.length; i < o; ++i) {
            var n = this.data.diyFormField[i];
            if (1 == n.required && util.isEmpty(n.value)) return void wx.showToast({
                title: "请" + (1 == n.type || 2 == n.type ? "填写" : "选择") + n.name,
                icon: "none",
                duration: 2e3
            });
            if (7 == n.type && 1 == n.required && 0 == n.item.length) return void wx.showToast({
                title: "请上传" + n.name,
                icon: "none",
                duration: 2e3
            });
            7 == n.type && (n.value = n.item), e.push({
                type: n.type,
                name: n.name,
                value: n.value
            });
        }
        var d = this;
        app.util.request({
            url: "entry/wxapp/diy-form-submit",
            data: {
                diy_form_id: this.data.diyPage.design[a].data.diyFormId,
                data: e
            },
            success: function(t) {
                wx.showToast({
                    title: "提交成功",
                    duration: 2e3
                }), d.setData({
                    diyFormField: JSON.parse(JSON.stringify(d.data.diyPage.design[a].data.list))
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
    loadImageError: function(t) {
        this.setData({
            loadImageError: !0
        });
    }
});