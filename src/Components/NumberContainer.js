import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/NumberContainer.css";
import NumberCard from "./NumberCard";
import UserForm from "./UserForm";
import GameMessage from "./GameMessages";

export default function NumberContainer() {
  const BASE_URL = "https://www.random.org/integers/";
  const params = {
    num: 4, min: 0, max: 7,
    col: 1, base: 10, format: "plain",
    rnd: "new"
  }
  
  const [gameNumbers, setGameNumbers] = useState("");
  const [numberOfUserGuesses, setNumberOfUserGuesses] = useState(10);
  const [currentUserGuess, setCurrentUserGuess] = useState("");
  // four placeholders, used to create an index
  const [userFinalAnswer, setUserFinalAnswer] = useState("____");
  const [message, setMessage] = useState("Waiting for your first guess...");
  const [hasWon, setHasWon] = useState(false);
    
  const createArrayFromNumbers = numbers => numbers.split("\n").filter(num => num !== "");

  const createGameNumbersCounter = () => {
    let gameNumberCounter = {};

    for (let number of gameNumbers) {
      let objectKeys = Object.keys(gameNumberCounter);
      if (objectKeys.indexOf(number) === -1) {
        gameNumberCounter[number] = 1
      } else {
        gameNumberCounter[number]++;
      };
    };

    return gameNumberCounter;
  };
  
  const setUserFeedback = () => {
    if (numberOfUserGuesses === 1) {
        setMessage(message => "Sorry, you've run out of guesses!");
        return;
    };

    let numberOfDigitsInGameNumbers = 0;
    let numberOfDigitsInCorrectPlace = 0;
    let gameNumberCounter = createGameNumbersCounter();

    for (let i = 0; i < gameNumbers.length; i++) {
      let currentValue = currentUserGuess[i];

      if (gameNumbers.includes(currentValue)) {
        if (gameNumberCounter[currentValue] !== 0) {
          numberOfDigitsInGameNumbers++
          gameNumberCounter[currentValue]--;
        }
      }

      if (currentValue === gameNumbers[i]) {
        numberOfDigitsInCorrectPlace++;
      }
    }

    if (numberOfDigitsInCorrectPlace === 4) {
      setHasWon(true);
      setMessage(message => "You won!!!");
      return;
    }
    setMessage(message => `${numberOfDigitsInGameNumbers} of your numbers are in our number
             and ${numberOfDigitsInCorrectPlace} are in the right place.`)
  }
  

  useEffect(() => {
    axios.get(BASE_URL, {params})
    .then(response => setGameNumbers(gameNumbers => createArrayFromNumbers(response.data)))
    .catch(err => console.log(err));
  },[]);

  useEffect(() => {
    const updateUserFinalAnswer = () => {
      if(!gameNumbers) return;

      let updatedUserFinalAnswer = userFinalAnswer.split("");

      for (let i = 0; i < gameNumbers.length; i++) {
        if (currentUserGuess[i] === gameNumbers[i]) {
          updatedUserFinalAnswer[i] = currentUserGuess[i];
        }
      }

      setUserFinalAnswer(userFinalAnswer => updatedUserFinalAnswer.join(""));
    }

    updateUserFinalAnswer();

    if (currentUserGuess !== "") {
      setNumberOfUserGuesses(numberOfUserGuesses => numberOfUserGuesses - 1);
      setUserFeedback();
    }

  },[currentUserGuess]);

  
  const createGameNumberCards = () => {
    if(!gameNumbers) return;
    return gameNumbers.map(
        (number, index) => <NumberCard 
                    number={number} 
                    isKnown={numberOfUserGuesses === 0 || hasWon} 
                    key={number+index}
                  />
    )
  }

  return (
    <div className="NumberContainer">
      <h3 id="guesses-left">{`Guesses Remaining: ${numberOfUserGuesses}`}</h3>
      <div className="NumberContainer-numbers">
        {createGameNumberCards()}
      </div>
      <UserForm 
            setCurrentUserGuess={setCurrentUserGuess} 
            numberOfUserGuesses={numberOfUserGuesses} 
            hasWon={hasWon}
      />
      <GameMessage message={message} />
    </div>
  );

};