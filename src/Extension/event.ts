import { Wrapper } from '..';
import Context from '../Map/contex';

export interface IEventOptions {
  eventName: string;
}

export abstract class Event {
  /**
   * Событие на которые нужно подписаться
   * @type {String}
   * @public
   */
  public eventName!: string;

  constructor(options?: IEventOptions) {
    if (!options) {
      return;
    }

    if (options.eventName) {
      this.eventName = options.eventName;
    }
  }

  public abstract async run(self: Wrapper, ctx: Context): Promise<void>;
}
