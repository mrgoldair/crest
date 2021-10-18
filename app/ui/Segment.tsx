import React, { useState } from 'react';
import { Op } from '../domain/Types.js';

import { motion } from 'framer-motion';

type Props = {
  onChange:(op:Op) => void
  class: string
}

const Segment = (props:Props) => {

  let [ selected, setSelected ] = useState(null);

  let variants = {
    selected: { scaleY: 1, opacity: 1 },
    unselected: { scaleY: 0, opacity: 0 }
  }

  const handleSelected = (value:Op) => {
    // Send change event back to root state
    props.onChange( value );
    // Alos, handle change event locally
    setSelected( value );
  }

  return  <div className={`segment ${props.class}`}>
            { Object.entries(Op).map(([k,v]) => {
                return  <div className="segment-option" key={k} onClick={_ => handleSelected(v)}>
                          <div className="segment-label">{k}</div>
                          <motion.div className="segment-option-signifier"
                                      initial="unselected"
                                      animate={ selected === v ? "selected" : "unselected" }
                                      variants={variants}>
                          </motion.div>
                        </div> })
            }
          </div>
}

export { Segment }