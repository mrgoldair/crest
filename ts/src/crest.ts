import { Token } from './Token.js';
import { Scanner } from './Scanner.js';


export class Crest {
  static tokens:Array<Token>;
  static hadError:boolean = false;

  static run(source:string){
    let scanner = new Scanner(source);
    let tokens = scanner.scanTokens();

    for (const token of tokens) {
      console.log( token );
    }
  }

  static error(line:number, message:string):void {
    Crest.report(line, "", message);
  }

  static report(line:number, where:string, message:string):void {
    console.error( `[line ${line}] Error ${where} : ${message}` );
    this.hadError = true;
  }
}