import * as React from 'react';
import { Op } from '../domain/Types.js';

const Segment = (props) => {
  return  <div className="segment">
            { Object.entries(Op).map(([k,v]) => {
                return  <div className="segment-option">
                          <input type="radio" value={v} id={v} className="segment-backinginput" key={k}
                              name="op" onChange={e => props.onChange( e.target.value as Op )} checked={props.selected === v} />
                          <div className="segment-label">{k}</div>
                        </div>})
            }
          </div>
}

export { Segment }