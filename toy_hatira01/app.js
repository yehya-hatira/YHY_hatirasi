// app.js
App({
  globalData: {
  userInfo: {
      avatar: '/Img/images/hui_touxiang.png',
      nickname: '未设置昵称',
      uid: '000000001'
    },
    unreadMsgCount: 0, // 全局未读消息数
    notifications: [] // 全局通知队列
  },
  logout() {
    // 清除登录状态
    this.globalData.userInfo = null
    wx.removeStorageSync('token')
    wx.reLaunch({ url: '/pages/touxiang/touxiang' })
  },
  onLaunch() {
    // 小程序启动时执行
    console.log('小程序启动');
    this.loadStorageData();
  },
  loadStorageData() {
    const savedAvatar = wx.getStorageSync('userAvatar');
    if (savedAvatar) {
      this.globalData.userInfo.avatar = savedAvatar;
    }
  }
});
