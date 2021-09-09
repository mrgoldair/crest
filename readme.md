# CREST
### A DSL for writing waves

## TODO
- ~~Scroll the waves right to left~~
- Layer multiple waves
  - Colour waves for easier identification
  - Drag 'n' drop to move expressions around?
  - By composing functions `{Int -> Int . Int -> Int}`
  - Each successive pair can be combined via an operation e.g. addition, subtraction or even min/max
  - Where should the responsabilities lay? Should `Canvas` know about expressions? Should the expressions know how they're being rendered? If each expression constitutes a curve i.e. there's no accumulation function between curve expressions, since the canvas is rendering curves should it know about this technicality?
  - Maybe the structure should be a map instead of an array and the ordering explicit instead of implicitly defined by the array?
  - If the _______ is for rendering curve functions should it know about "the innards" of them?
  - At the moment the callee of `compiler` has to convert the returned "js" into a function, but perhaps this would make more sense being _in_ the compiler itself? When will we want a mere string from a compiler, huh?
  - Invert dependencies
    - **`Application`** 
      - exposes the primary port (used-by) and becomes the adapter
      - exposes the secondary (driven) port which is used by **`Application`**
    - **`Compiler`** is the adapter of the secondary port exposed by **`Application`**
    - **`UI(React)`** uses **`Application`** via the port/interface (primary/driven) **`Application`** exposes

> **Incoming ports** will be the interface(s) that your application **implements**. **Outgoing ports** are the interfaces that your application **depends on**. "Incoming" and "outgoing" are the terms that our team adopted. "Driving port" and "driven port" is the terminology you may find in other literature.
>
> That leaves us with adapters. Just like ports, there are two kinds of adapters: incoming, which are represented in blue; and outgoing, which are represented in purple. The distinction here is incoming adapters **depend on the incoming port**, and outgoing adapters **implement the outgoing port**.
>
> [A color-coded guide to ports and adapters]: https://8thlight.com/blog/damon-kelley/2021/05/18/a-color-coded-guide-to-ports-and-adapters.html

- Give UI controls for speed n such
- Debounce expression input
- Start the wave in the middle, flowing left like a sparkline

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

What's the best way? Because we ultimately want a funciton of the form

```typescript
type Fn = (x:number):number
```

we can't simply interperet the expression and return a single value; this function needs to be run for a range of $x$ values. Instead, I opted to return a valid Javascipt string expression for example: an input expression of

```
cos(x/10) * 5
```

Would be compiled to

```typescript
"Math.cos(x/10) * 5"
```

This then get's compiled to a real Javascript function outside of the Crest compiler, like so

```typescript
new Function("x", "return ${expression}")
```

## State

App state (referring to the state within App.tsx) is currently a mish-mash of `Maps` and `Arrays`. Maps make it nice to update an existing expression which is indexed by a surrogate Id. However there's no way to use the keys and values in an expression to succinctly create UI elements (`<input>`, in our case). Using arrays as the basis for holding expressions makes it trivial to use as an expression for UI elements, but tedious to update which devolves to a linear search through the array for the element to update.

Using `Map` 