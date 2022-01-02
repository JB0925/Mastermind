import React, { useState } from "react";
import { useGameContext } from "../useUpdateGame";
import { updateUserGuess } from "../actionCreators";
import "../CSS/UserForm.css";


// basic form for the user to submit guesses. Uses the dispatch from Context
// to update state for the parent App. Does some basic error handling too,
// without decrementing the user's guesses.
export default function UserForm() {
  const [{ numberOfUserGuesses, hasWon, currentUserGuess: currentUserGuessInState }, dispatch] = useGameContext();
  const ACCEPTABLE_ANSWER_LENGTH = 4;
  const digitsUsedInGame = "12345670".split("");
  const [newUserAnswer, setNewUserAnswer] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = evt => {
    const { value } = evt.target;
    setNewUserAnswer(newUserAnswer => value);
  };
  
  // ensuring that the user has entered digits from 0 - 7
  const userAnswerIsAllValidDigits = userGuess => {
    return userGuess.split("").every(character => digitsUsedInGame.includes(character));
  };
  
  // if the user has made an error, save an error message in state to display in the browser
  const handleErrorSetting = () => {
    const answerSameAsBefore = currentUserGuessInState === newUserAnswer;
    const answerTooShort = newUserAnswer.length < ACCEPTABLE_ANSWER_LENGTH;
    const answerTooLong = newUserAnswer.length > ACCEPTABLE_ANSWER_LENGTH;

    if (answerSameAsBefore) setErrorMessage("Error: you just guessed this!");
    else if (answerTooShort) setErrorMessage("Error: your answer is too short.");
    else if (answerTooLong) setErrorMessage("Error: your answer is too long.");
    else if (!userAnswerIsAllValidDigits(newUserAnswer)) setErrorMessage("Error: Enter digits from 0-7");
  };
  
  // check to make sure the user's guess is valid before setting it in state
  const acceptableUserGuess = () => {
    return newUserAnswer.length === ACCEPTABLE_ANSWER_LENGTH && 
      currentUserGuessInState !== newUserAnswer &&
      userAnswerIsAllValidDigits(newUserAnswer);
  };
  
  // if the user's answer is valid, update the state managed by the reducer
  // if not, update the internal errorMessage state, to be displayed in browser
  // either way, clear the user's answer from the input / reset "newUserAnswer"
  const handleSubmit = evt => {
    evt.preventDefault();
    if (acceptableUserGuess()) {
      dispatch(updateUserGuess(newUserAnswer));
      errorMessage.length && setErrorMessage("");
    } else {
        handleErrorSetting();
    }

    setNewUserAnswer(newUserAnswer => "");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="guess">Guess a Number From 0 - 7</label>
      <input 
        type="text"
        id="guess"
        name="guess"
        value={newUserAnswer}
        onChange={handleChange}
        placeholder="Enter an integer number, i.e. 7, 2"
        required
        disabled={numberOfUserGuesses === 0 || hasWon}
      />
      <button type="submit" disabled={numberOfUserGuesses === 0 || hasWon}>Submit</button>
      {errorMessage.length ? <p style={{color: "tomato"}}>{errorMessage}</p> : null}
    </form>
  );
};