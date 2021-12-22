import React, { useLayoutEffect, useRef } from "react";
import "../CSS/NumberCard.css";

export default function NumberCard({ number, isKnown }) {
  const numberRef = useRef();

  useLayoutEffect(() => {
    if (isKnown) {
      setTimeout(() => {
        numberRef.current.style.opacity = "1";
        numberRef.current.style.transition ="opacity 2000ms"
      },100)
    }
  }, [isKnown])

  const showNumber = () => {
    if (!isKnown) return <h1 className="hide">{number}</h1>;
    return <h1 className="hide" ref={numberRef}>{number}</h1>;
  };

  return (
    <div className="NumberCard">
        {showNumber()}
    </div>
  );
};