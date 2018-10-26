import { IAxios } from "../interfaces";

export default class CNodeWrapper {
    public id: string;
    public map_id: string;
    public parent: string;
    public position: any;
    public access: string;
    public originalParent: string;
    public body: any;
    public hidden: string;
    public readers: any;
    public nodelevel: number;
    public meta: any;

    constructor(params: IAxios, id: string) {
        this.id = id
    }
}