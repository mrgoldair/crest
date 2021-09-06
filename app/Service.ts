/**
 * Service is responsible for taking a wave `Desc`, compiling
 * each expression and assembling the resulting wave function according
 * to the requested `Combiner`.
 */

// Describes the ways in which expressions can be combined
enum Combiner {
  None,
  Min,
  Max,
}

// `Desc` is the way requests are send to this service
type Desc = {
  expressions: string[],
  combiner:Combiner
}

// The type of function `Desc` requests are compiled to
type IWaveFn = (x:number) => number[]

// Given a source of `Desc` attempt to compile a function of type IWaveFn
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
      // Compile expressions to legitimate functions
      let functions = exprs.expressions.map(e => {
        let fn = this.compiler.compile(e);
        // Perhaps push function creation back to compiler
        if (typeof fn === "string")
          return Function("x", `return ${fn}`);
        // If we have compile errors, just return an identity func
        return (x:number) => x
      })
      
      // Return our resulting function - the choices of combiner mean
      // we don't care about expression order, but at some point `Combiner` may
      // include types where we do
      switch (exprs.combiner){
        case Combiner.Max:
          return (x:number) => [Math.max(...functions.map(f => f(x)))]
          break;
        case Combiner.Min:
          return (x:number) => [Math.min(...functions.map(f => f(x)))]
          break;
        case Combiner.None:
          return (x:number) => functions.map(f => f(x))
          break;
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export { IWaveFn, Service, Desc, Combiner, CreateWaveUseCase };