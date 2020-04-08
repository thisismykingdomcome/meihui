var app = getApp();

Page({
    data: {
        themeColor: "#f44",
        backgroundColor: "#ffffff",
        requestNeed: 0,
        requestDone: 0,
        member: {},
        levelText: "无等级",
        levelIndex: 0,
        levelList: [],
        genderText: "请选择",
        genderActionsShow: !1,
        genderActions: [ {
            value: 0,
            name: "保密"
        }, {
            value: 1,
            name: "男"
        }, {
            value: 2,
            name: "女"
        } ],
        educationActionsShow: !1,
        educationActions: [ {
            name: "博士"
        }, {
            name: "硕士"
        }, {
            name: "本科"
        }, {
            name: "专科"
        }, {
            name: "中学"
        }, {
            name: "小学"
        }, {
            name: "其它"
        } ],
        educationIndex: 0,
        educationList: [ "博士", "硕士", "本科", "专科", "中学", "小学", "其它" ],
        constellationIndex: 0,
        constellationList: [ "水瓶座", "双鱼座", "白羊座", "金牛座", "双子座", "巨蟹座", "狮子座", "处女座", "天秤座", "天蝎座", "射手座", "摩羯座" ],
        zodiacIndex: 0,
        zodiacList: [ "鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪" ],
        bloodtypeList: [ "A", "B", "AB", "O", "其他" ],
        birthdayPopupShow: !1,
        minDate: new Date(1800, 1, 1).getTime(),
        currentDate: new Date().getTime()
    },
    onLoad: function(e) {
        var d = this;
        wx.getStorageSync("userInfo") ? (app.util.showLoading(), d.data.requestNeed = 4, 
        app.util.request({
            url: "entry/wxapp/manage-member",
            showLoading: !1,
            data: {
                m: "zxsite_shop",
                op: "get",
                uid: e.uid
            },
            success: function(e) {
                var i = e.data.data;
                switch (parseInt(i.gender)) {
                  case 0:
                    d.data.genderText = "保密";
                    break;

                  case 1:
                    d.data.genderText = "男";
                    break;

                  case 2:
                    d.data.genderText = "女";
                }
                app.util.request({
                    url: "entry/wxapp/manage-level",
                    showLoading: !1,
                    data: {
                        m: "zxsite_shop",
                        op: "all"
                    },
                    success: function(e) {
                        for (var t = 0, a = e.data.data.length; t < a; ++t) if (i.level_id == e.data.data[t].id) {
                            d.data.levelIndex = t, d.data.levelText = e.data.data[t].name;
                            break;
                        }
                        d.setData({
                            member: i,
                            levelText: d.data.levelText,
                            levelIndex: d.data.levelIndex,
                            genderText: d.data.genderText,
                            levelList: e.data.data
                        }), setTimeout(function() {
                            wx.hideLoading();
                        }, 1e3);
                    }
                });
            }
        })) : wx.redirectTo({
            url: "/zxsite_shop/start/start?url=/packages/manage/member/edit&type=redirect&uid=" + e.uid
        });
    },
    onFieldChange: function(e) {
        "nickname" == e.currentTarget.id ? this.data.member.nickname = e.detail : "realname" == e.currentTarget.id ? this.data.member.realname = e.detail : "address" == e.currentTarget.id ? this.data.member.address = e.detail : "mobile" == e.currentTarget.id ? this.data.member.mobile = e.detail : "qq" == e.currentTarget.id ? this.data.member.qq = e.detail : "email" == e.currentTarget.id ? this.data.member.email = e.detail : "telephone" == e.currentTarget.id ? this.data.member.telephone = e.detail : "msn" == e.currentTarget.id ? this.data.member.msn = e.detail : "taobao" == e.currentTarget.id ? this.data.member.taobao = e.detail : "alipay" == e.currentTarget.id ? this.data.member.alipay = e.detail : "studentid" == e.currentTarget.id ? this.data.member.studentid = e.detail : "grade" == e.currentTarget.id ? this.data.member.grade = e.detail : "graduateschool" == e.currentTarget.id ? this.data.member.graduateschool = e.detail : "company" == e.currentTarget.id ? this.data.member.company = e.detail : "occupation" == e.currentTarget.id ? this.data.member.occupation = e.detail : "position" == e.currentTarget.id ? this.data.member.position = e.detail : "revenue" == e.currentTarget.id ? this.data.member.revenue = e.detail : "nationality" == e.currentTarget.id ? this.data.member.nationality = e.detail : "height" == e.currentTarget.id ? this.data.member.height = e.detail : "weight" == e.currentTarget.id ? this.data.member.weight = e.detail : "idcard" == e.currentTarget.id ? this.data.member.idcard = e.detail : "zipcode" == e.currentTarget.id ? this.data.member.zipcode = e.detail : "site" == e.currentTarget.id ? this.data.member.site = e.detail : "affectivestatus" == e.currentTarget.id ? this.data.member.affectivestatus = e.detail : "bio" == e.currentTarget.id ? this.data.member.bio = e.detail : "interest" == e.currentTarget.id && (this.data.member.interest = e.detail);
    },
    onLevelPickerChange: function(e) {
        this.data.member.level_id = this.data.levelList[e.detail.value].id, this.setData({
            levelIndex: e.detail.value,
            levelText: this.data.levelList[e.detail.value].name,
            member: this.data.member
        });
    },
    onGenderClick: function(e) {
        this.setData({
            genderActionsShow: !0
        });
    },
    onGenderActionsSelect: function(e) {
        switch (this.data.member.gender = e.detail.value, e.detail.value) {
          case 0:
            this.data.genderText = "保密";
            break;

          case 1:
            this.data.genderText = "男";
            break;

          case 2:
            this.data.genderText = "女";
        }
        this.setData({
            genderActionsShow: !1,
            member: this.data.member,
            genderText: this.data.genderText
        });
    },
    onGenderActionsCancel: function(e) {
        this.setData({
            genderActionsShow: !1
        });
    },
    onBirthdayClick: function(e) {
        this.setData({
            birthdayPopupShow: !0
        });
    },
    onBirthdayConfirm: function(e) {
        var t = new Date(e.detail);
        this.data.member.birthday = t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate(), 
        this.setData({
            birthdayPopupShow: !1,
            member: this.data.member
        });
    },
    onBirthdayCancel: function(e) {
        this.setData({
            birthdayPopupShow: !1
        });
    },
    onEducationPickerChange: function(e) {
        this.data.member.education = this.data.educationList[e.detail.value], this.setData({
            educationIndex: e.detail.value,
            member: this.data.member
        });
    },
    onConstellationPickerChange: function(e) {
        this.data.member.constellation = this.data.constellationList[e.detail.value], this.setData({
            constellationIndex: e.detail.value,
            member: this.data.member
        });
    },
    onZodiacPickerChange: function(e) {
        this.data.member.zodiac = this.data.zodiacList[e.detail.value], this.setData({
            zodiacIndex: e.detail.value,
            member: this.data.member
        });
    },
    onBloodtypePickerChange: function(e) {
        this.data.member.bloodtype = this.data.bloodtypeList[e.detail.value], this.setData({
            bloodtypeIndex: e.detail.value,
            member: this.data.member
        });
    },
    onSave: function(e) {
        app.util.request({
            url: "entry/wxapp/manage-member",
            data: Object.assign({
                m: "zxsite_shop",
                op: "save"
            }, this.data.member),
            method: "POST",
            success: function(e) {
                var t = getCurrentPages();
                t[t.length - 2].onRefreshData(), wx.showToast({
                    title: e.data.message,
                    icon: "none",
                    duration: 2e3
                });
            }
        });
    }
});