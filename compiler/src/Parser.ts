import { TokenType } from "./TokenType.js";
import { Token } from './Token.js';
import { Expr, BinaryExpr, UnaryExpr, LiteralExpr, GroupExpr, CallExpr, VariableExpr } from "./Expression.js";
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
      return this.expression();
    } catch (error:any) {
      this.synchronise();
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
  match(...tokenTypes:Array<TokenType>):boolean {
    for(const type of tokenTypes){
      if( this.check(type) ){
        this.advance();
        return true;
      }
    }
    return false;
  }

  consume(type:TokenType, message:string):Token {
    if (this.check(type))
      return this.advance();
    
    throw this.error(this.peek(), message);
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

  /**
   * Increments `current` while returning the previous (current - 1) token
   * @returns 
   */
  advance():Token {
    //   v----  return
    //  [a] [b]
    //   ----^  increment
    if ( !this.end )
      this.current++
    return this.previous();
  }

  /**
   * @returns {Token} - The token just processed at [current - 1]
   */
  previous():Token {
    return this.tokens[this.current - 1];
  }

  /**
   * @param {Token} token 
   * @param {string} message 
   * @returns {ParseError}
   */
  error(token:Token, message:string):ParseError {
    Crest.error( token, message );
    return new ParseError();
  }

  synchronise():void {
    this.advance()

    while ( !this.end ){
      if ( this.previous().type == TokenType.SEMICOLON )
        return;
      
      this.advance();
    }
  }

  //--------------------------------------
  //------------ The grammar -------------
  //--------------------------------------

  /**
   * 
   * @returns {Expr} - the root of our grammar
   */
  expression():Expr {
    return this.term();
  }

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

    return this.call();
  }

  /**
   * `Call` delineates beween primary expressions and function calls.
   * If a primary e.g. NUMBER or IDENTIFIER (or in our case KEYWORD because
   * we don't allow user defined data) is follow by parenthesis, we denote a function call
   * @returns {Expr} - The expression or function call
   */
  call():Expr {
    let expr = this.primary();

    while (true) {
      if( this.match(TokenType.LEFT_PAREN) ){
        expr = this.arguments(expr);
      } else {
        break;
      }
    }

    return expr;
  }

  /**
   * A helper function to assemble the remainder of a function call
   * after a LEFT_PAREN token has been encountered.
   * 
   * @param callee - The variable expression we're calling. This ultimately
   * translates to a CrestCallable which defines our interface for calling
   * something. In our case all callees are globally defined functions, inserted
   * into the top-level environment as CrestCallables as their own token types
   * COS, SIN, X etc. If/when Crest supports user defined elements they will be
   * represented as the IDENTIFIER token type.
   * @returns {CallExpr} - An expression representing a function call.
   */
  arguments(callee:Expr):Expr {
    let args:Array<Expr> = [];

    if ( !this.check(TokenType.RIGHT_PAREN) ){
      do {
        args.push( this.expression() );
      } while( this.match(TokenType.COMMA) )
    }
  
    let paren:Token = this.consume(TokenType.RIGHT_PAREN, "Expecting ')' after arguments.");

    return new CallExpr(callee, paren, args);
  }

  /**
   * 
   * @returns {Expr} - a terminal from our grammar
   */
  primary():Expr {
    if( this.match(TokenType.NUMBER) ) {
      return new LiteralExpr( this.previous().literal );

    } else if ( this.match(TokenType.LEFT_PAREN) ){
      let expr = this.expression();
      this.consume(TokenType.RIGHT_PAREN, "Expecting ')' after expression.");
      return new GroupExpr(expr);

    } else if ( this.match(TokenType.COS, TokenType.SIN, TokenType.X) ){
      return new VariableExpr( this.previous() );
    }

    throw this.error(this.peek(), "Expected expression.")
  }
}