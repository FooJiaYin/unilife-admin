import * as React from "react";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Title } from 'react-admin';
import Button from '@material-ui/core/Button'
import { firebase } from './FIREBASE_CONFIG';

async function match(community, triggerMatch = false) {
    let junior = []
    let senior = []
    firebase.firestore().collection('users')
        .where('identity.community', '==', community)
        .where('settings.inChat', '==', false)
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

function createChatroom() {  
    firebase.firestore().collection('communities').get().then(querySnapshot =>
        querySnapshot.forEach(snapshot =>  
            match(snapshot.id, true)
        )
    )
}

export default function () {
    return (
        <Card>
            <Title title="Dashboard" />
            <CardContent>
                <p>Welcome to the Dashboard!</p>
                <Button  variant="contained" color="primary" onClick={()=>createChatroom()}>聊天配對</Button>
            </CardContent>
        </Card>
    );
}