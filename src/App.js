import * as React from "react";
import { PostList, PostShow, PostCreate, PostEdit } from "./posts";
import { CommunityList, CommunityShow, CommunityCreate, CommunityEdit } from "./communities";
import { Admin, Resource } from "react-admin";
import {
  FirebaseDataProvider,
  FirebaseAuthProvider
} from "react-admin-firebase";
import CommentIcon from '@material-ui/icons/Comment';
import CustomLoginPage from './CustomLoginPage';

import { firebaseConfig as config } from './FIREBASE_CONFIG';

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
  render() {
    return (
      <Admin
        loginPage={CustomLoginPage} 
        dataProvider={dataProvider}
        authProvider={authProvider}
      >
        <Resource
          name="articles"
          list={PostList}
          show={PostShow}
          create={PostCreate}
          edit={PostEdit}
        />
        <Resource
          name="communities"
          icon={CommentIcon}
          list={CommunityList}
          show={CommunityShow}
          create={CommunityCreate}
          edit={CommunityEdit}
        />
      </Admin>
    );
  }
}

export default App;
