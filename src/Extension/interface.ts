export interface IExtCommandCtx {
  mapId: string;
  nodeId: string;
  userId: string;
  userToken: string;
  sessionId: string;
}

export interface IExtStore<T = any> {
  init(): Promise<void>;
  set(key: string, value: T): Promise<void>;
  get(key: string): Promise<T | undefined>;
  getAll(): Promise<T[]>;
  delete(key: string): Promise<void>;
}
