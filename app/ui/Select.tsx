import React, { useState } from 'react'
import { motion } from 'framer-motion';

import type { Id } from './Types';

type Props = {
  options: Array<Id>
  selected: Id
  onChange: (selected:Id) => void
  direction: "right" | "left"
}

const list = {
  open: { 
    opacity: 1,
    display: "flex",
    transition: {
      staggerChildren: 0.05
    }
  },
  closed: { 
    opacity: 0,
    display: "none"
  }
}

const item = {
  open: {
    opacity: 1, x: 0,
    transition: {
      ease: "circOut"
    }
  },
  closed: {
    opacity: 0, x: "-100%"
  }
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
                <div className="select-selected-value">{`0${selected}`}</div>
                {/*<div className="select-caret">
                  <svg width="16px" height="5px" viewBox="0 0 16 5" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <g stroke="inherit" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="square">
                        <g transform="translate(-1.000000, -18.000000)" stroke="inherit" stroke-width="2">
                            <polyline id="Line-4" points="2.5 19.5 9 21.5 15.5 19.5"></polyline>
                        </g>
                      </g>
                  </svg>
                </div>*/}
              </div>
              <motion.div className={`select-option-list ${props.direction}`} variants={list} animate={open ? "open" : "closed"}>
                { props.options
                    .filter(o => o !== selected)
                    .map(slotId => {
                      return <motion.div key={slotId}
                                         className="select-option"
                                         onClick={() => handleOptionSelect(slotId)}
                                         variants={item}>{`0${slotId}`}</motion.div>
                  }) }
              </motion.div>
            </div>
         </div>
}

// Potentially pull option wire-up into private component
const Option = () => {}

export { Select };