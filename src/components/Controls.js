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
}) => {
    // const rowsInputListener = (event) => {
    //     const inputNum = Number(event.target.value);
    //     const clampedNum = Math.min(10, Math.max(4, inputNum));
    //     setNumRows(clampedNum);
    // };
    // const rowsInputListener = (event) => {
    //     const inputNum = Number(event.target.value);
    //     const clampedNum = Math.min(10, Math.max(4, inputNum));
    //     setNumRows(clampedNum);
    // };
    const addRows = (numToAdd) => {
        const clampedNum = Math.min(10, Math.max(4, numRows + numToAdd));
        setNumRows(clampedNum);
    };
    const toggleRandomStartSlot = (event) => {
        setRandomStartSlotChecked(event.target.checked);
    };
    // const restart = () => {
    //     // - hacky solution for now...
    //     console.log("RESTART");
    //     setNumRows(numRows - 1);
    //     setNumRows(numRows + 1);
    // };

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
        // let optionsText = "";
        // for(let optionNum = 0; optionNum < numTurnsTaken; optionNum++){
        //     optionsText+=`<option key=${optionNum} value=${optionNum}>
        //             ${optionNum}
        //         </option>`
        // }
        // return optionsText;
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

            <div className="control">
                <button onPointerDown={forceUpdate}>RESTART</button>
            </div>
        </div>
    );
};

export default Controls;
