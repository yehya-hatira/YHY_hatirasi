# 瞎记 (Hatira) 小程序 - 完整功能补完记录

## 时间：2026年5月6日

---

## 一、修复的关键 Bug

### 1. 设置页面所有菜单点击无效
- **文件**：`pages/settings/settings.wxml`
- **原因**：`bindtap="{{item.event}}"` 是小程序不支持的动态绑定写法
- **修复**：改为 `bindtap="handleAccountSettingTap"` + `data-event="{{item.event}}"` 的方式

### 2. 首页和记录页删除按钮无功能
- **文件**：`pages/index/index.js`、`pages/Record/Record.js`
- **原因**：`handleKeyClick` 里 `dele` 键只隐藏菜单，没执行删除逻辑
- **修复**：添加 `deleteCurrentImage()` 方法，含中/英/维/土四种语言的确认弹窗，确认后从数组中删除当前图片，震动反馈+提示

### 3. 导航栏组件 home 按钮无响应
- **文件**：`components/navigation-bar/navigation-bar.js`
- **原因**：WXML 绑定了 `bindtap="home"` 但 JS 里没有 `home()` 方法
- **修复**：添加 `home()` 方法，调用 `wx.reLaunch` 回到首页

### 4. 历史记录页面无登录拦截
- **文件**：`pages/Historical-record/hist-record.js`
- **原因**：缺少 `checkLogin()`，未登录用户可直接访问
- **修复**：在 `onLoad` 开头添加 `if (!getApp().checkLogin("hist-record")) return;`

### 5. Record 页面硬编码文本
- **文件**：`pages/Record/Record.wxml`
- **原因**：`<text>langu</text>` 硬编码，不随语言切换变化
- **修复**：改为 `<text>{{i18n[currentLang].language}}</text>`

### 6. 送礼物产生重复通知
- **文件**：`pages/index/index.js`
- **原因**：手动 push 了 `app.globalData.notifications`，然后 `dataService.saveNotification()` 内部又 push 了一次，每条通知被加了两次
- **修复**：删除手动 push，统一走 `dataService.saveNotification()`，只写一次

### 7. 余额为负仍可送礼物
- **文件**：`pages/index/index.js`
- **原因**：校验用的是 `this.data.userBalance`，但 `updateUserBalance()` 只更新了全局变量和本地存储，没更新页面 data。第一笔交易后页面余额值就过时了
- **修复**：`updateUserBalance()` 加 `this.setData({ userBalance: newBalance })`，每笔交易实时刷新页面余额

### 8. 送一个礼物记账两次
- **文件**：`pages/index/index.js`、`utils/data-service.js`
- **原因**：`updateUserBalance()` 里调了 `dataService.updateBalance()`（既改余额又记流水），然后 `addBalanceRecord()` 又调一次。余额被双重扣减、流水重复记录
- **修复**：职责分离——`updateUserBalance()` 只负责改余额不动流水；`addBalanceRecord()` 调用新增的 `dataService.saveBalanceRecord()` 只记流水不改余额

### 9. 消息页通知记录数和红点数不匹配
- **文件**：`pages/message/message.js`
- **原因**：`loadNotifications` 先格式化数据显示一遍（时间戳变 "12:30"），又调 `dataService.getNotifications()` 拉同一份数据（ISO 格式），去重 key 比对失败，每条记录显示了两次
- **修复**：删除多余的第二遍拉取合并逻辑，直接读 `globalData` 显示即可

---

## 二、新增的云同步基础设施

### 统一数据访问层
**文件**：`utils/data-service.js`

提供一个统一入口管理所有数据的读写，目前使用本地存储（wx.Storage），等云环境开通后填入环境ID即可自动切换到云数据库。涵盖：

| 功能 | 方法 | 说明 |
|------|------|------|
| 用户资料 | `getUserProfile / saveUserProfile` | 读取/保存用户头像、昵称、手机号 |
| 余额查询 | `getBalance` | 获取当前余额 |
| 余额变更 | `updateBalance` | 改余额并自动记流水 |
| 余额流水 | `getBalanceRecords / saveBalanceRecord` | 查流水 / 纯记流水不改余额 |
| 礼物记录 | `saveGiftRecord / getGiftRecords` | 保存/查询送礼记录 |
| 通知消息 | `saveNotification / getNotifications` | 保存/查询通知 |
| 未读计数 | `getUnreadCount / markAllRead` | 获取未读数 / 全部标已读 |

### 共享余额工具
**文件**：`utils/balance.js`

提取了所有页面都重复的 `getUserBalance` 和 `updateGradient` 两个函数，9个页面统一引用。

### 云函数
| 云函数 | 目录 | 用途 |
|--------|------|------|
| userLogin | `cloudfunctions/userLogin/` | 用户注册/登录，云端存储用户信息 |
| balanceUpdate | `cloudfunctions/balanceUpdate/` | 余额变更，带原子操作防并发 |
| syncData | `cloudfunctions/syncData/` | 通用数据同步，支持增删改查计数 |

### 云数据库设计
| 集合名 | 存储内容 |
|--------|----------|
| `users` | 用户资料：uid、昵称、头像、手机号、余额 |
| `balance_records` | 余额流水：充值/消费类型、金额、余额快照、备注 |
| `gift_records` | 礼物记录：送礼人、收礼人、礼物名、价格 |
| `notifications` | 通知消息：点赞/礼物类型、发送方、接收方、已读状态 |

---

## 三、新建的文件

| 文件 | 说明 |
|------|------|
| `utils/data-service.js` | 统一数据访问层（本地+云端双写） |
| `utils/balance.js` | 余额和渐变背景的共享工具函数 |
| `cloudfunctions/userLogin/index.js` | 用户登录注册云函数 |
| `cloudfunctions/userLogin/package.json` | 云函数依赖配置 |
| `cloudfunctions/balanceUpdate/index.js` | 余额变更云函数 |
| `cloudfunctions/balanceUpdate/package.json` | 云函数依赖配置 |
| `cloudfunctions/syncData/index.js` | 通用数据同步云函数 |
| `cloudfunctions/syncData/package.json` | 云函数依赖配置 |

---

## 四、修改过的页面

| 页面 | 变更内容 |
|------|----------|
| `pages/index/index.js` | 引入 dataService 和 balanceUtils；修复重复通知、余额校验、重复记账三个 bug |
| `pages/login/login.js` | 登录成功后调用 dataService 同步用户资料到云端 |
| `pages/message/message.js` | 修复消息重复显示 bug；使用 dataService 标记已读 |
| `pages/Balance/balance.js` | 余额查询/变更/流水全部改用 dataService |
| `pages/Historical-record/hist-record.js` | 添加登录拦截；加载历史记录优先用 dataService，云端失败自动降级到本地 |
| `pages/Record/Record.js` | 添加删除当前图片功能；使用 balanceUtils |
| `pages/Record/Record.wxml` | 修复硬编码文本为 i18n |
| `pages/settings/settings.wxml` | 修复事件绑定写法 |
| `pages/settings/settings.js` | 使用 balanceUtils |
| `pages/touxiang/touxiang.js` | 使用 balanceUtils |
| `pages/privacy/privacy.js` | 使用 balanceUtils |
| `app.js` | 添加云开发初始化 `wx.cloud.init()` |
| `project.config.json` | 添加云函数根目录配置 |

---

## 五、你需要手动完成的操作

1. **开通云开发**：微信开发者工具 → 云开发 → 创建环境
2. **填入环境 ID**（两处）：
   - `utils/data-service.js` 第 5 行 → `CLOUD_ENV_ID`
   - `app.js` 第 90 行 → `wx.cloud.init({ env: '你的环境ID' })`
3. **部署云函数**：在 `cloudfunctions/` 下每个文件夹右键 → "上传并部署"
4. **创建数据库集合**：在云开发控制台 → 数据库 → 新建 `users`、`balance_records`、`gift_records`、`notifications`
5. **设置权限**：每个集合的权限设为"仅创建者可读写"

---

## 六、验证结果

- 全部 15 个 JS 文件通过语法检查
- 所有页面保持原有 UI 布局和交互不变
- 本地存储 key 全部兼容，不丢数据
- 在有云环境 ID 之前，所有功能完全走本地存储，不影响使用
