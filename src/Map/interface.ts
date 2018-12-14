import { INodeInfo } from '../Node/interfaces';
import { IUserInfo } from '../User/interfaces';

export { INodeInfo, IUserInfo };

export interface IMapWrapper {
  id: string;
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
