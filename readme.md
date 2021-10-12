# CREST
## A DSL for writing waves





##### Build Notes / Issues / Todo

- Show only topmost wave
- ~~Scroll the waves right to left~~
- ~~Layer multiple waves~~
- Delete expressions
- Filter slots own Id from aggregate slot id list
- The functional design of unlimited expressions is posing a problem with UI design; how to show and navigate each and every expression and add new ones? Perhaps the difficulty is informing me that the design should be constrained to a limited number of expression *"slots"* .
  - Slots implemented
- ~~Colour waves for easier identification~~
- ~~Each successive pair can be combined via an operation e.g. addition, subtraction or even min/max~~
- Where should the responsabilities lay? Should `Canvas` know about expressions? Should the expressions know how they're being rendered? If each expression constitutes a curve i.e. there's no accumulation function between curve expressions, since the canvas is rendering curves should it know about this technicality?
- Maybe the structure should be a map instead of an array and the ordering explicit instead of implicitly defined by the array?
  - State is now implemented as a map. This also was to simplify the requirement from unlimited slots to just a few.
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

State as maps all-the-way-down with the base type being a map with keys for expressions and combinations. The next was to try combine expressions and combinations as a recursive type. This was the initial design but quickly got unwieldy once it was realised a basic expression type could be used in multiple places and updating them all would be cost prohibitive and problematic. 

The next design was to normalise each expression. Complex waves would be not be literal but instead have a path of constituent wave via their Ids.

So now there's a list of "descriptors". These are either an Expression (text representation of a wave), or a Path (a tuple of previous expression Ids). The structure is now flat so we cannot recursively render. Thinking about this, the better representation would be a tree of components but having each level normalised references for the children – the best of both worlds. This side-steps the issue of duplicated expressions in a tree form, but also gives us the flexibility of referencing expressions via an identity.

This is impacted by my latest idea of constraining the expressions to a limited number (8, say). Having wrestled with creating an easily navigable UI for an unlimited number of expressions, perhaps the informed idea is to pull back and go smaller.

Should the UI layer not use types from the domain? In other words, should the only use of a lower layer be via a port? We should not utilise domain types in the UI layer but they should be parsed from more primitive types...?

​	I didn't have a great solution to this. Domain types inform the range of values the UI can express. Though I felt like I had 	to recreate domain concepts as UI-specific components. Something to think about more.

The state ended up being a `Map` held within `App`. The functions for manipulating the state were wired-up in `App` and passed down to `Slots` which knew how to handle the various types for the state values; when the slot state was `Empty` it knew to create buttons allowing the creation of a `Expr | Aggregate` etc. This freed up the lower components from knowing anything about the state or why they were being used.

​	So, like stratified design for code, in the UI the lower level building blocks are more literal/general while the composites and "higher up" components are more abstract. The literals *generally* change less while the abstractions *generally* change more. Therefore since a literal like an input deals with text strings it should not know what our app state is or how to change it, only how to relay changes to its own state - that of a string. We build more abstract components on top/around these literal ones that may know about state and how to change it, but they don't deal in strings. The topmost element `App` , being the most abstract of them all. 

​	Therefore if we find a component working with abstractions outside it's layer of design (either above or below) e.g. a `Slot` working with strings as opposed to a more abstract representation of our state then we can be curious as to whether that will work effectively. The App also does not deal in obtaining the literals for the state but delegates the means to lower components via a function. The function acts as a broker between layers speaking both in strings (the incoming "raw material" as the literal elements that make up our state) and in state (the specific organisation of those literals that makes up the abstraction of our state). The lower level components are given a function which accepts inputs in the form that the lower level components speak – string literals – whilst inside, the function operates at the higher level of the state in which it was created.

Should more general functions create more data from their inputs, or should more abstract functions create more data?