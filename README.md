# exapp
Node.js、DynamoDBを使用したREST APIのサンプル

## 使い方

### DaynamoDBにテーブル作成
- テーブル名：USERS
- パーティションキー：userId

### AWSのクレデンシャルファイルを作成
- C:\Users\[user]\.aws\credentials

[default]<br />
aws_access_key_id = xx<br />
aws_secret_access_key = xx<br />

### ファイル取得
- git clone https://github.com/abewataru/nodejs-sample.git
- cd exapp
- npm install

### 実行
- node .\bin\www

## API

### ユーザ一覧取得
- GET - http://localhost:3000/users

### ユーザ情報取得
- GET - http://localhost:3000/users/[userId]

### ユーザ登録
- PUT - http://localhost:3000/users/[userId]
- Body
{
"userName": "xx",
"grade": 4,
"section": "xx",
"email": "xx@xx.xx",
"userId": "1234"
}

### ユーザ削除
- DELETE - http://localhost:3000/users/[userId]
