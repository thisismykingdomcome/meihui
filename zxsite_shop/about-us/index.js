var WxParse = require("../../wxParse/wxParse.js"), common = require("../../utils/common.js");

Page({
    data: {
        latitude: "",
        longitude: "",
        markers: [],
        covers: [],
        contact: "",
        address: ""
    },
    onReady: function(t) {
        var s = this;
        this.mapCtx = wx.createMapContext("myMap"), common.getSettings(function(t) {
            common.setCustomNavigationBar(t), common.setCustomTabBar(s, t);
            var e = t.shop_name, a = t.latitude, o = t.longitude;
            s.setData({
                contact: t.shop_telphone,
                address: t.address,
                latitude: a,
                longitude: o,
                markers: Array({
                    id: 1,
                    latitude: a,
                    longitude: o,
                    name: e
                }),
                covers: Array({
                    latitude: a,
                    longitude: o
                }, {
                    latitude: a,
                    longitude: o
                })
            }), WxParse.wxParse("shopInfo", "html", t.shop_instruction, s, 5);
        });
    },
    goLocation: function() {
        wx.openLocation({
            latitude: parseFloat(this.data.latitude),
            longitude: parseFloat(this.data.longitude),
            name: wx.getStorageSync("settings").shop_name,
            address: wx.getStorageSync("settings").address,
            scale: 13
        });
    },
    toTelphone: function() {
        wx.makePhoneCall({
            phoneNumber: wx.getStorageSync("settings").shop_telphone
        });
    }
});