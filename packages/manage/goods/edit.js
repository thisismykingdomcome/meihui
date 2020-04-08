var app = getApp();

Page({
    data: {
        themeColor: "#f44",
        backgroundColor: "#ffffff",
        requestNeed: 0,
        requestDone: 0,
        goods: {},
        categoryText: "请选择",
        categoryMultiIndex: [ 0, 0 ],
        categoryMulti: [ [], [] ],
        categoryChildren: [],
        templateText: "请选择",
        templateIndex: 0,
        tempateList: [],
        labelDialogShow: !1,
        labelText: "请选择",
        labelValue: [],
        labelList: []
    },
    onLoad: function(a) {
        var i = this;
        if (wx.getStorageSync("userInfo")) {
            var s = wx.getStorageSync("settings");
            app.util.showLoading(), app.utils.util.isEmpty(a.id) ? (i.data.requestNeed = 3, 
            app.util.request({
                url: "entry/wxapp/manage-category",
                showLoading: !1,
                data: {
                    m: "zxsite_shop",
                    op: "all"
                },
                success: function(a) {
                    for (var t = 0; t < a.data.data.length; ++t) if (i.data.categoryMulti[0].push({
                        id: a.data.data[t].id,
                        name: a.data.data[t].name
                    }), 2 == s.category_level) if (app.utils.util.isEmpty(a.data.data[t].children)) i.data.categoryChildren.push([]); else {
                        i.data.categoryChildren.push(a.data.data[t].children);
                        for (var e = 0; e < a.data.data[t].children.length; ++e) 0 == t && i.data.categoryMulti[1].push({
                            id: a.data.data[t].children[e].id,
                            name: a.data.data[t].children[e].name
                        });
                    }
                    i.setData({
                        categoryMulti: i.data.categoryMulti,
                        categoryChildren: i.data.categoryChildren,
                        settings: s
                    }), i.data.requestDone++, i.data.requestDone >= i.data.requestNeed && setTimeout(function() {
                        wx.hideLoading();
                    }, 1e3);
                }
            }), app.util.request({
                url: "entry/wxapp/manage-freight-template",
                showLoading: !1,
                data: {
                    m: "zxsite_shop",
                    op: "all"
                },
                success: function(a) {
                    i.setData({
                        templateList: a.data.data
                    }), i.data.requestDone++, i.data.requestDone >= i.data.requestNeed && setTimeout(function() {
                        wx.hideLoading();
                    }, 1e3);
                }
            }), app.util.request({
                url: "entry/wxapp/manage-label",
                showLoading: !1,
                data: {
                    m: "zxsite_shop",
                    op: "all"
                },
                success: function(a) {
                    i.setData({
                        labelList: a.data.data
                    }), i.data.requestDone++, i.data.requestDone >= i.data.requestNeed && setTimeout(function() {
                        wx.hideLoading();
                    }, 1e3);
                }
            })) : (i.data.requestNeed = 4, app.util.request({
                url: "entry/wxapp/manage-goods",
                showLoading: !1,
                data: {
                    m: "zxsite_shop",
                    op: "get",
                    id: a.id
                },
                success: function(a) {
                    var d = a.data.data;
                    i.data.requestDone++, app.util.request({
                        url: "entry/wxapp/manage-category",
                        showLoading: !1,
                        data: {
                            m: "zxsite_shop",
                            op: "all"
                        },
                        success: function(a) {
                            for (var t = 0; t < a.data.data.length; ++t) if (d.category_id[0] == a.data.data[t].id && (i.data.categoryText = a.data.data[t].name, 
                            i.data.categoryMultiIndex[0] = t), i.data.categoryMulti[0].push({
                                id: a.data.data[t].id,
                                name: a.data.data[t].name
                            }), 2 == s.category_level) if (app.utils.util.isEmpty(a.data.data[t].children)) i.data.categoryChildren.push([]); else {
                                i.data.categoryChildren.push(a.data.data[t].children);
                                for (var e = 0; e < a.data.data[t].children.length; ++e) d.category_id[1] == a.data.data[t].children[e].id && (i.data.categoryMultiIndex[1] = e, 
                                i.data.categoryText += ">" + a.data.data[t].children[e].name), d.category_id[0] == a.data.data[t].id && i.data.categoryMulti[1].push({
                                    id: a.data.data[t].children[e].id,
                                    name: a.data.data[t].children[e].name
                                });
                            }
                            i.setData({
                                goods: d,
                                categoryText: i.data.categoryText,
                                categoryMultiIndex: i.data.categoryMultiIndex,
                                categoryMulti: i.data.categoryMulti,
                                categoryChildren: i.data.categoryChildren,
                                settings: s
                            }), i.data.requestDone++, i.data.requestDone >= i.data.requestNeed && setTimeout(function() {
                                wx.hideLoading();
                            }, 1e3);
                        }
                    }), app.util.request({
                        url: "entry/wxapp/manage-freight-template",
                        showLoading: !1,
                        data: {
                            m: "zxsite_shop",
                            op: "all"
                        },
                        success: function(a) {
                            for (var t = 0, e = a.data.data.length; t < e; ++t) d.template_id == a.data.data[t].id && (i.data.templateIndex = t, 
                            i.data.templateText = a.data.data[t].name);
                            i.setData({
                                templateText: i.data.templateText,
                                templateIndex: i.data.templateIndex,
                                templateList: a.data.data
                            }), i.data.requestDone++, i.data.requestDone >= i.data.requestNeed && setTimeout(function() {
                                wx.hideLoading();
                            }, 1e3);
                        }
                    }), app.util.request({
                        url: "entry/wxapp/manage-label",
                        showLoading: !1,
                        data: {
                            m: "zxsite_shop",
                            op: "all"
                        },
                        success: function(a) {
                            for (var t = 0; t < a.data.data.length; ++t) for (var e = 0; e < d.label.length; ++e) a.data.data[t].id == d.label[e] && ("请选择" == i.data.labelText ? i.data.labelText = "" : i.data.labelText += "、", 
                            i.data.labelText += a.data.data[t].name);
                            i.setData({
                                labelText: i.data.labelText,
                                labelValue: d.label,
                                labelList: a.data.data
                            }), i.data.requestDone++, i.data.requestDone >= i.data.requestNeed && setTimeout(function() {
                                wx.hideLoading();
                            }, 1e3);
                        }
                    });
                }
            }));
        } else wx.redirectTo({
            url: "/zxsite_shop/start/start?url=/packages/manage/goods/edit&type=redirect&id=" + a.id
        });
    },
    onFieldChange: function(a) {
        "title" == a.currentTarget.id ? this.data.goods.title = a.detail : "sub_title" == a.currentTarget.id ? this.data.goods.sub_title = a.detail : "sn" == a.currentTarget.id ? this.data.goods.sn = a.detail : "bar_code" == a.currentTarget.id ? this.data.goods.bar_code = a.detail : "price" == a.currentTarget.id ? this.data.goods.price = a.detail : "market_price" == a.currentTarget.id ? this.data.goods.market_price = a.detail : "cost_price" == a.currentTarget.id ? this.data.goods.cost_price = a.detail : "weight" == a.currentTarget.id ? this.data.goods.weight = a.detail : "stores" == a.currentTarget.id ? this.data.goods.stores = a.detail : "sales" == a.currentTarget.id ? this.data.goods.sales = a.detail : "integral_give" == a.currentTarget.id ? this.data.goods.integral_give = a.detail : "sort" == a.currentTarget.id ? this.data.goods.sort = a.detail : "video" == a.currentTarget.id && (this.data.goods.video = a.detail);
    },
    onSwitchChange: function(a) {
        "is_cash" == a.currentTarget.id ? this.data.goods.is_cash = a.detail ? 1 : 0 : "is_recommend" == a.currentTarget.id ? this.data.goods.is_recommend = a.detail ? 1 : 0 : "status" == a.currentTarget.id && (this.data.goods.status = a.detail ? 1 : 0), 
        this.setData({
            goods: this.data.goods
        });
    },
    onCategoryPickerChange: function(a) {
        var t = a.detail.value;
        this.data.goods.category_id = [ this.data.categoryMulti[0][t].id ], this.setData({
            goods: this.data.goods,
            categoryMultiIndex: [ t ],
            categoryText: this.data.categoryMulti[0][t].name
        });
    },
    onCategoryMultiPickerChange: function(a) {
        var t = a.detail.value;
        app.utils.util.isEmpty(this.data.goods.category_id) && (this.data.goods.category_id = []), 
        0 < this.data.categoryMulti[1].length ? (this.data.goods.category_id[0] = this.data.categoryMulti[0][t[0]].id, 
        this.data.goods.category_id[1] = this.data.categoryMulti[1][t[1]].id) : this.data.goods.category_id = [ this.data.categoryMulti[0][t[0]].id ], 
        this.setData({
            categoryMultiIndex: t,
            categoryText: 0 < this.data.categoryMulti[1].length ? this.data.categoryMulti[0][t[0]].name + ">" + this.data.categoryMulti[1][t[1]].name : this.data.categoryMulti[0][t[0]].name
        });
    },
    onCategoryMultiPickerColumnChange: function(a) {
        0 == a.detail.column && (this.data.categoryMulti[1] = this.data.categoryChildren[a.detail.value], 
        this.setData({
            categoryMulti: this.data.categoryMulti
        }));
    },
    onTemplatePickerChange: function(a) {
        var t = a.detail.value;
        this.data.goods.template_id = this.data.templateList[t].id, this.setData({
            templateIndex: t,
            templateText: this.data.templateList[t].name
        });
    },
    chooseImage: function(e) {
        var d = this, i = app.util.url("entry/wxapp/upload", {
            m: "zxsite_shop"
        });
        wx.chooseImage({
            count: 1,
            sizeType: [ "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(a) {
                app.util.showLoading();
                var t = a.tempFilePaths[0];
                wx.uploadFile({
                    url: i,
                    filePath: t,
                    name: "upfile",
                    formData: {},
                    success: function(a) {
                        var t = JSON.parse(a.data);
                        wx.hideNavigationBarLoading(), wx.hideLoading(), "cover" == e.currentTarget.dataset.type ? (d.data.goods.cover = t.data.attachment, 
                        d.data.goods.cover_url = t.data.url) : "pictures" == e.currentTarget.dataset.type ? (app.utils.util.isEmpty(d.data.goods.pictures) && (d.data.goods.pictures = [], 
                        d.data.goods.pictures_url = []), d.data.goods.pictures.push(t.data.attachment), 
                        d.data.goods.pictures_url.push(t.data.url)) : "share_image" == e.currentTarget.dataset.type && (d.data.goods.share_image = t.data.attachment, 
                        d.data.goods.share_image_url = t.data.url), d.setData({
                            goods: d.data.goods
                        });
                    },
                    fail: function(a) {
                        wx.hideNavigationBarLoading(), wx.hideLoading(), app.util.message(a, null, "error");
                    }
                });
            }
        });
    },
    deleteImage: function(a) {
        "cover" == a.currentTarget.dataset.type ? (delete this.data.goods.cover, delete this.data.goods.cover_url) : "pictures" == a.currentTarget.dataset.type ? (this.data.goods.pictures.splice(a.currentTarget.dataset.index, 1), 
        this.data.goods.pictures_url.splice(a.currentTarget.dataset.index, 1)) : "share_image" == a.currentTarget.dataset.type && (delete this.data.goods.share_image, 
        delete this.data.goods.share_image_url), this.setData({
            goods: this.data.goods
        });
    },
    previewImage: function(a) {
        wx.previewImage({
            urls: [ a.currentTarget.dataset.src ]
        });
    },
    onLabelClick: function(a) {
        this.setData({
            labelDialogShow: !0
        });
    },
    onLabelChange: function(a) {
        this.setData({
            labelValue: a.detail
        });
    },
    onLabelToggle: function(a) {
        var t = a.currentTarget.dataset.name;
        this.selectComponent(".label-" + t).toggle();
    },
    noop: function() {},
    onLabelDialogCancel: function(a) {
        this.setData({
            labelValue: this.data.goods.label
        });
    },
    onLabelDialogConfirm: function(a) {
        for (var t = "请选择", e = 0; e < this.data.labelList.length; ++e) for (var d = 0; d < this.data.labelValue.length; ++d) this.data.labelList[e].id == this.data.labelValue[d] && ("请选择" == t ? t = "" : t += "、", 
        t += this.data.labelList[e].name);
        this.data.goods.label = this.data.labelValue, this.setData({
            labelText: t
        });
    },
    onSave: function(a) {
        app.util.request({
            url: "entry/wxapp/manage-goods",
            data: Object.assign({
                m: "zxsite_shop",
                op: "save"
            }, this.data.goods),
            method: "POST",
            success: function(a) {
                var t = getCurrentPages();
                t[t.length - 2].onRefreshData(), wx.showToast({
                    title: a.data.message,
                    icon: "none",
                    duration: 2e3
                }), setTimeout(function() {
                    wx.navigateBack({});
                }, 2e3);
            }
        });
    }
});