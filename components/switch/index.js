var _component = require("../common/component");

(0, _component.VantComponent)({
    field: !0,
    classes: [ "node-class" ],
    props: {
        checked: Boolean,
        loading: Boolean,
        disabled: Boolean,
        activeColor: String,
        inactiveColor: String,
        size: {
            type: String,
            value: "30px"
        }
    },
    watch: {
        checked: function(t) {
            this.setData({
                value: t
            });
        }
    },
    computed: {
        classes: function() {
            return this.classNames("custom-class", "van-switch", {
                "van-switch--on": this.data.checked,
                "van-switch--disabled": this.data.disabled
            });
        },
        style: function() {
            var t = this.data.checked ? this.data.activeColor : this.data.inactiveColor;
            return "font-size: " + this.data.size + "; " + (t ? "background-color: " + t : "");
        }
    },
    created: function() {
        this.setData({
            value: this.data.checked
        });
    },
    methods: {
        onClick: function() {
            if (!this.data.disabled && !this.data.loading) {
                var t = !this.data.checked;
                this.$emit("input", t), this.$emit("change", t);
            }
        }
    }
});