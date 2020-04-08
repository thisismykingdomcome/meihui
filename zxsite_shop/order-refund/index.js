var app = getApp(), common = require("../../utils/common.js"), util = require("../../utils/util.js");

Page({
    data: {
        id: 0,
        backgroundColor: "#f8f8f8",
        typeList: [ {
            id: 0,
            name: "仅退款"
        }, {
            id: 1,
            name: "退款退货"
        }, {
            id: 2,
            name: "换货"
        } ],
        selType: "请选择",
        selTypeIndex: 0,
        photoList: [],
        themeColor: "#f44"
    },
    onLoad: function(t) {
        var e = this;
        common.getSettings(function(t) {
            common.setCustomNavigationBar(t), common.setCustomTabBar(e, t), e.setData({
                themeColor: t.theme_color ? t.theme_color : "#f44",
                backgroundColor: t.background_color ? t.background_color : "#f8f8f8",
                settings: t
            });
        }), this.getOrderDetail(t.id);
    },
    getRefundDetail: function(t) {
        var e = t.currentTarget.dataset.ordertab;
        this.setData({
            orderTab: e
        });
    },
    bindChangeType: function(t) {
        var e = t.detail.value;
        this.setData({
            selType: this.data.typeList[e].name,
            selTypeIndex: e
        });
    },
    chooseImage: function(t) {
        var a = this, i = a.data.photoList, o = app.util.url("entry/wxapp/upload", {
            m: "zxsite_shop"
        });
        wx.chooseImage({
            count: 1,
            sizeType: [ "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(t) {
                app.util.showLoading();
                var e = t.tempFilePaths[0];
                wx.uploadFile({
                    url: o,
                    filePath: e,
                    name: "upfile",
                    formData: {},
                    success: function(t) {
                        var e = JSON.parse(t.data);
                        wx.hideNavigationBarLoading(), wx.hideLoading(), i = i.concat(e.data.url), a.setData({
                            photoList: i,
                            photoListWidth: 158 * i.length + 30 * i.length
                        });
                    },
                    fail: function(t) {
                        wx.hideNavigationBarLoading(), wx.hideLoading(), app.util.message(t, null, "error");
                    }
                });
            }
        });
    },
    getOrderDetail: function(t) {
        var e = this;
        app.util.request({
            url: "entry/wxapp/order-detail",
            data: {
                id: t
            },
            success: function(t) {
                t.data.data.amount = parseFloat(t.data.data.total_amount).toFixed(2), 2 == t.data.data.status && (e.data.typeList = [ {
                    id: 0,
                    name: "仅退款"
                } ]), e.setData({
                    orderDetail: t.data.data,
                    typeList: e.data.typeList
                });
            }
        });
    },
    submitRefund: function(t) {
        var e = t.detail.value.reason, a = t.detail.value.money, i = t.detail.value.logistics_company, o = t.detail.value.logistics_number, s = t.detail.value.remark;
        if (util.isEmpty(this.data.selTypeIndex)) wx.showToast({
            title: "请选择处理方式",
            icon: "none",
            duration: 2e3
        }); else if (util.isEmpty(e)) {
            if (2 == this.data.selTypeIndex) var n = "请填写换货原因"; else n = "请填写退款原因";
            wx.showToast({
                title: n,
                icon: "none",
                duration: 2e3
            });
        } else if (util.isEmpty(a) && 2 != this.data.selTypeIndex) wx.showToast({
            title: "请输入退款金额",
            icon: "none",
            duration: 2e3
        }); else if (a > this.data.orderDetail.amount) wx.showToast({
            title: "退款金额大于最大退款金额，请修改",
            icon: "none",
            duration: 2e4
        }); else {
            if (0 == this.data.orderDetail.is_virtual && (1 == this.data.selTypeIndex || 2 == this.data.selTypeIndex)) {
                if (util.isEmpty(i)) return void wx.showToast({
                    title: "请填写物流公司",
                    icon: "none",
                    duration: 2e3
                });
                if (util.isEmpty(o)) return void wx.showToast({
                    title: "请填写物流单号",
                    icon: "none",
                    duration: 2e3
                });
            }
            if (2 == this.data.selTypeIndex && util.isEmpty(s)) wx.showToast({
                title: "请填写备注",
                icon: "none",
                duration: 2e3
            }); else {
                wx.showLoading();
                var d = "";
                0 < this.data.photoList.length && (d = this.data.photoList.join(","));
                var r = {
                    apply: !0,
                    order_id: this.data.orderDetail.id,
                    reason: e,
                    money: a,
                    type: this.data.selTypeIndex,
                    pictures: d,
                    logistics_company: i || "",
                    logistics_number: o || "",
                    remark: s || ""
                };
                app.util.request({
                    url: "entry/wxapp/order-refund",
                    data: r,
                    success: function(t) {
                        wx.hideLoading(), wx.navigateBack({});
                    }
                });
            }
        }
    },
    deleteImage: function(t) {
        for (var e = this.data.photoList, a = 0; a < e.length; a++) e[a] == t.currentTarget.dataset.src && e.splice(a, 1);
        this.setData({
            photoList: e,
            photoListWidth: 158 * e.length + 30 * e.length
        });
    }
});