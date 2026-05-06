// cloudfunctions/userLogin/index.js
var cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
var db = cloud.database();

exports.main = function(event, context) {
  var nickName = event.nickName || '用户';
  var avatarUrl = event.avatarUrl || '';
  var phone = event.phone || '';
  var uid = event.uid;

  if (!uid) {
    return Promise.reject(new Error('uid is required'));
  }

  var usersCollection = db.collection('users');

  return usersCollection.where({ uid: uid }).get().then(function(res) {
    if (res.data && res.data.length > 0) {
      // Existing user — update profile
      var user = res.data[0];
      return usersCollection.doc(user._id).update({
        data: {
          nickname: nickName,
          avatar: avatarUrl,
          phone: phone,
          updatedAt: new Date()
        }
      }).then(function() {
        return { action: 'update', uid: uid, userInfo: Object.assign({}, user, { nickname: nickName, avatar: avatarUrl, phone: phone }) };
      });
    } else {
      // New user — create
      var newUser = {
        uid: uid,
        nickname: nickName,
        avatar: avatarUrl,
        phone: phone,
        balance: 500,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      return usersCollection.add({ data: newUser }).then(function(addRes) {
        newUser._id = addRes._id;
        return { action: 'create', uid: uid, userInfo: newUser };
      });
    }
  });
};
