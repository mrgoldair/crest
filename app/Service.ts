// Really a use-case?

// Domain.ts
enum Combiner {
  None,
  Min,
  Max,
}

type Desc = {
  expressions: string[],
  combiner:Combiner
}

type IWaveFn = (x:number) => number[]

interface CreateWaveUseCase {
  compile:(source:Desc) => IWaveFn
}

class Service implements CreateWaveUseCase {
  compiler

  constructor(compiler) {
    this.compiler = compiler;
  }

  compile(exprs:Desc): IWaveFn {
    try {
      let functions = exprs.expressions.map(e => {
        let fn:(x:number) => number  = this.compiler.compile(e);
        if (typeof fn === "string")
          return Function("x", `return ${fn}`);
        return (x:number) => x
      })
      
      return (x:number):number[] => {
        switch (exprs.combiner){
          case Combiner.Max: break;
          case Combiner.Min: break;
          case Combiner.None: {
            return (functions.map(f => f(x)))
            break;
          }
        }
      };
    } catch (error) {
      console.error(error);
    }
  }
}

export { IWaveFn, Service, Desc, Combiner, CreateWaveUseCase };