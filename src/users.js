// in src/Users.js
import * as React from "react";
// tslint:disable-next-line:no-var-requires
import {
  usePermissions,
  useMutation,
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
  EmailField,
  TextField,
  TextInput,
  BooleanInput,
  NullableBooleanInput,
  ShowButton,
  EditButton,
  DeleteButton,
  SaveButton,
  Toolbar,
  ReferenceInput,
  ReferenceField,
  SelectInput,
  Filter
} from "react-admin";
import RichTextInput from "ra-input-rich-text";
import styles from "./styles"; 
import { setMatchedUsers, sendNotification } from './firebase';

const UserFilter = (props) => {
  const { loading, permissions } = usePermissions();
  return ( 
    !loading && permissions.role == 'admin'?
    <Filter {...props}>
      {/* <TextInput label="Search" source="id" alwaysOn /> */}
      <TextInput label="搜尋姓名" source="info.name" alwaysOn />
      <TextInput label="搜尋Email" source="info.email" alwaysOn />
      <ReferenceInput label="學校" source="identity.community" reference="communities" alwaysOn >
          <SelectInput optionText="name" />
      </ReferenceInput>
      <NullableBooleanInput label="已驗證" source="verification.status" alwaysOn/>
      <NullableBooleanInput label="已開啟聊天" source="settings.chat" alwaysOn/>
      <NullableBooleanInput label="正在聊天" source="settings.inChat" alwaysOn/>
    </Filter>
    :
    <Filter {...props}>
      {/* <TextInput label="Search" source="id" alwaysOn /> */}
      <TextInput label="搜尋Email" source="info.email" alwaysOn />
      <ReferenceInput label="學校" source="identity.community" reference="communities" alwaysOn >
          <SelectInput optionText="name" />
      </ReferenceInput>
      <NullableBooleanInput label="已驗證" source="verification.status" alwaysOn/>
    </Filter>
  )
}

export const UserList = (props) => {
  const { loading, permissions } = usePermissions();
  return (
    !loading && permissions.role == 'admin'?
    <List {...props}  filters={<UserFilter/>} sort={{ field: 'email', order: 'ASC' }} >
      <Datagrid>
        {/* <TextField source="id" /> */}
        {/* <TextField source="id" label="姓名" /> */}
        <TextField source="info.name" label="姓名" />
        <ReferenceField label="學校" source="identity.community" reference="communities"  sortable={true}>
          <TextField source="name" />
        </ReferenceField>
        <EmailField source="info.email" label="Email" sortable={true} />
        <TextField source="identity.grade" label="年級" sortable={true} />
        <BooleanField source="settings.chat" label="開啟聊天" sortable={true} />
        <BooleanField source="settings.inChat" label="正在聊天" sortable={true} />
        <BooleanField source="verification.status" label="已驗證" sortable={true} />
        <ShowButton label="" />
        <EditButton label="" />
        <DeleteButton label="" redirect={false}/>
      </Datagrid>
    </List>
    : 
    <List {...props}  filters={<UserFilter permissions={permissions} />} actions={<span></span>} sort={{ field: 'email', order: 'ASC' }} >
      <Datagrid>
        {/* <TextField source="id" /> */}
        <TextField source="info.name" label="姓名" />
        <ReferenceField label="學校" source="identity.community" reference="communities"  sortable={true}>
          <TextField source="name" />
        </ReferenceField>
        <EmailField source="info.email" label="Email" sortable={true} />
        <BooleanField source="verification.status" label="已驗證" sortable={true} />
        <EditButton label="" />
      </Datagrid>
    </List>
  )
}

export const UserShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <BooleanField source="settings.chat" label="開啟聊天" className={styles().inlineBlock} />
      <BooleanField source="settings.inChat" label="正在聊天" className={styles().inlineBlock} />
      <TextField source="id" />
      <TextField source="info.name" label="姓名"  className={styles().inlineBlock}/>
      <TextField source="info.nickname" label="暱稱" className={styles().inlineBlock}/>
      <TextField source="info.gender" label="性別" className={styles().inlineBlock}/>
      <EmailField source="info.email" label="Email" />
      <ReferenceField label="學校" source="identity.community" reference="communities" className={styles().inlineBlock}>
        <TextField source="name" />
      </ReferenceField>
      <TextField label="學位" source="identity.degree"  className={styles().inlineBlock} />
      <TextField label="年級" source="identity.grade"  className={styles().inlineBlock} />
    </SimpleShowLayout>
  </Show>
);

export const UserCreate = (props) => (
  <Create {...props} >
    <SimpleForm>
      <TextInput source="id" />
      <TextInput label="姓名 "source="info.name" formClassName={styles().inlineBlock} />
      <ReferenceInput label="學校" source="identity.community" reference="communities">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <TextInput source="info.email" label="Email" />
      <TextInput source="info.profileImage" initialValue="profile-image-0.png" formClassName={styles().hidden} />
      <BooleanInput source="settings.chat" label="開啟聊天"  initialValue={false} formClassName={styles().hidden} options={{ disabled: true, readOnly: true }} />
      <BooleanInput source="settings.inChat" label="正在聊天"  initialValue={false} formClassName={styles().hidden} options={{ disabled: true, readOnly: true }} />
      <TextInput source="verification.type" initialValue="file" formClassName={styles().hidden} options={{ disabled: true, readOnly: true }} />
      <BooleanInput source="verification.status" initialValue={true} formClassName={styles().hidden}  options={{ disabled: true, readOnly: true }} />
    </SimpleForm>
  </Create>
);

export const UserEdit = (props) => {
  const [mutate] = useMutation();
  const save = React.useCallback(
    async (values) => {
      const id = values.id
        try {
          console.log(values.id)
            await mutate({
                type: 'update',
                resource: 'users',
                payload: { id: values.id, data: values },
            }, { returnPromise: true });
        } catch (error) {
            console.log(error)
        }
        if (values.verification.status === true) {
          console.log(values)
          console.log(id)
          sendNotification(id, {title: '驗證成功', body:'成功驗證學生身份，已開啟留言及聊天功能'})
        }
    },
    [mutate],
  );

  return (
    <Edit {...props}>
      <SimpleForm save={save}>
        <BooleanInput source="settings.chat" label="開啟聊天" formClassName={styles().inlineBlock} options={{ disabled: true, readOnly: true }} />
        <BooleanInput source="settings.inChat" label="正在聊天" formClassName={styles().inlineBlock} />
        <BooleanInput source="verification.status" label="已驗證" formClassName={styles().inlineBlock} />
        <TextInput source="id" options={{ disabled: true }} />
        <TextInput label="姓名 "source="info.name" formClassName={styles().inlineBlock} />
        <TextInput source="info.nickname" label="暱稱" formClassName={styles().inlineBlock} options={{ disabled: true, readOnly: true }} />
        <TextInput source="info.gender" label="性別" formClassName={styles().inlineBlock}  options={{ disabled: true, readOnly: true }} />
        <ReferenceInput label="學校" source="identity.community" reference="communities">
          <SelectInput optionText="name" />
        </ReferenceInput>
        <TextInput source="info.email" label="Email" />
        <TextInput label="學位" source="identity.degree"  formClassName={styles().inlineBlock} />
        <TextInput label="年級" source="identity.grade" formClassName={styles().inlineBlock} />
      </SimpleForm>
    </Edit>
  )
}

export const UserEdit_editor = (props) => {
  const [mutate] = useMutation();
  const save = React.useCallback(
    async (values) => {
      const id = values.id
        try {
          console.log(values.id)
            await mutate({
                type: 'update',
                resource: 'users',
                payload: { id: values.id, data: values },
            }, { returnPromise: true });
        } catch (error) {
            console.log(error)
        }
        if (values.verification.status === true) {
          console.log(values)
          sendNotification(id, {title: '驗證成功', body:'成功驗證學生身份，已開啟留言及聊天功能'})
        }
    },
    [mutate],
  );
  const SaveToolbar = props => (
    <Toolbar {...props} >
        <SaveButton disabled={props.pristine} />
    </Toolbar>
  );

  return (
    <Edit {...props}>
        <SimpleForm toolbar={<SaveToolbar />} save={save}>
          <TextField label="姓名 "source="info.name" formClassName={styles().inlineBlock} />
          <ReferenceField label="學校" source="identity.community" reference="communities" formClassName={styles().inlineBlock} >
            <TextField source="name" options={{ disabled: true, readOnly: true }} />
          </ReferenceField>
          <TextField source="info.email" label="Email" formClassName={styles().inlineBlock}  options={{ disabled: true, readOnly: true }} />
          <BooleanInput source="verification.status" label="已驗證"/>
        </SimpleForm>
    </Edit>
  )
}
