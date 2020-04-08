var app = getApp(), pieChart = null, windowWidth = 320;

Page({
    data: {
        themeColor: "#f44",
        backgroundColor: "#ffffff",
        tabbarActive: 2
    },
    onLoad: function(a) {
        if (wx.getStorageSync("userInfo")) {
            var i = this;
            try {
                var t = wx.getSystemInfoSync();
                windowWidth = t.windowWidth;
            } catch (a) {
                console.error("getSystemInfoSync failed!");
            }
            app.util.request({
                url: "entry/wxapp/manage-statistics",
                data: {
                    m: "zxsite_shop",
                    op: "sales"
                },
                success: function(a) {
                    i.setData({
                        statistics: a.data.data
                    });
                    for (var t = 0, e = a.data.data.length; t < e; ++t) a.data.data[t].data = parseInt(a.data.data[t].data);
                    0 < a.data.data.length && (pieChart = new app.utils.wxCharts({
                        animation: !0,
                        canvasId: "pie-canvas",
                        type: "pie",
                        series: a.data.data,
                        width: windowWidth,
                        height: 300,
                        dataLabel: !0
                    }));
                }
            });
        } else wx.redirectTo({
            url: "/zxsite_shop/start/start?url=/packages/manage/statistics/sales&type=redirect"
        });
    },
    touchHandler: function(a) {
        console.log(pieChart.getCurrentDataIndex(a));
    },
    onTabChange: function(a) {
        var i = this, t = 7;
        switch (a.detail.index) {
          case 0:
            t = 7;
            break;

          case 1:
            t = 30;
            break;

          case 2:
            t = 90;
        }
        app.util.request({
            url: "entry/wxapp/manage-statistics",
            data: {
                m: "zxsite_shop",
                op: "sales",
                day: t
            },
            success: function(a) {
                i.setData({
                    statistics: a.data.data
                });
                for (var t = 0, e = a.data.data.length; t < e; ++t) a.data.data[t].data = parseInt(a.data.data[t].data);
                0 < a.data.data.length && (app.utils.util.isEmpty(pieChart) ? pieChart = new app.utils.wxCharts({
                    animation: !0,
                    canvasId: "pie-canvas",
                    type: "pie",
                    series: a.data.data,
                    width: windowWidth,
                    height: 300,
                    dataLabel: !0
                }) : pieChart.updateData({
                    series: a.data.data
                }));
            }
        });
    },
    onTabbarChange: function(a) {
        0 == a.detail ? wx.redirectTo({
            url: "revenue"
        }) : 1 == a.detail ? wx.redirectTo({
            url: "exchange-record"
        }) : 2 == a.detail && wx.redirectTo({
            url: "sales"
        });
    }
});