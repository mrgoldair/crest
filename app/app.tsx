import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { Crest as compiler } from 'crest-compiler';
import * as Service from './service.js';
import { Plot } from './plot.jsx'
import * as UI from './ui.jsx'

// Configure the application service with a compiler and pass to App
let service = new Service.Service(compiler);

// let id = (function* indexGenerator() {
//   for (let index = 0; index < 15; index++) {
//     yield index;
//   }
//   return 16;
// })()

type Id = number;

enum Op {
  ADD,
  SUB
}

type Merge = {
  kind: "merge"
  op: Op
  operands: Id[]
}
const Merge = {
  of(op:Op, operands:Id[]):Merge {
    return {
      kind: "merge",
      op,
      operands
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
const Empty = {
  of():Empty {
    return { kind: "empty" }
  }
}

type Expr = Literal | Merge
type Slot = Expr | Empty
//type Slott<T> = Empty | T

/**
 * Composition root
 */
const App = ({service}) => {
  // Desc of a wave
  let state = new Map<Id,Slot>([
    [ 1, Empty.of() ],
    [ 2, Empty.of() ],
    [ 3, Empty.of() ]
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
  const handleMergeChange = (id:Id, op:Op, operands:Id[]) => {
    setDesc(new Map([
      ...desc,
      [ id, Merge.of(op,operands) ]
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
  
  const addMergeExpression = (id:Id) => {}
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

  return (
    <div>
      <div style={{display:'flex', alignItems:'center'}}>
        {[...desc.entries()].map(([k,v]) => {
          // Render the control if it exists
          switch (v.kind){
            case "empty":
              return (
                <div className="" key={k}>
                  <button onClick={e => addMergeExpression(k)}>Add Merge Expression</button>
                  <button onClick={e => addLiteralExpression(k)}>Add Expression</button>
                </div>);
              break;
            case "literal":
              // return <UI.Literal />
              return <UI.Literal key={k} value={v.expr} onChange={e => handleLiteralChange(k, e.target.value)} />
              break;
            case "merge":
              // return <UI.Merge />
              break;
          }
        })}
      </div>
      <Plot fn={exprFn.fn} width={1000} height={150} />
    </div>
  );
}

render(<App service={service} />, document.getElementById('root'));