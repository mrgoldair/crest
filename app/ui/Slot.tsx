import React from "react";
import { Id, Slot } from './Types.js';

import { motion } from 'framer-motion';

type Props = {
  id:Id
  children: JSX.Element[] | JSX.Element
  remove?: () => void
}

const variants = {
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: 10 }
}

const Slot = (props:Props) => {
  return <motion.div className="slot"
                     key={props.id}>
            <motion.div className="slot-layout"
                        initial="hidden"
                        animate="visible"
                        variants={variants}>
              {props.children}
            </motion.div>
            { props.remove ?
                <motion.div className="slot-remove" initial="hidden"
                animate="visible" variants={variants} onClick={props.remove}></motion.div>
                : null }
         </motion.div>;
}

export { Slot };