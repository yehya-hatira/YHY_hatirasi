Page({
  data: {
    userBalance: 100, // 初始余额
    // 页面数据
  },
  onLoad: function() {
    console.log('余额页面加载');
    console.log('页面加载完成');
    this.getUserBalance();
    // 其他初始化代码
  },
    // 获取用户余额
  getUserBalance: function() {
    console.log('获取用户余额...');
    // 模拟API请求获取用户余额
    setTimeout(() => {
      this.setData({ userBalance: 100 });
      console.log('当前用户余额:', this.data.userBalance); // 打印用户余额
    }, 500);
  },
    // 更新用户余额
  updateUserBalance: function(amount) {
    this.setData({ userBalance: this.data.userBalance + amount });
    console.log('更新后用户余额:', this.data.userBalance); // 打印更新后的余额
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