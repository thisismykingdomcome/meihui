var _link = require("../mixins/link"), _component = require("../common/component");

(0, _component.VantComponent)({
    classes: [ "num-class", "desc-class", "thumb-class", "title-class", "price-class", "origin-price-class" ],
    mixins: [ _link.link ],
    props: {
        tag: String,
        num: String,
        desc: String,
        thumb: String,
        title: String,
        price: String,
        centered: Boolean,
        lazyLoad: Boolean,
        thumbLink: String,
        originPrice: String,
        thumbMode: {
            type: String,
            value: "scaleToFill"
        },
        currency: {
            type: String,
            value: "¥"
        }
    },
    methods: {
        onClickThumb: function() {
            this.jumpLink("thumbLink");
        }
    }
});