# suzackathon

> My impressive Nuxt.js project

## Build Setup

``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build

# generate static project
$ npm run generate
$ firebase deploy

# function modifyed
$ firebase deploy --only functions
$ firebase deploy --only functions:<function name>

# functions local test
$ cd functions
$ functions-emulator start
$ functions-emulator deploy <function name> -H

```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).



# まだなとこ
- LINE通知
  - LINE アプリを作成
  - 携帯から表示名入力でDBにUIDと一緒に保存
  - スケジュールページから送信機能実装
- 参加メンバーをテーブルから読み込む