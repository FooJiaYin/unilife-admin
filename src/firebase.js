import { firebase } from './FIREBASE_CONFIG';

export async function setMatchedUsers() {
    firebase.firestore().collection('users').get().then(querySnapshot => {
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
                snapshot.ref.update({ settings: { chat: false, inChat: true }})
            } else if (chatHistory.size == 0) {
                if (data.settings.chat == true) {
                    console.log('open', snapshot.id, data.settings)
                    snapshot.ref.update({ settings: { chat: true, inChat: false }})
                } else {
                    console.log('not open', snapshot.id, data.settings)
                    snapshot.ref.update({ settings: { chat: false, inChat: false }})
                }
            } else {
                console.log('not counted', snapshot.id, data.settings)
            }
        })
    }) 
}
  
export async function setChatroomCount() {
    firebase.firestore().collection('chatrooms').get().then(querySnapshot => {
        querySnapshot.forEach(async snapshot => {
            let data = await snapshot.data()
            let user = await firebase.firestore().doc('users/' + data.users[0]).get()
            let userData = await user.data()
            let messages = await snapshot.ref.collection('messages').get()
            // if(data.users.length < 3) console.log(userData.identity.community, snapshot.id, data.users.length)
            console.log(snapshot.id, data.users.length, userData.identity.community, messages.size)
            snapshot.ref.update({
                memberCount: data.users.length,
                community: userData.identity.community,
                messageCount: messages.size
            })
        })
    })
}
  
export async function match(community, triggerMatch = false) {
    let junior = []
    let senior = []
    firebase.firestore().collection('users')
        .where('identity.community', '==', community)
        .where('settings.inChat', '!=', true)
        .where('settings.chat', '==', true)
        .get().then(querySnapshot => {
            // let i=0
            querySnapshot.forEach(async snapshot => {
                const data = await snapshot.data()
                if (data.identity.grade == 1) junior.push({id: snapshot.id, g: data.identity.grade})
                else if (data.identity.grade > 1) senior.push({id: snapshot.id, g: data.identity.grade})
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
                    let newChatroom = await firebase.firestore().collection('chatrooms').add({
                        users: users,
                        startedAt: firebase.firestore.Timestamp.now(),
                        memberCount: 3,
                        community: community,
                        messageCount: 0
                    })
                    const data = {
                        startedAt: firebase.firestore.Timestamp.now(),
                        chatroom: newChatroom.id,
                        unreadCount: 0,
                    }
                    for (var u of users) {
                        firebase.firestore().doc('users/' + u).collection('chatHistory').doc(newChatroom.id).set(data)
                        firebase.firestore().doc('users/' + u).update({ settings: { chat: false, inChat: true }})
                    }
                }
            }
        })
}
  
export function createChatroom() {  
    // setMatchedUsers()
    alert("開始進行配對")
    // setTimeout(() => {
      firebase.firestore().collection('communities').get().then(querySnapshot =>
          querySnapshot.forEach(snapshot =>  
              match(snapshot.id, false)
          )
      )
    // }, 10000)
}