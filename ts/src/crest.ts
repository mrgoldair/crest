import { Token } from './Token.js';
import { Scanner } from './Scanner.js';
import { Parser } from './Parser.js';
import { Expr } from './Expression.js';
import { ASTPrinter } from './ASTPrinter.js';

export class Crest {
  static tokens:Array<Token>;
  static hadError:boolean = false;

  static run(source:string){
    let scanner = new Scanner(source);
    let tokens = scanner.scanTokens();
    let parser = new Parser(tokens);
    let printer = new ASTPrinter();

    let expr:Expr | null = parser.parse();

    if( expr )
      console.log( printer.print(expr) );
  }

  static error(line:number, message:string):void {
    Crest.report(line, "", message);
  }

  static report(line:number, where:string, message:string):void {
    console.error( `[line ${line}] Error ${where} : ${message}` );
    this.hadError = true;
  }
}