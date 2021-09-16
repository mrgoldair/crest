import React from "react";
import { ReactDOM } from "react";

// import { Id, Op } from './domain.ts';

const Literal = ({value,onChange}) => {
  return <input type="text" value={value} onChange={onChange} />
}

const Merge = ({operands:Id[], op:Op}) => {
  return
    <div className="">
      <select>
        {operands.map(x => <option value={x}>x</option>)}
      </select>;
      <select>
        {operands.map(x => <option value={x}>x</option>)}
      </select>;
      <select>
        {op.map(x => <option value={x}>x</option>)}
      </select>;
    </div>
}

export { Literal, Merge };