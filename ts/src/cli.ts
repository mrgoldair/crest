import { Crest } from './Crest.js';

class CrestCLI {
  static main(){
    /**
     * https://nodejs.dev/learn/nodejs-accept-arguments-from-the-command-line
     * 0 - 
     * 1 - 
     * 2 - 
     */
    if ( process.argv.length > 3 ){
      console.error( "Usage: crest [script]" );
      process.exit(1);
    } else if ( process.argv.length == 3 ){
      console.log(Crest.runFile( process.argv[2] ));
    }
  }
}

CrestCLI.main();