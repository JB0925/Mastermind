import React, { useState } from "react";
import { useGameContext } from "../useUpdateGame";
import "../CSS/UserForm.css";


// basic form for the user to submit guesses. Uses the dispatch from Context
// to update state for the parent App. Does some basic error handling too,
// without decrementing the user's guesses.
export default function UserForm() {
  const [{ numberOfUserGuesses, hasWon, currentUserGuess }, dispatch] = useGameContext();
  const ANSWER_LENGTH = 4;
  const digitsUsedInGame = "12345670".split("");
  const [formState, setFormState] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = evt => {
    const { value } = evt.target;
    setFormState(formState => value);
  };

  const userAnswerIsAllDigits = userGuess => {
    return userGuess.split("").every(character => digitsUsedInGame.includes(character));
  };

  const handleErrorSetting = () => {
    const answerSameAsBefore = currentUserGuess === formState;
    const answerTooShort = formState.length < ANSWER_LENGTH;
    const answerTooLong = formState.length > ANSWER_LENGTH;

    if (answerSameAsBefore) setErrorMessage("Error: you just guessed this!");
    else if (answerTooShort) setErrorMessage("Error: your answer is too short.");
    else if (answerTooLong) setErrorMessage("Error: your answer is too long.");
    else if (!userAnswerIsAllDigits(formState)) setErrorMessage("Error: Enter digits from 0-7");
  };

  const acceptableUserGuess = () => {
    return formState.length === ANSWER_LENGTH && 
      currentUserGuess !== formState &&
      userAnswerIsAllDigits(formState);
  };

  const handleSubmit = evt => {
    evt.preventDefault();
    if (acceptableUserGuess()) {
      dispatch({ type: "update current user guess", payload: formState });
      setErrorMessage("");
    } else {
        handleErrorSetting();
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
      {errorMessage.length ? <p style={{color: "tomato"}}>{errorMessage}</p> : null}
    </form>
  );
};