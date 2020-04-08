var app = getApp();

Page({
    data: {
        data: {
            markers: [],
            polygons: [],
            height: 300
        }
    },
    onLoad: function(t) {
        var n = this;
        app.utils.common.getSettings(function(t) {
            app.utils.common.setCustomNavigationBar(t);
            for (var o = [ {
                iconPath: "../images/location.png",
                id: 0,
                latitude: t.latitude,
                longitude: t.longitude,
                width: 30,
                height: 30
            } ], e = [ {
                points: [],
                strokeWidth: 2,
                strokeColor: "#006600E6",
                fillColor: "#FFAA0066"
            } ], a = 0, i = t.city_express_area.length; a < i; ++a) e[0].points.push({
                longitude: t.city_express_area[a][0],
                latitude: t.city_express_area[a][1]
            });
            n.setData({
                markers: o,
                polygons: e
            });
        }), wx.getSystemInfo({
            success: function(t) {
                n.setData({
                    height: t.windowHeight
                });
            }
        });
    },
    regionchange: function(t) {
        console.log(t.type);
    },
    markertap: function(t) {
        console.log(t.markerId);
    },
    controltap: function(t) {
        console.log(t.controlId);
    }
});