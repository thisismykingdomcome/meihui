var _component = require("../common/component");

(0, _component.VantComponent)({
    field: !0,
    classes: [ "cancel-class" ],
    props: {
        focus: Boolean,
        error: Boolean,
        disabled: Boolean,
        readonly: Boolean,
        inputAlign: String,
        showAction: Boolean,
        useActionSlot: Boolean,
        placeholder: String,
        placeholderStyle: String,
        background: {
            type: String,
            value: "#f8f8f8"
        },
        maxlength: {
            type: Number,
            value: -1
        }
    },
    methods: {
        onChange: function(e) {
            this.setData({
                value: e.detail
            }), this.$emit("change", e.detail);
        },
        onCancel: function() {
            this.setData({
                value: ""
            }), this.$emit("cancel"), this.$emit("change", "");
        },
        onSearch: function() {
            this.$emit("search", this.data.value);
        },
        onFocus: function() {
            this.$emit("focus");
        },
        onBlur: function() {
            this.$emit("blur");
        }
    }
});