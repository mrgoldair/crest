import { TokenType } from './TokenType.js';
export declare class Token {
    type: TokenType;
    lexeme: string;
    literal?: any;
    line: number;
    constructor(type: TokenType, lexeme: string, line: number, literal?: any);
    toString(): string;
}
