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
