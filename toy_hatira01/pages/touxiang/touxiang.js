// pages/touxiang/touxiang.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    containerStyle: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 添加登录检查
    if (!getApp().checkLogin("touxiang")) return;
    
    this.syncUserInfo();
    this.getUserBalance();
    this.updateGradient();
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
    this.syncUserInfo();
    this.getUserBalance();
    this.updateGradient();
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

  goBack() {
    wx.navigateBack();
  },

  // 显示选项
  showOptions() {
    wx.showActionSheet({
      itemList: ['拍照', '从相册选择', '保持图片'],
      success: (res) => {
        if (res.tapIndex === 0) {
          this.takePhoto(); // 拍照逻辑
        } else if (res.tapIndex === 1) {
          this.chooseFromAlbum(); // 从相册选择逻辑
        } else if (res.tapIndex === 2) {
          this.saveImage(); // 保存图片逻辑
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

  syncUserInfo() {
    const app = getApp();
    this.setData({ userInfo: app.globalData.userInfo });
  },

  // 拍照逻辑（优化版）
  takePhoto() {
    wx.chooseImage({
      count: 1,
      sourceType: ['camera'],
      success: (res) => {
        this.updateAvatarSystem(res.tempFilePaths[0]);
      },
      fail: this.handleImageError
    });
  },

  // 相册选择（优化版）
  chooseFromAlbum() {
    wx.chooseImage({
      count: 1,
      sourceType: ['album'],
      success: (res) => {
        this.updateAvatarSystem(res.tempFilePaths[0]);
      },
      fail: this.handleImageError
    });
  },

  // 统一更新系统
  updateAvatarSystem(newAvatar) {
    const app = getApp();
    
    // 更新三级存储
    this.setData({ 'userInfo.avatar': newAvatar });
    app.globalData.userInfo.avatar = newAvatar;
    wx.setStorageSync('userAvatar', newAvatar);

    // 用户反馈
    wx.vibrateShort();
    wx.showToast({ title: '更新成功', icon: 'success' });
  },

  // 错误处理统一
  handleImageError(err) {
    if (err.errMsg.includes('cancel')) {
      wx.showToast({ title: '操作取消', icon: 'none' });
    } else {
      console.error('图片操作失败:', err);
      wx.showToast({ title: '操作失败', icon: 'none' });
    }
  },

  // 保存图片
  saveImage() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.userInfo.avatar, // 保存当前头像
      success: () => {
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        });
      },
      fail: (err) => {
        console.error(err);
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        });
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
})