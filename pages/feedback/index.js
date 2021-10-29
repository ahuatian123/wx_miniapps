Page({
  data: {
    tabs: [{
        id: 0,
        value: '体验问题',
        isActive: true
      },
      {
        id: 1,
        value: '商品、商家投诉',
        isActive: false
      }
    ],
    // 选择的照片
    chooseImgs: [],
    // 文本域的内容
    textVal: ''
  },
  onLoad: function (options) {},
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
  // 点击"+"添加图片
  handleChoose() {
    // 上传图片
    wx.chooseImage({
      count: 9,
      // 图片的格式 原图 压缩图
      sizeType: ['original', 'compressed'],
      // 图片来源 相册 压缩
      sourceType: ['album', 'camera'],
      success: (result) => {
        console.log(result);
        this.setData({
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        })
      },
    })
  },
  // 删除图片
  handleRemove(e) {
    // 1 获取图片索引
    const {
      index
    } = e.currentTarget.dataset
    // 根据索引删除图片
    const {
      chooseImgs
    } = this.data
    chooseImgs.splice(index, 1)
    // 写入到data中
    this.setData({
      chooseImgs
    })
  },
  // 文本输入事件
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    })
  }
})