# CREST
A DSL for writing waves

## Lexing
Converts the string of a source file it into the tokens of our DSL. This is our "lexical grammer" – what arrangement of characters create allowable tokens

## Parsing
Ensure the tokens provided by the lexing conform to the grammar of our DSL. This is our "syntactic grammar" – what arrangement of tokens create allowable syntax.

## Questions
We produce our grammar of expression types of which literal numbers can be expressions; negated numbers (unary operators) also; binary operators (+,-,* and /) also contribute as expressions.

But these are not enough to construct a grammar in which operator precedence holds. Instead we need to extend the grammar which differs between these types of expressions in order to maintain correct precedence.

In reading the grammar from the list of tokens from the lexer we need a way to maintain this relationship of completing multiplication and division before addition and subtraction. But once we're parsing the tokens within that grammar we don't need to store them in such a specifc structure as "Addition", instead we can store all such binary operations using a `BinaryExpr` class which encodes the specifc operator as a token e.g. `+`,`*`,`-` or `/`.

Distinction between literals, lexemes and values.