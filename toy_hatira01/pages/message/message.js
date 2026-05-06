var dataService = require('../../utils/data-service.js');
var balanceUtils = require('../../utils/balance.js');

Page({
  data: {
    showcurrenttime: false,
    notifications: [],
    myMsgBadge: 0,
    containerStyle: ''
  },
  onLoad: function() {
    if (!getApp().checkLogin("message")) return;
    this.getUserBalance();
    this.updateGradient();
    this.loadNotifications();
  },

  loadNotifications: function() {
    var that = this;
    var app = getApp();

    var rawNotifications = app.globalData.notifications;
    var formattedNotifications = rawNotifications.map(function(notification) {
      var displayText = '';
      if (notification.type === 'like') {
        displayText = notification.sender + ' 赞了' + notification.receiver + ' 的第' + notification.imageIndex + '张图片';
      } else {
        displayText = notification.sender + ' 给' + notification.receiver + ' 送了 ' + notification.giftName;
      }
      return Object.assign({}, notification, {
        displayText: displayText,
        timestamp: that.formatTimestamp(notification.timestamp)
      });
    });

    that.setData({
      notifications: formattedNotifications,
      myMsgBadge: app.globalData.unreadMsgCount || 0
    });
  },

  formatTimestamp: function(timestamp) {
    var messageTime;
    try {
      messageTime = new Date(timestamp);
      if (isNaN(messageTime.getTime())) throw new Error('Invalid timestamp');
    } catch (e) {
      console.error('无效的时间戳:', timestamp);
      return '未知时间';
    }

    var now = new Date();
    var diffTime = now - messageTime;
    var secondsInADay = 86400000;
    var secondsInAWeek = 604800000;

    var hours = messageTime.getHours().toString().padStart(2, '0');
    var minutes = messageTime.getMinutes().toString().padStart(2, '0');
    var formattedTime = hours + ':' + minutes;

    if (diffTime < secondsInADay) {
      return formattedTime;
    } else if (diffTime < secondsInADay * 2) {
      return '昨天 ' + formattedTime;
    } else if (diffTime < secondsInAWeek) {
      var weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      return weekDays[messageTime.getDay()] + ' ' + formattedTime;
    } else {
      return messageTime.toLocaleDateString('zh-CN') + ' ' + formattedTime;
    }
  },

  onShow: function() {
    var app = getApp();
    app.globalData.unreadMsgCount = 0;
    var uid = app.globalData.userInfo ? app.globalData.userInfo.uid : '000000001';
    dataService.markAllRead(uid);
    this.getUserBalance();
    this.updateGradient();
  },

  getUserBalance: function() {
    balanceUtils.getUserBalance();
  },

  updateGradient: function() {
    balanceUtils.updateGradient(this);
  }
});
