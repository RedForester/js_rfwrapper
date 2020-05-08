export interface ICommandReply {
  toJSON(): object;
}

export enum NotifyStyle {
  DEFAULT = 'DEFAULT',
  PRIMARY = 'PRIMARY',
  SUCCESS = 'SUCCESS',
  DANGER = 'DANGER',
  WARNING = 'WARNING',
  INFO = 'INFO',
}

export class NotifyReply implements ICommandReply {
  private content: string = '';
  private style?: NotifyStyle;
  private durationMs?: number;
  private urlCancel?: string;
  private urlContinue?: string;

  public toJSON(): object {
    return {
      notify: {
        content: this.content,
        style: this.style,
        durationMs: this.durationMs,
        urlCancel: this.urlCancel,
        urlContinue: this.urlContinue,
      },
    };
  }

  /**
   * setContent
   */
  public setContent(value: string) {
    this.content = value;
    return this;
  }

  /**
   * setStyle
   */
  public setStyle(value: NotifyStyle) {
    this.style = value;
    return this;
  }

  /**
   * setDuration
   */
  public setDuration(value: number) {
    this.durationMs = value;
    return this;
  }

  /**
   * setUrlCancel
   */
  public setUrlCancel(value: string) {
    this.urlCancel = value;
    return this;
  }

  /**
   * setUrlContinue
   */
  public setUrlContinue(value: string) {
    this.urlContinue = value;
    return this;
  }
}
