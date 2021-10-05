import React from "react";
import { Id, Slot } from './Types.js';

type Props = {
  id:Id
  children: JSX.Element[] | JSX.Element
}

const Slot = (props:Props) => {
  return <div className="slot" key={props.id}>
            <label htmlFor="">SLOT_{props.id}</label>
            {props.children}
         </div>;
}

export { Slot };