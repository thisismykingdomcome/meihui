var _component = require("../common/component"), _transition = require("../mixins/transition");

(0, _component.VantComponent)({
    mixins: [ (0, _transition.transition)(!0) ],
    props: {
        name: {
            type: String,
            value: "fade"
        }
    }
});