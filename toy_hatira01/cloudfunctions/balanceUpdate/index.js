// cloudfunctions/balanceUpdate/index.js
var cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
var db = cloud.database();

exports.main = function(event, context) {
  var uid = event.uid;
  var amount = event.amount;
  var type = event.type || 'consume';
  var remark = event.remark || '';

  if (!uid) return Promise.reject(new Error('uid is required'));
  if (typeof amount !== 'number' || amount === 0) return Promise.reject(new Error('amount is required and must be non-zero'));

  var usersCollection = db.collection('users');
  var recordsCollection = db.collection('balance_records');

  return usersCollection.where({ uid: uid }).get().then(function(res) {
    if (!res.data || res.data.length === 0) {
      return Promise.reject(new Error('user not found'));
    }

    var user = res.data[0];
    var currentBalance = typeof user.balance === 'number' ? user.balance : 0;
    var newBalance = currentBalance + amount;

    if (newBalance < 0) {
      return Promise.reject(new Error('insufficient balance'));
    }

    var record = {
      uid: uid,
      type: type,
      amount: amount,
      balanceAfter: newBalance,
      remark: remark,
      timestamp: new Date()
    };

    return Promise.all([
      usersCollection.doc(user._id).update({ data: { balance: newBalance, updatedAt: new Date() } }),
      recordsCollection.add({ data: record })
    ]).then(function(results) {
      record._id = results[1]._id;
      return { code: 0, newBalance: newBalance, record: record };
    });
  });
};
