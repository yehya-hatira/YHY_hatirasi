Page({
  data: {
    showcurrenttime: false, // 显示当前时间
    notifications: [], // 存储通知信息
    myMsgBadge: 0, // 未读消息计数（用于页面右上角小红点）
    containerStyle: '',
  },
  onLoad: function() {
    this.getUserBalance();
    this.updateGradient();
    const app = getApp();
    const rawNotifications = app.globalData.notifications;

    // 直接使用全局的 notifications，格式化时间戳并生成显示文本
    const formattedNotifications = rawNotifications.map(notification => {
      let displayText = '';
      
      // 根据通知类型生成不同的显示文本
      if (notification.type === 'like') {
        // 点赞消息
        displayText = `${notification.sender} 赞了${notification.receiver} 的第${notification.imageIndex}张图片`;
      } else {
        // 礼物消息
        displayText = `${notification.sender} 给${notification.receiver} 送了 ${notification.giftName}`;
      }
      
      return {
        ...notification,
        displayText: displayText,
        timestamp: this.formatTimestamp(notification.timestamp)
      };
    });
    
    this.setData({ 
      notifications: formattedNotifications,
      myMsgBadge: app.globalData.unreadMsgCount || 0
    });
    
    // 不再清空全局队列和未读数
    // app.globalData.notifications = [];
    // app.globalData.unreadMsgCount = 0; // 确保未读消息计数清零
  },
  loadNotifications: function() {
    // 初始化通知列表
    this.setData({ notifications: [] });
  },
  addNotification: function(notification) {
    notification.timestamp = this.formatTimestamp(notification.timestamp); // 格式化时间
    const notifications = this.data.notifications;
    notifications.push(notification); // 将新通知添加到列表末尾
    this.setData({ notifications });
    console.log('当前通知列表:', this.data.notifications); // 确保打印当前通知列表
  },
  
  // message.js - 修改后的 formatTimestamp 函数
  formatTimestamp: function(timestamp) {
    let messageTime;
    try {
      messageTime = new Date(timestamp);
      if (isNaN(messageTime.getTime())) {
        throw new Error('Invalid timestamp');
      }
    } catch (e) {
      console.error('无效的时间戳:', timestamp);
      return '未知时间';
    }

    const now = new Date();
    const diffTime = now - messageTime;

    const secondsInADay = 86400000; // 24*60*60*1000
    const secondsInAWeek = 604800000; // 7*24*60*60*1000

    // 替换原 timeOptions 和返回逻辑
    const hours = messageTime.getHours().toString().padStart(2, '0'); // 强制补零
    const minutes = messageTime.getMinutes().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;

    if (diffTime < secondsInADay) {
      return formattedTime;
    } else if (diffTime < secondsInADay * 2) {
      return `昨天 ${formattedTime}`;
    } else if (diffTime < secondsInAWeek) {
      const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      return `${weekDays[messageTime.getDay()]} ${formattedTime}`;
    } else {
      return `${messageTime.toLocaleDateString('zh-CN')} ${formattedTime}`;
    }
  },

  // 显示当前时间
  onShow: function() {
    // 进入页面时重置全局未读数
    const app = getApp();
    app.globalData.unreadMsgCount = 0;
    this.getUserBalance();
    this.updateGradient();
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