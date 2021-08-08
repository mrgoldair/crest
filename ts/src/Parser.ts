import { TokenType } from "./TokenType";
import { Token } from './Token';

interface ExprVisitor<T> {
  visitBinaryExpr(expr:BinaryExpr):T
  visitUnaryExpr(expr:UnaryExpr):T
}

abstract class Expr {
  abstract accept(visitor:ExprVisitor<object>):object
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
    return {};
  }
}

type UnaryExpr = {
  operator?: Token,
  right: Expr
}

type OpExpr = {
  fn: Token,
  right: Expr
}

type LiteralExpr = {
  value: number;
}

export class Parser {
  tokens:Array<Token>;
  current:number = 0;

  constructor(tokens:Array<Token>){
    this.tokens = tokens;
  }

  parse(): Expr {
    try {
      return this.term();
    } catch (error) {
      
    }

    return { value:1 };
  }

  //--------------------------------------
  //- Where our utils start
  //--------------------------------------

  /**
   * 
   * @param tokenTypes 
   * @returns 
   */
  match(...tokenTypes:Array<TokenType>): boolean {
    for(const type of tokenTypes){
      if( this.check(type) ){
        this.advance();
        return true;
      }
    }
    return false;
  }

  check(type:TokenType):boolean {
    return type == this.peek().type;
  }

  peek():Token {
    return this.tokens[this.current];
  }

  get end():boolean {
    return this.peek().type == TokenType.EOF;
  }

  advance():Token {
    if ( !this.end )
      this.current++
    return this.previous();
  }

  previous():Token {
    return this.tokens[this.current - 1];
  }

  //--------------------------------------
  //--- The actual expression grammar  ---
  //--------------------------------------

  /**
   * 
   * @returns 
   */
  term():Expr {
    let expression = this.factor();

    while( this.match(TokenType.PLUS,TokenType.MINUS) ){
      let operator = this.previous();
      let right = this.term();
      expression = { left:expression,
                     operator,
                     right };
    }

    return expression;
  }

  factor():Expr {
    let expression = this.unary()
    
    while( this.match(TokenType.STAR,TokenType.SLASH) ){
      let operator = this.previous();
      let right = this.term();
      expression = { left:expression,
                     operator,
                     right };
    }

    return expression;
  }

  /**
   * unary -> "-" primary
   */
  unary():Expr {
    let operator:Token;
    let right:Expr;

    if( this.match(TokenType.MINUS) ){
      operator = this.previous();
      right = this.primary();
      return {
        operator,
        right
      }
    }

    return this.primary()
  }
  
  // op():Expr {
  //   return { fn:this.peek(),right:this.term() }
  // }

  /**
   * primary -> number
   */
  primary():Expr {
    return {
      value: this.peek().literal
    }
  }
}