var app = getApp();

Page({
    data: {
        themeColor: "#f44",
        backgroundColor: "#ffffff",
        tabActive: 0,
        categoryList: [],
        category: {},
        articleList: [],
        page: 1,
        total: 1,
        loadingMoreHidden: !0
    },
    onLoad: function(a) {
        var e = this;
        app.utils.common.getSettings(function(t) {
            app.utils.common.setCustomNavigationBar(t), app.utils.common.setCustomTabBar(e, t), 
            e.setData({
                themeColor: t.theme_color ? t.theme_color : "#f44"
            }), e.getCategoryList(), app.utils.util.isEmpty(a.category_id) || (e.data.category.id = a.category_id);
        });
    },
    onTabChange: function(t) {
        this.data.page = 1;
        var a = this.data.categoryList[t.detail.index];
        this.setData({
            category: a,
            articleList: [],
            loadingMoreHidden: !0
        }), wx.setNavigationBarTitle({
            title: a.name
        }), this.getArticleList();
    },
    getCategoryList: function() {
        var o = this;
        app.util.request({
            url: "entry/wxapp/article-category",
            showLoading: !1,
            data: {
                m: "zxsite_shop"
            },
            success: function(t) {
                var a = t.data.data[0], e = 0;
                if (!app.utils.util.isEmpty(o.data.category.id)) for (var i = 0, s = t.data.data.length; i < s; ++i) if (o.data.category.id == t.data.data[i].id) {
                    e = i, a = t.data.data[i];
                    break;
                }
                o.setData({
                    tabActive: e,
                    categoryList: t.data.data,
                    category: a
                }), wx.setNavigationBarTitle({
                    title: a.name
                }), o.getArticleList(a.id);
            }
        });
    },
    getArticleList: function() {
        var e = this, i = this.data.articleList;
        if (this.data.page <= this.data.total || 1 == this.data.page) {
            var t = {
                m: "zxsite_shop",
                category_id: this.data.category.id,
                page: this.data.page
            };
            0 < this.data.status && (t.status = this.data.status), app.utils.util.isEmpty(e.data.searchKey) || app.utils.util.isEmpty(e.data.searchValue) || (t.key = e.data.searchKey, 
            t.value = e.data.searchValue), app.util.request({
                url: "entry/wxapp/article-list",
                data: t,
                success: function(t) {
                    var a = t.data.data.list;
                    i = 1 < e.data.page ? i.concat(a) : a, e.setData({
                        articleList: i,
                        page: parseInt(e.data.page) + 1,
                        total: t.data.data.total,
                        loadingMoreHidden: e.data.pagepage < t.data.data.total
                    }), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
                }
            });
        } else e.setData({
            loadingMoreHidden: !1
        });
    },
    onRefreshData: function() {
        this.data.page = 1, this.getArticleList();
    },
    onPullDownRefresh: function() {
        wx.showNavigationBarLoading(), this.data.page = 1, this.getArticleList();
    },
    onReachBottom: function() {
        this.getArticleList();
    },
    onDetail: function(t) {
        wx.navigateTo({
            url: "detail?id=" + t.currentTarget.dataset.id
        });
    }
});