// in src/articles.js
import * as React from "react";
// tslint:disable-next-line:no-var-requires
import {
  usePermissions,
  Datagrid,
  SimpleList,
  List,
  Show,
  Create,
  Edit,
  Filter,
  SimpleShowLayout,
  SimpleForm,
  AutocompleteInput,
  AutocompleteArrayInput,
  RadioButtonGroupInput,
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
  SelectField,
  SelectInput,
  DateTimeInput,
  BooleanInput,
  ImageField,
  FileField,
  FileInput,
  FormDataConsumer
} from "react-admin";
import RichTextInput from "ra-input-rich-text";
import { useMediaQuery } from '@material-ui/core';
import Button from '@material-ui/core/button';
import styles from "./styles";
import { firebase } from './FIREBASE_CONFIG';
import { getUserCommunity, cloudFunction } from './firebase';
import { useFormState, useForm } from 'react-final-form';
import './editor.css'
// const ogs = require('open-graph-scraper-lite');
// const urlMetadata = require('url-metadata')

const status = [
  { id: 'draft', name: '草稿' },
  { id: 'submitted', name: '審核中' },
  { id: 'published', name: '已發布' },
  { id: 'expired', name: '已下架' },
]

const categories = [
  { id: 'none', name: '無分類' },
  { id: 'announcement', name: '社群公告' },
  { id: 'local', name: '在地資訊' },
  { id: 'news', name: '精選新聞' },
]

const tags = [
  { id: 'operation', name: '小攸公告' },
  { id: 'newbie', name: '校園懶人包' },
  { id: 'clubs', name: '社團博覽會' },
  { id: 'discussion', name: '討論區' },
  { id: '0', name: '影集戲劇' },
  { id: '1', name: '國際政經' },
  { id: '2', name: '時事評論' },
  { id: '3', name: '娛樂八卦' },
  { id: '4', name: '行銷/管理' },
  { id: '5', name: '科技趨勢' },
  { id: '6', name: '創新創業'},
  { id: '7', name: '職場關係'},
  { id: '8', name: '情感關係'},
  { id: '9', name: '生活/人文'},
  { id: '10', name: '表演展覽'},
  { id: '11', name: '美妝穿搭'},
  { id: '12', name: '手工藝'},
  { id: '13', name: '神秘占卜'},
  { id: '14', name: '法律'},
  { id: '15', name: '寵物'},
  { id: '16', name: '球類運動'},
  { id: '17', name: '健身健康'},
  { id: '18', name: '教育'},
  { id: '19', name: '心靈成長'},
  { id: '20', name: '音樂'},
  { id: '21', name: '美食'},
  { id: '22', name: '旅遊遊記'},
  { id: '23', name: '電子遊戲'},
  { id: '24', name: '桌上/實境遊戲'},
  { id: '25', name: '日式動漫'},
  { id: '26', name: '歐美動漫'},
  { id: '27', name: '好書推薦'},
  { id: '28', name: '理財投資'},
  { id: '29', name: '電影'}
]

const ArticleFilter = (props) => {
  const { loading, permissions } = usePermissions();
  return ( 
    !loading && (permissions.role == 'admin' || permissions.role == 'editor')?
      <Filter {...props}>
        <TextInput label="Search" source="title" alwaysOn />
        <ReferenceInput label="學校" source="community" reference="communities" alwaysOn >
            <SelectInput optionText="name" />
        </ReferenceInput>
        <SelectInput source="status" label="發布狀態" choices={status}  alwaysOn />
        {/* <DateTimeInput source="publishedAt_gte" label="發佈時間晚於" />
        <DateTimeInput source="publishedAt_lte" label="發佈時間早於" /> */}
        <SelectInput source="category" label="分類" choices={categories} />
        <BooleanInput source="pinned" label="置頂" />
        <AutocompleteInput source="tags" label="標籤" choices={tags} />
        <ReferenceInput label="作者" source="publishedBy" reference="users" >
            <AutocompleteInput optionText="info.name" />
        </ReferenceInput>
        <SelectInput source="type" label="類型" choices={[
            { id: 'article', name: '文章' },
            { id: 'link', name: '連結' },
        ]} />
      </Filter>
    :
      <Filter {...props}>
        <TextInput label="Search" source="title" alwaysOn />
        <SelectInput source="status" label="發布狀態" choices={status}  alwaysOn />
        {/* <DateTimeInput source="publishedAt_gte" label="發佈時間晚於" />
        <DateTimeInput source="publishedAt_lte" label="發佈時間早於" /> */}
        <AutocompleteInput source="tags" label="標籤" choices={tags} />
        <SelectInput source="type" label="類型" choices={[
            { id: 'article', name: '文章' },
            { id: 'link', name: '連結' },
        ]} />
      </Filter>
  )
}

export const ArticleList = (props) => {
  const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'))
  const { loading, permissions } = usePermissions()
  const [uid, setUid] = React.useState('0123')
  return(
    <List {...props} filters={<ArticleFilter /> } sort={{ field: 'publishedAt', order: 'DESC' }}>
      { isSmall ? 
        <SimpleList
            primaryText={record => record.title}
            secondaryText={record => record.status}
            tertiaryText={record => new Date(record.publishedAt).toLocaleDateString()}
            linkType={"edit"}  
            rowStyle={(record, index) => ({
              backgroundColor: record.nb_views >= 500 ? '#efe' : 'white',
          })} 
        />
      : 
        <Datagrid>
          <TextField source="title" label="標題" />
          {/* <TextField source="meta.abstract" label="摘要" /> */}
          <SelectField label="發布狀態" source="status" choices={status} />
          <ReferenceField label="學校" source="community" reference="communities" sortable={true} >
            <TextField source="name" />
          </ReferenceField>
          <BooleanField source="pinned" label="置頂" sortable={true} />
          <DateField source="publishedAt" label="發佈時間" showTime={true} sortable={true}  />
          <ShowButton label="" />
          <EditButton label="" />
          {/* <DeleteButton label="" redirect={false}/> */}
        </Datagrid> 
      }
    </List>
  )
}

export const ArticleList_visitor = (props) => {
  const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'))
  const { loading, permissions } = usePermissions()
  return(
    <List {...props} filters={<ArticleFilter /> } sort={{ field: 'publishedAt', order: 'DESC' }} filter={{"publishedBy": firebase.auth().currentUser? firebase.auth().currentUser.uid  : (loading? '0123' : permissions.user_id)}}>
      { isSmall ? 
        <SimpleList
            primaryText={record => record.title}
            secondaryText={record => record.status}
            tertiaryText={record => new Date(record.publishedAt).toLocaleDateString()}
            linkType={"edit"}  
            rowStyle={(record, index) => ({
              backgroundColor: record.nb_views >= 500 ? '#efe' : 'white',
          })} 
        />
      : 
        <Datagrid>
          <TextField source="title" label="標題" />
          {/* <TextField source="meta.abstract" label="摘要" /> */}
          <SelectField label="發布狀態" source="status" choices={status} />
          <DateField source="publishedAt" label="發佈時間" showTime={true} sortable={true}  />
          <EditButton label="" />
          {/* <DeleteButton label="" redirect={false}/> */}
        </Datagrid> 
      }
    </List>
  )
}

export const ArticleShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      {/* <TextField source="id" /> */}
      <TextField source="title" label="標題" />
      <ReferenceField label="學校" source="community" reference="communities"  className={styles().inlineBlock} >
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField label="作者" source="publishedBy" reference="users" className={styles().inlineBlock} >
        <TextField source="info.name" />
      </ReferenceField>
      <ReferenceField label="審核" source="reviewedBy" reference="users" className={styles().inlineBlock} >
        <TextField source="info.name" />
      </ReferenceField>
      <SelectField label="發布狀態" source="status" choices={status} className={styles().inlineBlock}  />
      <DateField source="publishedAt" label="發佈時間" showTime={true}  className={styles().inlineBlock}/>
      <BooleanField source="pinned" label="置頂" className={styles().inlineBlock}/>
      <ImageField label="縮圖" source="images.src" title="images.title" />
      <TextField source="meta.source" label="文章來源" className={styles().inlineBlock}/>
      <TextField source="meta.url" label="文章連結（不會顯示內文）" fullWidth={true} className={styles().inlineBlock} />
      <TextField source="meta.abstract" label="摘要" />
      <RichTextField source="content" label="内文" className={styles().mw100} />
    </SimpleShowLayout>
  </Show>
);

// const configureQuill = quill => quill.root.style['min-height'] = '400px';
  // const configureQuill = quill => quill.getModule('toolbar').addHandler('image', function (value) {
  //   var range = this.quill.getSelection();
  //   var value = null;
  //   // var value = prompt('please copy paste the image url here.');
  //   setDialogOpen(true);
  //   if(value){
  //       this.quill.insertEmbed(range.index, 'image', value);
  //   }
  // });
  // React.useEffect(() => {
  //   setUid(firebase.auth().currentUser.uid)
  // }, [])

async function getArticleMeta(url) {
  // const url = values.meta.url
  // console.log(values)
  
  const response = await cloudFunction('getArticleMeta', {
    url: url, 
    // onlyGetOpenGraphInfo: true,
    customMetaTags: [{
      multiple: false, // is there more than one of these tags on a page (normally this is false)
      property: 'hostname', // meta tag name/property attribute
      fieldName: 'domain', // name of the result variable
    }],
    timeout: 15000
  })
  if(response) {
    const data = response.data
    console.log(data)
    const title = data.ogTitle || data.twitterTitle || '' 
    const description = data.ogDescription || data.twitterDescription || ''
    const source = data.ogSiteName || data.twitterCreator || data.domain || url.replace('https://', '').replace('http://', '').split('/')[0] || ''
    const imageUrl = (data.ogImage)? data.ogImage.url : data.twitterImage? data.twitterImage.url : ''
    return {title, description, source, imageUrl}
  } else {
    return {}
  }
}

const UrlInput = (props) => {
  const { values } = useFormState();
  const form = useForm();
  // console.log(props)
  async function submitLink() {  
    if (values && values.meta && values.meta.url) {
      const meta = await getArticleMeta(values.meta.url)
      // setUrlMeta(meta)
      form.change('title', meta.title);   
      form.change('meta.abstract', meta.description);   
      form.change('meta.source', meta.source);   
      form.change('images.src', meta.imageUrl);   
    }
  }
  return (
    <div>
      <TextInput source="meta.url" label="文章連結（不會顯示內文）" fullWidth={true}  onChange={() => submitLink()} />
      <Button  variant="contained" color="primary" onClick={() => submitLink()} >輸入連結</Button>
    </div>
  )
}

const SelectStatus = (props) => {
  const [uid, setUid] = React.useState('')
  const form = useForm();
  React.useEffect(() => {
    setUid(firebase.auth().currentUser.uid)
      // cloudFunction('getArticleMeta', {url: "https://www.thenewslens.com/article/156173", timeout: 15000}).then
  }, [])
  const setReviewedBy = input => {  
    console.log('hi')
    form.change('reviewedBy', (input == 'published')? uid : '');   
  }
  return (
    <RadioButtonGroupInput {...props} choices={status}
      onChange={input => setReviewedBy(input)}
    />
  )
}

const ArticlePreview = ({ formData, ...rest }) => (
  <div style={{width: 380, height: 100, display: 'flex', flexDirection: 'row', borderWidth: 1, borderColor: '#000'}}>
    {/* <h1>預覽</h1> */}
    <img src={formData.images? formData.images.src : ''}  height="100" width="100" style={{objectFit: 'cover', borderRadius: 6}} />
    <div style={{color: '#4A4D57', paddingLeft: 16, height: 100, fontFamily: 'sans-serif', position: 'relative'}}>
      <h1 style={{fontSize: 16, flexWrap: 'wrap', overflow: 'hidden', maxHeight: 42, margin: 0, paddingBottom: 3,}}>{formData.title}</h1>
      <p style={{fontSize: 12, height: 34, margin: 0, overflow: 'hidden'}}>{formData.meta? formData.meta.abstract:''}</p>
      <p style={{fontSize: 12, margin: 0, overflow: 'hidden', position: 'absolute', bottom: 0, width: 120}}>1天前</p>
    </div>
  </div>
)

export const ArticleCreate = (props) => {
  const [uid, setUid] = React.useState('')
  const [urlMeta, setUrlMeta] = React.useState({})
  const [isUrl, toggleUrl] = React.useState(false)
  const [reviewedBy, setReviewedBy] = React.useState('')
  async function submitLink(values) {
    
  }  
  React.useEffect(() => {
    setUid(firebase.auth().currentUser.uid)
      // cloudFunction('getArticleMeta', {url: "https://www.thenewslens.com/article/156173", timeout: 15000}).then
  }, [])
  return (
  <Create {...props} >
    <SimpleForm submitOnEnter={false} >
      <ReferenceInput label="作者" source="publishedBy" reference="users" formClassName={styles().inlineBlock} >
        <SelectInput optionText="info.name" initialValue={uid} options={{ disabled: true, readOnly: true }} />
      </ReferenceInput>
      <ReferenceInput label="審核" source="reviewedBy" reference="users" allowEmpty={true} formClassName={styles().inlineBlock} >
        <SelectInput optionText="info.name" allowEmpty={true} options={{ disabled: true, readOnly: true }} />
      </ReferenceInput>
      <TextInput source="title" label="標題" initialValue={urlMeta.title} multiline={true}  fullWidth={true} />
      <SelectStatus source="status" label="發布狀態" initialValue={'draft'} choices={status} />
      <ReferenceInput label="學校" source="community" reference="communities" formClassName={styles().inlineBlock} >
        <SelectInput optionText="name" />
      </ReferenceInput>
      <DateTimeInput source="publishedAt" label="發佈時間" initialValue={Date.now()} formClassName={styles().inlineBlock} />
      <SelectInput source="category" label="分類" choices={categories} formClassName={styles().inlineBlock} />
      <BooleanInput source="pinned" label="置頂" initialValue={false} formClassName={styles().inlineBlock} />
      <AutocompleteArrayInput source="tags" label="標籤" initialValue={[]} choices={tags} fullWidth={true} />
      <RadioButtonGroupInput source="type" label="類型" initialValue={'article'} formClassName={styles().inlineBlock}
        onChange={(input) => toggleUrl(input == 'link')} choices={[
          { id: 'article', name: '文章' },
          { id: 'link', name: '連結' },
      ]} />
      <UrlInput  formClassName={!isUrl? [styles().hidden] : []} />
      <TextInput source="meta.source" label="文章來源" initialValue={urlMeta.source} fullWidth={true} />
      <TextInput source="meta.abstract" label="摘要" initialValue={urlMeta.description} multiline={true} fullWidth={true} />
      <RichTextInput source="content" label="內文" formClassName={isUrl? [styles().hidden] : []} // configureQuill={configureQuill}
        toolbar={[ [{ 'header': [2, false] }], ['bold', 'italic', 'underline', 'strike', { 'script': 'sub'}], [{ 'color': [] }, { 'background': [] }], [{ 'list': 'ordered'}, { 'list': 'bullet' }], ['link', 'image'], ['clean'] ]}
      />
      <TextInput source="images.src" label="縮圖連結" initialValue={urlMeta.imageUrl} fullWidth={true} />
      <FileInput source="images" label="縮圖" accept=".jpg,.png" >
        <FileField source="src" title="title" />
      </FileInput>      
      <FormDataConsumer>
        {({formData, ...rest}) => <ArticlePreview formData={formData} />}
      </FormDataConsumer>
      {/* <TextInput source="meta.coverImage" label="縮圖（請複製上面的檔案名稱）" fullWidth={true} /> */}
    </SimpleForm>
  </Create>
  )
}

export const ArticleCreate_visitor = (props) => {
  const [uid, setUid] = React.useState('')
  const [community, setCommunity] = React.useState('')
  const [urlMeta, setUrlMeta] = React.useState({})
  const [isUrl, toggleUrl] = React.useState(false)
  async function getCommunity() {
    const comm = await getUserCommunity()
    setCommunity(comm)
    console.log(comm)
    
  }
  async function submitLink(values) {
    if (values && values.meta && values.meta.url) {
      toggleUrl(true)
      const meta = await getArticleMeta(values.meta.url)
      setUrlMeta(meta)
    }
  } 
  React.useEffect(() => {
    setUid(firebase.auth().currentUser.uid)
    getCommunity()
  }, [])
  return (
  <Create title={<span>新增文章</span>} {...props} >
    <SimpleForm submitOnEnter={false}>
      <ReferenceInput label="作者" source="publishedBy" reference="users" formClassName={[styles().inlineBlock, styles().hidden]} >
        <SelectInput optionText="info.name" initialValue={uid} options={{ disabled: true, readOnly: true }} />
      </ReferenceInput>
      <TextInput source="title" label="標題" initialValue={urlMeta.title} multiline={true}  fullWidth={true} />
      <ReferenceInput label="學校" source="community" reference="communities" formClassName={[styles().inlineBlock]} >
          <SelectInput optionText="name" initialValue={community} options={{ disabled: true, readOnly: true }} />
        </ReferenceInput>
      <DateTimeInput source="publishedAt" label="發佈時間" initialValue={Date.now()} formClassName={styles().inlineBlock} />
      <TextInput source="category" label="分類" initialValue={'local'}  formClassName={[styles().inlineBlock, styles().hidden]} />
      <BooleanInput source="pinned" label="置頂" initialValue={false} formClassName={[styles().inlineBlock, styles().hidden]} />
      <AutocompleteArrayInput source="tags" label="標籤" choices={tags} initialValue={[]} fullWidth={true} />
      <RadioButtonGroupInput source="type" label="類型" initialValue={'article'} formClassName={styles().inlineBlock}
        onChange={(input) => toggleUrl(input == 'link')} choices={[
          { id: 'article', name: '文章' },
          { id: 'link', name: '連結' },
      ]} />
      <UrlInput  formClassName={!isUrl? [styles().hidden] : []} />
      <TextInput source="meta.source" label="文章來源" initialValue={urlMeta.source} fullWidth={true} />
      <TextInput source="meta.abstract" label="摘要" initialValue={urlMeta.description} multiline={true} fullWidth={true} />
      <RichTextInput source="content" label="內文" formClassName={isUrl? [styles().hidden] : []} style={{height: 200}}// configureQuill={configureQuill}
        toolbar={[ [{ 'header': [2, false] }], ['bold', 'italic', 'underline', 'strike', { 'script': 'sub'}], [{ 'color': [] }, { 'background': [] }], [{ 'list': 'ordered'}, { 'list': 'bullet' }], ['link', 'image'], ['clean'] ]}
      />
      <TextInput source="images.src" label="縮圖連結" initialValue={urlMeta.imageUrl} fullWidth={true} />
      <FileInput source="images" label="縮圖" accept=".jpg,.png" >
        <FileField source="src" title="title" />
      </FileInput>
      <FormDataConsumer>
        {({formData, ...rest}) => <ArticlePreview formData={formData} />}
      </FormDataConsumer>
      {/* <TextInput source="meta.coverImage" label="縮圖（請複製上面的檔案名稱）" fullWidth={true} /> */}
      <RadioButtonGroupInput source="status" label="發布狀態" choices={[
          { id: 'draft', name: '草稿' },
          { id: 'submitted', name: '送出審核' },
      ]} initialValue={'draft'}  formClassName={styles().inlineBlock}  />
    </SimpleForm>
  </Create>
  )
}

export const ArticleEdit = (props) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [images, setImages] = React.useState(['1.jpg', '2.jpg']);
  const [age, setAge] = React.useState('');
  // const [uid, setUid] = React.useState('')
  const [isUrl, toggleUrl] = React.useState(false)
  const [reviewedBy, setReviewedBy] = React.useState('')
  console.log(props)

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
      <SimpleForm submitOnEnter={false}>
        <TextField source="id" formClassName={styles().inlineBlock} />
        <ReferenceField label="作者" source="publishedBy" reference="users" formClassName={styles().inlineBlock} >
          <TextField source="info.name" />
        </ReferenceField>
        <TextInput source="title" label="標題" multiline={true}  fullWidth={true} />
        <ReferenceInput label="審核" source="reviewedBy" reference="users" allowEmpty={true}  formClassName={[styles().inlineBlock, styles().right]} >
          <SelectInput optionText="info.name" initialValue={reviewedBy} allowEmpty={true} options={{ disabled: true, readOnly: true }} />
        </ReferenceInput>
        <SelectStatus source="status" label="發布狀態" initialValue={'draft'} choices={status} />
        <ReferenceInput label="學校" source="community" reference="communities" formClassName={styles().inlineBlock} >
          <SelectInput optionText="name" />
        </ReferenceInput>
        <DateTimeInput source="publishedAt" label="發佈時間" formClassName={styles().inlineBlock} />
        <SelectInput source="category" label="分類" choices={categories} formClassName={styles().inlineBlock} />
        <BooleanInput source="pinned" label="置頂" formClassName={styles().inlineBlock} />
        <AutocompleteArrayInput source="tags" label="標籤" choices={tags} fullWidth={true} />
        <RadioButtonGroupInput source="type" label="類型" initialValue={'article'} formClassName={styles().inlineBlock}
          onChange={(input) => toggleUrl(input == 'link')} choices={[
            { id: 'article', name: '文章' },
            { id: 'link', name: '連結' },
        ]} />
        <UrlInput  formClassName={!isUrl? [styles().hidden] : []} />
        <TextInput source="meta.source" label="文章來源"  fullWidth={true} />
        <TextInput source="meta.abstract" label="摘要" multiline={true} fullWidth={true} />
        <RichTextInput source="content" label="內文" formClassName={isUrl? [styles().hidden] : []} // configureQuill={configureQuill}
          toolbar={[ [{ 'header': [2, false] }], ['bold', 'italic', 'underline', 'strike', { 'script': 'sub'}], [{ 'color': [] }, { 'background': [] }], [{ 'list': 'ordered'}, { 'list': 'bullet' }], ['link', 'image'], ['clean'] ]}
        />
        <TextInput source="images.src" label="縮圖連結" fullWidth={true} />
        <FileInput source="images" label="縮圖" accept=".jpg,.png">
          <FileField source="src" title="title" />
        </FileInput>
        <FormDataConsumer>
          {({formData, ...rest}) => <ArticlePreview formData={formData} />}
        </FormDataConsumer>
        {/* <TextInput source="meta.coverImage" label="縮圖（請複製上面的檔案名稱）" fullWidth={true} /> */}
      </SimpleForm>
    </Edit> 
  );
}

export const ArticleEdit_visitor = (props) => {
  // const [uid, setUid] = React.useState('')
  // const [community, setCommunity] = React.useState('')
  const [urlMeta, setUrlMeta] = React.useState({})
  const [isUrl, toggleUrl] = React.useState(false)
  // async function getCommunity() {
  //   const comm = await getUserCommunity()
  //   setCommunity(comm)
  //   console.log(comm)
    
  // }
  async function submitLink(values) {
    if (values && values.meta && values.meta.url) {
      toggleUrl(true)
      const meta = await getArticleMeta(values.meta.url)
      setUrlMeta(meta)
    }
  } 
  // React.useEffect(() => {
    // setUid(firebase.auth().currentUser.uid)
  //   getCommunity()
  // }, [])
  return (
  <Edit title={<span>編輯文章</span>} actions={<span></span>} {...props} >
    <SimpleForm submitOnEnter={false}>
      <ReferenceInput label="作者" source="publishedBy" reference="users" formClassName={[styles().inlineBlock, styles().hidden]} >
        <SelectInput optionText="info.name" options={{ disabled: true, readOnly: true }} />
      </ReferenceInput>
      <TextInput source="title" label="標題" multiline={true}  fullWidth={true} />
      <ReferenceInput label="學校" source="community" reference="communities" formClassName={[styles().inlineBlock]} >
          <SelectInput optionText="name" options={{ disabled: true, readOnly: true }} />
        </ReferenceInput>
      <DateTimeInput source="publishedAt" label="發佈時間" formClassName={styles().inlineBlock} />
      <TextInput source="category" label="分類"  formClassName={[styles().inlineBlock, styles().hidden]} />
      <BooleanInput source="pinned" label="置頂" formClassName={[styles().inlineBlock, styles().hidden]} />
      <AutocompleteArrayInput source="tags" label="標籤" choices={tags} fullWidth={true} />
      <RadioButtonGroupInput source="type" label="類型" formClassName={styles().inlineBlock}
        onChange={(input) => toggleUrl(input == 'link')} choices={[
          { id: 'article', name: '文章' },
          { id: 'link', name: '連結' },
      ]} />
      <UrlInput  formClassName={!isUrl? [styles().hidden] : []} />
      <TextInput source="meta.source" label="文章來源" fullWidth={true} />
      <TextInput source="meta.abstract" label="摘要" multiline={true} fullWidth={true} />
      <RichTextInput source="content" label="內文" formClassName={isUrl? [styles().hidden] : []} // configureQuill={() => configureQuill()}
        toolbar={[ [{ 'header': [2, false] }], ['bold', 'italic', 'underline', 'strike', { 'script': 'sub'}], [{ 'color': [] }, { 'background': [] }], [{ 'list': 'ordered'}, { 'list': 'bullet' }], ['link', 'image'], ['clean'] ]}
      />
      <TextInput source="images.src" label="縮圖連結" fullWidth={true}  formClassName={!isUrl? [styles().hidden] : []} />
      <FileInput source="images" label="縮圖" accept=".jpg,.png" >
          <FileField source="src" title="title" />
      </FileInput>
      <FormDataConsumer>
          {({formData, ...rest}) => <ArticlePreview formData={formData} />}
      </FormDataConsumer>
      {/* <TextInput source="meta.coverImage" label="縮圖（請複製上面的檔案名稱）" fullWidth={true} /> */}
      <RadioButtonGroupInput source="status" label="發布狀態" choices={[
          { id: 'draft', name: '草稿' },
          { id: 'submitted', name: '送出審核' },
      ]} formClassName={styles().inlineBlock}  />
    </SimpleForm>
  </Edit>
  )
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