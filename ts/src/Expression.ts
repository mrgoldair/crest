import { Token } from './Token.js';

export interface ExprVisitor<T> {
  visitBinaryExpr(expr:BinaryExpr):T
  visitUnaryExpr(expr:UnaryExpr):T
  visitLiteralExpr(expr:LiteralExpr):T
}

abstract class Expr {
  abstract accept(visitor:ExprVisitor<Object>):Object
}

class BinaryExpr extends Expr {
  left: Expr;
  operator: Token;
  right: Expr;

  constructor(left:Expr, operator:Token, right:Expr){
    super();
    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  accept(visitor:ExprVisitor<object>):object {
    return visitor.visitBinaryExpr(this);
  }
}

class UnaryExpr extends Expr {
  operator?: Token;
  right: Expr;

  constructor(operator:Token,right:Expr){
    super();
    this.operator = operator;
    this.right = right;
  }

  accept(visitor:ExprVisitor<object>){
    return visitor.visitUnaryExpr(this);
  }
}

class LiteralExpr extends Expr {
  value: object;

  constructor(value:object){
    super();
    this.value = value;
  }

  accept(visitor:ExprVisitor<object>){
    return visitor.visitLiteralExpr(this);
  }
}

export {
  Expr,
  BinaryExpr,
  UnaryExpr,
  LiteralExpr
}