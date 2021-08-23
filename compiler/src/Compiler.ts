import { Environment } from './Environment.js';
import { Interpreter } from './Interpreter.js';
import { CrestCallable } from './CrestCallable.js';
import { Expr, BinaryExpr, ExprVisitor, GroupExpr, LiteralExpr, UnaryExpr, CallExpr, VariableExpr } from './Expression';

export class Compiler implements ExprVisitor<string> {
  
  globals:Environment;

  constructor(){
    this.globals = new Environment();
    this.globals.define("cos", new class implements CrestCallable {
      arity():number {
        return 1;
      }

      call(interpreter:Interpreter,args:Array<Object>):Object {
        let a = args[0] as number;

        return Math.cos(a);
      }
    });
    this.globals.define("x", new String("x"));
  }

  evaluate(expr:Expr):Object {
    return expr.accept(this);
  }

  compile(expr:Expr):string {
    return `
      return ${ this.evaluate(expr) };
    `;
  }

  visitVariableExpr(expr:VariableExpr):string {
    return expr.name.literal;
  }

  visitCallExpr(expr:CallExpr):string {
    let callee = this.evaluate(expr.callee);
    let args = expr.args.map(arg => this.evaluate(arg));

    return `${callee}(${args.join(',')})`;
  }

  visitBinaryExpr(expr:BinaryExpr):string {
    return `${expr.left} ${expr.operator} ${expr.right}`;
  }

  visitGroupExpr(expr:GroupExpr):string {
    return `(${expr.expr})`;
  }

  visitLiteralExpr(expr:LiteralExpr):string {
    return expr.value.toString();
  }

  visitUnaryExpr(expr:UnaryExpr):string {
    return `${expr.operator}${expr.right}`;
  }
}