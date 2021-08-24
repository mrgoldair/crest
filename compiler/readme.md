# CREST
### A DSL for writing waves

## TODO
- Scroll the waves right to left
- Layer multiple waves
- Give UI controls for speed n such

## Lexing & Tokens
Converts the string of a source file it into the tokens of our DSL. This is our "lexical grammer" – what arrangement of characters create allowable tokens. `cos`, `sin` and `tan`.

## Parsing
Ensure the tokens provided by the lexing conform to the grammar of our DSL. This is our "syntactic grammar" – what arrangement of tokens create allowable syntax.

## Questions
We produce our grammar of expression types of which literal numbers can be expressions; negated numbers (unary operators) also; binary operators (+,-,* and /) also contribute as expressions.

But these are not enough to construct a grammar in which operator precedence holds. Instead we need to extend the grammar which differs between these types of expressions in order to maintain correct precedence.

In reading the grammar from the list of tokens from the lexer we need a way to maintain this relationship of completing multiplication and division before addition and subtraction. But once we're parsing the tokens within that grammar we don't need to store them in such a specifc structure as "Addition", instead we can store all such binary operations using a `BinaryExpr` class which encodes the specifc operator as a token e.g. `+`, `*`, `-` or `/`.

Distinction between literals, lexemes and values.

## On Statements and Expressions

Visually statements and expressions are very similar. The main difference between the two is while we use expressions to "compute" a value, statements are a way to enact change without returning a value. e.g. print statements or var declaration statements. There's even the obviously named, but somewhat confusing "expression statement":

> An expression followed by a semicolon (`;`) promotes the expression to statement-hood. This is called (imaginatively enough), an **expression statement**.
>
> – https://craftinginterpreters.com/the-lox-language.html#statements

For example, an expression as simple as `x = 5` becomes a statement expression with the addition of a semi-colon e.g. `x = 5;`

> Where an expression’s main job is to produce a *value*, a statement’s job is to produce an *effect*.
>
> – https://craftinginterpreters.com/the-lox-language.html#statements

There is the **variable declaration** statement. This introduces a binding between an expression and an identifier. Then flip side of that is the **variable expression** statement - when an identifier is used as an expression, the name is looked-up and the bound value returned.

## Compiling to JS

What's the best way?