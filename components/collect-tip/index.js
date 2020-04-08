var _component = require("../common/component");

(0, _component.VantComponent)({
    props: {
        show: Boolean,
        text: String
    },
    data: {
        isHaveColseCollectTip: !0
    },
    created: function() {
        var t = this;
        wx.getStorage({
            key: "have_close_collect_tip",
            success: function(e) {
                t.setData({
                    isHaveColseCollectTip: e.data
                });
            },
            fail: function() {
                t.setData({
                    isHaveColseCollectTip: !1
                });
            }
        });
    },
    methods: {
        handleCollectTipClose: function() {
            this.setData({
                isHaveColseCollectTip: !0
            }, function() {
                wx.setStorage({
                    key: "have_close_collect_tip",
                    data: !0
                });
            });
        }
    }
});