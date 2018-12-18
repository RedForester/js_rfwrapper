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

export interface IUser {
  user_id: string;
  username: string;
  name: string;
  surname: string;
  avatar: null;
  registration_date: string;
  birthday: null;
  contacts: IUserContacts;
  kv_session: string;
  cmdBuffer: any[];
  tags: IUserTagsItem[];
  saved_search_queries: IUserSavedSearchQueriesItem[];
}

interface IUserContacts {
  skype: string;
}
interface IUserTagsItem {
  id: string;
  name: string;
  removable: boolean;
}
interface IUserSavedSearchQueriesItem {
  id: string;
  title: string;
  query: string;
  timestamp: number;
}
