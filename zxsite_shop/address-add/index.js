function _defineProperty(t, a, i) {
    return a in t ? Object.defineProperty(t, a, {
        value: i,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[a] = i, t;
}

var commonCityData = require("../../utils/city.js"), common = require("../../utils/common.js"), util = require("../../utils/util.js"), app = getApp();

Page({
    data: {
        themeColor: "#f44",
        backgroundColor: "#f8f8f8",
        addressData: {},
        provinces: [],
        citys: [],
        districts: [],
        selProvince: "请选择",
        selCity: "请选择",
        selDistrict: "请选择",
        selProvinceIndex: 0,
        selCityIndex: 0,
        selDistrictIndex: 0
    },
    bindCancel: function() {
        wx.navigateBack({});
    },
    bindSave: function(t) {
        var a = this, i = t.detail.value.name, e = t.detail.value.address, s = t.detail.value.mobile, n = t.detail.value.identity_code;
        if ("" != i) if ("" != s) if ("请选择" != this.data.selProvince) if ("请选择" != this.data.selCity) if ("请选择" != this.data.selDistrict) if (1 == this.data.settings.city_express_enabled && (util.isEmpty(this.data.addressData.location_address) || util.isEmpty(this.data.addressData.location_name) || util.isEmpty(this.data.addressData.latitude) || util.isEmpty(this.data.addressData.longitude))) wx.showToast({
            title: "请选择位置",
            icon: "none",
            duration: 2e3
        }); else if ("" != e) if (1 == this.data.settings.overseas_agency && util.isEmpty(n)) wx.showToast({
            title: "请填写身份证号",
            icon: "none",
            duration: 2e3
        }); else if (1 == this.data.settings.overseas_agency && util.isEmpty(this.data.identityPhotoFront)) wx.showToast({
            title: "请上传身份证正面照片",
            icon: "none",
            duration: 2e3
        }); else if (1 == this.data.settings.overseas_agency && util.isEmpty(this.data.identityPhotoBack)) wx.showToast({
            title: "请上传身份证反面照片",
            icon: "none",
            duration: 2e3
        }); else {
            wx.showLoading();
            var o = {};
            o.id = a.data.id, o.province = a.data.selProvince, o.city = a.data.selCity, o.district = a.data.selDistrict, 
            o.name = i, o.address = e, o.mobile = s, 1 == this.data.settings.city_express_enabled && (o.location_name = a.data.addressData.location_name, 
            o.location_address = a.data.addressData.location_address, o.latitude = a.data.addressData.latitude, 
            o.longitude = a.data.addressData.longitude), 1 == this.data.settings.overseas_agency && (o.identity_code = n, 
            o.identity_photo_front = a.data.identityPhotoFront, o.identity_photo_back = a.data.identityPhotoBack), 
            app.util.request({
                url: "entry/wxapp/shipping-edit",
                data: o,
                success: function(t) {
                    wx.hideLoading(), wx.navigateBack({});
                }
            });
        } else wx.showToast({
            title: "请填写详细地址",
            icon: "none",
            duration: 2e3
        }); else wx.showToast({
            title: "请选择地区",
            icon: "none",
            duration: 2e3
        }); else wx.showToast({
            title: "请选择地区",
            icon: "none",
            duration: 2e3
        }); else wx.showToast({
            title: "请选择地区",
            icon: "none",
            duration: 2e3
        }); else wx.showToast({
            title: "请填写手机号码",
            icon: "none",
            duration: 2e3
        }); else wx.showToast({
            title: "请填写联系人姓名",
            icon: "none",
            duration: 2e3
        });
    },
    initCityData: function(t, a) {
        if (1 == t) {
            for (var i = [], e = 0; e < commonCityData.cityData.length; e++) i.push(commonCityData.cityData[e].name);
            this.setData({
                provinces: i
            });
        } else if (2 == t) {
            i = [];
            var s = a.cityList;
            for (e = 0; e < s.length; e++) i.push(s[e].name);
            this.setData({
                citys: i
            });
        } else if (3 == t) {
            for (i = [], s = a.districtList, e = 0; e < s.length; e++) i.push(s[e].name);
            this.setData({
                districts: i
            });
        }
    },
    bindPickerProvinceChange: function(t) {
        var a = commonCityData.cityData[t.detail.value];
        this.setData({
            selProvince: a.name,
            selProvinceIndex: t.detail.value,
            selCity: "请选择",
            selCityIndex: 0,
            selDistrict: "请选择",
            selDistrictIndex: 0
        }), this.initCityData(2, a);
    },
    bindPickerCityChange: function(t) {
        var a = commonCityData.cityData[this.data.selProvinceIndex].cityList[t.detail.value];
        this.setData({
            selCity: a.name,
            selCityIndex: t.detail.value,
            selDistrict: "请选择",
            selDistrictIndex: 0
        }), this.initCityData(3, a);
    },
    bindPickerDistrictChange: function(t) {
        var a = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].districtList[t.detail.value];
        a && a.name && t.detail.value && this.setData({
            selDistrict: a.name,
            selDistrictIndex: t.detail.value
        });
    },
    onLoad: function(t) {
        var i = this;
        common.getSettings(function(t) {
            common.setCustomNavigationBar(t), common.setCustomTabBar(i, t), i.setData({
                themeColor: t.theme_color ? t.theme_color : "#f44",
                backgroundColor: t.background_color ? t.background_color : "#f8f8f8"
            });
        }), this.initCityData(1);
        var e = t.id;
        e && (wx.showLoading(), app.util.request({
            url: "entry/wxapp/shipping-detail",
            data: {
                id: e
            },
            success: function(t) {
                wx.hideLoading(), i.setData({
                    id: e,
                    addressData: t.data.data,
                    selProvince: t.data.data.province,
                    selCity: t.data.data.city,
                    selDistrict: t.data.data.district,
                    identityPhotoFront: t.data.data.identity_photo_front,
                    identityPhotoBack: t.data.data.identity_photo_back
                }), i.setDBSaveAddressId(t.data.data);
                var a = commonCityData.cityData[i.data.selProvinceIndex];
                i.initCityData(2, a), a = commonCityData.cityData[i.data.selProvinceIndex].cityList[i.data.selCityIndex], 
                i.initCityData(3, a);
            }
        })), this.setData({
            settings: wx.getStorageSync("settings")
        });
    },
    setDBSaveAddressId: function(t) {
        for (var a = this, i = 0; i < commonCityData.cityData.length; i++) if (t.province == commonCityData.cityData[i].name) {
            a.setData({
                selProvinceIndex: i
            });
            for (var e = 0; e < commonCityData.cityData[i].cityList.length; e++) if (t.city == commonCityData.cityData[i].cityList[e].name) {
                a.setData({
                    selCityIndex: e
                });
                for (var s = 0; s < commonCityData.cityData[i].cityList[e].districtList.length; s++) t.district == commonCityData.cityData[i].cityList[e].districtList[s].name && a.setData({
                    selDistrictIndex: s
                });
            }
        }
    },
    selectCity: function() {},
    deleteAddress: function(t) {
        var a = t.currentTarget.dataset.id;
        wx.showModal({
            title: "确定要删除该收货地址吗？",
            content: "",
            success: function(t) {
                t.confirm && (wx.showLoading(), app.util.request({
                    url: "entry/wxapp/shipping-delete",
                    data: {
                        id: a
                    },
                    success: function(t) {
                        wx.hideLoading(), wx.navigateBack({});
                    }
                }));
            }
        });
    },
    readFromWx: function() {
        var d = this;
        wx.chooseAddress({
            success: function(t) {
                for (var a = t.provinceName, i = t.cityName, e = t.countyName, s = 0; s < commonCityData.cityData.length; s++) if (a == commonCityData.cityData[s].name) {
                    var n = {
                        detail: {
                            value: s
                        }
                    };
                    d.bindPickerProvinceChange(n), d.data.selProvinceIndex = s;
                    for (var o = 0; o < commonCityData.cityData[s].cityList.length; o++) if (i == commonCityData.cityData[s].cityList[o].name) {
                        n = {
                            detail: {
                                value: o
                            }
                        }, d.bindPickerCityChange(n);
                        for (var c = 0; c < commonCityData.cityData[s].cityList[o].districtList.length; c++) e == commonCityData.cityData[s].cityList[o].districtList[c].name && (n = {
                            detail: {
                                value: c
                            }
                        }, d.bindPickerDistrictChange(n));
                    }
                }
                d.setData({
                    wxaddress: t
                });
            }
        });
    },
    chooseImage: function(i) {
        var e = this, s = app.util.url("entry/wxapp/upload", {
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
                    url: s,
                    filePath: a,
                    name: "upfile",
                    formData: {},
                    success: function(t) {
                        var a = JSON.parse(t.data);
                        wx.hideNavigationBarLoading(), wx.hideLoading(), "front" == i.currentTarget.dataset.type ? e.setData({
                            identityPhotoFront: a.data.url
                        }) : e.setData({
                            identityPhotoBack: a.data.url
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
        "front" == t.currentTarget.dataset.type ? this.setData({
            identityPhotoFront: null
        }) : this.setData({
            identityPhotoBack: null
        });
    },
    previewImage: function(t) {
        wx.previewImage({
            urls: t.currentTarget.dataset.src
        });
    },
    onChooseLocation: function() {
        var a = this;
        wx.getSetting({
            success: function(t) {
                null != t.authSetting["scope.userLocation"] && 1 != t.authSetting["scope.userLocation"] ? wx.showModal({
                    title: "需要获取你的地理位置",
                    content: "您的位置信息将用于小程序地图展示",
                    success: function(t) {
                        t.cancel ? wx.showToast({
                            title: "授权失败",
                            icon: "none",
                            duration: 1e3
                        }) : t.confirm && wx.openSetting({
                            success: function(t) {
                                1 == t.authSetting["scope.userLocation"] ? (wx.showToast({
                                    title: "授权成功",
                                    icon: "none",
                                    duration: 1e3
                                }), a.chooseLocation()) : wx.showToast({
                                    title: "授权失败",
                                    icon: "none",
                                    duration: 1e3
                                });
                            }
                        });
                    }
                }) : (t.authSetting["scope.userLocation"], a.chooseLocation());
            }
        });
    },
    chooseLocation: function() {
        var i = this;
        wx.chooseLocation({
            success: function(t) {
                var a;
                i.setData((_defineProperty(a = {}, "addressData.location_name", t.name), _defineProperty(a, "addressData.location_address", t.address), 
                _defineProperty(a, "addressData.latitude", t.latitude), _defineProperty(a, "addressData.longitude", t.longitude), 
                a));
            }
        });
    }
});