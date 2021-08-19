import { Token } from './Token.js';

export interface ExprVisitor<T> {
  visitBinaryExpr(expr:BinaryExpr):T
  visitUnaryExpr(expr:UnaryExpr):T
  visitLiteralExpr(expr:LiteralExpr):T
  visitGroupExpr(expr:GroupExpr):T
  visitCallExpr(expr:CallExpr):T
  visitVariableExpr(expr:VariableExpr):T
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

class GroupExpr extends Expr {
  expr:Expr;

  constructor(expr:Expr){
    super();
    this.expr = expr;
  }

  accept(visitor:ExprVisitor<object>){
    return visitor.visitGroupExpr(this);
  }
}

class CallExpr extends Expr {
  callee:Expr;
  args:Array<Expr>;
  paren:Token;

  constructor(callee:Expr, paren:Token,args:Array<Expr>){
    super()
    this.callee = callee;
    this.args = args;
    this.paren = paren;
  }

  accept(visitor:ExprVisitor<object>){
    return visitor.visitCallExpr(this);
  }
}

class VariableExpr extends Expr {
  name:Token;

  constructor(name:Token){
    super();
    this.name = name;
  }

  accept(visitor:ExprVisitor<object>){
    return visitor.visitVariableExpr(this);
  }
}

export {
  Expr,
  BinaryExpr,
  UnaryExpr,
  LiteralExpr,
  GroupExpr,
  CallExpr,
  VariableExpr
}