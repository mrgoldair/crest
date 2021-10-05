import { Environment } from './Environment.js';
import { Interpreter } from './Interpreter.js';
import { CrestCallable } from './CrestCallable.js';
import { Expr, BinaryExpr, ExprVisitor, GroupExpr, LiteralExpr, UnaryExpr, CallExpr, VariableExpr } from './Expression';

export class Compiler implements ExprVisitor<object> {
  
  globals:Environment;

  constructor(){
    this.globals = new Environment();
    this.globals.define("sin", new class implements CrestCallable {
      arity():number {
        return 1;
      }

      call(interpreter:Interpreter,[x]:Array<Object>):Object {
        return `Math.sin(${x})`;
      }
    });
    this.globals.define("cos", new class implements CrestCallable {
      arity():number {
        return 1;
      }

      call(interpreter:Interpreter,[x]:Array<Object>):Object {
        return `Math.cos(${x})`;
      }
    });
    this.globals.define("x", new String("x"));
  }

  compile(expr:Expr):object {
    return expr.accept(this);
  }

  visitVariableExpr(expr:VariableExpr):object {
    return this.globals.get(expr.name);
  }

  visitCallExpr({callee,args}:CallExpr):object {
    let callable = this.compile(callee) as CrestCallable

    if( args.length != callable.arity() ){
      throw new Error(`Expected ${callable.arity()} arguments but got ${args.length}.`);
    }

    return `Math.${(<VariableExpr>callee).name.lexeme}(${args.map(arg => this.compile(arg)).join(', ')})` as Object;
  }

  visitBinaryExpr(expr:BinaryExpr):object {
    return `${this.compile(expr.left)} ${expr.operator.lexeme} ${this.compile(expr.right)}` as Object;
  }

  visitGroupExpr(expr:GroupExpr):object {
    return `(${this.compile(expr.expr)})` as Object;
  }

  visitLiteralExpr(expr:LiteralExpr):object {
    return expr.value.toString() as Object;
  }

  visitUnaryExpr(expr:UnaryExpr):object {
    return `${expr.operator}${this.compile(expr.right)}` as Object;
  }
}