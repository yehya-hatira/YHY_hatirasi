// cloudfunctions/syncData/index.js
var cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
var db = cloud.database();

exports.main = function(event, context) {
  var uid = event.uid;
  var collectionName = event.collection;
  var operation = event.operation;
  var data = event.data || {};

  if (!uid) return Promise.reject(new Error('uid is required'));
  if (!collectionName) return Promise.reject(new Error('collection is required'));
  if (!operation) return Promise.reject(new Error('operation is required'));

  var col = db.collection(collectionName);

  switch (operation) {
    case 'get':
      return col.where(Object.assign({}, data.where || {}, { uid: uid }))
        .orderBy(data.orderBy || 'timestamp', data.order || 'desc')
        .limit(data.limit || 100)
        .skip(data.skip || 0)
        .get()
        .then(function(res) {
          return { code: 0, data: res.data, count: res.data.length };
        });

    case 'add':
      return col.add({ data: Object.assign({}, data, { uid: uid, timestamp: new Date() }) })
        .then(function(res) {
          return { code: 0, id: res._id };
        });

    case 'update':
      if (!data.id) return Promise.reject(new Error('id is required for update'));
      return col.doc(data.id).update({ data: data.fields || {} })
        .then(function() {
          return { code: 0 };
        });

    case 'remove':
      if (!data.id) return Promise.reject(new Error('id is required for remove'));
      return col.doc(data.id).remove()
        .then(function() {
          return { code: 0 };
        });

    case 'count':
      return col.where(Object.assign({}, data.where || {}, { uid: uid })).count()
        .then(function(res) {
          return { code: 0, count: res.total };
        });

    default:
      return Promise.reject(new Error('unknown operation: ' + operation));
  }
};
