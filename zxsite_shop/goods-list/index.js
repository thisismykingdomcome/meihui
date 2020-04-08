var app = getApp(), common = require("../../utils/common.js"), util = require("../../utils/util.js");

Page({
    data: {
        goods: [],
        scrollTop: "0",
        loadingMoreHidden: !0,
        backgroundColor: "#f8f8f8",
        themeColor: "#f44",
        statusType: [ {
            name: "综合",
            type: "default"
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
        searchType: "default",
        page: "1",
        total: 1,
        categoryId: "",
        searchInput: "",
        textCharge: "佣金",
        textUnion: "元"
    },
    statusTap: function(t) {
        var a = t.currentTarget.dataset.index;
        this.data.currentType = a;
        var e = t.currentTarget.dataset.type;
        e === this.data.searchType && "default" != e && this.data.priceOrder === t.currentTarget.dataset.order || (this.data.goods = []), 
        "price" == e ? "asc" == this.data.priceOrder || "" == this.data.priceOrder ? this.data.priceOrder = "desc" : this.data.priceOrder = "asc" : this.data.priceOrder = "", 
        this.setData({
            currentType: a,
            priceOrder: this.data.priceOrder,
            searchType: e,
            loadingMoreHidden: !0,
            page: 1
        }), this.getGoodsList(this.data.searchInput, e, this.data.priceOrder);
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
    onLoad: function(a) {
        var e = this;
        common.getSettings(function(t) {
            common.setCustomNavigationBar(t), common.setCustomTabBar(e, t), e.setData({
                themeColor: t.theme_color ? t.theme_color : "#f44",
                backgroundColor: t.background_color ? t.background_color : "#f8f8f8",
                textCharge: t.commission_text_charge ? t.commission_text_charge : "佣金",
                textUnion: t.commission_text_union ? t.commission_text_union : "元",
                categoryId: util.isEmpty(a.category_id) ? "" : a.category_id
            });
        }), e.getCommissionAgent(), e.getGoodsList("", "default", "");
    },
    getGoodsList: function(t, a, e) {
        var s = this, r = this.data.page, i = this.data.goods;
        if (r <= this.data.total) {
            var o = {
                name: t,
                search_type: a,
                order: e,
                page: this.data.page,
                category_id: s.data.categoryId
            };
            util.isEmpty(s.data.categoryId) || (o.category_id = s.data.categoryId), app.util.request({
                url: "entry/wxapp/goods-list",
                data: o,
                cachetime: "30",
                success: function(t) {
                    var a = t.data.data.goods;
                    i = 1 < r ? i.concat(a) : a, r == this.data.total && (this.data.loadingMoreHidden = !1), 
                    s.setData({
                        goods: i,
                        page: parseInt(this.data.page) + 1,
                        total: t.data.data.total
                    });
                }
            });
        } else s.setData({
            loadingMoreHidden: !1
        });
    },
    toDetailsTap: function(t) {
        wx.navigateTo({
            url: "/zxsite_shop/goods-details/index?id=" + t.currentTarget.dataset.id
        });
    },
    onReachBottom: function() {
        this.getGoodsList(this.data.searchInput, this.data.searchType, this.data.priceOrder);
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
    }
});