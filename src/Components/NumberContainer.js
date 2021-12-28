import React, { useEffect } from "react";
import { useGameContext } from "../useUpdateGame";
import axios from "axios";
import "../CSS/NumberContainer.css";
import NumberCard from "./NumberCard";
import UserForm from "./UserForm";
import GameMessage from "./GameMessages";
import { noMoreGuesses, userWonGame, setupNextTurn, getGameNumbers, createNewUserAnswer } from "../actionCreators";

export default function NumberContainer() {
  const TOTAL_DIGITS = 4;
  const BASE_URL = "https://www.random.org/integers/";
  const params = {
    num: 4, min: 0, max: 7,
    col: 1, base: 10, format: "plain",
    rnd: "new"
  }

  const [{ gameNumbers, numberOfUserGuesses, currentUserGuess, userFinalAnswer, hasWon }, dispatch] = useGameContext();
    
  const createArrayFromNumbers = numbers => numbers.split("\n").filter(num => num !== "");
  
  // Takes a message and how many digits were in the user's number that match the gameNumbers.
  // If the user has found all unique digits in gameNumbers,
  // it lets them know that. Otherwise, it returns the original message.
  const setUpdatedMessage = (messageData) => {
    const { message, userNumbersFound } = messageData;
    if (userNumbersFound === TOTAL_DIGITS) {
      const amountInCorrectPlaceMessage = message.split("and")[1];
      return `You have found all unique numbers. ${amountInCorrectPlaceMessage}.
              This also means that you have found the correct duplicates!`;
    };

    return message;
  };
  
  // returns an object with a count of how many of each digit there are in the game numbers
  const createGameNumbersCounter = () => {
    let gameNumberCounter = {};
    let gameNumberKeys = Object.keys(gameNumberCounter);
    let counterKeys = new Set(gameNumberKeys);

    for (let number of gameNumbers) {
      if (!counterKeys.has(number)) {
        gameNumberCounter[number] = 1
        counterKeys.add(number);
      } else {
        gameNumberCounter[number]++;
      };
    };
    
    return gameNumberCounter;
  };
  
  const giveUserFeedback = () => {
    
    // handle outOfGuesses scenario
    if (numberOfUserGuesses === 0) {
      dispatch(noMoreGuesses());
      return "Sorry, you've run out of guesses!";
    };
    
    // determine how many digits the user got correct, and how many are in the correct place
    let numberOfDigitsInGameNumbers = 0;
    let numberOfDigitsInCorrectPlace = 0;
    let gameNumberCounter = createGameNumbersCounter();

    for (let i = 0; i < TOTAL_DIGITS; i++) {
      let currentValue = currentUserGuess[i];
      
      // check to see if the current value is in the gameNumbers at all and that it hasn't already been "seen"
      if (gameNumbers.includes(currentValue)) {
        if (gameNumberCounter[currentValue] !== 0) {
          numberOfDigitsInGameNumbers++
          gameNumberCounter[currentValue]--;
        }
      }
      
      // check to see if the current value is in the right place in the gameNumbers
      if (currentValue === gameNumbers[i]) {
        numberOfDigitsInCorrectPlace++;
      }
    }

    // check to see if the user won
    if (numberOfDigitsInCorrectPlace === TOTAL_DIGITS) {
      dispatch(userWonGame());
      return "You won!!!"
    }
    
    // if the user hasn't won, and isn't out of guesses, we give them information for
    // the next turn. Give them extra feedback if they've found all unique numbers.
    let updatedMessage = `${numberOfDigitsInGameNumbers} of your numbers are in our number
        and ${numberOfDigitsInCorrectPlace} are in the right place.`;
    
    let messageData = {
      message: updatedMessage, 
      userNumbersFound: numberOfDigitsInGameNumbers
    };
    
    // determine if the user has found all unique messages and, if so, let them know.
    updatedMessage = setUpdatedMessage(messageData);
    
    dispatch(setupNextTurn(updatedMessage));
  };
  
  // get initial game numbers from API as page loads
  useEffect(() => {
    let mounted = true;

    if (mounted) {
      axios.get(BASE_URL, {params})
      .then(response => {
        const newGameNumbers = createArrayFromNumbers(response.data);
        dispatch(getGameNumbers(newGameNumbers));
      })
      .catch(err => console.log(err));
    };

    return () => {
      mounted = false;
    };
  },[]);
  
  // an effect that runs every time the user's current guess changes.
  // compares the user's guess with the actual numbers and updates their guess,
  // then gives feedback to the user.
  useEffect(() => {
    const updateUserFinalAnswer = () => {
      if(!gameNumbers) return;

      let updatedUserFinalAnswer = userFinalAnswer.split("");

      for (let i = 0; i < TOTAL_DIGITS; i++) {
        if (currentUserGuess[i] === gameNumbers[i]) {
          updatedUserFinalAnswer[i] = currentUserGuess[i];
        };
      };

    updatedUserFinalAnswer = updatedUserFinalAnswer.join("");
    dispatch(createNewUserAnswer(updatedUserFinalAnswer));
    };
    
    // run these functions each time the user makes a new guess, but not before they've made a guess at all
    if (currentUserGuess !== "") {
      updateUserFinalAnswer();
      giveUserFeedback();
    }

  },[currentUserGuess]);

  
  // creating NumberCard components based on the gameNumbers.
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
      <UserForm />
      <GameMessage />
    </div>
  );
};