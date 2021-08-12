import { TokenType } from "./TokenType.js";
import { Token } from './Token.js';
import { Expr, BinaryExpr, UnaryExpr, LiteralExpr } from "./Expression.js";
import { Crest } from "./Crest.js";

class ParseError {

}

export class Parser {
  tokens:Array<Token>;
  current:number = 0;

  constructor(tokens:Array<Token>){
    this.tokens = tokens;
  }

  parse():Expr | null {
    try {
      return this.term();
    } catch (error:any) {
      return null;
    }
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

  error(token:Token,message:string):ParseError {
    Crest.error(token.line,message);
    return new ParseError();
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
      expression = new BinaryExpr(expression,operator,right);
    }

    return expression;
  }

  factor():Expr {
    let expression = this.unary()
    
    while( this.match(TokenType.STAR,TokenType.SLASH) ){
      let operator = this.previous();
      let right = this.term();
      expression = new BinaryExpr(expression,operator,right);
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
      return new UnaryExpr(operator,right);
    }

    return this.primary();
  }

  /**
   * primary -> number
   */
  primary():Expr {
    if( this.match(TokenType.NUMBER) )
      return new LiteralExpr(this.previous().literal);

    throw this.error(this.peek(), "Expected expression.")
  }
}