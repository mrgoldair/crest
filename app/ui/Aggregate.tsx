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
import { Select } from "./Select.jsx";

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

          <div className="aggregate-expr__label-expr"></div>
          <div style={{"display":"flex", "justifyContent":"space-between"}}>
            <Select options={slots} selected={l} onChange={() => 2} direction="left" />
            <Select options={slots} selected={r} onChange={() => 2} direction="right" />
          </div>
          
          <div className="aggregate-expr__label-op"></div>
          <Segment class="aggregate-expr__select-op" onChange={onChangeOp}></Segment>
        </div>
}

export { Aggregate };