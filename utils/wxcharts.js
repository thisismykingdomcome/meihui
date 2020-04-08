var config = {
    yAxisWidth: 15,
    yAxisSplit: 5,
    xAxisHeight: 15,
    xAxisLineHeight: 15,
    legendHeight: 15,
    yAxisTitleWidth: 15,
    padding: 12,
    columePadding: 3,
    fontSize: 10,
    dataPointShape: [ "diamond", "circle", "triangle", "rect" ],
    colors: [ "#7cb5ec", "#f7a35c", "#434348", "#90ed7d", "#f15c80", "#8085e9" ],
    pieChartLinePadding: 25,
    pieChartTextPadding: 15,
    xAxisTextPadding: 3,
    titleColor: "#333333",
    titleFontSize: 20,
    subtitleColor: "#999999",
    subtitleFontSize: 15,
    toolTipPadding: 3,
    toolTipBackground: "#000000",
    toolTipOpacity: .7,
    toolTipLineHeight: 14,
    radarGridCount: 3,
    radarLabelTextMargin: 15
};

function assign(t, e) {
    if (null == t) throw new TypeError("Cannot convert undefined or null to object");
    for (var i = Object(t), a = 1; a < arguments.length; a++) {
        var n = arguments[a];
        if (null != n) for (var o in n) Object.prototype.hasOwnProperty.call(n, o) && (i[o] = n[o]);
    }
    return i;
}

var util = {
    toFixed: function(t, e) {
        return e = e || 2, this.isFloat(t) && (t = t.toFixed(e)), t;
    },
    isFloat: function(t) {
        return t % 1 != 0;
    },
    approximatelyEqual: function(t, e) {
        return Math.abs(t - e) < 1e-10;
    },
    isSameSign: function(t, e) {
        return Math.abs(t) === t && Math.abs(e) === e || Math.abs(t) !== t && Math.abs(e) !== e;
    },
    isSameXCoordinateArea: function(t, e) {
        return this.isSameSign(t.x, e.x);
    },
    isCollision: function(t, e) {
        return t.end = {}, t.end.x = t.start.x + t.width, t.end.y = t.start.y - t.height, 
        e.end = {}, e.end.x = e.start.x + e.width, e.end.y = e.start.y - e.height, !(e.start.x > t.end.x || e.end.x < t.start.x || e.end.y > t.start.y || e.start.y < t.end.y);
    }
};

function findRange(t, e, i) {
    if (isNaN(t)) throw new Error("[wxCharts] unvalid series data!");
    i = i || 10, e = e || "upper";
    for (var a = 1; i < 1; ) i *= 10, a *= 10;
    for (t = "upper" === e ? Math.ceil(t * a) : Math.floor(t * a); t % i != 0; ) "upper" === e ? t++ : t--;
    return t / a;
}

function calValidDistance(t, e, i, a) {
    var n = a.width - i.padding - e.xAxisPoints[0], o = e.eachSpacing * a.categories.length, r = t;
    return 0 <= t ? r = 0 : Math.abs(t) >= o - n && (r = n - o), r;
}

function isInAngleRange(t, e, i) {
    function a(t) {
        for (;t < 0; ) t += 2 * Math.PI;
        for (;t > 2 * Math.PI; ) t -= 2 * Math.PI;
        return t;
    }
    return t = a(t), e = a(e), (i = a(i)) < e && (i += 2 * Math.PI, t < e && (t += 2 * Math.PI)), 
    e <= t && t <= i;
}

function calRotateTranslate(t, e, i) {
    var a = t, n = i - e, o = a + (i - n - a) / Math.sqrt(2);
    return {
        transX: o *= -1,
        transY: (i - n) * (Math.sqrt(2) - 1) - (i - n - a) / Math.sqrt(2)
    };
}

function createCurveControlPoints(t, e) {
    function i(t, e) {
        return !(!t[e - 1] || !t[e + 1]) && (t[e].y >= Math.max(t[e - 1].y, t[e + 1].y) || t[e].y <= Math.min(t[e - 1].y, t[e + 1].y));
    }
    var a = null, n = null, o = null, r = null;
    if (e < 1 ? (a = t[0].x + .2 * (t[1].x - t[0].x), n = t[0].y + .2 * (t[1].y - t[0].y)) : (a = t[e].x + .2 * (t[e + 1].x - t[e - 1].x), 
    n = t[e].y + .2 * (t[e + 1].y - t[e - 1].y)), e > t.length - 3) {
        var s = t.length - 1;
        o = t[s].x - .2 * (t[s].x - t[s - 1].x), r = t[s].y - .2 * (t[s].y - t[s - 1].y);
    } else o = t[e + 1].x - .2 * (t[e + 2].x - t[e].x), r = t[e + 1].y - .2 * (t[e + 2].y - t[e].y);
    return i(t, e + 1) && (r = t[e + 1].y), i(t, e) && (n = t[e].y), {
        ctrA: {
            x: a,
            y: n
        },
        ctrB: {
            x: o,
            y: r
        }
    };
}

function convertCoordinateOrigin(t, e, i) {
    return {
        x: i.x + t,
        y: i.y - e
    };
}

function avoidCollision(t, e) {
    if (e) for (;util.isCollision(t, e); ) 0 < t.start.x ? t.start.y-- : t.start.x < 0 ? t.start.y++ : 0 < t.start.y ? t.start.y++ : t.start.y--;
    return t;
}

function fillSeriesColor(t, e) {
    var i = 0;
    return t.map(function(t) {
        return t.color || (t.color = e.colors[i], i = (i + 1) % e.colors.length), t;
    });
}

function getDataRange(t, e) {
    var i = 0, a = e - t;
    return {
        minRange: findRange(t, "lower", i = 1e4 <= a ? 1e3 : 1e3 <= a ? 100 : 100 <= a ? 10 : 10 <= a ? 5 : 1 <= a ? 1 : .1 <= a ? .1 : .01),
        maxRange: findRange(e, "upper", i)
    };
}

function measureText(t) {
    var e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 10, i = (t = (t = String(t)).split(""), 
    0);
    return t.forEach(function(t) {
        /[a-zA-Z]/.test(t) ? i += 7 : /[0-9]/.test(t) ? i += 5.5 : /\./.test(t) ? i += 2.7 : /-/.test(t) ? i += 3.25 : /[\u4e00-\u9fa5]/.test(t) ? i += 10 : /\(|\)/.test(t) ? i += 3.73 : /\s/.test(t) ? i += 2.5 : /%/.test(t) ? i += 8 : i += 10;
    }), i * e / 10;
}

function dataCombine(t) {
    return t.reduce(function(t, e) {
        return (t.data ? t.data : t).concat(e.data);
    }, []);
}

function getSeriesDataItem(t, i) {
    var a = [];
    return t.forEach(function(t) {
        if (null !== t.data[i] && "undefinded" != typeof t.data[i]) {
            var e = {};
            e.color = t.color, e.name = t.name, e.data = t.format ? t.format(t.data[i]) : t.data[i], 
            a.push(e);
        }
    }), a;
}

function getMaxTextListLength(t) {
    var e = t.map(function(t) {
        return measureText(t);
    });
    return Math.max.apply(null, e);
}

function getRadarCoordinateSeries(t) {
    for (var e = 2 * Math.PI / t, i = [], a = 0; a < t; a++) i.push(e * a);
    return i.map(function(t) {
        return -1 * t + Math.PI / 2;
    });
}

function getToolTipData(t, e, i, a) {
    var n = 4 < arguments.length && void 0 !== arguments[4] ? arguments[4] : {}, o = t.map(function(t) {
        return {
            text: n.format ? n.format(t, a[i]) : t.name + ": " + t.data,
            color: t.color
        };
    }), r = [], s = {
        x: 0,
        y: 0
    };
    return e.forEach(function(t) {
        "undefinded" != typeof t[i] && null !== t[i] && r.push(t[i]);
    }), r.forEach(function(t) {
        s.x = Math.round(t.x), s.y += t.y;
    }), s.y /= r.length, {
        textList: o,
        offset: s
    };
}

function findCurrentIndex(i, t, e, a) {
    var n = 4 < arguments.length && void 0 !== arguments[4] ? arguments[4] : 0, o = -1;
    return isInExactChartArea(i, e, a) && t.forEach(function(t, e) {
        i.x + n > t && (o = e);
    }), o;
}

function isInExactChartArea(t, e, i) {
    return t.x < e.width - i.padding && t.x > i.padding + i.yAxisWidth + i.yAxisTitleWidth && t.y > i.padding && t.y < e.height - i.legendHeight - i.xAxisHeight - i.padding;
}

function findRadarChartCurrentIndex(t, e, i) {
    var n = 2 * Math.PI / i, o = -1;
    if (isInExactPieChartArea(t, e.center, e.radius)) {
        var r = function(t) {
            return t < 0 && (t += 2 * Math.PI), t > 2 * Math.PI && (t -= 2 * Math.PI), t;
        }, s = Math.atan2(e.center.y - t.y, t.x - e.center.x);
        (s *= -1) < 0 && (s += 2 * Math.PI), e.angleList.map(function(t) {
            return t = r(-1 * t);
        }).forEach(function(t, e) {
            var i = r(t - n / 2), a = r(t + n / 2);
            a < i && (a += 2 * Math.PI), (i <= s && s <= a || s + 2 * Math.PI >= i && s + 2 * Math.PI <= a) && (o = e);
        });
    }
    return o;
}

function findPieChartCurrentIndex(t, e) {
    var i = -1;
    if (isInExactPieChartArea(t, e.center, e.radius)) {
        var a = Math.atan2(e.center.y - t.y, t.x - e.center.x);
        a = -a;
        for (var n = 0, o = e.series.length; n < o; n++) {
            var r = e.series[n];
            if (isInAngleRange(a, r._start_, r._start_ + 2 * r._proportion_ * Math.PI)) {
                i = n;
                break;
            }
        }
    }
    return i;
}

function isInExactPieChartArea(t, e, i) {
    return Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2) <= Math.pow(i, 2);
}

function splitPoints(t) {
    var i = [], a = [];
    return t.forEach(function(t, e) {
        null !== t ? a.push(t) : (a.length && i.push(a), a = []);
    }), a.length && i.push(a), i;
}

function calLegendData(t, i, e) {
    if (!1 === i.legend) return {
        legendList: [],
        legendHeight: 0
    };
    var a = [], n = 0, o = [];
    return t.forEach(function(t) {
        var e = 30 + measureText(t.name || "undefinded");
        n + e > i.width ? (a.push(o), n = e, o = [ t ]) : (n += e, o.push(t));
    }), o.length && a.push(o), {
        legendList: a,
        legendHeight: a.length * (e.fontSize + 8) + 5
    };
}

function calCategoriesData(t, e, i) {
    var a = {
        angle: 0,
        xAxisHeight: i.xAxisHeight
    }, n = getXAxisPoints(t, e, i).eachSpacing, o = t.map(function(t) {
        return measureText(t);
    }), r = Math.max.apply(this, o);
    return r + 2 * i.xAxisTextPadding > n && (a.angle = 45 * Math.PI / 180, a.xAxisHeight = 2 * i.xAxisTextPadding + r * Math.sin(a.angle)), 
    a;
}

function getRadarDataPoints(n, o, r, t, e) {
    var s = 5 < arguments.length && void 0 !== arguments[5] ? arguments[5] : 1, i = e.extra.radar || {};
    i.max = i.max || 0;
    var l = Math.max(i.max, Math.max.apply(null, dataCombine(t))), h = [];
    return t.forEach(function(t) {
        var a = {};
        a.color = t.color, a.data = [], t.data.forEach(function(t, e) {
            var i = {};
            i.angle = n[e], i.proportion = t / l, i.position = convertCoordinateOrigin(r * i.proportion * s * Math.cos(i.angle), r * i.proportion * s * Math.sin(i.angle), o), 
            a.data.push(i);
        }), h.push(a);
    }), h;
}

function getPieDataPoints(t) {
    var e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 1, i = 0, a = 0;
    return t.forEach(function(t) {
        t.data = null === t.data ? 0 : t.data, i += t.data;
    }), t.forEach(function(t) {
        t.data = null === t.data ? 0 : t.data, t._proportion_ = t.data / i * e;
    }), t.forEach(function(t) {
        t._start_ = a, a += 2 * t._proportion_ * Math.PI;
    }), t;
}

function getPieTextMaxLength(t) {
    t = getPieDataPoints(t);
    var i = 0;
    return t.forEach(function(t) {
        var e = t.format ? t.format(+t._proportion_.toFixed(2)) : util.toFixed(100 * t._proportion_) + "%";
        i = Math.max(i, measureText(e));
    }), i;
}

function fixColumeData(t, e, i, a, n, o) {
    return t.map(function(t) {
        return null === t ? null : (t.width = (e - 2 * n.columePadding) / i, o.extra.column && o.extra.column.width && 0 < +o.extra.column.width ? t.width = Math.min(t.width, +o.extra.column.width) : t.width = Math.min(t.width, 25), 
        t.x += (a + .5 - i / 2) * t.width, t);
    });
}

function getXAxisPoints(t, e, i) {
    var a = i.yAxisWidth + i.yAxisTitleWidth, n = (e.width - 2 * i.padding - a) / (e.enableScroll ? Math.min(5, t.length) : t.length), o = [], r = i.padding + a, s = e.width - i.padding;
    return t.forEach(function(t, e) {
        o.push(r + e * n);
    }), !0 === e.enableScroll ? o.push(r + t.length * n) : o.push(s), {
        xAxisPoints: o,
        startX: r,
        endX: s,
        eachSpacing: n
    };
}

function getDataPoints(t, n, o, r, s, l, h) {
    var c = 7 < arguments.length && void 0 !== arguments[7] ? arguments[7] : 1, d = [], x = l.height - 2 * h.padding - h.xAxisHeight - h.legendHeight;
    return t.forEach(function(t, e) {
        if (null === t) d.push(null); else {
            var i = {};
            i.x = r[e] + Math.round(s / 2);
            var a = x * (t - n) / (o - n);
            a *= c, i.y = l.height - h.xAxisHeight - h.legendHeight - Math.round(a) - h.padding, 
            d.push(i);
        }
    }), d;
}

function getYAxisTextList(t, e, i) {
    var a = dataCombine(t);
    a = a.filter(function(t) {
        return null !== t;
    });
    var n = Math.min.apply(this, a), o = Math.max.apply(this, a);
    if ("number" == typeof e.yAxis.min && (n = Math.min(e.yAxis.min, n)), "number" == typeof e.yAxis.max && (o = Math.max(e.yAxis.max, o)), 
    n === o) {
        var r = o || 1;
        n -= r, o += r;
    }
    for (var s = getDataRange(n, o), l = s.minRange, h = [], c = (s.maxRange - l) / i.yAxisSplit, d = 0; d <= i.yAxisSplit; d++) h.push(l + c * d);
    return h.reverse();
}

function calYAxisData(t, e, i) {
    var a = getYAxisTextList(t, e, i), n = i.yAxisWidth, o = a.map(function(t) {
        return t = util.toFixed(t, 2), t = e.yAxis.format ? e.yAxis.format(Number(t)) : t, 
        n = Math.max(n, measureText(t) + 5), t;
    });
    return !0 === e.yAxis.disabled && (n = 0), {
        rangesFormat: o,
        ranges: a,
        yAxisWidth: n
    };
}

function drawPointShape(t, e, i, a) {
    a.beginPath(), a.setStrokeStyle("#ffffff"), a.setLineWidth(1), a.setFillStyle(e), 
    "diamond" === i ? t.forEach(function(t, e) {
        null !== t && (a.moveTo(t.x, t.y - 4.5), a.lineTo(t.x - 4.5, t.y), a.lineTo(t.x, t.y + 4.5), 
        a.lineTo(t.x + 4.5, t.y), a.lineTo(t.x, t.y - 4.5));
    }) : "circle" === i ? t.forEach(function(t, e) {
        null !== t && (a.moveTo(t.x + 3.5, t.y), a.arc(t.x, t.y, 4, 0, 2 * Math.PI, !1));
    }) : "rect" === i ? t.forEach(function(t, e) {
        null !== t && (a.moveTo(t.x - 3.5, t.y - 3.5), a.rect(t.x - 3.5, t.y - 3.5, 7, 7));
    }) : "triangle" === i && t.forEach(function(t, e) {
        null !== t && (a.moveTo(t.x, t.y - 4.5), a.lineTo(t.x - 4.5, t.y + 4.5), a.lineTo(t.x + 4.5, t.y + 4.5), 
        a.lineTo(t.x, t.y - 4.5));
    }), a.closePath(), a.fill(), a.stroke();
}

function drawRingTitle(t, e, i) {
    var a = t.title.fontSize || e.titleFontSize, n = t.subtitle.fontSize || e.subtitleFontSize, o = t.title.name || "", r = t.subtitle.name || "", s = t.title.color || e.titleColor, l = t.subtitle.color || e.subtitleColor, h = o ? a : 0, c = r ? n : 0;
    if (r) {
        var d = measureText(r, n), x = (t.width - d) / 2 + (t.subtitle.offsetX || 0), f = (t.height - e.legendHeight + n) / 2;
        o && (f -= (h + 5) / 2), i.beginPath(), i.setFontSize(n), i.setFillStyle(l), i.fillText(r, x, f), 
        i.stroke(), i.closePath();
    }
    if (o) {
        var u = measureText(o, a), g = (t.width - u) / 2 + (t.title.offsetX || 0), p = (t.height - e.legendHeight + a) / 2;
        r && (p += (c + 5) / 2), i.beginPath(), i.setFontSize(a), i.setFillStyle(s), i.fillText(o, g, p), 
        i.stroke(), i.closePath();
    }
}

function drawPointText(t, a, e, n) {
    var o = a.data;
    n.beginPath(), n.setFontSize(e.fontSize), n.setFillStyle("#666666"), t.forEach(function(t, e) {
        if (null !== t) {
            var i = a.format ? a.format(o[e]) : o[e];
            n.fillText(i, t.x - measureText(i) / 2, t.y - 2);
        }
    }), n.closePath(), n.stroke();
}

function drawRadarLabel(t, r, s, l, h, c) {
    var e = l.extra.radar || {};
    r += h.radarLabelTextMargin, c.beginPath(), c.setFontSize(h.fontSize), c.setFillStyle(e.labelColor || "#666666"), 
    t.forEach(function(t, e) {
        var i = {
            x: r * Math.cos(t),
            y: r * Math.sin(t)
        }, a = convertCoordinateOrigin(i.x, i.y, s), n = a.x, o = a.y;
        util.approximatelyEqual(i.x, 0) ? n -= measureText(l.categories[e] || "") / 2 : i.x < 0 && (n -= measureText(l.categories[e] || "")), 
        c.fillText(l.categories[e] || "", n, o + h.fontSize / 2);
    }), c.stroke(), c.closePath();
}

function drawPieText(t, e, c, r, d, s) {
    var x = d + c.pieChartLinePadding, f = [], u = null;
    t.map(function(t) {
        return {
            arc: 2 * Math.PI - (t._start_ + 2 * Math.PI * t._proportion_ / 2),
            text: t.format ? t.format(+t._proportion_.toFixed(2)) : util.toFixed(100 * t._proportion_) + "%",
            color: t.color
        };
    }).forEach(function(t) {
        var e = Math.cos(t.arc) * x, i = Math.sin(t.arc) * x, a = Math.cos(t.arc) * d, n = Math.sin(t.arc) * d, o = 0 <= e ? e + c.pieChartTextPadding : e - c.pieChartTextPadding, r = i, s = measureText(t.text), l = r;
        u && util.isSameXCoordinateArea(u.start, {
            x: o
        }) && (l = 0 < o ? Math.min(r, u.start.y) : e < 0 ? Math.max(r, u.start.y) : 0 < r ? Math.max(r, u.start.y) : Math.min(r, u.start.y)), 
        o < 0 && (o -= s);
        var h = {
            lineStart: {
                x: a,
                y: n
            },
            lineEnd: {
                x: e,
                y: i
            },
            start: {
                x: o,
                y: l
            },
            width: s,
            height: c.fontSize,
            text: t.text,
            color: t.color
        };
        u = avoidCollision(h, u), f.push(u);
    }), f.forEach(function(t) {
        var e = convertCoordinateOrigin(t.lineStart.x, t.lineStart.y, s), i = convertCoordinateOrigin(t.lineEnd.x, t.lineEnd.y, s), a = convertCoordinateOrigin(t.start.x, t.start.y, s);
        r.setLineWidth(1), r.setFontSize(c.fontSize), r.beginPath(), r.setStrokeStyle(t.color), 
        r.setFillStyle(t.color), r.moveTo(e.x, e.y);
        var n = t.start.x < 0 ? a.x + t.width : a.x, o = t.start.x < 0 ? a.x - 5 : a.x + 5;
        r.quadraticCurveTo(i.x, i.y, n, a.y), r.moveTo(e.x, e.y), r.stroke(), r.closePath(), 
        r.beginPath(), r.moveTo(a.x + t.width, a.y), r.arc(n, a.y, 2, 0, 2 * Math.PI), r.closePath(), 
        r.fill(), r.beginPath(), r.setFillStyle("#666666"), r.fillText(t.text, o, a.y + 3), 
        r.closePath(), r.stroke(), r.closePath();
    });
}

function drawToolTipSplitLine(t, e, i, a) {
    var n = i.padding, o = e.height - i.padding - i.xAxisHeight - i.legendHeight;
    a.beginPath(), a.setStrokeStyle("#cccccc"), a.setLineWidth(1), a.moveTo(t, n), a.lineTo(t, o), 
    a.stroke(), a.closePath();
}

function drawToolTip(t, n, e, o, r) {
    var s = !1;
    (n = assign({
        x: 0,
        y: 0
    }, n)).y -= 8;
    var i = t.map(function(t) {
        return measureText(t.text);
    }), l = 9 + 4 * o.toolTipPadding + Math.max.apply(null, i), a = 2 * o.toolTipPadding + t.length * o.toolTipLineHeight;
    n.x - Math.abs(e._scrollDistance_) + 8 + l > e.width && (s = !0), r.beginPath(), 
    r.setFillStyle(e.tooltip.option.background || o.toolTipBackground), r.setGlobalAlpha(o.toolTipOpacity), 
    s ? (r.moveTo(n.x, n.y + 10), r.lineTo(n.x - 8, n.y + 10 - 5), r.lineTo(n.x - 8, n.y + 10 + 5), 
    r.moveTo(n.x, n.y + 10), r.fillRect(n.x - l - 8, n.y, l, a)) : (r.moveTo(n.x, n.y + 10), 
    r.lineTo(n.x + 8, n.y + 10 - 5), r.lineTo(n.x + 8, n.y + 10 + 5), r.moveTo(n.x, n.y + 10), 
    r.fillRect(n.x + 8, n.y, l, a)), r.closePath(), r.fill(), r.setGlobalAlpha(1), t.forEach(function(t, e) {
        r.beginPath(), r.setFillStyle(t.color);
        var i = n.x + 8 + 2 * o.toolTipPadding, a = n.y + (o.toolTipLineHeight - o.fontSize) / 2 + o.toolTipLineHeight * e + o.toolTipPadding;
        s && (i = n.x - l - 8 + 2 * o.toolTipPadding), r.fillRect(i, a, 4, o.fontSize), 
        r.closePath();
    }), r.beginPath(), r.setFontSize(o.fontSize), r.setFillStyle("#ffffff"), t.forEach(function(t, e) {
        var i = n.x + 8 + 2 * o.toolTipPadding + 4 + 5;
        s && (i = n.x - l - 8 + 2 * o.toolTipPadding + 4 + 5);
        var a = n.y + (o.toolTipLineHeight - o.fontSize) / 2 + o.toolTipLineHeight * e + o.toolTipPadding;
        r.fillText(t.text, i, a + o.fontSize);
    }), r.stroke(), r.closePath();
}

function drawYAxisTitle(t, e, i, a) {
    var n = i.xAxisHeight + (e.height - i.xAxisHeight - measureText(t)) / 2;
    a.save(), a.beginPath(), a.setFontSize(i.fontSize), a.setFillStyle(e.yAxis.titleFontColor || "#333333"), 
    a.translate(0, e.height), a.rotate(-90 * Math.PI / 180), a.fillText(t, n, i.padding + .5 * i.fontSize), 
    a.stroke(), a.closePath(), a.restore();
}

function drawColumnDataPoints(a, n, o, r) {
    var s = 4 < arguments.length && void 0 !== arguments[4] ? arguments[4] : 1, t = calYAxisData(a, n, o).ranges, e = getXAxisPoints(n.categories, n, o), l = e.xAxisPoints, h = e.eachSpacing, c = t.pop(), d = t.shift();
    return r.save(), n._scrollDistance_ && 0 !== n._scrollDistance_ && !0 === n.enableScroll && r.translate(n._scrollDistance_, 0), 
    a.forEach(function(t, e) {
        var i = getDataPoints(t.data, c, d, l, h, n, o, s);
        i = fixColumeData(i, h, a.length, e, o, n), r.beginPath(), r.setFillStyle(t.color), 
        i.forEach(function(t, e) {
            if (null !== t) {
                var i = t.x - t.width / 2 + 1, a = n.height - t.y - o.padding - o.xAxisHeight - o.legendHeight;
                r.moveTo(i, t.y), r.rect(i, t.y, t.width - 2, a);
            }
        }), r.closePath(), r.fill();
    }), a.forEach(function(t, e) {
        var i = getDataPoints(t.data, c, d, l, h, n, o, s);
        i = fixColumeData(i, h, a.length, e, o, n), !1 !== n.dataLabel && 1 === s && drawPointText(i, t, o, r);
    }), r.restore(), {
        xAxisPoints: l,
        eachSpacing: h
    };
}

function drawAreaDataPoints(t, o, a, r) {
    var s = 4 < arguments.length && void 0 !== arguments[4] ? arguments[4] : 1, e = calYAxisData(t, o, a).ranges, i = getXAxisPoints(o.categories, o, a), l = i.xAxisPoints, h = i.eachSpacing, c = e.pop(), d = e.shift(), x = o.height - a.padding - a.xAxisHeight - a.legendHeight, f = [];
    return r.save(), o._scrollDistance_ && 0 !== o._scrollDistance_ && !0 === o.enableScroll && r.translate(o._scrollDistance_, 0), 
    o.tooltip && o.tooltip.textList && o.tooltip.textList.length && 1 === s && drawToolTipSplitLine(o.tooltip.offset.x, o, a, r), 
    t.forEach(function(n, t) {
        var e = getDataPoints(n.data, c, d, l, h, o, a, s);
        if (f.push(e), splitPoints(e).forEach(function(a) {
            if (r.beginPath(), r.setStrokeStyle(n.color), r.setFillStyle(n.color), r.setGlobalAlpha(.6), 
            r.setLineWidth(2), 1 < a.length) {
                var t = a[0], e = a[a.length - 1];
                r.moveTo(t.x, t.y), "curve" === o.extra.lineStyle ? a.forEach(function(t, e) {
                    if (0 < e) {
                        var i = createCurveControlPoints(a, e - 1);
                        r.bezierCurveTo(i.ctrA.x, i.ctrA.y, i.ctrB.x, i.ctrB.y, t.x, t.y);
                    }
                }) : a.forEach(function(t, e) {
                    0 < e && r.lineTo(t.x, t.y);
                }), r.lineTo(e.x, x), r.lineTo(t.x, x), r.lineTo(t.x, t.y);
            } else {
                var i = a[0];
                r.moveTo(i.x - h / 2, i.y), r.lineTo(i.x + h / 2, i.y), r.lineTo(i.x + h / 2, x), 
                r.lineTo(i.x - h / 2, x), r.moveTo(i.x - h / 2, i.y);
            }
            r.closePath(), r.fill(), r.setGlobalAlpha(1);
        }), !1 !== o.dataPointShape) {
            var i = a.dataPointShape[t % a.dataPointShape.length];
            drawPointShape(e, n.color, i, r);
        }
    }), !1 !== o.dataLabel && 1 === s && t.forEach(function(t, e) {
        drawPointText(getDataPoints(t.data, c, d, l, h, o, a, s), t, a, r);
    }), r.restore(), {
        xAxisPoints: l,
        calPoints: f,
        eachSpacing: h
    };
}

function drawLineDataPoints(t, n, o, r) {
    var s = 4 < arguments.length && void 0 !== arguments[4] ? arguments[4] : 1, e = calYAxisData(t, n, o).ranges, i = getXAxisPoints(n.categories, n, o), l = i.xAxisPoints, h = i.eachSpacing, c = e.pop(), d = e.shift(), x = [];
    return r.save(), n._scrollDistance_ && 0 !== n._scrollDistance_ && !0 === n.enableScroll && r.translate(n._scrollDistance_, 0), 
    n.tooltip && n.tooltip.textList && n.tooltip.textList.length && 1 === s && drawToolTipSplitLine(n.tooltip.offset.x, n, o, r), 
    t.forEach(function(e, t) {
        var i = getDataPoints(e.data, c, d, l, h, n, o, s);
        if (x.push(i), splitPoints(i).forEach(function(a, t) {
            r.beginPath(), r.setStrokeStyle(e.color), r.setLineWidth(2), 1 === a.length ? (r.moveTo(a[0].x, a[0].y), 
            r.arc(a[0].x, a[0].y, 1, 0, 2 * Math.PI)) : (r.moveTo(a[0].x, a[0].y), "curve" === n.extra.lineStyle ? a.forEach(function(t, e) {
                if (0 < e) {
                    var i = createCurveControlPoints(a, e - 1);
                    r.bezierCurveTo(i.ctrA.x, i.ctrA.y, i.ctrB.x, i.ctrB.y, t.x, t.y);
                }
            }) : a.forEach(function(t, e) {
                0 < e && r.lineTo(t.x, t.y);
            }), r.moveTo(a[0].x, a[0].y)), r.closePath(), r.stroke();
        }), !1 !== n.dataPointShape) {
            var a = o.dataPointShape[t % o.dataPointShape.length];
            drawPointShape(i, e.color, a, r);
        }
    }), !1 !== n.dataLabel && 1 === s && t.forEach(function(t, e) {
        drawPointText(getDataPoints(t.data, c, d, l, h, n, o, s), t, o, r);
    }), r.restore(), {
        xAxisPoints: l,
        calPoints: x,
        eachSpacing: h
    };
}

function drawToolTipBridge(t, e, i, a) {
    i.save(), t._scrollDistance_ && 0 !== t._scrollDistance_ && !0 === t.enableScroll && i.translate(t._scrollDistance_, 0), 
    t.tooltip && t.tooltip.textList && t.tooltip.textList.length && 1 === a && drawToolTip(t.tooltip.textList, t.tooltip.offset, t, e, i), 
    i.restore();
}

function drawXAxis(t, s, l, h) {
    var e = getXAxisPoints(t, s, l), c = e.xAxisPoints, d = (e.startX, e.endX, e.eachSpacing), x = s.height - l.padding - l.xAxisHeight - l.legendHeight, i = x + l.xAxisLineHeight;
    h.save(), s._scrollDistance_ && 0 !== s._scrollDistance_ && h.translate(s._scrollDistance_, 0), 
    h.beginPath(), h.setStrokeStyle(s.xAxis.gridColor || "#cccccc"), !0 !== s.xAxis.disableGrid && ("calibration" === s.xAxis.type ? c.forEach(function(t, e) {
        0 < e && (h.moveTo(t - d / 2, x), h.lineTo(t - d / 2, x + 4));
    }) : c.forEach(function(t, e) {
        h.moveTo(t, x), h.lineTo(t, i);
    })), h.closePath(), h.stroke();
    var a = s.width - 2 * l.padding - l.yAxisWidth - l.yAxisTitleWidth, n = Math.min(t.length, Math.ceil(a / l.fontSize / 1.5)), o = Math.ceil(t.length / n);
    t = t.map(function(t, e) {
        return e % o != 0 ? "" : t;
    }), 0 === l._xAxisTextAngle_ ? (h.beginPath(), h.setFontSize(l.fontSize), h.setFillStyle(s.xAxis.fontColor || "#666666"), 
    t.forEach(function(t, e) {
        var i = d / 2 - measureText(t) / 2;
        h.fillText(t, c[e] + i, x + l.fontSize + 5);
    }), h.closePath(), h.stroke()) : t.forEach(function(t, e) {
        h.save(), h.beginPath(), h.setFontSize(l.fontSize), h.setFillStyle(s.xAxis.fontColor || "#666666");
        var i = measureText(t), a = d / 2 - i, n = calRotateTranslate(c[e] + d / 2, x + l.fontSize / 2 + 5, s.height), o = n.transX, r = n.transY;
        h.rotate(-1 * l._xAxisTextAngle_), h.translate(o, r), h.fillText(t, c[e] + a, x + l.fontSize + 5), 
        h.closePath(), h.stroke(), h.restore();
    }), h.restore();
}

function drawYAxisGrid(t, e, i) {
    for (var a = t.height - 2 * e.padding - e.xAxisHeight - e.legendHeight, n = Math.floor(a / e.yAxisSplit), o = e.yAxisWidth + e.yAxisTitleWidth, r = e.padding + o, s = t.width - e.padding, l = [], h = 0; h < e.yAxisSplit; h++) l.push(e.padding + n * h);
    l.push(e.padding + n * e.yAxisSplit + 2), i.beginPath(), i.setStrokeStyle(t.yAxis.gridColor || "#cccccc"), 
    i.setLineWidth(1), l.forEach(function(t, e) {
        i.moveTo(r, t), i.lineTo(s, t);
    }), i.closePath(), i.stroke();
}

function drawYAxis(t, e, a, n) {
    if (!0 !== e.yAxis.disabled) {
        var i = calYAxisData(t, e, a).rangesFormat, o = a.yAxisWidth + a.yAxisTitleWidth, r = e.height - 2 * a.padding - a.xAxisHeight - a.legendHeight, s = Math.floor(r / a.yAxisSplit), l = a.padding + o, h = e.width - a.padding, c = e.height - a.padding - a.xAxisHeight - a.legendHeight;
        n.setFillStyle(e.background || "#ffffff"), e._scrollDistance_ < 0 && n.fillRect(0, 0, l, c + a.xAxisHeight + 5), 
        n.fillRect(h, 0, e.width, c + a.xAxisHeight + 5);
        for (var d = [], x = 0; x <= a.yAxisSplit; x++) d.push(a.padding + s * x);
        n.stroke(), n.beginPath(), n.setFontSize(a.fontSize), n.setFillStyle(e.yAxis.fontColor || "#666666"), 
        i.forEach(function(t, e) {
            var i = d[e] ? d[e] : c;
            n.fillText(t, a.padding + a.yAxisTitleWidth, i + a.fontSize / 2);
        }), n.closePath(), n.stroke(), e.yAxis.title && drawYAxisTitle(e.yAxis.title, e, a, n);
    }
}

function drawLegend(t, o, r, s) {
    if (o.legend) {
        var e = calLegendData(t, o, r).legendList;
        e.forEach(function(t, e) {
            var i = 0;
            t.forEach(function(t) {
                t.name = t.name || "undefined", i += 15 + measureText(t.name) + 15;
            });
            var a = (o.width - i) / 2 + 5, n = o.height - r.padding - r.legendHeight + e * (r.fontSize + 8) + 5 + 8;
            s.setFontSize(r.fontSize), t.forEach(function(t) {
                switch (o.type) {
                  case "line":
                    s.beginPath(), s.setLineWidth(1), s.setStrokeStyle(t.color), s.moveTo(a - 2, n + 5), 
                    s.lineTo(a + 17, n + 5), s.stroke(), s.closePath(), s.beginPath(), s.setLineWidth(1), 
                    s.setStrokeStyle("#ffffff"), s.setFillStyle(t.color), s.moveTo(a + 7.5, n + 5), 
                    s.arc(a + 7.5, n + 5, 4, 0, 2 * Math.PI), s.fill(), s.stroke(), s.closePath();
                    break;

                  case "pie":
                  case "ring":
                    s.beginPath(), s.setFillStyle(t.color), s.moveTo(a + 7.5, n + 5), s.arc(a + 7.5, n + 5, 7, 0, 2 * Math.PI), 
                    s.closePath(), s.fill();
                    break;

                  default:
                    s.beginPath(), s.setFillStyle(t.color), s.moveTo(a, n), s.rect(a, n, 15, 10), s.closePath(), 
                    s.fill();
                }
                a += 20, s.beginPath(), s.setFillStyle(o.extra.legendTextColor || "#333333"), s.fillText(t.name, a, n + 9), 
                s.closePath(), s.stroke(), a += measureText(t.name) + 10;
            });
        });
    }
}

function drawPieDataPoints(t, e, i, a) {
    var n = 4 < arguments.length && void 0 !== arguments[4] ? arguments[4] : 1, o = e.extra.pie || {};
    t = getPieDataPoints(t, n);
    var r = {
        x: e.width / 2,
        y: (e.height - i.legendHeight) / 2
    }, s = Math.min(r.x - i.pieChartLinePadding - i.pieChartTextPadding - i._pieTextMaxLength_, r.y - i.pieChartLinePadding - i.pieChartTextPadding);
    if (e.dataLabel ? s -= 10 : s -= 2 * i.padding, (t = t.map(function(t) {
        return t._start_ += (o.offsetAngle || 0) * Math.PI / 180, t;
    })).forEach(function(t) {
        a.beginPath(), a.setLineWidth(2), a.setStrokeStyle("#ffffff"), a.setFillStyle(t.color), 
        a.moveTo(r.x, r.y), a.arc(r.x, r.y, s, t._start_, t._start_ + 2 * t._proportion_ * Math.PI), 
        a.closePath(), a.fill(), !0 !== e.disablePieStroke && a.stroke();
    }), "ring" === e.type) {
        var l = .6 * s;
        "number" == typeof e.extra.ringWidth && 0 < e.extra.ringWidth && (l = Math.max(0, s - e.extra.ringWidth)), 
        a.beginPath(), a.setFillStyle(e.background || "#ffffff"), a.moveTo(r.x, r.y), a.arc(r.x, r.y, l, 0, 2 * Math.PI), 
        a.closePath(), a.fill();
    }
    if (!1 !== e.dataLabel && 1 === n) {
        for (var h = !1, c = 0, d = t.length; c < d; c++) if (0 < t[c].data) {
            h = !0;
            break;
        }
        h && drawPieText(t, e, i, a, s, r);
    }
    return 1 === n && "ring" === e.type && drawRingTitle(e, i, a), {
        center: r,
        radius: s,
        series: t
    };
}

function drawRadarDataPoints(t, a, o, r) {
    var e = 4 < arguments.length && void 0 !== arguments[4] ? arguments[4] : 1, i = a.extra.radar || {}, s = getRadarCoordinateSeries(a.categories.length), l = {
        x: a.width / 2,
        y: (a.height - o.legendHeight) / 2
    }, h = Math.min(l.x - (getMaxTextListLength(a.categories) + o.radarLabelTextMargin), l.y - o.radarLabelTextMargin);
    h -= o.padding, r.beginPath(), r.setLineWidth(1), r.setStrokeStyle(i.gridColor || "#cccccc"), 
    s.forEach(function(t) {
        var e = convertCoordinateOrigin(h * Math.cos(t), h * Math.sin(t), l);
        r.moveTo(l.x, l.y), r.lineTo(e.x, e.y);
    }), r.stroke(), r.closePath();
    for (var n = function(a) {
        var n = {};
        r.beginPath(), r.setLineWidth(1), r.setStrokeStyle(i.gridColor || "#cccccc"), s.forEach(function(t, e) {
            var i = convertCoordinateOrigin(h / o.radarGridCount * a * Math.cos(t), h / o.radarGridCount * a * Math.sin(t), l);
            0 === e ? (n = i, r.moveTo(i.x, i.y)) : r.lineTo(i.x, i.y);
        }), r.lineTo(n.x, n.y), r.stroke(), r.closePath();
    }, c = 1; c <= o.radarGridCount; c++) n(c);
    return getRadarDataPoints(s, l, h, t, a, e).forEach(function(t, e) {
        if (r.beginPath(), r.setFillStyle(t.color), r.setGlobalAlpha(.6), t.data.forEach(function(t, e) {
            0 === e ? r.moveTo(t.position.x, t.position.y) : r.lineTo(t.position.x, t.position.y);
        }), r.closePath(), r.fill(), r.setGlobalAlpha(1), !1 !== a.dataPointShape) {
            var i = o.dataPointShape[e % o.dataPointShape.length];
            drawPointShape(t.data.map(function(t) {
                return t.position;
            }), t.color, i, r);
        }
    }), drawRadarLabel(s, h, l, a, o, r), {
        center: l,
        radius: h,
        angleList: s
    };
}

function drawCanvas(t, e) {
    e.draw();
}

var Timing = {
    easeIn: function(t) {
        return Math.pow(t, 3);
    },
    easeOut: function(t) {
        return Math.pow(t - 1, 3) + 1;
    },
    easeInOut: function(t) {
        return (t /= .5) < 1 ? .5 * Math.pow(t, 3) : .5 * (Math.pow(t - 2, 3) + 2);
    },
    linear: function(t) {
        return t;
    }
};

function Animation(i) {
    this.isStop = !1, i.duration = void 0 === i.duration ? 1e3 : i.duration, i.timing = i.timing || "linear";
    var a = "undefined" != typeof requestAnimationFrame ? requestAnimationFrame : "undefined" != typeof setTimeout ? function(e, t) {
        setTimeout(function() {
            var t = +new Date();
            e(t);
        }, t);
    } : function(t) {
        t(null);
    }, n = null, o = function(t) {
        if (null === t || !0 === this.isStop) return i.onProcess && i.onProcess(1), void (i.onAnimationFinish && i.onAnimationFinish());
        if (null === n && (n = t), t - n < i.duration) {
            var e = (t - n) / i.duration;
            e = (0, Timing[i.timing])(e), i.onProcess && i.onProcess(e), a(o, 17);
        } else i.onProcess && i.onProcess(1), i.onAnimationFinish && i.onAnimationFinish();
    };
    o = o.bind(this), a(o, 17);
}

function drawCharts(t, o, r, s) {
    var l = this, h = o.series, c = o.categories, e = calLegendData(h = fillSeriesColor(h, r), o, r).legendHeight;
    r.legendHeight = e;
    var i = calYAxisData(h, o, r).yAxisWidth;
    if (r.yAxisWidth = i, c && c.length) {
        var a = calCategoriesData(c, o, r), n = a.xAxisHeight, d = a.angle;
        r.xAxisHeight = n, r._xAxisTextAngle_ = d;
    }
    "pie" !== t && "ring" !== t || (r._pieTextMaxLength_ = !1 === o.dataLabel ? 0 : getPieTextMaxLength(h));
    var x = o.animation ? 1e3 : 0;
    switch (this.animationInstance && this.animationInstance.stop(), t) {
      case "line":
        this.animationInstance = new Animation({
            timing: "easeIn",
            duration: x,
            onProcess: function(t) {
                drawYAxisGrid(o, r, s);
                var e = drawLineDataPoints(h, o, r, s, t), i = e.xAxisPoints, a = e.calPoints, n = e.eachSpacing;
                l.chartData.xAxisPoints = i, l.chartData.calPoints = a, l.chartData.eachSpacing = n, 
                drawXAxis(c, o, r, s), drawLegend(o.series, o, r, s), drawYAxis(h, o, r, s), drawToolTipBridge(o, r, s, t), 
                drawCanvas(o, s);
            },
            onAnimationFinish: function() {
                l.event.trigger("renderComplete");
            }
        });
        break;

      case "column":
        this.animationInstance = new Animation({
            timing: "easeIn",
            duration: x,
            onProcess: function(t) {
                drawYAxisGrid(o, r, s);
                var e = drawColumnDataPoints(h, o, r, s, t), i = e.xAxisPoints, a = e.eachSpacing;
                l.chartData.xAxisPoints = i, l.chartData.eachSpacing = a, drawXAxis(c, o, r, s), 
                drawLegend(o.series, o, r, s), drawYAxis(h, o, r, s), drawCanvas(o, s);
            },
            onAnimationFinish: function() {
                l.event.trigger("renderComplete");
            }
        });
        break;

      case "area":
        this.animationInstance = new Animation({
            timing: "easeIn",
            duration: x,
            onProcess: function(t) {
                drawYAxisGrid(o, r, s);
                var e = drawAreaDataPoints(h, o, r, s, t), i = e.xAxisPoints, a = e.calPoints, n = e.eachSpacing;
                l.chartData.xAxisPoints = i, l.chartData.calPoints = a, l.chartData.eachSpacing = n, 
                drawXAxis(c, o, r, s), drawLegend(o.series, o, r, s), drawYAxis(h, o, r, s), drawToolTipBridge(o, r, s, t), 
                drawCanvas(o, s);
            },
            onAnimationFinish: function() {
                l.event.trigger("renderComplete");
            }
        });
        break;

      case "ring":
      case "pie":
        this.animationInstance = new Animation({
            timing: "easeInOut",
            duration: x,
            onProcess: function(t) {
                l.chartData.pieData = drawPieDataPoints(h, o, r, s, t), drawLegend(o.series, o, r, s), 
                drawCanvas(o, s);
            },
            onAnimationFinish: function() {
                l.event.trigger("renderComplete");
            }
        });
        break;

      case "radar":
        this.animationInstance = new Animation({
            timing: "easeInOut",
            duration: x,
            onProcess: function(t) {
                l.chartData.radarData = drawRadarDataPoints(h, o, r, s, t), drawLegend(o.series, o, r, s), 
                drawCanvas(o, s);
            },
            onAnimationFinish: function() {
                l.event.trigger("renderComplete");
            }
        });
    }
}

function Event() {
    this.events = {};
}

Animation.prototype.stop = function() {
    this.isStop = !0;
}, Event.prototype.addEventListener = function(t, e) {
    this.events[t] = this.events[t] || [], this.events[t].push(e);
}, Event.prototype.trigger = function() {
    for (var t = arguments.length, e = Array(t), i = 0; i < t; i++) e[i] = arguments[i];
    var a = e[0], n = e.slice(1);
    this.events[a] && this.events[a].forEach(function(t) {
        try {
            t.apply(null, n);
        } catch (t) {
            console.error(t);
        }
    });
};

var Charts = function(t) {
    t.title = t.title || {}, t.subtitle = t.subtitle || {}, t.yAxis = t.yAxis || {}, 
    t.xAxis = t.xAxis || {}, t.extra = t.extra || {}, t.legend = !1 !== t.legend, t.animation = !1 !== t.animation;
    var e = assign({}, config);
    e.yAxisTitleWidth = !0 !== t.yAxis.disabled && t.yAxis.title ? e.yAxisTitleWidth : 0, 
    e.pieChartLinePadding = !1 === t.dataLabel ? 0 : e.pieChartLinePadding, e.pieChartTextPadding = !1 === t.dataLabel ? 0 : e.pieChartTextPadding, 
    this.opts = t, this.config = e, this.context = wx.createCanvasContext(t.canvasId), 
    this.chartData = {}, this.event = new Event(), this.scrollOption = {
        currentOffset: 0,
        startTouchX: 0,
        distance: 0
    }, drawCharts.call(this, t.type, t, e, this.context);
};

Charts.prototype.updateData = function() {
    var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {};
    this.opts.series = t.series || this.opts.series, this.opts.categories = t.categories || this.opts.categories, 
    this.opts.title = assign({}, this.opts.title, t.title || {}), this.opts.subtitle = assign({}, this.opts.subtitle, t.subtitle || {}), 
    drawCharts.call(this, this.opts.type, this.opts, this.config, this.context);
}, Charts.prototype.stopAnimation = function() {
    this.animationInstance && this.animationInstance.stop();
}, Charts.prototype.addEventListener = function(t, e) {
    this.event.addEventListener(t, e);
}, Charts.prototype.getCurrentDataIndex = function(t) {
    var e = t.touches && t.touches.length ? t.touches : t.changedTouches;
    if (e && e.length) {
        var i = e[0], a = i.x, n = i.y;
        return "pie" === this.opts.type || "ring" === this.opts.type ? findPieChartCurrentIndex({
            x: a,
            y: n
        }, this.chartData.pieData) : "radar" === this.opts.type ? findRadarChartCurrentIndex({
            x: a,
            y: n
        }, this.chartData.radarData, this.opts.categories.length) : findCurrentIndex({
            x: a,
            y: n
        }, this.chartData.xAxisPoints, this.opts, this.config, Math.abs(this.scrollOption.currentOffset));
    }
    return -1;
}, Charts.prototype.showToolTip = function(t) {
    var e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {};
    if ("line" === this.opts.type || "area" === this.opts.type) {
        var i = this.getCurrentDataIndex(t), a = this.scrollOption.currentOffset, n = assign({}, this.opts, {
            _scrollDistance_: a,
            animation: !1
        });
        if (-1 < i) {
            var o = getSeriesDataItem(this.opts.series, i);
            if (0 === o.length) drawCharts.call(this, n.type, n, this.config, this.context); else {
                var r = getToolTipData(o, this.chartData.calPoints, i, this.opts.categories, e), s = r.textList, l = r.offset;
                n.tooltip = {
                    textList: s,
                    offset: l,
                    option: e
                }, drawCharts.call(this, n.type, n, this.config, this.context);
            }
        } else drawCharts.call(this, n.type, n, this.config, this.context);
    }
}, Charts.prototype.scrollStart = function(t) {
    t.touches[0] && !0 === this.opts.enableScroll && (this.scrollOption.startTouchX = t.touches[0].x);
}, Charts.prototype.scroll = function(t) {
    if (t.touches[0] && !0 === this.opts.enableScroll) {
        var e = t.touches[0].x - this.scrollOption.startTouchX, i = this.scrollOption.currentOffset, a = calValidDistance(i + e, this.chartData, this.config, this.opts);
        this.scrollOption.distance = e = a - i;
        var n = assign({}, this.opts, {
            _scrollDistance_: i + e,
            animation: !1
        });
        drawCharts.call(this, n.type, n, this.config, this.context);
    }
}, Charts.prototype.scrollEnd = function(t) {
    if (!0 === this.opts.enableScroll) {
        var e = this.scrollOption, i = e.currentOffset, a = e.distance;
        this.scrollOption.currentOffset = i + a, this.scrollOption.distance = 0;
    }
}, module.exports = Charts;