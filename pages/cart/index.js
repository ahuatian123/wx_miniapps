import {
  showModel,
  showToast
} from '../../utils/asyncWx.js'

Page({
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    //1.获取缓存中的收获地址
    let address = wx.getStorageSync('address') || {}
    address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo
    //2.获取缓存中的购物车数据
    const cart = wx.getStorageSync('cart') || []
    //3.计算金额和总数
    this.setCart(cart)
    //4.给data赋值
    this.setData({
      address,
    })
  },
  // 点击收货地址
  handleChooseAddress() {
    wx.chooseAddress({
      success: (result) => {
        // 存到缓存中
        wx.setStorageSync('address', result)
      },
    })
  },
  // 点击复选框
  handleItemChange(e) {
    // 1.获取被修改的商品id
    const goods_id = e.currentTarget.dataset.id
    // 2.获取购物车数组
    let {
      cart
    } = this.data
    // 3.找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id)
    cart[index].checked = !cart[index].checked
    // 4.数据修改
    this.setCart(cart)
    // 5.加入缓存
    wx.setStorageSync('cart', cart)
  },
  // 商品的全选功能
  handleItemAllCheck() {
    // 1 获取data数据
    let {
      cart,
      allChecked
    } = this.data
    // 2 修改值
    allChecked = !allChecked
    // 3 循环修改cart数组中的商品选中状态
    cart.forEach(v => v.checked = allChecked)
    // 4 修改后填入缓存或data
    this.setCart(cart)
  },
  // 商品数量的编辑功能
  async handleItemNumEdit(e) {
    // 1 获取传递过来的参数
    const {
      id,
      operation
    } = e.currentTarget.dataset
    // 2 获取购物车数组
    let {
      cart
    } = this.data
    // 3 找到需要修改的商品的索引
    const index = cart.findIndex(v => v.goods_id === id)
    // 4 判断是否要执行删除
    if (cart[index].num === 1 && operation === -1) {
      const res = await showModel({
        content: '是否删除该商品？'
      })
      if (res.confirm) {
        cart.splice(index, 1)
        this.setCart(cart)
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    } else {
      // 5 进行修改数量
      cart[index].num += operation
      // 6 设置回缓存和data中
      this.setCart(cart)
    }
  },
  // 点击 结算
  async handlePay() {
    // 1 判断收获地址
    const {
      address,
      totalNum
    } = this.data
    if (!address.userName) {
      await showToast({
        title: '您还没有选择收获地址'
      })
      return;
    }
    // 2 判断用户有没有选购商品
    if (totalNum === 0) {
      await showToast({
        title: '您还没有选择商品'
      })
      return;
    }
    // 3 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
    })
  },
  // 点击勾选框重新结算和数量统计
  setCart(cart) {
    // 5.计算全选
    let allChecked = true
    // 6.计算价格
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.goods_price * v.num
        totalNum += v.num
      } else {
        allChecked = false
      }
    })
    // 7.判断是否为空数组
    allChecked = cart.length != 0 ? allChecked : false
    // 8.给data赋值
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
    // 9.修改缓存
    wx.setStorageSync('cart', cart)
  }
})