// pages/Record/Record.js
Page({
  data: {
    // 页面初始化数据
    showMusicList: false,
    musicHistory: [],
    currentIndex: 0,// 当前播放的索引
    isAnimating: false, // 是否正在动画中
    intervalId: null, // 自动轮播定时器
    showAddImage: true, // 控制"+"号的显示状态
    deleVisible: false,
    b0Visible: false,
    b1Visible: false,
    addVisible: false,
    showFuncKeys: false, // 控制 func 键的状态
    funcKeys: ['dele', 'b0', 'b1', 'add'], // 定义要显示的键
    showLanguageList: false,
    currentLang: 'zh', // 默认语言
    musicText: '',
    selectMusicText: '',
    images: [], // Initialize images array for .a-photo-area
    bImages: [], // Initialize bImages array for .b-photo-area

    showAddBImage: true, // 控制 .b-photo-area "+" 号的显示状态
    currentBIndex: 0, // 当前显示的图片索引
    lastPicture: [], // 记录被滑走的图片信息
    draggingIndex: null, // 当前拖拽的图片索引
    startX: 0, // 拖拽起始 X 坐标
    startY: 0, // 拖拽起始 Y 坐标
    threshold: 50, // 拖拽移除的阈值
    opacity: 1, // 图片透明度
    translateX: 0, // 图片水平位移
    translateY: 0, // 图片垂直位移
    isBAnimating: false, // 是否正在动画中
    showFirstImageMessage: false, // 控制提示信息的显示
    startTime: 0, // 记录拖拽开始时间
    dragSpeed: 0, // 记录拖拽速度
    restoringIndex: null, // 正在恢复的图片索引
    restoringTranslateX: 0, // 恢复图片的水平位移
    restoringTranslateY: 0, // 恢复图片的垂直位移
    restoringOpacity: 1, // 恢复图片的透明度
    restoringAnimationType: 'smooth', // 恢复动画类型
    disableRestoringTransition: false, // 是否禁用恢复动画的transition
    containerStyle: '',

    i18n: {
      ug: {
        title: 'خاتىرە',
        music: 'مۇزىكا',
        selectMusic: 'مۇزىكا تاللاش...',
        delete: 'ئۆچۈرۈش',
        confirmDelete: 'راستىنلا ئۆچۈرەمسىز؟',
        success: 'مۇۋەپپەقىيەتلىك',
        fail: 'مەغلۇپ بولدى',
        language: 'تىل',
        firstImageTip: 'بۇ بىرىنچى سۈرەت'
      },
      zh: {
        title: '瞎记',
        music: '音乐',
        selectMusic: '选择音乐...',
        delete: '删除',
        confirmDelete: '确定要删除吗？',
        success: '成功',
        fail: '失败',
        language: '语言',
        firstImageTip: '这是第一张图片'
      },
      en: {
        title: 'Notes',
        music: 'Music',
        selectMusic: 'Select Music...',
        delete: 'Delete',
        confirmDelete: 'Confirm to delete?',
        success: 'Success',
        fail: 'Failed',
        language: 'Language',
        firstImageTip: 'This is the first photo'
      },
      tr: {
        title: 'Notlar',
        music: 'Müzik',
        selectMusic: 'Müzik seç...',
        delete: 'Sil',
        confirmDelete: 'Silmeyi onayla?',
        success: 'Başarılı',
        fail: 'Başarısız',
        language: 'Dil',
        firstImageTip: 'Bu ilk fotoğraf'
      }
    },
  },
  
  // 统一使用平滑动画
  getRandomAnimationType() {
    return 'smooth'; // 只使用平滑效果，不要回弹
  },

  // 执行恢复动画 - 统一平滑效果
  executeRestoreAnimation(animationType, initialX, initialY, index) {
    this.smoothAnimation(initialX, initialY, index);
  },

  // 平滑动画 - 直接飞回效果
  smoothAnimation(initialX, initialY, index) {
    // 立即开始动画
    this.setData({
      restoringTranslateX: 0,
      restoringTranslateY: 0,
      restoringOpacity: 1
    });

    // 动画完成后清理
    setTimeout(() => {
      this.finishRestoreAnimation(index);
    }, 800); // 0.8s动画时间
  },

  // 完成恢复动画
  finishRestoreAnimation(index) {
    this.setData({
      currentBIndex: index,
      restoringIndex: null,
      restoringTranslateX: 0,
      restoringTranslateY: 0,
      restoringOpacity: 1,
      disableRestoringTransition: false,
      isBAnimating: false
    });
  },
  onLoad: function () {
    console.log('页面加载');
    this.audioContext = wx.createInnerAudioContext(); // 确保初始化
    this.updatePageText(); // 初始化页面文本
    this.startAutoPlay();//启动自动轮播
    this.getUserBalance();
    this.updateGradient();
  },
  onUnload: function() {
    this.stopAutoPlay();//停止自动轮播
  },
  
  handleMusicChange: function (e) {
    console.log('音乐选择改变', e.detail.value);
  },
  handleLanguageChange: function (e) {
    console.log('语言选择改变', e.detail.value);
  },
  // 切换音乐列表显示状态
  toggleMusicList: function() {
    this.setData({
      showMusicList: !this.data.showMusicList
    });
  },
  // 切换语言列表显示状态
  toggleLanguageList: function() {
    this.setData({
      showLanguageList: !this.data.showLanguageList
    });
  },
  // 切换语言
  changeLanguage: function(e) {
    const lang = e.currentTarget.dataset.lang;
    this.setData({
      currentLang: lang,
      showLanguageList: false
    });

    // 更新小程序标题
    wx.setNavigationBarTitle({
      title: this.data.i18n[lang].title
    });

    // 更新界面文字
    this.updatePageText();
  },
  // 选择新音乐111行删除了wx.getSystemInfo({success: (res) => {
  selectNewMusic: function() {
    wx.getSystemInfo({
      success: (res) => {
      if (res.platform === 'ios') {
        // 检查是否安装了网易云音乐
        wx.showModal({
          title: '打开外部应用',
          content: '即将离开微信、打开"网易云音乐"',
          success: (result) => {
            if (result.confirm) {
              // 尝试打开网易云音乐
              wx.navigateToMiniProgram({
                appId: 'wx8dd6ecd81906fd84', // 网易云音乐小程序的appId
                path: 'pages/home/index',
                success: () => {
                  console.log('成功打开网易云音乐小程序');
                    // 这里可以添加逻辑来处理用户选择的歌曲
                    // 例如，使用回调或监听事件来获取用户选择的歌曲
                },
                fail: (err) => {
                  console.error('打开小程序失败', err);
                  // 如果小程序打开失败，尝试打开APP
                  wx.launchApplication({
                    appId: 'com.netease.cloudmusic',
                    path: 'orpheus://',
                    success: () => {
                      console.log('成功打开网易云音乐APP');
                        // 这里可以添加逻辑来处理用户选择的歌曲
                        // 例如，使用回调或监听事件来获取用户选择的歌曲
                    },
                    fail: () => {
                        // 如果APP也打不开，引导用户去App Store下载
                      wx.showModal({
                        title: '提示',
                        content: '您尚未安装网易云音乐，是否前往下载？',
                        success: (res) => {
                          if (res.confirm) {
                            wx.setClipboardData({
                              data: 'https://apps.apple.com/cn/app/网易云音乐/id590338362',
                              success: () => {
                                wx.showToast({
                                  title: '链接已复制，请在浏览器中打开',
                                  icon: 'none'
                                });
                              }
                            });
                          }
                        }
                      });
                    }
                  });
                }
              });
            }
          }
        });
      } else {
        // 安卓设备保持原有逻辑
        wx.chooseMessageFile({
          count: 1,
          type: 'file',
          extension: ['mp3', 'wav', 'm4a'],
          success: (res) => {
            if (res.tempFiles && res.tempFiles.length > 0) {
              const newMusic = {
                name: res.tempFiles[0].name,
                url: res.tempFiles[0].path
              };
              const musicHistory = [...this.data.musicHistory];
              if (musicHistory.length >= 4) {
                musicHistory.pop();
              }
              musicHistory.unshift(newMusic);
              this.setData({
                musicHistory,
                showMusicList: false
              });
              wx.showToast({
                title: '添加成功',
                icon: 'success'
              });
            }
          }
        });
      }
      }//295行删除了).catch(err => {console.error('获取系统信息失败', err);});
    });
  },
  // 播放音乐
  playMusic: function(e) {
    const index = e.currentTarget.dataset.index;
    const music = this.data.musicHistory[index];

    if (!this.audioContext) {
      console.error('音频上下文未初始化');
      return; // 提示用户或处理错误
    }

    if (this.data.currentMusic === music.url) {
      // 如果是当前播放的音乐，则暂停
      this.audioContext.pause();
      this.setData({ currentMusic: null });
    } else {
      // 播放新的音乐
      this.audioContext.src = music.url;
      this.audioContext.play();
      this.setData({ currentMusic: music.url });
    }
  },

  // 更新页面文字
  updatePageText: function() {
    const lang = this.data.currentLang;
    const i18n = this.data.i18n[lang];

    this.setData({
      'musicText': i18n.music,
      'selectMusicText': i18n.selectMusic,
      // 其他需要更新的文本
    });
  },

  handleKeyClick: function (e) {
    const key = e.currentTarget.dataset.key; // 获取点击的键
    console.log('点击的键:', key);
    if (key === 'last') {
      this.setData({
        isBAnimating: true
      });
      this.prevBImage(); // 上一张图片
    } else if (key === 'add') {
      this.chooseBImage(); // 通过 add-key-circle 上传图片
    }else if (key === 'func') {
              if (this.data.showFuncKeys) {
                  // 如果已经显示，依次收回每个键
                  this.hideFuncKeysSequentially();
              } else {
                  // 如果未显示，依次显示每个键
                  this.setData({
                      showFuncKeys: true,
                  });
                  this.showFuncKeysSequentially();
              }
    } else {
        // 点击其他键时，收回所有键
        this.setData({
            showFuncKeys: false,
            deleVisible: false,
            b0Visible: false,
            b1Visible: false,
            addVisible: false,
        });
    }
  },
  //启动自动轮播
  startAutoPlay: function() {
    if (!this.data.intervalId) {
      this.setData({ intervalId: setInterval(this.nextImage.bind(this), 2000) }); // 3秒换一张
    }
  },
  //停止自动轮播
  stopAutoPlay: function() {
    clearInterval(this.data.intervalId);
    this.setData({ intervalId: null });
  },
  //自动轮播到下一张图片
  nextImage: function() {
    if (!this.data.isAnimating && this.data.images.length > 0) {
      this.setData({ isAnimating: true });
      const newIndex = (this.data.currentIndex + 1) % this.data.images.length;
      this.setData({ currentIndex: newIndex });
      // console.log(`自动轮播到第 ${newIndex} 张图片`);
      // console.log(`当前小圆点索引: ${newIndex}`);
      setTimeout(() => {
        this.setData({ isAnimating: false });
      }, 300); // 动画持续时间
    } else {
      // console.log('自动轮播失败，图片数组为空或动画正在进行中');
    }
  },
  //切换到上一张图片
  prevImage: function() {
    if (!this.data.isAnimating) {
      this.setData({ isAnimating: true });
      const newIndex = (this.data.currentIndex - 1 + this.data.images.length) % this.data.images.length;
      this.setData({ currentIndex: newIndex });
      console.log(`切换到第 ${newIndex} 张图片`);
      console.log(`当前小圆点索引: ${newIndex}`);
      setTimeout(() => {
        this.setData({ isAnimating: false });
      }, 300); // 动画持续时间
    }
  },
  //图片上传功能
  chooseAImage: function() {
    const _this = this;
    wx.chooseImage({
      count: 5, // 一次最多可以选择的文件数
      success(res) {
        res.tempFilePaths.forEach(filePath => {
          _this.addImage(filePath);
        });
        // 隐藏"+"号
        _this.setData({ showAddImage: false });
      }
    });
  },
  //添加图片
  addImage: function(filePath) {
    const newImage = {
      color: '#FFFFFF', // 默认颜色
      top: '0px', // 初始位置0
      src: filePath, // 图片路径
    };
    this.setData({
      images: [...this.data.images, newImage]
    });
    // console.log('图片已添加，当前图片数量:', this.data.images.length);
    // 限制最多上传5张照片
    if (this.data.images.length > 5) {
      this.setData({
        images: this.data.images.slice(0, 5)
      });
    }
  },
  //点击小圆点切换到对应图片
  handleDotClick: function(event) {
    const dotIndex = event.currentTarget.dataset.index;
    this.setData({ currentIndex: dotIndex });
    console.log(`点击小圆点，切换到第 ${dotIndex} 张图片`);
    console.log(`当前小圆点索引: ${dotIndex}`);
  },
  // 修改 showFuncKeysSequentially 函数以实现依次弹出和弹回的效果
  showFuncKeysSequentially: function () {
    const keys = this.data.funcKeys;
    keys.forEach((key, index) => {
        setTimeout(() => {
            this.setData({
                [`${key}Visible`]: true,
                // [`${key}show`]: true, // 添加 show 状态
            });
        }, index * 200); // 每个键延迟200ms显示
    });
  },
  // 新增 hideFuncKeysSequentially 函数以实现依次隐藏的效果
  hideFuncKeysSequentially: function () {
    const keys = this.data.funcKeys.reverse(); // 反转顺序
    keys.forEach((key, index) => {
        setTimeout(() => {
            this.setData({
                [`${key}Visible`]: false,
            });
        }, index * 200); // 每个键延迟200ms隐藏
    });

    // 在所有键隐藏后设置 showFuncKeys 为 false
    setTimeout(() => {
        this.setData({
            showFuncKeys: false,
        });
    }, keys.length * 200); // 总延迟时间
  },
  // 添加图片到 .b-photo-area
  // B照片区域选择图片
  chooseBImage: function() {
    const that = this;
    wx.chooseImage({
      count: 50,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths;
        // 获取当前的 images 数组
        const currentbImages = that.data.bImages;
        // 将新选择的图片追加到现有的 images 数组
        const newbImages = currentbImages.concat(tempFilePaths);
        // 更新 images 数据
        that.setData({
          bImages: newbImages,
        });
      }
    });
  },

   // 图片触摸开始事件
   onImageTouchStart(e) {
    if (this.data.isBAnimating) return; // 如果正在动画中，不处理拖拽
    this.setData({
      draggingIndex: e.currentTarget.dataset.index,
      startX: e.touches[0].pageX,
      startY: e.touches[0].pageY,
      translateX: 0,
      translateY: 0,
      startTime: Date.now() // 记录拖拽开始时间
    });
  },

  // 图片触摸移动事件
  onImageTouchMove(e) {
    if (this.data.isBAnimating) return; // 如果正在动画中，不处理拖拽
    const { startX, startY } = this.data;
    const moveX = e.touches[0].pageX;
    const moveY = e.touches[0].pageY;
    const distanceX = moveX - startX;
    const distanceY = moveY - startY;

    // 实时更新位置和透明度，让拖拽更跟手
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
    const opacity = Math.max(0.1, 1 - distance / 300);
    
    this.setData({
      opacity,
      translateX: distanceX,
      translateY: distanceY
    });
  },

  // 图片触摸结束事件
  onImageTouchEnd(e) {
    if (this.data.isBAnimating) return; // 如果正在动画中，不处理拖拽
    const { startX, startY, threshold, currentBIndex, bImages, startTime } = this.data;
    const endX = e.changedTouches[0].pageX;
    const endY = e.changedTouches[0].pageY;
    const distanceX = endX - startX;
    const distanceY = endY - startY;

    if (Math.abs(distanceX) > threshold || Math.abs(distanceY) > threshold) {
      // 计算拖拽速度
      const endTime = Date.now();
      const dragDuration = endTime - startTime; // 拖拽持续时间
      const dragSpeed = Math.sqrt(distanceX ** 2 + distanceY ** 2) / dragDuration; // 拖拽速度

      // 根据拖拽速度动态调整动画时间
      const animationDuration = Math.max(200, Math.min(500, 500 / dragSpeed)); // 动画时间在200ms到500ms之间

      this.setData({
        isBAnimating: true
      });

      // 将当前图片滑出屏幕
      this.setData({
        translateX: distanceX * 2,
        translateY: distanceY * 2,
        opacity: 0
      });

      // 记录滑出方向（角度）
      const angle = Math.atan2(distanceY, distanceX); // 计算滑出角度

      // 延迟一段时间后，更新 currentBIndex 和 lastPicture
      setTimeout(() => {
        const lastPicture = [...this.data.lastPicture];
        lastPicture.push({
          index: currentBIndex,
          translateX: distanceX * 2,
          translateY: distanceY * 2,
          opacity: 0,
          angle: angle // 记录滑出角度
        });

        const newIndex = (currentBIndex + 1) % bImages.length;

        this.setData({
          currentBIndex: newIndex,
          translateX: 0,
          translateY: 0,
          opacity: 1,
          isBAnimating: false,
          lastPicture: lastPicture,
          draggingIndex: null // 重置拖拽索引
        });

        console.log('被滑走的当前照片序号:', currentBIndex);
        console.log('当前滑走的图片索引已添加到 lastPicture:', lastPicture);
      }, animationDuration); // 使用动态调整的动画时间
    } else {
      // 如果没有超过阈值，图片回到原位
      this.setData({
        translateX: 0,
        translateY: 0,
        opacity: 1,
        draggingIndex: null // 重置拖拽索引
      });
    }
  },

  // 切换到上一张图片
  prevBImage() {
    const { lastPicture, bImages } = this.data;
    if (lastPicture.length > 0) {
      const { index, translateX, translateY, angle } = lastPicture.pop(); // 取出滑出时的信息

      // 根据滑出角度计算滑入的初始位置
      const screenWidth = wx.getSystemInfoSync().windowWidth;
      const screenHeight = wx.getSystemInfoSync().windowHeight;

      // 计算从屏幕外的初始位置，确保足够远
      const distance = Math.max(screenWidth, screenHeight) * 2; // 增加距离
      const initialTranslateX = Math.cos(angle) * distance;
      const initialTranslateY = Math.sin(angle) * distance;

      console.log('窗口宽度：',screenWidth,'窗口高度：',screenHeight);
      console.log('返回照片：', index, '从位置飞回:', initialTranslateX, initialTranslateY);
      
      // 第一步：设置初始位置（屏幕外），禁用transition
      this.setData({
        restoringIndex: index,
        restoringTranslateX: initialTranslateX,
        restoringTranslateY: initialTranslateY,
        restoringOpacity: 0.3,
        disableRestoringTransition: true,
        isBAnimating: true
      });

      // 第二步：等待一帧，确保初始位置已渲染
      setTimeout(() => {
        // 启用transition
        this.setData({
          disableRestoringTransition: false
        });
        
        // 第三步：再等待一帧，然后开始动画
        setTimeout(() => {
          console.log('开始飞回动画');
          this.smoothAnimation(initialTranslateX, initialTranslateY, index);
        }, 20);
      }, 20);
    } else {
      // 如果 lastPicture 为空，允许用户继续滑动照片
      console.log('lastPicture 为空，无法返回上一张照片');
      this.setData({
        isBAnimating: false,
        showFirstImageMessage: true // 显示提示信息
      });

      // 2秒后隐藏提示信息
      setTimeout(() => {
        this.setData({
          showFirstImageMessage: false // 隐藏提示信息
        });
      }, 2000);
    }
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
  },

  // 添加onShow生命周期函数，检查登录状态
  onShow: function() {
    if (!getApp().checkLogin("Record")) return;
    this.getUserBalance();
    this.updateGradient();
  }
});