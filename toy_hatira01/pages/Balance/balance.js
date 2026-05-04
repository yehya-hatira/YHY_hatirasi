Page({
  data: {
    userBalance: 0, // 当前余额（用于页面显示）
    balanceRecords: [], // 余额流水记录
    showHistory: true, // 是否展示流水区域
    containerStyle: '', // 容器样式（CSS 变量）
  },
  onLoad: function() {
    // 添加登录检查
    if (!getApp().checkLogin("balance")) return;
    
    console.log('余额页面加载');
    console.log('页面加载完成');
    this.getUserBalance();
    this.loadBalanceRecords();
    this.updateGradient();
  },
  // 获取用户余额（从全局读取，同时更新页面显示）
  getUserBalance: function() {
    console.log('获取用户余额...');
    const app = getApp();
    const savedBalance = wx.getStorageSync('userBalance');
    if (typeof savedBalance === 'number' && !isNaN(savedBalance)) {
      app.globalData.userBalance = savedBalance;
    }
    // 同时更新页面 data 用于显示
    this.setData({ userBalance: app.globalData.userBalance });
    console.log('当前用户余额:', app.globalData.userBalance);
  },

  // 更新渐变背景
  updateGradient: function() {
    const app = getApp();
    const balance = app.globalData.userBalance;
    // 映射逻辑：0->80%, 500->50%, 1000->20%
    const percent = 95 - (balance / 1000) * 85;
    
    // 直接设置 CSS 变量
    this.setData({
      containerStyle: `--stop-position: ${percent}%`
    });
    
    console.log('背景位置更新:', percent + '%, 当前余额:', balance);
  },

  // 更新用户余额（只更新全局数据和本地存储，同时更新页面显示）
  updateUserBalance: function(amount) {
    const app = getApp();
    const newBalance = app.globalData.userBalance + amount;
    app.globalData.userBalance = newBalance;
    wx.setStorageSync('userBalance', newBalance);
    // 同时更新页面 data 用于显示
    this.setData({ userBalance: newBalance });
    console.log('更新后用户余额:', newBalance);
    this.updateGradient();
  },

  // 加载余额流水
  loadBalanceRecords: function() {
    const raw = wx.getStorageSync('balanceRecords') || [];
    const records = raw.map(item => ({
      ...item,
      timestamp: this.formatTimestamp(item.timestamp)
    }));
    this.setData({ balanceRecords: records });
  },

  // 新增余额流水记录
  addBalanceRecord: function(type, amount, remark) {
    const app = getApp();
    const now = new Date();
    const record = {
      type, // 'recharge' | 'consume'
      amount,
      balanceAfter: app.globalData.userBalance,
      remark: remark || '',
      timestamp: now.toISOString()
    };
    const existing = wx.getStorageSync('balanceRecords') || [];
    const updated = [...existing, record];
    wx.setStorageSync('balanceRecords', updated);
    app.globalData.balanceRecords = updated;
    // 重新加载一遍，保证时间是格式化后的字符串
    this.loadBalanceRecords();
  },

  // 时间格式化：YYYY-MM-DD HH:mm:ss
  formatTimestamp: function(timestamp) {
    try {
      const d = new Date(timestamp);
      if (isNaN(d.getTime())) {
        return '未知时间';
      }
      const pad = n => n.toString().padStart(2, '0');
      const year = d.getFullYear();
      const month = pad(d.getMonth() + 1);
      const day = pad(d.getDate());
      const hour = pad(d.getHours());
      const minute = pad(d.getMinutes());
      const second = pad(d.getSeconds());
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    } catch (e) {
      return '未知时间';
    }
  },

  // 切换流水显示
  toggleHistory: function() {
    this.setData({ showHistory: !this.data.showHistory });
  },

  // 充值余额
  rechargeBalance: function() {
    console.log('尝试充值余额...');
    wx.requestPayment({
      timeStamp: '时间戳',
      nonceStr: '随机字符串',
      package: '预付单ID',
      signType: 'MD5',
      paySign: '签名',
      success: (res) => {
        this.updateUserBalance(100); // 充值100币
        this.addBalanceRecord('recharge', 100, '充值');
        console.log('充值成功，当前余额:', getApp().globalData.userBalance);
      },
      fail: (err) => {
        wx.showToast({
          title: '支付失败',
          icon: 'none'
        });
        console.log('支付失败:', err);
      }
    });
  }
  // 其他功能函数
});
