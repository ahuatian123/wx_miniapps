import {
  request
} from '../../request/index.js'
Page({
  data: {
    goods: [],
    isFocus: false,
    inValue: ''
  },
  timeId: -1,
  onLoad: function (options) {},
  // 输入框值改变，就会触发事件
  handleInput(e) {
    // 1 获取输入框的值
    const {
      value
    } = e.detail
    // 2 检测合法性
    if (!value.trim()) {
      // 关闭定时器
      clearTimeout(this.timeId)
      // 值不合法 清空
      this.setData({
        goods: [],
        isFocus: false
      })
      return;
    }
    // 3 请求数据 防抖
    clearTimeout(this.timeId)
    this.setData({
      isFocus: true
    })
    this.timeId = setTimeout(() => {
      this.qsearch(value.trim())
    }, 1000);
  },
  // 发送请求获取搜索建议 数据
  async qsearch(query) {
    const res = await request({
      url: '/goods/qsearch',
      data: {
        query
      }
    })
    console.log(res);
    this.setData({
      goods: res
    })
  },
  // 清空输入框
  handleCancel() {
    // 清空定时器
    clearTimeout(this.timeId)
    // 重置
    console.log(111);
    this.setData({
      goods: [],
      inValue: '',
      isFocus: false
    })
  }
})