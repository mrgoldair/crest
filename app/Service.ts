// Domain.ts
interface Compiler {
  compile:(source:string) => string
}

// But Service -> UI breaks the dependancy direction
// so where can we locate this? Is this only a concern of the UI?
// the functional expression/equivalent of the input Desc type
// distill all the taking of expressions into a single function
// which shows either aggregate or each input
type DescFn = (x:number) => number[];

// return [].map(f => f(x))
// return Math.Max(...[].map(f => f(x)))
// return Math.Min(...[].map(f => f(x)))

type CombinerFn = (exprs:((x:number) => number)[]) => DescFn

// Can we create enum from available function defs?
enum Combiner {
  None,
  Min,
  Max,
}

type Desc = {
  expressions: string[],
  combiner:Combiner
}

// Some way to express the combination of certain waves while
// singularly showing others
type All = Desc[];

const max = (funcs:Function[]) => {
  return [x => Math.max(...funcs.map(f => f(x)))]
}

class Service {
  compiler:Compiler

  constructor(compiler:Compiler) {
    this.compiler = compiler;
  }

  create(source:Desc):DescFn {
    return x => [x];
  }

  _compile(source:string[],combiner):Function[] {
    try {
      let compiled = source.map(s => this.compiler.compile(s))
      
      if (compiled.every(s => typeof s === "string")){
        let functions = compiled.map(fn => Function("x", `return ${fn}`));
        return max(functions)
      } else {
        // Does nothing, but doesn't break
        return [Function()];
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Or perhaps this should be Array<string> => Array<Function>
  compile(expr:string): Function {
    try {
      let fn = this.compiler.compile(expr);
      if (typeof fn === "string"){
        return Function("x", `return ${fn}`);
      } else {
        // Does nothing, but doesn't break
        return Function();
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export default Service;