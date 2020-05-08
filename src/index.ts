export { Wrapper } from './wrapper';
export { CExtention } from './Extension';

export { NotifyReply, NotifyStyle } from './Extension/reply';

export {
  IMapInfo,
  IMapRole,
  IMapWrapper,
  IMapWrapperOptions,
} from './Map/interface';
export {
  INodeBody,
  INodeFindOptions,
  INodeInfo,
  INodeType,
} from './Node/interfaces';
export {
  IAccessAddNewUser,
  IUser,
  IUserContacts,
  IUserInfo,
  IUserSavedSearchQueriesItem,
  IUserTagsItem,
} from './User/interfaces';

// debug axios requests
// import axios from 'axios';
// axios.interceptors.response.use(response => {
//   // tslint:disable-next-line:no-console
//   console.log(
//     response.status,
//     response.request.method,
//     response.request.path
//   );

//   return response;
// });
