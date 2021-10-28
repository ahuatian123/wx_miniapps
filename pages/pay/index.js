import {
  showModel,
  showToast,
  requestPayment
} from '../../utils/asyncWx.js'

import {
  request
} from '../../request/index.js'

Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    //1.获取缓存中的收获地址
    let address = wx.getStorageSync('address') || {}
    address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo
    //2.获取缓存中的购物车数据
    const cart = wx.getStorageSync('cart') || []
    // 过滤后的购物车数组
    let newcart = cart.filter(v => v.checked)
    //3.计算金额和总数
    this.setCart(newcart)
    //4.给data赋值
    this.setData({
      address,
    })
  },
  // 点击 支付
  async handleOrderPay() {
    try {
      // 1 判断缓存中有没有token
      const token = wx.getStorageSync('token')
      // 2 判断
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index',
        })
        return;
      }
      console.log("已经存在token");
      // 3 创建订单
      // 3.1 请求头
      // 3.2 请求体参数
      const order_price = this.data.totalPrice
      const consignee_addr = this.data.address
      const cart = this.data.cart
      let goods = []
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }))

      // 4 准备发送请求
      const oldParams = {
        order_price,
        consignee_addr,
        goods
      }
      const {
        order_number
      } = await request({
        url: '/my/orders/create',
        method: 'POST',
        data: oldParams,
      })
      // 5 发起预支付接口
      const {
        pay
      } = await request({
        url: '/my/orders/req_unifiedorder',
        method: 'POST',
        data: {
          order_number
        }
      })

      // 6 发起微信支付
      await requestPayment(pay)

      // 7 查询后台 订单状态
      await request({
        url: '/my/orders/create',
        method: 'POST',
        data: {
          order_number
        }
      })
      // 8 手动删除缓存 已经支付了的商品
      let newCart = wx.getStorageSync("cart")
      newCart = newCart.filter(v => !v.checked)
      wx.setStorageSync('cart', newCart)
      // 9 成功提示 并跳转
      await showToast({
        title: '支付成功'
      })
      wx.navigateTo({
        url: '/pages/order/index',
      })
    } catch (error) {
      await showToast({
        title: '支付失败'
      })
      wx.navigateTo({
        url: '/pages/order/index',
      })
    }
  },
  // 点击勾选框重新结算和数量统计
  setCart(cart) {
    // 6.计算价格
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(v => {
      totalPrice += v.goods_price * v.num
      totalNum += v.num
    })

    // 8.给data赋值
    this.setData({
      cart,
      totalPrice,
      totalNum
    })
  }
})