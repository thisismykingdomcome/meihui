var app = getApp(), common = require("../../utils/common.js"), util = require("../../utils/util.js");

Page({
    data: {
        hideLoading: !1,
        goodsDetail: {},
        canIUse: wx.canIUse("open-data"),
        themeColor: "#f44",
        backgroundColor: "#f8f8f8",
        getImgBase64: "",
        generateImg: "",
        from: ""
    },
    onLoad: function(e) {
        app.util.showLoading();
        var o = this, t = wx.getStorageSync("settings");
        util.isEmpty(t.theme_color) || o.setData({
            themeColor: t.theme_color
        }), util.isEmpty(t.background_color) || o.setData({
            backgroundColor: t.background_color
        });
        var a = {
            id: e.id,
            source: e.from
        };
        "seckillDetail" == e.from ? (a.seckill_id = e.seckillId, a.seckill_date = e.seckillDate, 
        a.time = e.time) : "groupsDetail" == e.from && (util.isEmpty(e.groupsOrderId) || (a.groups_order_id = e.groupsOrderId)), 
        app.util.request({
            url: "entry/wxapp/generating-poster",
            showLoading: !1,
            data: a,
            success: function(e) {
                var t = new Date();
                o.setData({
                    generateImg: e.data.data + "?v=" + t.getTime()
                });
            }
        });
    },
    saveImageToPhotosAlbum: function() {
        var t = this;
        wx.getSetting({
            success: function(e) {
                e.authSetting["scope.writePhotosAlbum"] ? (wx.showToast({
                    title: "图片下载中...",
                    icon: "loading"
                }), t.downImgAndSave()) : (wx.showToast({
                    title: "图片下载中...",
                    icon: "loading"
                }), wx.authorize({
                    scope: "scope.writePhotosAlbum",
                    success: function() {
                        t.downImgAndSave();
                    }
                }));
            }
        });
    },
    downImgAndSave: function() {
        wx.downloadFile({
            url: this.data.generateImg,
            success: function(e) {
                200 === e.statusCode && wx.saveImageToPhotosAlbum({
                    filePath: e.tempFilePath,
                    success: function(e) {
                        wx.hideToast();
                    },
                    fail: function() {
                        wx.hideToast();
                    }
                });
            }
        });
    },
    loadImageError: function(e) {
        var t = new Date();
        this.setData({
            generateImg: this.data.generateImg + "&time=" + t.getTime()
        });
    },
    loadImageSuccess: function(e) {
        wx.hideLoading(), this.setData({
            hideLoading: !0
        });
    }
});