export interface INodeInfo {
  id?: string;
  map_id: string;
  parent: string;
  position: string[];
  access: string;
  originalParent: string;
  body: INodeBody;
  hidden: boolean;
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
  unread_comments_count: number;
  children: INodeInfo[];
  access: any;
  meta: any;
  comments_count: number;
}

export interface INodeFindOptions {
  typeid?: string;
  regex?: RegExp;
}
