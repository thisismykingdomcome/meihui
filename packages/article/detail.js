function _defineProperty(t, a, e) {
    return a in t ? Object.defineProperty(t, a, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[a] = e, t;
}

var app = getApp();

Page({
    data: {
        themeColor: "#f44",
        backgroundColor: "#ffffff",
        article: {},
        diyFormIndex: -1,
        diyFormField: [],
        imageUrl: [],
        loadImageTime: 0,
        hideLoading: !1
    },
    onLoad: function(d) {
        var n = this;
        app.utils.common.getUserInfo(function(t) {
            t ? app.util.request({
                url: "entry/wxapp/article-detail",
                data: {
                    m: "zxsite_shop",
                    id: d.id
                },
                success: function(t) {
                    if (t.data.data.is_limit_visit) wx.redirectTo({
                        url: "limit?limit_text=" + encodeURIComponent(t.data.data.limit_text) + "&limit_link=" + encodeURIComponent(t.data.data.limit_link)
                    }); else {
                        if (!app.utils.util.isEmpty(t.data.data.content)) for (var a = 0, e = t.data.data.content.length; a < e; ++a) if ("form" == t.data.data.content[a].name) {
                            n.data.diyFormIndex = a, n.data.diyFormField = JSON.parse(JSON.stringify(t.data.data.content[a].data.list));
                            break;
                        }
                        n.setData({
                            article: t.data.data,
                            diyFormIndex: n.data.diyFormIndex,
                            diyFormField: n.data.diyFormField,
                            hideLoading: !0
                        });
                        for (var i = 0, r = t.data.data.content.length; i < r; ++i) "image" == t.data.data.content[i].name && "normal" == t.data.data.content[i].style.type && n.data.imageUrl.push(t.data.data.content[i].data.image);
                        wx.setNavigationBarTitle({
                            title: t.data.data.title
                        }), app.util.request({
                            url: "entry/wxapp/member-action",
                            data: {
                                m: "zxsite_shop",
                                type: 1,
                                path: "packages/article/detail?id=" + d.id,
                                description: "文章[" + t.data.data.title + "]"
                            },
                            showLoading: !1
                        });
                    }
                }
            }) : wx.redirectTo({
                url: "/zxsite_shop/start/start?url=/packages/article/detail&id=" + d.id
            });
        });
    },
    onGoodsDetailTap: function(t) {
        wx.navigateTo({
            url: "/zxsite_shop/goods-details/index?id=" + t.currentTarget.dataset.id
        });
    },
    onImageTap: function(t) {
        "normal" == t.currentTarget.dataset.imageType ? wx.previewImage({
            current: t.currentTarget.dataset.image,
            urls: this.data.imageUrl
        }) : 1 == t.currentTarget.dataset.type ? wx.navigateTo({
            url: t.currentTarget.dataset.url
        }) : 2 == t.currentTarget.dataset.type ? wx.navigateTo({
            url: "/zxsite_shop/web-view/index?linkUrl=" + encodeURIComponent(t.currentTarget.dataset.url)
        }) : wx.navigateTo({
            url: t.currentTarget.dataset.url
        });
    },
    onPraise: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/article-praise",
            data: {
                m: "zxsite_shop",
                id: this.data.article.id
            },
            success: function(t) {
                a.data.article.is_praised = t.data.data.is_praised, a.data.article.praise = t.data.data.praise, 
                a.setData({
                    article: a.data.article
                });
            }
        });
    },
    onShareAppMessage: function() {
        var t = "/packages/article/detail?id=" + this.data.article.id;
        return {
            title: this.data.article.title,
            path: t,
            imageUrl: this.data.article.share_image_url,
            success: function(t) {},
            fail: function(t) {}
        };
    },
    bindFormTextInput: function(t) {
        var a = t.currentTarget.dataset.index;
        this.data.diyFormField[a].value = t.detail.value;
    },
    bindFormRadioTap: function(t) {
        var a = "diyFormField[" + t.currentTarget.dataset.index + "].value";
        this.setData(_defineProperty({}, a, t.currentTarget.dataset.value));
    },
    bindFormCheckBoxTap: function(t) {
        for (var a = t.currentTarget.dataset.index, e = this.data.diyFormField[a].item, i = "", r = 0, d = e.length; r < d; ++r) {
            if (e[r].value == t.currentTarget.dataset.value.value) {
                var n = "diyFormField[" + a + "].item[" + r + "].checked";
                this.setData(_defineProperty({}, n, !t.currentTarget.dataset.value.checked));
            }
            e[r].checked && (app.utils.util.isEmpty(i) || (i += ","), i += e[r].value);
        }
        this.data.diyFormField[a].value = i;
    },
    bindFormDateChange: function(t) {
        var a = "diyFormField[" + t.currentTarget.dataset.index + "].value";
        this.setData(_defineProperty({}, a, t.detail.value));
    },
    bindFormTimeChange: function(t) {
        var a = "diyFormField[" + t.currentTarget.dataset.index + "].value";
        this.setData(_defineProperty({}, a, t.detail.value));
    },
    bindChooseImage: function(r) {
        var d = this, e = app.util.url("entry/wxapp/upload", {
            m: "zxsite_shop"
        });
        wx.chooseImage({
            count: 1,
            sizeType: [ "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(t) {
                app.util.showLoading();
                var a = t.tempFilePaths[0];
                wx.uploadFile({
                    url: e,
                    filePath: a,
                    name: "upfile",
                    formData: {},
                    success: function(t) {
                        var a = JSON.parse(t.data);
                        wx.hideNavigationBarLoading(), wx.hideLoading();
                        var e = r.currentTarget.dataset.index;
                        d.data.diyFormField[e].item.push(a.data.url);
                        var i = "diyFormField[" + e + "].item";
                        d.setData(_defineProperty({}, i, d.data.diyFormField[e].item));
                    },
                    fail: function(t) {
                        wx.hideNavigationBarLoading(), wx.hideLoading(), app.util.message(t, null, "error");
                    }
                });
            }
        });
    },
    bindDeleteImage: function(t) {
        var a = t.currentTarget.dataset.index;
        this.data.diyFormField[a].item.splice(t.currentTarget.dataset.imageIndex, 1);
        var e = "diyFormField[" + a + "].item";
        this.setData(_defineProperty({}, e, this.data.diyFormField[a].item));
    },
    bindPreviewImage: function(t) {
        wx.previewImage({
            urls: [ t.currentTarget.dataset.src ]
        });
    },
    bindFormSubmit: function(t) {
        for (var a = this.data.diyFormIndex, e = [], i = 0, r = this.data.diyFormField.length; i < r; ++i) {
            var d = this.data.diyFormField[i];
            if (1 == d.required && app.utils.util.isEmpty(d.value)) return void wx.showToast({
                title: "请" + (1 == d.type || 2 == d.type ? "填写" : "选择") + d.name,
                icon: "none",
                duration: 2e3
            });
            if (7 == d.type && 1 == d.required && 0 == d.item.length) return void wx.showToast({
                title: "请上传" + d.name,
                icon: "none",
                duration: 2e3
            });
            7 == d.type && (d.value = d.item), e.push({
                type: d.type,
                name: d.name,
                value: d.value
            });
        }
        var n = this;
        app.util.request({
            url: "entry/wxapp/diy-form-submit",
            data: {
                m: "zxsite_shop",
                diy_form_id: this.data.article.content[a].data.diyFormId,
                data: e
            },
            success: function(t) {
                wx.showToast({
                    title: "提交成功",
                    duration: 2e3
                }), n.setData({
                    diyFormField: JSON.parse(JSON.stringify(n.data.article.content[a].data.list))
                });
            }
        });
    }
});