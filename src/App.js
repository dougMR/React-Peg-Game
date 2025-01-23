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
    const [showTargetSlots, setShowTargetSlots] = useState(true);
    const [historicTurnIndex, setHistoricTurnIndex] = useState(-1);
    const [numTurns, setNumTurns] = useState(0);
    const [instructionsVisible, setInstructionsVisible] = useState(false);

    const [refreshKey, setRefreshKey] = useState(0);

    const refreshBoardKey = () => {
        setRefreshKey((prevKey) => prevKey + 1);
    };

    const forceUpdate = () => {
        setNumTurns(0);
        setHistoricTurnIndex(-1);
        refreshBoardKey();
    };

    const closeInfoModal = (event) => {
        setInstructionsVisible(false);
    };
    const openInfoModal = () => {
        setInstructionsVisible(true);
    };

    // useEffect(() => {
    //     console.log("numTurns:", numTurns);
    // }, [numTurns]);

    return (
        <div className="App" >
            <div id="info-button" onPointerDown={openInfoModal}>
                ?
            </div>
            <div
                id="info-modal"
                className={instructionsVisible ? "show" : ""}
                onPointerDown={closeInfoModal}
            >
                <div className="modal-content">
                    <h2>Objective:</h2>
                    <p>
                        Jump pegs over each other to remove them from the board.
                        Try to remove all but one peg.
                    </p>
                    <h2>How to play:</h2>
                    <ul>
                        <li>
                            Click/tap a peg to select it. Then tap a destination
                            slot to move it.
                        </li>
                        <li>
                            Use the <span className="hilight">"Move"</span> slider to rewind to previous turns.
                        </li>
                        <li>
                            Check the <span className="hilight">"Random Start Slot"</span> checkbox to toggle
                            whether the empty start slot is placed randomly.
                        </li>
                        <li>
                            Check the <span className="hilight">"Show Target Slots"</span> checkbox to highlight jump-to slots.
                        </li>
                        <li>
                            Press the <span className="hilight">"Restart"</span> button to reset the board.
                        </li>
                    </ul>
                </div>
            </div>
            <Board
                numRows={numRows}
                // ?? DMR 12/16/24 - updating the key resets all the the board values to start state?
                key={refreshKey}
                randomStartSlotChecked={randomStartSlotChecked}
                showTargetSlots={showTargetSlots}
                historicTurnIndex={historicTurnIndex}
                setHistoricTurnIndex={setHistoricTurnIndex}
                setNumTurns={setNumTurns}
            ></Board>
            <Controls
                numRows={numRows}
                setNumRows={setNumRows}
                forceUpdate={forceUpdate}
                setRandomStartSlotChecked={setRandomStartSlotChecked}
                showTargetSlots={showTargetSlots}
                setShowTargetSlots={setShowTargetSlots}
                numTurns={numTurns}
                setHistoricTurnIndex={setHistoricTurnIndex}
                historicTurnIndex={historicTurnIndex}
            />
        </div>
    );
}

export default App;
