import { Token } from './Token.js';
import { TokenType } from './TokenType.js';
export declare class Scanner {
    source: string;
    tokens: Array<Token>;
    start: number;
    current: number;
    line: number;
    keywords: Map<string, TokenType>;
    constructor(source: string);
    scanTokens(): Array<Token>;
    scanToken(): void;
    isAlpha(char: string): boolean;
    isDigit(char: string): boolean;
    number(): void;
    peekNext(): string;
    keyword(): void;
    advance(): string;
    addToken(type: TokenType, literal?: any): void;
    isAtEnd(): boolean;
    match(expected: string): boolean;
    peek(): string;
}
