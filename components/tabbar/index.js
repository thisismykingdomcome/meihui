var _component = require("../common/component");

(0, _component.VantComponent)({
    relation: {
        name: "tabbar-item",
        type: "descendant",
        linked: function(t) {
            var e = this;
            this.data.items.push(t), setTimeout(function() {
                e.setActiveItem();
            });
        },
        unlinked: function(e) {
            var t = this;
            this.data.items = this.data.items.filter(function(t) {
                return t !== e;
            }), setTimeout(function() {
                t.setActiveItem();
            });
        }
    },
    props: {
        active: Number,
        fixed: {
            type: Boolean,
            value: !0
        },
        zIndex: {
            type: Number,
            value: 1
        }
    },
    data: {
        items: [],
        currentActive: -1
    },
    watch: {
        active: function(t) {
            this.setData({
                currentActive: t
            }), this.setActiveItem();
        }
    },
    created: function() {
        this.setData({
            currentActive: this.data.active
        });
    },
    methods: {
        setActiveItem: function() {
            var i = this;
            this.data.items.forEach(function(t, e) {
                t.setActive(e === i.data.currentActive);
            });
        },
        onChange: function(t) {
            var e = this.data.items.indexOf(t);
            e !== this.data.currentActive && -1 !== e && (this.$emit("change", e), this.setData({
                currentActive: e
            }), this.setActiveItem());
        }
    }
});