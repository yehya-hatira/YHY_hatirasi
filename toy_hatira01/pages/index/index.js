// d:\Project_Tools\Tencent\1hunji\new02\pages\index\index.js
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
    myMsgVisible: false,
    myBalanceVisible: false,
    mysettingVisible: false,
    showMyKeys: false, // 控制 my 键的状态
    myKeys: ['myMsg', 'myBalance', 'mysetting'], // 定义要显示的键
    myMsgBadge: 0, // 绑定到 myMsg 的未读数
    myBalanceBadge: 0, // 新增余额提醒
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
    rotation: 0, // 图片旋转角度
    isBAnimating: false, // 是否正在动画中
    showLikeLabel: false, // 显示"喜欢"标签
    showDislikeLabel: false, // 显示"不喜欢"标签
    showFirstImageMessage: false, // 控制提示信息的显示
    startTime: 0, // 记录拖拽开始时间
    dragSpeed: 0, // 记录拖拽速度
    restoringIndex: null, // 正在恢复的图片索引
    restoringTranslateX: 0, // 恢复图片的水平位移
    restoringTranslateY: 0, // 恢复图片的垂直位移
    restoringOpacity: 1, // 恢复图片的透明度
    restoringAnimationType: 'smooth', // 恢复动画类型
    disableRestoringTransition: false, // 是否禁用恢复动画的transition

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
        me: 'مەن',
        messages: 'ئۇچۇرلار',
        balance: 'پۇل قالدۇقى',
        settings: 'تەڭشەك',
        send: 'ئەۋەەت',
        preview: 'كۆرۈش',
        gift: 'سوۋغا',
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
        me: '我',
        messages: '消息',
        balance: '余额',
        settings: '设置',
        send: '发送',
        preview: '预览',
        gift: '礼物',
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
        me: 'Me',
        messages: 'Messages',
        balance: 'Balance',
        settings: 'Settings',
        send: 'Send',
        preview: 'Preview',
        gift: 'Gift',
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
        me: 'Ben',
        messages: 'Mesajlar',
        balance: 'Bakiye',
        settings: 'Ayarlar',
        send: 'Gönder',
        preview: 'Önizleme',
        gift: 'Hediye',
        firstImageTip: 'Bu ilk fotoğraf'
      }
    },
      // 礼物列表
    userRole: 'VIP', // 默认用户角色
    // selectedGift: null, // 当前选中的礼物
    userBalance: 100, // 初始余额
    giftRecords: [],
    giftAnimations: [],
    leftGiftAnimations: [], // 左侧礼物动画数据
    rightGiftAnimations: [], // 右侧礼物动画数据
    isSending: false, // 是否正在发送礼物 

    isLeftSendActive: false,// 左侧发送按钮是否激活    
    isRightSendActive: false,// 右侧发送按钮是否激活

    selectedLeftGift: null, // 左侧选中的礼物
    selectedRightGift: null, // 右侧选中的礼物
    leftGifts: [], // 左侧礼物列表
    rightGifts: [], // 右侧礼物列表
    leftScrollTop: 0, // 左侧滚动位置
    rightScrollTop: 0, // 右侧滚动位置
    footerTranslate: 0, // 使用translateY位移
    startY: 0,
    lastMoveTime: 0,
    leftGiftVisible: true, // 控制左侧礼物区的显示
    rightGiftVisible: true, // 控制右侧礼物区的显示
    isGifting: false, // 控制动画状态

    currentReceiver: 'zulmira', // 当前接收者
    likedImages: [] // 记录被点赞的图片索引数组
  },
  onLoad: function () {
    console.log('页面加载');
    this.audioContext = wx.createInnerAudioContext(); // 确保初始化
    this.lastScrollSoundTime = 0; // 初始化滚动音效时间戳
    this.updatePageText(); // 初始化页面文本
    this.startAutoPlay();//启动自动轮播
    this.getUserBalance();//获取初始化余额
    this.getGiftRecords();//获取初始化礼物记录
    this.checkUserRole(); // 检查用户角色
    this.initWebSocket();//初始化WebSocket
    this.initGifts(); // 初始化礼物列表    
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
  // 关闭所有下拉列表（点击遮罩或空白区域）
  closeDropdowns: function() {
    this.setData({
      showLanguageList: false,
      showMusicList: false
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
      this.prevBImage(); // 直接调用，不要提前设置 isBAnimating
    } else if (key === 'add') {
      this.chooseBImage(); // 通过 add-key-circle 上传图片
    } else if (key === 'b0') {
      this.likeCurrentImage(); // 点赞当前图片
    } else if (key === 'func') {
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
      // console.log(`切换到第 ${newIndex} 张图片`);
      // console.log(`当前小圆点索引: ${newIndex}`);
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
    // console.log(`点击小圆点，切换到第 ${dotIndex} 张图片`);
    // console.log(`当前小圆点索引: ${dotIndex}`);
  },

  //礼物相关的代码
  // 点击gift-button隐藏、显示礼物列表触摸开始事件
  handleTouchStart: function(e) {
    this.setData({
      startY: e.touches[0].clientY,
      lastMoveTime: Date.now()
    });
  },

  handleTouchMove: function(e) {
    const now = Date.now();
    // 节流处理：16ms内只执行一次（约60FPS）
    if (now - this.data.lastMoveTime < 16) return;
    
    const deltaY = e.touches[0].clientY - this.data.startY;
    const newTranslate = this.data.footerTranslate + deltaY;
    
    // 动态计算边界（转换为px）
    const systemInfo = wx.getSystemInfoSync();
    const maxTranslate = systemInfo.windowHeight - 260; // 320px为容器预估高度
    
    this.setData({
      footerTranslate: Math.max(0, Math.min(newTranslate, maxTranslate)),
      startY: e.touches[0].clientY,
      lastMoveTime: now
    });
  },

    // 添加预览按钮点击事件
  handlePreviewClick: function() {
    console.log('预览按钮被点击');
    // ... 预览逻辑
  },
  // 添加礼物按钮点击事件
  handleGiftClick: function() {
    console.log('礼物按钮被点击');
    
    // 先触发缩回动画
    this.setData({ isGifting: true });
    
    // 500ms后切换可见状态并触发展开动画
    setTimeout(() => {
      this.setData({
        leftGiftVisible: !this.data.leftGiftVisible,
        rightGiftVisible: !this.data.rightGiftVisible,
      }, () => {
        // 展开动画需要在下一个事件循环执行
        setTimeout(() => {
          this.setData({ isGifting: false });
        }, 50);
      });
    }, 500); // 与动画持续时间一致
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

  // 获取礼物记录
  getGiftRecords: function() {
    console.log('获取礼物记录...');
    const giftRecords = wx.getStorageSync('giftRecords') || [];
    this.setData({ giftRecords });
    console.log('礼物记录:', giftRecords); // 打印礼物记录
  },

  // 检查用户角色
  checkUserRole: function() {
    console.log('检查用户角色...');
    // 模拟获取用户角色
    wx.request({
      url: 'https://tcb-api.tencentcloudapi.com',
      method: 'GET',
      success: (res) => {
        if (res.data.role) {
          this.setData({ userRole: res.data.role });
          console.log('当前用户角色:', res.data.role); // 打印用户角色
        } else {
          this.setData({ userRole: 'VIP' }); // 设置默认角色为VIP
          console.log('当前用户角色:', this.data.userRole); // 打印默认角色
        }
      },
      fail: () => {
        this.setData({ userRole: 'VIP' }); // 设置默认角色为VIP
        console.log('当前用户角色:', this.data.userRole); // 打印默认角色
      }
    });
  },

  // 左侧滚动事件
  handleLeftScroll: function (e) {
    const scrollTop = e.detail.scrollTop;
    const itemHeight = 55; // 每个礼物项的高度（50px + 5px margin）
    const baseGiftCount = 6; // 基础礼物数量
    const singleSetHeight = baseGiftCount * itemHeight; // 一组礼物的总高度

    // 播放滚动音效
    this.playScrollSound();

    // 无限滚动逻辑：当滚动超过2组时，瞬间跳回到第1组的相同位置
    if (scrollTop >= singleSetHeight * 3) {
      // 滚动到第4组开始位置，跳回第2组
      const offset = scrollTop - singleSetHeight * 3;
      this.setData({
        leftScrollTop: singleSetHeight + offset
      });
    } else if (scrollTop < singleSetHeight) {
      // 滚动到第1组之前，跳到第3组
      const offset = singleSetHeight - scrollTop;
      this.setData({
        leftScrollTop: singleSetHeight * 3 - offset
      });
    }
  },
  
  // 右侧滚动事件
  handleRightScroll: function (e) {
    const scrollTop = e.detail.scrollTop;
    const itemHeight = 55; // 每个礼物项的高度（50px + 5px margin）
    const baseGiftCount = 6; // 基础礼物数量
    const singleSetHeight = baseGiftCount * itemHeight; // 一组礼物的总高度

    // 播放滚动音效
    this.playScrollSound();

    // 无限滚动逻辑：当滚动超过2组时，瞬间跳回到第1组的相同位置
    if (scrollTop >= singleSetHeight * 3) {
      // 滚动到第4组开始位置，跳回第2组
      const offset = scrollTop - singleSetHeight * 3;
      this.setData({
        rightScrollTop: singleSetHeight + offset
      });
    } else if (scrollTop < singleSetHeight) {
      // 滚动到第1组之前，跳到第3组
      const offset = singleSetHeight - scrollTop;
      this.setData({
        rightScrollTop: singleSetHeight * 3 - offset
      });
    }
  },

  // 播放滚动音效
  playScrollSound: function() {
    // 节流：避免频繁播放
    const now = Date.now();
    if (now - this.lastScrollSoundTime < 50) return; // 50ms 内只播放一次
    this.lastScrollSoundTime = now;

    // 创建音频上下文并播放滚动音效
    const innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA='; // 短促的滴答声
    innerAudioContext.volume = 0.3; // 音量设置为30%
    innerAudioContext.play();
    innerAudioContext.onEnded(() => {
      innerAudioContext.destroy();
    });
  },

  // 左侧礼物选择事件
  onSelectLeftGift(e) {
    const giftId = e.currentTarget.dataset.id;
    const leftGifts = this.data.leftGifts.map(item => {
      if (item.id === giftId) {
        item.selected = !item.selected; // 切换选中状态
      } else {
        item.selected = false; // 取消其他礼物的选中状态
      }
      return item;
    });

    // 更新左侧礼物列表和发送按钮状态
    this.setData({
      leftGifts,
      isLeftSendActive: leftGifts.some(item => item.selected),
      selectedLeftGift: leftGifts.find(item => item.selected) || null // 更新选中的礼物
    });
  },

  // 右侧礼物选择事件
  onSelectRightGift(e) {
    const giftId = e.currentTarget.dataset.id;
    const rightGifts = this.data.rightGifts.map(item => {
      if (item.id === giftId) {
        item.selected = !item.selected; // 切换选中状态
      } else {
        item.selected = false; // 取消其他礼物的选中状态
      }
      return item;
    });

    // 更新右侧礼物列表和发送按钮状态
    this.setData({
      rightGifts,
      isRightSendActive: rightGifts.some(item => item.selected),
      selectedRightGift: rightGifts.find(item => item.selected) || null // 更新选中的礼物
    });
  },

  // 左侧发送礼物事件
  onSendLeftGift() {
    const selectedGift = this.data.selectedLeftGift;
    if (selectedGift) {
      // 余额不足校验
      if (this.data.userBalance < selectedGift.price) {
        wx.showToast({
          title: '余额不足，请先充值',
          icon: 'none'
        });
        return;
      }

      this.setData({ isLeftSendActive: true }); // 激活左侧发送按钮
      // 模拟发送礼物
      console.log('发送左侧礼物:', selectedGift.name);
      // 删除这里的 sendGiftNotification 调用，避免重复
      this.playAnimation(selectedGift, 'left'); // 明确指定左侧

      const leftGifts = this.data.leftGifts.map(item => {
        item.selected = false;
        return item;
      });

      this.setData({
        leftGifts,
        isLeftSendActive: false,
        selectedLeftGift: null // 重置选中的礼物
      });
      this.sendGiftToServer(selectedGift); // 发送选中的礼物
    }
  },

  // 右侧发送礼物事件
  onSendRightGift() {
    if (!this.data.isRightSendActive) return; // 如果没有选中礼物，直接返回

    const selectedGift = this.data.selectedRightGift;
    if (selectedGift) {
      // 余额不足校验
      if (this.data.userBalance < selectedGift.price) {
        wx.showToast({
          title: '余额不足，请先充值',
          icon: 'none'
        });
        return;
      }

      // 模拟发送礼物
      console.log('发送右侧礼物:', selectedGift.name);
      // 删除这里的 sendGiftNotification 调用，避免重复
      this.playAnimation(selectedGift, 'right'); // 明确指定右侧
      // 重置右侧礼物选中状态和发送按钮状态
      const rightGifts = this.data.rightGifts.map(item => {
        item.selected = false;
        return item;
      });

      this.setData({
        rightGifts,
        isRightSendActive: false,
        selectedRightGift: null // 重置选中的礼物
      });
      this.sendGiftToServer(selectedGift); // 发送选中的礼物
    }
  },

  onShow: function() {
    const app = getApp();
    this.setData({
        myMsgBadge: app.globalData.unreadMsgCount || 0 // 显示未读消息计数
    });
    // 每次返回主页时同步最新余额
    this.getUserBalance();
  },


  // 模拟发送礼物到服务器
  sendGiftToServer: function(gift) {
    console.log('模拟发送礼物到服务器...');
    // 模拟API请求发送礼物
    const _this = this;
    setTimeout(() => {
        // 更新用户余额
        _this.updateUserBalance(-gift.price);
        // 添加礼物记录
        _this.addGiftRecord(gift);

        // 记录消费流水
        _this.addBalanceRecord('consume', -gift.price, `送出 ${gift.name}`);
        
        // 播放动画，确保根据状态播放动画
        if (_this.data.isLeftSendActive) {
            _this.playAnimation(gift, 'left'); // 左侧
        } else if (_this.data.isRightSendActive) {
            _this.playAnimation(gift, 'right'); // 右侧
        }

        // 直接使用本地时间（不再调整时区偏移）
        const now = new Date();
        const notification = {
            sender: 'Yeheya',
            receiver: _this.data.currentReceiver,
            giftName: gift.name,
            timestamp: now.toISOString() // 直接使用本地时间的ISO字符串
        };

        // 存入全局队列
        const app = getApp();
        app.globalData.notifications.push(notification);
        app.globalData.unreadMsgCount += 1;

        // 更新页面显示的未读红点
        _this.setData({ myMsgBadge: app.globalData.unreadMsgCount });

        // 打印状态
        // console.log('isLeftSendActive:', _this.data.isLeftSendActive);
        // console.log('isRightSendActive:', _this.data.isRightSendActive);
        // console.log('leftGiftAnimations:', _this.data.leftGiftAnimations);
        // console.log('rightGiftAnimations:', _this.data.rightGiftAnimations);

        // 根据发送的礼物来源，将礼物添加到相应的区域
        if (_this.data.isLeftSendActive) {
            // 左侧发送的礼物
            const newLeftGift = {
                id: _this.data.leftGifts.length + 1,
                image: gift.image,
                name: gift.name,
                price: gift.price,
                selected: false
            };
            _this.setData({
                leftGiftAnimations: [..._this.data.leftGiftAnimations, newLeftGift] // 添加到左侧动画区域
            });
        } else if (_this.data.isRightSendActive) {
            // 右侧发送的礼物
            const newRightGift = {
                id: _this.data.rightGifts.length + 1,
                image: gift.image,
                name: gift.name,
                price: gift.price,
                selected: false
            };
            _this.setData({
                rightGiftAnimations: [..._this.data.rightGiftAnimations, newRightGift] // 添加到右侧动画区域
            });
        }

        // 重置发送状态
        _this.setData({ 
            selectLeftGift: null, 
            selectRightGift: null,
            isSending: false 
        });
        console.log('礼物发送成功:', gift);
    }, 500);
  },

  // 更新用户余额（与全局 / 本地存储同步）
  updateUserBalance: function(amount) {
    const app = getApp();
    const newBalance = this.data.userBalance + amount;
    this.setData({ 
      userBalance: newBalance,
      myBalanceBadge: this.data.myBalanceBadge + 1 
    });
    app.globalData.userBalance = newBalance;
    wx.setStorageSync('userBalance', newBalance);
    console.log('更新后用户余额:', this.data.userBalance); // 打印更新后的余额
  },

  // 记录余额流水（消费）
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
  },

  // 添加礼物记录
  addGiftRecord: function(gift) {
    const newRecord = {
      id: this.data.giftRecords.length + 1,
      sender: 'yehya', // 当前发送者
      receiver: this.data.currentReceiver, // 当前接收者
      giftName: gift.name,
      quantity: 1,
      timestamp: new Date().toLocaleTimeString()
    };
    const updatedRecords = [...this.data.giftRecords, newRecord];
    this.setData({ giftRecords: updatedRecords });
    wx.setStorageSync('giftRecords', updatedRecords);
    console.log('添加礼物记录:', newRecord); // 打印添加的礼物记录
  },

  // 播放礼物动画
  playAnimation: function(gift, side) {
    console.log('播放动画，方向:', side); // 打印方向
    const newAnimation = {
        id: Date.now(), // 唯一ID
        image: gift.image
    };
    if (side === 'left') {
        this.setData({ 
            leftGiftAnimations: [...this.data.leftGiftAnimations, newAnimation] 
        });
    } else {
        this.setData({ 
            rightGiftAnimations: [...this.data.rightGiftAnimations, newAnimation] 
        });
    }
    
    // 5秒后清除对应动画
    setTimeout(() => {
        if (side === 'left') {
            this.setData({
                leftGiftAnimations: this.data.leftGiftAnimations.filter(item => item.id !== newAnimation.id)
            });
        } else {
            this.setData({
                rightGiftAnimations: this.data.rightGiftAnimations.filter(item => item.id !== newAnimation.id)
            });
        }
    }, 5000);
  },

  // 初始化WebSocket
  initWebSocket: function() {
    console.log('初始化WebSocket...');
    const socket = wx.connectSocket({
      url: 'wss://tcb-ws.tencentcloudapi.com'
    });

    socket.onMessage((res) => {
      const message = JSON.parse(res.data);
      if (message.type === 'gift') {
        console.log('WebSocket 收到消息:', message); // 打印WebSocket收到的消息
        this.playAnimation(message.gift, message.side); // 确保传递正确的方向
        this.addGiftRecord(message.gift);
      }
    });
  },

    // 初始化礼物列表
  initGifts: function () {
    const leftGifts = [
      { id: 1, name: '爱心', price: 5, image: '/Img/icons/heart.svg', forRole: ['普通用户', 'VIP'] },
      { id: 2, name: '玫瑰', price: 10, image: '/Img/icons/rose.svg', forRole: ['普通用户', 'VIP'] },
      { id: 3, name: '情侣', price: 10, image: '/Img/icons/couple.svg', forRole: ['普通用户', 'VIP'] },
      { id: 4, name: '咖啡', price: 15, image: '/Img/icons/coffee.svg', forRole: ['普通用户', 'VIP'] },
      { id: 5, name: '蛋糕', price: 20, image: '/Img/icons/cake.svg', forRole: ['普通用户', 'VIP'] },
      { id: 6, name: '电影票', price: 25, image: '/Img/icons/movie.svg', forRole: ['普通用户', 'VIP'] }
    ];
    const rightGifts = [
      { id: 7, name: '花束', price: 40, image: '/Img/icons/bouquet.svg', forRole: ['VIP'] },
      { id: 8, name: '戒指', price: 50, image: '/Img/icons/ring.svg', forRole: ['VIP'] },
      { id: 9, name: '婚礼蛋糕', price: 60, image: '/Img/icons/wedding-cake.svg', forRole: ['VIP'] },
      { id: 10, name: '小宝宝', price: 80, image: '/Img/icons/baby.svg', forRole: ['VIP'] },
      { id: 11, name: '房子', price: 100, image: '/Img/icons/house.svg', forRole: ['VIP'] },
      { id: 12, name: '蜜月旅行', price: 120, image: '/Img/icons/plane.svg', forRole: ['VIP'] }
    ];

    // 复制礼物列表以实现无限滚动（复制100份确保真正无限）
    const generateUniqueGifts = (gifts, copies) => {
      const uniqueGifts = [];
      for (let i = 0; i < copies; i++) {
        uniqueGifts.push(...gifts.map(gift => ({
          ...gift,
          id: `${gift.id}-${i}` // 生成唯一的 id
        })));
      }
      return uniqueGifts;
    };

    const leftGiftsList = generateUniqueGifts(leftGifts, 100);
    const rightGiftsList = generateUniqueGifts(rightGifts, 100);

    this.setData({
      leftGifts: leftGiftsList,
      rightGifts: rightGiftsList,
      leftScrollTop: leftGifts.length * 55 * 50, // 初始滚动到中间位置
      rightScrollTop: rightGifts.length * 55 * 50 // 初始滚动到中间位置
    });
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
  // 修改 navigateToMePage 函数以跳转到 settings 页面
  navigateToSettingsPage: function() {
    console.log('Navigating to Settings Page'); // 添加调试信息
    wx.navigateTo({
      url: '/pages/settings/settings', // 确保路径正确
      success: function() {
        console.log('Navigation to Settings Page successful');
      },
      fail: function(err) {
        console.error('Navigation to Settings Page failed', err);
      }
    });
  },
  // 处理 me-circle 点击事件
  handleMeCircleClick: function() {
    if (this.data.showMyKeys) {
      this.hideMyKeysSequentially();
      this.setData({ myMsgVisible: false }); // 隐藏 Msg 键时同时隐藏红点
    } else {
      this.setData({ showMyKeys: true, myMsgVisible: true }); // 显示 Msg 键
      this.showMyKeysSequentially();
    }
  },

  // 显示 myKeys 的函数
  showMyKeysSequentially: function() {
    const keys = this.data.myKeys;
    keys.forEach((key, index) => {
      setTimeout(() => {
        this.setData({
          [`${key}Visible`]: true,
        });
        // console.log(`${key} is now visible`); // 调试信息
      }, index * 200); // 每个键延迟200ms显示
    });
  },

  // 隐藏 myKeys 的函数
  hideMyKeysSequentially: function() {
    const keys = [...this.data.myKeys].reverse(); // 反转顺序
    keys.forEach((key, index) => {
      setTimeout(() => {
        this.setData({ [`${key}Visible`]: false });
      }, index * 200);
    });
    setTimeout(() => {
      this.setData({ showMyKeys: false });
    }, keys.length * 200);
  },

  navigateToMsgPage: function() {
    console.log('Navigating to Message Page');
    wx.navigateTo({
      url: '/pages/message/message', // 确保路径正确
      success: function() {
        console.log('Navigation to Message Page successful');
      },
      fail: function(err) {
        console.error('Navigation to Message Page failed', err);
      }
    });
  },

  navigateTouserBalancePage: function() {
    // console.log('Navigating to Balance Page');
    wx.navigateTo({
      url: '/pages/Balance/balance', // 确保路径正确
      success: function() {
        // console.log('Navigation to Balance Page successful');
      },
      fail: function(err) {
        // console.error('Navigation to Balance Page failed', err);
      }
    });
  },

  // 点赞图片功能
  likeCurrentImage: function() {
    const { currentBIndex, bImages, likedImages } = this.data;
    
    console.log('当前图片索引:', currentBIndex);
    console.log('已点赞图片列表:', likedImages);
    console.log('图片总数:', bImages.length);
    
    if (bImages.length === 0) {
      wx.showToast({
        title: '没有可点赞的图片',
        icon: 'none'
      });
      return;
    }

    // 检查当前图片是否已经点赞
    if (likedImages.includes(currentBIndex)) {
      wx.showToast({
        title: '已经点赞过了',
        icon: 'none'
      });
      return;
    }

    // 添加震动反馈
    wx.vibrateShort({
      type: 'medium'
    });

    // 将当前图片索引添加到点赞列表
    const updatedLikedImages = [...likedImages, currentBIndex];
    this.setData({ likedImages: updatedLikedImages });
    
    console.log('点赞后的列表:', updatedLikedImages);

    // 创建点赞通知
    const now = new Date();
    const notification = {
      type: 'like', // 标记为点赞类型
      sender: 'Yeheya',
      receiver: this.data.currentReceiver,
      imageIndex: currentBIndex + 1, // 图片序号从1开始
      timestamp: now.toISOString()
    };

    // 存入全局队列
    const app = getApp();
    app.globalData.notifications.push(notification);
    app.globalData.unreadMsgCount += 1;

    // 更新页面显示的未读红点
    this.setData({ myMsgBadge: app.globalData.unreadMsgCount });

    // 显示点赞成功提示
    wx.showToast({
      title: '点赞成功',
      icon: 'success',
      duration: 1500
    });

    console.log('点赞了第', currentBIndex + 1, '张图片');
  },

  // 添加图片到 .b-photo-area
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

    // 动画完成后清理（优化为0.6s）
    setTimeout(() => {
      this.finishRestoreAnimation(index);
    }, 600);
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
    
    // 添加轻微震动反馈
    wx.vibrateShort({
      type: 'light'
    });
    
    this.setData({
      draggingIndex: e.currentTarget.dataset.index,
      startX: e.touches[0].pageX,
      startY: e.touches[0].pageY,
      translateX: 0,
      translateY: 0,
      rotation: 0,
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
    
    // 添加旋转效果：根据水平位移计算旋转角度（最大15度）
    const rotation = (distanceX / 10) * 0.5;
    
    // 显示方向标签
    const showLikeLabel = distanceX > 80;
    const showDislikeLabel = distanceX < -80;
    
    this.setData({
      opacity,
      translateX: distanceX,
      translateY: distanceY,
      rotation: Math.max(-15, Math.min(15, rotation)),
      showLikeLabel,
      showDislikeLabel
    });
  },

  // 图片触摸结束事件
  onImageTouchEnd(e) {
    if (this.data.isBAnimating) return; // 如果正在动画中，不处理拖拽
    const { startX, startY, threshold, currentBIndex, bImages, startTime, rotation } = this.data;
    const endX = e.changedTouches[0].pageX;
    const endY = e.changedTouches[0].pageY;
    const distanceX = endX - startX;
    const distanceY = endY - startY;

    if (Math.abs(distanceX) > threshold || Math.abs(distanceY) > threshold) {
      // 计算拖拽速度
      const endTime = Date.now();
      const dragDuration = endTime - startTime;
      const dragSpeed = Math.sqrt(distanceX ** 2 + distanceY ** 2) / dragDuration;

      // 根据拖拽速度动态调整动画时间
      const animationDuration = Math.max(200, Math.min(500, 500 / dragSpeed));

      this.setData({
        isBAnimating: true
      });

      // 将当前图片滑出屏幕，旋转角度加倍，飞得更远
      const finalRotation = rotation * 2;
      this.setData({
        translateX: distanceX * 3,
        translateY: distanceY * 3,
        rotation: finalRotation,
        opacity: 0,
        showLikeLabel: false,
        showDislikeLabel: false
      });

      // 记录滑出方向（角度）
      const angle = Math.atan2(distanceY, distanceX);

      // 延迟一段时间后，更新 currentBIndex 和 lastPicture
      setTimeout(() => {
        const lastPicture = [...this.data.lastPicture];
        lastPicture.push({
          index: currentBIndex,
          translateX: distanceX * 3,
          translateY: distanceY * 3,
          rotation: finalRotation,
          opacity: 0,
          angle: angle
        });

        const newIndex = (currentBIndex + 1) % bImages.length;

        this.setData({
          currentBIndex: newIndex,
          translateX: 0,
          translateY: 0,
          rotation: 0,
          opacity: 1,
          isBAnimating: false,
          lastPicture: lastPicture,
          draggingIndex: null
        });

        console.log('被滑走的当前照片序号:', currentBIndex);
      }, animationDuration);
    } else {
      // 如果没有超过阈值，图片回到原位
      this.setData({
        translateX: 0,
        translateY: 0,
        rotation: 0,
        opacity: 1,
        showLikeLabel: false,
        showDislikeLabel: false,
        draggingIndex: null
      });
    }
  },

  // 切换到上一张图片
  prevBImage() {
    const { lastPicture, bImages, isBAnimating } = this.data;
    
    // 防止快速连续点击
    if (isBAnimating) {
      console.log('动画进行中，忽略操作');
      return;
    }
    
    if (lastPicture.length > 0) {
      // 添加震动反馈
      wx.vibrateShort({
        type: 'medium'
      });
      
      const { index, translateX, translateY, angle } = lastPicture.pop();

      // 根据滑出角度计算滑入的初始位置
      const screenWidth = wx.getSystemInfoSync().windowWidth;
      const screenHeight = wx.getSystemInfoSync().windowHeight;

      // 计算从屏幕外的初始位置
      const distance = Math.max(screenWidth, screenHeight) * 2;
      const initialTranslateX = Math.cos(angle) * distance;
      const initialTranslateY = Math.sin(angle) * distance;

      console.log('返回照片：', index, '从位置飞回:', initialTranslateX, initialTranslateY);
      
      this.setData({
        restoringIndex: index,
        restoringTranslateX: initialTranslateX,
        restoringTranslateY: initialTranslateY,
        restoringOpacity: 0.3,
        disableRestoringTransition: true,
        isBAnimating: true
      });

      setTimeout(() => {
        this.setData({
          disableRestoringTransition: false
        });
        
        setTimeout(() => {
          this.smoothAnimation(initialTranslateX, initialTranslateY, index);
        }, 20);
      }, 20);
    } else {
      console.log('lastPicture 为空，无法返回上一张照片');
      
      // 添加错误震动反馈
      wx.vibrateShort({
        type: 'heavy'
      });
      
      this.setData({
        isBAnimating: false,
        showFirstImageMessage: true
      });

      setTimeout(() => {
        this.setData({
          showFirstImageMessage: false
        });
      }, 2000);
    }
  }
});