// utils/data-service.js
// Unified data access layer for Hatira mini program.
// Supports two modes: 'local' (wx.Storage) and 'cloud' (wx.cloud.DB).
// Set CLOUD_ENV_ID to your WeChat Cloud environment ID to enable cloud mode.

var CLOUD_ENV_ID = '';
var MODE = CLOUD_ENV_ID ? 'cloud' : 'local';

var app = null;
function getAppInstance() {
  if (!app) app = getApp();
  return app;
}

// ===== Cloud Helpers =====

function cloudDB() {
  return wx.cloud.database();
}

function collection(name) {
  return cloudDB().collection(name);
}

function cloudQuery(collectionName, condition, opts) {
  opts = opts || {};
  var q = collection(collectionName).where(condition || {});
  if (opts.orderBy) q = q.orderBy(opts.orderBy, opts.order || 'desc');
  if (opts.limit) q = q.limit(opts.limit);
  if (opts.skip) q = q.skip(opts.skip);
  return q.get();
}

// ===== User =====

function getUserProfile(uid) {
  if (MODE === 'cloud') {
    return cloudQuery('users', { uid: uid }, { limit: 1 }).then(function(res) {
      if (res.data && res.data.length > 0) return res.data[0];
      return null;
    }).catch(function() {
      return localGetUserProfile(uid);
    });
  }
  return Promise.resolve(localGetUserProfile(uid));
}

function localGetUserProfile(uid) {
  var info = wx.getStorageSync('userInfo');
  if (info && info.uid === uid) return info;
  return null;
}

function saveUserProfile(uid, profile) {
  if (MODE === 'cloud') {
    return cloudQuery('users', { uid: uid }, { limit: 1 }).then(function(res) {
      if (res.data && res.data.length > 0) {
        return collection('users').doc(res.data[0]._id).update({
          data: {
            nickname: profile.nickname,
            avatar: profile.avatar,
            phone: profile.phone || '',
            updatedAt: new Date()
          }
        });
      } else {
        return collection('users').add({
          data: {
            uid: uid,
            nickname: profile.nickname,
            avatar: profile.avatar,
            phone: profile.phone || '',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
      }
    }).catch(function() {
      localSaveUserProfile(uid, profile);
    });
  }
  localSaveUserProfile(uid, profile);
  return Promise.resolve();
}

function localSaveUserProfile(uid, profile) {
  var existing = wx.getStorageSync('userInfo') || {};
  var merged = Object.assign({}, existing, profile, { uid: uid });
  wx.setStorageSync('userInfo', merged);
  var appInst = getAppInstance();
  if (appInst && appInst.globalData) {
    appInst.globalData.userInfo = merged;
  }
}

// ===== Balance =====

function getBalance(uid) {
  if (MODE === 'cloud') {
    return cloudQuery('users', { uid: uid }, { limit: 1 }).then(function(res) {
      if (res.data && res.data.length > 0 && typeof res.data[0].balance === 'number') {
        return res.data[0].balance;
      }
      return localGetBalance();
    }).catch(function() {
      return localGetBalance();
    });
  }
  return Promise.resolve(localGetBalance());
}

function localGetBalance() {
  var saved = wx.getStorageSync('userBalance');
  if (typeof saved === 'number' && !isNaN(saved)) return saved;
  var appInst = getAppInstance();
  return appInst ? appInst.globalData.userBalance : 1000;
}

function updateBalance(uid, amount, type, remark) {
  var newBalance = localGetBalance() + amount;
  wx.setStorageSync('userBalance', newBalance);
  var appInst = getAppInstance();
  if (appInst && appInst.globalData) {
    appInst.globalData.userBalance = newBalance;
  }

  var record = {
    type: type,
    amount: amount,
    balanceAfter: newBalance,
    remark: remark || '',
    timestamp: new Date().toISOString()
  };
  addBalanceRecordLocal(record);

  if (MODE === 'cloud') {
    try {
      collection('balance_records').add({
        data: {
          uid: uid,
          type: type,
          amount: amount,
          balanceAfter: newBalance,
          remark: remark || '',
          timestamp: new Date()
        }
      });
      collection('users').where({ uid: uid }).update({
        data: { balance: newBalance, updatedAt: new Date() }
      });
    } catch (e) {
      // Cloud write failed, already saved locally
    }
  }
  return Promise.resolve(newBalance);
}

function saveBalanceRecord(uid, record) {
  addBalanceRecordLocal({
    type: record.type,
    amount: record.amount,
    balanceAfter: record.balanceAfter,
    remark: record.remark || '',
    timestamp: record.timestamp || new Date().toISOString()
  });

  if (MODE === 'cloud') {
    try {
      collection('balance_records').add({
        data: {
          uid: uid,
          type: record.type,
          amount: record.amount,
          balanceAfter: record.balanceAfter,
          remark: record.remark || '',
          timestamp: new Date()
        }
      });
    } catch (e) {}
  }
  return Promise.resolve();
}

function addBalanceRecordLocal(record) {
  var existing = wx.getStorageSync('balanceRecords') || [];
  existing.push(record);
  wx.setStorageSync('balanceRecords', existing);
  var appInst = getAppInstance();
  if (appInst && appInst.globalData) {
    appInst.globalData.balanceRecords = existing;
  }
}

function getBalanceRecords(uid) {
  if (MODE === 'cloud') {
    return cloudQuery('balance_records', { uid: uid }, { orderBy: 'timestamp', order: 'desc' }).then(function(res) {
      return (res.data || []).map(function(item) {
        item.timestamp = item.timestamp instanceof Date ? item.timestamp.toISOString() : item.timestamp;
        return item;
      });
    }).catch(function() {
      return localGetBalanceRecords();
    });
  }
  return Promise.resolve(localGetBalanceRecords());
}

function localGetBalanceRecords() {
  return wx.getStorageSync('balanceRecords') || [];
}

// ===== Gift Records =====

function saveGiftRecord(uid, record) {
  localSaveGiftRecord(record);
  if (MODE === 'cloud') {
    try {
      collection('gift_records').add({
        data: {
          uid: uid,
          senderName: record.senderName || record.sender,
          receiverName: record.receiverName || record.receiver,
          giftName: record.giftName,
          giftImage: record.giftImage || '',
          price: record.price || 0,
          timestamp: new Date()
        }
      });
    } catch (e) {
      // Cloud write failed, already saved locally
    }
  }
  return Promise.resolve();
}

function localSaveGiftRecord(record) {
  var existing = wx.getStorageSync('giftRecords') || [];
  existing.push(record);
  wx.setStorageSync('giftRecords', existing);
}

function getGiftRecords(uid) {
  if (MODE === 'cloud') {
    return cloudQuery('gift_records', { uid: uid }, { orderBy: 'timestamp', order: 'desc' }).then(function(res) {
      return (res.data || []).map(function(item) {
        item.timestamp = item.timestamp instanceof Date ? item.timestamp.toISOString() : item.timestamp;
        return item;
      });
    }).catch(function() {
      return localGetGiftRecords();
    });
  }
  return Promise.resolve(localGetGiftRecords());
}

function localGetGiftRecords() {
  return wx.getStorageSync('giftRecords') || [];
}

// ===== Notifications =====

function saveNotification(uid, notification) {
  localSaveNotification(notification);
  if (MODE === 'cloud') {
    try {
      collection('notifications').add({
        data: {
          uid: uid,
          type: notification.type || 'gift',
          sender: notification.sender,
          receiver: notification.receiver,
          imageIndex: notification.imageIndex || null,
          giftName: notification.giftName || null,
          timestamp: new Date(),
          read: false
        }
      });
    } catch (e) {
      // Cloud write failed, already saved locally
    }
  }
  return Promise.resolve();
}

function localSaveNotification(notification) {
  var appInst = getAppInstance();
  if (appInst && appInst.globalData) {
    appInst.globalData.notifications.push(notification);
    appInst.globalData.unreadMsgCount = (appInst.globalData.unreadMsgCount || 0) + 1;
  }
}

function getNotifications(uid) {
  if (MODE === 'cloud') {
    return cloudQuery('notifications', { uid: uid }, { orderBy: 'timestamp', order: 'desc', limit: 100 }).then(function(res) {
      return (res.data || []).map(function(item) {
        item.timestamp = item.timestamp instanceof Date ? item.timestamp.toISOString() : item.timestamp;
        return item;
      });
    }).catch(function() {
      return localGetNotifications();
    });
  }
  return Promise.resolve(localGetNotifications());
}

function localGetNotifications() {
  var appInst = getAppInstance();
  return (appInst && appInst.globalData) ? appInst.globalData.notifications : [];
}

function getUnreadCount(uid) {
  if (MODE === 'cloud') {
    return cloudQuery('notifications', { uid: uid, read: false }).then(function(res) {
      return res.data ? res.data.length : 0;
    }).catch(function() {
      return localGetUnreadCount();
    });
  }
  return Promise.resolve(localGetUnreadCount());
}

function localGetUnreadCount() {
  var appInst = getAppInstance();
  return (appInst && appInst.globalData) ? appInst.globalData.unreadMsgCount : 0;
}

function markAllRead(uid) {
  localMarkAllRead();
  if (MODE === 'cloud') {
    try {
      collection('notifications').where({ uid: uid, read: false }).update({
        data: { read: true }
      });
    } catch (e) {
      // Cloud update failed
    }
  }
  return Promise.resolve();
}

function localMarkAllRead() {
  var appInst = getAppInstance();
  if (appInst && appInst.globalData) {
    appInst.globalData.unreadMsgCount = 0;
  }
}

module.exports = {
  getUserProfile: getUserProfile,
  saveUserProfile: saveUserProfile,
  getBalance: getBalance,
  updateBalance: updateBalance,
  saveBalanceRecord: saveBalanceRecord,
  getBalanceRecords: getBalanceRecords,
  saveGiftRecord: saveGiftRecord,
  getGiftRecords: getGiftRecords,
  saveNotification: saveNotification,
  getNotifications: getNotifications,
  getUnreadCount: getUnreadCount,
  markAllRead: markAllRead
};
