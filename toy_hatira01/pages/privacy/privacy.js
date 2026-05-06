var balanceUtils = require('../../utils/balance.js');
Page({
  data: {
    containerStyle: '',
    privacyContent: ''
  },

  onLoad() {
    // 添加登录检查（可选，隐私政策通常不需要登录）
    // if (!getApp().checkLogin("privacy")) return;
    
    this.loadPrivacyContent();
    this.getUserBalance();
    this.updateGradient();
  },

  loadPrivacyContent() {
    const content = `# 隐私政策

## 1. 我们收集的信息
- **用户基本信息**：昵称、头像、用户ID
- **设备信息**：设备型号、操作系统版本、网络状态
- **使用数据**：功能使用情况、页面访问记录
- **内容数据**：您上传的图片、选择的音乐

## 2. 信息使用目的
- 提供和优化产品功能
- 个性化内容推荐
- 安全防护和反欺诈
- 产品改进和数据分析

## 3. 信息存储和保护
- 数据存储在中国境内服务器
- 采用加密技术保护用户数据
- 严格限制内部访问权限
- 定期进行安全审计

## 4. 信息共享
我们不会向任何第三方出售或共享您的个人信息，除非：
- 获得您的明确同意
- 法律法规要求
- 为履行合同所必需

## 5. 您的权利
- 访问、更正个人信息
- 删除账户和相关数据
- 撤回同意
- 投诉和举报

## 6. Cookie和类似技术
我们使用本地存储技术来：
- 保持登录状态
- 存储用户偏好设置
- 提升用户体验

## 7. 儿童隐私保护
本产品不面向14岁以下儿童。如发现儿童个人信息，请联系我们删除。

## 8. 隐私政策更新
我们会适时更新隐私政策，并通过应用内通知告知用户。

## 9. 联系我们
如有隐私相关问题，请联系：privacy@hatira.com

最后更新日期：2026年5月4日`;
    
    this.setData({ privacyContent: content });
  },

  getUserBalance: function() {
    balanceUtils.getUserBalance();
  },

  updateGradient: function() {
    balanceUtils.updateGradient(this);
  }
});