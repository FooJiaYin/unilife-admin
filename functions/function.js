var fetch = require('node-fetch');
var ogs = require('open-graph-scraper');
var admin = require('firebase-admin');
        
var serviceAccount = require("./service-account-file.json");

const defaultApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // credential: admin.credential.applicationDefault(),
    databaseURL: "https://gleaming-bot-319115-default-rtdb.firebaseio.com"
});

// Retrieve services via the defaultApp variable...
let defaultAuth = defaultApp.auth();
let defaultDatabase = defaultApp.database();

// importAccounts()
// sendAllNotification({title: '小攸提醒：把握時間互動，並參與下一輪配對', body:'本輪以及過去兩周的聊天室將統一於八點關閉，請各位把握最後時間互動，並開啟聊天室配對卡片，參與下一輪配對！', data: {}})
// sendAllNotification({title: '小攸提醒：想要參與下一輪配對？馬上開啟配對卡片！', body:'想要參與下一輪配對？繼續在UniLife上認識相同校園生活圈的朋友，馬上打開App將聊天室配對卡片開啟吧！', data: {}})
// sendAllNotification({title: '本周配對已開放登記，馬上報名認識新朋友', body:'馬上就要開學了，想在開學前認識相同生活圈的好友？馬上打開UniLife，開啟聊天室配對卡片吧！', data: {}})
// sendNotification('FHHdN4XzS4ZSKHksDKYiXIFaJtj1', {title: '配對成功', body:'本週已經成功配對聊天室，馬上開始和新朋友聊天吧！', data: {}})
// setUserRole("yulin1136@gmail.com", "editor")
setNewChatrooms()
// changeEmail("blueink@gmail.com", "blueink0910@gmail.com")
// importDepartments(community)
// getChatStats()
// match()
// getArticleMeta({url: "https://www.thenewslens.com/article/156173"})
// createChatroom('test', true)
// setChatroomCount()
// setChatroomActive()
// setShortcuts()
// setMatchedUsers()
// resetMatchedUsers()
// checkEmptyChatHistory()
// setAllArticles()

exports.sendNotification = sendNotification
exports.getArticleMeta = getArticleMeta
exports.getChatStats = getChatStats


async function sendNotification(uid, message) {
    let user = await admin.firestore().doc('users/' + uid).get()
    let token = user.data().pushToken
    if (!token || token == '') return
    message.to = token
    message.sound = 'default'

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
}

async function sendAllNotification(message) {
    admin.firestore().collection('users').get().then(querySnapshot => {
        querySnapshot.forEach(snapshot => {
            const data = snapshot.data()
            if(data.settings.chat == false && data.verification.status == true) sendNotification(snapshot.id, message) // console.log(snapshot.id, data.settings, data.verification)
            // sendNotification(snapshot.id, message)
        });
    })
}

async function getArticleMeta(options) {
    // return await ogs(options)
    let data = await ogs(options)
    // console.log('result:', data.result); // This contains all of the Open Graph results
        // console.log('response:', response); // This contains the HTML of page
    return data;
}

function checkEmptyChatHistory() {
    admin.firestore().collection('users').get().then(querySnapshot => {
        querySnapshot.forEach((doc) => {
            doc.ref.collection('chatHistory').get().then(querySnapshot => {
                querySnapshot.forEach((snapshot) => {
                    admin.firestore().collection('chatrooms').doc(snapshot.id).get().then(snapshot_ => {
                        if(!snapshot_.exists) console.log(snapshot_.id, snapshot_.exists, doc.id)  
                    })
                })
            })
        });
    })
}

function importAccounts() {
    var i = 0

    const json = require("./data/users.json");
    json.forEach(item => {
        admin.auth().createUser({
            email: item.email,
            emailVerified: true,
            password: 'ypo58anu',
            displayName: item.name,
            disabled: false,
        })
        .then((user) => {
            // See the UserRecord reference doc for the contents of userRecord.
            i+=1
            console.log('Successfully created new user:', user.uid, item.name, item.email, i);
            const uid = user.uid
            const data = {
                id: uid,
                info: {
                    email: item.email,
                    name: item.name,
                    nickname: '',
                    profileImage: "profile-image-0.png"
                },
                identity: {
                    community: item.community,
                },
                settings: {
                    chat: false,
                },
                verification: {
                    type: "file",
                    status: true,
                },
            }
            admin.firestore().collection('users')
                .doc(uid)
                .set(data)
                .catch((error) => {
                    alert(error)
                })
        })
    })
}

function changeEmail(oldEmail, newEmail) {
    admin.auth().getUserByEmail(oldEmail)
        .then((user) => {
            admin.auth().updateUser(user.uid, {
                ...user,
                email: newEmail,
              })
            // console.log("Successfully fetched user data: " + user.uid);
        })
        .catch((error) => {
            console.log('Error fetching user data:', error);
        })
    
    admin.firestore().collection('users').where('info.email', '==', oldEmail).get().then(querySnapshot =>
        querySnapshot.forEach(snapshot => {
            const data = snapshot.data()
            snapshot.ref.update({
                info: {
                    ...data.info,
                    email: newEmail,
                }
            })
        })
    )
}

async function setUserRole(email, role) {
    let user = await admin.auth().getUserByEmail(email)
    admin.auth().setCustomUserClaims(user.uid, { role: role });
}

// function createTempUsers() {
//     const json = require("./users.json");
//     json.forEach(item => {.then((user) => {
//         // See the UserRecord reference doc for the contents of userRecord.
//         i+=1
//         console.log('Successfully created new user:', user.uid, item.name, item.email, i);
//         const uid = user.uid
//         const data = {
//             id: uid,
//             info: {
//                 email: item.email,
//                 name: item.name,
//                 nickname: '',
//                 profileImage: "profile-image-0.png"
//             },
//             identity: {
//                 community: item.community,
//             },
//             settings: {
//                 chat: false,
//             },
//             verification: {
//                 type: "file",
//                 status: true,
//             },
//         }
//         admin.firestore().collection('users')
//             .doc(uid)
//             .set(data)
//             .catch((error) => {
//                 alert(error)
//             })
//     })
// }

function importDepartments(community) {
    const json = require("./departments.json");
    json.forEach(item => {
        admin.firestore().doc('communities/' + community).collection('departments').doc(item.id.toString()).set({name: item.name})
    })
}

function changeCommunity() {
    admin.firestore().collection('users').where('identity.community', '==', 'ntcu').get().then(querySnapshot =>
        querySnapshot.forEach(snapshot =>
            snapshot.ref.update({identity: {community: 'nctu'}})
        )
    )
}

async function createChatroom(community, triggerMatch = false) {
    let junior = []
    let senior = []
    admin.firestore().collection('users')
        .where('identity.community', '==', community)
        .where('settings.inChat', '!=', true)
        .where('settings.chat', '==', true)
        .get().then(querySnapshot => {
            // let i=0
            querySnapshot.forEach(async snapshot => {
                const data = await snapshot.data()
                if (data.settings.chat == true) {
                    if (data.identity.grade == 1) junior.push({id: snapshot.id, g: data.identity.grade})
                    else if (data.identity.grade > 1) senior.push({id: snapshot.id, g: data.identity.grade})
                }
            })
        }).then(async () => {
            junior = junior.sort((a, b) => 0.5 - Math.random());
            senior = senior.sort((a, b) => 0.5 - Math.random());
            let total = junior.length + senior.length
            let len = Math.floor(total / 3)
            if (senior.length < len) {
                console.log("Too many junior")
                len = senior.length
            }
            if (junior.length < len) {
                console.log("Too many senior")
                len = junior.length
            }
            let offset = junior.length > len? junior.length % len : 0
            console.log(community, ": senior", senior.length, "junior", junior.length, "total", total, "len", len, "offset", offset)
            if (triggerMatch) {
                for (var i = 0; i < len; i++) {
                    let users = []
                    users.push(junior[i].id)
                    users.push(senior[i].id)
                    if (junior.length > i + len) users.push(junior[i + len].id)
                    else if (senior.length > i + len - offset) users.push(senior[i + len - offset].id)
                    console.log(community, users)
                    let newChatroom = await admin.firestore().collection('chatrooms').add({
                        users: users,
                        startedAt: admin.firestore.Timestamp.now(),
                        memberCount: 3,
                        community: community,
                        messageCount: 0,
                        active: true
                    })
                    const data = {
                        startedAt: admin.firestore.Timestamp.now(),
                        chatroom: newChatroom.id,
                        unreadCount: 0,
                    }
                    for (var u of users) {
                        admin.firestore().doc('users/' + u).update({ settings: { chat: false, inChat: true }})
                        admin.firestore().doc('users/' + u).collection('chatHistory').doc(newChatroom.id).set(data)
                        sendNotification(u, {title: '配對成功', body:'本週已經成功配對聊天室，馬上開始和新朋友聊天吧！', data: {}})
                    }
                }
            }
        })
}

function getChatStats() {
    admin.firestore().collection('communities').get().then(querySnapshot =>
        querySnapshot.forEach(snapshot =>  
            createChatroom(snapshot.id, false)
        )
    )
}

function match() { 
    admin.firestore().collection('communities').get().then(querySnapshot =>
        querySnapshot.forEach(snapshot =>  
            createChatroom(snapshot.id, true)
        )
    )
}

async function getMatchedUsers() {
    admin.firestore().collection('chatrooms').get().then(querySnapshot => {
        querySnapshot.forEach(async snapshot => {
            let data = await snapshot.data()
            // let users = d
            console.log(data.users)
            for (var u of data.users) {
                admin.firestore().doc('users/' + u).collection('chatHistory').doc(snapshot.id).set({
                    startedAt: admin.firestore.Timestamp.now(),
                    chatroom: snapshot.id,
                    unreadCount: 0
                })
            }
            // if (chatHistory.size > 0) snapshot.ref.update({ settings: { ...data, inChat: true }})
        })
    })
}
// getMatchedUsers()

async function deleteChatrooms() {
    await admin.firestore().collection('users').get().then(querySnapshot => {
        querySnapshot.forEach(snapshot => 
            chatHistory = snapshot.ref.collection('chatHistory').get().then(querySnapshot_ => {
                querySnapshot_.forEach(async snapshot_ => {
                    // console.log(snapshot.id, snapshot_.id)
                    let doc = await admin.firestore().collection('chatrooms').doc(snapshot_.id).get()                    
                    if (!doc.exists) {
                        console.log(snapshot.id, snapshot_.id, 'NA')
                        // snapshot.ref.collection('chatHistory').doc(snapshot_.id).delete()
                    }
                    else console.log(snapshot.id, snapshot_.id)
                })
            })
        )
    })
}
// deleteChatrooms()
            

async function setMatchedUsers() {
    admin.firestore().collection('users').get().then(querySnapshot => {
        var i = 0
        querySnapshot.forEach(async snapshot => {
            let chatHistory = await snapshot.ref.collection('chatHistory').get()
            let data = await snapshot.data()
            // console.log(snapshot.id, data.settings)
            if (data.settings.inChat == true) {
                console.log('matched', snapshot.id, data.settings)
            } else if (chatHistory.size > 0) {
                i++
                // console.log(i, chatHistory.size)
                console.log('matched', snapshot.id, data.settings)
                snapshot.ref.update({ settings: { chat: true, inChat: false }})
            // } else if (chatHistory.size == 0) {
            //     if (data.settings.chat == true) {
            //         console.log('open', snapshot.id, data.settings)
            //         snapshot.ref.update({ settings: { chat: true, inChat: false }})
            //     } else {
            //         console.log('not open', snapshot.id, data.settings)
            //         snapshot.ref.update({ settings: { chat: false, inChat: false }})
            //     }
            // } else {
            //     console.log('not counted', snapshot.id, data.settings)
            }
        })
    }) 
}

async function resetMatchedUsers() {
    admin.firestore().collection('users').get().then(querySnapshot => {
        var i = 0
        querySnapshot.forEach(async snapshot => {
            let chatHistory = await snapshot.ref.collection('chatHistory').get()
            let data = await snapshot.data()
            // if (!data.info.gender || data.info.gender == '' ){//&& data.settings.chat === false) {
                // sendNotification(data.id, {title: '配對成功', body:'本週已經成功配對聊天室，馬上開始和新朋友聊天吧！', data: {}})
                // console.log(snapshot.id, data.settings)
                snapshot.ref.update({ settings: { chat: false, inChat: false }})
            // }
        })
    }) 
}

async function setChatroomActive() {
    admin.firestore().collection('chatrooms').get().then(querySnapshot => {
        querySnapshot.forEach(async snapshot => {
            snapshot.ref.update({active: true})
        })
    })
}

async function setChatroomCount() {
    admin.firestore().collection('chatrooms').orderBy('startedAt').get().then(querySnapshot => {
        querySnapshot.forEach(async snapshot => {
            let data = await snapshot.data()
            let user = await admin.firestore().doc('users/' + data.users[0]).get()
            let userData = await user.data()
            let messages = await snapshot.ref.collection('messages').get()
            // if(data.users.length < 3) console.log(userData.identity.community, snapshot.id, data.users.length)
            // console.log(snapshot.id, data.users.length, userData.identity.community, messages.size, data.startedAt._seconds)
            // if(data.startedAt._seconds < 1631419622) {
            //     snapshot.ref.update({
            //         // memberCount: data.users.length,
            //         // community: userData.identity.community,
            //         // messageCount: messages.size
            //         active: false
            //     })
            // }
            // if(data.startedAt._seconds > 1631419622) {
            //     snapshot.ref.update({
            //         // memberCount: data.users.length,
            //         // community: userData.identity.community,
            //         // messageCount: messages.size
            //         active: true
            //     })
            // }
            if(data.active == true) {
                data.users.forEach(async u => {
                    admin.firestore().doc('users/' + u).update({
                        settings: {
                            chat: false,
                            inChat: true
                        }
                    })
                    const userSnapshot = await admin.firestore().doc('users/' + u).get()
                    const userData = await userSnapshot.data()
                    if(userData.settings.inChat == false || userData.settings.chat == true) console.log(userData.id, userData.settings, snapshot.id, data.startedAt._seconds)
                })
            }
        })
    })
}

async function setNewChatrooms() {
    admin.firestore().collection('chatrooms').orderBy('startedAt').get().then(querySnapshot => {
        querySnapshot.forEach(async snapshot => {
            let data = await snapshot.data()
            let user = await admin.firestore().doc('users/' + data.users[0]).get()
            let userData = await user.data()
            let messages = await snapshot.ref.collection('messages').get()
            // if(data.users.length < 3) console.log(userData.identity.community, snapshot.id, data.users.length)
            if(data.startedAt._seconds > 1631510282) {
                console.log(snapshot.id, data.users.length, userData.identity.community, messages.size, data.startedAt._seconds)
                snapshot.ref.update({
                    active: true
                })
                data.users.forEach(u => {
                    sendNotification(u, {title: '配對成功', body:'本週已經成功配對聊天室，馬上開始和新朋友聊天吧！', data: {}})
                    admin.firestore().doc('users/' + u).update({
                        settings: {
                            chat: false,
                            inChat: true
                        }
                    })
                })
            }
        })
    })
}
// setChatroomCount()


function setShortcuts() {
    admin.firestore().collection('communities').get().then(querySnapshot => 
        querySnapshot.forEach(snapshot => 
            snapshot.ref.update({
                shortcuts: [
                    {icon: 'package.png', title: '新生懶人包', url: 'https://supr.link/5VQbC', share: false},
                    {icon: 'community.png', title: '新生社群', url: 'https://supr.link/3VyQQ', share: false},
                    {icon: 'issue.png', title: '問題回報', url: 'https://supr.link/znUbr', share: false},
                    {icon: 'invite.png', title: '邀請好友', url: 'https://supr.link/0SFBI', share: true, message: 'Hey！我最近在使用UniLife，一個新的App。 \r\n最近推出了「校園引路人」企劃， 可以和同校跨科系的學長姊、學弟妹聊天、分享大學生活經驗。 \r\n完全匿名、不顯示性別資料， 且為三人一間的聊天室，不用擔心一對一可能產生的尷尬互動。  \r\n點擊以下連結，就可以快速報名，成爲UniLife在地生活圈的一員~ \r\nhttps://supr.link/0SFBI'}
                ]
            })
        )
    )
}

function setAllArticles() {
    admin.firestore().collection('articles').get().then(querySnapshot => 
        querySnapshot.forEach(snapshot => 
            snapshot.ref.update({
                reviewedBy: "HW6TgaKXhmc7OBdqhPGacfXVQR12",
                publishedBy: "HW6TgaKXhmc7OBdqhPGacfXVQR12",
                status: "published"
            })
        )
    )
}