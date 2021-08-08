import { TokenType } from "./TokenType";
import { Token } from './Token';

type BinaryExpr = {
  left: Expr,
  operator: Token,
  right: Expr
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

type Expr = UnaryExpr | BinaryExpr | OpExpr | LiteralExpr;

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
    };

    switch(this.peek().type){
      case TokenType.COS:
        right = this.op();
        break;
      case TokenType.NUMBER:
        right = this.primary();
        break;
    }

    return (operator ? { operator,right } : { right });
  }

  op():Expr {
    return { fn:this.peek(),right:this.term() }
  }

  /**
   * primary -> number
   */
  primary():Expr {
    if ( token.type != TokenType.NUMBER )
      console.log("number");
    return { value:token.literal };
  }
}