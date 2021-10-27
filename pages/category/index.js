// import regeneratorRuntime from "../../lib/runtime/runtime.js";
import {
  request
} from "../../request/index.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //左侧菜单数据
    leftMenuList: [],
    //右侧商品数据
    rightContent: [],
    //被点击的索引
    currentIndex: 0,
    //右侧列表初始位置
    scrollTop: 0
  },
  //接口的返回数据
  Cates: [],

  // 初始化分类数据
  // getCates() {
  //   request({
  //     url: '/categories'
  //   }).then(res => {
  //     this.Cates = res.data.message
  //     wx.setStorageSync('Cates', {
  //       time: Date.now(),
  //       data: this.Cates
  //     })
  //     let leftMenuList = this.Cates.map(v => v.cat_name)
  //     let rightContent = this.Cates[0].children

  //     this.setData({
  //       leftMenuList,
  //       rightContent
  //     })
  //   })
  // },

  async getCates() {
    // 使用es7 的async await来发送请求
    const res = await request({
      url: '/categories'
    })

    this.Cates = res
    wx.setStorageSync('Cates', {
      time: Date.now(),
      data: this.Cates
    })
    let leftMenuList = this.Cates.map(v => v.cat_name)
    let rightContent = this.Cates[0].children

    this.setData({
      leftMenuList,
      rightContent
    })
  },

  // 绑定点击事件
  handleItemTap(e) {
    // 获取索引
    const {
      index
    } = e.currentTarget.dataset

    // 根据索引显示右侧内容
    let rightContent = this.Cates[index].children
    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop: 0
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 判断是否已存在缓存数据
    const Cates = wx.getStorageSync('Cates')
    if (!Cates) {
      // 获取分类数据
      this.getCates()
    } else {
      // 判断是否超时
      if ((Date.now() - Cates.time) > 1000 * 10) {
        this.getCates()
      } else {
        this.Cates = Cates.data
        let leftMenuList = this.Cates.map(v => v.cat_name)
        let rightContent = this.Cates[0].children

        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },
})