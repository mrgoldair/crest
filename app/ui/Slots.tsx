import React from "react";

import { Id, Slot } from "./Types";
import { Op } from "../domain/Types";
import * as UI from './Slot';

import { AddMix } from './AddMix';
import { AddExpr } from './AddExpr';
import { Literal } from './Literal';
import { Aggregate } from './Aggregate';

type Props = {
  desc:Map<Id, Slot>
  addLiteral: (id:Id) => () => void
  addAggregate: (id:Id, expressionIds:[Id,Id]) => () => void
  onLiteralChange: (id:Id) => (expr:string) => void
  onAggregateExpr: (id:Id) => (expressionIds:[Id,Id]) => void
  onAggregateOp: (id:Id) => (op:Op) => void
  onRemove: (id:Id) => () => void
}

const Slots = ({ desc, addLiteral, addAggregate, onAggregateExpr, onAggregateOp, onLiteralChange, onRemove }:Props) => {
  
  return (<div id="expressions">
    {...[...desc.entries()].map(([ id, slot ]) => {

      switch (slot.kind) {

        case "empty":
          if ([...desc.values()].filter(expr => expr.kind !== "empty").length >= 2){
            return <UI.Slot key={id} id={id}>
                     <AddExpr onClick={addLiteral(id)} />
                     <div className="vertical-bar"></div>
                     <AddMix onClick={addAggregate(id,[ 1, 1 ])} />
                   </UI.Slot>
          } else {
            return <UI.Slot key={id} id={id}>
                     <AddExpr onClick={addLiteral(id)} />
                   </UI.Slot>
          }
          break;

        case "literal":
          return <UI.Slot id={id} remove={onRemove(id)}>
                   <Literal value={slot.expr}
                            onChange={onLiteralChange(id)} />
                 </UI.Slot>
          break;

        case "aggregate":
          return <UI.Slot id={id} key={id}>
                  <Aggregate expressions={slot.expressions}
                              slots={[...desc.entries()]
                                        .filter(([ k, v ]) => k !== id && v.kind !== "empty")
                                        .map(([ k, _ ]) => k)}
                              op={slot.op}
                              onChangeExpr={onAggregateExpr(id)}
                              onChangeOp={onAggregateOp(id)}
                              key={id} />
                 </UI.Slot>
          break;
      }
  
    })}</div>)
}

export { Slots }