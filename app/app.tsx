import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import Crest from 'crest-compiler';

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

    ctx.fillStyle = "#324556";
    ctx.fillRect(0,0,width,height);

    draw(ctx,width,height);
  },[canvasRef]);

  return <canvas ref={canvasRef}/>
}

const fn = (ctx,w,h) => {
  ctx.strokeStyle = "#213445";
  ctx.beginPath();
  ctx.moveTo(0,h/2);
  ctx.lineTo(w,h/2);
  ctx.closePath();
  ctx.stroke();
}

const App = () => {
  return (
  <div>
    <Canvas draw={fn} width={300} height={150} />
    <input type="text" name="" id="" />
  </div>);
}

ReactDOM.render(<App/>, document.getElementById('root'));