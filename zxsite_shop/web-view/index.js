Page({
    data: {
        linkUrl: ""
    },
    onLoad: function(n) {
        this.setData({
            linkUrl: decodeURIComponent(n.linkUrl)
        });
    }
});