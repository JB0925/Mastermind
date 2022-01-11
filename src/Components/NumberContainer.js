import React, { useEffect, useMemo, useCallback } from "react";
import { useGameContext } from "../useUpdateGame";
import axios from "axios";
import "../CSS/NumberContainer.css";
import NumberCard from "./NumberCard";
import UserForm from "./UserForm";
import GameMessage from "./GameMessages";
import {
  noMoreGuesses,
  userWonGame,
  setupNextTurn,
  getGameNumbers,
} from "../actionCreators";
import ResetButton from "./ResetButton";

function NumberContainer() {
  const TOTAL_DIGITS = 4;
  const BASE_URL = "https://www.random.org/integers/";

  const params = useMemo(
    () => ({
      num: 4,
      min: 0,
      max: 7,
      col: 1,
      base: 10,
      format: "plain",
      rnd: "new",
    }),
    []
  );

  const [
    { gameNumbers, numberOfUserGuesses, currentUserGuess, hasWon },
    dispatch,
  ] = useGameContext();

  const createArrayFromNumbers = (numbers) =>
    numbers.split("\n").filter((num) => num !== "");

  /**
   *  createFeedbackMessage
   *
   * Params:
   *    - numberOfDigitsInGameNumbers: Number
   *    - numberOfDigitsInCorrectPlace: Number
   *
   * Returns:
   *    - message: String
   *
   * Takes how many digits were in the user's number that match the gameNumbers,
   * as well as how many were in the correct place.
   * Creates a "standard" message to return to the user from those values.
   * If the user has found all unique digits in gameNumbers,
   * the message is updated and returned. Otherwise, it returns the original message,
   *
   */
  const createFeedbackMessage = ({
    numberOfDigitsInGameNumbers,
    numberOfDigitsInCorrectPlace,
  }) => {
    const message = `${numberOfDigitsInGameNumbers} of your numbers are in our number
    and ${numberOfDigitsInCorrectPlace} are in the right place.`;

    if (numberOfDigitsInGameNumbers === TOTAL_DIGITS) {
      const amountInCorrectPlaceMessage = message.split("and")[1];
      return `You have found all unique digits in our number. 
              ${amountInCorrectPlaceMessage}`;
    }

    return message;
  };

  /**
   *  createGameNumbersCounter
   *
   * Params: None
   *
   * Returns:
   *    - gameNumberCounter: Object
   *
   * This function takes the current game numbers and creates
   * a counter out of them, which makes it easier to determine
   * if the user has found values in the gameNumbers or not,
   * and whether or not they are in the correct place within
   * the game numbers.
   *
   * Most importantly, it makes it easy
   * to check if the user has entered a value that has already
   * been accounted for. For example, if a user enters "5555",
   * and the number is "6545", we can use this counter Object
   * to say "ok, well, there are only two fives in this number,
   * so the user has only found two of our four numbers", rather
   * than telling the user "you found four of our numbers" and
   * them thinking "well, if I found all the numbers, why didn't
   * I win?"
   *
   */
  const createGameNumbersCounter = useCallback(() => {
    let gameNumberCounter = {};
    let counterKeys = new Set(Object.keys(gameNumberCounter));

    for (let number of gameNumbers) {
      if (!counterKeys.has(number)) {
        gameNumberCounter[number] = 1;
        counterKeys.add(number);
      } else {
        gameNumberCounter[number]++;
      }
    }

    return gameNumberCounter;
  }, [gameNumbers]);

  /**
   * checkIfUserProvidedValueIsInNumbers
   *
   * Params:
   *    - counterObject: Object
   *    - userProvidedValue: String
   *    - totalDigitsInNumber: Number
   *
   * Returns:
   *    - A Number data type representing how many of the user's digits (thus far)
   *      are in the game numbers
   *
   * Purpose:
   *    - A helper function for the "analyzeUserAnswer" function
   *
   */
  const checkIfUserProvidedValueIsInNumbers = (
    counterObject,
    userProviedValue,
    totalDigitsInNumber
  ) => {
    if (counterObject[userProviedValue]) {
      totalDigitsInNumber++;
      counterObject[userProviedValue]--;
    }
    return totalDigitsInNumber;
  };

  /**
   * checkIfUserProvidedValueIsInCorrectPlace
   *
   * Params:
   *    - userProvidedValue: String
   *    - currentGameNumberValue: String
   *    - totalDigitsInCorrectPlace: Number
   *
   * Returns:
   *    - A Number data type representing how many of the user's digits (thus far)
   *      are in the correct place within the game numbers
   *
   * Purpose:
   *    - A helper function for the "analyzeUserAnswer" function
   *
   */
  const checkIfUserProvidedValueIsInCorrectPlace = (
    userProviedValue,
    currentGameNumberValue,
    totalDigitsInCorrectPlace
  ) => {
    if (userProviedValue === currentGameNumberValue) {
      totalDigitsInCorrectPlace++;
    }

    return totalDigitsInCorrectPlace;
  };

  /**
   * handleOutOfGuessesScenario
   *
   * Params: None
   *
   * Returns: None
   *
   * Purpose:
   *    - to call the dispatch function, which will update
   *      state, indicating that the user is out of guesses
   *      and signal that the game is over.
   */
  const handleOutOfGuessesScenario = useCallback(() => {
    dispatch(noMoreGuesses());
  }, [dispatch]);

  /**
   * handleUserWonScenario
   *
   * Params: None
   *
   * Returns: None
   *
   * Purpose:
   *    - to call the dispatch function, which will update
   *      state and signal that the user has won and the game is over.
   */
  const handleUserWonScenario = useCallback(() => {
    dispatch(userWonGame());
  }, [dispatch]);

  /**
   * handleNextTurn
   *
   * Params:
   *    - userFeedback: String
   *
   * Returns: None
   *
   * Purpose:
   *    - to call the dispatch function, which will update
   *      state with a new feedback message for the user,
   *      and signal that the user is ready for their next turn.
   */
  const handleNextTurn = useCallback(
    (userFeedback) => {
      dispatch(setupNextTurn(userFeedback));
    },
    [dispatch]
  );

  // A check to see if the user has won the game
  // by checking to see if all of their numbers
  // match the game numbers
  const userAnswerMatchesGameNumbers = (numbersInCorrectPlace) => {
    return numbersInCorrectPlace === TOTAL_DIGITS;
  };

  /**
   * analyzeUserAnswer
   *
   * Params: None
   *
   * Returns:
   *    An Object with two values:
   *        1). The amount of numbers the user has found
   *        2). The amount that the user guessed that are
   *            also in the correct place.
   *
   *    This is used to create a feedback message to display
   *    to the user.
   *
   */
  const analyzeUserAnswer = useCallback(() => {
    let numberOfDigitsInGameNumbers = 0;
    let numberOfDigitsInCorrectPlace = 0;
    let gameNumberCounter = createGameNumbersCounter();

    for (let i = 0; i < TOTAL_DIGITS; i++) {
      let currentUserValue = currentUserGuess[i];
      let currentGameNumberValue = gameNumbers[i];

      // check to see if the current value is in the gameNumbers at all and that it hasn't already been "seen"
      numberOfDigitsInGameNumbers = checkIfUserProvidedValueIsInNumbers(
        gameNumberCounter,
        currentUserValue,
        numberOfDigitsInGameNumbers
      );

      // check to see if the current value is in the right place in the gameNumbers
      numberOfDigitsInCorrectPlace = checkIfUserProvidedValueIsInCorrectPlace(
        currentUserValue,
        currentGameNumberValue,
        numberOfDigitsInCorrectPlace
      );
    }

    return { numberOfDigitsInGameNumbers, numberOfDigitsInCorrectPlace };
  }, [createGameNumbersCounter, currentUserGuess, gameNumbers]);

  /**
   * giveUserFeedback
   *
   * Params: None
   *
   * Returns: None
   *
   * Purpose:
   *    This function dispatches an action to the gameReducer function,
   *    which is then used to update the state of the app. This handles three
   *    scenarios:
   *        1). The user is out of guesses.
   *        2). The user has won.
   *        3). The user is getting ready for their next turn.
   *
   */
  const giveUserFeedback = useCallback(() => {
    const userOutOfGuesses = numberOfUserGuesses === 0;

    if (userOutOfGuesses) {
      handleOutOfGuessesScenario();
      return;
    }

    // if not outOfGuesses, check to see if the user won
    const { numberOfDigitsInGameNumbers, numberOfDigitsInCorrectPlace } =
      analyzeUserAnswer();

    if (userAnswerMatchesGameNumbers(numberOfDigitsInCorrectPlace)) {
      handleUserWonScenario();
      return;
    }

    // if the user hasn't won, and isn't out of guesses, we give them information for
    // their next turn to let them know how many numbers they found, and how many are in the
    // correct place.

    const userFeedback = createFeedbackMessage({
      numberOfDigitsInGameNumbers,
      numberOfDigitsInCorrectPlace,
    });
    handleNextTurn(userFeedback);
  }, [
    numberOfUserGuesses,
    analyzeUserAnswer,
    handleNextTurn,
    handleOutOfGuessesScenario,
    handleUserWonScenario,
  ]);

  // get initial game numbers from API as page loads
  useEffect(() => {
    let mounted = true;

    if (mounted) {
      axios
        .get(BASE_URL, { params })
        .then((response) => {
          const newGameNumbers = createArrayFromNumbers(response.data);
          dispatch(getGameNumbers(newGameNumbers));
        })
        .catch((err) => console.log(err));
    }

    return () => {
      mounted = false;
    };
  }, [params, dispatch, gameNumbers.length]);

  // an effect that runs every time the user's current guess changes.
  // compares the user's guess with the actual numbers and updates their guess,
  // then gives feedback to the user.
  useEffect(() => {
    // run this function each time the user makes a new guess, but not before they've made a guess at all
    if (currentUserGuess !== "") {
      giveUserFeedback();
    }
  }, [currentUserGuess, gameNumbers, dispatch, giveUserFeedback]);

  // creating NumberCard components based on the gameNumbers.
  const createGameNumberCards = () => {
    if (!gameNumbers) return;

    return gameNumbers.map((number, index) => (
      <NumberCard
        number={number}
        isKnown={numberOfUserGuesses === 0 || hasWon}
        key={number + index}
      />
    ));
  };

  return (
    <div className="NumberContainer">
      <div className="info">
        <h3 id="header">Welcome to MasterMind!</h3>
        <ResetButton />
        <h3 id="guesses-left">{`Guesses Remaining: ${numberOfUserGuesses}`}</h3>
      </div>
      <div className="NumberContainer-numbers">
        {gameNumbers ? (
          createGameNumberCards()
        ) : (
          <i className="fas fa-spinner fa-spin"></i>
        )}
      </div>
      <UserForm />
      <GameMessage />
    </div>
  );
}

export default React.memo(NumberContainer);
