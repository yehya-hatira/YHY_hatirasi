// utils/balance.js
// Shared balance utility functions used across all pages.

/**
 * Sync balance from localStorage to globalData.
 * @param {Object} pageInstance - The Page instance (for optional gradient update)
 * @returns {number} The current balance
 */
function getUserBalance(pageInstance) {
  var app = getApp();
  var savedBalance = wx.getStorageSync('userBalance');
  if (typeof savedBalance === 'number' && !isNaN(savedBalance)) {
    app.globalData.userBalance = savedBalance;
  }
  if (pageInstance && pageInstance.setData) {
    pageInstance.setData({ userBalance: app.globalData.userBalance });
  }
  return app.globalData.userBalance;
}

/**
 * Update gradient background based on current balance.
 * Sets the --stop-position CSS variable on the page container.
 * @param {Object} pageInstance - The Page instance (must have setData)
 */
function updateGradient(pageInstance) {
  var app = getApp();
  var balance = app.globalData.userBalance;
  var percent = 95 - (balance / 1000) * 85;
  pageInstance.setData({
    containerStyle: '--stop-position: ' + percent + '%'
  });
}

module.exports = {
  getUserBalance: getUserBalance,
  updateGradient: updateGradient
};
