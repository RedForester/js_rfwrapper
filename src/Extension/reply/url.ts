import { ICommandReply } from "./interface";

export class OpenUrlReply implements ICommandReply {
  private url: string = ''

  public toJSON(): object {
    return {
      iframe: {
        url: this.url,
      },
    };
  }

  /**
   * setUrl
   * @description устанавливает ссылку которая откроется в новой вкладке
   */
  public setUrl(value: string) {
    this.url = value;
    return this;
  }
}
  