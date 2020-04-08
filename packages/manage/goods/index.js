var app = getApp();

Page({
    data: {
        themeColor: "#f44",
        backgroundColor: "#ffffff",
        goodsList: [],
        goodsIndex: 0,
        status: 1,
        page: 1,
        total: 1,
        loadingMoreHidden: !0,
        searchKey: "",
        searchValue: ""
    },
    onLoad: function(t) {
        wx.getStorageSync("userInfo") ? this.getGoodsList() : wx.redirectTo({
            url: "/zxsite_shop/start/start?url=/packages/manage/goods/index&type=redirect"
        });
    },
    onRefreshData: function() {
        this.data.page = 1, this.getGoodsList();
    },
    onPullDownRefresh: function() {
        this.data.page = 1, this.getGoodsList();
    },
    onTabChange: function(t) {
        this.data.page = 1, this.data.status = 0 == t.detail.index ? 1 : 0, this.setData({
            goodsList: [],
            loadingMoreHidden: !0
        }), this.getGoodsList();
    },
    onReachBottom: function() {
        this.getGoodsList();
    },
    getGoodsList: function() {
        var s = this, e = this.data.goodsList;
        if (this.data.page <= this.data.total || 1 == this.data.page) {
            var t = {
                m: "zxsite_shop",
                op: "index",
                status: this.data.status,
                page: this.data.page
            };
            app.utils.util.isEmpty(s.data.searchKey) || app.utils.util.isEmpty(s.data.searchValue) || (t.key = s.data.searchKey, 
            t.value = s.data.searchValue), app.util.showLoading(), app.util.request({
                url: "entry/wxapp/manage-goods",
                data: t,
                success: function(t) {
                    var a = t.data.data.list;
                    e = 1 < s.data.page ? e.concat(a) : a, s.setData({
                        goodsList: e,
                        page: parseInt(s.data.page) + 1,
                        total: t.data.data.total,
                        loadingMoreHidden: s.data.page < t.data.data.total
                    }), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
                }
            });
        } else s.setData({
            loadingMoreHidden: !1
        });
    },
    onSearch: function(t) {
        this.setData({
            searchKey: "title",
            searchValue: t.detail
        }), this.data.page = 1, this.getGoodsList();
    },
    onSearchCancel: function() {
        this.setData({
            searchKey: "",
            searchValue: ""
        }), this.data.page = 1, this.getGoodsList();
    },
    onAdd: function() {
        wx.navigateTo({
            url: "edit"
        });
    },
    onEdit: function(t) {
        wx.navigateTo({
            url: "edit?id=" + t.currentTarget.dataset.id
        });
    },
    onSaleOn: function(t) {
        var a = this;
        this.data.goodsIndex = t.currentTarget.dataset.index, app.util.request({
            url: "entry/wxapp/manage-goods",
            data: {
                m: "zxsite_shop",
                op: "shelf",
                status: 1,
                ids: t.currentTarget.dataset.id
            },
            success: function(t) {
                a.data.goodsList.splice(a.data.goodsIndex, 1), a.setData({
                    goodsList: a.data.goodsList
                });
            }
        });
    },
    onSaleOff: function(t) {
        var a = this;
        this.data.goodsIndex = t.currentTarget.dataset.index, app.util.request({
            url: "entry/wxapp/manage-goods",
            data: {
                m: "zxsite_shop",
                op: "shelf",
                status: 0,
                ids: t.currentTarget.dataset.id
            },
            success: function(t) {
                a.data.goodsList.splice(a.data.goodsIndex, 1), a.setData({
                    goodsList: a.data.goodsList
                });
            }
        });
    },
    onDelete: function(a) {
        var s = this;
        this.data.goodsIndex = a.currentTarget.dataset.index, wx.showModal({
            title: "提示",
            content: "是否确认删除？",
            success: function(t) {
                t.confirm && app.util.request({
                    url: "entry/wxapp/manage-goods",
                    data: {
                        m: "zxsite_shop",
                        op: "delete",
                        ids: a.currentTarget.dataset.id
                    },
                    success: function(t) {
                        s.data.goodsList.splice(s.data.goodsIndex, 1), s.setData({
                            goodsList: s.data.goodsList
                        });
                    }
                });
            }
        });
    }
});