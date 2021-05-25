import * as Express from 'express';
import { EventContext } from '../Map/contex';
import { CMapWrapper } from '../Map';
import { Wrapper } from '..';
import {
  IExtStore,
  IExtCommandCtx,
  IExtentionOptions,
  ICommandRequiredType,
  ICommandOptions,
  IExtUserInfo,
} from './interface';
import { FileStore } from './store';
import { ICommandReply, NotifyReply, NotifyStyle } from './reply/index';
import { Command } from './command';
import { Event } from './event';

export type ExtCmdCallback = (
  conn: Wrapper,
  ctx: IExtCommandCtx
) => Promise<ICommandReply | null>;
export type ExtEventCallback = (
  conn: Wrapper,
  ctx: EventContext
) => Promise<void>;

export class Extention {
  public rfBaseUrl: string;
  private name: string;
  private user: IExtUserInfo;
  private description: string;
  private email: string;
  private baseUrl: string;

  private commands: ICommandOptions[] = [];
  private cmdHandlers: Map<string, ExtCmdCallback> = new Map();
  private eventHandlers: Event[] = [];

  private requiredTypes: ICommandRequiredType[] = [];

  private store: IExtStore<string>;
  private connectedMaps: Map<string, CMapWrapper> = new Map();

  constructor(options: IExtentionOptions) {
    this.store = options.store || new FileStore();

    this.name = options.name;
    this.user = options.user;
    this.description = options.description || '';
    this.email = options.email;
    this.baseUrl = options.baseUrl;
    this.rfBaseUrl = options.rfBaseUrl || 'https://app.test.redforester.com/';
    this.requiredTypes = options.requiredTypes || [];
  }

  public toJSON() {
    return {
      name: this.name,
      description: this.description,
      user: this.user,
      email: this.email,
      baseUrl: this.baseUrl,
      commands: this.commands.map(cmd => ({
        name: cmd.name,
        description: cmd.description || '',
        showRules: cmd.showRules || [],
        type: {
          action: cmd.id,
        },
      })),
      requiredTypes: [
        ...this.commands.map(cmd => cmd.requiredTypes || []).flat(),
        ...this.requiredTypes,
      ], // todo: merge
    };
  }
  /**
   * @description Подписывает на события на всех картах
   * @param callback
   */
  public subscribe(callback: Event): Extention;
  public subscribe(event: string, callback: ExtEventCallback): Extention;
  public subscribe(
    event: Event | string,
    callback?: ExtEventCallback
  ): Extention {
    if (typeof event === 'string') {
      this.eventHandlers.push({ run: callback!, eventName: event });
    } else {
      this.eventHandlers.push(event);
    }

    return this;
  }

  /**
   * @description Добавляет команду и регистрирует ее
   * @param cmd
   */
  public command(cmd: Command): Extention;
  public command(cmd: ICommandOptions, callback: ExtCmdCallback): Extention;
  public command(
    cmd: Command | ICommandOptions,
    callback?: ExtCmdCallback
  ): Extention {
    this.commands.push(cmd);
    this.cmdHandlers.set(cmd.id, 'run' in cmd ? cmd.run : callback!);

    return this;
  }

  public map(id: string): CMapWrapper | undefined {
    return this.connectedMaps.get(id);
  }

  public async register(username: string, password: string): Promise<void> {
    const w = new Wrapper({ username, password, host: this.rfBaseUrl });

    const plugins = await w.extention.getOwned();
    for (const plugin of plugins) {
      if (plugin.name !== this.name) {
        continue;
      }

      await w.extention.update(plugin.id!, this.toJSON());
      return;
    }

    await w.extention.create(this.toJSON());
  }

  public start(port: number, callback?: (...args: any[]) => void) {
    const app = Express();

    app.all('/api/is-alive', (req, res) =>
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
      // tslint:disable-next-line
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
        // tslint:disable-next-line
        console.error(e);
        result = new NotifyReply()
          .setContent(`Ошибка во время выполнения`)
          .setStyle(NotifyStyle.DANGER);
      }

      res.status(200).json(result ? result.toJSON() : result);
    };
  }
}
