import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';

import * as UI from './ui/Types.js';
import { Literal, LiteralOf, Aggregate, AggregateOf, Op } from './domain/Types.js';

import { Crest as compiler } from 'crest-compiler';
import { Service, IWaveFn } from './service.js';

import { Slots } from './ui/Slots.js';
import { Plot } from './ui/Plot.js';

let service = new Service(compiler);

const App = ({service}) => {

  let state = new Map<UI.Id,UI.Slot>([
    [ 1, UI.EmptyOf() ],
    [ 2, UI.EmptyOf() ],
    [ 3, UI.EmptyOf() ],
    [ 4, UI.EmptyOf() ],
    [ 5, UI.EmptyOf() ],
    [ 6, UI.EmptyOf() ],
    [ 7, UI.EmptyOf() ]
  ]);

  let [ desc, setDesc ] = useState<Map<UI.Id,UI.Slot>>(state);
  let [ exprFn, setExprFn ] = useState({ fn: (x:number) => [0] });

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

  const addAggregateExpression = (id:UI.Id, expressionsIds:[ UI.Id,UI.Id ]) => () => {
    setDesc(new Map([
      ...desc,
      [ id, AggregateOf(Op.ADD, expressionsIds) ]
    ]))
  }

  const addLiteralExpression = (id:UI.Id) => () => {
    setDesc(new Map([
      ...desc,
      [ id, LiteralOf("") ]
    ]))
  }

  useEffect(() => {
    let d = [...desc.entries()]
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
    let fn = service.create(d) as IWaveFn;
    // Update the state so <Plot/> is aware
    setExprFn({fn:fn});
  }, [desc])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  return  <div id="expressions"
               style={{display:'flex', alignItems:'center'}}>
            <Slots desc={desc}
                   addLiteral={addLiteralExpression}
                   onLiteralChange={handleLiteralChange}
                   addAggregate={addAggregateExpression}
                   onAggregateChange={handleAggregateChange}/>
            <Plot fn={exprFn.fn} dimensions={"auto"} />
          </div>
}

render(<App service={service} />, document.getElementById('root'));