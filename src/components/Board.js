import { useEffect, useState, useRef } from "react";
import React from "react";
// import Slot from "./Slot.js";

function addDown(n) {
    // Like factorial but with addition
    if (n === 0) {
        // stop subtracting when we reach zero
        return 0;
    } else {
        // Recursive case: n! = n + (n-1)!
        return n + addDown(n - 1);
    }
}

const rows = [];
let firstLoad = true;

const Board = ({
    numRows,
    randomStartSlotChecked,
    showTargetSlots,
    historicTurn,
    setNumTurns,
}) => {
    const [slots, setSlots] = useState([]);
    const [slotsChanged, setSlotsChanged] = useState(false);
    const [slotUnit, setSlotUnit] = useState(
        `calc(${5 / numRows} * var(--board-unit))`
    );
    const [boardHistory, setBoardHistory] = useState([]);
    const buildRowsFlag = useRef(true);

    // v Initialize board
    const buildSlots = () => {
        console.log("buildSlots()");
        const initSlots = [];
        const numSlots = addDown(numRows);
        const emptyStartSlotIndex = randomStartSlotChecked
            ? Math.floor(Math.random() * numSlots)
            : 4;
        for (let elementIndex = 0; elementIndex < numSlots; elementIndex++) {
            const peg = elementIndex !== emptyStartSlotIndex;
            initSlots[elementIndex] = {
                index: elementIndex,
                peg,
                selected: false,
                target: false,
            };
        }
        console.log("initSlots.length:", initSlots.length);
        setSlots(initSlots);

        if (firstLoad) {
            firstLoad = false;
            saveCurrentMove(initSlots);
        }
        setSlotsChanged(!slotsChanged);
    };

    const buildRows = () => {
        // rows is an array of arrays, each representing a row containing indices of slots in that row
        const slotsCopy = [...slots];
        for (let r = 0; r < numRows; r++) {
            rows[r] = [];
            const rowLength = r + 1;
            const firstIndex = addDown(r);
            for (
                let slotIndex = firstIndex;
                slotIndex < firstIndex + rowLength;
                slotIndex++
            ) {
                // this is easier overall than the deleted getColum(slot) and getRow(slot) which
                slotsCopy[slotIndex].myColumn = rows[r].length;
                slotsCopy[slotIndex].myRow = r;
                rows[r].push(slotIndex);
            }
        }
        setSlots(slotsCopy);
    };

    // ^ Initialize board

    const setSlotCssUnits = () => {
        // v This 'formula' is based on original css element sizes -> maybe 1 board-unit was 5 vmin?
        // anyhow, this works now. v
        const relativeUnit = 5 / numRows;
        setSlotUnit(`calc(${relativeUnit} * var(--board-unit))`);
    };

    useEffect(() => {
        console.log("useEffect buildSlots");
        setSlotCssUnits();
        buildSlots();
    }, [numRows]);

    useEffect(() => {
        // Feels like a hacky way to make sure slots is already built, and set, before calling buildRows()
        // And making sure buildRows() only happens once
        if (buildRowsFlag.current && slots.length > 0) {
            console.log("useEffect buildRows");
            buildRows();
            buildRowsFlag.current = false;
        }
    }, [slotsChanged]);

    useEffect(() => {
        console.log("useEffect showTurn()");
        if (historicTurn >= 0) showTurn(historicTurn);
    }, [historicTurn]);

    useEffect(() => {
        console.log("boardHistory:", boardHistory);
    }, [boardHistory]);

    // Move History ----------------------------
    const saveCurrentMove = (slots) => {
        console.log("saveCurrentMove()");
        const currentMove = JSON.parse(JSON.stringify(slots));
        setNumTurns(boardHistory.length);
        setBoardHistory((prevHistory) => {
            console.log("prevHistory:", prevHistory);
            return [...prevHistory, currentMove];
        });
        console.log(
            "saveCurrentMove(), boardHistory.length:",
            boardHistory.length
        );
    };

    const showTurn = (turnIndex) => {
        // load board layout
        console.log("showTurn(", turnIndex, ")");
        setSlots(boardHistory[turnIndex]);
    };

    // ^ / Move History

    const selectSlot = (index) => {
        const slotsCopy = [...slots];
        const slot = slotsCopy[index];

        if (slot.peg) {
            // Clear targets
            for (const slot of slotsCopy) {
                slot.target = false;
            }
            for (const s of slotsCopy) {
                // deselect all slots
                // toggle selected for clicked slot
                s.selected = s === slot ? !slot.selected : false;
            }
            if (slot.selected) hilightPegTargetSlots(slot);
            setSlots(slotsCopy);
        } else if (slot.target) {
            // move peg from selected slot to here
            const selectedSlot = slots.find((s) => s.selected);
            if (selectedSlot) {
                selectedSlot.peg = false;
                slot.peg = true;
                getSlotBetween(selectedSlot, slot).peg = false;
            }
            // Clear targets
            for (const slot of slotsCopy) {
                slot.target = false;
            }
            setSlots(slotsCopy);
            saveCurrentMove(slotsCopy);
        }
    };

    // v Utility stuff v
    const getSlotByRowColumn = (r, c) => {
        const slot = slots.find(
            (slot) => slot.myColumn === c && slot.myRow === r
        );
        return slot;
    };

    const getSlotBetween = (slotA, slotB) => {
        const c = (slotA.myColumn + slotB.myColumn) / 2;
        const r = (slotA.myRow + slotB.myRow) / 2;
        const slotBetween = getSlotByRowColumn(r, c);
        return slotBetween;
    };

    const getPegTargetSlots = (slot) => {
        // find slots 2 spaces away from slot in all directions
        const targetSlots = [];
        if (slot.peg) {
            const sr = slot.myRow,
                sc = slot.myColumn;
            for (let r = sr - 2; r < sr + 3; r += 2) {
                for (let c = sc - 2; c < sc + 3; c += 2) {
                    // Rule out above to right, self and below to left
                    if (
                        (r < sr && c > sc) ||
                        (r === sr && c === sc) ||
                        (r > sr && c < sc)
                    ) {
                        continue;
                    }
                    const potentialTarget = getSlotByRowColumn(r, c);

                    if (potentialTarget) {
                        // is there a peg between target and moving peg?
                        if (
                            !potentialTarget.peg &&
                            getSlotBetween(slot, potentialTarget).peg
                        ) {
                            targetSlots.push(potentialTarget);
                        }
                    }
                }
            }
        }
        return targetSlots;
    };

    const hilightPegTargetSlots = (fromSlot) => {
        const fairTargets = getPegTargetSlots(fromSlot);
        for (const slot of slots) {
            slot.target =
                fairTargets.find((target) => target === slot) !== undefined;
        }
    };

    return (
        <div className="board" style={{ "--slot-unit": slotUnit }}>
            {slots.map((slot, index) => {
                return (
                    <React.Fragment key={index}>
                        <div
                            className={`slot${slot.peg ? " peg" : ""}${
                                slot.selected ? " selected" : ""
                            }${
                                slot.target && showTargetSlots ? " target" : ""
                            }`}
                            onPointerDown={() => {
                                selectSlot(index);
                            }}
                        ></div>
                        {[0, 2, 5, 9, 14, 20, 27, 35, 44, 54].includes(
                            index
                        ) ? (
                            <br />
                        ) : (
                            ""
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};
export default Board;
