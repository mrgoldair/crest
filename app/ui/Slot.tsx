import React from "react";
import { Id, Slot } from './Types.js';

type Props = {
  id:Id
  children: JSX.Element[] | JSX.Element
}

const Slot = (props:Props) => {
  return <div className="slot" key={props.id}>
            <label className="slot-label" htmlFor="">SLOT_0{props.id}</label>
            <div className="slot-layout">
              {props.children}
            </div>
         </div>;
}

export { Slot };