/**
 * The entry point of the app. This acts as the composition root.
 * 
 * Set's up the state and state-updating functions which are passed
 * down (prop-drilled) to <Literal> and <Aggregate> components via their
 * onChange functions.
 * 
 * The state is conceptually a map of "slots", a slot being either a literal expression
 * or an aggregate (see Literal.tsx and Aggregate.tsx) with the key being a preset Id.
 * 
 * Creation and change functions are created in this module. Because we have access to
 * state (and don't want to pass it around) and we want to keep the knowledge of how to update
 * it concentrated here, the functions are partially applied with the ids which means we can
 * simply pass the resulting functions down to their relevant components via their onChange and
 * updates happen automatically.
 * 
 * When a change happens:
 * a) if the change is from a <Literal> el, the state gets updated with the value of
 * the input (the expression text), the resulting change in state kicks off a new compile
 * via the service and a new "plot" function is created.
 * 
 * b) if the change is from an <Aggregate> el, the state gets updated with the value of
 * the new expression id(s) chosen, or operation selected; the resulting change in state kicks off a new compile
 * via the service and a new "plot" function is created.
 */

import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';

import * as UI from './ui/Types.js';
import { Literal, LiteralOf, Aggregate, AggregateOf, Op, Id } from './domain/Types.js';

import { Crest as compiler } from 'crest-compiler';
import { Service, IWaveFn } from './Service.js';

import { Slots } from './ui/Slots.jsx';
import { Plot } from './ui/Plot.jsx';

let service = new Service(compiler);

const App = ({ service }) => {

  let state = new Map<UI.Id,UI.Slot>([
    [ 1, UI.EmptyOf() ],
    [ 2, UI.EmptyOf() ],
    [ 3, UI.EmptyOf() ]
  ]);

  let [ desc, setDesc ] = useState<Map<UI.Id,UI.Slot>>(state);
  let [ exprFn, setExprFn ] = useState({ fn: (x:number) => [0] });

  let defaultExpr = "cos(x) * 5";

  //----------------------
  //--- Event handlers ---
  //----------------------

  const handleLiteralChange = (idx:UI.Id) => (value:string) => {
    setDesc(new Map([
      ...desc,
      [ idx, LiteralOf(value) ]
    ]));
  }

  const handleAggregateChange = (id:UI.Id) => (expressions:[ UI.Id, UI.Id ], op:Op ) => {
    setDesc(new Map([
      ...desc,
      [ id, AggregateOf(op,expressions) ]
    ]))
  }

  const addAggregateExpression = (id:UI.Id, expressionsIds:[ UI.Id, UI.Id ]) => () => {
    setDesc(new Map([
      ...desc,
      [ id, AggregateOf(Op.ADD, expressionsIds) ]
    ]))
  }

  const addLiteralExpression = (id:UI.Id) => () => {
    setDesc(new Map([
      ...desc,
      [ id, LiteralOf(defaultExpr) ]
    ]))
  }

  useEffect(() => {
    let emptiesRemoved = [...desc.entries()]
                            .filter(([k,slot]) => slot.kind !== "empty")
                            .reduce((acc,[k,slot]) => {
                              switch (slot.kind){
                                case "literal":
                                  return acc.set(k, { kind: "literal", expr: slot.expr })
                                case "aggregate":
                                  return acc.set(k, { kind: "aggregate", expressions: slot.expressions, op: Op.MIN })
                              }
                            }, new Map<UI.Id,Literal | Aggregate>());

    // Create our final plot-able function
    let fn = service.create(emptiesRemoved) as IWaveFn;
    // Update the state so <Plot/> is aware
    setExprFn({fn:fn});
  }, [desc])

  return  <>
            <Plot fn={exprFn.fn} dimensions={"auto"} />
            <Slots desc={desc}
                   addLiteral={addLiteralExpression}
                   onLiteralChange={handleLiteralChange}
                   addAggregate={addAggregateExpression}
                   onAggregateChange={handleAggregateChange}/>
          </>
}

render(<App service={service} />, document.getElementById('root'));