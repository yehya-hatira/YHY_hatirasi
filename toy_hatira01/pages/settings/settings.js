Page({
  data: {
    accountSettings: [
      {title: '我要记录', event: 'navigateToRecord'},
      {title: '历史记录', event: 'navigateToEditProfile'},
      {title: '绑定手机号', value: '未绑定', event: 'changePhone'},
      {title: '账号注销', event: 'changePassword'},
      {title: '退出登录', event: 'logout'}
    ],
    notifySettings: [],
    containerStyle: '',
    appVersion: 'v1.0.0'
  },

  onLoad() {
    // 添加登录检查
    if (!getApp().checkLogin("settings")) return;
    
    this.loadNotifySettings(); // 加载通知设置
    this.loadUserInfo();
    this.getUserBalance();
    this.updateGradient();
  },

  onShow() {
    this.loadUserInfo();
    this.loadSavedAvatar();
    this.getUserBalance();
    this.updateGradient();
  },

  loadUserInfo() {
    const app = getApp();
    if (app.globalData.userInfo) {
      // 更新绑定手机号显示
      const phoneValue = app.globalData.userInfo.phone ? 
        app.globalData.userInfo.displayPhone : '未绑定';
      const updatedAccountSettings = this.data.accountSettings.map(item => {
        if (item.title === '绑定手机号') {
          return {...item, value: phoneValue};
        }
        return item;
      });
      this.setData({ 
        userInfo: app.globalData.userInfo,
        accountSettings: updatedAccountSettings
      });
    }
  },

  // 加载通知设置（从本地存储）
  loadNotifySettings() {
    const savedNotifySettings = wx.getStorageSync('notifySettings');
    if (savedNotifySettings && Array.isArray(savedNotifySettings)) {
      this.setData({ notifySettings: savedNotifySettings });
    } else {
      // 默认设置
      const defaultSettings = [
        {title: '礼物通知', type: 'gift', enabled: true},
        {title: '余额变动提醒', type: 'balance', enabled: true}
      ];
      this.setData({ notifySettings: defaultSettings });
      wx.setStorageSync('notifySettings', defaultSettings);
    }
  },

  // 跳转到头像页面
  onAvatarTap() {
    wx.navigateTo({
      url: '/pages/touxiang/touxiang', // 确保路径正确
    });
  },

  // 更新头像数据
  updateAvatar(newAvatar) {
    if (!this.data.userInfo) {
      console.error("用户信息未初始化");
      return;
    }

    this.setData({
      'userInfo.avatar': newAvatar
    });
    
    // 同步到全局和存储
    const app = getApp();
    app.globalData.userInfo.avatar = newAvatar;
    wx.setStorageSync('userAvatar', newAvatar);
    
    // 用户反馈
    wx.vibrateShort();
    wx.showToast({
      title: '头像已更换',
      icon: 'success',
      duration: 1000
    });
  },

  // 加载存储的头像
  loadSavedAvatar() {
    const app = getApp();
    const savedAvatar = wx.getStorageSync('userAvatar') || app.globalData.userInfo.avatar;
    this.setData({ 'userInfo.avatar': savedAvatar });
    app.globalData.userInfo.avatar = savedAvatar;
  },

  // 处理账户设置项点击
  handleAccountSettingTap(e) {
    const event = e.currentTarget.dataset.event;
    switch (event) {
      case 'navigateToRecord':
        wx.navigateTo({ url: '/pages/Record/Record' });
        break;
      case 'navigateToEditProfile':
        wx.navigateTo({ url: '/pages/Historical-record/hist-record' });
        break;
      case 'changePhone':
        this.handleBindPhone();
        break;
      case 'changePassword':
        wx.showModal({
          title: '确认注销',
          content: '确定要注销账号吗？这将清除所有本地数据。',
          success: (res) => {
            if (res.confirm) {
              wx.clearStorageSync();
              wx.reLaunch({ url: '/pages/login/login' });
            }
          }
        });
        break;
      case 'logout': // 添加退出登录处理
        this.handleLogout();
        break;
      default:
        break;
    }
  },

  // 绑定手机号处理
  handleBindPhone() {
    const app = getApp();
    if (app.globalData.userInfo.phone) {
      wx.showToast({ title: '手机号已绑定', icon: 'none' });
      return;
    }
    
    wx.navigateTo({
      url: '/pages/login/login?from=settings'
    });
  },

  // 关于应用处理
  handleAboutApp() {
    wx.showModal({
      title: '关于瞎记 (Hatira)',
      content: '版本: v1.0.0\n\n瞎记是一款社交记忆分享平台，支持图片、音乐、礼物赠送和消息通知功能。\n\n© 2026 瞎记团队',
      showCancel: false,
      confirmText: '确定'
    });
  },

  // 退出登录处理
  handleLogout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          const app = getApp();
          app.logout();
        }
      }
    });
  },

  // 切换通知设置
  toggleNotify(e) {
    const type = e.currentTarget.dataset.type;
    const settings = this.data.notifySettings.map(item => {
      if (item.type === type) {
        item.enabled = !item.enabled;
      }
      return item;
    });
    this.setData({ notifySettings: settings });
    
    // 保存到本地存储
    wx.setStorageSync('notifySettings', settings);
    
    wx.showToast({ title: '设置已更新' });
  },

  // 获取用户余额（从全局读取）
  getUserBalance: function() {
    const app = getApp();
    const savedBalance = wx.getStorageSync('userBalance');
    if (typeof savedBalance === 'number' && !isNaN(savedBalance)) {
      app.globalData.userBalance = savedBalance;
    }
  },

  // 更新渐变背景
  updateGradient: function() {
    const app = getApp();
    const balance = app.globalData.userBalance;
    const percent = 95 - (balance / 1000) * 85;
    this.setData({
      containerStyle: `--stop-position: ${percent}%`
    });
  }
});