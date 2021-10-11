/**
 * ExprSelect is an element used for forumlating a description
 * of an Aggregate.
 * 
 * The description is represented by
 * 1) two ids chosen via the <select> elements bound to keys from state
 * 2) a choice of an operation provided by Op
 */

import React from "react";
import { Id, Op } from '../domain/Types.js';

type Props = {
  expressions:[ Id, Id ]
  slots: Id[]
  op:Op
  onChange:(expressions:[Id,Id], op:Op) => void
}

const Aggregate = ({ slots, expressions, op, onChange }:Props) => {

  let [ l,r ] = expressions;

  return <div className="aggregate-expr">

          <img className="aggregate-expr__icon" src="/assets/icon-mix.svg" />

          {/* provides a list of available expressions to choose from */}
          <select value={l} onChange={e => onChange([ Number(e.target.value), r ], op)}>
            {slots.map((slot:Id) => <option value={slot}  key={slot}>{slot}</option>)}
          </select>

          {/* provides a list of available expressions to choose from */}
          <select value={r} onChange={e => onChange([ l, Number(e.target.value) ], op)}>
            {slots.map((slot:Id) => <option value={slot} key={slot}>{slot}</option>)}
          </select>

          <select onChange={e => onChange( expressions, e.target.value as Op )}>
            {Object.entries(Op).map(([k,v]) => <option value={op} key={k}>{v}</option>)}
          </select>
        </div>
}

export { Aggregate };