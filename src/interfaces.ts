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
