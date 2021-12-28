import { OUT_OF_GUESSES, WON_GAME, NEXT_TURN, GET_NUMBERS, UPDATE_USER_ANSWER } from "./actionTypes";

const noMoreGuesses = () => {
  return {
    type: OUT_OF_GUESSES,
    payload: "Sorry, you've run out of guesses!"
  };
};

const userWonGame = () => {
  return {
    type: WON_GAME,
    payload: "You won!!!"
  };
};

const setupNextTurn = feedbackToUser => {
  return {
    type: NEXT_TURN,
    payload: feedbackToUser
  };
};

const getGameNumbers = newGameNumberData => {
  return {
    type: GET_NUMBERS,
    payload: newGameNumberData
  };
};

const createNewUserAnswer = newUserAnswer => {
  return {
    type: UPDATE_USER_ANSWER,
    payload: newUserAnswer
  };
};

export {
  noMoreGuesses, userWonGame, setupNextTurn,
  getGameNumbers, createNewUserAnswer
};