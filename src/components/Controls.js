const Controls = ({
    numRows,
    setNumRows,
    forceUpdate,
    setRandomStartSlotChecked,
    setShowTargetSlots,
    setHistoricTurnIndex,
    historicTurnIndex,
    numTurns,
}) => {
    const rowsInputListener = (event) => {
        const inputNum = Number(event.target.value);
        const clampedNum = Math.min(10, Math.max(4, inputNum));
        setNumRows(clampedNum);
    };
    const toggleRandomStartSlot = (event) => {
        // console.log(event.target.checked)
        setRandomStartSlotChecked(event.target.checked);
    };
    const restart = () => {
        // DRM 8/12/24 - hacky solution for now...
        console.log("RESTART");
        setNumRows(numRows - 1);
        setNumRows(numRows + 1);
    };

    const getMarkerDatalistOptions = () => {
        // let optionsList = ``;
        // for (let markerNum = 0; markerNum < numTurns - 1; markerNum++) {
        //     console.log("optionsList:",optionsList);
        //     optionsList += `<option value="${markerNum}">${markerNum}</option>`;
        // }
        // return optionsList;
        console.log("numTurns:", numTurns);
        if (numTurns <= 0) return null;
        const options = new Array(numTurns - 1).fill(null);
        console.log("options_ar:", options);
        return options.map((item, index) => {
            console.log("option #", index);
            return (
                <option key={index} value={index}>
                    {index}
                </option>
            );
        });
    };

    return (
        <div className="controls">
            <h3>
                numTurns:{numTurns} <br /> historicTurnIndex:{historicTurnIndex}
            </h3>
            {/* <button onPointerDown={randomizeEmpty}>RANDOMIZE EMPTY</button> */}
            <div className="control">
                <label htmlFor="rows-input">
                    {" "}
                    NUM ROWS:
                    <input
                    style={{fieldSizing:"content"}}
                        type="number"
                        // inputmode="numeric"
                        name="rows"
                        id="rows-input"
                        value={numRows}
                        min="4"
                        max="10"
                        step="1"
                        onChange={rowsInputListener}
                    />
                    &nbsp;
                </label>
            </div>

            <div className="control">
                <label htmlFor="show-targets-checkbox">
                    SHOW MOVE-TO SPOTS:
                    <input
                        type="checkbox"
                        onChange={(event) => {
                            setShowTargetSlots(event.target.checked);
                        }}
                        name="show-targets"
                        id="show-targets-checkbox"
                    />
                </label>
            </div>

            <div className="control">
                <label htmlFor="random-start-checkbox">
                    RANDOM EMPTY START HOLE:
                    <input
                        type="checkbox"
                        onChange={toggleRandomStartSlot}
                        name="random-start"
                        id="random-start-checkbox"
                    />
                </label>
            </div>

            <div className="control history">
                <span>
                    {historicTurnIndex > -1 ? historicTurnIndex : numTurns - 1}
                </span>
                <input
                    className="slider"
                    type="range"
                    min="0"
                    max={numTurns - 1}
                    value={
                        historicTurnIndex > -1
                            ? historicTurnIndex
                            : numTurns - 1
                    }
                    // id="moves-slider"
                    onChange={(event) =>
                        setHistoricTurnIndex(Number(event.target.value))
                    }
                    list="markers"
                />
                <datalist id="markers">{getMarkerDatalistOptions()}</datalist>
            </div>
            <br />
            <div className="control">
                <button onPointerDown={forceUpdate}>RESTART</button>
            </div>
        </div>
    );
};

export default Controls;
