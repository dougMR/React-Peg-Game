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
const copyObj = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

let firstLoad = true;

const Board = ({
    numRows,
    randomStartSlotChecked,
    showTargetSlots,
    historicTurnIndex,
    setHistoricTurnIndex,
    setNumTurns,
}) => {
    // slots[] is the current board
    const [slots, setSlots] = useState([]);
    // slotUnit is sizing for css
    const [slotUnit, setSlotUnit] = useState(
        `calc(${5 / numRows} * var(--board-unit))`
    );
    // boardHistory is a record of slots from each turn
    const [boardHistory, setBoardHistory] = useState([]);
    //
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
        addColumnsAndRowsToSlots(initSlots);
        setSlots(initSlots);

        if (firstLoad) {
            firstLoad = false;
            saveCurrentMove(initSlots);
        }
    };

    const addColumnsAndRowsToSlots = (slots) => {
        console.log("addColumnsAndRowsToSlots()");
        // This makes changes directly to the slots provided in the argument

        // DMR 12/17/24 - ^ There were too many hoops previously.  This is more direct, and synchronous, fewer pitfalls.  In fact, this whole function could be folded into the buildSlots() function.

        // rows is an array of arrays, each representing a row containing indices of slots in that row
        const rows = [];
        for (let r = 0; r < numRows; r++) {
            rows[r] = [];
            const rowLength = r + 1;
            const firstIndex = addDown(r);
            for (
                let slotIndex = firstIndex;
                slotIndex < firstIndex + rowLength;
                slotIndex++
            ) {
                // this is easier overall than the deleted getColum(slot) and getRow(slot).  Better to just add column / row to each slot when board is first created
                slots[slotIndex].myColumn = rows[r].length;
                slots[slotIndex].myRow = r;
                rows[r].push(slotIndex);
            }
        }
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
        console.log(
            "useEffect historicTurnIndex changed to",
            historicTurnIndex,
            "."
        );
        // console.log('historicTurnIndex:',historicTurnIndex);
        // console.log('boardHistory:',boardHistory.length)
        // console.log('numTurns:',numTurns);
        if (historicTurnIndex >= 0) {
            showTurn(historicTurnIndex);
        }
    }, [historicTurnIndex]);

    // useEffect(() => {
    //     console.log("boardHistory:", boardHistory);
    // }, [boardHistory]);

    // Move History ----------------------------
    const saveCurrentMove = (currentSlots) => {
        console.log("  -- saveCurrentMove()");
        const currentMove = copyObj(currentSlots);
        const newBoardHistory = copyObj(boardHistory); //[...boardHistory];
        // trim boardHistory if historicTurnIndex is less than latest turn
        if (historicTurnIndex > 0)
            newBoardHistory.length = historicTurnIndex + 1;
        console.log("historicTurnIndex:", historicTurnIndex);
        console.log("newBoardHistory.length:", newBoardHistory.length);
        console.log(
            "currentMove === newBoardHistory[newBoardHistory.length-1]:",
            currentMove === newBoardHistory[newBoardHistory.length - 1]
        );
        console.log(
            "currentMove === currentSlots:",
            currentMove === currentSlots
        );
        setNumTurns(newBoardHistory.length + 1);
        setBoardHistory([...newBoardHistory, currentMove]);
        setHistoricTurnIndex(newBoardHistory.length);
    };

    const showTurn = (turnIndex) => {
        // const turnIndex = turnNum - 1;
        // load board layout
        console.log("showTurn(", turnIndex, ")");
        console.log("boardHistory.length:", boardHistory.length);
        // console.log('this turn: ',boardHistory[turnIndex])
        setSlots(copyObj(boardHistory[turnIndex]));
    };

    // ^ / Move History

    // v Select a Slot
    const selectSlot = (index) => {
        console.log("  -- selectSlot(", index, ")");
        const slotsCopy = [...slots]; //copyObj(slots);
        const slot = slotsCopy[index];
        // console.log("slot:", slot);
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
            if (slot.selected) {
                const fairTargets = getPegTargetSlots(slot);
                for (const s of slotsCopy) {
                    // hilight target slots
                    s.target =
                        fairTargets.find((target) => target === s) !==
                        undefined;
                }
            }
            setSlots(slotsCopy);
        } else if (slot.target) {
            // move peg from selected slot to here
            const selectedSlot = slotsCopy.find((s) => s.selected);
            console.log("selectedSlot:", selectedSlot.index);
            if (selectedSlot) {
                selectedSlot.peg = false;
                slot.peg = true;
                getSlotBetween(selectedSlot, slot).peg = false;
            }
            // Clear targets
            for (const slot of slotsCopy) {
                slot.target = false;
            }
            saveCurrentMove(slotsCopy);
            setSlots(slotsCopy);
        }
    };
    // ^ / Select a Slot

    // v Utility stuff v
    const getSlotByRowColumn = (r, c) => {
        const slot = slots.find(
            (slot) => slot.myColumn === c && slot.myRow === r
        );
        return slot;
    };

    const getSlotBetween = (slotA, slotB) => {
        // console.log('getSlotBetween()');
        // console.log('slotA:',slotA);
        // console.log('slotB:',slotB);
        const c = (slotA.myColumn + slotB.myColumn) / 2;
        const r = (slotA.myRow + slotB.myRow) / 2;
        // console.log('c,r:',c,r);
        const slotBetween = getSlotByRowColumn(r, c);
        // console.log('slotBetween:',slotBetween);
        return slotBetween;
    };

    const getPegTargetSlots = (slot) => {
        // find slots 2 spaces away from slot in all directions
        // console.log("getPegTargetSlots()");
        // console.log("from slot:", slot);
        const targetSlots = [];
        if (slot.peg) {
            const sr = slot.myRow,
                sc = slot.myColumn;
            // console.log("sc,sr:",sc,sr);
            for (let r = sr - 2; r < sr + 3; r += 2) {
                for (let c = sc - 2; c < sc + 3; c += 2) {
                    // Rule out above to right, self and below to left
                    // console.log("c,r:",c,r);
                    if (
                        (r < sr && c > sc) ||
                        (r === sr && c === sc) ||
                        (r > sr && c < sc)
                    ) {
                        // console.log("no.")
                        continue;
                    }
                    const potentialTarget = getSlotByRowColumn(r, c);
                    if (potentialTarget) {
                        // is there a peg between target and moving peg?

                        if (
                            !potentialTarget.peg &&
                            getSlotBetween(slot, potentialTarget).peg
                        ) {
                            // console.log("target:",potentialTarget);
                            targetSlots.push(potentialTarget);
                        }
                        //  else {
                        //     console.log("no.")
                        // }
                    }
                    //  else {
                    //     console.log("no.")
                    // }
                }
            }
        }
        // console.log('targetSlots:',targetSlots);
        return targetSlots;
    };

    // const getFairTargetSlots = (fromSlot) => {
    //     const fairTargets = getPegTargetSlots(fromSlot);
    //     for (const slot of slots) {
    //         // hilight target slots
    //         slot.target =
    //             fairTargets.find((target) => target === slot) !== undefined;
    //     }
    //     return fairTargets;
    // };

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
