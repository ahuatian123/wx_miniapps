import {
  request
} from "../../request/index.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数组
    swiperList: [],
    // 分类导航数组
    cateList: [],
    // 获取楼层数据
    floorList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //初始化轮播图数据
    this.getSwiperList()
    //初始化分类导航数据
    this.getCateList()
    //初始化楼层数据
    this.getFloorList()
  },

  //获取轮播图数据
  getSwiperList() {
    // 发送异步请求获取数据
    request({
      url: '/home/swiperdata'
    }).then(result => {
      this.setData({
        swiperList: result
      })
    })
  },
  //获取轮播图数据
  getCateList() {
    // 发送异步请求获取数据
    request({
      url: '/home/catitems'
    }).then(result => {
      this.setData({
        cateList: result
      })
    })
  },
  //获取轮播图数据
  getFloorList() {
    // 发送异步请求获取数据
    request({
      url: '/home/floordata'
    }).then(result => {
      // 修改navigator_url
      result.forEach(v => {
        v.product_list.forEach(v1 => {
          v1['navigator_url'] = v1['navigator_url'].replace('?', '/index?')
        })
      })
      this.setData({
        floorList: result
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})