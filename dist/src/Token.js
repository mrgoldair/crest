export class Token {
    constructor(type, lexeme, line, literal) {
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
        this.line = line;
    }
    toString() {
        return this.type + " " + this.lexeme + " " + this.literal;
    }
}
//# sourceMappingURL=Token.js.map