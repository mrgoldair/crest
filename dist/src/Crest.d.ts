import { Token } from './Token.js';
export declare class Crest {
    static tokens: Array<Token>;
    static hadError: boolean;
    static run(source: string): void;
    static error(line: number, message: string): void;
    static report(line: number, where: string, message: string): void;
}
