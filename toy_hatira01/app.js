// app.js
App({
  globalData: {
  userInfo: {
      avatar: '/Img/images/hui_touxiang.png',
      nickname: '未设置昵称',
      uid: '000000001'
    },
    unreadMsgCount: 0, // 全局未读消息数
    notifications: [], // 全局通知队列
    userBalance: 100, // 全局余额（默认值，可被本地存储覆盖）
    balanceRecords: [] // 余额流水记录：充值 / 消费
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

    // 载入本地余额
    const savedBalance = wx.getStorageSync('userBalance');
    if (typeof savedBalance === 'number' && !isNaN(savedBalance)) {
      this.globalData.userBalance = savedBalance;
    }

    // 载入余额流水
    const savedBalanceRecords = wx.getStorageSync('balanceRecords') || [];
    if (Array.isArray(savedBalanceRecords)) {
      this.globalData.balanceRecords = savedBalanceRecords;
    }
  }
});
