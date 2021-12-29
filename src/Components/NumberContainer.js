import React, { useEffect, useMemo, useCallback } from "react";
import { useGameContext } from "../useUpdateGame";
import axios from "axios";
import "../CSS/NumberContainer.css";
import NumberCard from "./NumberCard";
import UserForm from "./UserForm";
import GameMessage from "./GameMessages";
import { noMoreGuesses, userWonGame, setupNextTurn, getGameNumbers } from "../actionCreators";
import ResetButton from "./ResetButton";

export default function NumberContainer() {
  const TOTAL_DIGITS = 4;
  const BASE_URL = "https://www.random.org/integers/";

  const getGameRequestParams = () => ({
    num: 4, min: 0, max: 7,
    col: 1, base: 10, format: "plain",
    rnd: "new"
  });
  const params = useMemo(() => getGameRequestParams(),[]);

  const [{ gameNumbers, numberOfUserGuesses, currentUserGuess, hasWon }, dispatch] = useGameContext();
    
  const createArrayFromNumbers = numbers => numbers.split("\n").filter(num => num !== "");
  
  // Takes a message and how many digits were in the user's number that match the gameNumbers.
  // If the user has found all unique digits in gameNumbers,
  // it lets them know that. Otherwise, it returns the original message,
  // including how many of their numbers are in the correct place.
  const setUpdatedMessage = ({ message, userNumbersFound }) => {
    if (userNumbersFound === TOTAL_DIGITS) {
      const amountInCorrectPlaceMessage = message.split("and")[1];
      return `You have found all unique digits in our number. 
              ${amountInCorrectPlaceMessage}`;
    };

    return message;
  };
  
  const giveUserFeedback = useCallback(() => {
    const userOutOfGuesses = numberOfUserGuesses === 0;

    // returns an object with a count of how many of each digit there are in the game numbers
    const createGameNumbersCounter = () => {
      let gameNumberCounter = {};
      let counterKeys = new Set(Object.keys(gameNumberCounter));
    
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
    
    // handle outOfGuesses scenario
    if (userOutOfGuesses) {
      dispatch(noMoreGuesses());
      return;
    };
    
    // determine how many digits the user got correct, and how many are in the correct place
    let numberOfDigitsInGameNumbers = 0;
    let numberOfDigitsInCorrectPlace = 0;
    let gameNumberCounter = createGameNumbersCounter();

    for (let i = 0; i < TOTAL_DIGITS; i++) {
      let currentValue = currentUserGuess[i];
      
      // check to see if the current value is in the gameNumbers at all and that it hasn't already been "seen"
      if (gameNumberCounter[currentValue]) {
          numberOfDigitsInGameNumbers++
          gameNumberCounter[currentValue]--;
      };
      
      // check to see if the current value is in the right place in the gameNumbers
      if (currentValue === gameNumbers[i]) {
        numberOfDigitsInCorrectPlace++;
      };
    };
    
    // check to see if the user won
    if (numberOfDigitsInCorrectPlace === TOTAL_DIGITS) {
      dispatch(userWonGame());
      return;
    }
    
    // if the user hasn't won, and isn't out of guesses, we give them information for
    // the next turn. Give them extra feedback if they've found all unique numbers.
    let updatedMessage = `${numberOfDigitsInGameNumbers} of your numbers are in our number
        and ${numberOfDigitsInCorrectPlace} are in the right place.`;
    
    let messageData = {
      message: updatedMessage, 
      userNumbersFound: numberOfDigitsInGameNumbers
    };
    
    // determine if the user has found all unique digits and, if so, let them know.
    updatedMessage = setUpdatedMessage(messageData);
    
    dispatch(setupNextTurn(updatedMessage));
  },[currentUserGuess, dispatch, gameNumbers, numberOfUserGuesses]);
    
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
  },[params, dispatch, gameNumbers.length]);
  
  // an effect that runs every time the user's current guess changes.
  // compares the user's guess with the actual numbers and updates their guess,
  // then gives feedback to the user.
  useEffect(() => {
    
    // run this function each time the user makes a new guess, but not before they've made a guess at all
    if (currentUserGuess !== "") {
      giveUserFeedback();
    };

  },[currentUserGuess, gameNumbers, dispatch, giveUserFeedback]);

  
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
      <div className="info">
        <h3 id="header">Welcome to MasterMind!</h3>
        <ResetButton />
        <h3 id="guesses-left">{`Guesses Remaining: ${numberOfUserGuesses}`}</h3>
      </div>
      <div className="NumberContainer-numbers">
        {createGameNumberCards()}
      </div>
      <UserForm />
      <GameMessage />
    </div>
  );
};