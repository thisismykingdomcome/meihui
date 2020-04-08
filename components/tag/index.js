var _component = require("../common/component"), _color = require("../common/color");

function _defineProperty(o, r, n) {
    return r in o ? Object.defineProperty(o, r, {
        value: n,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : o[r] = n, o;
}

var DEFAULT_COLOR = "#999", COLOR_MAP = {
    danger: _color.RED,
    primary: _color.BLUE,
    success: _color.GREEN
};

(0, _component.VantComponent)({
    props: {
        size: String,
        type: String,
        mark: Boolean,
        color: String,
        plain: Boolean,
        round: Boolean
    },
    computed: {
        classes: function() {
            var o, r = this.data;
            return this.classNames("van-tag", "custom-class", (_defineProperty(o = {
                "van-tag--mark": r.mark,
                "van-tag--plain": r.plain,
                "van-tag--round": r.round
            }, "van-tag--" + r.size, r.size), _defineProperty(o, "van-hairline--surround", r.plain), 
            o));
        },
        style: function() {
            var o = this.data.color || COLOR_MAP[this.data.type] || DEFAULT_COLOR;
            return (this.data.plain ? "color" : "background-color") + ": " + o;
        }
    }
});