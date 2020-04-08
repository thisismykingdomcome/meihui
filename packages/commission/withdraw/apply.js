var app = getApp();

Page({
    data: {
        themeColor: "#f44",
        backgroundColor: "#ffffff",
        typeActionsShow: !1,
        textCharge: "佣金",
        textWithdraw: "提现",
        textUnion: "元"
    },
    onLoad: function(t) {
        var d = this;
        app.utils.common.getUserInfo(function(t) {
            t ? app.utils.common.getSettings(function(s) {
                app.util.request({
                    url: "entry/wxapp/commission-agent",
                    data: {
                        m: "zxsite_shop"
                    },
                    success: function(t) {
                        for (var a = {
                            type: t.data.data.withdraw_type,
                            type_text: d.exchangeType(t.data.data.withdraw_type),
                            real_name: t.data.data.real_name,
                            wechat: t.data.data.wechat,
                            alipay: t.data.data.alipay,
                            bank_name: t.data.data.bank_name,
                            bank_account_name: t.data.data.bank_account_name,
                            bank_account: t.data.data.bank_account
                        }, e = [], i = s.commission_withdraw_type.split(","), n = 0, o = i.length; n < o; ++n) e.push({
                            name: d.exchangeType(i[n]),
                            value: i[n]
                        });
                        d.setData({
                            agent: t.data.data,
                            withdraw: a,
                            withdraw_least: s.commission_withdraw_least,
                            withdraw_charge: s.commission_withdraw_charge,
                            typeActions: e,
                            themeColor: s.theme_color ? s.theme_color : "#f44",
                            textCharge: s.commission_text_charge ? s.commission_text_charge : "佣金",
                            textWithdraw: s.commission_text_withdraw ? s.commission_text_withdraw : "提现",
                            textUnion: s.commission_text_union ? s.commission_text_union : "元"
                        }), wx.setNavigationBarTitle({
                            title: d.data.textCharge + d.data.textWithdraw
                        });
                    }
                });
            }) : wx.redirectTo({
                url: "/zxsite_shop/start/start?url=/packages/commission/withdraw/apply"
            });
        });
    },
    onFieldChange: function(t) {
        "real_name" == t.currentTarget.id ? this.data.withdraw.real_name = t.detail : "wechat" == t.currentTarget.id ? this.data.withdraw.wechat = t.detail : "alipay" == t.currentTarget.id ? this.data.withdraw.alipay = t.detail : "bank_name" == t.currentTarget.id ? this.data.withdraw.bank_name = t.detail : "bank_account_name" == t.currentTarget.id ? this.data.withdraw.bank_account_name = t.detail : "bank_account" == t.currentTarget.id ? this.data.withdraw.bank_account = t.detail : "apply_money" == t.currentTarget.id && (this.data.withdraw.apply_money = t.detail);
    },
    exchangeType: function(t) {
        return 0 == t ? "请选择" : 1 == t ? "微信" : 2 == t ? "支付宝" : 3 == t ? "银行卡" : 4 == t ? "余额" : void 0;
    },
    onTypeClick: function(t) {
        this.setData({
            typeActionsShow: !0
        });
    },
    onTypeActionsSelect: function(t) {
        this.data.withdraw.type = t.detail.value, this.data.withdraw.type_text = this.exchangeType(t.detail.value), 
        this.setData({
            typeActionsShow: !1,
            withdraw: this.data.withdraw
        });
    },
    onTypeActionsCancel: function(t) {
        this.setData({
            typeActionsShow: !1
        });
    },
    onApply: function(t) {
        if (0 == this.data.withdraw.type) wx.showToast({
            title: "请选择提现方式",
            icon: "none",
            duration: 2e3
        }); else if (1 != this.data.withdraw.type && 2 != this.data.withdraw.type || !app.utils.util.isEmpty(this.data.withdraw.real_name)) if (1 == this.data.withdraw.type && app.utils.util.isEmpty(this.data.withdraw.wechat)) wx.showToast({
            title: "请输入微信号",
            icon: "none",
            duration: 2e3
        }); else if (2 == this.data.withdraw.type && app.utils.util.isEmpty(this.data.withdraw.alipay)) wx.showToast({
            title: "请输入支付宝账号",
            icon: "none",
            duration: 2e3
        }); else if (3 == this.data.withdraw.type && app.utils.util.isEmpty(this.data.withdraw.bank_name)) wx.showToast({
            title: "请输入银行名称",
            icon: "none",
            duration: 2e3
        }); else if (3 == this.data.withdraw.type && app.utils.util.isEmpty(this.data.withdraw.bank_account_name)) wx.showToast({
            title: "请输入银行卡户名",
            icon: "none",
            duration: 2e3
        }); else if (3 == this.data.withdraw.type && app.utils.util.isEmpty(this.data.withdraw.bank_account)) wx.showToast({
            title: "请输入银行卡账号",
            icon: "none",
            duration: 2e3
        }); else if (app.utils.util.isEmpty(this.data.withdraw.apply_money)) wx.showToast({
            title: "请输入提现金额",
            icon: "none",
            duration: 2e3
        }); else if (parseFloat(this.data.withdraw.apply_money) > parseFloat(this.data.agent.withdraw_available)) wx.showToast({
            title: "提现金额不可超过可提现金额",
            icon: "none",
            duration: 2e3
        }); else {
            app.util.request({
                url: "entry/wxapp/commission-withdraw-apply",
                data: Object.assign({
                    m: "zxsite_shop"
                }, this.data.withdraw),
                method: "POST",
                success: function(t) {
                    var a = getCurrentPages();
                    a[a.length - 2].onRefreshData(), wx.showToast({
                        title: t.data.message,
                        icon: "none",
                        duration: 2e3
                    }), setTimeout(function() {
                        wx.navigateBack({});
                    }, 2e3);
                }
            });
        } else wx.showToast({
            title: "请输入真实姓名",
            icon: "none",
            duration: 2e3
        });
    }
});