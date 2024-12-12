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
    const [historicTurn, setHistoricTurn] = useState(-1);
    const [numTurns, setNumTurns] = useState(0);
    // const [, forceUpdate] = useReducer(x => {
    //   console.log("forceUpdate()")
    //   return x + 1
    // }, 0);
    // const forceUpdate = useForceUpdate();

    const refreshBoardKey = () => {
        setRefreshKey((prevKey) => prevKey + 1);
    };

    const forceUpdate = () => {
        refreshBoardKey();
    };

    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        console.log("numTurns:", numTurns);
    }, [numTurns]);

    return (
        <div className="App">
            <Board
                numRows={numRows}
                key={refreshKey}
                randomStartSlotChecked={randomStartSlotChecked}
                showTargetSlots={showTargetSlots}
                historicTurn={historicTurn}
                setNumTurns={setNumTurns}
            />
            <Controls
                numRows={numRows}
                setNumRows={setNumRows}
                forceUpdate={forceUpdate}
                setRandomStartSlotChecked={setRandomStartSlotChecked}
                setShowTargetSlots={setShowTargetSlots}
                numTurns={numTurns}
                setHistoricTurn={setHistoricTurn}
                historicTurn={historicTurn}
            />
        </div>
    );
}

export default App;
