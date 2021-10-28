import {
  request
} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    isCollect: false
  },
  GoodsInfo: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {
      goods_id
    } = options
    this.getGoodsDetail(goods_id)
  },
  //获取商品详情
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({
      url: '/goods/detail',
      data: {
        goods_id
      }
    })
    this.GoodsInfo = goodsObj
    // 1 获取商品详情数组
    let collect = wx.getStorageSync('collect') || []
    // 2 判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id)
    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics
      },
      isCollect
    })
  },
  // 点击轮播图 放大预览
  handlePreviewImage(e) {
    // 1.构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid)
    const current = e.currentTarget.dataset.url
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls // 需要预览的图片http链接列表
    })
  },
  // 加入购物车
  handleCartAdd() {
    // 1.获取缓存中的购物车 数组
    let cart = wx.getStorageSync('cart') || []
    // 2.判断 商品对象是否存在于购物车数组中
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id)
    if (index === -1) {
      //3.不存在 第一次添加
      this.GoodsInfo.num = 1
      this.GoodsInfo.checked = true
      cart.push(this.GoodsInfo)
    } else {
      // 4.已经存在购物车数据 执行num++
      cart[index].num++
    }
    // 5.把购物车重新添加回缓存中
    wx.setStorageSync('cart', cart)
    // 6.弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true
    })
  },
  // 点击 商品收藏图标
  handleCollect() {
    // 1 改变图标颜色
    let isCollect = !this.data.isCollect
    console.log(isCollect);
    // 2 获取缓存中商品收藏数组
    let collect = wx.getStorageSync('collect') || []
    // 3 判断该商品是不是被收藏过
    let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id)
    if (index !== -1) {
      // 能找到已经收藏的 在数组中删除
      collect.splice(index, 1)
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true,
      })
    } else {
      // 没有收藏过
      collect.push(this.GoodsInfo)
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true,
      })
    }
    // 4 把数组存入缓存中
    wx.setStorageSync('collect', collect)
    // 5 修改data属性
    this.setData({
      isCollect
    })
  }
})