import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { Crest as compiler } from 'crest-compiler';
import * as Service from './service.js';
import { Plot } from './plot.jsx'

// Configure the application service with a compiler and pass to App
let service = new Service.Service(compiler);

let id = (function* indexGenerator() {
  for (let index = 0; index < 15; index++) {
    yield index;
  }
  return 16;
})()

/**
 * Composition root
 */
const App = ({service}) => {
  // Desc of a wave
  let [ desc, setDesc ] = useState<Service.Desc>(new Map<Service.Id,Service.Descriptor>());
  // `exprFn` is the resulting function compiled from our `desc` expressions
  let [ exprFn, setExprFn ] = useState({fn:(x:number) => [0]});

  //----------------------
  //--- Event handlers ---
  //----------------------
  const handleCombinerChange = (id:Service.Id,combiner:number) => {
    let a:Path = {
      ...desc.get(id) as Path,
      op:combiner
    }

    setDesc(new Map([
      ...desc,
      [ id, a ]
    ]))
  }

  const addCombinator = (combinator:Service.Op) => {

    if (desc.size < 2)
      return

    let {value} = id.next();
    let p:Service.Path = {
      kind: "path",
      value: [ 0,0 ]
              .concat([...desc.keys()])
              .slice(-2) as [ Service.Id, Service.Id ],
      op: combinator,
    }

    setDesc(new Map([
      ...desc,
      [ value,p ]
    ]))
  }

  const handleInputChange = ({value},idx:number) => {
    setDesc(new Map([
      ...desc,
      [ idx, { kind:"expression", value:value } ]
    ]));
  }

  const addExpressionInput = (val="") => {
    // Get our next index
    let { value, done } = id.next()
    // While we're not done (we have indices remaining), create the expression
    if (!done)
      setDesc(new Map([
        ...desc,
        [ value, { kind:"expression", value:val } ]
      ]))
  }

  //-------------
  //--- Setup ---
  //-------------
  useEffect(() => {
    addExpressionInput("cos(x)");
  },[])

  // Build our `Desc` to send to the compiler
  useEffect(() => {
    // This is all for getting UI.Desc -> Service.Desc form as the service
    // doesn't care about our expression indices, it just wants to compile the
    // expressions and then combine them.
    let fn = service.create(desc) as Service.IWaveFn;
    setExprFn({fn:fn});
  }, [desc])

  let inputs = [];
  for (let [ k, v ] of desc.entries()) {
    inputs.push(<input key={k} value={v.value.toString()} onChange={e => handleInputChange(e.target,Number(k)) } />);
  }
  
  let radios = []
  for (let k in Service.Op){
    if(Number.isNaN(Number(k)))
      radios.push(
      <React.Fragment key={k}>
        <input type="radio" id={Service.Op[k]} value={k} name="combiner" onClick={e => handleCombinerChange(Number(k), Number(k))} ></input>
        <label htmlFor={Service.Op[k]}>{k}</label>
      </React.Fragment>)
  }
  
  return (
    <div>
      <Plot fn={exprFn.fn} width={300} height={150} />
      <div style={{display:'flex', alignItems:'center'}}>
        {inputs}
        <div className="">
          <button onClick={e => addCombinator(Service.Op.Max)}>Combine</button>
          <button onClick={e => addExpressionInput()}>Add Expression</button>
        </div>
      </div>
    </div>
  );
}

render(<App service={service} />, document.getElementById('root'));