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
        userInfo: {},
        swiperCurrent: 0,
        loadingMoreHidden: !0,
        searchInput: "",
        diyPage: {},
        diyFormIndex: -1,
        diyFormField: [],
        loadImageError: !1,
        loadImageTime: 0,
        textAuction: "",
        textCurrentPrice: "",
        textCompletePrice: "",
        textCharge: "",
        textUnion: ""
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
                common.setCustomNavigationBar(t), common.setCustomTabBar(i, t, "zxsite_shop/diy-page/index?id=" + e.id), 
                i.setData({
                    userInfo: a,
                    themeColor: t.theme_color ? t.theme_color : "#f44",
                    backgroundColor: t.background_color ? t.background_color : "#f8f8f8",
                    textAuction: t.auction_text ? t.auction_text : "拍卖",
                    textCurrentPrice: t.auction_text_current_price ? t.auction_text_current_price : "当前价",
                    textCompletePrice: t.auction_text_complete_price ? t.auction_text_complete_price : "拍中价",
                    textCharge: t.commission_text_charge ? t.commission_text_charge : "佣金",
                    textUnion: t.commission_text_union ? t.commission_text_union : "元"
                });
            }), i.data.requestDone = 0, app.util.showLoading(), i.getDiyPageList(e.id), i.getCommissionAgent(), 
            e.agent_id && i.handleCommissionMember(e.agent_id); else {
                var t = "/zxsite_shop/start/start?url=/zxsite_shop/index/index";
                e.agent_id && (t += "&agent_id=" + e.agent_id), wx.redirectTo({
                    url: t
                });
            }
        });
    },
    onPullDownRefresh: function() {
        app.util.showLoading(), wx.showNavigationBarLoading(), this.getDiyPageList(this.data.diyPage.id);
    },
    onShow: function() {
        common.updateTabBarCartBadge();
    },
    getDiyPageList: function(d) {
        var n = this;
        app.util.request({
            url: "entry/wxapp/diy-page",
            data: {
                id: d,
                type: 2
            },
            showLoading: !1,
            success: function(t) {
                var a = new Date();
                if (!util.isEmpty(t.data.data.design)) for (var e = 0, i = t.data.data.design.length; e < i; ++e) if ("form" == t.data.data.design[e].name) {
                    n.data.diyFormIndex = e, n.data.diyFormField = [], n.data.diyFormField = n.data.diyFormField.concat(t.data.data.design[e].data.list);
                    break;
                }
                n.setData({
                    diyPage: t.data.data,
                    diyFormIndex: n.data.diyFormIndex,
                    diyFormField: n.data.diyFormField,
                    backgroundColor: t.data.data.background_color ? t.data.data.background_color : n.data.backgroundColor,
                    backgroundImage: t.data.data.background_image ? t.data.data.background_image : "",
                    loadImageTime: n.data.loadImageError ? a.getTime() : n.data.loadImageTime,
                    loadImageError: !1,
                    hideLoading: !0
                }), wx.setNavigationBarTitle({
                    title: t.data.data.title
                }), wx.setNavigationBarColor({
                    frontColor: "black" == t.data.data.title_bar_color ? "#000000" : "#ffffff",
                    backgroundColor: t.data.data.title_bar_background_color
                }), wx.setBackgroundColor({
                    backgroundColor: n.data.backgroundColor
                }), n.getSeckillRemind(), n.getAuctionRemind(), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh(), 
                wx.hideLoading(), app.util.request({
                    url: "entry/wxapp/member-action",
                    data: {
                        type: 1,
                        path: "zxsite_shop/diy-page/index?id=" + d,
                        description: "自定义页面[" + t.data.data.title + "]"
                    },
                    showLoading: !1
                });
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
    countDownDiy: function() {
        for (var s = this, t = 0, a = this.data.diyPage.design.length; t < a; ++t) {
            var c, u, e;
            if ("seckill" == this.data.diyPage.design[t].name) !function() {
                var o = new Date().getTime();
                c = [], u = [], e = [], s.data.diyPage.design[t].data.list.forEach(function(t) {
                    var a = new Date(1e3 * t.date), e = new Date(a.getFullYear(), a.getMonth(), a.getDate(), t.time, 59, 59).getTime(), i = Math.floor((e - o) / 864e5), d = Math.floor((e - o) % 864e5 / 36e5), n = Math.floor((e - o) % 36e5 / 6e4), r = Math.round((e - o) % 6e4 / 1e3);
                    i <= 0 && d <= 0 && 0 < n ? (t.countdown = s.timeFormat(n) + "分" + s.timeFormat(r) + "秒", 
                    t.seckill_status = 1, c.push(t), u.push(t)) : 0 < i || i <= 0 && 0 < d ? (t.countdown = i <= 0 ? "" : s.timeFormat(i) + "天", 
                    t.countdown += s.timeFormat(d - 1) + "时" + s.timeFormat(n) + "分" + s.timeFormat(r) + "秒", 
                    t.seckill_status = 2, c.push(t), u.push(t)) : (t.countdown = "00分00秒", t.seckill_status = 3);
                }), 1 == s.data.diyPage.design[t].data.source ? s.data.diyPage.design[t].data.list = c : s.data.diyPage.design[t].data.list = u.sort(s.compare("id")).sort(s.compare("time")).concat(e.sort(s.compare("id")).sort(s.compare("time")));
            }();
        }
        this.setData({
            diyPage: this.data.diyPage
        }), setTimeout(this.countDownDiy, 1e3);
    },
    timeFormat: function(t) {
        return t < 10 ? "0" + t : t;
    },
    compare: function(d) {
        return function(t, a) {
            var e = t[d], i = a[d];
            return isNaN(Number(e)) || isNaN(Number(i)) || (e = Number(e), i = Number(i)), e < i ? -1 : i < e ? 1 : 0;
        };
    },
    onShareAppMessage: function() {
        var t = "/zxsite_shop/index/index";
        return this.data.agent && (t += "?agent_id=" + this.data.agent.id), {
            title: this.data.diyPage.share_profile ? this.data.diyPage.share_profile : this.data.diyPage.title,
            path: t,
            imageUrl: this.data.diyPage.share_image,
            success: function(t) {},
            fail: function(t) {}
        };
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
    setSeckillRemind: function(t) {
        var e = this, i = t.currentTarget.dataset.seckillId, d = t.currentTarget.dataset.seckillDate, n = t.currentTarget.dataset.time, r = t.currentTarget.dataset.index;
        app.util.request({
            url: "entry/wxapp/seckill-remind",
            showLoading: !1,
            data: {
                seckill_id: i,
                form_id: t.detail.formId,
                seckill_date: d,
                time: n
            },
            success: function(a) {
                wx.showToast({
                    title: "设置成功",
                    icon: "success",
                    duration: 2e3
                }), e.data.diyPage.id ? (e.data.diyPage.design.forEach(function(t) {
                    "seckill" == t.name && t.data.list.forEach(function(t) {
                        i == t.seckill_id && d == t.date && n == t.time && (t.remind = 1, t.remind_id = a.data.data.remind_id);
                    });
                }), e.setData({
                    diyPage: e.data.diyPage
                })) : (e.data.seckillShowList[r].remind_id = a.data.data.remind_id, e.data.seckillShowList[r].remind = 1, 
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
    setAuctionRemind: function(t) {
        var e = this, i = t.currentTarget.dataset.auctionId, d = t.currentTarget.dataset.index;
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
                })) : (e.data.auctionList[d].remind_id = a.data.data.remind_id, e.data.auctionList[d].remind = 1, 
                e.setData({
                    auctionShowList: e.data.auctionList
                }));
            }
        });
    },
    getAuctionRemind: function() {
        var i = this, d = wx.getStorageSync("userInfo");
        app.util.request({
            url: "entry/wxapp/auction-remind-list",
            showLoading: !1,
            success: function(e) {
                0 < e.data.data.length && (i.data.diyPage.id ? (i.data.diyPage.design.forEach(function(t) {
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
                        t.auction_id == a.id && t.uid == d.memberInfo.uid && (a.remind = 1, a.remind_id = t.id);
                    });
                }), i.setData({
                    auctionShowList: i.data.auctionList
                })));
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
    fecthCoupon: function(t) {
        var a = this, i = t.currentTarget.dataset.id;
        app.util.request({
            url: "entry/wxapp/coupon-fetch",
            data: {
                id: i,
                form_id: t.detail.formId
            },
            success: function(e) {
                a.data.diyPage.design.forEach(function(a) {
                    "coupon" == a.name && a.data.list.forEach(function(t) {
                        i == t.id && (t.get_time = e.data.data.get_time, t.background = util.isEmpty(a.style.disabledBackground) ? "http://qn.zxsite.cn/zxsite_shop/coupon-index-disabled-bg-2.png" : a.style.disabledBackground, 
                        t.disabled = !0);
                    });
                }), a.setData({
                    diyPage: a.data.diyPage
                });
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
        for (var a = t.currentTarget.dataset.index, e = this.data.diyFormField[a].item, i = "", d = 0, n = e.length; d < n; ++d) {
            if (e[d].value == t.currentTarget.dataset.value.value) {
                var r = "diyFormField[" + a + "].item[" + d + "].checked";
                this.setData(_defineProperty({}, r, !t.currentTarget.dataset.value.checked));
            }
            e[d].checked && (util.isEmpty(i) || (i += ","), i += e[d].value);
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
    bindChooseImage: function(d) {
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
                        var e = d.currentTarget.dataset.index;
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
        for (var a = this.data.diyFormIndex, e = [], i = 0, d = this.data.diyFormField.length; i < d; ++i) {
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
        var r = this;
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
                }), r.data.diyFormField = [], r.setData({
                    diyFormField: r.data.diyFormField.concat(r.data.diyPage.design[a].data.list)
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