/**
 * Instead of simply "Plot", perhaps this is more a Line Plotter;
 * it provides a series of x values that are adjacent between a certain
 * distance. Taking a function, `fn`(or maybe `using`,`yFunc`,`callback`) which
 * it uses to plot the y values for every x??
 */
 

import React, { useRef, useEffect } from 'react';
import { IWaveFn } from './service';

interface IPlot {
  fn:IWaveFn
  width:number,
  height:number,
}

/**
 * Should Canvas plot curves knowingly as in `plotCurve` which 
 * knows to traverse the x-dim and call a func to generate a y value?
 * Or would it be better to provide a func that Canvas knows how to call
 * with a context?
 * @param props
 */
const Plot = (props:IPlot)=> {
  let canvasRef = useRef(null);
  let { width, height, fn } = props;
  let radiansPerPx = (Math.PI * 4) / width;

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

  // At the moment we're complecting traversal and row/col layout
  const plotCurve = (ctx, offset = 0) => {
    ctx.strokeStyle = "hsla(0,0%,0%,.8)";
    for (let x = 0; x <= width; x = x + 10) {
      // Produce a y val for each expression -> [ y, y, y ]
      let ys = fn((x + (offset * 10)) * radiansPerPx);
      // Push this up to the calling code ---v
      ys.map(y => {
        ctx.beginPath();
        ctx.arc(x, (height/2) + y, 1, 0, 6.28);
        ctx.stroke();
      });
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
    let ms = 33;
    let offset = -1;
    let frameId;
    const render = (timestamp=0) => {
      frameId = requestAnimationFrame(render);
      // Have we crossed the threshold?
      if ((timestamp - elapsed) > ms) {
        // Reset our counter
        elapsed = timestamp;
        ctx.clearRect(0, 0, width, height);
        // Draw!
        plotBackground(ctx);
        offset = plotCurve(ctx, offset + 1);
      }
    }
    // Start our render loop
    render();

    return () => cancelAnimationFrame(frameId)

  },[fn]);

  return <canvas ref={canvasRef}/>
}

export { Plot, IPlot };