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
import { setMatchedUsers, setChatroomCount, createChatroom } from './firebase';

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

export const ChatroomList = (props) => {
  React.useEffect(() => {
    setChatroomCount();
    // setMatchedUsers();
  }, [])
  return (
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
}

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
