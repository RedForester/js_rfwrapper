export interface IParams {
    username: string,
    password: string
}

export interface IAxios {
    auth: {
        username: string,
        password: string,
    },
    baseURL: string,
    responseType: string,
}