var app = getApp();

Page({
    data: {
        themeColor: "#f44",
        backgroundColor: "#ffffff",
        orderDetail: {},
        diyForm: [],
        logStatusMap: [ "关闭", "下单", "支付", "发货", "收货", "评价", "改价", "开始拼团", "拼团成功", "退款成功", "退款失败", "修改物流", "维权同意", "维权拒绝" ]
    },
    onLoad: function(a) {
        if (wx.getStorageSync("userInfo")) {
            var n = this;
            app.utils.util.isEmpty(a.verify_code) || this.setData({
                verifyCode: a.verify_code
            }), app.util.request({
                url: "entry/wxapp/manage-order",
                data: {
                    m: "zxsite_shop",
                    op: "view",
                    id: a.id
                },
                success: function(a) {
                    if (!app.utils.util.isEmpty(a.data.data.logistics)) for (var t = 0, e = a.data.data.logistics.data.length; t < e; ++t) a.data.data.logistics.data[t].text = a.data.data.logistics.data[t].station, 
                    a.data.data.logistics.data[t].desc = a.data.data.logistics.data[t].time;
                    for (t = 0, e = a.data.data.log.length; t < e; ++t) a.data.data.log[t].text = n.data.logStatusMap[a.data.data.log[t].type], 
                    app.utils.util.isEmpty(a.data.data.log[t].remark) || (a.data.data.log[t].text += "(" + a.data.data.log[t].remark + ")"), 
                    a.data.data.log[t].desc = app.utils.util.formatTime(new Date(1e3 * a.data.data.log[t].create_time));
                    for (var i = 0, d = a.data.data.goods.length; i < d; ++i) if (!app.utils.util.isEmpty(a.data.data.goods[i].diy_form)) for (var o = a.data.data.goods[i].diy_form.split(";"), r = 0; r < o.length; r++) {
                        var s = o[r].split("|"), l = {
                            name: s[0],
                            value: s[1]
                        };
                        -1 != l.value.indexOf("http") ? (l.item = l.value.split(","), l.type = "image") : l.type = "text", 
                        n.data.diyForm.push(l);
                    }
                    n.setData({
                        orderDetail: a.data.data,
                        diyForm: n.data.diyForm,
                        logActive: a.data.data.log.length - 1
                    });
                }
            });
        } else wx.redirectTo({
            url: "/zxsite_shop/start/start?url=/packages/manage/order/detail&type=redirect&id=" + a.id
        });
    },
    onTelphoneCall: function(a) {
        wx.makePhoneCall({
            phoneNumber: a.currentTarget.dataset.mobile
        });
    },
    onVerify: function() {
        app.util.request({
            url: "entry/wxapp/manage-order",
            data: {
                m: "zxsite_shop",
                op: "verification",
                id: this.data.orderDetail.id,
                verify_code: this.data.verifyCode
            },
            success: function(a) {
                wx.showToast({
                    title: a.data.message,
                    icon: "none",
                    duration: 2e3
                }), setTimeout(function() {
                    wx.navigateBack({});
                }, 2e3);
            }
        });
    },
    bindPreviewImage: function(a) {
        wx.previewImage({
            urls: [ a.currentTarget.dataset.src ]
        });
    },
    toSetClipboard: function(a) {
        wx.setClipboardData({
            data: a.currentTarget.dataset.content,
            success: function(a) {
                wx.showToast({
                    title: "复制成功",
                    icon: "success",
                    duration: 2e3
                });
            }
        });
    }
});