var app = getApp();

Page({
    data: {
        agent: {},
        textAgent: "分销商"
    },
    onLoad: function(t) {
        var a = this;
        app.utils.common.getUserInfo(function(t) {
            t ? app.utils.common.getSettings(function(t) {
                app.utils.common.setCustomNavigationBar(t), app.utils.common.setCustomTabBar(a, t, "packages/commission/index/index"), 
                app.util.request({
                    url: "entry/wxapp/commission-member-agent",
                    data: {
                        m: "zxsite_shop"
                    },
                    success: function(t) {
                        t.data.data && a.setData({
                            memberAgent: t.data.data
                        });
                    }
                }), a.setData({
                    themeColor: t.theme_color ? t.theme_color : "#f44",
                    settings: t,
                    textAgent: t.commission_text_agent ? t.commission_text_agent : "分销商"
                }), wx.setNavigationBarTitle({
                    title: a.data.textAgent + "申请"
                }), app.WxParse.wxParse("article", "html", t.commission_apply_agree, a, 5);
            }) : wx.redirectTo({
                url: "/zxsite_shop/start/start?url=/packages/commission/apply/index"
            });
        });
    },
    onFieldChange: function(t) {
        "real_name" == t.currentTarget.id ? this.data.agent.real_name = t.detail : "telephone" == t.currentTarget.id && (this.data.agent.telephone = t.detail);
    },
    onApply: function() {
        1 == this.data.settings.commission_apply_full_info && app.utils.util.isEmpty(this.data.agent.real_name) ? wx.showToast({
            title: "真实姓名不能为空",
            icon: "none",
            duration: 2e3
        }) : 1 == this.data.settings.commission_apply_full_info && app.utils.util.isEmpty(this.data.agent.telephone) ? wx.showToast({
            title: "手机号码不能为空",
            icon: "none",
            duration: 2e3
        }) : app.util.request({
            url: "entry/wxapp/commission-apply",
            data: Object.assign({
                m: "zxsite_shop"
            }, this.data.agent),
            success: function(t) {
                5 == t.data.data.status ? wx.redirectTo({
                    url: "../index/index"
                }) : wx.redirectTo({
                    url: "waiting"
                });
            }
        });
    }
});