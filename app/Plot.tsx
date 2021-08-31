import React, { useRef, useEffect } from 'react';

/**
 * Should Canvas plot curves knowingly as in `plotCurve` which 
 * knows to traverse the x-dim and call a func to generate a y value?
 * Or would it be better to provide a func that Canvas knows how to call
 * with a context?
 * @param props
 */
const Plot = (props) => {
  let canvasRef = useRef(null);
  let { width, height, expressions } = props;
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

  // At the moment we're complecting traversal and row/col layout
  const plotCurve = (ctx, offset = 0) => {
    ctx.strokeStyle = "hsla(0,0%,0%,.4)";
    for (let x = 0; x <= width; x = x + 10) {
      // Produce a y val for each expression -> [ y, y, y ]
      let y = expressions.map(exprFn => exprFn((x + (offset * 10)) * radiansPerPx))
      // Push this up to the calling code ---v
      y.map(y => {
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
    let ms = 16;
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

  },[expressions]);

  return <canvas ref={canvasRef}/>
}

export default Plot;