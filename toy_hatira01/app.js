// app.js
App({
  globalData: {
    userInfo: {
      avatar: '/Img/images/hui_touxiang.png',
      nickname: '未设置昵称',
      uid: '000000001'
    },
    isLoggedIn: false,
    unreadMsgCount: 0,
    notifications: [],
    userBalance: 1000,
    balanceRecords: []
  },

  // 登录有效期：10分钟（ms）
  LOGIN_EXPIRE_MS: 3 * 60 * 1000,

  // 基础敏感词列表（实际项目应使用后端API）
  sensitiveWords: [
    '敏感词1', '敏感词2', '违规内容', '违法信息'
  ],

  // 简单的内容安全检查（前端模拟）
  checkContentSafety(content) {
    if (!content || typeof content !== 'string') {
      return { safe: true, reason: '' };
    }
    
    const lowerContent = content.toLowerCase();
    for (const word of this.sensitiveWords) {
      if (lowerContent.includes(word.toLowerCase())) {
        return { safe: false, reason: '包含敏感内容' };
      }
    }
    return { safe: true, reason: '' };
  },

  // 图片安全检查（前端模拟）
  checkImageSafety(imagePath) {
    // 实际项目应调用腾讯云内容安全API
    // 这里仅做模拟，返回安全
    return { safe: true, reason: '' };
  },

  logout() {
    this.globalData.isLoggedIn = false;
    this.globalData.userInfo = {
      avatar: '/Img/images/hui_touxiang.png',
      nickname: '未设置昵称',
      uid: '000000001'
    };
    wx.removeStorageSync('token');
    wx.removeStorageSync('isLoggedIn');
    wx.removeStorageSync('userInfo');
    wx.removeStorageSync('loginTime');
    wx.reLaunch({ url: '/pages/index/index' });
  },

  // 检查登录是否有效（10分钟内）
  isLoginValid() {
    if (!this.globalData.isLoggedIn) return false;
    var loginTime = wx.getStorageSync('loginTime');
    if (!loginTime) return false;
    var elapsed = Date.now() - loginTime;
    if (elapsed > this.LOGIN_EXPIRE_MS) {
      // 登录已过期，清除状态
      this.globalData.isLoggedIn = false;
      wx.removeStorageSync('isLoggedIn');
      wx.removeStorageSync('loginTime');
      return false;
    }
    return true;
  },

  checkLogin(fromPage) {
    if (this.isLoginValid()) return true;
    var url = fromPage
      ? '/pages/login/login?from=' + encodeURIComponent(fromPage)
      : '/pages/login/login';
    wx.navigateTo({ url: url });
    return false;
  },

  onLaunch() {
    console.log('小程序启动');
    this.loadStorageData();
  },

  loadStorageData() {
    var isLoggedIn = wx.getStorageSync('isLoggedIn');
    var loginTime = wx.getStorageSync('loginTime');
    if (isLoggedIn && loginTime) {
      var elapsed = Date.now() - loginTime;
      if (elapsed <= this.LOGIN_EXPIRE_MS) {
        this.globalData.isLoggedIn = true;
        var savedUserInfo = wx.getStorageSync('userInfo');
        if (savedUserInfo && savedUserInfo.uid) {
          this.globalData.userInfo = savedUserInfo;
        }
      } else {
        // 已过期，清除
        wx.removeStorageSync('isLoggedIn');
        wx.removeStorageSync('loginTime');
      }
    }
    var savedAvatar = wx.getStorageSync('userAvatar');
    if (savedAvatar) {
      this.globalData.userInfo.avatar = savedAvatar;
    }
    var savedBalance = wx.getStorageSync('userBalance');
    if (typeof savedBalance === 'number' && !isNaN(savedBalance)) {
      this.globalData.userBalance = savedBalance;
    }
    var savedBalanceRecords = wx.getStorageSync('balanceRecords') || [];
    if (Array.isArray(savedBalanceRecords)) {
      this.globalData.balanceRecords = savedBalanceRecords;
    }
  }
});