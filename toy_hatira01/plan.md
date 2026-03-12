# 瞎记 (Hatira) - 项目规划文档

## 项目概述

**项目名称**: 瞎记 (Hatira)  
**项目类型**: 微信小程序  
**应用ID**: wx6c58716a3b7600ae  
**主要功能**: 社交记忆分享平台，支持图片、音乐、礼物赠送和消息通知

---

## 核心功能模块

### 1. 首页 (Index Page)
**路径**: `pages/index/index`

**主要功能**:
- 图片轮播展示（A区域 - 自动轮播，B区域 - 手动滑动）
- 音乐选择与播放（支持网易云音乐小程序集成）
- 多语言支持（中文、英文、维吾尔语、土耳其语）
- 礼物赠送系统（左右两侧礼物列表，无限滚动）
- 点赞功能（记录已点赞图片）
- 图片下载功能
- 消息和余额提醒（红点显示）
- 功能键菜单（func键展开/收回）
- 用户菜单（me键展开/收回）

**关键特性**:
- 图片拖拽动画（支持旋转、透明度变化、方向标签）
- 撤销操作（undo键恢复已滑出的图片）
- 礼物动画效果（左右两侧独立动画）
- 实时余额同步
- WebSocket集成（接收实时礼物消息）

---

### 2. 记录页面 (Record Page)
**路径**: `pages/Record/Record`

**主要功能**:
- 图片上传与管理（A区域 - 自动轮播，B区域 - 手动滑动）
- 音乐选择与播放
- 多语言支持
- 功能键菜单（删除、撤销等）
- 图片拖拽删除功能

**关键特性**:
- 简化版的首页功能（无礼物系统、无消息系统）
- 专注于个人记录管理
- 支持图片批量上传（最多50张）

---

### 3. 消息页面 (Message Page)
**路径**: `pages/message/message`

**主要功能**:
- 显示所有通知消息
- 消息类型支持：
  - 点赞通知（谁赞了谁的第几张图片）
  - 礼物通知（谁送了什么礼物）
- 时间戳格式化显示
- 未读消息计数

**消息格式**:
```javascript
{
  type: 'like' | 'gift',
  sender: string,
  receiver: string,
  imageIndex?: number,
  giftName?: string,
  timestamp: ISO8601
}
```

---

### 4. 余额页面 (Balance Page)
**路径**: `pages/Balance/balance`

**主要功能**:
- 显示当前用户余额
- 余额流水记录展示
- 充值功能（集成微信支付）
- 流水类型：充值(recharge)、消费(consume)

**流水记录格式**:
```javascript
{
  type: 'recharge' | 'consume',
  amount: number,
  balanceAfter: number,
  remark: string,
  timestamp: ISO8601
}
```

---

### 5. 设置页面 (Settings Page)
**路径**: `pages/settings/settings`

**主要功能**:
- 账户设置
  - 我要记录（跳转到Record页面）
  - 历史记录（跳转到Historical-record页面）
  - 绑定手机号
  - 账号注销
- 通知设置
  - 礼物通知开关
  - 余额变动提醒开关
- 头像管理（跳转到头像页面）

---

### 6. 头像页面 (Avatar Page)
**路径**: `pages/touxiang/touxiang`

**主要功能**:
- 头像选择与更新
- 支持三种操作：
  - 拍照
  - 从相册选择
  - 保存当前头像到相册
- 头像三级存储同步（页面数据、全局数据、本地存储）

---

### 7. 历史记录页面 (Historical Record Page)
**路径**: `pages/Historical-record/hist-record`

**主要功能**:
- 当前为空白页面（待开发）
- 预期功能：显示用户的历史操作记录

---

## 全局数据管理

### App.js 全局数据结构

```javascript
globalData: {
  userInfo: {
    avatar: string,           // 用户头像路径
    nickname: string,         // 用户昵称
    uid: string              // 用户ID
  },
  unreadMsgCount: number,     // 未读消息计数
  notifications: [],          // 通知队列
  userBalance: number,        // 用户余额
  balanceRecords: []          // 余额流水记录
}
```

### 本地存储 (wx.setStorageSync)

- `userAvatar`: 用户头像路径
- `userBalance`: 用户余额
- `balanceRecords`: 余额流水记录数组
- `giftRecords`: 礼物赠送记录数组

---

## 礼物系统

### 礼物列表

**左侧礼物** (普通用户可用):
1. 爱心 - 5币
2. 玫瑰 - 10币
3. 情侣 - 10币
4. 咖啡 - 15币
5. 蛋糕 - 20币
6. 电影票 - 25币

**右侧礼物** (VIP用户可用):
7. 花束 - 40币
8. 戒指 - 50币
9. 婚礼蛋糕 - 60币
10. 小宝宝 - 80币
11. 房子 - 100币
12. 蜜月旅行 - 120币

### 礼物赠送流程

1. 用户选择礼物
2. 系统检查余额是否充足
3. 扣除相应币值
4. 生成礼物动画
5. 创建通知消息
6. 记录礼物流水
7. 更新全局数据和本地存储

---

## 多语言支持

支持语言:
- 中文 (zh)
- 英文 (en)
- 维吾尔语 (ug)
- 土耳其语 (tr)

关键词翻译:
- 音乐 / Music / مۇزىكا / Müzik
- 消息 / Messages / ئۇچۇرلار / Mesajlar
- 余额 / Balance / پۇل قالدۇقى / Bakiye
- 设置 / Settings / تەڭشەك / Ayarlar

---

## 权限需求

```json
{
  "camera": "需要使用相机拍照",
  "album": "需要访问相册选择图片"
}
```

---

## 技术栈

- **框架**: 微信小程序原生框架
- **语言**: JavaScript (ES6+)
- **样式**: WXSS (微信样式表)
- **模板**: WXML (微信标记语言)
- **库版本**: libVersion 3.14.2
- **编译**: 支持ES6、PostCSS、代码压缩

---

## 组件结构

### 自定义组件

**navigation-bar** (`components/navigation-bar/`)
- 自定义导航栏组件
- 包含文件: .js, .json, .wxml, .wxss

### 资源文件

**图标** (`Img/icons/`):
- 心形、玫瑰、情侣、咖啡、蛋糕、电影、花束、戒指、婚礼蛋糕、宝宝、房子、飞机等

**图片** (`Img/images/`):
- 用户头像、装饰图片等

---

## 页面流程图

```
首页 (index)
├── 消息页面 (message) - 通过myMsg键
├── 余额页面 (balance) - 通过myBalance键
├── 设置页面 (settings) - 通过mysetting键
│   ├── 记录页面 (Record)
│   ├── 历史记录页面 (hist-record)
│   └── 头像页面 (touxiang)
└── 记录页面 (Record) - 通过settings菜单

记录页面 (Record)
└── 返回首页或设置页面
```

---

## 关键功能实现细节

### 1. 图片拖拽动画系统

- **触摸事件**: onImageTouchStart → onImageTouchMove → onImageTouchEnd
- **动画参数**: translateX, translateY, rotation, opacity
- **撤销机制**: lastPicture数组记录滑出图片信息
- **恢复动画**: 根据滑出角度计算飞回轨迹

### 2. 礼物无限滚动

- 复制礼物列表100份实现无限滚动
- 滚动超过3组时自动跳回中间位置
- 节流处理滚动事件（16ms）
- 滚动音效反馈

### 3. 消息通知系统

- 全局通知队列 (app.globalData.notifications)
- 未读计数同步 (app.globalData.unreadMsgCount)
- 时间戳格式化显示
- WebSocket实时消息接收

### 4. 余额管理

- 三级存储同步（页面、全局、本地）
- 流水记录自动生成
- 支付前余额校验
- 实时余额更新

---

## 已知问题与待优化项

1. **Historical-record页面**: 当前为空白，需要实现历史记录功能
2. **WebSocket连接**: 当前为模拟实现，需要连接真实服务器
3. **支付集成**: 微信支付参数需要真实配置
4. **用户角色检查**: 当前为模拟实现，需要从服务器获取

---

## 开发建议

1. **代码优化**: 考虑提取重复的动画逻辑到工具函数
2. **性能优化**: 大量图片加载时考虑虚拟滚动
3. **错误处理**: 增强网络请求的错误处理
4. **测试覆盖**: 添加单元测试和集成测试
5. **文档完善**: 补充API文档和使用说明

---

## 部署信息

- **小程序ID**: wx6c58716a3b7600ae
- **编译类型**: miniprogram
- **库版本**: 3.14.2
- **Sitemap**: sitemap.json

---

*文档生成时间: 2026-03-12*
*项目路径: /d:/hatiraProject/YHY_hatirasi/toy_hatira01*

