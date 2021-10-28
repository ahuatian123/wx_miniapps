// pages/login/index.js
Page({
  handleGetUserInfo(e) {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        const {
          userInfo
        } = res
        wx.setStorageSync('userinfo', userInfo)
        wx.navigateBack({
          delta: 1,
        })
      }
    })

  }
})