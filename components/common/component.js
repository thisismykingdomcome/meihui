Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.VantComponent = void 0;

var _basic = require("../mixins/basic"), _index = require("../mixins/observer/index");

function _defineProperty(e, s, a) {
    return s in e ? Object.defineProperty(e, s, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[s] = a, e;
}

function mapKeys(s, a, t) {
    Object.keys(t).forEach(function(e) {
        s[e] && (a[t[e]] = s[e]);
    });
}

function VantComponent(e) {
    void 0 === e && (e = {});
    var s = {};
    mapKeys(e, s, {
        data: "data",
        props: "properties",
        mixins: "behaviors",
        methods: "methods",
        beforeCreate: "created",
        created: "attached",
        mounted: "ready",
        relations: "relations",
        destroyed: "detached",
        classes: "externalClasses"
    });
    var a = e.relation;
    a && (s.relations = Object.assign(s.relations || {}, _defineProperty({}, "../" + a.name + "/index", a))), 
    s.externalClasses = s.externalClasses || [], s.externalClasses.push("custom-class"), 
    s.behaviors = s.behaviors || [], s.behaviors.push(_basic.basic), e.field && s.behaviors.push("wx://form-field"), 
    s.options = {
        multipleSlots: !0,
        addGlobalClass: !0
    }, (0, _index.observe)(e, s), Component(s);
}

exports.VantComponent = VantComponent;