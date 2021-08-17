import { Crest } from './Crest.js';
import { Token } from './Token.js';
import { TokenType } from './TokenType.js';

export class Scanner {
  source:string;
  tokens:Array<Token> = [];
  start:number = 0;
  current:number = 0;
  line:number = 1;

  keywords:Map<string, TokenType> = new Map();

  constructor(source:string) {
    this.source = source;
    this.keywords.set( 'cos', TokenType.COS );
    this.keywords.set( 'sin', TokenType.SIN );
    this.keywords.set( 'x',   TokenType.X );
  }

  scanTokens(): Array<Token> {
    while( !this.isAtEnd() ) {
      this.start = this.current;
      this.scanToken();
    }
    this.tokens.push( new Token(TokenType.EOF, "", this.line) );
    return this.tokens;
  }
  
  scanToken():void {
    let c = this.advance();

    switch (c) {
      case '-': this.addToken(TokenType.MINUS); break;
      case '+': this.addToken(TokenType.PLUS); break;
      case '*': this.addToken(TokenType.STAR); break;
      case '(': this.addToken(TokenType.LEFT_PAREN); break;
      case ')': this.addToken(TokenType.RIGHT_PAREN); break;
      case ',': this.addToken(TokenType.COMMA); break;
      case ' ':
      case '\r':
      case '\t':
        // Ignore whitespace
        break;
      case '\n':
        this.line++;
        break;
      default:
        if ( this.isAlpha(c) ) {
          this.keyword();
          break;
        } else if ( this.isDigit(c) ){
          this.number();
          break;
        } else {
          Crest.errorLine(this.line, `Unexpected character ${c}`);
          break;
        }
    }
  }

  isAlpha(char:string):boolean {
    return /[a-zA-Z_]/.test(char);
  }

  isDigit(char:string):boolean {
    return /[0-9]/.test(char);
  }

  number():void {
    // 
    while( this.isDigit(this.peek()) ){
      // Called for side-effect
      this.advance();
    }

    if (this.peek() == '.' && this.isDigit(this.peekNext()) ){
      // Consume the '.'
      this.advance();

      while( this.isDigit(this.peek()) ){
        this.advance()
      }
    }

    this.addToken(TokenType.NUMBER, Number.parseFloat(this.source.substring(this.start,this.current)) );
  }

  peekNext():string {
    if ( this.current + 1 > this.source.length)
      return '\0';
    return this.source.charAt(this.current + 1);
  }

  keyword():void {
    while( this.isAlpha(this.peek()) ){
      this.advance();
    }

    let text = this.source.substring(this.start, this.current);
    let tokenType = this.keywords.get(text)

    // At the mo all we have is keywords, no identifiers
    if ( tokenType ) {
      this.addToken(tokenType);
    } else {
      Crest.errorLine(this.line, `Unexpected keyword ${text}`);
    }
  }

  advance():string {
    return this.source.charAt(this.current++);
  }

  addToken(type:TokenType, literal?:any):void {
    let text = this.source.substring(this.start, this.current);
    this.tokens.push( new Token(type, text, this.current, literal) )
  }

  isAtEnd():boolean {
    return this.current >= this.source.length;
  }

  match(expected:string):boolean {
    if ( this.isAtEnd() )
      return false;
    
    if ( this.source.charAt(this.current) != expected )
      return false;

    this.current++;
    return true;
  }

  peek():string {
    if ( this.isAtEnd() )
      return "\0";

    return this.source.charAt(this.current);
  }
}