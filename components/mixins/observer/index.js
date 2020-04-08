Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.observe = observe;

var _behavior = require("./behavior"), _props = require("./props");

function observe(e, r) {
    var o = e.watch, s = e.computed;
    if (o) {
        var p = r.properties || {};
        Object.keys(o).forEach(function(e) {
            if (e in p) {
                var r = p[e];
                null !== r && "type" in r || (r = {
                    type: r
                }), r.observer = o[e], p[e] = r;
            }
        }), r.properties = p;
    }
    s && (r.behaviors.push(_behavior.behavior), r.methods = r.methods || {}, r.methods.$options = function() {
        return e;
    }, r.properties && (0, _props.observeProps)(r.properties));
}