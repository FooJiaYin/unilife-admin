const functions = require("firebase-functions");
const f = require('./function')

// f.getChatStats()
// f.sendNotification('FHHdN4XzS4ZSKHksDKYiXIFaJtj1', {title: 'yy', body:'本週已經成功配對聊天室，馬上開始和新朋友聊天吧！', data: {}})

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// exports.addMessage = functions.https.onRequest(async (req, res) => {
//     // Grab the text parameter.
//     const original = req.query.text;
//     // Push the new message into Firestore using the Firebase Admin SDK.
//     const writeResult = await admin.firestore().collection('messages').add({original: original});
//     // Send back a message that we've successfully written the message
//     res.json({result: `Message with ID: ${writeResult.id} added.`});
// });

// exports.sendNotification = functions.https.onRequest(async (req, res) => {
//     // Grab the text parameter.
//     console.log(req.query.title, req.query.body)
//     f.sendNotification(req.query.uid, {title: req.query.title, body: req.query.body})
//     // const original = req.query.text;
//     // // Push the new message into Firestore using the Firebase Admin SDK.
//     // const writeResult = await admin.firestore().collection('messages').add({original: original});
//     // // Send back a message that we've successfully written the message
//     res.json({response: 'OK', request: {uid: req.query.uid, title: req.query.title}});
//   });
  
exports.sendNotification = functions.https.onCall((data, context) => {
    console.log(data.uid, data.message)
    f.sendNotification(data.uid, data.message)
    return {response: 'OK', request: data}
})

exports.getArticleMeta = functions.https.onCall(async (data, context) => {
    const result = await f.getArticleMeta(data) 
    console.log(result.result)
    return result.result
})

// async function sendNotification(uid, message) {
//     let user = await admin.firestore().doc('users/' + req.query.uid).get()
//     let token = user.data().pushToken
//     let message = req.query.uid
//     if (!token || token == '') return
//     message.to = token
//     message.sound = 'default'

//     await fetch('https://exp.host/--/api/v2/push/send', {
//         method: 'POST',
//         headers: {
//             Accept: 'application/json',
//             'Accept-encoding': 'gzip, deflate',
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(message),
//     });
// }
