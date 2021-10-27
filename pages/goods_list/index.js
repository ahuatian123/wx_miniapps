import {
  request
} from "../../request/index.js"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        id: 0,
        value: '综合',
        isActive: true
      },
      {
        id: 1,
        value: '销量',
        isActive: false
      },
      {
        id: 2,
        value: '价格',
        isActive: false
      }
    ],
    goodsList: []
  },
  // 接口要的参数
  QueryParams: {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10
  },
  // 总页数
  totalPages: 1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid
    this.getGoodsList()
  },
  // 监听下拉刷新
  onPullDownRefresh() {
    // 1.重置数组
    this.setData({
      goodsList: []
    })
    // 2.重置页码
    this.QueryParams.pagenum = 1
    // 3.重新发送请求
    this.getGoodsList()
  },

  // 处理点击事件
  handleTabsItemChange(e) {
    // 获取点击的索引
    const {
      index
    } = e.detail
    // 修改源数组
    let {
      tabs
    } = this.data
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    // 赋值到data
    this.setData({
      tabs
    })
  },

  //获取商品列表
  async getGoodsList() {
    const res = await request({
      url: '/goods/search',
      data: this.QueryParams
    })
    // 获取 总条数
    const total = res.total
    // 计算 总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize)
    const goodsList = [...this.data.goodsList, ...res.goods]
    this.setData({
      goodsList
    })
    wx.stopPullDownRefresh() // 刷新数据后关闭刷新窗口
  },
  // 页面上滑，滚动条触底事件
  onReachBottom() {
    // 判断是否最后一页
    if (this.totalPages <= this.QueryParams.pagenum) {
      // console.log("已经最后一页");
      wx.showToast({
        title: '没有下一页数据'
      })
      return;
    }
    // 不是最后一页
    this.QueryParams.pagenum++
    // 继续请求
    this.getGoodsList()
  }
})