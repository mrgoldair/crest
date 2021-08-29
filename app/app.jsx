import React, { useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import { Crest } from 'crest-compiler';

const Canvas = (props) => {
  let canvasRef = useRef(null);
  let { width, height, draw } = props;
  let circleRadians = Math.PI * 4;
  let radiansPerPx = circleRadians / width;

  // Peg board background
  const plotBackground = ctx => {
    ctx.strokeStyle = "hsla(0,0%,0%,.2)";
    for (let x = 0; x < width; x = x + 10) {
      for (let y = 0; y < height; y = y + 10) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, 6.28);
        ctx.stroke();
      }
    }
  }

  const plotCurve = (ctx,offset = 0) => {
    ctx.strokeStyle = "hsla(0,0%,0%,.4)";
    for (let x = 0; x <= width; x = x + 10) {
      // draw is really yFn
      ctx.beginPath();
      let y = draw((x + (offset * 10)) * radiansPerPx);
      ctx.arc(x, (height/2) + y, 1, 0, 6.28);
      ctx.stroke();
    }
    return offset;
  }

  useEffect(() => {
    let canvas = canvasRef.current;
    let ctx = canvas.getContext('2d');
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    // Make our backing canvas double the density
    canvas.width = width = width * 2;
    canvas.height = height = height * 2;

    // Beginning time
    let elapsed = 0;
    // Milliseconds per frame
    let ms = 16;
    let offset = -1;
    let frameId;
    const render = (timestamp) => {
      frameId = requestAnimationFrame(render);
      // Have we crossed the threshold?
      if ((timestamp - elapsed) > ms) {
        // Reset our counter
        elapsed = timestamp;
        ctx.clearRect(0, 0, width, height);
        // Draw!
        plotBackground(ctx);
        offset = plotCurve(ctx,offset + 1);
      }
    }
    // Start our render loop
    render();

    return () => cancelAnimationFrame(frameId)

  },[draw]);

  return <canvas ref={canvasRef}/>
}

const App = () => {
  let [ input, setInput ] = useState("cos(x/3) * 15");
  let [ fn, setFn ] = useState(() => x => 1);

  const handleInputChange = ({target}) => {
    // Controlled input, so set our input text value
    setInput( target.value );
    // Compile our text expression to js
    let expression = Crest.compile( target.value );
    // A successfully compiled expression will be a string.
    // An expression such as "cos" returns a class object which we need to filter out;
    if( typeof expression !== "string" ) return;

    try {
      // Use our compiled expression to create a js function :: Int -> Int
      let fn = Function("x", `return ${expression};`);
      // Update our piece of state holding the function with this new function
      setFn(() => fn);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <Canvas draw={fn} width={300} height={150} />
      <input type="text" value={input} onChange={handleInputChange} />
    </div>
  );
}

render(<App/>, document.getElementById('root'));