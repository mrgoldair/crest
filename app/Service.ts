/**
 * Service is responsible for taking a wave `Desc`, compiling
 * each expression and assembling the resulting wave function according
 * to the requested `Combiner`.
 */
import { Literal, Aggregate, Id, Op } from './domain/Types.js';

type Desc = Map<Id,Literal | Aggregate>

// The type of function `Desc` requests are compiled to
type IWaveFn = (x:number) => number[]

// Given a source of `Desc` attempt to compile a function of type IWaveFn
interface CreateWaveUseCase {
  create:(source:Desc) => IWaveFn
}

class Service implements CreateWaveUseCase {
  compiler

  constructor(compiler) {
    this.compiler = compiler;
  }

  compile(source:string):(x:number) => number {
    // Compile expressions to legitimate functions
    let fn = this.compiler.compile(source);
    // Perhaps push function creation back to compiler
    if (typeof fn === "string")
      return Function("x", `return ${fn}`) as (x:number) => number;
    // If we have compile errors, just return an identity func
    return (x:number) => x
  }

  aggregate(a:(x:number) => number, b:(x:number) => number, op:Op):(x:number) => number {
    switch (op){
      case Op.MIN:
        return (x:number) => Math.min(a(x),b(x))
        break;
      case Op.MAX:
        return (x:number) => Math.max(a(x),b(x))
        break;
      case Op.ADD:
        return (x:number) => a(x) + b(x);
        break;
      case Op.SUB:
        return (x:number) => a(x) - b(x);
        break;
    }
  }

  create(desc:Desc): IWaveFn {
  
    let r = [...desc.entries()].reduce((acc,[ k,v ]) => {
      switch (v.kind){
        case "literal":
          acc.set(k, this.compile(v.expr));
          break;
        case "aggregate":
          let [ a,b ] = v.expressions.map(k => acc.get(k));
          acc.set( k, this.aggregate(a,b,v.op) );
          break;
      }
  
      return acc;
    }, new Map<Id,(x:number) => number>())
  
    return (x:number) => [...r.values()].map(f => f(x))
  }
}

export { 
  // Functions, interfaces and constructors
  IWaveFn, Service, CreateWaveUseCase
};