import * as Express from 'express';
import Context from '../Map/contex';
import { CMapWrapper } from '../Map';
import { Wrapper } from '..';
import { IExtStore, IExtCommandCtx } from './interface';
import { FileStore } from './store';
import { ICommandReply, NotifyReply, NotifyStyle } from './reply';
import { Command } from './command';
import { Event } from './event';

export type ExtCmdCallback = (
  conn: Wrapper,
  ctx: IExtCommandCtx
) => Promise<ICommandReply | null>;
export type ExtEventCallback = (conn: Wrapper, ctx: Context) => Promise<void>;

export class CExtention {
  public rfBaseUrl: string = 'https://***REMOVED***/';
  private name: string = '';
  private description: string = '';
  private email: string = '';
  private baseUrl: string = '';

  private commands: Command[] = [];
  private cmdHandlers: Map<string, ExtCmdCallback> = new Map();
  private eventHandlers: Event[] = [];

  private requiredTypes: any[] = [];

  private store: IExtStore<string>;
  private connectedMaps: Map<string, CMapWrapper> = new Map();

  constructor(store?: IExtStore) {
    this.store = store || new FileStore();
  }
  public toJSON() {
    return {
      name: this.name,
      description: this.description,
      email: this.email,
      baseUrl: this.baseUrl,
      commands: this.commands,
      requiredTypes: this.requiredTypes,
    };
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

  public setRfBase(url: string): CExtention {
    this.rfBaseUrl = url;
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
    this.eventHandlers.push({ run: callback, eventName: event });
    return this;
  }

  /**
   * Подписывает на события на всех картах
   * @param handler
   */
  public subscribe(handler: Event) {
    this.eventHandlers.push(handler);

    return this;
  }

  public command(cmd: Command): CExtention {
    this.commands.push(cmd);
    this.cmdHandlers.set(cmd.id, cmd.run);

    return this;
  }

  public showRule(
    name: 'allNodes' | 'root' | 'selfType' | 'descendantOfType',
    value: any
  ) {
    return (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) => {
      const idx = this.commands.findIndex(c => c.id === propertyKey);
      if (idx === -1) {
        throw new Error('Необходим декоратор .command(name, description)');
      }

      this.commands[idx].showRules.push({ [name]: value });
    };
  }

  public map(id: string): CMapWrapper | undefined {
    return this.connectedMaps.get(id);
  }

  public async register(username: string, password: string): Promise<void> {
    const w = new Wrapper({ username, password, host: this.rfBaseUrl });

    const plugins = await w.extention.getOwned();
    for (const plugin of plugins) {
      if (plugin.name !== this.name) continue;

      await w.extention.update(plugin.id!, this.toJSON())
      return;
    }

    await w.extention.create(this.toJSON())
  }

  public start(port: number, callback?: (...args: any[]) => void) {
    const app = Express();

    app.post('/api/is-alive', (req, res) =>
      res.json({ message: "I'm alive!" })
    );
    app.post('/api/maps/:mapid', (req, res) => this.connectRequest(req, res));
    app.delete('/api/maps/:mapid', (req, res) =>
      this.disconnectRequest(req, res)
    );

    for (const [id, cmd] of this.cmdHandlers) {
      app.all(`/api/commands/${id}`, this.wrappRequest(cmd));
    }

    this.init().then(() => app.listen(port, callback));
  }

  private async init(): Promise<this> {
    await this.store.init();

    for (const map_id of await this.store.getAll()) {
      const token = await this.store.get(map_id);
      if (!token) {
        continue;
      }

      await this.addMap(map_id, token);
    }

    return this;
  }

  private async addMap(mapId: string, serviceToken: string) {
    const wrapper = new Wrapper({
      username: 'extension',
      password: serviceToken,
      host: this.rfBaseUrl,
    });

    const map = await wrapper.Map(mapId, {
      loadmap: false,
      enablePolling: true,
    });

    for (const e of this.eventHandlers) {
      map.on(e.eventName, (ctx, done) => {
        e.run(wrapper, ctx);
        done();
      });
    }

    this.connectedMaps.set(mapId, map);

    map.start();
  }

  private async connectRequest(req: Express.Request, res: Express.Response) {
    const serviceToken = String(req.headers['rf-extension-token']);
    const mapId = req.params.mapid;

    try {
      await this.store.set(mapId, serviceToken);
      await this.addMap(mapId, serviceToken);
    } catch (error) {
      console.error(error);
      res.status(400).json({});
      return;
    }

    res.status(200).json({});
  }

  private async disconnectRequest(req: Express.Request, res: Express.Response) {
    const mapId = req.params.mapid;

    res.status(200).json({});

    const map = this.connectedMaps.get(mapId);
    if (!map) {
      return;
    }

    map.longpool = false;

    await this.store.delete(mapId);
    this.store.delete(mapId);
  }

  private wrappRequest(callback: ExtCmdCallback): Express.Handler {
    return async (req, res) => {
      const context: IExtCommandCtx = {
        mapId: String(req.query.mapId),
        nodeId: String(req.query.nodeId),
        userId: String(req.query.userId),
        userToken: String(
          req.headers['rf-extension-token'] || req.headers['Rf-Extension-Token']
        ),
        sessionId: String(req.headers['Session-Id']),
      };

      let result = null;
      try {
        const wrapper = new Wrapper({
          username: 'extension',
          password: context.userToken,
          host: this.rfBaseUrl,
        });

        result = await callback(wrapper, context);
      } catch (e) {
        console.error(e);
        result = new NotifyReply()
          .setContent(`Ошибка во время выполнения`)
          .setStyle(NotifyStyle.DANGER);
      }

      res.status(200).json(result ? result.toJSON() : result);
    };
  }
}
