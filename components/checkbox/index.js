var _component = require("../common/component");

(0, _component.VantComponent)({
    field: !0,
    relation: {
        name: "checkbox-group",
        type: "ancestor"
    },
    classes: [ "icon-class", "label-class" ],
    props: {
        value: null,
        disabled: Boolean,
        useIconSlot: Boolean,
        checkedColor: String,
        labelPosition: String,
        labelDisabled: Boolean,
        shape: {
            type: String,
            value: "round"
        }
    },
    computed: {
        iconClass: function() {
            var e = this.data, a = e.disabled, t = e.value, n = e.shape;
            return this.classNames("van-checkbox__icon", "van-checkbox__icon--" + n, {
                "van-checkbox__icon--disabled": a,
                "van-checkbox__icon--checked": t
            });
        },
        iconStyle: function() {
            var e = this.data, a = e.value, t = e.disabled, n = e.checkedColor;
            return n && a && !t ? "border-color: " + n + "; background-color: " + n : "";
        }
    },
    methods: {
        emitChange: function(e) {
            var a = this.getRelationNodes("../checkbox-group/index")[0];
            a ? this.setParentValue(a, e) : (this.$emit("input", e), this.$emit("change", e));
        },
        toggle: function() {
            this.data.disabled || this.emitChange(!this.data.value);
        },
        onClickLabel: function() {
            this.data.disabled || this.data.labelDisabled || this.emitChange(!this.data.value);
        },
        setParentValue: function(e, a) {
            var t = e.data.value.slice(), n = this.data.name;
            if (a) {
                if (e.data.max && t.length >= e.data.max) return;
                -1 === t.indexOf(n) && (t.push(n), e.$emit("input", t), e.$emit("change", t));
            } else {
                var i = t.indexOf(n);
                -1 !== i && (t.splice(i, 1), e.$emit("input", t), e.$emit("change", t));
            }
        }
    }
});