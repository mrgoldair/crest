
type Id = number;

enum Op {
  NONE,
  ADD,
  SUB
}

type Merge = {
  kind: "merge"
  op: Op
  operands: [ Id, Id ]
}

export { Merge, Id, Op };