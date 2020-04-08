var app = getApp(), common = require("../../utils/common.js"), util = require("../../utils/util.js");

Page({
    data: {
        indicatorDots: !0,
        interval: 3e3,
        duration: 1e3,
        userInfo: {},
        scrollTop: "0",
        loadingMoreHidden: !0,
        themeColor: "#f44",
        backgroundColor: "#f8f8f8",
        statusType: [ "今日秒杀", "明日秒杀" ],
        currentType: 0
    },
    statusTap: function(t) {
        var e = t.currentTarget.dataset.index;
        this.data.currentType = e, this.setData({
            currentType: e
        }), this.getSeckill(e);
    },
    onLoad: function(i) {
        var a = this;
        common.getUserInfo(function(e) {
            if (e) common.getSettings(function(t) {
                common.setCustomNavigationBar(t), common.setCustomTabBar(a, t), a.setData({
                    userInfo: e,
                    themeColor: t.theme_color ? t.theme_color : "#f44",
                    backgroundColor: t.background_color ? t.background_color : "#f8f8f8",
                    banner: t.seckill_banner ? t.seckill_banner : "http://qn.zxsite.cn/zxsite_shop/seckill-banner.png"
                }), a.getCommissionAgent(), i.agent_id && a.handleCommissionMember(i.agent_id);
            }); else {
                var t = "/zxsite_shop/start/start?url=/zxsite_shop/seckill-list/index";
                i.agent_id && (t += "&agent_id=" + i.agent_id), wx.redirectTo({
                    url: t
                });
            }
        });
    },
    onShow: function() {
        this.getSeckill(this.data.currentType);
    },
    onReady: function() {},
    getSeckill: function(e) {
        var i = this;
        app.util.request({
            url: "entry/wxapp/seckill-list",
            data: {
                seckill_more: 1,
                tab_index: e
            },
            success: function(t) {
                0 == e ? (i.data.seckillList = t.data.data, i.setData({
                    showIndex: e,
                    loadingMoreHidden: !1
                }), i.getSeckillRemind(e)) : (i.setData({
                    seckillTomorrowListTemp: t.data.data,
                    showIndex: e,
                    loadingMoreHidden: !1
                }), i.getSeckillTommRemind(e));
            }
        });
    },
    toSeckillDetailsTap: function(t) {
        wx.navigateTo({
            url: "/zxsite_shop/seckill-details/index?id=" + t.currentTarget.dataset.id + "&seckill_id=" + t.currentTarget.dataset.seckill_id + "&seckillDate=" + t.currentTarget.dataset.seckilldate + "&time=" + t.currentTarget.dataset.time
        });
    },
    getSeckillRemind: function(e) {
        if (this.data.userInfo.memberInfo) {
            var i = this;
            app.util.request({
                url: "entry/wxapp/seckill-remind-list",
                showLoading: !1,
                success: function(t) {
                    0 < t.data.data.length && i.data.seckillList.forEach(function(e) {
                        t.data.data.forEach(function(t) {
                            t.seckill_id == e.seckill_id && t.uid == i.data.userInfo.memberInfo.uid && t.begin_date == e.start_date && t.begin_time == e.time && (e.remind = 1, 
                            e.remind_id = t.id);
                        });
                    }), i.setData({
                        seckillShowList: i.data.seckillList,
                        showIndex: e
                    }), i.countDown();
                }
            });
        }
    },
    getSeckillTommRemind: function(e) {
        if (this.data.userInfo.memberInfo) {
            var i = this;
            app.util.request({
                url: "entry/wxapp/seckill-remind-list",
                data: {
                    tab_index: 1
                },
                showLoading: !1,
                success: function(t) {
                    0 < t.data.data.length && i.data.seckillTomorrowListTemp.forEach(function(e) {
                        t.data.data.forEach(function(t) {
                            t.seckill_id == e.seckill_id && t.uid == i.data.userInfo.memberInfo.uid && t.begin_date == e.seckillDate && t.begin_time == e.time && (e.remind = 1, 
                            e.remind_id = t.id);
                        });
                    }), i.setData({
                        seckillTomorrowList: i.data.seckillTomorrowListTemp.sort(i.compare("time")),
                        showIndex: e
                    });
                }
            });
        }
    },
    countDown: function() {
        var d = this, u = new Date(), m = u.getTime(), g = [], k = [];
        this.data.seckillShowList.forEach(function(t) {
            var e = new Date(u.getFullYear(), u.getMonth(), u.getDate(), t.time, 59, 59), i = e.getTime();
            if (0 <= i - m && e.getHours() == u.getHours()) {
                var a = (i - m) / 1e3, s = parseInt(a % 86400 % 3600 / 60), r = parseInt(a % 86400 % 3600 % 60);
                t.countdown = d.timeFormat(s) + "分" + d.timeFormat(r) + "秒", t.seckill_status = 1, 
                g.push(t);
            } else if (0 <= i - m && e.getHours() != u.getHours()) {
                var n = e.getHours() - u.getHours() - 1, o = (i - m) / 1e3, l = parseInt(o % 86400 % 3600 / 60), c = parseInt(o % 86400 % 3600 % 60);
                t.countdown = n + "时" + d.timeFormat(l) + "分" + d.timeFormat(c) + "秒", t.seckill_status = 2, 
                g.push(t);
            } else t.countdown = "00分00秒", t.seckill_status = 3, k.push(t);
        }), this.setData({
            seckillShowList: g.sort(this.compare("time")).concat(k.sort(this.compare("time")))
        }), setTimeout(this.countDown, 1e3);
    },
    timeFormat: function(t) {
        return t < 10 ? "0" + t : t;
    },
    compare: function(s) {
        return function(t, e) {
            var i = t[s], a = e[s];
            return isNaN(Number(i)) || isNaN(Number(a)) || (i = Number(i), a = Number(a)), i < a ? -1 : a < i ? 1 : 0;
        };
    },
    onShareAppMessage: function() {
        var t = "/zxsite_shop/seckill-list/index";
        return this.data.agent && (t += "&agent_id=" + this.data.agent.id), {
            title: "秒杀专区——" + wx.getStorageSync("settings").shop_name,
            path: t,
            success: function(t) {},
            fail: function(t) {}
        };
    },
    setRemind: function(t) {
        var i = this, e = t.currentTarget.dataset.seckill_id, a = t.currentTarget.dataset.time, s = t.currentTarget.dataset.seckilldate, r = t.currentTarget.dataset.index;
        app.util.request({
            url: "entry/wxapp/seckill-remind",
            data: {
                seckill_id: e,
                form_id: t.detail.formId,
                seckillDate: s,
                time: a
            },
            success: function(t) {
                wx.showToast({
                    title: "设置成功",
                    icon: "success",
                    duration: 2e3
                });
                for (var e = 0; e < i.data.seckillShowList.length; ++e) if (e == r) {
                    i.data.seckillShowList[e].remind_id = t.data.data.remind_id, i.data.seckillShowList[e].remind = 1, 
                    i.setData({
                        seckillShowList: i.data.seckillShowList,
                        showIndex: 0
                    });
                    break;
                }
            }
        });
    },
    setTommRemind: function(t) {
        var i = this, e = t.currentTarget.dataset.seckill_id, a = t.currentTarget.dataset.time, s = t.currentTarget.dataset.index, r = t.currentTarget.dataset.seckilldate;
        app.util.request({
            url: "entry/wxapp/seckill-remind",
            data: {
                seckill_id: e,
                form_id: t.detail.formId,
                time: a,
                seckillDate: r
            },
            success: function(t) {
                wx.showToast({
                    title: "设置成功",
                    icon: "success",
                    duration: 2e3
                });
                for (var e = 0; e < i.data.seckillTomorrowList.length; ++e) if (e == s) {
                    i.data.seckillTomorrowList[e].remind_id = t.data.data.remind_id, i.data.seckillTomorrowList[e].remind = 1, 
                    i.setData({
                        seckillTomorrowList: i.data.seckillTomorrowList.sort(i.compare("time")),
                        showIndex: 1
                    });
                    break;
                }
            }
        });
    },
    cancleRemind: function(t) {
        var i = this, e = t.currentTarget.dataset.seckill_remind_id, a = t.currentTarget.dataset.index;
        app.util.request({
            url: "entry/wxapp/seckill-cancle-remind",
            data: {
                seckill_remind_id: e
            },
            success: function(t) {
                wx.showToast({
                    title: "取消成功",
                    icon: "success",
                    duration: 2e3
                });
                for (var e = 0; e < i.data.seckillShowList.length; ++e) if (e == a) {
                    i.data.seckillShowList[e].remind = 0, i.setData({
                        seckillShowList: i.data.seckillShowList
                    });
                    break;
                }
            }
        });
    },
    cancleTommRemind: function(t) {
        var i = this, e = t.currentTarget.dataset.seckill_remind_id, a = t.currentTarget.dataset.index;
        app.util.request({
            url: "entry/wxapp/seckill-cancle-remind",
            data: {
                seckill_remind_id: e
            },
            success: function(t) {
                wx.showToast({
                    title: "取消成功",
                    icon: "success",
                    duration: 2e3
                });
                for (var e = 0; e < i.data.seckillTomorrowList.length; ++e) if (e == a) {
                    i.data.seckillTomorrowList[e].remind = 0, i.setData({
                        seckillTomorrowList: i.data.seckillTomorrowList.sort(i.compare("time"))
                    });
                    break;
                }
            }
        });
    },
    getCommissionAgent: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/commission-agent",
            showLoading: !1,
            data: {
                status: 5
            },
            success: function(t) {
                e.setData({
                    agent: t.data.data
                });
            }
        });
    },
    handleCommissionMember: function(t) {
        app.util.request({
            url: "entry/wxapp/commission-member-create",
            showLoading: !1,
            data: {
                agent_id: t
            }
        });
    }
});