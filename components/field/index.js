var _component = require("../common/component");

function _defineProperty(e, t, n) {
    return t in e ? Object.defineProperty(e, t, {
        value: n,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = n, e;
}

(0, _component.VantComponent)({
    field: !0,
    classes: [ "input-class" ],
    props: {
        icon: String,
        label: String,
        error: Boolean,
        focus: Boolean,
        center: Boolean,
        isLink: Boolean,
        leftIcon: String,
        disabled: Boolean,
        autosize: Boolean,
        readonly: Boolean,
        required: Boolean,
        iconClass: String,
        clearable: Boolean,
        inputAlign: String,
        customClass: String,
        confirmType: String,
        errorMessage: String,
        placeholder: String,
        customStyle: String,
        useIconSlot: Boolean,
        useButtonSlot: Boolean,
        placeholderStyle: String,
        cursorSpacing: {
            type: Number,
            value: 50
        },
        maxlength: {
            type: Number,
            value: -1
        },
        type: {
            type: String,
            value: "text"
        },
        border: {
            type: Boolean,
            value: !0
        },
        titleWidth: {
            type: String,
            value: "90px"
        }
    },
    data: {
        showClear: !1
    },
    computed: {
        inputClass: function() {
            var e = this.data;
            return this.classNames("input-class", "van-field__input", _defineProperty({
                "van-field--error": e.error,
                "van-field__textarea": "textarea" === e.type,
                "van-field__input--disabled": e.disabled
            }, "van-field__input--" + e.inputAlign, e.inputAlign));
        }
    },
    beforeCreate: function() {
        this.focused = !1;
    },
    methods: {
        onInput: function(e) {
            var t = (e.detail || {}).value, n = void 0 === t ? "" : t;
            this.$emit("input", n), this.$emit("change", n), this.setData({
                value: n,
                showClear: this.getShowClear(n)
            });
        },
        onFocus: function() {
            this.$emit("focus"), this.focused = !0, this.setData({
                showClear: this.getShowClear()
            });
        },
        onBlur: function() {
            this.focused = !1, this.$emit("blur"), this.setData({
                showClear: this.getShowClear()
            });
        },
        onClickIcon: function() {
            this.$emit("click-icon");
        },
        getShowClear: function(e) {
            return e = void 0 === e ? this.data.value : e, this.data.clearable && this.focused && e && !this.data.readonly;
        },
        onClear: function() {
            this.setData({
                value: "",
                showClear: this.getShowClear("")
            }), this.$emit("input", ""), this.$emit("change", "");
        },
        onConfirm: function() {
            this.$emit("confirm", this.data.value);
        }
    }
});