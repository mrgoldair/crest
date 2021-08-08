import { Scanner } from './Scanner.js';
export class Crest {
    static run(source) {
        let scanner = new Scanner(source);
        let tokens = scanner.scanTokens();
        for (const token of tokens) {
            console.log(token);
        }
    }
    static error(line, message) {
        Crest.report(line, "", message);
    }
    static report(line, where, message) {
        console.error(`[line ${line}] Error ${where} : ${message}`);
        this.hadError = true;
    }
}
Crest.hadError = false;
//# sourceMappingURL=Crest.js.map