var app = getApp(), lineChart = null;

Page({
    data: {
        themeColor: "#f44",
        backgroundColor: "#ffffff",
        tabbarActive: 1
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
                    op: "exchange-record"
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
                            name: "下单量",
                            data: t.orderCount,
                            color: "#4b0"
                        }, {
                            name: "付款量",
                            data: t.payCount,
                            color: "#f44"
                        } ],
                        xAxis: {
                            disableGrid: !0
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
            url: "/zxsite_shop/start/start?url=/packages/manage/statistics/exchange-record&type=redirect"
        });
    },
    createSimulationData: function(a) {
        for (var t = [], e = [], r = [], n = 0, o = a.length; n < o; ++n) t.push(a[n].date), 
        e.push(a[n].order_count), r.push(a[n].pay_count);
        return {
            categories: t,
            orderCount: e,
            payCount: r
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
                return console.log(a), t + " " + a.name + " " + a.data;
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
                op: "exchange-record",
                day: t
            },
            success: function(a) {
                r.setData({
                    statistics: a.data.data
                });
                var t = r.createSimulationData(a.data.data.list), e = [ {
                    name: "下单量",
                    data: t.orderCount,
                    color: "#4b0"
                }, {
                    name: "付款量",
                    data: t.payCount,
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