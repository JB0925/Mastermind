/** gameReducer
 * Used in a call to useReducer as a way to manage the state of the app
 */
const gameReducer = (state, { type, payload }) => {
  switch(type) {
    case "get numbers":
      return {
        ...state,
        gameNumbers: payload
      };
    
    case "out of guesses":
      return {
        ...state,
        message: payload
      };
    
    case "won game":
      return {
        ...state,
        hasWon: true,
        message: payload
      };
    
    case "next turn":
      return {
        ...state,
        message: payload,
      };
    
    case "update current user guess":
      return {
        ...state,
        currentUserGuess: payload,
        numberOfUserGuesses: state.numberOfUserGuesses - 1
      };
    
    case "reset":
      return{
        ...state,
        gameNumbers: "",
        numberOfUserGuesses: 10,
        currentUserGuess: "",
        message: "Waiting for your first guess...",
        hasWon: false
      };

    default:
      throw new Error(`Unhandled action type: ${type}`)
  };
};

export default gameReducer;