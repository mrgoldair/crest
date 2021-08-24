import React, { useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import { Crest } from 'crest-compiler';

const Canvas = (props) => {
  let canvasRef = useRef(null);
  let { width, height, draw } = props;
  let circleRadians = Math.PI * 2;

  useEffect(() => {
    let canvas = canvasRef.current;
    let ctx = canvas.getContext('2d');
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    // Make our backing canvas double the density
    canvas.width = width = width * 2;
    canvas.height = height = height * 2;

    ctx.clearRect(0, 0, width, height);

    let radiansPerPx = circleRadians / width;

    // Peg board background
    ctx.strokeStyle = "hsla(0,0%,0%,.2)";
    for (let x = 0; x < width; x = x + 10) {
      for (let y = 0; y < height; y = y + 10) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, 6.28);
        ctx.stroke();
      }
    }

    ctx.strokeStyle = "hsla(0,0%,0%,.4)";
    for (let x = 0; x < width; x = x + 10) {
      let y = draw(x * radiansPerPx);
      ctx.beginPath();
      ctx.arc(x, (height/2) + y, 1, 0, 6.28);
      ctx.stroke();
    }

  },[canvasRef, draw]);

  return <canvas ref={canvasRef}/>
}

const App = () => {
  let [ input, setInput ] = useState("cos(x * 6) * 10");
  let [ fn, setFn ] = useState(() => x => 1);

  const handleInputChange = ({target}) => {

    setInput( target.value );

    let js = Crest.compile( target.value );

    if( typeof js !== "string" ) return;

    try {
      let fn = Function("x", `return ${js};`)
      setFn(() => fn);
    } catch (error) {
      console.error(error);
    }
  }

  return (
  <div>
    <Canvas draw={fn} width={300} height={150} />
    <input type="text" value={input} onChange={handleInputChange} />
  </div>);
}

render(<App/>, document.getElementById('root'));