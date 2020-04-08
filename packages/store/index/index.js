var app = getApp();

Page({
    data: {
        themeColor: "#f44",
        storeList: [],
        latitude: null,
        longitude: null,
        markers: []
    },
    onLoad: function(t) {
        var a = this;
        app.utils.common.getSettings(function(t) {
            app.utils.common.setCustomNavigationBar(t), a.setData({
                themeColor: t.theme_color ? t.theme_color : "#f44"
            });
        }), wx.getSetting({
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
                                }), a.getLocation()) : wx.showToast({
                                    title: "授权失败",
                                    icon: "none",
                                    duration: 1e3
                                });
                            }
                        });
                    }
                }) : (t.authSetting["scope.userLocation"], a.getLocation());
            }
        });
    },
    onReady: function(t) {
        this.mapCtx = wx.createMapContext("map");
    },
    getLocation: function() {
        var a = this;
        wx.getLocation({
            type: "wgs84",
            success: function(t) {
                a.getStoreList(t.latitude, t.longitude);
            }
        });
    },
    getStoreList: function(i, n) {
        var s = this;
        app.util.request({
            url: "entry/wxapp/store-list",
            data: {
                m: "zxsite_shop",
                latitude: i,
                longitude: n
            },
            success: function(t) {
                for (var a = [ {
                    iconPath: "../images/location.png",
                    id: 0,
                    latitude: i,
                    longitude: n,
                    width: 30,
                    height: 30
                } ], e = 0, o = t.data.data.length; e < o; ++e) a.push({
                    iconPath: "../images/store.png",
                    id: e + 1,
                    latitude: t.data.data[e].latitude,
                    longitude: t.data.data[e].longitude,
                    width: 40,
                    height: 40
                });
                s.data.storeList = t.data.data, s.handleStoreList(t.latitude, t.longitude), s.setData({
                    markers: a,
                    latitude: i,
                    longitude: n
                });
            }
        });
    },
    onRegionChange: function(t) {
        if ("end" == t.type) {
            var a = this;
            a.mapCtx.getCenterLocation({
                success: function(t) {
                    a.mapCtx.translateMarker({
                        markerId: 0,
                        autoRotate: !1,
                        duration: 500,
                        destination: {
                            latitude: t.latitude,
                            longitude: t.longitude
                        }
                    }), a.handleStoreList(t.latitude, t.longitude);
                }
            });
        }
    },
    markertap: function(t) {
        console.log(t.markerId);
    },
    controltap: function(t) {
        console.log(t.controlId);
    },
    onSelected: function(t) {
        wx.setStorage({
            key: "shopStore",
            data: this.data.storeList[t.currentTarget.dataset.index],
            success: function(t) {
                wx.navigateBack({
                    delta: 1
                });
            }
        });
    },
    handleStoreList: function(t, a) {
        for (var e = 0, o = this.data.storeList.length; e < o; e++) this.data.storeList[e].distance = this.calculateDistance(t, a, parseFloat(this.data.storeList[e].latitude), parseFloat(this.data.storeList[e].longitude), "K");
        this.data.storeList.sort(function(t, a) {
            return t.distance - a.distance;
        }), this.setData({
            storeList: this.data.storeList
        });
    },
    calculateDistance: function(t, a, e, o, i) {
        var n = Math.PI * t / 180, s = Math.PI * e / 180, c = (Math.PI, Math.PI, a - o), u = Math.PI * c / 180, r = Math.sin(n) * Math.sin(s) + Math.cos(n) * Math.cos(s) * Math.cos(u);
        return r = 60 * (r = 180 * (r = Math.acos(r)) / Math.PI) * 1.1515, "K" == i && (r *= 1.609344), 
        "N" == i && (r *= .8684), r;
    }
});