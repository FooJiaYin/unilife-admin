// in src/posts.js
import * as React from "react";
// tslint:disable-next-line:no-var-requires
import {
  Datagrid,
  List,
  Show,
  Create,
  Edit,
  Filter,
  SimpleShowLayout,
  SimpleForm,
  ReferenceField,
  ReferenceInput,
  TextField,
  TextInput,
  ShowButton,
  EditButton,
  DeleteButton,
  RichTextField,
  SelectInput,
  DateTimeInput,
  BooleanInput,
  FileField,
  FileInput
} from "react-admin";
import Dialog from "@material-ui/core/Dialog";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import RichTextInput from "ra-input-rich-text";
import { firebase } from "./FIREBASE_CONFIG";

const departments = [
  { id: 'all', name: '所有社群' },
  { id: 'test', name: '測試社群' },
  { id: 'nthu', name: '國立清華大學' },
  { id: 'ntu' , name: '國立台灣大學' },
]

const PostFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search" source="title" alwaysOn />
  </Filter>
);

export const PostList = (props) => (
  <List {...props} filters={<PostFilter />}>
    <Datagrid>
      <TextField source="title" />
      <TextField source="meta.abstract" />
      <TextField source="community" />
      <TextField source="lastupdate" />
      <ShowButton label="" />
      <EditButton label="" />
      <DeleteButton label="" redirect={false}/>
    </Datagrid>
  </List>
);

export const PostShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="meta.abstract" />
      <TextField source="lastupdate" />
      <RichTextField source="content" />
      <FileField source="file.src" title="file.title" />
    </SimpleShowLayout>
  </Show>
);

export const PostCreate = (props) => (
  <Create {...props} >
    <SimpleForm>
      <TextInput source="title" label="標題" multiline={true}  fullWidth={true} />
      <BooleanInput source="pinned" label="置頂" initialValue={false} />
      <DateTimeInput source="publishedAt" label="發佈時間" initialValue={Date.now()} />
      <TextInput source="meta.source" label="文章來源" />
      <TextInput source="meta.url" label="文章連結（不會顯示內文）" fullWidth={true} />
      <TextInput source="meta.abstract" label="摘要" multiline={true} fullWidth={true} />
      <RichTextInput source="content" label="內文" // configureQuill={configureQuill}
        toolbar={[ [{ 'header': [2, false] }], ['bold', 'italic', 'underline', 'strike', { 'script': 'sub'}], [{ 'color': [] }, { 'background': [] }], [{ 'list': 'ordered'}, { 'list': 'bullet' }], ['link', 'image'], ['clean'] ]}
      />
      
      <ReferenceInput label="學校" source="community" reference="communities">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <FileInput source="images" label="縮圖" accept=".jpg,.png">
        <FileField source="src" title="title" />
      </FileInput>
      <TextInput source="meta.coverImage" label="縮圖（請複製上面的檔案名稱）" fullWidth={true} />
    </SimpleForm>
  </Create>
);

export const PostEdit = (props) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [images, setImages] = React.useState(['1.jpg', '2.jpg']);
  const [age, setAge] = React.useState('');
  
  // const configureQuill = quill => quill.getModule('toolbar').addHandler('image', function (value) {
  //   var range = this.quill.getSelection();
  //   var value = null;
  //   // var value = prompt('please copy paste the image url here.');
  //   setDialogOpen(true);
  //   if(value){
  //       this.quill.insertEmbed(range.index, 'image', value);
  //   }
  // });
  return(
    <Edit {...props}>
      {/* <Dialog
          fullWidth
          open={dialogOpen}
          onClose={setDialogOpen(false)}
          aria-label="Create post"
        >
        <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={url}
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
      </Dialog> */}
      <SimpleForm>
        <TextInput source="title" label="標題" multiline={true}  fullWidth={true} />
        <BooleanInput source="pinned" label="置頂" />
        <DateTimeInput source="publishedAt" label="發佈時間" />
        <TextInput source="meta.source" label="文章來源" />
        <TextInput source="meta.url" label="文章連結（不會顯示內文）" fullWidth={true} />
        <TextInput source="meta.abstract" label="摘要" multiline={true} fullWidth={true} />
        <RichTextInput source="content" label="內文" // configureQuill={configureQuill}
          toolbar={[ [{ 'header': [2, false] }], ['bold', 'italic', 'underline', 'strike', { 'script': 'sub'}], [{ 'color': [] }, { 'background': [] }], [{ 'list': 'ordered'}, { 'list': 'bullet' }], ['link', 'image'], ['clean'] ]}
        />
        
        <ReferenceInput label="學校" source="community" reference="communities">
          <SelectInput optionText="name" />
        </ReferenceInput>
        <FileInput source="images" label="縮圖" accept=".jpg,.png">
          <FileField source="src" title="title" />
        </FileInput>
        <TextInput source="meta.coverImage" label="縮圖（請複製上面的檔案名稱）" fullWidth={true} />
      </SimpleForm>
    </Edit> 
  );
}

// const toChoices = items => items.map(item => ({ id: item, name: item }));

// const CityInput = props => {
//     const { values } = useFormState();
//     return (
//         <SelectInput
//             choices={values.country ? toChoices(cities[values.country]) : []}
//             {...props}
//         />
//     );
// };

// const OrderEdit = props => (
//     <Edit {...props}>
//         <SimpleForm>
//             <SelectInput source="country" choices={toChoices(countries)} />
//             <CityInput source="cities" />
//         </SimpleForm>
//     </Edit>
// );