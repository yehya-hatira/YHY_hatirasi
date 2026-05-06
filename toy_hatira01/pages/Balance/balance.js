var dataService = require('../../utils/data-service.js');
var balanceUtils = require('../../utils/balance.js');

Page({
  data: {
    userBalance: 0,
    balanceRecords: [],
    showHistory: true,
    containerStyle: ''
  },
  onLoad: function() {
    if (!getApp().checkLogin("balance")) return;
    console.log('余额页面加载');
    this.getUserBalance();
    this.loadBalanceRecords();
    this.updateGradient();
  },

  getUserBalance: function() {
    var that = this;
    var app = getApp();
    var uid = app.globalData.userInfo ? app.globalData.userInfo.uid : '000000001';
    dataService.getBalance(uid).then(function(balance) {
      that.setData({ userBalance: balance });
      app.globalData.userBalance = balance;
      that.updateGradient();
    });
  },

  updateGradient: function() {
    balanceUtils.updateGradient(this);
  },

  updateUserBalance: function(amount) {
    var that = this;
    var app = getApp();
    var uid = app.globalData.userInfo ? app.globalData.userInfo.uid : '000000001';
    dataService.updateBalance(uid, amount, amount > 0 ? 'recharge' : 'consume', amount > 0 ? '充值' : '消费').then(function(newBalance) {
      that.setData({ userBalance: newBalance });
      app.globalData.userBalance = newBalance;
      that.updateGradient();
      that.loadBalanceRecords();
    });
  },

  loadBalanceRecords: function() {
    var that = this;
    var app = getApp();
    var uid = app.globalData.userInfo ? app.globalData.userInfo.uid : '000000001';
    dataService.getBalanceRecords(uid).then(function(records) {
      var formatted = records.map(function(item) {
        item.timestamp = that.formatTimestamp(item.timestamp);
        return item;
      });
      that.setData({ balanceRecords: formatted });
    });
  },

  formatTimestamp: function(timestamp) {
    try {
      var d = new Date(timestamp);
      if (isNaN(d.getTime())) return '未知时间';
      var pad = function(n) { return n.toString().padStart(2, '0'); };
      return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
        ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
    } catch (e) {
      return '未知时间';
    }
  },

  toggleHistory: function() {
    this.setData({ showHistory: !this.data.showHistory });
  },

  rechargeBalance: function() {
    console.log('尝试充值余额...');
    wx.requestPayment({
      timeStamp: '时间戳',
      nonceStr: '随机字符串',
      package: '预付单ID',
      signType: 'MD5',
      paySign: '签名',
      success: function(res) {
        this.updateUserBalance(100);
      }.bind(this),
      fail: function(err) {
        wx.showToast({ title: '支付失败', icon: 'none' });
        console.log('支付失败:', err);
      }
    });
  }
});
