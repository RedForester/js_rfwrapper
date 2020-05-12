import { ICommandShowRule, IRequiredTypeProp } from './interface';

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

function appendMetaData(key: string, value: unknown): ClassDecorator {
  return function<T extends Function>(target: T): T {
    if (key in target.prototype) value = [...target.prototype[key], value];
    else value = [value];

    Object.defineProperty(target.prototype, key, {
      value,
      enumerable: true,
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

export function ShowRules(rules: ICommandShowRule): ClassDecorator {
  return appendMetaData('showRules', rules);
}

export function On(event: string): ClassDecorator {
  return setMetaData('eventName', event);
}

export function RequiredType(
  name: string,
  properties: IRequiredTypeProp[] = []
): ClassDecorator {
  return appendMetaData('requiredTypes', { name, properties });
}
