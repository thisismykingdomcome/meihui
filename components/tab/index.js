var _component = require("../common/component");

(0, _component.VantComponent)({
    relation: {
        name: "tabs",
        type: "ancestor"
    },
    props: {
        title: String,
        disabled: Boolean
    },
    data: {
        inited: !1,
        active: !1
    },
    watch: {
        disabled: function() {
            var t = this.getRelationNodes("../tabs/index")[0];
            t && t.updateTabs();
        },
        title: function() {
            var t = this.getRelationNodes("../tabs/index")[0];
            t && t.updateTabs();
        }
    }
});