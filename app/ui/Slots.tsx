import React from "react";
import { Id, Slot } from "./Types";
import { Op } from "../domain/Types";
import * as UI from './Slot';
import { Literal } from './Literal';
import { Aggregate } from './Aggregate';

type Props = {
  desc:Map<Id, Slot>
  addLiteral: (id:Id) => () => void
  addAggregate: (id:Id, expressionIds:[Id,Id]) => () => void
  onLiteralChange: (id:Id) => (expr:string) => void
  onAggregateChange: (id:Id) => (expressionIds:[Id,Id], op:Op) => void
}

const Slots = ({ desc, addLiteral, addAggregate, onAggregateChange, onLiteralChange }:Props) => {
  
  return (<div>
    {...[...desc.entries()].map(([ id, slot ]) => {

      switch (slot.kind) {

        case "empty":
          if ([...desc.values()].filter(expr => expr.kind !== "empty").length >= 2){
            return <UI.Slot key={id} id={id}>
                     <button onClick={addAggregate(id,[ (id-2),(id-1) ])}>Add Aggregate Expression</button>
                     <button onClick={addLiteral(id)}>Add Expression</button>
                   </UI.Slot>
          } else {
            return <UI.Slot key={id} id={id}>
                      <button onClick={addLiteral(id)}>Add Expression</button>
                   </UI.Slot>
          }
          break;

        case "literal":
          return (
            <UI.Slot key={id} id={id}>
              <Literal value={slot.expr}
                       onChange={onLiteralChange(id)}/>
            </UI.Slot>)
          break;

        case "aggregate":
          return <UI.Slot id={id}>
                    <Aggregate expressions={slot.expressions}
                               slots={[...desc.keys()]}
                               op={slot.op}
                               onChange={onAggregateChange}
                               key={id} />
                 </UI.Slot>
          break;
      }
  
    })}</div>)
}

export { Slots }