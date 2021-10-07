/**
 * ExprInput is a wrapper around <input />
 * 
 * It expects a function, onChange, to accept a string
 */

import React from "react";
import { Literal } from '../domain/Types.js';

type Props = {
  value:string
  onChange:(expr:string) => void
}

const Literal = ({ value, onChange }:Props) => {
  return <div className="input-expr">
          <img className="input-expr__icon" src="/assets/icon-expr.svg" />
          <input className="input-expr__control" type="text" value={value} onChange={e => onChange(e.target.value)} />
         </div>
}

export { Literal };