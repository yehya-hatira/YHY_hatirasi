Page({
  data: {
    userBalance: 100, // 当前余额
    balanceRecords: [], // 余额流水记录
    showHistory: true, // 是否展示流水区域
    backgroundPositionY: 0, // 背景位置百分比
  },
  onLoad: function() {
    console.log('余额页面加载');
    console.log('页面加载完成');
    this.getUserBalance();
    this.loadBalanceRecords();
    this.updateBackgroundPosition();
    this.updateNavigationBarColor();
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
    this.updateBackgroundPosition();
  },

  // 更新背景位置根据余额
  updateBackgroundPosition: function() {
    const balance = this.data.userBalance;
    // 计算进度 (0-1000币 映射到 0-1)
    let progress = balance / 1000;
    // 限制在 0-1 之间
    progress = Math.max(0, Math.min(1, progress));
    
    // 计算背景位置百分比
    // 因为 background-size 是 100% 200%，初始位置是 0%
    // progress 0 = 0% (显示深紫色 #673ab7，渐变的上半部分)
    // progress 0.5 = 50% (显示中立，渐变的中间)
    // progress 1 = 100% (显示浅紫色 #9c27b0，渐变的下半部分)
    const positionY = progress * 100;
    
    this.setData({ backgroundPositionY: positionY });
    console.log('余额:', balance, '进度:', progress, '背景位置:', positionY + '%');
    
    // 同时更新导航栏颜色
    this.updateNavigationBarColor();
  },

  // 根据进度计算导航栏颜色
  updateNavigationBarColor: function() {
    const balance = this.data.userBalance;
    let progress = balance / 1000;
    progress = Math.max(0, Math.min(1, progress));
    
    // 颜色插值：从 #673ab7 到 #9c27b0
    // 深紫色: R=103, G=58, B=183
    // 浅紫色: R=156, G=39, B=176
    const startR = 103, startG = 58, startB = 183;
    const endR = 156, endG = 39, endB = 176;
    
    const r = Math.round(startR + (endR - startR) * progress);
    const g = Math.round(startG + (endG - startG) * progress);
    const b = Math.round(startB + (endB - startB) * progress);
    
    const navBarColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
    
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: navBarColor,
      animation: {
        duration: 300,
        timingFunc: 'easeOut'
      }
    });
    
    console.log('导航栏颜色更新:', navBarColor);
  },

  // 更新用户余额（与全局 / 本地存储同步）
  updateUserBalance: function(amount) {
    const app = getApp();
    const newBalance = this.data.userBalance + amount;
    this.setData({ userBalance: newBalance });
    app.globalData.userBalance = newBalance;
    wx.setStorageSync('userBalance', newBalance);
    console.log('更新后用户余额:', this.data.userBalance); // 打印更新后的余额
    this.updateBackgroundPosition(); // 这会同时更新背景和导航栏
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