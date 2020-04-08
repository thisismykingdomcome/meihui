var app = getApp(), common = require("../../utils/common.js"), util = require("../../utils/util.js");

Page({
    data: {
        searchInput: "",
        scrollTop: "0",
        backgroundColor: "#f8f8f8",
        themeColor: "#f44",
        statusType: [ {
            name: "综合",
            type: "newest"
        }, {
            name: "最新",
            type: "newest"
        }, {
            name: "价格",
            type: "price"
        }, {
            name: "销量",
            type: "sales"
        } ],
        currentType: 0,
        tabClass: [ "", "", "", "", "", "" ],
        priceOrder: "",
        searchType: "newest",
        page: "1",
        total: 1,
        loadingMoreHidden: !0
    },
    statusTap: function(t) {
        var a = t.currentTarget.dataset.index;
        this.data.currentType = a;
        var e = t.currentTarget.dataset.type;
        e === this.data.searchType && "newest" != e && this.data.priceOrder === t.currentTarget.dataset.order || (this.data.goods = []), 
        "price" == e ? "asc" == this.data.priceOrder ? this.data.priceOrder = "desc" : this.data.priceOrder = "asc" : this.data.priceOrder = "", 
        this.setData({
            currentType: a,
            priceOrder: this.data.priceOrder,
            searchType: e,
            loadingMoreHidden: !0,
            page: 1
        }), this.getGoodsList(this.data.searchInput, e, this.data.priceOrder);
    },
    onLoad: function(t) {
        var a = this;
        common.getSettings(function(t) {
            common.setCustomNavigationBar(t), common.setCustomTabBar(a, t), a.setData({
                themeColor: t.theme_color ? t.theme_color : "#f44",
                backgroundColor: t.background_color ? t.background_color : "#f8f8f8"
            });
        }), this.setData({
            searchInput: t.keyword,
            themeColor: this.data.themeColor,
            backgroundColor: this.data.backgroundColor
        }), a.getGoodsList(t.keyword, "newest", "");
    },
    getGoodsList: function(t, a, e) {
        var r = this, s = this.data.page, o = this.data.goods;
        s <= this.data.total ? app.util.request({
            url: "entry/wxapp/goods-list",
            data: {
                name: t,
                search_type: a,
                order: e,
                page: this.data.page
            },
            cachetime: "30",
            success: function(t) {
                var a = t.data.data.goods;
                o = 1 < s ? o.concat(a) : a, s == this.data.total && (this.data.loadingMoreHidden = !1), 
                r.setData({
                    goods: o,
                    page: parseInt(this.data.page) + 1,
                    total: t.data.data.total
                });
            }
        }) : r.setData({
            loadingMoreHidden: !1
        });
    },
    listenerSearchInput: function(t) {
        this.setData({
            searchInput: t.detail.value
        });
    },
    toSearch: function(t) {
        this.setData({
            page: 1,
            loadingMoreHidden: !0
        }), this.getGoodsList(this.data.searchInput, this.data.searchType, this.data.priceOrder);
    },
    toDetailsTap: function(t) {
        wx.navigateTo({
            url: "/zxsite_shop/goods-details/index?id=" + t.currentTarget.dataset.id
        });
    },
    onReachBottom: function() {
        this.getGoodsList(this.data.searchInput, this.data.searchType, this.data.priceOrder);
    }
});