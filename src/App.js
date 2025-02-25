import { useState } from "react";
import "./App.css";
import Board from "./components/Board.js";
import Controls from "./components/Controls.js";
import GameOver from "./components/GameOver.js";

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
    const [numTurnsTaken, setnumTurnsTaken] = useState(0);
    const [instructionsVisible, setInstructionsVisible] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [pegsRemaining, setPegsRemaining] = useState(-1);

    const [refreshKey, setRefreshKey] = useState(0);

    const refreshBoardKey = () => {
        // changing the key fordes reload
        setRefreshKey((prevKey) => prevKey + 1);
    };

    const forceUpdate = () => {
        setGameOver(false);
        setPegsRemaining(-1);
        setnumTurnsTaken(0);
        setHistoricTurnIndex(-1);
        refreshBoardKey();
    };

    const closeInfoModal = (event) => {
        setInstructionsVisible(false);
    };
    const openInfoModal = () => {
        setInstructionsVisible(true);
    };

    return (
        <div className="App">
            {/* DMR 1/23/25 - make this modal its own component? */}
            <div id="info-button" onPointerUp={openInfoModal}>
                ?
            </div>
            <div
                id="info-modal"
                className={instructionsVisible ? "show" : ""}
                onPointerUp={closeInfoModal}
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
                            Use the <span className="hilight">"Move"</span>{" "}
                            slider to rewind to previous turns.
                        </li>
                        <li>
                            Check the{" "}
                            <span className="hilight">"Random Start Slot"</span>{" "}
                            checkbox to toggle whether the empty start slot is
                            placed randomly.
                        </li>
                        <li>
                            Check the{" "}
                            <span className="hilight">"Show Target Slots"</span>{" "}
                            checkbox to highlight jump-to slots.
                        </li>
                        <li>
                            Press the <span className="hilight">"Restart"</span>{" "}
                            button to reset the board.
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
                setnumTurnsTaken={setnumTurnsTaken}
                setGameOver={setGameOver}
                setPegsRemaining={setPegsRemaining}
            ></Board>
     
                <Controls
                    numRows={numRows}
                    setNumRows={setNumRows}
                    showTargetSlots={showTargetSlots}
                    setShowTargetSlots={setShowTargetSlots}
                    historicTurnIndex={historicTurnIndex}
                    setHistoricTurnIndex={setHistoricTurnIndex}
                    forceUpdate={forceUpdate}
                    setRandomStartSlotChecked={setRandomStartSlotChecked}
                    numTurnsTaken={numTurnsTaken}
                    pegsRemaining={pegsRemaining}
                    gameOver={gameOver}

                />
        </div>
    );
}

export default App;
