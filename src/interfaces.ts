export interface IParams {
  username: string;
  password: string;
  host?: string;
}

export interface IAxios {
  auth: {
    username: string;
    password: string;
  };
  baseURL: string;
  responseType: string;
}

// интейрфейсы для работы Wrapper
// информация об узле
export interface INodeInfo {
  id?: string;
  map_id: string;
  parent: string;
  position: string[];
  access: string;
  originalParent: string;
  body: INodeBody;
  hidden: string;
  readers: string[];
  nodelevel: number;
  meta: any;
}

export interface INodeBody {
  id?: string;
  map_id: string;
  type_id: string;
  properties: any;
  parent: string;
  unread_comments_count: string;
  children: INodeInfo[];
  access: any;
  meta: any;
  comments_count: string;
}

// информация о карте
export interface IMapInfo {
  name: string;
  accessed: string;
  layout: string;
  node_count: number;
  user_count: number;
  objid: string;
  owner: string;
  owner_avatar: string;
  owner_name: string;
  public: string;
  role: IMapRole[];
  root_node_id: string;
  users: IUserInfo[];
}

export interface IMapRole {
  role: string;
  editable: string;
  alias: any;
}

// информация о пользователе
export interface IUserInfo {
  user_id: string;
  username: string;
  name?: string;
  surname?: string;
  avatar?: string;
  registration_date: number;
  birthday: number;
  contacts?: any[];
}
