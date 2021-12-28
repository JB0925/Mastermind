import { useReducer, createContext, useContext } from "react";
import gameReducer from "./gameReducer";

const GameContext = createContext();

/** GameProvider
 * 
 * Returns a Context Provider that can be wrapped around its children
 * to share the values from the reducer (state and a dispatch function to update state).
 * 
 */
const GameProvider = ({ children }) => {
  const initialState = {
    gameNumbers: "",
    numberOfUserGuesses: 10,
    currentUserGuess: "",
    userFinalAnswer: "____",
    message: "Waiting for your first guess...",
    hasWon: false
  };

  const [state, dispatch] = useReducer(gameReducer, initialState);

  const value = [state, dispatch];

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};


/** A way to access the value from the above Context Provider
 * This will only work if the GameProvider is wrapped around all of 
 * the child components.
 */
const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGameContext must be used within a GameProvider");

  return context;
};

export { GameProvider, useGameContext };