/**
 * Instead of simply "Plot", perhaps this is more a Line Plotter;
 * it provides a series of x values that are adjacent between a certain
 * distance. Taking a function, `fn`(or maybe `using`,`yFunc`,`callback`) which
 * it uses to plot the y values for every x??
 */
 

import React, { useRef, useEffect } from 'react';
import { IWaveFn } from '../Service';

type Specified = {
  width:number
  height:number
}

type Dimension = Specified | "auto";

interface IPlot {
  fn:IWaveFn
  dimensions: Dimension
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
  let { dimensions, fn } = props;
  let radiansPerPx;
  let width;
  let height;

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

  const circlePlot = (ctx) => {
    let radius = 500;
    let centerX = width / 2;
    let centerY = height / 2;

    let steps = 500;
    let radPerStep = (2 * Math.PI) / steps;
    let radPerCycleStep = (2 * Math.PI) / steps * 30;
    let cycleRadians = 0;
  
    for (let x = 0; x <= (2 * Math.PI); x += radPerStep){

      let rs = fn(cycleRadians);

      rs.map(r => {
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.arc(centerX + (Math.cos(x) * (radius + r)),
                centerY + (Math.sin(x) * (radius + r)),
                1, 0, 6.28)
        ctx.stroke();

        cycleRadians += radPerCycleStep;
      })

    }
  }

  // Line Plot
  const plotCurve = (ctx, offset = 0) => {
    for (let x = 0; x <= width; x = x + 40) {
      // Produce a y val for each expression -> [ y, y, y ]
      let ys = fn((x + (offset * 40)) * radiansPerPx);
      // Push this up to the calling code ---v
      ys.map((y,i,xs) => {
        ctx.beginPath();
        ctx.strokeStyle = `hsla(0, 0%, 100%, ${(i + 1) / xs.length - (1 - ((i + 1) / xs.length)) + .3})`; 
        ctx.arc(x, (height/2) + y, 1, 0, 6.28);
        ctx.stroke();
      });
    }
    return offset;
  }

  useEffect(() => {
    let canvas = canvasRef.current;
    let ctx = canvas.getContext('2d');

    switch (dimensions){
      case "auto":
        let rect = canvas.getBoundingClientRect();
        canvas.style.width = Math.floor(rect.width);
        canvas.style.height = Math.floor(rect.height);
        canvas.width = width = Math.floor(rect.width) * 2;
        canvas.height = height = Math.floor(rect.height) * 2;
        break;
      default:
        canvas.style.width = dimensions.width;
        canvas.style.height = dimensions.height;
        canvas.width = width = dimensions.width * 2;
        canvas.height = height = dimensions.height * 2;
        break;
    }
    
    radiansPerPx = Math.PI * 4 / width;

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
        offset = plotCurve(ctx, offset + 1);
      }
    }
    // Start our render loop
    render();

    return () => cancelAnimationFrame(frameId)

  },[fn]);

  return <canvas id="plot" ref={canvasRef}/>
}

export { Plot, IPlot };