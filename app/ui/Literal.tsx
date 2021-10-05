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
  return <input type="text" value={value} onChange={e => onChange(e.target.value)} />
}

export { Literal };