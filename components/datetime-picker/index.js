var _component = require("../common/component");

function _defineProperty(e, t, n) {
    return t in e ? Object.defineProperty(e, t, {
        value: n,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = n, e;
}

var currentYear = new Date().getFullYear(), isValidDate = function(e) {
    return !isNaN(new Date(e).getTime());
};

function range(e, t, n) {
    return Math.min(Math.max(e, t), n);
}

(0, _component.VantComponent)({
    props: {
        value: null,
        title: String,
        loading: Boolean,
        itemHeight: {
            type: Number,
            value: 44
        },
        visibleItemCount: {
            type: Number,
            value: 5
        },
        confirmButtonText: {
            type: String,
            value: "确认"
        },
        cancelButtonText: {
            type: String,
            value: "取消"
        },
        type: {
            type: String,
            value: "datetime"
        },
        showToolbar: {
            type: Boolean,
            value: !0
        },
        minDate: {
            type: Number,
            value: new Date(currentYear - 10, 0, 1).getTime()
        },
        maxDate: {
            type: Number,
            value: new Date(currentYear + 10, 11, 31).getTime()
        },
        minHour: {
            type: Number,
            value: 0
        },
        maxHour: {
            type: Number,
            value: 23
        },
        minMinute: {
            type: Number,
            value: 0
        },
        maxMinute: {
            type: Number,
            value: 59
        }
    },
    data: {
        pickerValue: [],
        innerValue: Date.now()
    },
    computed: {
        columns: function() {
            var i = this;
            return this.getRanges().map(function(e) {
                var n = e.type, a = e.range;
                return i.times(a[1] - a[0] + 1, function(e) {
                    var t = a[0] + e;
                    return t = "year" === n ? "" + t : i.pad(t);
                });
            });
        }
    },
    watch: {
        value: function(e) {
            var t = this, n = this.data;
            (e = this.correctValue(e)) === n.innerValue || this.setData({
                innerValue: e
            }, function() {
                t.updateColumnValue(e), t.$emit("input", e);
            });
        }
    },
    methods: {
        getRanges: function() {
            var e = this.data;
            if ("time" === e.type) return [ {
                type: "hour",
                range: [ e.minHour, e.maxHour ]
            }, {
                type: "minute",
                range: [ e.minMinute, e.maxMinute ]
            } ];
            var t = this.getBoundary("max", e.innerValue), n = t.maxYear, a = t.maxDate, i = t.maxMonth, u = t.maxHour, r = t.maxMinute, o = this.getBoundary("min", e.innerValue), m = o.minYear, l = o.minDate, s = [ {
                type: "year",
                range: [ m, n ]
            }, {
                type: "month",
                range: [ o.minMonth, i ]
            }, {
                type: "day",
                range: [ l, a ]
            }, {
                type: "hour",
                range: [ o.minHour, u ]
            }, {
                type: "minute",
                range: [ o.minMinute, r ]
            } ];
            return "date" === e.type && s.splice(3, 2), "year-month" === e.type && s.splice(2, 3), 
            s;
        },
        pad: function(e) {
            return ("00" + e).slice(-2);
        },
        correctValue: function(e) {
            var t = this.data, n = this.pad, a = "time" !== t.type;
            if (a && !isValidDate(e)) e = t.minDate; else if (!a && !e) {
                e = n(t.minHour) + ":00";
            }
            if (!a) {
                var i = e.split(":"), u = i[0], r = i[1];
                return (u = n(range(u, t.minHour, t.maxHour))) + ":" + (r = n(range(r, t.minMinute, t.maxMinute)));
            }
            var o = this.getBoundary("max", e), m = o.maxYear, l = o.maxDate, s = o.maxMonth, c = o.maxHour, p = o.maxMinute, h = this.getBoundary("min", e), g = h.minYear, f = h.minDate, d = h.minMonth, y = h.minHour, v = h.minMinute, D = new Date(g, d - 1, f, y, v), V = new Date(m, s - 1, l, c, p);
            return e = Math.max(e, D.getTime()), e = Math.min(e, V.getTime());
        },
        times: function(e, t) {
            for (var n = -1, a = Array(e); ++n < e; ) a[n] = t(n);
            return a;
        },
        getBoundary: function(e, t) {
            var n, a = new Date(t), i = new Date(this.data[e + "Date"]), u = i.getFullYear(), r = 1, o = 1, m = 0, l = 0;
            return "max" === e && (r = 12, o = this.getMonthEndDay(a.getFullYear(), a.getMonth() + 1), 
            m = 23, l = 59), a.getFullYear() === u && (r = i.getMonth() + 1, a.getMonth() + 1 === r && (o = i.getDate(), 
            a.getDate() === o && (m = i.getHours(), a.getHours() === m && (l = i.getMinutes())))), 
            _defineProperty(n = {}, e + "Year", u), _defineProperty(n, e + "Month", r), _defineProperty(n, e + "Date", o), 
            _defineProperty(n, e + "Hour", m), _defineProperty(n, e + "Minute", l), n;
        },
        getTrueValue: function(e) {
            if (e) {
                for (;isNaN(parseInt(e, 10)); ) e = e.slice(1);
                return parseInt(e, 10);
            }
        },
        getMonthEndDay: function(e, t) {
            return 32 - new Date(e, t - 1, 32).getDate();
        },
        onCancel: function() {
            this.$emit("cancel");
        },
        onConfirm: function() {
            this.$emit("confirm", this.data.innerValue);
        },
        onChange: function(e) {
            var t, n = this, a = this.data, i = e.detail.value.map(function(e, t) {
                return a.columns[t][e];
            });
            if ("time" === a.type) t = i.join(":"); else {
                var u = this.getTrueValue(i[0]), r = this.getTrueValue(i[1]), o = this.getMonthEndDay(u, r), m = this.getTrueValue(i[2]);
                "year-month" === a.type && (m = 1), m = o < m ? o : m;
                var l = 0, s = 0;
                "datetime" === a.type && (l = this.getTrueValue(i[3]), s = this.getTrueValue(i[4])), 
                t = new Date(u, r - 1, m, l, s);
            }
            t = this.correctValue(t), this.setData({
                innerValue: t
            }, function() {
                n.updateColumnValue(t), n.$emit("input", t), n.$emit("change", n);
            });
        },
        getColumnValue: function(e) {
            return this.getValues()[e];
        },
        setColumnValue: function(e, t) {
            var n = this.data, a = n.pickerValue, i = n.columns;
            a[e] = i[e].indexOf(t), this.setData({
                pickerValue: a
            });
        },
        getColumnValues: function(e) {
            return this.data.columns[e];
        },
        setColumnValues: function(e, t) {
            var n = this.data.columns;
            n[e] = t, this.setData({
                columns: n
            });
        },
        getValues: function() {
            var e = this.data, t = e.pickerValue, n = e.columns;
            return t.map(function(e, t) {
                return n[t][e];
            });
        },
        setValues: function(e) {
            var n = this.data.columns;
            this.setData({
                pickerValue: e.map(function(e, t) {
                    return n[t].indexOf(e);
                })
            });
        },
        updateColumnValue: function(e) {
            var t = [], n = this.pad, a = this.data, i = a.columns;
            if ("time" === a.type) {
                var u = e.split(":");
                t = [ i[0].indexOf(u[0]), i[1].indexOf(u[1]) ];
            } else {
                var r = new Date(e);
                t = [ i[0].indexOf("" + r.getFullYear()), i[1].indexOf(n(r.getMonth() + 1)) ], "date" === a.type && t.push(i[2].indexOf(n(r.getDate()))), 
                "datetime" === a.type && t.push(i[2].indexOf(n(r.getDate())), i[3].indexOf(n(r.getHours())), i[4].indexOf(n(r.getMinutes())));
            }
            this.setData({
                pickerValue: t
            });
        }
    },
    created: function() {
        var e = this, t = this.correctValue(this.data.value);
        this.setData({
            innerValue: t
        }, function() {
            e.updateColumnValue(t), e.$emit("input", t);
        });
    }
});