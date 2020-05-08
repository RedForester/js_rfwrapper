import { ICommandShowRule } from './command';

function setMetaData(key: string, value: unknown): ClassDecorator {
  return function<T extends Function>(target: T): T {
    Object.defineProperty(target.prototype, key, {
      value,
      enumerable: false,
      configurable: true,
      writable: true,
    });
    return target;
  };
}

export function Id(id: string): ClassDecorator {
  return setMetaData('id', id);
}

export function Name(name: string): ClassDecorator {
  return setMetaData('name', name);
}

export function Description(desc: string): ClassDecorator {
  return setMetaData('description', desc);
}

export function ShowRules(rules: ICommandShowRule[]): ClassDecorator {
  return setMetaData('showRules', rules);
}

export function On(event: string): ClassDecorator {
  return setMetaData('eventName', event);
}
