const functions = require('firebase-functions');
const admin = require('firebase-admin');
require('dotenv').config();
var request = require("request");

// db connect
if (!admin.apps.length) {
  admin.initializeApp()
}

// line function
const sendMessage = (message, replyToken) => {
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


exports.helloWorld = functions.region('asia-northeast1').https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});
exports.testdatabase = functions.region('asia-northeast1').https.onRequest((request, response) => {
  const table = admin.database().ref('events/')
  table.once("value").then(data => { response.send(data) } )
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
          sendMessage(name+'さんを登録しました!', replyToken);
        }else{
          console.log('user exists', lineId);
          sendMessage(name+'さんは登録されていました!', replyToken);
        }
      });
    }else {
      console.log('general message');
      console.log(event.message.text);
      sendMessage(event.message.text + 'には対応できていません。', replyToken);
    }
    
  }else if( event.type = "follow"){
    console.log('follow event');
  }else{
    console.log('other event')
  }
});