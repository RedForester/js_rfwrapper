import { IAxios } from '../interfaces';
import CApi from '../api';

export class CNodeWrapper {
  private api: CApi;
  private info!: any;

  public ready: any;
  public id: string;

  /**
   * Класс для работы с узлом
   * @param {IAxios} params
   * @param {string} id uuid узла
   */
  constructor(params: IAxios, id: string) {
    this.api = new CApi(params);
    this.id = id;

    this.ready = this.init()
  }

  /**
   * Иницилизирует и загружает информацию о карте
   * @returns {Promise<CNodeWrapper>} загруженый класс
   */
  public async init() {
    this.info = await this.api.node.get(this.id);
    return this;
  }

  // Getters and Setters

  get map_id(): string {
    return this.info.map_id
  }
  get parent(): string {
    return this.info.parent
  }
  get position(): Array<string> {
    return this.info.position
  }
  get access(): string {
    return this.info.access
  }
  get originalParent() :string {
    return this.info.originalParent
  }
  get hidden(): boolean {
    return this.info.hidden
  }
  get readers(): Array<string> {
    return this.info.readers
  }
  get nodelevel(): number {
    return this.info.nodelevel
  }
  get meta(): object {
    return this.info.meta
  }
}
