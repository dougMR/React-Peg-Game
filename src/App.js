import "./App.css";
import Board from "./components/Board.js";
function App() {
    return (
        <div className="App">
            <Board numRows={6} />
        </div>
    );
}

export default App;
