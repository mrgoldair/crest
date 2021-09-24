import React from "react";
import { Id, Literal, Aggregate, Op, } from './domain.js';

const Literal = ({ value, onChange }) => {
  return <input type="text" value={value} onChange={onChange} />
}

type Props = {
  expressions:[ Id, Id ]
  slots: Id[]
  op:Op
  onChange:(op:Op, expressions:[Id,Id]) => void
}

const Aggregate = ({ slots, expressions, op, onChange }:Props) => {

  let [ l,r ] = expressions;

  return (
    <div>
      <select value={l} onChange={e => onChange(op,[ Number(e.target.value), r ])}>
        {slots.map((slot:Id) => <option value={slot}  key={slot}>{slot}</option>)}
      </select>;
      <select onChange={e => onChange( Number(e.target.value), expressions )}>
        {[...Object.entries(Op)].map(([k,v]) => <option value={op} key={k}>{v}</option>)}
      </select>;
      <select value={r} onChange={e => onChange(op,[ l, Number(e.target.value) ])}>
        {slots.map((slot:Id) => <option value={slot} key={slot}>{slot}</option>)}
      </select>;
    </div>);
}

export { Literal, Aggregate };