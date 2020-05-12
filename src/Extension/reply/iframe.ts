import { ICommandReply } from "./interface";

export class FrameReply implements ICommandReply {
  private url: string = ''
  private width: number = 800;
  private height: number = 800;

  public toJSON(): object {
    return {
      iframe: {
        url: this.url,
        width: this.width,
        height: this.height,
      },
    };
  }

  /**
   * setUrl
   * @description устанавливает ссылку которая откроется в iframe
   */
  public setUrl(value: string) {
    this.url = value;
    return this;
  }

  /**
   * setSize
   * @description устанавливает размеры окна iframe
   */
  public setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
    return this;
  }
}
  