// in src/Chatrooms.js
import * as React from "react";
// tslint:disable-next-line:no-var-requires
import {
  Datagrid,
  List,
  Show,
  Create,
  Edit,
  DateInput,
  DateField,
  BooleanField,
  SimpleShowLayout,
  SimpleForm,
  TextField,
  TextInput,
  BooleanInput,
  ShowButton,
  EditButton,
  DeleteButton,
  AutocompleteInput,
  ReferenceInput,
  ReferenceField,
  SelectInput,
  ReferenceArrayField,
  Filter,
  SingleFieldList,
  ChipField,
  useRecordContext,
} from "react-admin";
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/button';
import { firebase } from './FIREBASE_CONFIG';

async function setMatchedUsers() {
  firebase.firestore().collection('users').where('settings.inChat', '==', true).get().then(querySnapshot => {
      // var i = 0
      querySnapshot.forEach(async snapshot => {
          let chatHistory = await snapshot.ref.collection('chatHistory').get()
          let data = await snapshot.data()
          if (chatHistory.size > 0) {
              // i++
              // // console.log(i, chatHistory.size)
              // // console.log(i, snapshot.id)
              snapshot.ref.update({ settings: { chat: false, inChat: true }})
          }
          if (chatHistory.size == 0) {
              // console.log(snapshot.id)
              snapshot.ref.update({ settings: { chat: true, inChat: false }})
          }
      })
  })
}

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
  setMatchedUsers()
  alert("10秒後進行配對")
  setTimeout(() => {
    firebase.firestore().collection('communities').get().then(querySnapshot =>
        querySnapshot.forEach(snapshot =>  
            match(snapshot.id, true)
        )
    )
  }, 10000)
}

const ChatroomFilter = (props) => (
  <Filter {...props}>
    <TextInput label="查詢id" source="id" alwaysOn />
    <ReferenceInput label="查詢成員id" source="users" reference="users">
        <AutocompleteInput optionText="id" />
    </ReferenceInput>
    <ReferenceInput label="查詢成員姓名" source="users" reference="users" alwaysOn>
        <AutocompleteInput optionText="info.name" />
    </ReferenceInput>
    {/* <DateField label="Search" source="startedAt" alwaysOn /> */}
    <ReferenceInput label="學校" source="community" reference="communities" alwaysOn >
        <SelectInput optionText="name" />
    </ReferenceInput>
  </Filter>
);

const MemberChip = (props) => {
  const record = useRecordContext(props);
  console.log(record);
  return (
    <Chip>{record.info.nickname}  {record.identity.grade}</Chip>
  )
}

const ChatroomMembers = (props) => (
  <ReferenceArrayField label="成員" reference="users" source="users">
    <SingleFieldList>
        {/* <MemberChip source="info.nickname" /> */}
        <ChipField source="info.nickname" />
    </SingleFieldList>
  </ReferenceArrayField>
)
export const ChatroomList = (props) => (
  <List {...props}  filters={<ChatroomFilter />} sort={{ field: 'startedAt', order: 'ASC' }} 
    actions={<Button  variant="contained" color="primary" onClick={()=>createChatroom()}>聊天配對</Button>}
  >
    <Datagrid expand={<ChatroomMembers />} >
      <ReferenceField label="學校" source="community" reference="communities"  sortable={true}>
        <TextField source="name" />
      </ReferenceField>
      <DateField source="startedAt" label="開始時間" sortable={true} showTime={true} />
      <TextField label="訊息數量" source="messageCount" />
      <TextField source="id" />
      {/* <ShowButton label="" />
      <EditButton label="" /> */}
      <DeleteButton label="" redirect={false}/>
    </Datagrid>
  </List>
);

export const ChatroomShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="info.name" label="姓名" />
      <ReferenceField label="學校" source="identity.community" reference="communities">
        <TextField source="name" />
      </ReferenceField>
      <TextField source="info.email" label="Email" />
    </SimpleShowLayout>
  </Show>
);

export const ChatroomCreate = (props) => (
  <Create {...props} >
    <SimpleForm>
      <TextInput source="id" />
      <TextInput source="info.name" label="姓名" />
      <ReferenceInput label="學校" source="identity.community" reference="communities">
        <SelectInput optionText="name" />
      </ReferenceInput>
    </SimpleForm>
  </Create>
);

export const ChatroomEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="id" options={{ disabled: true }} />
      <TextInput source="info.name" />
      <ReferenceInput label="學校" source="identity.community" reference="communities">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <TextInput source="info.email" label="Email" />
    </SimpleForm>
  </Edit>
);
