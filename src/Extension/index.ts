import * as Express from 'express';
import Context from "../Map/contex";
import { CMapWrapper } from "../Map";

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

    private connectedMaps: CMapWrapper[] = [];

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
        this.email = baseUrl;
        return this;
    }

    public on(eventName: string, callback: (ctx: Context) => void) {
        return this;
    }

    public addCmd(data: IExtCommand, callback: (ctx: IExtCommandCtx) => any) {
        this.commands.push(data)
        this.cmdHandlers.set(data.id, callback);

        return this;
    }

    public toJSON() {
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

    }

    public start(port: number, callback?: (...args: any[]) => void) {
        const app = Express();

        app.post('/api/is-alive', (req, res) => res.json({message: 'I\'m alive!'}))

        for (const [id, cmd] of this.cmdHandlers) {
            app.all(`/api/commands/${id}`, this.wrappRequest(cmd))
        }

        return app.listen(port, callback);
    }

    private wrappRequest(callback: (ctx: IExtCommandCtx) => any): Express.Handler {
        return (req, res) => {
            const context: IExtCommandCtx = {
                mapId: String(req.query.map_id),
                nodeId: String(req.query.node_id),
                userId: String(req.query.user_d),
                userToken: String(req.headers['Rf-Extension-Token']),
                sessionId: String(req.headers['Session-Id']),
            }

            const result = callback(context);

            res.json(result);
        }
    }
}


const ext = new CExtention();

ext
    .setName('somename')
    .setDescription(`some value with ${1 + 3}`)
    .on('node_updated', (ctx) => console.log(ctx.who.id))

    .addCmd({ id: 'somefunc', name: 'Какая то функция' }, (ctx) => {
        return ctx
    })
    .addCmd({ id: 'otherfunct', name: 'Отчет', description: 'описание' }, (ctx) => {
        return null
    })


ext.register('owner@emai.com', 'somemd5');
ext.start(1233, console.log)
