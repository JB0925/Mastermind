import './App.css';
import NumberContainer from './Components/NumberContainer';
import { GameProvider } from "./useUpdateGame";

function App() {

  return (
    <GameProvider>
      <div className="App">
        <NumberContainer />
     </div>
    </GameProvider>
  );
}

export default App;
