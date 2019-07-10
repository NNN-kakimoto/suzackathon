const functions = require('firebase-functions');
const admin = require('firebase-admin');
require('dotenv').config();
var request = require("request");

// db connect
if (!admin.apps.length) {
  admin.initializeApp()
}

// line function
const replyMessage = (message, replyToken) => {
  let body = JSON.stringify({
    type: 'message',
    replyToken: replyToken,
    messages: [{
      type: "text",
      text: message
    }]
  });
  let headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer '+process.env.LINE_CHANNEL_ACCESS_TOKEN
  }
  return new Promise((resolve, reject ) => {
    request.post({
      url: 'https://api.line.me/v2/bot/message/reply',
      headers: headers,
      body: body
    },(err, response, body)=> {
      console.log('reply'+ body);
    });
  });
}

const sendMessage = (text_message, card_message, userIds) => {
  if(userIds == []) {
    userIds = ['U1bfcefbaef4e2ca549b80436e62d5aab']
  }
  let body = JSON.stringify({
    type: 'message',
    to: userIds,
    messages: [{
      type: "text",
      text: text_message
    },{
      type: "flex",
      "altText": text_message,
      "contents": card_message,
    }]
  });
  let headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer '+process.env.LINE_CHANNEL_ACCESS_TOKEN
  }
  return new Promise((resolve, reject ) => {
    request.post({
      url: 'https://api.line.me/v2/bot/message/multicast',
      headers: headers,
      body: body
    },(err, response, body)=> {
      console.log('reply'+ body);
    });
  });
}

const setJsonMessage = (event) => {
  return {
    "type": "bubble",
    "styles": {
      "footer": {
        "separator": true
      }
    },
    "body": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "text",
          "text": "SCHEDULE",
          "weight": "bold",
          "color": "#1DB446",
          "size": "sm"
        },
        {
          "type": "text",
          "text": event.title,
          "weight": "bold",
          "size": "xxl",
          "margin": "md"
        },
        {
          "type": "text",
          "text": event.date,
          "color": "#a9a9a9",
          "size": "xl",
          "weight": "bold",
          "margin": "md"
        },
        {
          "type": "separator",
          "margin": "xxl"
        },
        {
          "type": "text",
          "text": event.detail,
          "margin": "md"
        },
        {
          "type": "separator",
          "margin": "xxl"
        },
        {
          "type": "text",
          "text": "参加者",
          "size": "xxs",
          "margin": "md"
        },
        {
          "type": "text",
          "text": event.members.join(','),
          "margin": "md"
        },
        {
          "type": "separator",
          "margin": "xxl"
        },
        {
          "type": "box",
          "layout": "vertical",
          "margin": "xxl",
          "spacing": "sm",
          "contents": [
            {
              "type": "box",
              "layout": "horizontal",
              "contents": [
                {
                  "type": "text",
                  "text": "開始時間",
                  "size": "sm",
                  "color": "#555555",
                  "flex": 0
                },
                {
                  "type": "text",
                  "text": event.start_time,
                  "size": "sm",
                  "color": "#111111",
                  "align": "end"
                }
              ]
            },
            {
              "type": "box",
              "layout": "horizontal",
              "contents": [
                {
                  "type": "text",
                  "text": "予算",
                  "size": "sm",
                  "color": "#555555",
                  "flex": 0
                },
                {
                  "type": "text",
                  "text": "￥"+ event.budget.toLocaleString()+" / 人",
                  "size": "sm",
                  "color": "#111111",
                  "align": "end"
                }
              ]
            }
          ]
        }
      ]
    }
  };
}


exports.helloWorld = functions.region('asia-northeast1').https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});
exports.testdatabase = functions.region('asia-northeast1').https.onRequest((request, response) => {
  const table = admin.database().ref('events/')
  table.once("value").then(data => { response.send(data) } )
});
exports.lineNotice = functions.region('asia-northeast1').https.onRequest((request, response) => {
  console.log(request.query)
  const request_ids = request.query.ids;
  const event_key = request.query.event;
  if(request_ids == [] || event_key ==""){
    return response.status(400).send('bad params');
  }
  // eventの存在チェック
  let event_table = admin.database().ref('events/'+event_key)
  event_table.once("value", ( get_event => {
    if(get_event == null){
      return response.status(400).send('bad params');
    }else{
      let text_message = 'イベントが通知されました!';
      let messageJson = setJsonMessage(get_event.val());

      // user の存在チェック
      let valid_users = [];
      console.log(request_ids)
      request_ids.map( id => {
        admin.database().ref('users/'+id).once("value", user => {
          if(user.val() != null){
            valid_users.push(id)
          }
        });
      });
      console.log(valid_users);
      sendMessage(text_message, messageJson, request_ids);
      response.send('send message')
    }
  }));
});
exports.lineWebhook = functions.region('asia-northeast1').https.onRequest((request, response) => {
  console.log(request.body.events);
  let event = request.body.events[0];
  let replyToken = request.body.events[0].replyToken
  if (event.type == 'message') {
    console.log('message recieve');
    if(event.message.text.match(/登録/)){
      console.log('register process');
      const lineId =event.source.userId;
      let name = event.message.text.replace('登録', '').replace(' ', '').replace('　', '');
      let db = admin.database();
      db.ref('users/'+lineId).once("value").then(user => {
        if(null == user.val()){
          let updates = {};
          updates[lineId] = { name: name };
          admin.database().ref('users/').update(updates);
          console.log('save', updates);
          replyMessage(name+'さんを登録しました!', replyToken);
        }else{
          console.log('user exists', lineId);
          replyMessage(name+'さんは登録されていました!', replyToken);
        }
      });
    }else {
      console.log('general message');
      console.log(event.message.text);
      replyMessage(event.message.text + 'には対応できていません。', replyToken);
    }
    
  }else if( event.type = "follow"){
    console.log('follow event');
  }else{
    console.log('other event')
  }
});