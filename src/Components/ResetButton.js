import React, { useRef, useState } from "react";
import "../CSS/ResetButton.css";
import { useGameContext } from "../useUpdateGame";
import { resetGame } from "../actionCreators";

export default function ResetButton() {
  const hiddenDivRef = useRef();
  const [{ numberOfUserGuesses, hasWon }, dispatch] = useGameContext();
  const [timeoutId, resetTimeoutId] = useState(null);

  const handleClick = () => {
    dispatch(resetGame());
  };
  
  // For the next two functions, we take advantage of setTimeout
  // to fade in and out a div that displays a message. We make sure
  // we clear the timeouts by keeping track of the setTimeout ID 
  // by setting it as a piece of state. If I was taking this further,
  // I might use something like gsap for this.
  const handleMouseOver = () => {
    timeoutId && clearInterval(timeoutId);

    hiddenDivRef.current.style.display = "block";

    const timerId = setTimeout(() => {
      hiddenDivRef.current.style.opacity = "1";
      hiddenDivRef.current.style.transition = "opacity 800ms";
    },100);

    resetTimeoutId(timerId);
  };

  const handleMouseOut = () => {
    clearInterval(timeoutId);

    const timerId = setTimeout(() => {
      hiddenDivRef.current.style.opacity = "0";
      hiddenDivRef.current.style.transition = "opacity 800ms";
    },100);

    resetTimeoutId(timerId);
  };

  const hiddenDivMessage = !numberOfUserGuesses || hasWon ? "Play again?" :
    "Are you sure? You will lose all progress.";

  return (
    <div className="reset-holder">
      <button 
        className="reset-button" 
        type="reset" 
        onClick={handleClick}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        data-testid="resetButton"
      >
        Reset
      </button>
      <div 
        className="reset-message"
        ref={hiddenDivRef}
      >
        {hiddenDivMessage}
      </div>
    </div>
  );
};