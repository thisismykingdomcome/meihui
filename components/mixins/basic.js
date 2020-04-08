Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.basic = void 0;

var _classNames = require("../common/class-names"), basic = exports.basic = Behavior({
    methods: {
        classNames: _classNames.classNames,
        $emit: function() {
            this.triggerEvent.apply(this, arguments);
        },
        getRect: function(e, t) {
            var r = this;
            return new Promise(function(s) {
                wx.createSelectorQuery().in(r)[t ? "selectAll" : "select"](e).boundingClientRect(function(e) {
                    t && Array.isArray(e) && e.length && s(e), !t && e && s(e);
                }).exec();
            });
        }
    }
});