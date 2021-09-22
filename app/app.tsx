import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { Crest as compiler } from 'crest-compiler';
import * as Service from './service.js';
import { Plot } from './plot.jsx'
import * as UI from './ui.jsx'

// Configure the application service with a compiler and pass to App
let service = new Service.Service(compiler);

// Domain types
type Id = number;

enum Op {
  NONE,
  ADD,
  SUB
}

type Merge = {
  kind: "merge"
  op: Op
  expressions: [ Id, Id ]
}
const Merge = {
  of(op:Op, expressions:[ Id, Id ]):Merge {
    return {
      kind: "merge",
      op,
      expressions
    }
  }
}

type Literal = {
  kind: "literal"
  expr: string
}
const Literal = {
  of(value:string):Literal {
    return {
      kind:"literal",
      expr: value
    }
  }
}

type Empty = {
  kind: "empty"
}
const Empty = () => {
  return { kind: "empty" } as Empty
}

type E = "Equation" | "Mix"
type Expr = Literal | Merge
type Slot = Expr | Empty
//type Slott<T> = Empty | T
type Slott<T> = Map<Id,T | Empty>

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
  // const handleCombinerChange = (id:Service.Id,combiner:number) => {
  //   let a:Service.Path = {
  //     ...desc.get(id) as Service.Path,
  //     op:combiner
  //   }

  //   setDesc(new Map([
  //     ...desc,
  //     [ id, a ]
  //   ]))
  // }

  // UI.Literal
  const handleLiteralChange = (idx:Id,value:string) => {
    setDesc(new Map([
      ...desc,
      [ idx, Literal.of(value) ]
    ]));
  }

  // UI.Merge
  const handleMergeChange = (id:Id) => (op:Op, expressions:[ Id, Id ]) => {
    setDesc(new Map([
      ...desc,
      [ id, Merge.of(op,expressions) ]
    ]))
  }

  // Build our `Desc` to send to the compiler
  useEffect(() => {
    // This is all for getting UI.Desc -> Service.Desc form as the service
    // doesn't care about our expression indices, it just wants to compile the
    // expressions and then combine them.
    // let fn = service.create(desc) as Service.IWaveFn;
    // setExprFn({fn:fn});
  }, [desc])

  // let inputs = [];
  // for (let [ k, v ] of desc.entries()) {
  //   inputs.push(<input key={k} value={v.value.toString()} onChange={e => handleInputChange(e.target,Number(k)) } />);
  // }
  
  // let radios = []
  // for (let k in Service.Op){
  //   if(Number.isNaN(Number(k)))
  //     radios.push(
  //     <React.Fragment key={k}>
  //       <input type="radio" id={Service.Op[k]} value={k} name="combiner" onClick={e => handleCombinerChange(Number(k), Number(k))} ></input>
  //       <label htmlFor={Service.Op[k]}>{k}</label>
  //     </React.Fragment>)
  // }
  
  // Can only be used with two existing expressions
  const addMergeExpression = (id:Id, expressionsIds:[ Id,Id ]) => {
    setDesc(new Map([
      ...desc,
      [ id, Merge.of(Op.NONE, expressionsIds) ]
    ]))
  }

  const addLiteralExpression = (id:Id) => {
    // Get our next index
    //let { value, done } = id.next()
    // While we're not done (we have indices remaining), create the expression
    //if (!done)
      setDesc(new Map([
        ...desc,
        [ id, Literal.of("") ]
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
                    <button onClick={e => addMergeExpression(k,[ (k-2),(k-1) ])}>Add Merge Expression</button>
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
            case "merge":
              // return <UI.Merge />
              return <UI.Merge expressions={v.expressions} slots={[...desc.keys()]} op={v.op} onChange={handleMergeChange(k)} key={k} />
              break;
          }
        })}
      </div>
      <Plot fn={exprFn.fn} dimensions={"auto"} />
    </>
  );
}

render(<App service={service} />, document.getElementById('root'));