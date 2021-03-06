type Id = number;

enum Op {
  MIN = "min",
  MAX = "max",
  ADD = "add",
  SUB = "sub"
}

type Aggregate = {
  kind: "aggregate"
  op: Op
  expressions: [ Id, Id ]
}

const AggregateOf = (op:Op, expressions:[ Id, Id ]):Aggregate => {
  return {
    kind: "aggregate",
    op,
    expressions
  }
}

type Literal = {
  kind: "literal"
  expr: string
}

const LiteralOf = (value:string):Literal => {
  return {
    kind:"literal",
    expr: value
  }
}

export {
  Id,
  Literal,
  LiteralOf,
  Aggregate,
  AggregateOf,
  Op
}