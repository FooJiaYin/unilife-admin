// in src/Communitys.js
import * as React from "react";
// tslint:disable-next-line:no-var-requires
import {
  Datagrid,
  List,
  Show,
  Create,
  Edit,
  useRecordContext,
  BooleanInput,
  ArrayInput,
  SimpleFormIterator,
  TabbedShowLayout,
  SimpleForm,
  TextField,
  TextInput,
  CreateButton,
  ShowButton,
  EditButton,
  DeleteButton,
  Labeled,
  BooleanField,
  SimpleList,
  ArrayField,
  Tab,
  SelectInput,
  ResourceContextProvider,
  useResourceContext,
  TabbedForm,
  FormTab,
} from "react-admin";
import styles from "./styles"; 
import RichTextInput from "ra-input-rich-text";

export const CommunityList = (props) => (
  <List {...props}>
    <Datagrid>
      {/* <TextField source="id" /> */}
      <TextField label="名稱" source="name" />
      <ShowButton label="" />
      <EditButton label="" />
      {/* <DeleteButton label="" redirect={false}/> */}
    </Datagrid>
  </List>
);

export const CommunityShow = (props) => {
  const record = useRecordContext(props);
  return (
  <Show {...props}>
    <TabbedShowLayout>
      <Tab label="學校資料">
        <TextField source="id" className={styles().inlineBlock} />
        <TextField label="名稱" source="name" className={styles().inlineBlock}  />
        <Labeled label="系所列表" />
        <Departments />
        {/* <ArrayInput source="departments">
            <SimpleFormIterator>
                <TextInput source="id" />
                <TextInput source="name" />
            </SimpleFormIterator>
        </ArrayInput> */}
      </Tab>
      <Tab label="快捷鍵">
        <ArrayField label="快捷鍵" source="shortcuts">
          <Datagrid fullWidth={true}
          expand={<TextField label="分享訊息" source="message" multiline={true} />}>
            <TextField label="標題" source="title" className={styles().inlineBlock} />
            <TextField label="圖片名稱" source="icon" className={styles().inlineBlock} />
            <TextField label="連結" source="url" className={styles().inlineBlock} />
            <BooleanField label="分享" source="share" className={styles().inlineBlock} />
          </Datagrid>
        </ArrayField>
      </Tab>
    </TabbedShowLayout>
  </Show>
)}

export const CommunityCreate = (props) => (
  <Create {...props} >
    <SimpleForm submitOnEnter={false}>
      <TextInput source="id" />
      <TextInput  label="名稱" source="name" />
    </SimpleForm>
  </Create>
);

const ConditionalMessageInput = (props) => {
  const record = useRecordContext(props);

  return record && record.share
      ? (
          // <Labeled label="分享訊息">
          <TextInput source="message" {...props} multiline={true} fullWidth={true} />
          // </Labeled>
      )
      : null;
}

export const DepartmentCreate = (props) => 
    <Create {...props} >
      <SimpleForm>
        <TextInput source="id" />
        <TextInput source="name" />
      </SimpleForm>
    </Create>

const Departments = (props) => {
  let record = useRecordContext(props);
  return (
    <ResourceContextProvider value={"communities/" + record.id + "/departments"}>
      <List basePath="/" 
        actions={null}
        // actions={<CreateButton  basePath={"communities/" + record.id + "/departments"} />}
      >
            <Datagrid>
                <TextField source="id" />
                <TextField label="名稱" source="name" />
            </Datagrid>
        </List>
    </ResourceContextProvider>
  );
}

export const CommunityEdit = (props) => (
  <Edit {...props}>
    <TabbedForm>
      <FormTab label="學校資料">
        <TextInput source="id" options={{ disabled: true }} formClassName={styles().inlineBlock} />
        <TextInput label="名稱" source="name" formClassName={styles().inlineBlock}  />
        <Labeled label="系所列表" />
        <Departments />
        {/* <ArrayInput source="departments">
            <SimpleFormIterator>
                <TextInput source="id" />
                <TextInput source="name" />
            </SimpleFormIterator>
        </ArrayInput> */}
      </FormTab>
      <FormTab label="快捷鍵">
        <ArrayInput label="快捷鍵" source="shortcuts">
          <SimpleFormIterator>
            <TextInput label="標題" source="title" formClassName={styles().inlineBlock} />
            <TextInput label="圖片名稱" source="icon" formClassName={styles().inlineBlock} />
            <TextInput label="連結" source="url" formClassName={styles().inlineBlock} />
            <BooleanInput label="分享" source="share" formClassName={styles().inlineBlock} />
            <TextInput label="分享訊息" source="message" multiline={true} fullWidth={true} />
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>
    </TabbedForm>
  </Edit>
);
