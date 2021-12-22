import React, { useState } from "react";
import "../CSS/UserForm.css";

export default function UserForm({ setCurrentUserGuess, numberOfUserGuesses }) {
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
      setCurrentUserGuess(userGuess => formState);
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
        disabled={numberOfUserGuesses === 10}
      />
      <button type="submit">Submit</button>
    </form>
  )
}