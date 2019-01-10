import { INodeInfo } from '../Node/interfaces';
import { IUserInfo } from '../User/interfaces';
import { CNodeWrapper } from '../Node';
import { CMapWrapper } from '.';

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
  public: boolean;
  role: IMapRole | IMapRole[];
  root_node_id: string;
  users: IUserInfo[];
  tree?: INodeInfo[];
}

export interface IMapInfo {
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
  public: boolean;
  role: IMapRole | IMapRole[];
  root_node_id: string;
  users: IUserInfo[];
}

export interface IMapRole {
  role: string;
  editable: boolean;
  alias: any;
  description: string;
}

export interface IMapWrapperOptions {
  /**
   * @description включать ли лонгпуллинг
   */
  enablePolling?: boolean;
  map?: IMapInfo;
  viewport?: string;
}
