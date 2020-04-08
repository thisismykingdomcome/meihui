var app = getApp();

Page({
    data: {
        themeColor: "#f44",
        backgroundColor: "#f8f8f8",
        currentType: 0,
        status: 1,
        page: 1,
        total: 1,
        memberList: [],
        loadingMoreHidden: !0,
        textChild: "下线"
    },
    onLoad: function(t) {
        var a = this;
        app.utils.common.getUserInfo(function(t) {
            t ? app.utils.common.getSettings(function(t) {
                a.setData({
                    themeColor: t.theme_color ? t.theme_color : "#f44",
                    textChild: t.commission_text_child ? t.commission_text_child : "下线"
                }), wx.setNavigationBarTitle({
                    title: a.data.textChild
                }), a.getStatusTypeList(), a.getMemberList();
            }) : wx.redirectTo({
                url: "/zxsite_shop/start/start?url=/packages/commission/member/index"
            });
        });
    },
    statusTap: function(t) {
        var a = t.currentTarget.dataset.index;
        this.data.page = 1, this.data.status = a + 1, this.setData({
            currentType: t.currentTarget.dataset.index
        }), this.getMemberList();
    },
    getMemberList: function() {
        var e = this, s = this.data.memberList;
        if (this.data.page <= this.data.total || 1 == this.data.page) {
            var t = {
                m: "zxsite_shop",
                op: "index",
                page: this.data.page,
                status: this.data.status
            };
            app.util.request({
                url: "entry/wxapp/commission-member",
                data: t,
                success: function(t) {
                    var a = t.data.data.list;
                    s = 1 < e.data.page ? s.concat(a) : a, e.setData({
                        memberList: s,
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
    getStatusTypeList: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/commission-member",
            showLoading: !1,
            data: {
                m: "zxsite_shop",
                op: "status"
            },
            success: function(t) {
                a.setData({
                    statusType: t.data.data,
                    statusTypeItemWitdh: 750 / t.data.data.length + "rpx"
                });
            }
        });
    },
    onPullDownRefresh: function() {
        this.data.page = 1, this.getMemberList();
    },
    onReachBottom: function() {
        this.getMemberList();
    }
});