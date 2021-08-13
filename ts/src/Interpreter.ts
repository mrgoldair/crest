import { Expr, ExprVisitor, LiteralExpr, UnaryExpr, BinaryExpr, GroupExpr } from './Expression.js';
import { TokenType } from './TokenType.js';

class Interpreter implements ExprVisitor<Object> {

  evaluate(expr:Expr):Object {
    return expr.accept(this);
  }

  visitLiteralExpr(expr:LiteralExpr):Object {
    return expr.value;
  }

  visitUnaryExpr(expr:UnaryExpr):Object {
    let { operator, right } = expr;

    if( operator?.type ==TokenType.MINUS )
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
}