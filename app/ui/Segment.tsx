import * as React from 'react';
import { Op } from '../domain/Types.js';

const Segment = (props) => {
  return  <div className="select-op">
            { Object.entries(Op).map(([k,v]) => {
                return <input type="radio" value={v} id={v} className="select-op__op" key={k}
                              name="op" onChange={e => props.onChange( e.target.value as Op )} checked={props.selected === v} /> })}
          </div>
}

export { Segment }