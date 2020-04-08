var _component = require("../common/component"), _button = require("../mixins/button"), _openType = require("../mixins/open-type");

(0, _component.VantComponent)({
    classes: [ "loading-class" ],
    mixins: [ _button.button, _openType.openType ],
    props: {
        plain: Boolean,
        block: Boolean,
        round: Boolean,
        square: Boolean,
        loading: Boolean,
        disabled: Boolean,
        type: {
            type: String,
            value: "default"
        },
        size: {
            type: String,
            value: "normal"
        }
    },
    computed: {
        classes: function() {
            var n = this.data, o = n.type, t = n.size, a = n.block, e = n.plain, i = n.round, s = n.square, l = n.loading, u = n.disabled;
            return this.classNames("custom-class", "van-button", "van-button--" + o, "van-button--" + t, {
                "van-button--block": a,
                "van-button--round": i,
                "van-button--plain": e,
                "van-button--square": s,
                "van-button--loading": l,
                "van-button--disabled": u,
                "van-button--unclickable": u || l
            });
        }
    },
    methods: {
        onClick: function() {
            this.data.disabled || this.data.loading || this.$emit("click");
        }
    }
});