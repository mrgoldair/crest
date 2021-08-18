import { Expr, BinaryExpr, ExprVisitor, GroupExpr, LiteralExpr, UnaryExpr, CallExpr, VariableExpr } from './Expression';

export class Compiler implements ExprVisitor<string> {
  
  evaluate(expr:Expr):Object {
    return expr.accept(this);
  }

  compile(expr:Expr):string {
    return `
      function run(x){
        return ${ this.evaluate(expr) }
      }
    `;
  }

  visitVariableExpr(expr:VariableExpr):string {
    return expr.name.literal;
  }

  visitCallExpr(expr:CallExpr):string {
    let callee = expr.callee as VariableExpr;

    return "";
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