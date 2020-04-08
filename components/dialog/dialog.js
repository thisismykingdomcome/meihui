function _extends() {
    return (_extends = Object.assign || function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var o in n) Object.prototype.hasOwnProperty.call(n, o) && (e[o] = n[o]);
        }
        return e;
    }).apply(this, arguments);
}

Object.defineProperty(exports, "__esModule", {
    value: !0
});

var queue = [], Dialog = function(i) {
    return new Promise(function(e, t) {
        var n = getCurrentPages(), o = n[n.length - 1].selectComponent(i.selector);
        delete i.selector, o && (o.setData(_extends({
            onCancel: t,
            onConfirm: e
        }, i)), queue.push(o));
    });
};

Dialog.defaultOptions = {
    show: !0,
    title: "",
    message: "",
    zIndex: 100,
    overlay: !0,
    asyncClose: !1,
    selector: "#van-dialog",
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    showConfirmButton: !0,
    showCancelButton: !1,
    closeOnClickOverlay: !1,
    confirmButtonOpenType: ""
}, Dialog.alert = function(e) {
    return Dialog(_extends({}, Dialog.currentOptions, e));
}, Dialog.confirm = function(e) {
    return Dialog(_extends({}, Dialog.currentOptions, {
        showCancelButton: !0
    }, e));
}, Dialog.close = function() {
    queue.forEach(function(e) {
        e.close();
    }), queue = [];
}, Dialog.stopLoading = function() {
    queue.forEach(function(e) {
        e.stopLoading();
    });
}, Dialog.setDefaultOptions = function(e) {
    Object.assign(Dialog.currentOptions, e);
}, Dialog.resetDefaultOptions = function() {
    Dialog.currentOptions = _extends({}, Dialog.defaultOptions);
}, Dialog.resetDefaultOptions(), exports.default = Dialog;