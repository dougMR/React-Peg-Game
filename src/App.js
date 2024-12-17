import { useEffect, useState } from "react";
import "./App.css";
import Board from "./components/Board.js";
import Controls from "./components/Controls.js";

//create your forceUpdate hook
// function useForceUpdate() {

//     const [value, setValue] = useState(0); // integer state
//     return () => setValue((value) => {console.log("forceUpdate()"); return value + 1}); // update state to force render
//     // A function that increment 👆🏻 the previous state like here
//     // is better than directly setting `setValue(value + 1)`
// }

function App() {
    const [numRows, setNumRows] = useState(5);
    const [randomStartSlotChecked, setRandomStartSlotChecked] = useState(false);
    const [showTargetSlots, setShowTargetSlots] = useState(false);
    const [historicTurnIndex, setHistoricTurnIndex] = useState(-1);
    const [numTurns, setNumTurns] = useState(0);

    const [refreshKey, setRefreshKey] = useState(0);

    const refreshBoardKey = () => {
        setRefreshKey((prevKey) => prevKey + 1);
    };

    const forceUpdate = () => {
        setHistoricTurnIndex(-1);
        setNumTurns(1);
        refreshBoardKey();
    };

    // useEffect(() => {
    //     console.log("numTurns:", numTurns);
    // }, [numTurns]);

    return (
        <div className="App">
            <Board
                numRows={numRows}
                // ?? DMR 12/16/24 - Why does updating the key reset the board to start state?
                key={refreshKey}
                randomStartSlotChecked={randomStartSlotChecked}
                showTargetSlots={showTargetSlots}
                historicTurnIndex={historicTurnIndex}
                setHistoricTurnIndex={setHistoricTurnIndex}
                setNumTurns={setNumTurns}
            />
            <Controls
                numRows={numRows}
                setNumRows={setNumRows}
                forceUpdate={forceUpdate}
                setRandomStartSlotChecked={setRandomStartSlotChecked}
                setShowTargetSlots={setShowTargetSlots}
                numTurns={numTurns}
                setHistoricTurnIndex={setHistoricTurnIndex}
                historicTurnIndex={historicTurnIndex}
            />
        </div>
    );
}

export default App;
