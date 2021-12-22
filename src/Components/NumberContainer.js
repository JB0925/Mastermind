import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/NumberContainer.css";
import NumberCard from "./NumberCard";
import UserForm from "./UserForm";

export default function NumberContainer() {
  const BASE_URL = "https://www.random.org/integers/";
  const params = {
    num: 4, min: 0, max: 7,
    col: 1, base: 10, format: "plain",
    rnd: "new"
  }
  
  const [gameNumbers, setGameNumbers] = useState("");
  const [numberOfUserGuesses, setNumberOfUserGuesses] = useState(0);
  const [currentUserGuess, setCurrentUserGuess] = useState("");
  // four placeholders, used to create an index
  const [userFinalAnswer, setUserFinalAnswer] = useState("____");
    
  const createArrayOfNumbers = numbers => numbers.split("\n").filter(num => num !== "");
  const userGuessInFinalNumber = (number, index) => {
    return userFinalAnswer.indexOf(number) !== -1 && userFinalAnswer[index] === number;
  };

  useEffect(() => {
    axios.get(BASE_URL, {params})
    .then(response => setGameNumbers(gameNumbers => createArrayOfNumbers(response.data)))
    .catch(err => console.log(err));
  },[]);

  useEffect(() => {
    setNumberOfUserGuesses(numberOfUserGuesses => numberOfUserGuesses + 1);

    const updateUserFinalAnswer = userFinalAnswer => {
      if(!gameNumbers) return;

      let updatedUserFinalAnswer = userFinalAnswer.split("");

      for (let i = 0; i < gameNumbers.length; i++) {
        if (currentUserGuess[i] === gameNumbers[i]) {
          updatedUserFinalAnswer[i] = currentUserGuess[i];
        }
      }

      setUserFinalAnswer(userFinalAnswer => updatedUserFinalAnswer.join(""));
    }

    updateUserFinalAnswer(userFinalAnswer);

  },[currentUserGuess]);

  
  const createGameNumberCards = () => {
    if(!gameNumbers) return;
    return gameNumbers.map(
        (number, index) => <NumberCard 
                    number={number} 
                    isKnown={userGuessInFinalNumber(number, index)} 
                    key={number}
                  />
    )
  }

  return (
    <div className="NumberContainer">
      {createGameNumberCards()}
      <UserForm setCurrentUserGuess={setCurrentUserGuess} numberOfUserGuesses={numberOfUserGuesses} />
    </div>
  );

};