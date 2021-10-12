/**
 * This is more a grouping than an abstraction; the multitude of
 * props that were being used before are all passed through here.
 * It really just makes Slots cleaner by not having the three
 * controls exploded all over the place. Though I guess it abstracts
 * in the sense that it acts as a single control (comprised of three)
 * to affect the state for an 'aggregate' expression. 
 * 
 * The description is represented by
 * 1) two ids chosen via the <select> elements bound to keys from state
 * 2) a choice of an operation provided by Op
 */

import React from "react";
import { Id, Op } from '../domain/Types.js';
import { Segment } from './Segment';

type Props = {
  expressions:[ Id, Id ]
  slots: Id[]
  op:Op
  onChangeExpr: (expressions:[Id,Id]) => void
  onChangeOp: (op:Op) => void
}

const Aggregate = ({ slots, expressions, op, onChangeExpr, onChangeOp }:Props) => {

  let [ l,r ] = expressions;

  return <div className="aggregate-expr">

          <img className="aggregate-expr__icon" src="/assets/icon-mix.svg" />

          {/* provides a list of available expressions to choose from */}
          <select value={l} onChange={e => onChangeExpr([ Number(e.target.value), r ])}>
            { slots.map((slot:Id) => <option value={slot}  key={slot}>{slot}</option>) }
          </select>

          {/* provides a list of available expressions to choose from */}
          <select value={r} onChange={e => onChangeExpr([ l, Number(e.target.value) ])}>
            { slots.map((slot:Id) => <option value={slot} key={slot}>{slot}</option>) }
          </select>

          {/* SelectOp / OpSelect / Segment */}
          <Segment selected={op} onChange={onChangeOp}></Segment>

        </div>
}

export { Aggregate };