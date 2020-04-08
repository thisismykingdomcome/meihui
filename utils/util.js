function formatTime(e) {
    var t = e.getFullYear(), r = e.getMonth() + 1, n = e.getDate(), a = e.getHours(), o = e.getMinutes(), S = e.getSeconds();
    return [ t, r, n ].map(formatNumber).join("/") + " " + [ a, o, S ].map(formatNumber).join(":");
}

function formatNumber(e) {
    return (e = e.toString())[1] ? e : "0" + e;
}

function isEmpty(e) {
    return "" == e || null == e || null == e;
}

function setStorageSync(e, t, r) {
    wx.setStorageSync(e, t), r = isEmpty(r) ? 1800 : r;
    var n = Date.parse(new Date());
    wx.setStorageSync(e + "_expire", n + 1e3 * r);
}

function getStorageSync(e) {
    var t = parseInt(wx.getStorageSync(e + "_expire"));
    return Date.parse(new Date()) < t && wx.getStorageSync(e);
}

function removeStorageSync(e) {
    wx.removeStorageSync(e), wx.removeStorageSync(e + "_expire");
}

function clearStorageSync() {
    wx.clearStorageSync();
}

function parseUrlString(e) {
    var t = {}, r = [], n = "", a = "", o = e.split("&");
    for (var S in o) n = (r = o[S].split("="))[0], a = r[1], t[n] = a;
    return t;
}

module.exports = {
    formatTime: formatTime,
    isEmpty: isEmpty,
    setStorageSync: setStorageSync,
    getStorageSync: getStorageSync,
    removeStorageSync: removeStorageSync,
    clearStorageSync: clearStorageSync,
    parseUrlString: parseUrlString
};