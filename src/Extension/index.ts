import * as Express from 'express';
import Context from "../Map/contex";
import { CMapWrapper, IEventCallback } from "../Map";
import { Wrapper } from '..';
import { Api } from '../api';

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

export class CExtention {
    private name: string = '';
    private description: string = '';
    private email: string = '';
    private baseUrl: string = '';

    private commands: IExtCommand[] = [];
    private cmdHandlers: Map<string, (ctx: IExtCommandCtx) => void> = new Map();
    private requiredTypes: any[] = [];

    private connectedMaps: Map<string, CMapWrapper> = new Map();
    private eventHandlers: {event: string, callback: IEventCallback}[] = [];

    constructor() {}

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

    public on(event: string, callback: IEventCallback) {
        this.eventHandlers.push({event, callback})
        return this;
    }

    public addCmd(data: IExtCommand, callback: (ctx: IExtCommandCtx) => any) {
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

        return app.listen(port, callback);
    }

    private async connectRequest(req: Express.Request, res: Express.Response) {
        const serviceToken = String(req.headers['rf-extension-token']);
        const mapId = req.params.mapid

        try {
            const wrapper = new Wrapper({
                username: 'extension',
                password: serviceToken,
                host: 'https://***REMOVED***/'
            });
    
            const map = await wrapper.Map(mapId, { loadmap: false, enablePolling: true });

            this.eventHandlers.forEach(e => map.on(e.event, e.callback));

            this.connectedMaps.set(mapId, map)

            map.start();
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

        this.connectedMaps.delete(mapId);
    }

    private wrappRequest(callback: (ctx: IExtCommandCtx) => any): Express.Handler {
        return (req, res) => {
            const context: IExtCommandCtx = {
                mapId: String(req.query.map_id),
                nodeId: String(req.query.node_id),
                userId: String(req.query.user_d),
                userToken: String(req.headers['rf-extension-token']),
                sessionId: String(req.headers['Session-Id']),
            }

            const result = callback(context);

            res.json(result);
        }
    }
}
