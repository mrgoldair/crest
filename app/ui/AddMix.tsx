import React from 'react';

type Props = {
  onClick:() => void
}

const AddMix = (props:Props) => {
  return  <button className="button" onClick={props.onClick}>
            <img className="button-icon-trash" src="/assets/icon-mix.png" />
          </button>
}

export { AddMix }