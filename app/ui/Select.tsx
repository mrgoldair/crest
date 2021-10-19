import React, { useState } from 'react'
import type { Id } from './Types';

import caret from './'

type Props = {
  options: Array<Id>
  selected: Id
  onChange: (selected:Id) => void
}

const Select = (props:Props) => {

  let [ open, setOpen ] = useState(false);
  let [ selected, setSelected ] = useState(props.selected || props.options[0]);

  const handleOptionSelect = selected => {
    // Let those subscribed know the selected option has changed
    props.onChange(selected);
    // Update our internal state
    setSelected(selected);
  }

  return <div className="select" onClick={_ => setOpen(open => !open)}>
            <div className="select-container">
              <div className="select-selected">
                {`0${selected}`}
                <div className="select-caret">
                  <svg width="16px" height="5px" viewBox="0 0 16 5" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <g id="Re" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="square">
                        <g id="Group-11" transform="translate(-1.000000, -18.000000)" stroke="#000000" stroke-width="2">
                            <polyline id="Line-4" points="2.5 19.5 9 21.5 15.5 19.5"></polyline>
                        </g>
                      </g>
                  </svg>
                </div>
              </div>
              <div className="select-option-list" style={open ? {"display":"block"} : {"display":"none"}}>
                { 
                  props.options.map(slotId => {
                    return <div key={slotId} className="select-option" onClick={() => handleOptionSelect(slotId)}>{`0${slotId}`}</div>
                  })
                }
              </div>
            </div>
         </div>
}

// Potentially pull option wire-up into private component
const Option = () => {}

export { Select };