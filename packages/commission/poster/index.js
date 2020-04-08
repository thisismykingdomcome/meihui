var app = getApp();

Page({
    data: {
        hideLoading: !1,
        themeColor: "#f44",
        backgroundColor: "#f8f8f8",
        url: "",
        height: 1e3
    },
    onLoad: function(t) {
        var e = this;
        app.utils.common.getUserInfo(function(t) {
            t ? app.utils.common.getSettings(function(t) {
                e.setData({
                    themeColor: t.theme_color ? t.theme_color : "#f44"
                }), app.util.showLoading(), app.util.request({
                    url: "entry/wxapp/commission-poster",
                    showLoading: !1,
                    data: {
                        m: "zxsite_shop"
                    },
                    success: function(t) {
                        var o = new Date();
                        e.setData({
                            height: t.data.data.height,
                            url: t.data.data.url + "?v=" + o.getTime()
                        });
                    }
                });
            }) : wx.redirectTo({
                url: "/zxsite_shop/start/start?url=/packages/commission/poster/index"
            });
        });
    },
    saveImageToPhotosAlbum: function() {
        var o = this;
        wx.getSetting({
            success: function(t) {
                t.authSetting["scope.writePhotosAlbum"] ? (wx.showToast({
                    title: "图片下载中...",
                    icon: "loading"
                }), o.downImgAndSave()) : (wx.showToast({
                    title: "图片下载中...",
                    icon: "loading"
                }), wx.authorize({
                    scope: "scope.writePhotosAlbum",
                    success: function() {
                        o.downImgAndSave();
                    }
                }));
            }
        });
    },
    downImgAndSave: function() {
        wx.downloadFile({
            url: this.data.url,
            success: function(t) {
                200 === t.statusCode && wx.saveImageToPhotosAlbum({
                    filePath: t.tempFilePath,
                    success: function(t) {
                        wx.hideToast();
                    },
                    fail: function() {
                        wx.hideToast();
                    }
                });
            }
        });
    },
    loadImageError: function(t) {
        var o = new Date();
        this.setData({
            url: this.data.url + "&time=" + o.getTime()
        });
    },
    loadImageSuccess: function(t) {
        wx.hideLoading(), this.setData({
            hideLoading: !0
        });
    }
});