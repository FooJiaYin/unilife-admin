// in src/articles.js
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
  BooleanField,
  RichTextField,
  DateField,
  SelectInput,
  DateTimeInput,
  BooleanInput,
  ImageField,
  FileField,
  FileInput
} from "react-admin";
import RichTextInput from "ra-input-rich-text";
import styles from "./styles";

const ArticleFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search" source="title" alwaysOn />
    <ReferenceInput label="學校" source="community" reference="communities" alwaysOn >
        <SelectInput optionText="name" />
    </ReferenceInput>
  </Filter>
);

export const ArticleList = (props) => (
  <List {...props} filters={<ArticleFilter /> } sort={{ field: 'publishedAt', order: 'DESC' }}>
    <Datagrid>
      <TextField source="title" label="標題" />
      <TextField source="meta.abstract" label="摘要" />
      <ReferenceField label="學校" source="community" reference="communities" sortable={true} >
        <TextField source="name" />
      </ReferenceField>
      <BooleanField source="pinned" label="置頂" sortable={true} />
      <DateField source="publishedAt" label="發佈時間" showTime={true} sortable={true}  />
      <ShowButton label="" />
      <EditButton label="" />
      <DeleteButton label="" redirect={false}/>
    </Datagrid>
  </List>
);

export const ArticleShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      {/* <TextField source="id" /> */}
      <TextField source="title" label="標題" />
      <ReferenceField label="學校" source="community" reference="communities"  className={styles().inlineBlock} >
        <TextField source="name" />
      </ReferenceField>
      <DateField source="publishedAt" label="發佈時間" showTime={true}  className={styles().inlineBlock}/>
      <BooleanField source="pinned" label="置頂" className={styles().inlineBlock}/>
      <ImageField label="縮圖" source="images.src" title="images.title" />
      <TextField source="meta.source" label="文章來源" className={styles().inlineBlock}/>
      <TextField source="meta.url" label="文章連結（不會顯示內文）" fullWidth={true} className={styles().inlineBlock} />
      <TextField source="meta.abstract" label="摘要" />
      <RichTextField source="content" label="内文" />
    </SimpleShowLayout>
  </Show>
);

export const ArticleCreate = (props) => (
  <Create {...props} >
    <SimpleForm>
      <TextInput source="title" label="標題" multiline={true}  fullWidth={true} />
      <ReferenceInput label="學校" source="community" reference="communities" formClassName={styles().inlineBlock} >
        <SelectInput optionText="name" />
      </ReferenceInput>
      <DateTimeInput source="publishedAt" label="發佈時間" formClassName={styles().inlineBlock} />
      <BooleanInput source="pinned" label="置頂" initialValue={false} formClassName={styles().inlineBlock} />
      <TextInput source="meta.source" label="文章來源" />
      <TextInput source="meta.url" label="文章連結（不會顯示內文）" fullWidth={true} />
      <TextInput source="meta.abstract" label="摘要" multiline={true} fullWidth={true} />
      <RichTextInput source="content" label="內文" // configureQuill={configureQuill}
        toolbar={[ [{ 'header': [2, false] }], ['bold', 'italic', 'underline', 'strike', { 'script': 'sub'}], [{ 'color': [] }, { 'background': [] }], [{ 'list': 'ordered'}, { 'list': 'bullet' }], ['link', 'image'], ['clean'] ]}
      />
      <FileInput source="images" label="縮圖" accept=".jpg,.png">
        <FileField source="src" title="title" />
      </FileInput>
      <TextInput source="meta.coverImage" label="縮圖（請複製上面的檔案名稱）" fullWidth={true} />
    </SimpleForm>
  </Create>
);

export const ArticleEdit = (props) => {
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
          aria-label="Create Article"
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
        <ReferenceInput label="學校" source="community" reference="communities" formClassName={styles().inlineBlock} >
          <SelectInput optionText="name" />
        </ReferenceInput>
        <DateTimeInput source="publishedAt" label="發佈時間" formClassName={styles().inlineBlock} />
        <BooleanInput source="pinned" label="置頂" initialValue={false} formClassName={styles().inlineBlock} />
        <TextInput source="meta.source" label="文章來源" />
        <TextInput source="meta.url" label="文章連結（不會顯示內文）" fullWidth={true} />
        <TextInput source="meta.abstract" label="摘要" multiline={true} fullWidth={true} />
        <RichTextInput source="content" label="內文" // configureQuill={configureQuill}
          toolbar={[ [{ 'header': [2, false] }], ['bold', 'italic', 'underline', 'strike', { 'script': 'sub'}], [{ 'color': [] }, { 'background': [] }], [{ 'list': 'ordered'}, { 'list': 'bullet' }], ['link', 'image'], ['clean'] ]}
        />
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