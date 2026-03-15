Page({
  data: {
    accountSettings: [
      {title: '我要记录', event: 'navigateToRecord'},
      {title: '历史记录', event: 'navigateToEditProfile'},
      {title: '绑定手机号', value: '188****1234', event: 'changePhone'},
      {title: '账号注销', event: 'changePassword'}
    ],
    notifySettings: [
      {title: '礼物通知', type: 'gift', enabled: true},
      {title: '余额变动提醒', type: 'balance', enabled: true}
    ],
    containerStyle: '',
  },

  onLoad() {
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
      this.setData({ userInfo: app.globalData.userInfo });
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
  navigateToRecord() {
    wx.navigateTo({ url: '/pages/Record/Record' });
  },
  navigateToEditProfile() {
    wx.navigateTo({ url: '/pages/Historical-record/hist-record' });
  },
  toggleNotify(e) {
    const type = e.currentTarget.dataset.type;
    const settings = this.data.notifySettings.map(item => {
      if (item.type === type) item.enabled = !item.enabled;
      return item;
    });
    this.setData({ notifySettings: settings });
    wx.showToast({ title: '设置已更新' });
  },

  showLogoutConfirm() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出当前账号吗？',
      success: res => {
        if (res.confirm) {
          getApp().logout();
          wx.navigateBack();
        }
      }
    });
  },

  // 显示选项
  showOptions() {
    wx.showActionSheet({
      itemList: ['拍照', '从手机相册选择', '保持图片', '取消'],
      success: (res) => {
        if (res.tapIndex === 0) {
          // 拍照逻辑
        } else if (res.tapIndex === 1) {
          // 从相册选择逻辑
        } else if (res.tapIndex === 2) {
          // 保持图片逻辑
        }
      },
      fail: (err) => {
        if (err.errMsg.includes('cancel')) {
          wx.showToast({ title: '操作已取消', icon: 'none' });
        } else {
          console.error(err);
        }
      }
    });
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