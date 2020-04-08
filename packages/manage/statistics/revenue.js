var app = getApp(), lineChart = null;

Page({
    data: {
        themeColor: "#f44",
        backgroundColor: "#ffffff",
        tabbarActive: 0
    },
    onLoad: function(a) {
        if (wx.getStorageSync("userInfo")) {
            var e = this, r = 320;
            try {
                var t = wx.getSystemInfoSync();
                r = t.windowWidth;
            } catch (a) {
                console.error("getSystemInfoSync failed!");
            }
            app.util.request({
                url: "entry/wxapp/manage-statistics",
                data: {
                    m: "zxsite_shop",
                    op: "revenue"
                },
                success: function(a) {
                    e.setData({
                        statistics: a.data.data
                    });
                    var t = e.createSimulationData(a.data.data.list);
                    lineChart = new app.utils.wxCharts({
                        canvasId: "line-canvas",
                        type: "line",
                        categories: t.categories,
                        animation: !0,
                        background: "#fff",
                        series: [ {
                            name: "营收",
                            data: t.data,
                            color: "#f44"
                        } ],
                        xAxis: {
                            disableGrid: !0
                        },
                        yAxis: {
                            format: function(a) {
                                return a.toFixed(2);
                            }
                        },
                        width: r,
                        height: 250,
                        dataLabel: !1,
                        dataPointShape: !0,
                        enableScroll: !0,
                        extra: {
                            lineStyle: "curve"
                        }
                    });
                }
            });
        } else wx.redirectTo({
            url: "/zxsite_shop/start/start?url=/packages/manage/statistics/revenue&type=redirect"
        });
    },
    createSimulationData: function(a) {
        for (var t = [], e = [], r = 0, i = a.length; r < i; ++r) t.push(a[r].date), e.push(parseFloat(a[r].amount));
        return {
            categories: t,
            data: e
        };
    },
    touchHandler: function(a) {
        lineChart.scrollStart(a);
    },
    moveHandler: function(a) {
        lineChart.scroll(a);
    },
    touchEndHandler: function(a) {
        lineChart.scrollEnd(a), lineChart.showToolTip(a, {
            format: function(a, t) {
                return t + " " + a.name + " ¥" + a.data;
            }
        });
    },
    onTabChange: function(a) {
        var r = this, t = 7;
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
                op: "revenue",
                day: t
            },
            success: function(a) {
                r.setData({
                    statistics: a.data.data
                });
                var t = r.createSimulationData(a.data.data.list), e = [ {
                    name: "营收",
                    data: t.data,
                    color: "#f44"
                } ];
                lineChart.updateData({
                    categories: t.categories,
                    series: e
                });
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