var app = getApp();

Page({
    data: {
        themeColor: "#f44",
        backgroundColor: "#ffffff",
        memberList: [],
        memberIndex: 0,
        page: 1,
        total: 1,
        loadingMoreHidden: !0,
        searchKey: "",
        searchValue: ""
    },
    onLoad: function(t) {
        wx.getStorageSync("userInfo") ? this.getMemberList() : wx.redirectTo({
            url: "/zxsite_shop/start/start?url=/packages/manage/member/index&type=redirect"
        });
    },
    onRefreshData: function() {
        this.data.page = 1, this.getMemberList();
    },
    onPullDownRefresh: function() {
        this.data.page = 1, this.getMemberList();
    },
    onTabChange: function(t) {
        this.data.page = 1, this.data.status = 0 == t.detail.index ? 1 : 0, this.setData({
            memberList: [],
            loadingMoreHidden: !0
        }), this.getMemberList();
    },
    onReachBottom: function() {
        this.getMemberList();
    },
    getMemberList: function() {
        var a = this, i = this.data.memberList;
        if (this.data.page <= this.data.total || 1 == this.data.page) {
            var t = {
                m: "zxsite_shop",
                op: "index",
                page: this.data.page
            };
            app.utils.util.isEmpty(a.data.searchKey) || app.utils.util.isEmpty(a.data.searchValue) || (t.key = a.data.searchKey, 
            t.value = a.data.searchValue), app.util.showLoading(), app.util.request({
                url: "entry/wxapp/manage-member",
                data: t,
                success: function(t) {
                    var e = t.data.data.list;
                    i = 1 < a.data.page ? i.concat(e) : e, a.setData({
                        memberList: i,
                        page: parseInt(a.data.page) + 1,
                        total: t.data.data.total,
                        loadingMoreHidden: a.data.page < t.data.data.total
                    }), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
                }
            });
        } else a.setData({
            loadingMoreHidden: !1
        });
    },
    onSearch: function(t) {
        this.setData({
            searchKey: "nickname",
            searchValue: t.detail
        }), this.data.page = 1, this.getMemberList();
    },
    onSearchCancel: function() {
        this.setData({
            searchKey: "",
            searchValue: ""
        }), this.data.page = 1, this.getMemberList();
    },
    onEdit: function(t) {
        wx.navigateTo({
            url: "edit?uid=" + t.currentTarget.dataset.uid
        });
    },
    onCredits: function(t) {
        wx.navigateTo({
            url: "credits?uid=" + t.currentTarget.dataset.uid
        });
    },
    onDelete: function(i) {
        var s = this;
        wx.showModal({
            title: "提示",
            content: "是否确认删除？",
            success: function(t) {
                t.confirm && app.util.request({
                    url: "entry/wxapp/manage-member",
                    data: {
                        m: "zxsite_shop",
                        op: "delete",
                        uids: i.currentTarget.dataset.uid
                    },
                    success: function(t) {
                        for (var e = 0, a = s.data.memberList.length; e < a; ++e) if (s.data.memberList[e].uid == i.currentTarget.dataset.uid) {
                            s.data.memberList.splice(e, 1);
                            break;
                        }
                        s.setData({
                            memberList: s.data.memberList
                        });
                    }
                });
            }
        });
    }
});