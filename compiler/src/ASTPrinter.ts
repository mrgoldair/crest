import { Expr, BinaryExpr, ExprVisitor, LiteralExpr, UnaryExpr, GroupExpr, CallExpr, VariableExpr } from "./Expression.js";

export class ASTPrinter implements ExprVisitor<Object> {

  print(expr:Expr):Object {
    return this.evaluate(expr);
  }

  evaluate(expr:Expr):Object {
    return expr.accept(this);
  }

  visitLiteralExpr(expr:LiteralExpr):Object {
    return expr.value
  }

  visitUnaryExpr(expr:UnaryExpr):Object {
    return `${expr.operator?.toString()} ${expr.right.accept(this).toString()}`;
  }

  visitBinaryExpr(expr:BinaryExpr):Object {
    let { left, operator, right } = expr;
    return `${this.evaluate(left).toString()} ${operator.lexeme} ${this.evaluate(right).toString()}`;
  }

  visitGroupExpr(group:GroupExpr):Object {
    return `(${this.evaluate(group.expr)})`;
  }

  visitCallExpr(expr:CallExpr):Object {
    let args = expr.args.map(arg => this.evaluate(arg))
    return `${this.evaluate(expr.callee)}(${args.join(",")})`;
  }

  visitVariableExpr(expr:VariableExpr):Object {
    return expr.name.lexeme;
  }
}