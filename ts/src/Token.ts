import { TokenType } from './TokenType.js'

export class Token {
  type:TokenType;
  lexeme:string;
  literal?:any;
  line:number;

  constructor(type:TokenType, lexeme:string, line:number, literal?:any){
    this.type = type;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
  }

  toString(){
    return this.type + " " + this.lexeme + " " + this.literal;
  }
}