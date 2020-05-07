import * as Express from 'express';
import * as fs from 'fs';
import * as util from 'util';
import Context from "../Map/contex";
import { CMapWrapper, IEventCallback } from "../Map";
import { Wrapper } from '..';

const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);


interface IExtCommand {
    id: string;
    name: string;
    description?: string;
    showRules?: any[];
}

interface IExtCommandCtx {
    mapId: string;
    nodeId: string;
    userId: string;
    userToken: string;
    sessionId: string;
}

export interface IExtStore<T=any> {
    init(): Promise<void>;
    set(key: string, value: T): Promise<void>;
    get(key: string): Promise<T|undefined>
    getAll(): Promise<T[]>
    delete(key: string): Promise<void>
}

export type ExtCmdCallback = (conn: Wrapper, ctx: IExtCommandCtx) => void;
export type ExtEventCallback = (conn: Wrapper, ctx: Context) => void;


class FileStore<T=any> implements IExtStore {
    private filename: string = '/Users/deissh/work/satek/redforester/rfwrapper/example/data.json'
    private data: Map<string, T> = new Map();

    async init(): Promise<void> {
        const records = require(this.filename);
        for (const record of records) {
            this.data.set(record[0], record[1]);
        }
    }
    async set(key: string, value: any): Promise<void> {
        this.data.set(key, value);
        await writeFile(this.filename, JSON.stringify(Array.from(this.data.entries())), 'utf-8');
    }
    async get(key: string): Promise<T|undefined> {
        return this.data.get(key);
    }
    async getAll(): Promise<string[]> {
        return Array.from(this.data.keys());
    }
    async delete(key: string): Promise<void> {
        this.data.delete(key);
        await writeFile(this.filename, JSON.stringify(Array.from(this.data.entries())), 'utf-8');
    }
}

export class CExtention {
    private name: string = '';
    private description: string = '';
    private email: string = '';
    private baseUrl: string = '';

    private commands: IExtCommand[] = [];
    private cmdHandlers: Map<string, ExtCmdCallback> = new Map();
    private requiredTypes: any[] = [];

    private store: IExtStore<string>;
    private connectedMaps: Map<string, CMapWrapper> = new Map();
    private eventHandlers: {event: string, callback: ExtEventCallback}[] = [];

    private rfBaseUrl: string = 'https://***REMOVED***/';

    constructor(store?: IExtStore) {
        this.store = store || new FileStore();
    }

    public setName(name: string): CExtention {
        this.name = name;
        return this;
    }

    public setDescription(description: string): CExtention {
        this.description = description;
        return this;
    }

    public setEmail(email: string): CExtention {
        this.email = email;
        return this;
    }

    /**
     * The address where the extension is launched in the format of protocol: // host: port / url.
     * Only necessary if the extension has action type commands
     */
    public setBaseUrl(baseUrl: string): CExtention {
        this.baseUrl = baseUrl;
        return this;
    }

    public on(event: string, callback: ExtEventCallback) {
        this.eventHandlers.push({event, callback})
        return this;
    }

    public command(data: IExtCommand, callback: ExtCmdCallback) {
        this.commands.push(data)
        this.cmdHandlers.set(data.id, callback);

        return this;
    }

    public get toJSON() {
        const cmds = this.commands
            .map(cmd => ({
                name: cmd.name,
                description: cmd.description || "",
                showRules: cmd.showRules || [],
                type: {
                    action: cmd.id,
                }
            }))

        return {
            name: this.name,
            description: this.description,
            email: this.email,
            baseUrl: this.baseUrl,
            commands: cmds
        }
    }

    public map(id: string): CMapWrapper | undefined {
        return this.connectedMaps.get(id);
    }

    public register(username: string, hash: string): void {
        console.log(JSON.stringify(this.toJSON))
    }

    public start(port: number, callback?: (...args: any[]) => void) {
        const app = Express();

        app.post('/api/is-alive', (req, res) => res.json({message: 'I\'m alive!'}))
        app.post('/api/maps/:mapid', (req, res) => this.connectRequest(req, res))
        app.delete('/api/maps/:mapid', (req, res) => this.disconnectRequest(req, res))

        for (const [id, cmd] of this.cmdHandlers) {
            app.all(`/api/commands/${id}`, this.wrappRequest(cmd))
        }

        this.init()
            .then(() => app.listen(port, callback));
    }

    private async init(): Promise<this> {
        await this.store.init();

        for (const map_id of await this.store.getAll()) {
            const token = await this.store.get(map_id)
            if (!token) continue;

            await this.addMap(map_id, token);
        }

        return this;
    }

    private async addMap(mapId: string, serviceToken: string) {
        const wrapper = new Wrapper({
            username: 'extension',
            password: serviceToken,
            host: this.rfBaseUrl
        });

        const map = await wrapper.Map(mapId, { loadmap: false, enablePolling: true });

        for (const e of this.eventHandlers) {
            map.on(e.event, (ctx, done) => {
                e.callback(wrapper, ctx);
                done();
            })
        }

        this.connectedMaps.set(mapId, map)

        map.start();
    }

    private async connectRequest(req: Express.Request, res: Express.Response) {
        const serviceToken = String(req.headers['rf-extension-token']);
        const mapId = req.params.mapid

        try {
            await this.store.set(mapId, serviceToken)
            await this.addMap(mapId, serviceToken);
        } catch (error) {
            console.error(error)
            res.status(400).json({})
            return
        }

        res.status(200).json({})
    }

    private async disconnectRequest(req: Express.Request, res: Express.Response) {
        const mapId = req.params.mapid

        res.status(200).json({})

        const map = this.connectedMaps.get(mapId);
        if (!map) return;

        map.longpool = false;

        await this.store.delete(mapId)
        this.store.delete(mapId);
    }

    private wrappRequest(callback: ExtCmdCallback): Express.Handler {
        return (req, res) => {
            const context: IExtCommandCtx = {
                mapId: String(req.query.map_id),
                nodeId: String(req.query.node_id),
                userId: String(req.query.user_d),
                userToken: String(req.headers['rf-extension-token']),
                sessionId: String(req.headers['Session-Id']),
            }

            const wrapper = new Wrapper({
                username: 'extension',
                password: context.userToken,
                host: this.rfBaseUrl
            });

            const result = callback(wrapper, context);

            res.json(result);
        }
    }
}
