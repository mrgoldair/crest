
// Domain.ts
interface Compiler {
  compile:(source:string) => string
}

interface WaveFn {
  accept:<Array>(x:number)=>number
}

// Domain.ts
export type Part = {
  [order:number]: number,
  fn: Function
}

// Domain.ts
export type Desc = Part[];

class Service {
  compiler:Compiler

  constructor(compiler:Compiler) {
    this.compiler = compiler;
  }

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