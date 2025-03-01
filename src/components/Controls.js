const Controls = ({
    numRows,
    setNumRows,
    forceUpdate,
    setRandomStartSlotChecked,
    showTargetSlots,
    setShowTargetSlots,
    setHistoricTurnIndex,
    historicTurnIndex,
    numTurnsTaken,
    gameOver,
    pegsRemaining,
    setShowMoveHint,
}) => {

    const addRows = (numToAdd) => {
        const clampedNum = Math.min(10, Math.max(4, numRows + numToAdd));
        setNumRows(clampedNum);
    };
    const toggleRandomStartSlot = (event) => {
        setRandomStartSlotChecked(event.target.checked);
    };

    const getMarkerDatalistOptions = () => {
        if (numTurnsTaken <= 0) return null;
        const options = new Array(numTurnsTaken - 1).fill(null);
        return options.map((item, index) => {
            return (
                <option key={index} value={index}>
                    {index}
                </option>
            );
        });
    };

    return (
        <div className="controls">
            <div className="control history">
                <span>
                    MOVE{" "}
                    {historicTurnIndex > -1 ? historicTurnIndex : numTurnsTaken - 1}
                </span>
                <input
                    className="slider"
                    type="range"
                    min="0"
                    max={numTurnsTaken - 1}
                    value={
                        historicTurnIndex > -1
                            ? historicTurnIndex
                            : numTurnsTaken - 1
                    }
                    // id="moves-slider"
                    onChange={(event) =>
                        setHistoricTurnIndex(Number(event.target.value))
                    }
                    list="markers"
                />
                <datalist id="markers">{getMarkerDatalistOptions()}</datalist>
                {/* why doesn't this show markers on the range slider? */}
            </div>

            {/* <button onPointerDown={randomizeEmpty}>RANDOMIZE EMPTY</button> */}
            {gameOver ? (
                // show Game Over screen
                <div className="control game-over">
                <h2>GAME OVER</h2>
                <p>Pegs Left: {pegsRemaining}</p>
                <p>Turns taken: {numTurnsTaken}</p>

            </div>
            ) : (
                <>
            <div className="control">
                <label htmlFor="show-targets-checkbox">
                    SHOW MOVE OPTIONS
                    <input
                        type="checkbox"
                        checked={showTargetSlots}
                        onChange={(event) => {
                            setShowTargetSlots(event.target.checked);
                        }}
                        name="show-targets"
                        id="show-targets-checkbox"
                    />
                </label>
            </div>
            <hr />
            <div className="control">
                <label htmlFor="random-start-checkbox">
                    RANDOM EMPTY START HOLE
                    <input
                        type="checkbox"
                        onChange={toggleRandomStartSlot}
                        name="random-start"
                        id="random-start-checkbox"
                    />
                </label>
            </div>
            <hr />
            <div className="control">
                {/* <label htmlFor="show-moves-checkbox">
                    SHOW MOVE HINTS
                    <input
                        type="checkbox"
                        onChange={toggleShowMoves}
                        name="show-moves"
                        id="show-moves-checkbox"
                    />
                </label> */}
                <button onPointerDown={(event)=>{console.log("SHOW HINTS CLICKED");setShowMoveHint(true)}}>SHOW HINT</button>
            </div>
            <div className="control" style={{display:numTurnsTaken <= 1 ? "block" : "none"}}>
                NUM ROWS: {numRows}{" "}
                <button
                    onPointerDown={() => {
                        addRows(1);
                    }}
                >
                    &#9650;
                </button>
                <button
                    onPointerDown={() => {
                        addRows(-1);
                    }}
                    style={{ marginLeft: "0.3rem" }}
                >
                    &#9660;
                </button>
            </div>
            </>
            )}
            <div className="control">
                <button onPointerDown={forceUpdate}>RESTART</button>
            </div>
        </div>
    );
};

export default Controls;
