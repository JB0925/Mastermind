import React, { useLayoutEffect, useRef } from "react";
import "../CSS/NumberCard.css";

// The card that displays the gameNumbers at the end of the game.
// fades in to show card values if either a). the user has won
// or b). the game is over because the user ran out of guesses.
function NumberCard({ number, isKnown }) {
  const numberRef = useRef();

  useLayoutEffect(() => {
    if (isKnown) {
      setTimeout(() => {
        numberRef.current.style.opacity = "1";
        numberRef.current.style.transition ="opacity 2000ms"
      },100)
    };
  }, [isKnown])

  const showNumber = () => {
    if (!isKnown) return <h1 data-testid="number" className="hide">{number}</h1>;
    return <h1 data-testid="number" className="hide" ref={numberRef}>{number}</h1>;
  };

  return (
    <div className="NumberCard">
        {showNumber()}
    </div>
  );
};

// The card doesn't need to constantly re-render because its props only change
// when the game is over, so we wrap it in a call to React.memo.
export default React.memo(NumberCard);