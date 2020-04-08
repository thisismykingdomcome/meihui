Object.defineProperty(exports, "__esModule", {
    value: !0
});

var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t;
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
};

function isDef(t) {
    return null != t;
}

function isObj(t) {
    var e = void 0 === t ? "undefined" : _typeof(t);
    return null !== t && ("object" === e || "function" === e);
}

function isNumber(t) {
    return /^\d+$/.test(t);
}

exports.isObj = isObj, exports.isDef = isDef, exports.isNumber = isNumber;