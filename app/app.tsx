import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { Crest as compiler } from 'crest-compiler';
import * as Service from './service.js';
import { Plot } from './plot.jsx'

// Configure the application service with a compiler and pass to App
let service = new Service.Service(compiler);
let gen = (function* indexGenerator(){
  for (let index = 0; index < 15; index++) {
    yield index;
  }
  return 0;
})()

// The basis of our wave app revolves around the `Desc` type
// which describes `expressions` for waves that are intended to be combined 
// via the `combiner`
type Desc = {
  // The expression component(s) of a wave
  expressions: { [index:number]: string },
  // The way in which we could combine given expressions min, max, none etc
  combiner: Service.Combiner
}

/**
 * Composition root
 */
const App = ({service}) => {
  // Desc of a wave
  let [ desc, setDesc ] = useState<Desc>({ expressions:{}, combiner:Service.Combiner.Min });
  // `exprFn` is the resulting function compiled from our `desc` expressions
  let [ exprFn, setExprFn ] = useState({fn:(x:number) => []});

  const handleCombinerChange = (combiner) => {
    setDesc({
      ...desc,
      combiner: combiner
    })
  }

  // Update corresponding expression when the input value changes
  const handleInputChange = ({target},idx) => {
    setDesc({
      ...desc,
      expressions:{
        ...desc.expressions,
        [idx]: target.value
      }
    });
  }

  const addExpressionInput = () => {
    // Get our next index
    let {value,done} = gen.next()
    // While we're not done (we have indices remaining), create the expression
    if (!done)
      setDesc({
        ...desc,
        expressions:{
          ...desc.expressions,
          [value]:""
        }
      })
  }

  // init
  useEffect(() => {
    addExpressionInput();
  },[])

  // Build our `Desc` to send to the compiler
  useEffect(() => {
    // This is all for getting UI.Desc -> Service.Desc form as the service
    // doesn't care about our expression indices, it just wants to compile the
    // expressions and then combine them.
    let expr = []
    for (const e in desc.expressions){
      expr.push(desc.expressions[e])
    }
    let fn = service.compile({expressions:expr, combiner:desc.combiner}) as Service.IWaveFn;
    setExprFn({fn:fn});
  }, [desc])
  
  let inputs = [];
  for(let prop in desc.expressions) { 
    inputs.push(<input key={prop} value={desc.expressions[prop]} onChange={e => handleInputChange(e,prop) } />);
  }
  
  let radios = []
  for (let k in Service.Combiner){
    if(Number.isNaN(Number(k)))
      radios.push(
      <React.Fragment key={k}>
        <input type="radio" id={Service.Combiner[k]} value={k} name="combiner" onClick={e => handleCombinerChange(Service.Combiner[k])}></input>
        <label htmlFor={Service.Combiner[k]}>{k}</label>
      </React.Fragment>)
  }
  
  return (
    <div>
      <Plot fn={exprFn.fn} width={300} height={150} />
      {radios}
      <button onClick={addExpressionInput}>Add Expression</button>
      {inputs}
    </div>
  );
}

render(<App service={service} />, document.getElementById('root'));