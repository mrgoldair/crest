import React, { useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import { Crest } from 'crest-compiler';

const Canvas = (props) => {
  let canvasRef = useRef(null);
  let { width, height, draw } = props;

  useEffect(() => {
    let canvas = canvasRef.current;
    let ctx = canvas.getContext('2d');
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    // Make our backing canvas double the density
    canvas.width = width = width * 2;
    canvas.height = height = height * 2;

    ctx.beginPath();
    ctx.moveTo(0,height/2);
    ctx.lineTo(width,height/2);
    ctx.closePath();
    ctx.stroke();

    if( draw )
      for (let x = 0; x < width; x++) {
        let y = draw(x)
        ctx.arc(x,y,0,6.28);
      }

  },[canvasRef]);

  return <canvas ref={canvasRef}/>
}

const App = () => {
  let [ input, setInput ] = useState("");
  let [ fn, setFn ] = useState(() => {});

  const handleInputChange = (e) => {
    let el = e.target;
    setInput( el.value );
    //console.log(input);
    // parse
    let js = Crest.compile( el.value );
    // create fn
    //console.log("js: %s", js);
    if( typeof js !== "string" ) return;

    try {
      let fn = Function("x", `return ${js};`)
      console.log("fn: %s", fn(0));
    } catch (error) {
      console.error(error);
    }
    setFn(() => fn);
  }

  return (
  <div>
    <Canvas draw={fn} width={300} height={150} />
    <input type="text" value={input} onChange={handleInputChange} />
  </div>);
}

render(<App/>, document.getElementById('root'));