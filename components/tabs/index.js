var _component = require("../common/component");

(0, _component.VantComponent)({
    relation: {
        name: "tab",
        type: "descendant",
        linked: function(t) {
            this.data.tabs.push({
                instance: t,
                data: t.data
            }), this.updateTabs();
        },
        unlinked: function(a) {
            var t = this.data.tabs.filter(function(t) {
                return t.instance !== a;
            });
            this.setData({
                tabs: t,
                scrollable: t.length > this.data.swipeThreshold
            }), this.setActiveTab();
        }
    },
    props: {
        color: String,
        lineWidth: Number,
        active: {
            type: Number,
            value: 0
        },
        type: {
            type: String,
            value: "line"
        },
        border: {
            type: Boolean,
            value: !0
        },
        duration: {
            type: Number,
            value: .2
        },
        zIndex: {
            type: Number,
            value: 1
        },
        swipeThreshold: {
            type: Number,
            value: 4
        }
    },
    data: {
        tabs: [],
        lineStyle: "",
        scrollLeft: 0,
        scrollable: !1
    },
    watch: {
        swipeThreshold: function() {
            this.setData({
                scrollable: this.data.tabs.length > this.data.swipeThreshold
            });
        },
        color: "setLine",
        lineWidth: "setLine",
        active: "setActiveTab"
    },
    mounted: function() {
        this.setLine(), this.scrollIntoView();
    },
    methods: {
        updateTabs: function() {
            var t = this.data.tabs;
            this.setData({
                tabs: t,
                scrollable: t.length > this.data.swipeThreshold
            }), this.setActiveTab();
        },
        trigger: function(t, a) {
            this.$emit(t, {
                index: a,
                title: this.data.tabs[a].data.title
            });
        },
        onTap: function(t) {
            var a = t.currentTarget.dataset.index;
            this.data.tabs[a].data.disabled ? this.trigger("disabled", a) : (this.trigger("click", a), 
            this.setActive(a));
        },
        setActive: function(t) {
            t !== this.data.active && (this.trigger("change", t), this.setData({
                active: t
            }), this.setActiveTab());
        },
        setLine: function() {
            var n = this;
            "line" === this.data.type && this.getRect(".van-tab", !0).then(function(t) {
                var a = t[n.data.active], e = n.data.lineWidth || a.width / 2, i = t.slice(0, n.data.active).reduce(function(t, a) {
                    return t + a.width;
                }, 0);
                i += (a.width - e) / 2, n.setData({
                    lineStyle: "\n            width: " + e + "px;\n            background-color: " + n.data.color + ";\n            transform: translateX(" + i + "px);\n            transition-duration: " + n.data.duration + "s;\n          "
                });
            });
        },
        setActiveTab: function() {
            var i = this;
            this.data.tabs.forEach(function(t, a) {
                var e = {
                    active: a === i.data.active
                };
                e.active && (e.inited = !0), e.active !== t.instance.data.active && t.instance.setData(e);
            }), this.setData({}, function() {
                i.setLine(), i.scrollIntoView();
            });
        },
        scrollIntoView: function() {
            var n = this;
            this.data.scrollable && this.getRect(".van-tab", !0).then(function(t) {
                var a = t[n.data.active], e = t.slice(0, n.data.active).reduce(function(t, a) {
                    return t + a.width;
                }, 0), i = a.width;
                n.getRect(".van-tabs__nav").then(function(t) {
                    var a = t.width;
                    n.setData({
                        scrollLeft: e - (a - i) / 2
                    });
                });
            });
        }
    }
});