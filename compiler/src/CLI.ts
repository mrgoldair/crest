import { Crest } from './Crest.js';
import fs from 'fs';

class CrestCLI {
  static main(){
    /**
     * https://nodejs.dev/learn/nodejs-accept-arguments-from-the-command-line
     * 0 - path of the node command
     * 1 - path of the file being executed
     * 2 - the first cli arg
     */
    if ( process.argv.length > 3 ){
      console.error( "Usage: crest [script]" );
      process.exit(1);
    } else if ( process.argv.length == 3 ){
      CrestCLI.runFile( process.argv[2] );
    }
  }

  static runFile(file:string){
    fs.readFile( file, { encoding:"utf-8" }, (err,data) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }

      Crest.run(data);

      if ( Crest.hadError )
        process.exit(65);
    })
  }
}

CrestCLI.main();