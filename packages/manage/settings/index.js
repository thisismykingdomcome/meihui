var app = getApp();

Page({
    data: {
        themeColor: "#f44",
        backgroundColor: "#ffffff",
        categoryLevelActionsShow: !1,
        categoryLevelActions: [ {
            name: "一级",
            value: 1
        }, {
            name: "二级",
            value: 2
        } ],
        categoryStyleActionsShow: !1,
        categoryStyleActions: [ {
            name: "样式一",
            value: 1
        }, {
            name: "样式二",
            value: 2
        } ],
        sendTypeActionsShow: !1,
        sendTypeActions: [ {
            name: "仅快递",
            value: 1
        }, {
            name: "仅自提",
            value: 2
        }, {
            name: "快递或自提",
            value: 3
        } ],
        homeNavigationLineNumberActionsShow: !1,
        homeNavigationLineNumberActions: [ {
            name: "3个",
            value: 3
        }, {
            name: "4个",
            value: 4
        }, {
            name: "5个",
            value: 5
        }, {
            name: "6个",
            value: 6
        } ]
    },
    onLoad: function(t) {
        if (wx.getStorageSync("userInfo")) {
            var a = this;
            app.util.showLoading(), app.util.request({
                url: "entry/wxapp/manage-settings",
                showLoading: !1,
                data: {
                    m: "zxsite_shop",
                    op: "get"
                },
                success: function(t) {
                    var e = t.data.data;
                    e.category_level_text = a.exchangeCategoryLevel(e.category_level), e.category_style_text = a.exchangeCategoryStyle(e.category_style), 
                    e.send_type_text = a.exchangeSendType(e.send_type), e.home_navigation_line_number_text = a.exchangeHomeNavigationLineNumber(e.home_navigation_line_number), 
                    a.setData({
                        settings: e
                    }), setTimeout(function() {
                        wx.hideLoading();
                    }, 1e3);
                }
            });
        } else wx.redirectTo({
            url: "/zxsite_shop/start/start?url=/packages/manage/settings/index&type=redirect"
        });
    },
    onFieldChange: function(t) {
        "shop_name" == t.currentTarget.id ? this.data.settings.shop_name = t.detail : "shop_share_profile" == t.currentTarget.id ? this.data.settings.shop_share_profile = t.detail : "shop_telphone" == t.currentTarget.id ? this.data.settings.shop_telphone = t.detail : "shop_server_url" == t.currentTarget.id ? this.data.settings.shop_server_url = t.detail : "address" == t.currentTarget.id ? this.data.settings.address = t.detail : "default_acknowledgment_time" == t.currentTarget.id ? this.data.settings.default_acknowledgment_time = t.detail : "default_evaluation_time" == t.currentTarget.id ? this.data.settings.default_evaluation_time = t.detail : "auction_fail_time" == t.currentTarget.id ? this.data.settings.auction_fail_time = t.detail : "video_url" == t.currentTarget.id ? this.data.settings.video_url = t.detail : "audio_url" == t.currentTarget.id && (this.data.settings.audio_url = t.detail);
    },
    onSwitchChange: function(t) {
        "shop_service_telphone" == t.currentTarget.id ? this.data.settings.shop_service_telphone = t.detail ? 1 : 0 : "shop_service" == t.currentTarget.id ? this.data.settings.shop_service = t.detail ? 1 : 0 : "overseas_agency" == t.currentTarget.id ? this.data.settings.overseas_agency = t.detail ? 1 : 0 : "is_official_account" == t.currentTarget.id ? this.data.settings.is_official_account = t.detail ? 1 : 0 : "is_show_reputation" == t.currentTarget.id ? this.data.settings.is_show_reputation = t.detail ? 1 : 0 : "is_wechat_review" == t.currentTarget.id && (this.data.settings.is_wechat_review = t.detail ? 1 : 0), 
        this.setData({
            settings: this.data.settings
        });
    },
    exchangeCategoryLevel: function(t) {
        return 1 == t ? "一级" : "二级";
    },
    exchangeCategoryStyle: function(t) {
        return 1 == t ? "样式一" : "样式二";
    },
    exchangeSendType: function(t) {
        return 1 == t ? "仅快递" : 2 == t ? "仅自提" : "快递或自提";
    },
    exchangeHomeNavigationLineNumber: function(t) {
        return t + "个";
    },
    onCategoryLevelClick: function(t) {
        this.setData({
            categoryLevelActionsShow: !0
        });
    },
    onCategoryLevelActionsSelect: function(t) {
        this.data.settings.category_level = t.detail.value, this.data.settings.category_level_text = this.exchangeCategoryLevel(t.detail.value), 
        this.setData({
            categoryLevelActionsShow: !1,
            settings: this.data.settings
        });
    },
    onCategoryLevelActionsCancel: function(t) {
        this.setData({
            categoryLevelActionsShow: !1
        });
    },
    onCategoryStyleClick: function(t) {
        this.setData({
            categoryStyleActionsShow: !0
        });
    },
    onCategoryStyleActionsSelect: function(t) {
        this.data.settings.category_style = t.detail.value, this.data.settings.category_style_text = this.exchangeCategoryStyle(t.detail.value), 
        this.setData({
            categoryStyleActionsShow: !1,
            settings: this.data.settings
        });
    },
    onCategoryStyleActionsCancel: function(t) {
        this.setData({
            categoryStyleActionsShow: !1
        });
    },
    onSendTypeClick: function(t) {
        this.setData({
            sendTypeActionsShow: !0
        });
    },
    onSendTypeActionsSelect: function(t) {
        this.data.settings.send_type = t.detail.value, this.data.settings.send_type_text = this.exchangeSendType(t.detail.value), 
        this.setData({
            sendTypeActionsShow: !1,
            settings: this.data.settings
        });
    },
    onSendTypeActionsCancel: function(t) {
        this.setData({
            sendTypeActionsShow: !1
        });
    },
    onHomeNavigationLineNumberClick: function(t) {
        this.setData({
            homeNavigationLineNumberActionsShow: !0
        });
    },
    onHomeNavigationLineNumberActionsSelect: function(t) {
        this.data.settings.home_navigation_line_number = t.detail.value, this.data.settings.home_navigation_line_number_text = this.exchangeHomeNavigationLineNumber(t.detail.value), 
        this.setData({
            homeNavigationLineNumberActionsShow: !1,
            settings: this.data.settings
        });
    },
    onHomeNavigationLineNumberActionsCancel: function(t) {
        this.setData({
            homeNavigationLineNumberActionsShow: !1
        });
    },
    chooseImage: function(a) {
        var i = this, s = app.util.url("entry/wxapp/upload", {
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
                    url: s,
                    filePath: e,
                    name: "upfile",
                    formData: {},
                    success: function(t) {
                        var e = JSON.parse(t.data);
                        wx.hideNavigationBarLoading(), wx.hideLoading(), "shop_share_image" == a.currentTarget.dataset.type ? (i.data.settings.shop_share_image = e.data.attachment, 
                        i.data.settings.shop_share_image_url = e.data.url) : "shop_telphone_icon" == a.currentTarget.dataset.type ? (i.data.settings.shop_telphone_icon = e.data.attachment, 
                        i.data.settings.shop_telphone_icon_url = e.data.url) : "shop_service_icon" == a.currentTarget.dataset.type && (i.data.settings.shop_service_icon = e.data.attachment, 
                        i.data.settings.shop_service_icon_url = e.data.url), i.setData({
                            settings: i.data.settings
                        });
                    },
                    fail: function(t) {
                        wx.hideNavigationBarLoading(), wx.hideLoading(), app.util.message(t, null, "error");
                    }
                });
            }
        });
    },
    deleteImage: function(t) {
        "shop_share_image" == t.currentTarget.dataset.type ? (this.data.settings.shop_share_image = null, 
        this.data.settings.shop_share_image_url = null) : "shop_telphone_icon" == t.currentTarget.dataset.type ? (this.data.settings.shop_telphone_icon = null, 
        this.data.settings.shop_telphone_icon_url = null) : "shop_service_icon" == t.currentTarget.dataset.type && (this.data.settings.shop_service_icon = null, 
        this.data.settings.shop_service_icon_url = null), this.setData({
            settings: this.data.settings
        });
    },
    previewImage: function(t) {
        wx.previewImage({
            urls: [ t.currentTarget.dataset.src ]
        });
    },
    onLocationClick: function(t) {
        var e = this;
        wx.chooseLocation({
            success: function(t) {
                e.data.settings.longitude = t.longitude, e.data.settings.latitude = t.latitude, 
                e.data.settings.address = t.address, e.setData({
                    settings: e.data.settings
                });
            }
        });
    },
    onSave: function(t) {
        app.util.request({
            url: "entry/wxapp/manage-settings",
            data: Object.assign({
                m: "zxsite_shop",
                op: "save"
            }, this.data.settings),
            method: "POST",
            success: function(t) {
                app.util.request({
                    url: "entry/wxapp/settings",
                    data: {
                        m: "zxsite_shop"
                    },
                    showLoading: !1,
                    success: function(t) {
                        app.utils.util.setStorageSync("settings", t.data.data), wx.showToast({
                            title: "店铺信息保存成功！",
                            icon: "none",
                            duration: 2e3
                        }), setTimeout(function() {
                            wx.navigateBack({});
                        }, 2e3);
                    },
                    fail: function(t) {
                        wx.showModal({
                            title: "系统信息",
                            content: t.errMsg,
                            showCancel: !1
                        });
                    }
                });
            }
        });
    }
});