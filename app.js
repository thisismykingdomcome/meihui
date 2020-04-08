App({
    util: require("zxsite/resource/js/util.js"),
    siteInfo: require("siteinfo.js"),
    WxParse: require("/wxParse/wxParse.js"),
    utils: {
        util: require("utils/util.js"),
        common: require("utils/common.js"),
        wxCharts: require("utils/wxcharts.js")
    },
    tabBar: {
        color: "#6e6d6b",
        selectedColor: "#f44",
        borderStyle: "#fff",
        backgroundColor: "#fff",
        list: [ {
            pagePath: "/zxsite_shop/index/index",
            iconPath: "/images/nav/home-off.png",
            selectedIconPath: "/images/nav/home-on.png",
            text: "首页"
        }, {
            pagePath: "/zxsite_shop/goods-category/index",
            iconPath: "/images/nav/category-off.png",
            selectedIconPath: "/images/nav/category-on.png",
            text: "分类"
        }, {
            pagePath: "/zxsite_shop/shop-cart/index",
            iconPath: "/images/nav/cart-off.png",
            selectedIconPath: "/images/nav/cart-on.png",
            text: "购物车"
        }, {
            pagePath: "/zxsite_shop/my/index",
            iconPath: "/images/nav/my-off.png",
            selectedIconPath: "/images/nav/my-on.png",
            text: "我的"
        } ]
    }
});