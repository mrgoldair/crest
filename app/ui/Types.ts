import { Literal, Aggregate } from '../domain/Types.js';

// UI specific types
type Empty = {
  kind: "empty"
}

const EmptyOf = () => {
  return { kind: "empty" } as Empty
}

// Domain + UI types
type Slot = Literal | Aggregate | Empty

type Id = number;

export { Id, Slot, Empty, EmptyOf }