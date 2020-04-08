var app = getApp();

Page({
    data: {
        carouselList: [],
        categoryList: [],
        goodsList: [],
        loadImageError: !1,
        themeColor: "#f44",
        backgroundColor: "#ffffff",
        tabActive: 0,
        category: {},
        page: 1,
        total: 1,
        loadingMoreHidden: !0
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
            url: "/packages/credit-shop/goods-detail/index?id=" + t.currentTarget.dataset.id
        });
    },
    onLoad: function(t) {
        var a = this;
        app.utils.common.getUserInfo(function(t) {
            if (t) app.utils.common.getSettings(function(t) {
                app.utils.common.setCustomNavigationBar(t), app.utils.common.setCustomTabBar(a, t), 
                a.setData({
                    themeColor: t.theme_color ? t.theme_color : "#f44"
                }), a.getDataList(), app.util.showLoading();
            }); else {
                wx.redirectTo({
                    url: "/zxsite_shop/start/start?url=/packages/credit-shop/index/index"
                });
            }
        });
    },
    onTabChange: function(t) {
        this.data.page = 1;
        var a = this.data.categoryList[t.detail.index];
        this.setData({
            category: a,
            goodsList: [],
            loadingMoreHidden: !0
        }), this.getGoodsList();
    },
    onPullDownRefresh: function() {
        wx.showNavigationBarLoading(), app.util.showLoading(), this.data.page = 1, this.getDataList();
    },
    getDataList: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/credit-shop",
            data: {
                m: "zxsite_shop"
            },
            showLoading: !1,
            success: function(t) {
                new Date();
                a.setData({
                    carouselList: t.data.data.carousel_list,
                    categoryList: t.data.data.category_list,
                    category: 0 < t.data.data.category_list.length ? t.data.data.category_list[0] : {}
                }), a.getGoodsList();
            }
        });
    },
    getGoodsList: function() {
        var e = this, i = this.data.articleList;
        if (this.data.page <= this.data.total || 1 == this.data.page) {
            var t = {
                m: "zxsite_shop",
                category_id: this.data.category.id,
                page: this.data.page
            };
            0 < this.data.status && (t.status = this.data.status), app.utils.util.isEmpty(this.data.searchKey) || app.utils.util.isEmpty(this.data.searchValue) || (t.key = e.data.searchKey, 
            t.value = e.data.searchValue), app.util.request({
                url: "entry/wxapp/credit-shop-goods-list",
                data: t,
                showLoading: !1,
                success: function(t) {
                    var a = t.data.data.list;
                    i = 1 < e.data.page ? i.concat(a) : a, e.setData({
                        goodsList: i,
                        page: parseInt(e.data.page) + 1,
                        total: t.data.data.total,
                        loadingMoreHidden: e.data.pagepage < t.data.data.total
                    }), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh(), wx.hideLoading();
                }
            });
        } else e.setData({
            loadingMoreHidden: !1
        });
    },
    toOrder: function(t) {
        wx.navigateTo({
            url: "/packages/credit-shop/order-list/index"
        });
    },
    onShareAppMessage: function() {
        return {
            title: "积分商城——" + wx.getStorageSync("settings").shop_name,
            path: "/packages/credit_shop/index/index",
            success: function(t) {},
            fail: function(t) {}
        };
    },
    loadImageError: function(t) {
        this.setData({
            loadImageError: !0
        });
    }
});