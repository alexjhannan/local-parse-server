'use strict';

var Parse = require('parse/node').Parse;

Parse.Cloud.define('hello', function (req, res) {
  res.success('Hello world!');
});

Parse.Cloud.beforeSave('BeforeSaveFail', function (req, res) {
  res.error('You shall not pass!');
});

Parse.Cloud.beforeSave('BeforeSaveFailWithPromise', function (req, res) {
  var query = new Parse.Query('Yolo');
  query.find().then(function () {
    res.error('Nope');
  }, function () {
    res.success();
  });
});

Parse.Cloud.beforeSave('BeforeSaveUnchanged', function (req, res) {
  res.success();
});

Parse.Cloud.beforeSave('BeforeSaveChanged', function (req, res) {
  req.object.set('foo', 'baz');
  res.success();
});

Parse.Cloud.afterSave('AfterSaveTest', function (req) {
  var obj = new Parse.Object('AfterSaveProof');
  obj.set('proof', req.object.id);
  obj.save();
});

Parse.Cloud.beforeDelete('BeforeDeleteFail', function (req, res) {
  res.error('Nope');
});

Parse.Cloud.beforeSave('BeforeDeleteFailWithPromise', function (req, res) {
  var query = new Parse.Query('Yolo');
  query.find().then(function () {
    res.error('Nope');
  }, function () {
    res.success();
  });
});

Parse.Cloud.beforeDelete('BeforeDeleteTest', function (req, res) {
  res.success();
});

Parse.Cloud.afterDelete('AfterDeleteTest', function (req) {
  var obj = new Parse.Object('AfterDeleteProof');
  obj.set('proof', req.object.id);
  obj.save();
});

Parse.Cloud.beforeSave('SaveTriggerUser', function (req, res) {
  if (req.user && req.user.id) {
    res.success();
  } else {
    res.error('No user present on request object for beforeSave.');
  }
});

Parse.Cloud.afterSave('SaveTriggerUser', function (req) {
  if (!req.user || !req.user.id) {
    console.log('No user present on request object for afterSave.');
  }
});

Parse.Cloud.define('logIn', function (req, res) {
  var account = req.params.account;

  Parse.User.logIn(account.email, account.password, {
    success(user) {
      res.success(user);
      // TODO: Leaving this logout in here to be safe; may affect multiple users running this function simultaneously
      Parse.User.logOut();
    },
    error() {
      res.error('Cannot log in with those credentials.');
    }
  });
});

Parse.Cloud.define('requiredParameterCheck', function (req, res) {
  res.success();
}, function (params) {
  return params.name;
});