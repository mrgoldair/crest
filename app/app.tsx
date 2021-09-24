import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { Crest as compiler } from 'crest-compiler';
import { Literal, LiteralOf, Aggregate, AggregateOf, Id, Op } from './domain.js';
import * as Service from './service.js';
import { Plot } from './plot.jsx'
import * as UI from './ui.jsx'

let service = new Service.Service(compiler);

// UI specific types
type Empty = {
  kind: "empty"
}

const Empty = () => {
  return { kind: "empty" } as Empty
}

// Domain + UI types
type Slot = Literal | Aggregate | Empty

/**
 * Composition root
 */
const App = ({service}) => {
  // Desc of a wave
  let state = new Map<Id,Slot>([
    [ 1, Empty() ],
    [ 2, Empty() ],
    [ 3, Empty() ],
    [ 4, Empty() ],
    [ 5, Empty() ],
    [ 6, Empty() ],
    [ 7, Empty() ]
  ]);
  let [ desc, setDesc ] = useState<Map<Id,Slot>>(state);
  // `exprFn` is the resulting function compiled from our `desc` expressions
  let [ exprFn, setExprFn ] = useState({fn:(x:number) => [0]});

  //----------------------
  //--- Event handlers ---
  //----------------------

  const handleLiteralChange = (idx:Id,value:string) => {
    setDesc(new Map([
      ...desc,
      [ idx, LiteralOf(value) ]
    ]));
  }

  const handleMergeChange = (id:Id) => (op:Op, expressions:[ Id, Id ]) => {
    setDesc(new Map([
      ...desc,
      [ id, AggregateOf(op,expressions) ]
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
              }, new Map<Id,Literal | Aggregate>());

    // Create our final plot-able function
    let fn = service.create(d) as Service.IWaveFn;
    // Update the state so <Plot/> is aware
    setExprFn({fn:fn});
  }, [desc])
  
  const addMergeExpression = (id:Id, expressionsIds:[ Id,Id ]) => {
    setDesc(new Map([
      ...desc,
      [ id, AggregateOf(Op.ADD, expressionsIds) ]
    ]))
  }

  const addLiteralExpression = (id:Id) => {
    // Get our next index
    //let { value, done } = id.next()
    // While we're not done (we have indices remaining), create the expression
    //if (!done)
      setDesc(new Map([
        ...desc,
        [ id, LiteralOf("") ]
      ]))
  }

  const slots = () => {}

  // Mmmm maybe this could all go in a <Slot/>
  return (
    <>
      <div id="expressions" style={{display:'flex', alignItems:'center'}}>
        {[...desc.entries()].map(([k,v]) => {
          switch (v.kind){
            case "empty":
              if ([...desc.values()].filter(expr => expr.kind !== "empty").length >= 2){
                return (
                  <div key={k}>
                    <button onClick={e => addMergeExpression(k,[ (k-2),(k-1) ])}>Add Aggregate Expression</button>
                    <button onClick={e => addLiteralExpression(k)}>Add Expression</button>
                  </div>);
              } else {
                return <button key={k} onClick={e => addLiteralExpression(k)}>Add Expression</button>
              }
              break;
            case "literal":
              // return <UI.Literal />
              return <UI.Literal key={k} value={v.expr} onChange={e => handleLiteralChange(k, e.target.value)} />
              break;
            case "aggregate":
              // return <UI.Aggregate />
              return <UI.Aggregate expressions={v.expressions} slots={[...desc.keys()]} op={v.op} onChange={handleMergeChange(k)} key={k} />
              break;
          }
        })}
      </div>
      <Plot fn={exprFn.fn} dimensions={"auto"} />
    </>
  );
}

render(<App service={service} />, document.getElementById('root'));