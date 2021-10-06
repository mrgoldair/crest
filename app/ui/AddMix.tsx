import React from 'react';

type Props = {
  onClick:() => void
}

const AddMix = (props:Props) => {
  return  <button className="button" onClick={props.onClick}>
            <img className="button-icon" src="/assets/icon-mix.png" />
            MIX
          </button>
}

export { AddMix }