// pages/Historical-record/hist-record.js
var dataService = require('../../utils/data-service.js');
var balanceUtils = require('../../utils/balance.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    containerStyle: '',
    records: [],
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (!getApp().checkLogin("hist-record")) return;
    this.getUserBalance();
    this.updateGradient();
    this.loadRecords();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getUserBalance();
    this.updateGradient();
    this.loadRecords();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.loadRecords();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  // 加载历史记录（合并余额记录和礼物记录）
  loadRecords: function() {
    var that = this;
    var app = getApp();
    var uid = app.globalData.userInfo ? app.globalData.userInfo.uid : '000000001';

    this.setData({ loading: true });

    Promise.all([
      dataService.getBalanceRecords(uid),
      dataService.getGiftRecords(uid)
    ]).then(function(results) {
      var balanceRecords = results[0] || [];
      var giftRecords = results[1] || [];
      var records = [];

      balanceRecords.forEach(function(item) {
        records.push({
          type: item.type,
          category: 'balance',
          amount: item.amount,
          balanceAfter: item.balanceAfter,
          remark: item.remark || (item.type === 'recharge' ? '充值' : '消费'),
          timestamp: item.timestamp,
          displayTime: that.formatTimestamp(item.timestamp)
        });
      });

      giftRecords.forEach(function(item) {
        records.push({
          category: 'gift',
          giftName: item.giftName,
          sender: item.sender || item.senderName,
          receiver: item.receiver || item.receiverName,
          quantity: item.quantity || 1,
          timestamp: item.timestamp,
          displayTime: that.formatTimestamp(item.timestamp)
        });
      });

      records.sort(function(a, b) {
        return new Date(b.timestamp) - new Date(a.timestamp);
      });

      that.setData({ records: records, loading: false });
    }).catch(function() {
      // Fallback to local storage on error
      var balanceRecords = wx.getStorageSync('balanceRecords') || [];
      var giftRecords = wx.getStorageSync('giftRecords') || [];
      var records = [];

      balanceRecords.forEach(function(item) {
        records.push({
          type: item.type,
          category: 'balance',
          amount: item.amount,
          balanceAfter: item.balanceAfter,
          remark: item.remark || (item.type === 'recharge' ? '充值' : '消费'),
          timestamp: item.timestamp,
          displayTime: that.formatTimestamp(item.timestamp)
        });
      });

      giftRecords.forEach(function(item) {
        records.push({
          category: 'gift',
          giftName: item.giftName,
          sender: item.sender || item.senderName,
          receiver: item.receiver || item.receiverName,
          quantity: item.quantity || 1,
          timestamp: item.timestamp,
          displayTime: that.formatTimestamp(item.timestamp)
        });
      });

      records.sort(function(a, b) {
        return new Date(b.timestamp) - new Date(a.timestamp);
      });

      that.setData({ records: records, loading: false });
    });
  },

  // 时间格式化
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

  // 获取用户余额（从全局读取）
  getUserBalance: function() {
    balanceUtils.getUserBalance();
  },

  // 更新渐变背景
  updateGradient: function() {
    balanceUtils.updateGradient(this);
  }
})