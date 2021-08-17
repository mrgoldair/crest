import { Token } from './Token.js';

export class Environment {
  values:Map<string,object> = new Map<string,object>();

  define(name:string, value:object):void {
    this.values.set(name, value);
  }

  get(name:Token):object {
    if ( this.values.has(name.lexeme) )
      return this.values.get(name.lexeme) as object;

    throw new Error(`Undefined variable ${name.lexeme}`);
  }
}