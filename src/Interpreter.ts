import { Environment } from './Environment.js';
import { Expr, ExprVisitor, LiteralExpr, UnaryExpr, BinaryExpr, GroupExpr, VariableExpr, CallExpr } from './Expression.js';
import { TokenType } from './TokenType.js';
import { CrestCallable } from './CrestCallable.js';

export class Interpreter implements ExprVisitor<Object> {

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
    })
  }

  evaluate(expr:Expr):Object {
    return expr.accept(this);
  }

  visitVariableExpr({name}:VariableExpr):Object {
    return this.globals.get(name);
  }

  visitLiteralExpr(expr:LiteralExpr):Object {
    return expr.value;
  }

  visitUnaryExpr(expr:UnaryExpr):Object {
    let { operator, right } = expr;

    if( operator?.type == TokenType.MINUS )
      return -(right.accept(this) as number);
    
    return right.accept(this) as number;
  }

  visitBinaryExpr(expr:BinaryExpr):Object {
    let { left, operator, right } = expr;

    switch ( operator.type ){
      case TokenType.PLUS:
        return (left.accept(this) as number) + (right.accept(this) as number);
      case TokenType.MINUS:
        return (left.accept(this) as number) - (right.accept(this) as number);
      case TokenType.STAR:
        return (left.accept(this) as number) * (right.accept(this) as number);
      default:
        return (left.accept(this) as number) / (right.accept(this) as number);
    }
  }

  visitGroupExpr(group:GroupExpr):Object {
    return this.evaluate(group.expr);
  }

  visitCallExpr(expr:CallExpr):Object {
    let callee = this.evaluate(expr.callee)

    let args:Array<Object> = [];
    expr.args.forEach(arg => {
      args.push(this.evaluate(arg))
    });

    let func:CrestCallable = callee as CrestCallable;
    return func.call(this, args);
  }
}