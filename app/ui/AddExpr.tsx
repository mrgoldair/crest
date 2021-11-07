import React from 'react'

type Props = {
  onClick:() => void
}

const AddExpr = (props:Props) => {
  return  <button className="button" onClick={props.onClick}>
            <img className="button-icon" src="/assets/icon-expr.png" />
          </button>
}

export { AddExpr }