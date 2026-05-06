// pages/login/login.js
var balanceUtils = require('../../utils/balance.js');
Page({
  data: {
    containerStyle: '',
    phone: '',
    code: '',
    countdown: 0,
    isSendingCode: false,
    isLoggingIn: false,
    fromPage: ''
  },

  onLoad(options) {
    if (options && options.from) {
      this.setData({ fromPage: options.from });
    }
    this.getUserBalance();
    this.updateGradient();
  },

  onShow() {
    this.getUserBalance();
    this.updateGradient();
  },

  onUnload() {
    if (this._timer) {
      clearInterval(this._timer);
    }
  },

  // 手机号输入
  onPhoneInput(e) {
    this.setData({ phone: e.detail.value });
  },

  // 验证码输入
  onCodeInput(e) {
    this.setData({ code: e.detail.value });
  },

  // 微信一键获取手机号
  onGetPhoneNumber(e) {
    if (e.detail.errMsg !== 'getPhoneNumber:ok') {
      wx.showToast({ title: '已取消，请手动输入手机号', icon: 'none' });
      return;
    }
    wx.showLoading({ title: '获取手机号中...', mask: true });
    // 实际项目：将 e.detail.code 发至服务端换取手机号
    // 演示：模拟自动登录
    setTimeout(() => {
      wx.hideLoading();
      this._completeLogin('微信用户', '');
    }, 900);
  },

  // 发送短信验证码
  onSendCode() {
    const { phone, countdown } = this.data;
    if (countdown > 0) return;
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }
    this.setData({ isSendingCode: true });
    // 实际项目：调用服务端发送短信接口
    setTimeout(() => {
      this.setData({ isSendingCode: false });
      wx.showToast({ title: '验证码已发送（演示: 123456）', icon: 'none', duration: 2000 });
      this._startCountdown();
    }, 600);
  },

  // 倒计时
  _startCountdown() {
    this.setData({ countdown: 60 });
    this._timer = setInterval(() => {
      const c = this.data.countdown - 1;
      if (c <= 0) {
        clearInterval(this._timer);
        this.setData({ countdown: 0 });
      } else {
        this.setData({ countdown: c });
      }
    }, 1000);
  },

  // 手动登录（手机号 + 验证码）
  onLogin() {
    const { phone, code, isLoggingIn } = this.data;
    if (isLoggingIn) return;
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }
    if (!code || code.length < 4) {
      wx.showToast({ title: '请输入验证码', icon: 'none' });
      return;
    }
    // 演示：验证码固定为 123456
    if (code !== '123456') {
      wx.vibrateShort({ type: 'heavy' });
      wx.showToast({ title: '验证码错误', icon: 'none' });
      return;
    }
    this.setData({ isLoggingIn: true });
    wx.showLoading({ title: '登录中...', mask: true });
    setTimeout(() => {
      wx.hideLoading();
      this._completeLogin('用户', phone);
    }, 800);
  },

  // 完成登录，写入全局状态
  // 获取用户余额
  getUserBalance() {
    balanceUtils.getUserBalance();
  },

  // 更新渐变背景（与余额关联）
  updateGradient() {
    balanceUtils.updateGradient(this);
  },

  _completeLogin(nickname, phone) {
    var app = getApp();
    var dataService = require('../../utils/data-service.js');
    var existingUid = wx.getStorageSync('userUid') || ('uid_' + Date.now());
    var existingAvatar = wx.getStorageSync('userAvatar') || '/Img/images/hui_touxiang.png';
    var existingNickname = wx.getStorageSync('userNickname') || nickname;
    var displayPhone = phone
      ? phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
      : '';

    var userInfo = {
      avatar: existingAvatar,
      nickname: existingNickname,
      uid: existingUid,
      phone: phone,
      displayPhone: displayPhone,
      isLoggedIn: true
    };

    app.globalData.userInfo = userInfo;
    app.globalData.isLoggedIn = true;
    wx.setStorageSync('isLoggedIn', true);
    wx.setStorageSync('loginTime', Date.now());
    wx.setStorageSync('userInfo', userInfo);
    wx.setStorageSync('userUid', existingUid);
    if (phone) wx.setStorageSync('userPhone', phone);

    // 首次登录赠送余额
    var savedBalance = wx.getStorageSync('userBalance');
    if (typeof savedBalance !== 'number' || isNaN(savedBalance)) {
      wx.setStorageSync('userBalance', 500);
      app.globalData.userBalance = 500;
    }

    // 同步用户资料到云/本地
    dataService.saveUserProfile(existingUid, userInfo);

    this.setData({ isLoggingIn: false });
    wx.vibrateShort({ type: 'medium' });
    wx.showToast({ title: '登录成功', icon: 'success', duration: 1200 });

    setTimeout(function() {
      var from = this.data.fromPage;
      if (from) {
        wx.navigateBack({ delta: 1 });
      } else {
        wx.reLaunch({ url: '/pages/index/index' });
      }
    }.bind(this), 1200);
  }
});

