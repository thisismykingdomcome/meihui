var app = getApp();

Page({
    data: {
        themeColor: "#f44",
        backgroundColor: "#ffffff",
        creditsList: [],
        member: {},
        page: 1,
        total: 1,
        loadingMoreHidden: !0,
        creditsDialogShow: !1,
        creditsTypeText: "请选择",
        creditsTypeActionsShow: !1,
        creditsTypeActions: [ {
            name: "积分"
        }, {
            name: "余额"
        } ]
    },
    onLoad: function(t) {
        wx.getStorageSync("userInfo") ? (this.data.member.uid = t.uid, this.getCreditsList()) : wx.redirectTo({
            url: "/zxsite_shop/start/start?url=/packages/manage/member/credits&type=redirect&uid=" + t.uid
        });
    },
    getCreditsList: function() {
        var s = this, r = this.data.creditsList;
        this.data.page <= this.data.total || 1 == this.data.page ? app.util.request({
            url: "entry/wxapp/manage-member",
            data: {
                m: "zxsite_shop",
                op: "credits",
                uid: this.data.member.uid,
                page: this.data.page
            },
            success: function(t) {
                for (var e = t.data.data.list, a = 0, i = e.length; a < i; ++a) e[a].createtime = app.utils.util.formatTime(new Date(1e3 * e[a].createtime));
                r = 1 < this.data.page ? r.concat(e) : e, s.setData({
                    creditsList: r,
                    page: parseInt(s.data.page) + 1,
                    total: t.data.data.total,
                    loadingMoreHidden: s.data.page < t.data.data.total
                });
            }
        }) : s.setData({
            loadingMoreHidden: !1
        });
    },
    onAdd: function(a) {
        var i = this;
        app.util.request({
            url: "entry/wxapp/manage-member",
            data: {
                m: "zxsite_shop",
                op: "get",
                uid: this.data.member.uid
            },
            success: function(t) {
                var e = t.data.data;
                e.credittype = a.currentTarget.dataset.type, i.setData({
                    member: e,
                    creditsDialogShow: !0
                });
            }
        });
    },
    onFieldChange: function(t) {
        "num" == t.currentTarget.id ? this.data.member.num = t.detail : "remark" == t.currentTarget.id && (this.data.member.remark = t.detail);
    },
    onCreditsDialogCancel: function() {
        this.data.member.num = "", this.data.member.remark = "", this.setData({
            member: this.data.member
        });
    },
    onCreditsDialogConfirm: function() {
        app.utils.util.isEmpty(this.data.member.num) ? wx.showToast({
            title: "调整数量不能为空",
            icon: "none",
            duration: 2e3
        }) : app.utils.util.isEmpty(this.data.member.remark) ? wx.showToast({
            title: "备注不能为空",
            icon: "none",
            duration: 2e3
        }) : app.util.request({
            url: "entry/wxapp/manage-member",
            data: Object.assign({
                m: "zxsite_shop",
                op: "add-credits"
            }, this.data.member),
            method: "POST",
            success: function(t) {
                var e = getCurrentPages();
                e[e.length - 2].onRefreshData(), wx.showToast({
                    title: t.data.message,
                    icon: "none",
                    duration: 2e3
                }), setTimeout(function() {
                    wx.navigateBack({});
                }, 2e3);
            }
        });
    },
    onReachBottom: function() {
        this.getCreditsList();
    }
});