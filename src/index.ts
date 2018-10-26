import { IAxios, IParams } from './interfaces';
import CMap from './api/map';
import CGlobal from './api/global';

export default class {
    private settings: IParams;
    private axios: IAxios;

    constructor(settings: IParams) {
        this.settings = settings;
        this.axios = {
            auth: settings,
            baseURL: 'app.redforester.com',
            responseType: 'json'
        }
    }

    public get global(): CGlobal {
        return new CGlobal(this.axios)
    }

    public get map(): CMap {
        return new CMap(this.axios)
    }
}