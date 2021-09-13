import * as React from "react";
import { ArticleList, ArticleShow, ArticleCreate, ArticleEdit,ArticleList_visitor, ArticleCreate_visitor, ArticleEdit_visitor } from "./articles";
import { CommunityList, CommunityShow, CommunityCreate, CommunityEdit, DepartmentCreate } from "./communities";
import { UserList, UserShow, UserCreate, UserEdit, UserEdit_editor } from "./users";
import { ChatroomList, ChatroomShow, ChatroomCreate, ChatroomEdit } from "./chatrooms";
import { Admin, Resource, ListGuesser } from "react-admin";
import {
  FirebaseDataProvider,
  FirebaseAuthProvider
} from "react-admin-firebase";
import CommunityIcon from '@material-ui/icons/Domain';
import ArticleIcon from '@material-ui/icons/LibraryBooks';
import UserIcon from '@material-ui/icons/People';
import ChatroomIcon from '@material-ui/icons/Forum';
import CustomLoginPage from './CustomLoginPage';
import Dashboard from './dashboard';
import { firebaseConfig as config } from './FIREBASE_CONFIG';
import { firebase } from './FIREBASE_CONFIG';
import { getAcessRole } from './firebase';

const options = {
  logging: true,
  disableMeta: true,
  watch: ['articles', 'communities'],
  relativeFilePaths: false,
  useFileNamesInStorage: true, 
  // dontAddIdFieldToDoc: true,
  // rootRef: 'root_collection/some_document'
}
const dataProvider = FirebaseDataProvider(config, options);
const authProvider = FirebaseAuthProvider(config, options);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accessRole: 'user'
    };
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        let idTokenResult = await user.getIdTokenResult()
        console.log(user)
        console.log(idTokenResult)
        this.setState({ accessRole: idTokenResult.claims.role })
      }
    })
    authProvider.getPermissions().then(user => {
      if (user) {
        this.setState({ accessRole: user.role })
        console.log(user.role, user)
      }
    })
  }
  render() {
  return (
    this.state.accessRole == 'admin' ? (
      <Admin
        loginPage={CustomLoginPage} 
        dataProvider={dataProvider}
        authProvider={authProvider}
        // dashboard={Dashboard}
      >
        <Resource
          options={{label: '文章'}} 
          name="articles"
          icon={ArticleIcon}
          list={ArticleList}
          show={ArticleShow}
          create={ArticleCreate}
          edit={ArticleEdit}
        />
        <Resource
          options={{label: '使用者'}} 
          name="users"
          icon={UserIcon}
          list={UserList}
          show={UserShow}
          create={UserCreate}
          edit={UserEdit}
        />
        <Resource
          options={{label: '學校'}} 
          name="communities"
          icon={CommunityIcon}
          list={CommunityList}
          show={CommunityShow}
          create={CommunityCreate}
          edit={CommunityEdit}
        />
        <Resource
          options={{label: '聊天室'}} 
          name="chatrooms"
          icon={ChatroomIcon}
          list={ChatroomList}
          show={ChatroomShow}
          create={ChatroomCreate}
          edit={ChatroomEdit}
        />
        <Resource name="communities/cgust/departments"/>
        <Resource name="communities/cgu/departments"/>
        <Resource name="communities/ntu/departments"/>
        <Resource name="communities/nthu/departments"/>
        <Resource name="communities/nctu/departments"/>
        <Resource name="communities/scu/departments"/>
        <Resource name="communities/nccu/departments"/>
        <Resource name="communities/ccu/departments"/>
        <Resource name="communities/ntnu/departments"/>
        <Resource name="communities/fju/departments"/>
        <Resource name="communities/shu/departments"/>
        <Resource name="communities/tku/departments"/>
        <Resource name="communities/all/departments"/>
        <Resource name="communities/test/departments"/>
      </Admin>
      ) : this.state.accessRole == 'editor' ? (
        <Admin
          loginPage={CustomLoginPage} 
          dataProvider={dataProvider}
          authProvider={authProvider}
          // dashboard={Dashboard}
        >
          <Resource
            options={{label: '文章'}} 
            name="articles"
            icon={ArticleIcon}
            list={ArticleList}
            show={ArticleShow}
            create={ArticleCreate}
            edit={ArticleEdit}
          />
          <Resource
            options={{label: '使用者'}} 
            name="users"
            icon={UserIcon}
            list={UserList}
            show={UserShow}
            create={UserCreate}
            edit={UserEdit_editor}
          />
          <Resource name="communities"/>
        </Admin>
      ) : (
        <Admin
          loginPage={CustomLoginPage} 
          dataProvider={dataProvider}
          authProvider={authProvider}
          // dashboard={Dashboard}
        >   
        <Resource
          options={{label: '文章發布'}} 
          name="articles"
          icon={ArticleIcon}
          list={ArticleList_visitor}
          show={ArticleShow}
          create={ArticleCreate_visitor}
          edit={ArticleEdit_visitor}
        />
        <Resource name="users" />
        <Resource name="communities"/>
      </Admin>
      )
    );
  }
}

export default App;
