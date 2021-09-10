/**
 * Service is responsible for taking a wave `Desc`, compiling
 * each expression and assembling the resulting wave function according
 * to the requested `Combiner`.
 */
type Id = number;

enum Op {
  Min,
  Max
}

type Expression = {
  kind: "expression"
  value: string
}

type Path = {
  kind: "path"
  value: [ Id, Id ]
  op: Op
}

type Descriptor = Expression | Path

type Descd = {
  expressions: Map<Id,Descriptor>
  combinations?: Combo[]
}

type Desc = Map<Id,Descriptor>

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

  create(desc:Desc): IWaveFn {
  
    let r = [...desc.entries()].reduce((acc,[ k,v ]) => {
      switch (v.kind){
        case "expression":
          acc.set(k, this.compile(v.value));
          break;
        case "path":
          let [ a,b ] = v.value.map(k => acc.get(k));
          acc.set( k, (x:number) => 0.5 * a(x) + 0.5 * b(x));
          break;
      }
  
      return acc;
    }, new Map<Id,(x:number) => number>())
  
    return (x:number) => [...r.values()].map(f => f(x))
  }
}

export { IWaveFn, Service, Desc, Op, CreateWaveUseCase };