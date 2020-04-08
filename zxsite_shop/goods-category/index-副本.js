var app = getApp(), common = require("../../utils/common.js"), util = require("../../utils/util.js");

Page({
  data: {
    childCategories: [],
    scrollTop: "0",
    loadingMoreHidden: !0,
    categories: [],
    activeCategoryId: 0,
    categoryLevel: 1,
    categoryStyle: 1,
    goods: [],
    page: "1",
    total: 1
  },
  onLoad: function () {
    var i = this;
    common.getSettings(function (o) {
      common.setCustomNavigationBar(o), common.setCustomTabBar(i, o), i.setData({
        themeColor: o.theme_color ? o.theme_color : "#f44"
      }), app.util.request({
        url: "entry/wxapp/category",
        cachetime: "30",
        success: function (t) {
          if (2 == (o ? o.category_level : 1)) {
            for (var a = [{
              id: 0,
              name: "全部"
            }], e = 0; e < t.data.data.categories.length; e++) a.push(t.data.data.categories[e]);
            i.setData({
              categories: a,
              activeCategoryId: 0,
              categoryLevel: 2
            }), i.getChildProperties("");
          } else {
            2 == o.category_style ? (i.setData({
              childCategories: t.data.data.categories,
              activeCategoryId: t.data.data.categories[0].id,
              categoryStyle: 2
            }), i.getGoodsList()) : i.setData({
              childCategories: t.data.data.categories
            });
          }
        }
      });
    });
  },
  getChildProperties: function (t) {
    var a = "", e = 0;
    t && (a = t.currentTarget.dataset.id, e = t.currentTarget.dataset.index);
    var o = this;
    app.util.request({
      url: "entry/wxapp/category-child",
      data: {
        pid: a
      },
      cachetime: "30",
      success: function (t) {
        o.setData({
          childCategories: t.data.data,
          activeCategoryId: e
        });
      }
    });
  },
  toGoodsListTap: function (t) {
    wx.navigateTo({
      url: "/zxsite_shop/goods-list/index?category_id=" + t.currentTarget.dataset.id
    });
  },
  toDetailsTap: function (t) {
    wx.navigateTo({
      url: "/zxsite_shop/goods-details/index?id=" + t.currentTarget.dataset.id
    });
  },
  getGoodsList: function (t) {
    var e = this, o = this.data.goods, i = t ? t.currentTarget.dataset.id : e.data.activeCategoryId, s = i == e.data.activeCategoryId ? this.data.page : 1;
    s <= this.data.total || i != e.data.activeCategoryId ? app.util.request({
      url: "entry/wxapp/goods-list",
      data: {
        page: s,
        category_id: i
      },
      success: function (t) {
        var a = t.data.data.goods;
        o = 1 < s ? o.concat(a) : a, s == this.data.total && (this.data.loadingMoreHidden = !1),
          e.setData({
            goods: o,
            page: parseInt(s) + 1,
            total: t.data.data.total,
            activeCategoryId: i
          });
      }
    }) : e.setData({
      loadingMoreHidden: !1
    });
  },
  onReachBottom: function () {
    this.getGoodsList(this.data.searchInput, this.data.searchType, this.data.priceOrder);
  }
});