import React, { useRef } from "react";
import "../CSS/ResetButton.css";
import { useGameContext } from "../useUpdateGame";
import { resetGame } from "../actionCreators";

export default function ResetButton() {
  const hiddenDivRef = useRef();
  const [{ numberOfUserGuesses, hasWon }, dispatch] = useGameContext();

  const handleClick = () => {
    dispatch(resetGame());
  };

  const handleMouseOver = () => {
    hiddenDivRef.current.style.display = "block";
    setTimeout(() => {
      hiddenDivRef.current.style.opacity = "1";
      hiddenDivRef.current.style.transition = "opacity 800ms";
    },100);
  };

  const handleMouseOut = () => {
    setTimeout(() => {
      hiddenDivRef.current.style.opacity = "0";
      hiddenDivRef.current.style.transition = "opacity 800ms";
    },100);
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