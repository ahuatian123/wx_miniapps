import {
  request
} from "../../request/index.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    tabs: [{
        id: 0,
        value: '全部',
        isActive: true
      },
      {
        id: 1,
        value: '待付款',
        isActive: false
      },
      {
        id: 2,
        value: '待发货',
        isActive: false
      },
      {
        id: 3,
        value: '退款/退货',
        isActive: false
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    const token = wx.getStorageSync('token')
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index',
      })
      return;
    }
    // 1.获取当前的小程序的页面栈
    let pages = getCurrentPages()
    // 2.数组索引最大的页面就是当前页面
    let {
      options
    } = pages[pages.length - 1]
    const {
      type
    } = options
    // 3 激活选中的页面标题
    this.changeTitleByIndex(type - 1)
    this.getOrders(type)
  },
  // 获取订单列表的方法
  async getOrders(type) {
    const res = await request({
      url: '/my/orders/all',
      data: {
        type
      }
    })
    this.setData({
      orders: res.orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
    })
  },
  // 根据标题索引修改源数组
  changeTitleByIndex(index) {
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
  // 处理点击事件
  handleTabsItemChange(e) {
    // 1 获取点击的索引
    const {
      index
    } = e.detail
    this.changeTitleByIndex(index)
    // 2 重新发送请求 type=1 index=0
    this.getOrders(index + 1)
  },
})