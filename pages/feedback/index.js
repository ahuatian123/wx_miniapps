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
    textVal: '',
    UpLoadImgs: []
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
  },
  // 提交按钮
  handleFormSubmit() {
    // 1 获取文本域的内容
    const {
      textVal,
      chooseImgs
    } = this.data
    // 2 合法性的验证
    if (!textVal.trim()) {
      // 不合法
      wx.showToast({
        title: '输入不合法',
        mask: true
      })
      return;
    }
    // 显示正在等待的图片
    wx.showLoading({
      title: '正在上传中',
      mask: true
    })
    // 3 上传
    // 判断是否需要上传的图片数组
    if (chooseImgs.length != 0) {
      chooseImgs.forEach((v, i) => {
        wx.uploadFile({
          filePath: v,
          name: 'image',
          url: 'https://img.coolcr.cn/index/api.html ',
          success: (res) => {
            console.log(res);
            let url = JSON.parse(result.data).data.url
            this.UpLoadImgs.push(url)

            // 所有图片上传完毕触发
            if (this.UpLoadImgs.length === chooseImgs.length) {
              wx.hideLoading()
              console.log("提交到后台");
              // 重置页面
              this.setData({
                textVal: '',
                chooseImgs: []
              })
              // 返回上一个页面
              wx.navigateBack({
                delta: 1,
              })
            }
          }
        })
      })
    } else {
      wx.hideLoading()
      console.log("只是提交了文本");
      // 重置页面
      this.setData({
        textVal: '',
      })
      // 返回上一级
      wx.navigateBack({
        delta: 1,
      })
    }

  }
})