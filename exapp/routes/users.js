var express = require('express');
var httpStatus = require('http-status-codes');
var aws = require('aws-sdk');
var proxy = require('proxy-agent');
var router = express.Router();

aws.config.update({
  region:'ap-northeast-1',
  httpOptions: { agent: proxy('http://xxxx:8080') }
});
var dynamoClient = new aws.DynamoDB.DocumentClient();

/*
  ユーザ一覧の取得
*/
router.get('/', function(req, res, next) {

  //DynamoDBから全ユーザ取得
  dynamoClient.scan({TableName:'USERS'}, function (err, data) {

    if (err) {
      console.error(err);
      res.status(httpStatus.INTERNAL_SERVER_ERROR);
      res.send();
    }
    else {
      var users = data.Items;

      res.header('Content-Type', 'application/json; charset=utf-8');
      res.send(users);
    }
  });
});

/*
  ユーザ詳細の取得
*/
router.get('/:userId', function(req, res, next) {

  var params = {
    TableName:'USERS', Key:{'userId':req.params.userId}
  };

  //DynamoDBからユーザを取得
  dynamoClient.get(params, function (err, data) {
    if (err) {
      console.error(err);
      res.status(httpStatus.INTERNAL_SERVER_ERROR);
      res.send();
    }
    else {
      //ユーザが取得できたか？
      if ('Item' in data) {
        res.header('Content-Type', 'application/json; charset=utf-8');
        res.send(data.Item);
      }
      else {
        res.status(httpStatus.NOT_FOUND);
        res.send();
      }
    }
  });
});

/*
  ユーザの登録
*/
router.put('/:userId', function(req, res, next) {

  var user = req.body;

  if ('userId' in user && user.userId != req.params.userId) {
    res.status(httpStatus.BAD_REQUEST);
    res.send();
    return;
  }
  else {
    user.userId = req.params.userId;
  }

  var params = {
    TableName:'USERS',
    Item: user
  }

  //DynamoDBへユーザを登録
  dynamoClient.put(params, function(err, data) {

    if (err) {
      console.error(err);
      res.status(httpStatus.INTERNAL_SERVER_ERROR);
      res.send();
    }
    else {
    console.log(data);
      res.status(httpStatus.CREATED);
      res.send(req.params.userId);
    }
  });
});
/*
  ユーザの削除
*/
router.delete('/:userId', function(req, res, next) {

  var params = {
    TableName:'USERS', Key: {'userId':req.params.userId}
  };

  //ユーザの存在確認
  dynamoClient.get(params, function (err, data) {

    if (err) {
      console.error(err);
      res.status(httpStatus.INTERNAL_SERVER_ERROR);
      res.send();
    }
    else {
      //ユーザが取得できたか？
      if ('Item' in data) {
        //DynamoDBからユーザを削除
        dynamoClient.delete(params, function(err, data) {

          if (err) {
            console.error(err);
            res.status(httpStatus.NOT_FOUND);
            res.send(req.params.userId);
          }
          else {
            res.status(httpStatus.NO_CONTENT);
            res.send();
          }
        });
      }
      else {
        res.status(httpStatus.NOT_FOUND);
        res.send();
      }
    }
  });
});

module.exports = router;
