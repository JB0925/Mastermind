import React, { useState } from "react";
import { useGameContext } from "../useUpdateGame";
import "../CSS/UserForm.css";


// basic form for the user to submit guesses. Uses the dispatch from Context
// to update state for the parent App.
export default function UserForm() {
  const [{ numberOfUserGuesses, hasWon }, dispatch] = useGameContext();
  const ANSWER_LENGTH = 4;
  const [formState, setFormState] = useState("");

  const handleChange = evt => {
    const { value } = evt.target;
    setFormState(formState => value);
  };

  const acceptableUserGuess = guess => guess.length === ANSWER_LENGTH;

  const handleSubmit = evt => {
    evt.preventDefault();
    if (acceptableUserGuess(formState)) {
      dispatch({ type: "update current user guess", payload: formState });
    }

    setFormState(formState => "");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="guess">Guess a Number From 0 - 7</label>
      <input 
        type="text"
        id="guess"
        name="guess"
        value={formState}
        onChange={handleChange}
        placeholder="Enter an integer number, i.e. 7, 2"
        required
        disabled={numberOfUserGuesses === 0 || hasWon}
      />
      <button type="submit">Submit</button>
    </form>
  )
}