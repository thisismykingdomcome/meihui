var _component = require("../common/component");

(0, _component.VantComponent)({
    props: {
        info: null,
        name: String,
        size: String,
        color: String,
        customStyle: String,
        classPrefix: {
            type: String,
            value: "van-icon"
        }
    },
    methods: {
        onClick: function() {
            this.$emit("click");
        }
    }
});