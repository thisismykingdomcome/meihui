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
        themeColor: "#ff4444",
        backgroundColor: "#ffffff",
        page: {},
        menuIndex: 0,
        goodsIndex: 0,
        toView: "",
        scrollTop: 100,
        goodsCounts: 0,
        totalPrice: 0,
        payDesc: "",
        enough: !1,
        deliveryPrice: 4,
        goodsDetail: {},
        buyNumber: 0,
        buyNumMin: 1,
        buyNumMax: 0,
        hideCartPopup: !0,
        hidePropertyPopup: !0,
        canPropertyAdd: !1,
        shopCarInfo: {
            shopList: [],
            shopNum: 0
        },
        windowHeight: 0
    },
    onLoad: function(a) {
        var e = this;
        e.setData({
            "page.id": a.id
        }), app.utils.common.getUserInfo(function(t) {
            t ? (app.utils.common.getSettings(function(t) {
                app.utils.common.setCustomNavigationBar(t), e.setData({
                    themeColor: t.theme_color ? t.theme_color : "#ff4444"
                });
            }), wx.getSystemInfo({
                success: function(t) {
                    e.setData({
                        windowHeight: t.windowHeight
                    });
                }
            })) : wx.redirectTo({
                url: "/zxsite_shop/start/start?url=/packages/quick/index/index&id=" + a.id
            });
        });
    },
    onShow: function() {
        var t = wx.getStorageSync("quick-cart");
        app.utils.util.isEmpty(t) && (t = {
            shopList: [],
            shopNum: 0
        }), this.setData({
            shopCarInfo: t,
            hideCartPopup: !0
        }), this.handleTotalPrice(), app.util.showLoading(), this.getQuick(this.data.page.id);
    },
    getQuick: function(t) {
        var s = this;
        app.util.request({
            url: "entry/wxapp/quick",
            data: {
                m: "zxsite_shop",
                id: t
            },
            showLoading: !1,
            success: function(t) {
                if (0 < s.data.shopCarInfo.shopList.length) for (var a = 0; a < t.data.data.data.list.length; ++a) for (var e = 0; e < t.data.data.data.list[a].goods.length; ++e) for (var i = 0; i < s.data.shopCarInfo.shopList.length; ++i) s.data.shopCarInfo.shopList[i].id == t.data.data.data.list[a].goods[e].id && (app.utils.util.isEmpty(t.data.data.data.list[a].goods[e].count) ? t.data.data.data.list[a].goods[e].count = s.data.shopCarInfo.shopList[i].number : t.data.data.data.list[a].goods[e].count += s.data.shopCarInfo.shopList[i].number);
                s.setData({
                    page: t.data.data
                }), s.handlePayDesc(), wx.setNavigationBarTitle({
                    title: t.data.data.title
                }), wx.setNavigationBarColor({
                    frontColor: "black" == t.data.data.title_bar_color ? "#000000" : "#ffffff",
                    backgroundColor: t.data.data.title_bar_background_color
                }), wx.hideNavigationBarLoading(), wx.hideLoading();
            }
        });
    },
    selectMenu: function(t) {
        var a = t.currentTarget.dataset.itemIndex;
        this.setData({
            menuIndex: a,
            toView: "group-" + a.toString()
        });
    },
    onDecreaseGoods: function(t) {
        var a = t.currentTarget.dataset.itemIndex, e = t.currentTarget.dataset.parentindex, i = this.data.page.data.list[e].goods[a];
        if (app.utils.util.isEmpty(i.properties) && app.utils.util.isEmpty(i.diy_form_fields)) {
            var s = this.data.shopCarInfo;
            this.data.page.data.list[e].goods[a].count--;
            for (var o = 0, d = s.shopList.length; o < d; ++o) if (s.shopList[o].id == i.id) {
                s.shopNum--, s.shopList[o].number--, 0 == s.shopList[o].number && s.shopList.splice(o, 1);
                break;
            }
            wx.setStorage({
                key: "quick-cart",
                data: s
            }), this.setData({
                "page.data.list": this.data.page.data.list
            }), this.handleTotalPrice(), this.handlePayDesc();
        } else wx.showToast({
            title: "多规格商品请到购物车中删除",
            icon: "none",
            duration: 2e3
        });
    },
    onAddGoodsBefore: function(t) {
        var a = t.currentTarget.dataset.parentindex, e = t.currentTarget.dataset.itemIndex, i = this.data.page.data.list[a].goods[e], s = app.utils.util.isEmpty(i.properties) && app.utils.util.isEmpty(i.diy_form_fields);
        if (i.propertyIds = "", i.propertyNames = "", i.diyForm = [], !app.utils.util.isEmpty(i.diy_form_fields)) for (var o = 0, d = i.diy_form_fields.length; o < d; ++o) {
            var r = i.diy_form_fields[o];
            if (3 == r.type) r.item = r.value.split("|"), r.data = ""; else if (4 == r.type) {
                var n = r.value.split("|");
                r.item = [], r.data = "";
                for (var p = 0; p < n.length; ++p) r.item.push({
                    value: n[p],
                    checked: !1
                });
            } else 7 == r.type ? r.item = [] : r.data = r.value;
            i.diyForm.push(r);
        }
        if (this.setData({
            menuIndex: a,
            goodsIndex: e,
            goodsDetail: i,
            buyNumMax: i.stores,
            buyNumber: 0 < i.stores ? 1 : 0,
            hidePropertyPopup: s
        }), s) {
            if (i.count >= i.stores) return void wx.showToast({
                title: "商品库存不足",
                icon: "none",
                duration: 2e3
            });
            this.onAddGoods();
        }
    },
    onAddGoods: function(t) {
        if (!app.utils.util.isEmpty(this.data.goodsDetail.properties) && 0 < this.data.goodsDetail.properties.length && !this.data.canPropertyAdd) this.data.canPropertyAdd || wx.showToast({
            title: "请选择商品规格",
            icon: "none",
            duration: 2e3
        }); else {
            if (!app.utils.util.isEmpty(this.data.goodsDetail.diy_form_fields)) for (var a = 0, e = this.data.goodsDetail.diyForm.length; a < e; ++a) {
                if (1 == this.data.goodsDetail.diyForm[a].required && app.utils.util.isEmpty(this.data.goodsDetail.diyForm[a].data)) return void wx.showToast({
                    title: "请" + (1 == this.data.goodsDetail.diyForm[a].type || 2 == this.data.goodsDetail.diyForm[a].type ? "填写" : "选择") + this.data.goodsDetail.diyForm[a].name,
                    icon: "none",
                    duration: 2e3
                });
                if (7 == this.data.goodsDetail.diyForm[a].type && 1 == this.data.goodsDetail.diyForm[a].required && 0 == this.data.goodsDetail.diyForm[a].item.length) return void wx.showToast({
                    title: "请上传" + this.data.goodsDetail.diyForm[a].name,
                    icon: "none",
                    duration: 2e3
                });
            }
            if ((this.data.goodsDetail.properties || this.data.goodsDetail.diy_form_fields) && this.data.buyNumber < 1) wx.showToast({
                title: "购买数量不能为0",
                icon: "none",
                duration: 2e3
            }); else {
                var i = this.bulidShopCarInfo();
                wx.setStorage({
                    key: "quick-cart",
                    data: i
                }), app.utils.util.isEmpty(this.data.page.data.list[this.data.menuIndex].goods[this.data.goodsIndex].count) ? this.data.page.data.list[this.data.menuIndex].goods[this.data.goodsIndex].count = this.data.buyNumber : this.data.page.data.list[this.data.menuIndex].goods[this.data.goodsIndex].count += parseInt(this.data.buyNumber), 
                this.setData({
                    "page.data.list": this.data.page.data.list,
                    hidePropertyPopup: !0
                }), this.handleTotalPrice(), this.handlePayDesc();
            }
        }
    },
    bulidShopCarInfo: function() {
        this.data.buyNumber = app.utils.util.isEmpty(this.data.goodsDetail.properties) && app.utils.util.isEmpty(this.data.goodsDetail.diy_form_fields) ? 1 : this.data.buyNumber;
        var t = {};
        t.id = this.data.goodsDetail.id, t.categoryId = this.data.goodsDetail.category_id, 
        t.barCode = this.data.goodsDetail.bar_code, t.cover = this.data.goodsDetail.cover, 
        t.pictures = this.data.goodsDetail.pictures, t.title = this.data.goodsDetail.title, 
        t.subTitle = this.data.goodsDetail.sub_title, t.type = this.data.goodsDetail.type, 
        t.propertyIds = this.data.goodsDetail.propertyIds, t.propertyNames = this.data.goodsDetail.propertyNames, 
        t.price = this.data.goodsDetail.price, t.marketPrice = this.data.goodsDetail.market_price, 
        t.stores = this.data.goodsDetail.stores, t.left = "", t.active = !0, t.number = this.data.buyNumber, 
        t.template_id = this.data.goodsDetail.template_id, t.freight = this.data.goodsDetail.freight, 
        t.weight = this.data.goodsDetail.weight, t.is_cash = this.data.goodsDetail.is_cash, 
        t.integralGive = this.data.goodsDetail.integral_give, t.diyForm = "";
        for (var a = 0, e = this.data.goodsDetail.diyForm.length; a < e; ++a) 0 < a && (t.diyForm += ";"), 
        7 == this.data.goodsDetail.diyForm[a].type && (this.data.goodsDetail.diyForm[a].data = this.data.goodsDetail.diyForm[a].item.join(",")), 
        t.diyForm += this.data.goodsDetail.diyForm[a].name + "|" + this.data.goodsDetail.diyForm[a].data;
        var i = this.data.shopCarInfo;
        i.shopNum || (i.shopNum = 0), i.shopList || (i.shopList = []);
        for (var s = -1, o = 0; o < i.shopList.length; o++) {
            var d = i.shopList[o];
            if (d.id == t.id && d.propertyIds == t.propertyIds) {
                s = o, t.number = parseInt(t.number) + parseInt(d.number);
                break;
            }
        }
        return i.shopNum = parseInt(i.shopNum) + parseInt(this.data.buyNumber), -1 < s ? i.shopList.splice(s, 1, t) : i.shopList.push(t), 
        i;
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
    onSelectPropertyItem: function(t) {
        for (var a = this, e = a.data.goodsDetail.properties[t.currentTarget.dataset.propertyindex].childs, i = 0; i < e.length; i++) a.data.goodsDetail.properties[t.currentTarget.dataset.propertyindex].childs[i].active = !1;
        a.data.goodsDetail.properties[t.currentTarget.dataset.propertyindex].childs[t.currentTarget.dataset.propertychildindex].active = !0;
        var s = a.data.goodsDetail.properties.length, o = 0, d = "", r = "";
        for (i = 0; i < a.data.goodsDetail.properties.length; i++) {
            e = a.data.goodsDetail.properties[i].childs;
            for (var n = 0; n < e.length; n++) e[n].active && (o++, "" != d && (d += ","), d = d + a.data.goodsDetail.properties[i].id + ":" + e[n].id, 
            r = r + a.data.goodsDetail.properties[i].name + ":" + e[n].name + "  ");
        }
        var p = s == o;
        p && app.util.request({
            url: "entry/wxapp/goods-price",
            data: {
                m: "zxsite_shop",
                id: a.data.goodsDetail.id,
                property_ids: d
            },
            success: function(t) {
                a.setData({
                    "goodsDetail.price": t.data.data.price,
                    "goodsDetail.stores": t.data.data.stores,
                    "goodsDetail.propertyIds": d,
                    "goodsDetail.propertyNames": r,
                    buyNumMax: t.data.data.stores,
                    buyNumber: 0 < t.data.data.stores ? 1 : 0,
                    "goodsDetail.cover": t.data.data.cover ? t.data.data.cover : a.data.goodsDetail.cover
                });
            }
        }), this.setData({
            goodsDetail: a.data.goodsDetail,
            canPropertyAdd: p
        });
    },
    handleTotalPrice: function() {
        for (var t = this.data.shopCarInfo.shopList, a = 0, e = 0; e < t.length; e++) {
            var i = t[e].price * t[e].number;
            t[e].amount = parseFloat(i).toFixed(2), a += i;
        }
        this.setData({
            shopCarInfo: this.data.shopCarInfo,
            totalPrice: a.toFixed(2)
        });
    },
    handlePayDesc: function() {
        var t = !1;
        if (0 == parseFloat(this.data.totalPrice)) this.data.payDesc = "满￥" + parseFloat(this.data.page.data.shopMinPrice).toFixed(2) + "元起送"; else if (parseFloat(this.data.totalPrice) < parseFloat(this.data.page.data.shopMinPrice)) {
            var a = (this.data.page.data.shopMinPrice - this.data.totalPrice).toFixed(2);
            this.data.payDesc = "还差" + a + "元起送";
        } else this.data.payDesc = "去结算", t = !0;
        this.setData({
            payDesc: this.data.payDesc,
            enough: t
        });
    },
    onTogglePopupCart: function() {
        0 != this.data.shopCarInfo.shopNum && this.setData({
            hideCartPopup: !this.data.hideCartPopup
        });
    },
    onTogglePopupProperty: function() {
        this.setData({
            hidePropertyPopup: !this.data.hidePropertyPopup
        });
    },
    onCartRreduce: function(t) {
        var a = t.currentTarget.dataset.index, e = this.data.shopCarInfo;
        e.shopNum--, e.shopList[a].number--;
        for (var i = 0; i < this.data.page.data.list.length; ++i) for (var s = 0; s < this.data.page.data.list[i].goods.length; ++s) e.shopList[a].id == this.data.page.data.list[i].goods[s].id && this.data.page.data.list[i].goods[s].count--;
        0 == e.shopList[a].number && e.shopList.splice(a, 1), wx.setStorage({
            key: "quick-cart",
            data: e
        }), this.setData({
            "page.data.list": this.data.page.data.list,
            hideCartPopup: 0 == e.shopNum
        }), this.handleTotalPrice(), this.handlePayDesc();
    },
    onCartAdd: function(t) {
        for (var a = t.currentTarget.dataset.index, e = this.data.shopCarInfo, i = 0; i < this.data.page.data.list.length; ++i) for (var s = 0; s < this.data.page.data.list[i].goods.length; ++s) if (e.shopList[a].id == this.data.page.data.list[i].goods[s].id) {
            if (this.data.page.data.list[i].goods[s].count >= this.data.page.data.list[i].goods[s].stores) return void wx.showToast({
                title: "商品库存不足",
                icon: "none",
                duration: 2e3
            });
            e.shopNum++, e.shopList[a].number++, this.data.page.data.list[i].goods[s].count++;
        }
        wx.setStorage({
            key: "quick-cart",
            data: e
        }), this.setData({
            "page.data.list": this.data.page.data.list
        }), this.handleTotalPrice(), this.handlePayDesc();
    },
    onEmpty: function() {
        for (var t = 0; t < this.data.page.data.list.length; ++t) for (var a = 0; a < this.data.page.data.list[t].goods.length; ++a) this.data.page.data.list[t].goods[a].count = 0;
        this.data.shopCarInfo = {
            shopList: [],
            shopNum: 0
        }, wx.setStorage({
            key: "quick-cart",
            data: this.data.shopCarInfo
        }), this.setData({
            "page.data.list": this.data.page.data.list,
            hideCartPopup: !0
        }), this.handleTotalPrice(), this.handlePayDesc();
    },
    onSettle: function(t) {
        if (parseFloat(this.data.totalPrice) >= parseFloat(this.data.page.data.shopMinPrice) && 0 < parseFloat(this.data.totalPrice)) {
            for (var a = !1, e = !1, i = 0, s = this.data.shopCarInfo.shopList.length; i < s; ++i) 1 == this.data.shopCarInfo.shopList[i].type || 2 == this.data.shopCarInfo.shopList[i].type ? a = !0 : 3 == this.data.shopCarInfo.shopList[i].type && (e = !0);
            a && e ? wx.showToast({
                title: "服务商品不能与其他商品一起下单",
                icon: "none",
                duration: 2e3
            }) : wx.navigateTo({
                url: "/zxsite_shop/to-pay-order/index?orderType=quick"
            });
        }
    },
    onDetail: function(t) {
        wx.navigateTo({
            url: "/zxsite_shop/goods-details/index?id=" + t.currentTarget.dataset.id
        });
    },
    bindTextInput: function(t) {
        var a = "goodsDetail.diyForm[" + t.currentTarget.dataset.index + "].data";
        this.setData(_defineProperty({}, a, t.detail.value));
    },
    bindRadioTap: function(t) {
        var a = "goodsDetail.diyForm[" + t.currentTarget.dataset.index + "].data";
        this.setData(_defineProperty({}, a, t.currentTarget.dataset.value));
    },
    bindCheckBoxTap: function(t) {
        for (var a = t.currentTarget.dataset.index, e = this.data.goodsDetail.diyForm[t.currentTarget.dataset.index].item, i = "", s = 0, o = e.length; s < o; ++s) {
            if (e[s].data == t.currentTarget.dataset.value.value) {
                var d = "goodsDetail.diyForm[" + a + "].item[" + s + "].checked";
                this.setData(_defineProperty({}, d, !t.currentTarget.dataset.value.checked));
            }
            e[s].checked && (util.isEmpty(i) || (i += ","), i += e[s].value);
        }
        this.data.goodsDetail.diyForm[a].data = i;
    },
    bindDateChange: function(t) {
        var a = "goodsDetail.diyForm[" + t.currentTarget.dataset.index + "].data";
        this.setData(_defineProperty({}, a, t.detail.value));
    },
    bindTimeChange: function(t) {
        var a = "goodsDetail.diyForm[" + t.currentTarget.dataset.index + "].data";
        this.setData(_defineProperty({}, a, t.detail.value));
    },
    bindChooseImage: function(s) {
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
                        var e = s.currentTarget.dataset.index;
                        o.data.goodsDetail.diyForm[e].item.push(a.data.url);
                        var i = "goodsDetail.diyForm[" + e + "].item";
                        o.setData(_defineProperty({}, i, o.data.goodsDetail.diyForm[e].item));
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
        this.data.goodsDetail.diyForm[a].item.splice(t.currentTarget.dataset.imageIndex, 1);
        var e = "goodsDetail.diyForm[" + a + "].item";
        this.setData(_defineProperty({}, e, this.data.goodsDetail.diyForm[a].item));
    },
    bindPreviewImage: function(t) {
        wx.previewImage({
            urls: [ t.currentTarget.dataset.src ]
        });
    },
    onShareAppMessage: function() {
        var t = "/packages/quick/index/index?id=" + this.data.page.id;
        return {
            title: this.data.page.share_profile ? this.data.page.share_profile : this.data.page.title,
            path: t,
            imageUrl: this.data.page.share_image,
            success: function(t) {},
            fail: function(t) {}
        };
    }
});