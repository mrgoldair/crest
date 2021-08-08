import { Crest } from './Crest.js';
import { Token } from './Token.js';
import { TokenType } from './TokenType.js';
export class Scanner {
    constructor(source) {
        this.tokens = [];
        this.start = 0;
        this.current = 0;
        this.line = 1;
        this.keywords = new Map();
        this.source = source;
        this.keywords.set('cos', TokenType.COS);
        this.keywords.set('x', TokenType.X);
    }
    scanTokens() {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }
        this.tokens.push(new Token(TokenType.EOF, "", this.line));
        return this.tokens;
    }
    scanToken() {
        let c = this.advance();
        switch (c) {
            case '-':
                this.addToken(TokenType.MINUS);
                break;
            case '+':
                this.addToken(TokenType.PLUS);
                break;
            case '*':
                this.addToken(TokenType.STAR);
                break;
            case '(':
                this.addToken(TokenType.LEFT_BRACKET);
                break;
            case '(':
                this.addToken(TokenType.RIGHT_BRACKET);
                break;
            case ' ':
            case '\r':
            case '\t':
                // Ignore whitespace
                break;
            case '\n':
                this.line++;
                break;
            default:
                if (this.isAlpha(c)) {
                    this.keyword();
                    break;
                }
                else if (this.isDigit(c)) {
                    this.number();
                    break;
                }
                else {
                    Crest.error(this.line, `Unexpected character ${c}`);
                    break;
                }
        }
    }
    isAlpha(char) {
        return /[a-zA-Z_]/.test(char);
    }
    isDigit(char) {
        return /[0-9]/.test(char);
    }
    number() {
        // 
        while (this.isDigit(this.peek())) {
            // Called for side-effect
            this.advance();
        }
        if (this.peek() == '.' && this.isDigit(this.peekNext())) {
            // Consume the '.'
            this.advance();
            while (this.isDigit(this.peek())) {
                this.advance();
            }
        }
        this.addToken(TokenType.NUMBER, Number.parseFloat(this.source.substring(this.start, this.current)));
    }
    peekNext() {
        if (this.current + 1 > this.source.length)
            return '\0';
        return this.source.charAt(this.current + 1);
    }
    keyword() {
        while (this.isAlpha(this.peek())) {
            this.advance();
        }
        let text = this.source.substring(this.start, this.current);
        let tokenType = this.keywords.get(text);
        if (tokenType) {
            this.addToken(tokenType);
        }
        else {
            Crest.error(this.line, `Unexpected keyword ${text}`);
        }
    }
    advance() {
        return this.source.charAt(this.current++);
    }
    addToken(type, literal) {
        let text = this.source.substring(this.start, this.current);
        this.tokens.push(new Token(type, text, this.current, literal));
    }
    isAtEnd() {
        return this.current >= this.source.length;
    }
    match(expected) {
        if (this.isAtEnd())
            return false;
        if (this.source.charAt(this.current) != expected)
            return false;
        this.current++;
        return true;
    }
    peek() {
        if (this.isAtEnd())
            return "\0";
        return this.source.charAt(this.current);
    }
}
//# sourceMappingURL=Scanner.js.map