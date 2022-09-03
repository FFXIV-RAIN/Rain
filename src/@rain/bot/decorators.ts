import {Client} from 'discord.js';

const METADATA_KEYS = {
  CRON: Symbol('CRON')
};

export function Cron(cron: string): (target: any, propertyKey: string) => void;
export function Cron(cron: Cron.Config): (target: any, propertyKey: string) => void;
export function Cron(cron: string | Cron.Config): (target: any, propertyKey: string) => void {
  const config = typeof(cron) === 'string' ? {
    cron,
    allowInit: false,
  } : cron;

  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata(METADATA_KEYS.CRON, config, target, propertyKey);
  }
}

export function getCronHook(instance: { [key: string]: any; }, propertyKey: string): Cron.Content {
  return Reflect.getOwnMetadata(METADATA_KEYS.CRON, instance.constructor.prototype, propertyKey);
}

export function getCronHooks(instance: { [key: string]: any }): Cron.Hook[] {
  const prototype = instance.constructor.prototype;
  return Object.getOwnPropertyNames(prototype).filter((propertyKey) => (
    typeof(prototype[propertyKey]) === 'function' && 
    Reflect.hasOwnMetadata(METADATA_KEYS.CRON, prototype, propertyKey)
  )).map((propertyKey) => ({
    method: instance[propertyKey].bind(instance),
    ...getCronHook(instance, propertyKey)
  }));
}

export namespace Cron {
  export type Listener = (client: Client) => void;

  export interface Config {
    cron: string;
    allowInit: boolean;
  }
  
  export interface Content {
    allowInit: boolean;
    cron: string;
  }

  export interface Hook {
    allowInit: boolean;
    cron: string;
    method: Listener;
  }
}