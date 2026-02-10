Page({
  data: {
    userBalance: 100, // 当前余额
    balanceRecords: [], // 余额流水记录
    showHistory: true, // 是否展示流水区域
  },
  onLoad: function() {
    console.log('余额页面加载');
    console.log('页面加载完成');
    this.getUserBalance();
    this.loadBalanceRecords();
  },
  // 获取用户余额（与全局 / 本地存储同步）
  getUserBalance: function() {
    console.log('获取用户余额...');
    const app = getApp();
    const savedBalance = wx.getStorageSync('userBalance');
    let balance = 100;
    if (typeof savedBalance === 'number' && !isNaN(savedBalance)) {
      balance = savedBalance;
    } else if (typeof app.globalData.userBalance === 'number') {
      balance = app.globalData.userBalance;
    }
    this.setData({ userBalance: balance });
    app.globalData.userBalance = balance;
    console.log('当前用户余额:', this.data.userBalance);
  },

  // 更新用户余额（与全局 / 本地存储同步）
  updateUserBalance: function(amount) {
    const app = getApp();
    const newBalance = this.data.userBalance + amount;
    this.setData({ userBalance: newBalance });
    app.globalData.userBalance = newBalance;
    wx.setStorageSync('userBalance', newBalance);
    console.log('更新后用户余额:', this.data.userBalance); // 打印更新后的余额
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
      balanceAfter: this.data.userBalance,
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
        this.updateUserBalance(100); // 假设充值100币
        console.log('充值成功:', this.data.userBalance); // 打印充值后的余额
        this.addBalanceRecord('recharge', 100, '充值');
      },
      fail: (err) => {
        wx.showToast({
          title: '支付失败',
          icon: 'none'
        });
        console.log('支付失败:', err); // 打印支付失败的信息
      }
    });
  }
  // 其他功能函数
}); 