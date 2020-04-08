var app = getApp();

Page({
    data: {
        themeColor: "#f44",
        backgroundColor: "#f8f8f8",
        statusType: [ "全部", "待审核", "待打款", "已打款" ],
        currentType: 0,
        status: 0,
        page: 1,
        total: 1,
        withdrawList: [],
        loadingMoreHidden: !0,
        textWithdraw: "提现",
        textUnion: "元"
    },
    onLoad: function(t) {
        var a = this;
        app.utils.common.getUserInfo(function(t) {
            t ? app.utils.common.getSettings(function(t) {
                a.setData({
                    themeColor: t.theme_color ? t.theme_color : "#f44",
                    textWithdraw: t.commission_text_withdraw ? t.commission_text_withdraw : "提现",
                    textUnion: t.commission_text_union ? t.commission_text_union : "元"
                }), wx.setNavigationBarTitle({
                    title: a.data.textWithdraw + "记录"
                }), a.getWithdrawList();
            }) : wx.redirectTo({
                url: "/zxsite_shop/start/start?url=/packages/commission/withdraw/index"
            });
        });
    },
    statusTap: function(t) {
        var a = t.currentTarget.dataset.index;
        this.data.page = 1, this.data.status = 3 == a ? 5 : a, this.setData({
            currentType: t.currentTarget.dataset.index
        }), this.getWithdrawList();
    },
    getWithdrawList: function() {
        var i = this, e = this.data.withdrawList;
        if (this.data.page <= this.data.total || 1 == this.data.page) {
            var t = {
                m: "zxsite_shop",
                page: this.data.page
            };
            0 < this.data.status && (t.status = this.data.status), app.util.request({
                url: "entry/wxapp/commission-withdraw",
                data: t,
                success: function(t) {
                    var a = t.data.data.list;
                    e = 1 < i.data.page ? e.concat(a) : a, i.setData({
                        withdrawList: e,
                        page: parseInt(i.data.page) + 1,
                        total: t.data.data.total,
                        loadingMoreHidden: i.data.pagepage < t.data.data.total
                    }), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
                }
            });
        } else i.setData({
            loadingMoreHidden: !1
        });
    },
    onPullDownRefresh: function() {
        this.data.page = 1, this.getWithdrawList();
    },
    onReachBottom: function() {
        this.getWithdrawList();
    }
});