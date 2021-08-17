import { Token } from './Token.js';
import { Scanner } from './Scanner.js';
import { Parser } from './Parser.js';
import { ASTPrinter } from './ASTPrinter.js';
import { Compiler } from './Compiler.js';
import { Interpreter } from './Interpreter.js';
import { TokenType } from './TokenType.js';

export class Crest {
  static tokens:Array<Token>;
  static hadError:boolean = false;

  static run(source:string){
    let scanner = new Scanner(source);
    let tokens = scanner.scanTokens();
    let parser = new Parser(tokens);
    let expr = parser.parse();

    if (this.hadError)
      return;

    if( expr )
      console.log( new Interpreter().evaluate(expr) );
  }

  static errorLine(line:number, message:string):void {
    Crest.report(line, "", message);
  }

  static report(line:number, where:string, message:string):void {
    console.error( `[line ${line}] Error ${where} : ${message}` );
    this.hadError = true;
  }

  static error(token:Token, message:string){
    if (token.type == TokenType.EOF){
      this.report( token.line, " at end", message );
    } else {
      this.report( token.line, " at '" + token.lexeme + "'", message );
    }
  }
}