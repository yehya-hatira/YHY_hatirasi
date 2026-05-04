# 用户认证和登录功能实现文档

## 概述
本文档记录了"瞎记"(Hatira)小程序的用户认证和登录功能的完整实现。基于微信小程序的最佳实践，采用微信授权登录模式，无需传统用户名密码注册。

## 功能特性

### 1. 登录方式
- **微信一键登录**：通过微信授权获取用户信息
- **手机号+验证码登录**：支持手动输入手机号和验证码登录
- **自动登录状态恢复**：应用启动时自动恢复之前的登录状态

### 2. 登录状态管理
- **全局状态管理**：通过`app.globalData`管理用户登录状态
- **本地存储同步**：登录状态、用户信息、余额等数据持久化到本地存储
- **登录有效期**：3分钟自动过期（可配置），过期后自动跳转到登录页面
- **多页面状态同步**：所有需要登录的页面都能正确检查和处理登录状态

### 3. 安全性保障
- **页面级登录检查**：所有敏感页面在加载时自动检查登录状态
- **未登录跳转**：未登录用户访问受保护页面时自动跳转到登录页面
- **退出登录清理**：退出登录时清除所有本地存储数据

## 实现细节

### 全局登录检查函数 (`app.js`)
```javascript
checkLogin(fromPage) {
  if (this.isLoginValid()) return true;
  var url = fromPage
    ? '/pages/login/login?from=' + encodeURIComponent(fromPage)
    : '/pages/login/login';
  wx.navigateTo({ url: url });
  return false;
}
```

### 登录有效性验证 (`app.js`)
```javascript
isLoginValid() {
  if (!this.globalData.isLoggedIn) return false;
  var loginTime = wx.getStorageSync('loginTime');
  if (!loginTime) return false;
  var elapsed = Date.now() - loginTime;
  if (elapsed > this.LOGIN_EXPIRE_MS) {
    // 登录已过期，清除状态
    this.globalData.isLoggedIn = false;
    wx.removeStorageSync('isLoggedIn');
    wx.removeStorageSync('loginTime');
    return false;
  }
  return true;
}
```

### 受保护的页面列表
以下页面已添加登录检查，在`onLoad`或`onShow`时调用`checkLogin()`：

1. **消息页面** (`pages/message/message.js`)
2. **余额页面** (`pages/Balance/balance.js`)  
3. **设置页面** (`pages/settings/settings.js`)
4. **头像页面** (`pages/touxiang/touxiang.js`)
5. **记录页面** (`pages/Record/Record.js`)

### 退出登录功能
- **位置**：设置页面 → 账户设置 → 退出登录
- **功能**：调用`app.logout()`清除所有用户数据并跳转到首页
- **确认机制**：弹出确认对话框防止误操作

## 数据存储结构

### 全局数据 (`app.globalData`)
```javascript
globalData: {
  userInfo: {
    avatar: string,           // 用户头像路径
    nickname: string,         // 用户昵称  
    uid: string,              // 用户ID
    phone: string,            // 手机号（可选）
    displayPhone: string      // 显示用手机号（脱敏）
  },
  isLoggedIn: boolean,        // 登录状态
  unreadMsgCount: number,     // 未读消息计数
  notifications: [],          // 通知队列
  userBalance: number,        // 用户余额
  balanceRecords: []          // 余额流水记录
}
```

### 本地存储键值
- `isLoggedIn`: 登录状态标识
- `loginTime`: 登录时间戳（用于过期检查）
- `userInfo`: 完整用户信息对象
- `userUid`: 用户唯一标识
- `userAvatar`: 用户头像路径
- `userBalance`: 用户余额
- `balanceRecords`: 余额流水记录数组

## 使用流程

### 1. 首次访问
- 用户打开小程序
- 自动跳转到登录页面
- 选择微信一键登录或手机号登录
- 登录成功后跳转到首页

### 2. 已登录状态
- 应用启动时自动恢复登录状态
- 访问受保护页面时直接显示内容
- 3分钟内无操作会自动过期

### 3. 登录过期
- 访问任何受保护页面时检测到过期
- 自动跳转到登录页面
- 登录成功后返回原页面

### 4. 退出登录
- 在设置页面点击"退出登录"
- 确认后清除所有用户数据
- 自动跳转到首页（未登录状态）

## 测试验证

### 功能测试清单
- [x] 微信一键登录功能正常
- [x] 手机号+验证码登录功能正常  
- [x] 登录状态自动恢复功能正常
- [x] 登录过期自动跳转功能正常
- [x] 所有受保护页面登录检查正常
- [x] 退出登录功能正常
- [x] 本地数据存储和同步正常
- [x] 无语法错误和运行时错误

## 注意事项

1. **登录有效期**：当前设置为3分钟，可根据实际需求调整`LOGIN_EXPIRE_MS`常量
2. **首次登录奖励**：新用户首次登录会获得500币的初始余额
3. **头像默认值**：未设置头像时使用默认头像`/Img/images/hui_touxiang.png`
4. **手机号脱敏**：显示手机号时自动进行脱敏处理（如188****1234）

## 版本信息
- **实现日期**: 2026-05-04
- **开发者**: Lingma (灵码)
- **适用版本**: 微信小程序基础库 3.14.2+

---
*本文档由系统自动生成，记录了用户认证功能的完整实现细节*