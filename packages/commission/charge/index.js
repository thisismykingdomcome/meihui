var app = getApp();

Page({
    data: {
        textCharge: "佣金",
        textWithdraw: "提现",
        textCommissionCharge: "分销佣金",
        textUnion: "元"
    },
    onLoad: function(t) {
        var i = this;
        app.utils.common.getUserInfo(function(t) {
            t ? app.utils.common.getSettings(function(e) {
                app.util.request({
                    url: "entry/wxapp/commission-charge",
                    data: {
                        m: "zxsite_shop"
                    },
                    success: function(t) {
                        i.setData({
                            charge: t.data.data,
                            themeColor: e.theme_color ? e.theme_color : "#f44",
                            settle_days: e.commission_settle_days,
                            withdraw_least: e.commission_withdraw_least,
                            withdraw_charge: e.commission_withdraw_charge,
                            textCharge: e.commission_text_charge ? e.commission_text_charge : "佣金",
                            textCommissionCharge: e.commission_text_commission_charge ? e.commission_text_commission_charge : "分销佣金",
                            textWithdraw: e.commission_text_withdraw ? e.commission_text_withdraw : "提现",
                            textVisibleWithdrawCharge: e.commission_text_visible_withdraw_charge ? e.commission_text_visible_withdraw_charge : "可提现佣金",
                            textAppliedCharge: e.commission_text_applied_charge ? e.commission_text_applied_charge : "已申请佣金",
                            textCheckedCharge: e.commission_text_checked_charge ? e.commission_text_checked_charge : "待打款佣金",
                            textWithdrewCharge: e.commission_text_withdrew_charge ? e.commission_text_withdrew_charge : "已提现佣金",
                            textUnsettledCharge: e.commission_text_unsettled_charge ? e.commission_text_unsettled_charge : "未结算佣金",
                            textInvalidCharge: e.commission_text_invalid_charge ? e.commission_text_invalid_charge : "无效佣金",
                            textUnion: e.commission_text_union ? e.commission_text_union : "元"
                        }), wx.setNavigationBarTitle({
                            title: i.data.textCommissionCharge
                        });
                    }
                });
            }) : wx.redirectTo({
                url: "/zxsite_shop/start/start?url=/packages/commission/charge/index"
            });
        });
    },
    onApply: function() {
        wx.redirectTo({
            url: "../withdraw/apply"
        });
    }
});