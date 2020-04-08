var app = getApp(), common = require("../../utils/common.js"), util = require("../../utils/util.js");

Page({
    data: {
        //数据
        arr: [],
        //存放每个div的top
        arrTop: [],
   
        //位移到哪个子元素
        toView: "demo0",
        scrollTop: 0,
        //当前active的下标
        globalIndex: 0,
        id: ''
    },
    onLoad: function() {
      var _this = this;
      //自定义的tabbar
      common.getSettings(function (o) {
        common.setCustomNavigationBar(o), common.setCustomTabBar(_this, o), _this.setData({
          themeColor: o.theme_color ? o.theme_color : "#f44"
        })
      });
      //获取数据
      wx.request({
        url: 'http://mh9.cc/mapi/list?m=mhclass&c=all', 
        method: 'get',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          var data = res.data.data
          
          var parentArr = [];
         
          var id;
        
          for(var i = 0, len = data.length; i < len; i++){
            if(data[i].parent_id == "1"){
              parentArr.push(data[i])
            }
          }
          for (var j = 0, jlen = parentArr.length; j < jlen; j++){
            id = parentArr[j].id
            parentArr[j].children = []
            for (var z = 0, zlen = data.length; z < zlen; z++){
              if (data[z].parent_id == id){
                parentArr[j].children.push(data[z])
              }
            }
          }
          console.log(parentArr)
          _this.setData({
            arr: parentArr
          },function(){
            //获取到总分类后，再获取节点，防止一开始没有数据导致没有节点，而让滚动出错
            var query = wx.createSelectorQuery();
            query.selectAll('.rightSub').boundingClientRect()
            query.selectViewport().scrollOffset()
            query.exec(function (res) {
              console.log(res);

              if (res.length > 0) {
                var data = res[0];
                var arr1 = []
                //记录每个div的top值
                for (var i = 0, len = data.length; i < len; i++) {
                  arr1.push(data[i].top)
                }
                console.log('arr1====')
                console.log(arr1)

                _this.setData({
                  arrTop: arr1
                })
              }
            })
          })
          
        }
      })
      
    },
    onShow: function() {
      console.log(this)
      var _this = this
      
     
    },
    scroll(e) {
     
      if (this.data.arrTop.length == 0) return;
      //scroll-view的top值
      var top = e.detail.scrollTop;
      var arrTop = this.data.arrTop;
      console.log('top==='+top)
      
      var globalIndex = this.data.globalIndex
      for (var i = 0, len = arrTop.length; i < len; i++){
        if(i != len-1){
          if (top >= arrTop[i] && top < arrTop[i + 1] && i != globalIndex){
            this.setData({
              globalIndex: i
            })
            len = 0;
          }
        }else{
          if(top >= arrTop[len - 1] && i != globalIndex){
            this.setData({
              globalIndex: i
            })
          }
        }
        
      }
    },
    tapLeftNav(e) {
      console.log(e)
      //如果arrtop
      if(this.data.arrTop.length == 0) return;
      var index = e.currentTarget.dataset.index;
      var id = e.currentTarget.dataset.index
      this.setData({
        toView: "demo" + index,
        globalIndex: index,
        id: id
      })
    }
});