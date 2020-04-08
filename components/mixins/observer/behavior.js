Object.defineProperty(exports, "__esModule", {
    value: !0
});

var behavior = exports.behavior = Behavior({
    created: function() {
        var i = this;
        if (this.$options) {
            var s = {}, o = this.setData, r = this.$options().computed, c = Object.keys(r);
            Object.defineProperty(this, "setData", {
                writable: !0
            }), this.setData = function(t, e) {
                var a;
                t && o.call(i, t, e), o.call(i, (a = {}, c.forEach(function(t) {
                    var e = r[t].call(i);
                    s[t] !== e && (s[t] = a[t] = e);
                }), a));
            };
        }
    },
    attached: function() {
        this.setData();
    }
});