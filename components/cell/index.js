var _link = require("../mixins/link"), _component = require("../common/component");

(0, _component.VantComponent)({
    classes: [ "title-class", "label-class", "value-class", "right-icon-class", "hover-class" ],
    mixins: [ _link.link ],
    props: {
        title: null,
        value: null,
        icon: String,
        size: String,
        label: String,
        center: Boolean,
        isLink: Boolean,
        required: Boolean,
        clickable: Boolean,
        titleWidth: String,
        customStyle: String,
        arrowDirection: String,
        useLabelSlot: Boolean,
        border: {
            type: Boolean,
            value: !0
        }
    },
    methods: {
        onClick: function(e) {
            this.$emit("click", e.detail), this.jumpLink();
        }
    }
});