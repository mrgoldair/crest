import { Plot } from "./Plot";

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

interface Compiler {
  compile:(source:string) => string
}

type PlotFn = (x:number) => number[]

interface ExpressionCompiler {
  compile:(source:Desc) => PlotFn
}

// But Service -> UI breaks the dependancy direction
// so where can we locate this? Is this only a concern of the UI?
// the functional expression/equivalent of the input Desc type
// distill all the taking of expressions into a single function
// which shows either aggregate or each input
type DescFn = (x:number) => number[];

const max = (funcs:Function[]) => {
  return [x => Math.max(...funcs.map(f => f(x)))]
}

class Service implements ExpressionCompiler {
  compiler:Compiler

  constructor(compiler:Compiler) {
    this.compiler = compiler;
  }

  compile(exprs:Desc): PlotFn {
    try {
      let fn = this.compiler.compile(exprs.expressions[0]);
      if (typeof fn === "string")
        return Function("x", `return ${fn}`) as PlotFn;
    } catch (error) {
      console.error(error);
    }
  }
}

export { Compiler, ExpressionCompiler as FunctionCompiler }