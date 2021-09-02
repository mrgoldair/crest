import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { Crest as compiler } from 'crest-compiler';
import Service from './Service.js';
import Plot from './Plot.js'

let service = new Service(compiler);

/**
 * UI for expressions input
*/
const Expression = () => {}

/**
 * Composition root
 */
const App = () => {
  // The source expression strings for our wave(s)
  // type Desc = { [index:number]:{}}
  let [ expressions, setExpressions ] = useState({1:{source:"1 + 1"},3:{source:"12"}});
  let [ exprFns, setExprFns ] = useState([]);

  const handleInputChange = ({target},idx) => {
    setExpressions({
      ...expressions,
      [idx]:{source:target.value}
    });
    console.log("Expression #%s has value %s", idx, target.value);
  }

  useEffect(() => {
    let fns = [];
    for(const prop in expressions){
      fns.push(expressions[prop].source)
    }
    setExprFns(service._compile(fns));
  }, [expressions])
  
  let inputs = [];
  for(const prop in expressions) { 
    inputs.push(<input key={prop} value={expressions[prop].source} onChange={e => handleInputChange(e,prop)} />);
  }

  return (
    <div>
      <Plot expressions={exprFns} width={300} height={150} />
      {inputs}
    </div>
  );
}

render(<App/>, document.getElementById('root'));