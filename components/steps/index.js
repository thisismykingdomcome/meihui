var _component = require("../common/component"), _color = require("../common/color");

(0, _component.VantComponent)({
    props: {
        icon: String,
        steps: Array,
        active: Number,
        direction: {
            type: String,
            value: "horizontal"
        },
        activeColor: {
            type: String,
            value: _color.GREEN
        }
    },
    watch: {
        steps: "formatSteps",
        active: "formatSteps"
    },
    created: function() {
        this.formatSteps();
    },
    methods: {
        formatSteps: function() {
            var e = this, t = this.data.steps;
            t.forEach(function(t, o) {
                t.status = e.getStatus(o);
            }), this.setData({
                steps: t
            });
        },
        getStatus: function(t) {
            var o = this.data.active;
            return t < o ? "finish" : t === o ? "process" : "";
        }
    }
});